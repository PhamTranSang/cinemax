"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Ticket } from "lucide-react"
import { Button, Card, CardContent } from "@cinemax/ui"
import { SiteNavbar } from "@/components/site-navbar"
import { SiteFooter } from "@/components/site-footer"
import { useAuth } from "@/providers/auth-provider"

export default function BookingsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?redirect=/bookings")
    }
  }, [loading, user, router])

  return (
    <main className="flex min-h-screen flex-col">
      <SiteNavbar />
      <section className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 md:px-6 md:py-16">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">My bookings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Every ticket you&apos;ve booked will land here.
          </p>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Ticket className="h-6 w-6" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-serif text-xl font-semibold">No bookings yet</p>
              <p className="max-w-sm text-sm text-muted-foreground">
                Browse what&apos;s showing and reserve your seat. Confirmed bookings from this device will appear here once the backend is wired in.
              </p>
            </div>
            <Button asChild>
              <Link href="/movies">Browse movies</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
      <SiteFooter />
    </main>
  )
}
