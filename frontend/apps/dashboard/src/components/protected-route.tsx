import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import type { Role } from "@cinemax/shared";
import { useAuth } from "@/providers/auth-provider";

type ProtectedRouteProps = {
  children: ReactNode;
  allow?: Role[];
};

export function ProtectedRoute({
  children,
  allow,
}: Readonly<ProtectedRouteProps>) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (user.role === "CUSTOMER") {
    return <Navigate to="/login" replace />;
  }

  if (user.mustChangePassword && location.pathname !== "/first-login") {
    return <Navigate to="/first-login" replace />;
  }

  if (allow && !allow.includes(user.role)) {
    return <Navigate to="/attendance" replace />;
  }

  return <>{children}</>;
}
