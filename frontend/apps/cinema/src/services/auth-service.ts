import { createAuthService, ROLES } from "@cinemax/shared";

// Create a singleton instance for the cinema app
export const authService = createAuthService({
  namespace: "cinema-app",
  allowedRoles: [ROLES.CUSTOMER],
});
