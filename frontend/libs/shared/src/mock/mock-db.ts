import type { User } from "../types/user";
import type { AttendanceRecord, DailyTask } from "../types/attendance";
import { ROLES } from "../types/role";

/**
 * Tiny in-memory mock database with optional localStorage persistence.
 * Each app (cinema, dashboard) has its own isolated store via `namespace`.
 *
 * This exists only until the Spring Boot backend is wired up. All service
 * methods return Promises so swapping to fetch() calls is a drop-in change.
 */

interface DbShape {
  users: User[];
  /** username -> password (plain text in mock; real backend will hash). */
  passwords: Record<string, string>;
  attendance: AttendanceRecord[];
  tasks: DailyTask[];
}

const DB_VERSION = 1;

function isBrowser() {
  return globalThis.window !== undefined && typeof localStorage !== "undefined";
}

function seed(): DbShape {
  const now = new Date().toISOString();
  const users: User[] = [
    {
      id: "u-super-1",
      username: "superadmin",
      email: "super@cinema.local",
      fullName: "Super Admin",
      role: ROLES.SUPER_ADMIN,
      mustChangePassword: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "u-manager-1",
      username: "manager1",
      email: "manager1@cinema.local",
      fullName: "Cinema Manager One",
      role: ROLES.CINEMA_MANAGER,
      cinemaId: "cinema-hcm-01",
      mustChangePassword: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "u-staff-1",
      username: "staff1",
      email: "staff1@cinema.local",
      fullName: "Staff One",
      role: ROLES.STAFF,
      cinemaId: "cinema-hcm-01",
      mustChangePassword: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "u-customer-1",
      username: "customer1",
      email: "customer1@mail.local",
      fullName: "Nguyen Van A",
      phone: "0901234567",
      role: ROLES.CUSTOMER,
      mustChangePassword: false,
      createdAt: now,
      updatedAt: now,
    },
  ];

  // Fake spread of recent signups for dashboard stats
  const extraCustomers: User[] = Array.from({ length: 28 }).map((_, i) => {
    const daysAgo = Math.floor(Math.random() * 95);
    const created = new Date();
    created.setDate(created.getDate() - daysAgo);
    return {
      id: `u-cust-seed-${i}`,
      username: `customer_seed_${i}`,
      email: `seed${i}@mail.local`,
      fullName: `Seed Customer ${i + 1}`,
      role: ROLES.CUSTOMER,
      mustChangePassword: false,
      createdAt: created.toISOString(),
      updatedAt: created.toISOString(),
    };
  });

  const passwords: Record<string, string> = {
    superadmin: "Admin@123",
    manager1: "Manager@123",
    staff1: "Staff@123",
    customer1: "Customer@123",
  };
  for (const c of extraCustomers) passwords[c.username] = "Customer@123";

  const tasks: DailyTask[] = [
    {
      id: "t-1",
      title: "Mở cửa sảnh và kiểm tra vé online",
      description: "Check-in hệ thống POS và quét mã QR.",
      dueDate: new Date().toISOString().slice(0, 10),
      assigneeId: "u-staff-1",
      status: "PENDING",
    },
    {
      id: "t-2",
      title: "Kiểm tra máy chiếu phòng số 3",
      description: "Báo kỹ thuật nếu đèn chiếu dưới 70%.",
      dueDate: new Date().toISOString().slice(0, 10),
      assigneeId: "u-staff-1",
      status: "IN_PROGRESS",
    },
    {
      id: "t-3",
      title: "Vệ sinh khu vực bắp nước sau suất 14:00",
      description: "Theo checklist 5S.",
      dueDate: new Date().toISOString().slice(0, 10),
      assigneeId: "u-staff-1",
      status: "PENDING",
    },
  ];

  return {
    users: [...users, ...extraCustomers],
    passwords,
    attendance: [],
    tasks,
  };
}

function normalizeLoadedDb(db: DbShape): DbShape {
  // Keep demo credentials/first-login behavior stable even for old localStorage data.
  const users = db.users.map((u) =>
    u.username === "superadmin" ? { ...u, mustChangePassword: true } : u,
  );
  const passwords = { ...db.passwords, superadmin: "Admin@123" };
  return { ...db, users, passwords };
}

function storageKey(namespace: string) {
  return `cinema-mock-db:${namespace}:v${DB_VERSION}`;
}

function load(namespace: string): DbShape {
  if (!isBrowser()) return seed();
  try {
    const raw = localStorage.getItem(storageKey(namespace));
    if (!raw) {
      const fresh = seed();
      localStorage.setItem(storageKey(namespace), JSON.stringify(fresh));
      return fresh;
    }
    const parsed = JSON.parse(raw) as DbShape;
    const normalized = normalizeLoadedDb(parsed);
    localStorage.setItem(storageKey(namespace), JSON.stringify(normalized));
    return normalized;
  } catch {
    return seed();
  }
}

function save(namespace: string, db: DbShape) {
  if (!isBrowser()) return;
  localStorage.setItem(storageKey(namespace), JSON.stringify(db));
}

export function createMockDb(namespace: string) {
  return {
    read(): DbShape {
      return load(namespace);
    },
    write(db: DbShape) {
      save(namespace, db);
    },
    reset() {
      if (!isBrowser()) return;
      localStorage.removeItem(storageKey(namespace));
    },
  };
}

export type MockDb = ReturnType<typeof createMockDb>;
