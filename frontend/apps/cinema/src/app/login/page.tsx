import Link from "next/link"
import { Suspense } from "react"
import { AuthShell } from "@/components/auth/auth-shell"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to book tickets, manage your profile, and revisit your past sessions."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-foreground hover:underline">
            Create one
          </Link>
        </>
      }
    >
      <Suspense fallback={<div className="h-32 animate-pulse rounded-md bg-muted" />}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  )
}
