import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "@/pages/login-page";
import { FirstLoginPage } from "@/pages/first-login-page";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ProtectedRoute } from "@/components/protected-route";
import { OverviewPage } from "@/pages/overview-page";
import { UsersPage } from "@/pages/users-page";
import { CreateAccountPage } from "@/pages/create-account-page";
import { ResetPasswordPage } from "@/pages/reset-password-page";
import { AttendancePage } from "@/pages/attendance-page";
import { ROLES } from "@cinemax/shared";

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/first-login" element={<FirstLoginPage />} />

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/overview" replace />} />
        <Route
          path="/overview"
          element={
            <ProtectedRoute allow={[ROLES.SUPER_ADMIN, ROLES.CINEMA_MANAGER]}>
              <OverviewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute allow={[ROLES.SUPER_ADMIN, ROLES.CINEMA_MANAGER]}>
              <UsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/accounts/new"
          element={
            <ProtectedRoute allow={[ROLES.SUPER_ADMIN, ROLES.CINEMA_MANAGER]}>
              <CreateAccountPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/accounts/reset-password"
          element={
            <ProtectedRoute allow={[ROLES.SUPER_ADMIN, ROLES.CINEMA_MANAGER]}>
              <ResetPasswordPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/attendance"
          element={
            <ProtectedRoute
              allow={[ROLES.STAFF, ROLES.SUPER_ADMIN, ROLES.CINEMA_MANAGER]}
            >
              <AttendancePage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
