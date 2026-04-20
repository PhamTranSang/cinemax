import { useEffect, useState } from "react";
import {
  Clock,
  LogIn,
  LogOut,
  ListChecks,
  Loader2,
  Sparkles,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Badge,
  useToast,
} from "@cinemax/ui";
import { type AttendanceRecord, type DailyTask } from "@cinemax/shared";
import { attendanceService } from "@/services";
import { useAuth } from "@/providers/auth-provider";

export function AttendancePage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [record, setRecord] = useState<AttendanceRecord | null>(null);
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [clocking, setClocking] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      attendanceService.getTodayRecord(user.id),
      attendanceService.listTodayTasks(user.id),
    ])
      .then(([r, ts]) => {
        setRecord(r);
        setTasks(ts);
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return null;

  const handleClockIn = async () => {
    setClocking(true);
    try {
      const r = await attendanceService.checkIn(user.id);
      setRecord(r);
      toast("Clocked in", {
        description: `Welcome, ${user.fullName.split(" ")[0]}.`,
      });
    } catch (err) {
      toast.error("Could not clock in", {
        description: err instanceof Error ? err.message : "Try again",
      });
    } finally {
      setClocking(false);
    }
  };

  const handleClockOut = async () => {
    setClocking(true);
    try {
      const r = await attendanceService.checkOut(user.id);
      setRecord(r);
      toast("Clocked out", { description: "Have a good one." });
    } catch (err) {
      toast.error("Could not clock out", {
        description: err instanceof Error ? err.message : "Try again",
      });
    } finally {
      setClocking(false);
    }
  };

  const toggleTask = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    const newStatus = task.status === "DONE" ? "PENDING" : "DONE";
    const updated = await attendanceService.setTaskStatus(taskId, newStatus);
    setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
  };

  const done = tasks.filter((t) => t.status === "DONE").length;
  const total = tasks.length;
  const progress = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Today
          </CardTitle>
          <CardDescription>
            {now.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="flex flex-col items-center gap-1 py-6">
            <span className="font-serif text-5xl font-semibold tabular-nums">
              {now.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </span>
            <span className="text-sm text-muted-foreground">Local time</span>
          </div>

          {loading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading attendance...
            </div>
          ) : (
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Clock in</span>
                <span className="font-medium">
                  {record?.checkInAt
                    ? new Date(record.checkInAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Not yet"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Clock out</span>
                <span className="font-medium">
                  {record?.checkOutAt
                    ? new Date(record.checkOutAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Not yet"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                {!record?.checkInAt ? (
                  <Badge variant="outline">Not started</Badge>
                ) : record.checkOutAt ? (
                  <Badge className="bg-muted text-foreground hover:bg-muted">
                    Done
                  </Badge>
                ) : (
                  <Badge className="bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/20">
                    On shift
                  </Badge>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            {!record?.checkInAt ? (
              <Button
                onClick={handleClockIn}
                disabled={clocking || loading}
                size="lg"
              >
                {clocking ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <LogIn className="mr-2 h-4 w-4" />
                )}
                Clock in
              </Button>
            ) : !record.checkOutAt ? (
              <Button
                onClick={handleClockOut}
                disabled={clocking}
                size="lg"
                variant="outline"
              >
                {clocking ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="mr-2 h-4 w-4" />
                )}
                Clock out
              </Button>
            ) : (
              <Button disabled size="lg" variant="outline">
                <Sparkles className="mr-2 h-4 w-4" />
                Shift complete
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListChecks className="h-5 w-5" />
            Today&apos;s tasks
          </CardTitle>
          <CardDescription>
            {total === 0
              ? "Nothing assigned yet."
              : `${done} of ${total} completed (${progress}%)`}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {loading ? (
            <div className="text-sm text-muted-foreground">
              Loading tasks...
            </div>
          ) : tasks.length === 0 ? (
            <div className="rounded-md border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
              No tasks assigned for today.
            </div>
          ) : (
            <>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <ul className="flex flex-col gap-2">
                {tasks.map((t) => (
                  <li key={t.id}>
                    <label
                      className={`flex cursor-pointer items-start gap-3 rounded-md border border-border/60 p-3 transition-colors hover:border-primary/40 ${
                        t.status === "DONE" ? "bg-card/50" : "bg-card"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={t.status === "DONE"}
                        onChange={() => toggleTask(t.id)}
                        className="mt-0.5 h-4 w-4 rounded border-border bg-background text-primary focus:ring-primary"
                      />
                      <div className="flex flex-col gap-0.5">
                        <span
                          className={`text-sm ${t.status === "DONE" ? "text-muted-foreground line-through" : "font-medium"}`}
                        >
                          {t.title}
                        </span>
                        {t.description ? (
                          <span className="text-xs text-muted-foreground">
                            {t.description}
                          </span>
                        ) : null}
                      </div>
                    </label>
                  </li>
                ))}
              </ul>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
