/**
 * Role hierarchy matches the backend Spring Boot authority model.
 * - SUPER_ADMIN: Full system access. Can create cinema managers.
 * - CINEMA_MANAGER: Manages a cinema branch. Can create staff.
 * - STAFF: Timekeeping and daily task write-only access in the dashboard.
 * - CUSTOMER: End-user buying tickets in the Cinema app.
 */
export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  CINEMA_MANAGER: "CINEMA_MANAGER",
  STAFF: "STAFF",
  CUSTOMER: "CUSTOMER",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

/** Roles allowed to sign into the admin Dashboard app. */
export const DASHBOARD_ROLES: Role[] = [
  ROLES.SUPER_ADMIN,
  ROLES.CINEMA_MANAGER,
  ROLES.STAFF,
];

/** Roles allowed to sign into the Cinema (customer) app. */
export const CINEMA_APP_ROLES: Role[] = [ROLES.CUSTOMER];

/** Which role can create which target role. */
export const ROLE_CREATION_MATRIX: Record<Role, Role[]> = {
  SUPER_ADMIN: [ROLES.CINEMA_MANAGER, ROLES.STAFF],
  CINEMA_MANAGER: [ROLES.STAFF],
  STAFF: [],
  CUSTOMER: [],
};

/** Which role can reset password for which target role. */
export const PASSWORD_RESET_MATRIX: Record<Role, Role[]> = {
  SUPER_ADMIN: [ROLES.CINEMA_MANAGER, ROLES.STAFF],
  CINEMA_MANAGER: [ROLES.STAFF],
  STAFF: [],
  CUSTOMER: [],
};

export function canCreateRole(actor: Role, target: Role): boolean {
  return ROLE_CREATION_MATRIX[actor]?.includes(target) ?? false;
}

export function canResetPasswordFor(actor: Role, target: Role): boolean {
  return PASSWORD_RESET_MATRIX[actor]?.includes(target) ?? false;
}

export function roleLabel(role: Role): string {
  switch (role) {
    case ROLES.SUPER_ADMIN:
      return "Super Admin";
    case ROLES.CINEMA_MANAGER:
      return "Cinema Manager";
    case ROLES.STAFF:
      return "Staff";
    case ROLES.CUSTOMER:
      return "Customer";
  }
}
