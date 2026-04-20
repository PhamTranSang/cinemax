"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { SiteNavbar } from "@/components/site-navbar"
import { SiteFooter } from "@/components/site-footer"
import { ProfileForm } from "@/components/settings/profile-form"
import { PasswordForm } from "@/components/settings/password-form"
import { useAuth } from "@/providers/auth-provider"

export default function SettingsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?redirect=/settings")
    }
  }, [loading, user, router])

  return (
    <main className="flex min-h-screen flex-col">
      <SiteNavbar />
      <section className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 md:px-6 md:py-16">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">Account settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your profile information and security.
          </p>
        </div>

        {loading || !user ? (
          <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">Loading...</div>
        ) : (
          <div className="flex flex-col gap-6">
            <ProfileForm />
            <PasswordForm />
          </div>
        )}
      </section>
      <SiteFooter />
    </main>
  )
}
