import Link from "next/link"
import { Film } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-card/30">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Film className="h-4 w-4" />
              </div>
              <span className="font-serif text-lg font-semibold">Cinemax</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Premium cinema experience. Book your seat, grab your snacks, and lose yourself in the story.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold">Movies</h4>
            <Link href="/movies" className="text-sm text-muted-foreground hover:text-foreground">Now showing</Link>
            <Link href="/movies" className="text-sm text-muted-foreground hover:text-foreground">Coming soon</Link>
            <Link href="/movies" className="text-sm text-muted-foreground hover:text-foreground">IMAX</Link>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold">Company</h4>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">About us</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Careers</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Contact</Link>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold">Support</h4>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Help center</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy</Link>
          </div>
        </div>

        <div className="mt-10 border-t border-border/60 pt-6 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Cinemax. Demo application.
        </div>
      </div>
    </footer>
  )
}
