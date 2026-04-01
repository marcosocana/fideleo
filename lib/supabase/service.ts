import { businesses, customers, rewards, superadminKpis } from "@/lib/data/demo";

export async function getDashboardSnapshot() {
  return {
    kpis: superadminKpis,
    businesses,
    customers,
    rewards
  };
}
