"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { canManageBusinessId, getAdminScope } from "@/lib/auth/admin";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { adminUserSchema } from "@/lib/validations/user";

export interface UserFormState {
  error?: string;
  success?: boolean;
  userId?: string;
}

function toUserPayload(formData: FormData) {
  return adminUserSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    role: formData.get("role"),
    businessId: formData.get("businessId") || undefined,
    password: formData.get("password") || undefined
  });
}

export async function createUserAction(_: UserFormState, formData: FormData): Promise<UserFormState> {
  const parsed = toUserPayload(formData);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Revisa el formulario." };
  }

  const { session, isSuperadmin, isBusinessAdmin, managedBusinessIds } = await getAdminScope();

  if (!isSuperadmin && !isBusinessAdmin) {
    return { error: "No tienes permisos para crear usuarios." };
  }

  if (!isSuperadmin && parsed.data.role === "superadmin") {
    return { error: "Solo un superadmin puede crear otro superadmin." };
  }

  if (parsed.data.role !== "superadmin" && (!parsed.data.businessId || !canManageBusinessId(managedBusinessIds, parsed.data.businessId))) {
    return { error: "No puedes asignar usuarios a ese negocio." };
  }

  const adminClient = getSupabaseAdminClient();

  if (!adminClient) {
    return { success: true };
  }

  const tempPassword = parsed.data.password ?? "ChangeMe123!";
  const { data: createdUser, error: createError } = await adminClient.auth.admin.createUser({
    email: parsed.data.email,
    password: tempPassword,
    email_confirm: true,
    user_metadata: {
      first_name: parsed.data.firstName,
      last_name: parsed.data.lastName,
      phone: parsed.data.phone,
      role: parsed.data.role
    }
  });

  if (createError || !createdUser.user) {
    return { error: createError?.message ?? "No hemos podido crear el usuario." };
  }

  await adminClient
    .from("profiles")
    .update({
      first_name: parsed.data.firstName,
      last_name: parsed.data.lastName,
      email: parsed.data.email,
      phone: parsed.data.phone ?? null,
      updated_at: new Date().toISOString()
    })
    .eq("id", createdUser.user.id);

  await adminClient.from("user_roles").upsert(
    {
      user_id: createdUser.user.id,
      role: parsed.data.role
    },
    { onConflict: "user_id,role" }
  );

  if (parsed.data.businessId) {
    if (parsed.data.role === "customer") {
      await adminClient.from("business_memberships").upsert(
        {
          business_id: parsed.data.businessId,
          user_id: createdUser.user.id,
          joined_at: new Date().toISOString(),
          last_activity_at: new Date().toISOString()
        },
        { onConflict: "business_id,user_id" }
      );
    }

    if (parsed.data.role === "business_admin") {
      await adminClient.from("business_admin_assignments").upsert(
        {
          business_id: parsed.data.businessId,
          user_id: createdUser.user.id
        },
        { onConflict: "business_id,user_id" }
      );
    }
  }

  revalidatePath("/admin/users");
  return { success: true, userId: createdUser.user.id };
}

