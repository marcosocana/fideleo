import { businesses as demoBusinesses } from "@/lib/data/demo";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export interface SelectOption {
  value: string;
  label: string;
}

export async function getBusinessOptions(): Promise<SelectOption[]> {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return demoBusinesses.map((business) => ({ value: business.id, label: business.name }));
  }

  const { data } = await supabase.from("businesses").select("id, name").order("name");

  if (!data?.length) {
    return demoBusinesses.map((business) => ({ value: business.id, label: business.name }));
  }

  return data.map((business) => ({ value: business.id, label: business.name }));
}
