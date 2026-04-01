import { cache } from "react";

import { getSessionContext } from "@/lib/auth/session";

export const getAdminScope = cache(async () => {
  const session = await getSessionContext();
  const isSuperadmin = session.roles.includes("superadmin");
  const isBusinessAdmin = session.roles.includes("business_admin");
  const managedBusinessIds = session.assignedBusinesses.map((business) => business.id);

  return {
    session,
    isSuperadmin,
    isBusinessAdmin,
    managedBusinessIds
  };
});

export function canManageBusinessId(managedBusinessIds: string[], businessId: string) {
  return managedBusinessIds.includes(businessId);
}
