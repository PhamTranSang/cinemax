import Link from "next/link";
import { Film } from "lucide-react";
import type { ReactNode } from "react";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: Readonly<AuthShellProps>) {
  return (
    <main className="grid min-h-screen md:grid-cols-2">
      <section className="relative hidden overflow-hidden md:block">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/hero-cinema.jpg')" }}
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/90"
          aria-hidden
        />
        <div className="relative flex h-full flex-col justify-between p-10">
          <Link href="/" className="flex items-center gap-2 self-start">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Film className="h-5 w-5" />
            </div>
            <span className="font-serif text-xl font-semibold">Cinemax</span>
          </Link>
          <blockquote className="max-w-md">
            <p className="font-serif text-2xl leading-snug text-balance">
              &ldquo;There are no wrong seats, only stories you haven&apos;t let
              yourself sit through yet.&rdquo;
            </p>
            <footer className="mt-4 text-sm text-muted-foreground">
              &mdash; Cinemax editorial
            </footer>
          </blockquote>
        </div>
      </section>

      <section className="flex items-center justify-center px-4 py-12 md:px-10">
        <div className="w-full max-w-md">
          <div className="mb-8 flex flex-col gap-2">
            <Link href="/" className="mb-4 flex items-center gap-2 md:hidden">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Film className="h-4 w-4" />
              </div>
              <span className="font-serif text-lg font-semibold">Cinemax</span>
            </Link>
            <h1 className="font-serif text-3xl font-semibold tracking-tight">
              {title}
            </h1>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>

          {children}

          {footer ? (
            <div className="mt-6 text-center text-sm text-muted-foreground">
              {footer}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
