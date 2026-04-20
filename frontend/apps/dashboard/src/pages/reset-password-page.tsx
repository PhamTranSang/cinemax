import { useEffect, useMemo, useState } from "react";
import { KeyRound, Loader2, Search, Copy, CheckCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Input,
  Label,
  Badge,
  useToast,
} from "@cinemax/ui";
import { roleLabel, ROLES, type User } from "@cinemax/shared";
import { userService, authService } from "@/services";
import { useAuth } from "@/providers/auth-provider";

export function ResetPasswordPage() {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<User | null>(null);
  const [tempPassword, setTempPassword] = useState(generateTempPassword());
  const [submitting, setSubmitting] = useState(false);
  const [lastReset, setLastReset] = useState<{
    user: User;
    password: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    userService.listUsers().then((list) => {
      setUsers(list);
      setLoading(false);
    });
  }, []);

  // Only show accounts this user is allowed to reset:
  // - SUPER_ADMIN: can reset CINEMA_MANAGER and STAFF
  // - CINEMA_MANAGER: can reset STAFF only
  const resettable = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === ROLES.SUPER_ADMIN) {
      return users.filter(
        (u) => u.role === ROLES.CINEMA_MANAGER || u.role === ROLES.STAFF,
      );
    }
    if (currentUser.role === ROLES.CINEMA_MANAGER) {
      return users.filter((u) => u.role === ROLES.STAFF);
    }
    return [];
  }, [currentUser, users]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return resettable;
    return resettable.filter(
      (u) =>
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.fullName.toLowerCase().includes(q),
    );
  }, [resettable, search]);

  const onReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !selected) return;
    setSubmitting(true);
    try {
      await userService.resetPassword(currentUser, {
        targetUserId: selected.id,
        temporaryPassword: tempPassword,
      });
      toast("Password reset", {
        description: `${selected.fullName} will be asked to change it at next sign in.`,
      });
      setLastReset({ user: selected, password: tempPassword });
      setSelected(null);
      setTempPassword(generateTempPassword());
    } catch (err) {
      toast.error("Reset failed", {
        description: err instanceof Error ? err.message : "Try again",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const copyPassword = async () => {
    if (!lastReset) return;
    await navigator.clipboard.writeText(lastReset.password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5" />
            Reset account password
          </CardTitle>
          <CardDescription>
            Pick an account to generate a new temporary password. The user will
            be required to change it on next sign in.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, username..."
              className="pl-9"
            />
          </div>

          <div className="max-h-[420px] overflow-y-auto rounded-md border border-border/60">
            {loading ? (
              <div className="p-6 text-sm text-muted-foreground">
                Loading accounts...
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-6 text-sm text-muted-foreground">
                No accounts available to reset.
              </div>
            ) : (
              <ul className="divide-y divide-border/60">
                {filtered.map((u) => {
                  const isSelected = selected?.id === u.id;
                  return (
                    <li key={u.id}>
                      <button
                        type="button"
                        onClick={() => setSelected(u)}
                        className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors ${
                          isSelected ? "bg-primary/10" : "hover:bg-card"
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {u.fullName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            @{u.username} &middot; {u.email}
                          </span>
                        </div>
                        <Badge
                          variant="outline"
                          className="shrink-0 text-[10px]"
                        >
                          {roleLabel(u.role)}
                        </Badge>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-6">
        <Card className={selected ? "border-primary/40" : undefined}>
          <CardHeader>
            <CardTitle className="text-base">
              {selected
                ? `Reset password for ${selected.fullName}`
                : "Select an account"}
            </CardTitle>
            <CardDescription>
              {selected
                ? "Share the new temporary password with the user. They will change it on next login."
                : "Pick a user from the list on the left."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onReset} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="temp">Temporary password</Label>
                <div className="flex gap-2">
                  <Input
                    id="temp"
                    value={tempPassword}
                    onChange={(e) => setTempPassword(e.target.value)}
                    disabled={!selected}
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setTempPassword(generateTempPassword())}
                    disabled={!selected}
                  >
                    Regenerate
                  </Button>
                </div>
              </div>
              <Button type="submit" disabled={!selected || submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  "Reset password"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {lastReset ? (
          <Card className="border-primary/40">
            <CardHeader>
              <CardTitle className="text-base">Last reset</CardTitle>
              <CardDescription>
                These credentials won&apos;t be shown again. Copy them now.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">User</span>
                <span className="font-medium">{lastReset.user.fullName}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground">New password</span>
                <div className="flex items-center gap-2">
                  <code className="rounded bg-muted px-2 py-1 font-mono text-xs">
                    {lastReset.password}
                  </code>
                  <Button size="sm" variant="ghost" onClick={copyPassword}>
                    {copied ? (
                      <CheckCheck className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}

function generateTempPassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < 10; i++)
    out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}
