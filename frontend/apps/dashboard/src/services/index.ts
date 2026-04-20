import {
  createUserService,
  createAuthService,
  createAttendanceService,
  ROLES,
} from "@cinemax/shared";

// Create singleton instances for the dashboard app
export const userService = createUserService("dashboard-app");
export const authService = createAuthService({
  namespace: "dashboard-app",
  allowedRoles: [ROLES.SUPER_ADMIN, ROLES.CINEMA_MANAGER, ROLES.STAFF],
});
export const attendanceService = createAttendanceService("dashboard-app");
