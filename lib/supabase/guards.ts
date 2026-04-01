import type { Role } from "@/lib/types/domain";

export function hasRole(roles: Role[], target: Role) {
  return roles.includes(target);
}

export function canAccessBusiness(roleSet: Role[], isAssignedBusinessAdmin: boolean) {
  return hasRole(roleSet, "superadmin") || (hasRole(roleSet, "business_admin") && isAssignedBusinessAdmin);
}
