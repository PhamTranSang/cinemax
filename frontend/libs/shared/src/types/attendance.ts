export interface AttendanceRecord {
  id: string;
  userId: string;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  checkInAt?: string;
  checkOutAt?: string;
  note?: string;
}

export interface DailyTask {
  id: string;
  title: string;
  description: string;
  /** ISO date (YYYY-MM-DD). */
  dueDate: string;
  assigneeId: string;
  status: "PENDING" | "IN_PROGRESS" | "DONE";
}
