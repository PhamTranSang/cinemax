import { Outlet, useLocation } from "react-router-dom"
import { Sidebar } from "./sidebar"
import { Topbar } from "./topbar"
import { useAuth } from "@/providers/auth-provider"

const TITLES: Record<string, string> = {
  "/overview": "Overview",
  "/users": "Users",
  "/accounts/new": "Create account",
  "/accounts/reset-password": "Reset password",
  "/attendance": "Attendance",
}

export function DashboardLayout() {
  const { user } = useAuth()
  const location = useLocation()
  const title = TITLES[location.pathname] ?? "Dashboard"

  if (!user) return null

  return (
    <div className="flex min-h-screen">
      <Sidebar role={user.role} />
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar title={title} />
        <main className="flex-1 overflow-x-hidden px-4 py-6 md:px-8 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
