import { useEffect, useState, type SyntheticEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader2, Film } from "lucide-react";
import { Button, Input, Label, useToast } from "@cinemax/ui";
import { useAuth } from "@/providers/auth-provider";

export function LoginPage() {
  const { user, login, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from =
    (location.state as { from?: string } | null)?.from ?? "/overview";

  useEffect(() => {
    if (!authLoading && user && user.role !== "CUSTOMER") {
      if (user.mustChangePassword) {
        navigate("/first-login", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }
  }, [authLoading, user, navigate, from]);

  const onSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const u = await login(username.trim(), password);
      if (u.role === "CUSTOMER") {
        setError(
          "This account is not authorized to access the admin dashboard.",
        );
        return;
      }
      toast("Welcome back", { description: u.fullName || u.username });
      if (u.mustChangePassword) {
        navigate("/first-login", { replace: true });
      } else {
        navigate(from === "/" ? "/overview" : from, { replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Film className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-semibold tracking-tight">
              Cinemax Console
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign in to access the management console.
            </p>
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-4 rounded-xl border border-border/60 bg-card p-6 shadow-sm"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error ? (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          ) : null}

          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>
      </div>
    </main>
  );
}
