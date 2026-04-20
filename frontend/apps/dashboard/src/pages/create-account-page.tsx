import { useState } from "react";
import { Loader2, UserPlus, Copy, CheckCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
  useToast,
} from "@cinemax/ui";
import { ROLES, roleLabel, type Role, type User } from "@cinemax/shared";
import { userService } from "@/services";
import { useAuth } from "@/providers/auth-provider";

type CreatedInfo = { user: User; tempPassword: string };

export function CreateAccountPage() {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();

  const canCreateManager = currentUser?.role === ROLES.SUPER_ADMIN;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>(
    canCreateManager ? ROLES.CINEMA_MANAGER : ROLES.STAFF,
  );
  const [tempPassword, setTempPassword] = useState(generateTempPassword());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<CreatedInfo | null>(null);
  const [copied, setCopied] = useState(false);

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setUsername("");
    setEmail("");
    setRole(canCreateManager ? ROLES.CINEMA_MANAGER : ROLES.STAFF);
    setTempPassword(generateTempPassword());
    setError(null);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setError(null);
    setLoading(true);
    try {
      const u = await userService.createAccount(currentUser, {
        fullName: `${firstName.trim()} ${lastName.trim()}`.trim(),
        username: username.trim(),
        email: email.trim(),
        role,
        temporaryPassword: tempPassword,
      });
      setCreated({ user: u, tempPassword });
      toast("Account created", {
        description: `${u.fullName} (${roleLabel(u.role)})`,
      });
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const copyPassword = async () => {
    if (!created) return;
    await navigator.clipboard.writeText(created.tempPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            New account
          </CardTitle>
          <CardDescription>
            {canCreateManager
              ? "As Super Admin you can create Cinema Manager or Staff accounts. The user will be required to change their password at first login."
              : "As Cinema Manager you can create Staff accounts. The user will be required to change their password at first login."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {canCreateManager ? (
                      <SelectItem value={ROLES.CINEMA_MANAGER}>
                        Cinema manager
                      </SelectItem>
                    ) : null}
                    <SelectItem value={ROLES.STAFF}>Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="temp">Temporary password</Label>
                <div className="flex gap-2">
                  <Input
                    id="temp"
                    value={tempPassword}
                    onChange={(e) => setTempPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setTempPassword(generateTempPassword())}
                  >
                    Regenerate
                  </Button>
                </div>
              </div>
            </div>

            {error ? (
              <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            ) : null}

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create account"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-6">
        {created ? (
          <Card className="border-primary/40">
            <CardHeader>
              <CardTitle className="text-base">Account created</CardTitle>
              <CardDescription>
                Share these credentials with the new user privately.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Name</span>
                <span className="font-medium">{created.user.fullName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Username</span>
                <span className="font-mono">{created.user.username}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Role</span>
                <Badge variant="outline">{roleLabel(created.user.role)}</Badge>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground">
                  Temporary password
                </span>
                <div className="flex items-center gap-2">
                  <code className="rounded bg-muted px-2 py-1 font-mono text-xs">
                    {created.tempPassword}
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

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Access rules</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">Super Admin</span>{" "}
              can create Cinema Manager or Staff accounts.
            </p>
            <p>
              <span className="font-medium text-foreground">
                Cinema Manager
              </span>{" "}
              can create Staff accounts only.
            </p>
            <p>
              <span className="font-medium text-foreground">Staff</span> cannot
              create accounts. They can only clock in and view their daily
              tasks.
            </p>
          </CardContent>
        </Card>
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
