import { SiteNavbar } from "@/components/site-navbar"
import { SiteFooter } from "@/components/site-footer"
import { MoviesGrid } from "@/components/movies/movies-grid"

export default function MoviesPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <SiteNavbar />
      <div className="mx-auto w-full max-w-7xl px-4 pt-10 md:px-6 md:pt-16">
        <h1 className="font-serif text-4xl font-semibold tracking-tight md:text-5xl">All movies</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Every title currently in theaters. Tap any poster to choose your showtime and seat.
        </p>
      </div>
      <MoviesGrid title="" />
      <SiteFooter />
    </main>
  )
}
