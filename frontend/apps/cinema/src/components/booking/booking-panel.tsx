"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, CreditCard, Loader2 } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Separator,
  useToast,
} from "@cinemax/ui";
import { SeatMap } from "./seat-map";
import { OCCUPIED_SEATS, SHOWTIMES, type Movie } from "@/data/movies";
import { useAuth } from "@/providers/auth-provider";

const SEAT_PRICE = 12;

function nextDates(count = 5) {
  const out: { iso: string; label: string; day: string }[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    out.push({
      iso: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
    });
  }
  return out;
}

export function BookingPanel({ movie }: Readonly<{ movie: Movie }>) {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const dates = useMemo(() => nextDates(), []);
  const [date, setDate] = useState(dates[0].iso);
  const [time, setTime] = useState(SHOWTIMES[2]);
  const [seats, setSeats] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const occupied = OCCUPIED_SEATS[movie.id] ?? [];

  const toggleSeat = (seat: string) => {
    setSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat],
    );
  };

  const total = seats.length * SEAT_PRICE;

  const handleBook = async () => {
    if (!user) {
      router.push(`/login?redirect=/movies/${movie.id}`);
      return;
    }
    if (seats.length === 0) {
      toast("Pick at least one seat", {
        description: "Tap a seat in the map above to continue.",
      });
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);
    toast("Booking confirmed", {
      description: `${movie.title} | ${date} at ${time} | Seats: ${seats.join(", ")}`,
    });
    setSeats([]);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-2xl">
            Choose your seats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SeatMap occupied={occupied} selected={seats} onToggle={toggleSeat} />
        </CardContent>
      </Card>

      <Card className="h-fit lg:sticky lg:top-20">
        <CardHeader>
          <CardTitle className="text-lg">Showtime</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              Date
            </span>
            <div className="grid grid-cols-5 gap-2">
              {dates.map((d) => (
                <button
                  key={d.iso}
                  type="button"
                  onClick={() => setDate(d.iso)}
                  className={`flex flex-col items-center rounded-md border px-2 py-2 text-xs transition-colors ${
                    date === d.iso
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  <span className="font-medium">{d.day}</span>
                  <span>{d.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              Time
            </span>
            <div className="flex flex-wrap gap-2">
              {SHOWTIMES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTime(t)}
                  className={`rounded-md border px-3 py-2 text-sm transition-colors ${
                    time === t
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <Separator />

          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Seats</span>
              <span className="font-medium">
                {seats.length ? seats.join(", ") : "None"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Price per seat</span>
              <span>${SEAT_PRICE}.00</span>
            </div>
            <div className="flex justify-between text-base font-semibold">
              <span>Total</span>
              <span>${total}.00</span>
            </div>
          </div>

          <Button size="lg" onClick={handleBook} disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing payment...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                {user ? "Pay & confirm" : "Sign in to book"}
              </>
            )}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Demo flow. No real payment is processed.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
