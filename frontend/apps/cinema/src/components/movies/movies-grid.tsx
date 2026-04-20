import { MOVIES } from "@/data/movies"
import { MovieCard } from "./movie-card"

export function MoviesGrid({ title, subtitle, id }: { title: string; subtitle?: string; id?: string }) {
  return (
    <section id={id} className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6 md:py-20">
      <div className="mb-8 flex flex-col gap-2">
        <h2 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
        {subtitle ? <p className="text-muted-foreground">{subtitle}</p> : null}
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-6">
        {MOVIES.map((m) => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </div>
    </section>
  )
}
