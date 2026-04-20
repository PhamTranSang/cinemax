import { Armchair, CreditCard, Popcorn, Clapperboard } from "lucide-react"

const FEATURES = [
  {
    icon: Clapperboard,
    title: "Dolby Atmos halls",
    description: "Sound that moves around you, all in sync with the screen.",
  },
  {
    icon: Armchair,
    title: "Recliner seating",
    description: "Choose your row, lean back, and settle in for the show.",
  },
  {
    icon: Popcorn,
    title: "Fresh concessions",
    description: "Order snacks to your seat before the trailers even start.",
  },
  {
    icon: CreditCard,
    title: "Instant checkout",
    description: "Pay in a few seconds and get your ticket in your inbox.",
  },
]

export function FeatureStrip() {
  return (
    <section className="border-y border-border/60 bg-card/30">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-6 px-4 py-12 md:grid-cols-4 md:px-6">
        {FEATURES.map((f) => (
          <div key={f.title} className="flex flex-col gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-semibold">{f.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
