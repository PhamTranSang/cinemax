import Link from "next/link"
import { Button } from "@cinemax/ui"
import { Play, Ticket } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/hero-cinema.jpg')" }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" aria-hidden />

      <div className="relative mx-auto flex min-h-[560px] w-full max-w-7xl flex-col justify-end px-4 pb-16 pt-24 md:px-6 md:pb-24 md:pt-32">
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/40 px-3 py-1 text-xs font-medium backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Now showing in theaters
          </div>
          <h1 className="font-serif text-5xl font-semibold leading-tight tracking-tight text-balance md:text-6xl lg:text-7xl">
            Every story deserves the big screen.
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted-foreground md:text-lg text-pretty">
            Browse the latest releases, pick your seat, and step into a world designed for one reason only: to be watched together.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button size="lg" asChild>
              <Link href="/movies">
                <Ticket className="mr-2 h-4 w-4" />
                Book a ticket
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#now-showing">
                <Play className="mr-2 h-4 w-4" />
                Browse movies
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
