import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export interface SelectOption {
  value: string;
  label: string;
}

export async function getBusinessOptions(ids?: string[]): Promise<SelectOption[]> {
  const supabase = getSupabaseAdminClient() ?? (await getSupabaseServerClient());

  if (!supabase) {
    return [];
  }

  let query = supabase.from("businesses").select("id, name").order("name");

  if (ids?.length) {
    query = query.in("id", ids);
  }

  const { data } = await query;
  return (data ?? []).map((business) => ({ value: business.id, label: business.name }));
}
