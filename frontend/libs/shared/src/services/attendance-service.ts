import { createMockDb } from "../mock/mock-db";
import type { AttendanceRecord, DailyTask } from "../types/attendance";

function delay<T>(value: T, ms = 250): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function createAttendanceService(namespace: string) {
  const db = createMockDb(namespace);

  async function getTodayRecord(userId: string): Promise<AttendanceRecord | null> {
    const data = db.read();
    const rec =
      data.attendance.find((r) => r.userId === userId && r.date === today()) ??
      null;
    return delay(rec);
  }

  async function checkIn(userId: string): Promise<AttendanceRecord> {
    const data = db.read();
    const existing = data.attendance.find(
      (r) => r.userId === userId && r.date === today()
    );
    if (existing?.checkInAt) {
      throw new Error("Bạn đã chấm công vào hôm nay");
    }
    const now = new Date().toISOString();
    if (existing) {
      existing.checkInAt = now;
      db.write(data);
      return delay(existing);
    }
    const rec: AttendanceRecord = {
      id: `att-${Date.now()}`,
      userId,
      date: today(),
      checkInAt: now,
    };
    data.attendance.push(rec);
    db.write(data);
    return delay(rec);
  }

  async function checkOut(userId: string): Promise<AttendanceRecord> {
    const data = db.read();
    const rec = data.attendance.find(
      (r) => r.userId === userId && r.date === today()
    );
    if (!rec?.checkInAt) {
      throw new Error("Bạn chưa chấm công vào");
    }
    if (rec.checkOutAt) {
      throw new Error("Bạn đã chấm công ra hôm nay");
    }
    rec.checkOutAt = new Date().toISOString();
    db.write(data);
    return delay(rec);
  }

  async function listTodayTasks(userId: string): Promise<DailyTask[]> {
    const data = db.read();
    return delay(
      data.tasks.filter((t) => t.assigneeId === userId && t.dueDate === today())
    );
  }

  async function setTaskStatus(
    taskId: string,
    status: DailyTask["status"]
  ): Promise<DailyTask> {
    const data = db.read();
    const task = data.tasks.find((t) => t.id === taskId);
    if (!task) throw new Error("Không tìm thấy task");
    task.status = status;
    db.write(data);
    return delay(task);
  }

  return { getTodayRecord, checkIn, checkOut, listTodayTasks, setTaskStatus };
}

export type AttendanceService = ReturnType<typeof createAttendanceService>;
