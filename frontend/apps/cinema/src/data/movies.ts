export type Movie = {
  id: string
  title: string
  genre: string[]
  duration: number
  rating: string
  score: number
  poster: string
  synopsis: string
  releaseDate: string
}

export const MOVIES: Movie[] = [
  {
    id: "m1",
    title: "Echoes of Tomorrow",
    genre: ["Sci-Fi", "Drama"],
    duration: 142,
    rating: "PG-13",
    score: 8.6,
    poster: "/posters/echoes-of-tomorrow.jpg",
    synopsis:
      "A physicist discovers a way to receive messages from her future self, but each revelation rewrites the present in ways she never imagined.",
    releaseDate: "2026-04-12",
  },
  {
    id: "m2",
    title: "The Silent Harbor",
    genre: ["Mystery", "Thriller"],
    duration: 118,
    rating: "R",
    score: 8.1,
    poster: "/posters/the-silent-harbor.jpg",
    synopsis:
      "When a small coastal town wakes to find all its boats gone, a retired detective is pulled into an investigation that unearths decades of secrets.",
    releaseDate: "2026-03-28",
  },
  {
    id: "m3",
    title: "Lanterns in the Rain",
    genre: ["Romance", "Drama"],
    duration: 109,
    rating: "PG",
    score: 7.9,
    poster: "/posters/lanterns-in-the-rain.jpg",
    synopsis:
      "Two strangers share an umbrella on a rainy Kyoto night and spend twelve hours walking the city before dawn forces them to part.",
    releaseDate: "2026-02-14",
  },
  {
    id: "m4",
    title: "Ironclad Horizon",
    genre: ["Action", "Adventure"],
    duration: 135,
    rating: "PG-13",
    score: 7.7,
    poster: "/posters/ironclad-horizon.jpg",
    synopsis:
      "A disgraced pilot leads a mismatched crew across a post-industrial desert in pursuit of the airship that stole her name.",
    releaseDate: "2026-05-02",
  },
  {
    id: "m5",
    title: "Paper Moon Diner",
    genre: ["Comedy", "Drama"],
    duration: 96,
    rating: "PG-13",
    score: 8.3,
    poster: "/posters/paper-moon-diner.jpg",
    synopsis:
      "A 24-hour diner becomes the unlikely stage for three strangers whose lives collide over a single endless shift.",
    releaseDate: "2026-01-21",
  },
  {
    id: "m6",
    title: "Aurora Protocol",
    genre: ["Action", "Sci-Fi"],
    duration: 128,
    rating: "PG-13",
    score: 8.0,
    poster: "/posters/aurora-protocol.jpg",
    synopsis:
      "An orbital engineer uncovers a shutdown sequence hidden inside the world's satellite grid and has six hours to stop it.",
    releaseDate: "2026-06-14",
  },
]

export const SHOWTIMES = ["10:30", "13:15", "16:00", "18:45", "21:30"]

export const SEAT_ROWS = ["A", "B", "C", "D", "E", "F", "G", "H"]
export const SEATS_PER_ROW = 10

// Pre-occupied seats (demo)
export const OCCUPIED_SEATS: Record<string, string[]> = {
  m1: ["A3", "A4", "C7", "D1", "D2", "F5", "F6", "G9"],
  m2: ["B2", "B3", "E4", "E5", "G1", "H8", "H9"],
  m3: ["A1", "C3", "C4", "D8", "F2", "H5"],
  m4: ["B5", "B6", "B7", "D4", "E9", "G3", "G4"],
  m5: ["A7", "A8", "C1", "C2", "E6", "F9", "H3"],
  m6: ["B1", "D5", "D6", "E1", "E2", "F7", "G8"],
}
