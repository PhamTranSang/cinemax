import { SiteNavbar } from "@/components/site-navbar"
import { SiteFooter } from "@/components/site-footer"
import { HeroSection } from "@/components/home/hero-section"
import { FeatureStrip } from "@/components/home/feature-strip"
import { MoviesGrid } from "@/components/movies/movies-grid"

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      <SiteNavbar />
      <HeroSection />
      <FeatureStrip />
      <MoviesGrid
        id="now-showing"
        title="Now showing"
        subtitle="Handpicked releases you can book tonight."
      />
      <SiteFooter />
    </main>
  )
}
