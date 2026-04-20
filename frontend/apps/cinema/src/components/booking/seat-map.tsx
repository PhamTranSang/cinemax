"use client"

import { cn } from "@cinemax/ui/lib/utils"
import { SEAT_ROWS, SEATS_PER_ROW } from "@/data/movies"

type SeatMapProps = {
  occupied: string[]
  selected: string[]
  onToggle: (seat: string) => void
}

export function SeatMap({ occupied, selected, onToggle }: SeatMapProps) {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-full max-w-xl">
        <div className="h-3 w-full rounded-full bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
        <p className="mt-2 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">Screen</p>
      </div>

      <div className="flex flex-col gap-2">
        {SEAT_ROWS.map((row) => (
          <div key={row} className="flex items-center gap-2">
            <span className="w-6 text-center text-xs font-medium text-muted-foreground">{row}</span>
            <div className="flex gap-1.5">
              {Array.from({ length: SEATS_PER_ROW }).map((_, i) => {
                const seatId = `${row}${i + 1}`
                const isOccupied = occupied.includes(seatId)
                const isSelected = selected.includes(seatId)
                return (
                  <button
                    key={seatId}
                    type="button"
                    disabled={isOccupied}
                    onClick={() => onToggle(seatId)}
                    aria-label={`Seat ${seatId} ${isOccupied ? "occupied" : isSelected ? "selected" : "available"}`}
                    className={cn(
                      "h-7 w-7 rounded-md border text-[10px] font-medium transition-all md:h-8 md:w-8",
                      isOccupied && "cursor-not-allowed border-transparent bg-muted text-muted-foreground/50",
                      !isOccupied && !isSelected && "border-border bg-card hover:border-primary hover:bg-primary/10",
                      isSelected && "border-primary bg-primary text-primary-foreground shadow-sm",
                    )}
                  >
                    {i + 1}
                  </button>
                )
              })}
            </div>
            <span className="w-6 text-center text-xs font-medium text-muted-foreground">{row}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-4 pt-2 text-xs text-muted-foreground">
        <Legend className="border-border bg-card" label="Available" />
        <Legend className="border-primary bg-primary" label="Selected" />
        <Legend className="border-transparent bg-muted" label="Occupied" />
      </div>
    </div>
  )
}

function Legend({ className, label }: { className: string; label: string }) {
  return (
    <span className="flex items-center gap-2">
      <span className={cn("h-4 w-4 rounded border", className)} />
      {label}
    </span>
  )
}
