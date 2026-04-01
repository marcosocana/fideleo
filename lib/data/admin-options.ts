import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export interface SelectOption {
  value: string;
  label: string;
}

export async function getBusinessOptions(): Promise<SelectOption[]> {
  const supabase = getSupabaseAdminClient() ?? (await getSupabaseServerClient());

  if (!supabase) {
    return [];
  }

  const { data } = await supabase.from("businesses").select("id, name").order("name");
  return (data ?? []).map((business) => ({ value: business.id, label: business.name }));
}
