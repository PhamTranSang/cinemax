import Image from "next/image";
import { notFound } from "next/navigation";
import { Clock, Calendar, Star } from "lucide-react";
import { Badge } from "@cinemax/ui";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import { BookingPanel } from "@/components/booking/booking-panel";
import { MOVIES } from "@/data/movies";

export function generateStaticParams() {
  return MOVIES.map((m) => ({ id: m.id }));
}

export default async function MovieDetailPage({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params;
  const movie = MOVIES.find((m) => m.id === id);
  if (!movie) notFound();

  return (
    <main className="flex min-h-screen flex-col">
      <SiteNavbar />

      <section className="relative">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${movie.poster})` }}
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/90 to-background"
          aria-hidden
        />

        <div className="relative mx-auto grid w-full max-w-7xl gap-8 px-4 pb-12 pt-16 md:grid-cols-[280px_1fr] md:px-6 md:pb-16 md:pt-20">
          <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl border border-border/60 shadow-xl">
            <Image
              src={movie.poster}
              alt={`${movie.title} poster`}
              fill
              sizes="280px"
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col justify-end gap-4">
            <div className="flex flex-wrap gap-2">
              {movie.genre.map((g) => (
                <Badge key={g} variant="secondary">
                  {g}
                </Badge>
              ))}
            </div>
            <h1 className="font-serif text-4xl font-semibold tracking-tight text-balance md:text-5xl">
              {movie.title}
            </h1>
            <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-primary text-primary" />
                {movie.score.toFixed(1)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {movie.duration} minutes
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                Released{" "}
                {new Date(movie.releaseDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <Badge variant="outline">{movie.rating}</Badge>
            </div>
            <p className="max-w-2xl text-base text-muted-foreground leading-relaxed text-pretty">
              {movie.synopsis}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-10 md:px-6 md:py-16">
        <BookingPanel movie={movie} />
      </section>

      <SiteFooter />
    </main>
  );
}