export async function updateUserAction(userId: string, _: UserFormState, formData: FormData): Promise<UserFormState> {
  const parsed = toUserPayload(formData);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Revisa el formulario." };
  }

  const { session, isSuperadmin, isBusinessAdmin, managedBusinessIds } = await getAdminScope();

  if (!isSuperadmin && !isBusinessAdmin) {
    return { error: "No tienes permisos para editar usuarios." };
  }

  const adminClient = getSupabaseAdminClient();
  const supabase = await getSupabaseServerClient();

  if (!adminClient || !supabase) {
    return { success: true, userId };
  }

  const [{ data: currentRoles }, { data: currentAssignments }, { data: currentMemberships }] = await Promise.all([
    supabase.from("user_roles").select("role").eq("user_id", userId),
    supabase.from("business_admin_assignments").select("business_id").eq("user_id", userId),
    supabase.from("business_memberships").select("business_id").eq("user_id", userId)
  ]);

  const currentManagedBusinessId = currentAssignments?.[0]?.business_id ?? currentMemberships?.[0]?.business_id ?? null;
  const currentRoleSet = (currentRoles ?? []).map((item) => item.role);

  if (!isSuperadmin) {
    if (currentRoleSet.includes("superadmin")) {
      return { error: "No puedes editar un superadmin." };
    }

    if (currentManagedBusinessId && !canManageBusinessId(managedBusinessIds, currentManagedBusinessId)) {
      return { error: "No puedes editar usuarios de otro negocio." };
    }

    if (parsed.data.role === "superadmin") {
      return { error: "Solo un superadmin puede asignar ese rol." };
    }

    if (!parsed.data.businessId || !canManageBusinessId(managedBusinessIds, parsed.data.businessId)) {
      return { error: "No puedes asignar usuarios a ese negocio." };
    }
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      first_name: parsed.data.firstName,
      last_name: parsed.data.lastName,
      email: parsed.data.email,
      phone: parsed.data.phone ?? null,
      updated_at: new Date().toISOString()
    })
    .eq("id", userId);

  if (profileError) {
    return { error: profileError.message };
  }

  await adminClient.auth.admin.updateUserById(userId, {
    email: parsed.data.email,
    password: parsed.data.password || undefined,
    user_metadata: {
      first_name: parsed.data.firstName,
      last_name: parsed.data.lastName,
      phone: parsed.data.phone,
      role: parsed.data.role
    }
  });

  const { error: roleError } = await supabase.from("user_roles").delete().eq("user_id", userId);

  if (roleError) {
    return { error: roleError.message };
  }

  await supabase.from("user_roles").insert({
    user_id: userId,
    role: parsed.data.role
  });

  await supabase.from("business_memberships").delete().eq("user_id", userId);
  await supabase.from("business_admin_assignments").delete().eq("user_id", userId);

  if (parsed.data.businessId) {
    if (parsed.data.role === "customer") {
      await supabase.from("business_memberships").insert({
        business_id: parsed.data.businessId,
        user_id: userId,
        joined_at: new Date().toISOString(),
        last_activity_at: new Date().toISOString()
      });
    }

    if (parsed.data.role === "business_admin") {
      await supabase.from("business_admin_assignments").insert({
        business_id: parsed.data.businessId,
        user_id: userId
      });
    }
  }

  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${userId}`);
  return { success: true, userId };
}

export async function deleteUserAction(userId: string): Promise<void> {
  const { isSuperadmin, isBusinessAdmin, managedBusinessIds } = await getAdminScope();

  if (!isSuperadmin && !isBusinessAdmin) {
    return;
  }

  const adminClient = getSupabaseAdminClient();
  const supabase = await getSupabaseServerClient();

  if (supabase) {
    if (!isSuperadmin) {
      const [{ data: currentRoles }, { data: currentAssignments }, { data: currentMemberships }] = await Promise.all([
        supabase.from("user_roles").select("role").eq("user_id", userId),
        supabase.from("business_admin_assignments").select("business_id").eq("user_id", userId),
        supabase.from("business_memberships").select("business_id").eq("user_id", userId)
      ]);

      const currentManagedBusinessId = currentAssignments?.[0]?.business_id ?? currentMemberships?.[0]?.business_id ?? null;

      if ((currentRoles ?? []).some((item) => item.role === "superadmin")) {
        return;
      }

      if (currentManagedBusinessId && !canManageBusinessId(managedBusinessIds, currentManagedBusinessId)) {
        return;
      }
    }

    await supabase.from("business_memberships").delete().eq("user_id", userId);
    await supabase.from("business_admin_assignments").delete().eq("user_id", userId);
    await supabase.from("user_roles").delete().eq("user_id", userId);
    await supabase.from("profiles").delete().eq("id", userId);
  }

  if (adminClient) {
    await adminClient.auth.admin.deleteUser(userId);
  }

  revalidatePath("/admin/users");
  redirect("/admin/users");
}
