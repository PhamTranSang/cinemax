import { useEffect, useState } from "react";
import { Users, UserPlus, Shield, TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge,
} from "@cinemax/ui";
import { roleLabel, type UserStats, type User } from "@cinemax/shared";
import { userService } from "@/services";

export function OverviewPage() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [recent, setRecent] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([userService.getStats(), userService.listUsers()])
      .then(([s, users]) => {
        setStats(s);
        setRecent(
          [...users]
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            )
            .slice(0, 6),
        );
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return (
      <div className="text-sm text-muted-foreground">Loading overview...</div>
    );
  }

  const statCards = [
    {
      label: "Total users",
      value: stats.total,
      icon: Users,
      hint: "All roles combined",
    },
    {
      label: "New this week",
      value: stats.newThisWeek,
      icon: UserPlus,
      hint: "Past 7 days",
    },
    {
      label: "New this month",
      value: stats.newThisMonth,
      icon: TrendingUp,
      hint: "Current month",
    },
    {
      label: "New this quarter",
      value: stats.newThisQuarter,
      icon: Shield,
      hint: "Current quarter",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {s.label}
              </CardTitle>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-serif text-3xl font-semibold">
                {s.value.toLocaleString()}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{s.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        <Card>
          <CardHeader>
            <CardTitle>Users by role</CardTitle>
            <CardDescription>
              How your user base is distributed across account types.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {(
              Object.entries(stats.byRole) as [
                keyof typeof stats.byRole,
                number,
              ][]
            ).map(([role, count]) => {
              const percent =
                stats.total === 0 ? 0 : Math.round((count / stats.total) * 100);
              return (
                <div key={role} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{roleLabel(role)}</span>
                    <span className="text-muted-foreground">
                      {count.toLocaleString()} ({percent}%)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recently created</CardTitle>
            <CardDescription>
              The most recent accounts across the system.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {recent.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{u.fullName}</span>
                  <span className="text-xs text-muted-foreground">
                    @{u.username}
                  </span>
                </div>
                <Badge variant="outline" className="text-[10px]">
                  {roleLabel(u.role)}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
