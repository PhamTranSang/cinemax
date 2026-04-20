import { createMockDb } from "../mock/mock-db";
import type {
  CreateAccountPayload,
  ResetPasswordPayload,
  User,
} from "../types/user";
import {
  ROLES,
  canCreateRole,
  canResetPasswordFor,
  type Role,
} from "../types/role";

function delay<T>(value: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export interface UserStats {
  total: number;
  newThisWeek: number;
  newThisMonth: number;
  newThisQuarter: number;
  byRole: Record<Role, number>;
  weeklySeries: { label: string; newUsers: number }[];
}

export function createUserService(namespace: string) {
  const db = createMockDb(namespace);

  async function listUsers(filter?: { role?: Role; search?: string }) {
    const data = db.read();
    let users = data.users;
    if (filter?.role) users = users.filter((u) => u.role === filter.role);
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      users = users.filter(
        (u) =>
          u.username.toLowerCase().includes(q) ||
          u.fullName.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q),
      );
    }
    return delay(
      [...users].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
    );
  }

  async function getStats(): Promise<UserStats> {
    const data = db.read();
    const users = data.users.filter((u) => u.role === ROLES.CUSTOMER);
    const now = Date.now();
    const DAY = 1000 * 60 * 60 * 24;

    const newThisWeek = users.filter(
      (u) => now - new Date(u.createdAt).getTime() <= 7 * DAY,
    ).length;
    const newThisMonth = users.filter(
      (u) => now - new Date(u.createdAt).getTime() <= 30 * DAY,
    ).length;
    const newThisQuarter = users.filter(
      (u) => now - new Date(u.createdAt).getTime() <= 90 * DAY,
    ).length;

    const byRole: Record<Role, number> = {
      SUPER_ADMIN: 0,
      CINEMA_MANAGER: 0,
      STAFF: 0,
      CUSTOMER: 0,
    };
    for (const u of data.users) byRole[u.role]++;

    // Weekly bucket over the last 12 weeks for a chart
    const weeklySeries: UserStats["weeklySeries"] = [];
    for (let i = 11; i >= 0; i--) {
      const start = now - (i + 1) * 7 * DAY;
      const end = now - i * 7 * DAY;
      const count = users.filter((u) => {
        const t = new Date(u.createdAt).getTime();
        return t >= start && t < end;
      }).length;
      weeklySeries.push({ label: `W-${i}`, newUsers: count });
    }

    return delay({
      total: users.length,
      newThisWeek,
      newThisMonth,
      newThisQuarter,
      byRole,
      weeklySeries,
    });
  }

  async function createAccount(
    actor: { id: string; role: Role },
    payload: CreateAccountPayload,
  ): Promise<User> {
    if (!canCreateRole(actor.role, payload.role)) {
      throw new Error("Bạn không có quyền tạo tài khoản với vai trò này");
    }
    const data = db.read();
    if (data.users.some((u) => u.username === payload.username)) {
      throw new Error("Tên đăng nhập đã tồn tại");
    }
    if (data.users.some((u) => u.email === payload.email)) {
      throw new Error("Email đã tồn tại");
    }
    if (payload.temporaryPassword.length < 6) {
      throw new Error("Mật khẩu tạm thời phải có ít nhất 6 ký tự");
    }
    const now = new Date().toISOString();
    const user: User = {
      id: `u-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      username: payload.username,
      email: payload.email,
      fullName: payload.fullName,
      phone: payload.phone,
      role: payload.role,
      cinemaId: payload.cinemaId,
      mustChangePassword: true,
      createdAt: now,
      updatedAt: now,
    };
    data.users.unshift(user);
    data.passwords[payload.username] = payload.temporaryPassword;
    db.write(data);
    return delay(user);
  }

  async function resetPassword(
    actor: { id: string; role: Role },
    payload: ResetPasswordPayload,
  ): Promise<User> {
    const data = db.read();
    const target = data.users.find((u) => u.id === payload.targetUserId);
    if (!target) throw new Error("Không tìm thấy tài khoản");
    if (!canResetPasswordFor(actor.role, target.role)) {
      throw new Error("Bạn không có quyền reset mật khẩu cho tài khoản này");
    }
    if (payload.temporaryPassword.length < 6) {
      throw new Error("Mật khẩu tạm thời phải có ít nhất 6 ký tự");
    }
    data.passwords[target.username] = payload.temporaryPassword;
    const updated: User = {
      ...target,
      mustChangePassword: true,
      updatedAt: new Date().toISOString(),
    };
    data.users = data.users.map((u) => (u.id === target.id ? updated : u));
    db.write(data);
    return delay(updated);
  }

  async function updateProfile(
    userId: string,
    updates: Partial<{
      fullName: string;
      email: string;
      phone?: string;
    }>,
  ): Promise<User> {
    const data = db.read();
    const user = data.users.find((u) => u.id === userId);
    if (!user) throw new Error("User not found");

    const updated: User = {
      ...user,
      fullName: updates.fullName ?? user.fullName,
      email: updates.email ?? user.email,
      phone: updates.phone ?? user.phone,
      updatedAt: new Date().toISOString(),
    };
    data.users = data.users.map((u) => (u.id === userId ? updated : u));
    db.write(data);
    return delay(updated);
  }

  return { listUsers, getStats, createAccount, resetPassword, updateProfile };
}

export type UserService = ReturnType<typeof createUserService>;
