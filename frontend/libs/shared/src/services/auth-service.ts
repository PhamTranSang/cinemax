import { createMockDb } from "../mock/mock-db";
import type {
  AuthSession,
  ChangePasswordPayload,
  LoginCredentials,
  RegisterCustomerPayload,
  UpdateProfilePayload,
  User,
} from "../types/user";
import { ROLES, type Role } from "../types/role";

const SESSION_KEY = "cinema-session";

function sessionStorageKey(namespace: string) {
  return `${SESSION_KEY}:${namespace}`;
}

function delay<T>(value: T, ms = 350): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function makeToken(userId: string) {
  return `mock.${userId}.${Date.now()}.${Math.random().toString(36).slice(2, 10)}`;
}

function toSession(user: User): AuthSession {
  const now = new Date();
  const expires = new Date(now.getTime() + 1000 * 60 * 60 * 8);
  return {
    user,
    token: makeToken(user.id),
    issuedAt: now.toISOString(),
    expiresAt: expires.toISOString(),
  };
}

export interface AuthServiceOptions {
  /** Unique key per app to isolate mock data (e.g. "cinema", "dashboard"). */
  namespace: string;
  /** Roles allowed to authenticate against this app. */
  allowedRoles: Role[];
}

export function createAuthService(opts: AuthServiceOptions) {
  const db = createMockDb(opts.namespace);

  function persistSession(session: AuthSession | null) {
    if (globalThis.window === undefined) return;
    if (session) {
      localStorage.setItem(
        sessionStorageKey(opts.namespace),
        JSON.stringify(session),
      );
    } else {
      localStorage.removeItem(sessionStorageKey(opts.namespace));
    }
  }

  function readSession(): AuthSession | null {
    if (globalThis.window === undefined) return null;
    const raw = localStorage.getItem(sessionStorageKey(opts.namespace));
    if (!raw) return null;
    try {
      const s = JSON.parse(raw) as AuthSession;
      if (new Date(s.expiresAt).getTime() < Date.now()) {
        localStorage.removeItem(sessionStorageKey(opts.namespace));
        return null;
      }
      const latestUser = db.read().users.find((u) => u.id === s.user.id);
      if (!latestUser) return s;
      const synced = { ...s, user: latestUser };
      localStorage.setItem(
        sessionStorageKey(opts.namespace),
        JSON.stringify(synced),
      );
      return synced;
    } catch {
      return null;
    }
  }

  async function login(creds: LoginCredentials): Promise<AuthSession> {
    const data = db.read();
    const user = data.users.find((u) => u.username === creds.username);
    if (!user) {
      throw new Error("Tài khoản không tồn tại");
    }
    const stored = data.passwords[creds.username];
    if (stored !== creds.password) {
      throw new Error("Mật khẩu không chính xác");
    }
    if (!opts.allowedRoles.includes(user.role)) {
      throw new Error("Tài khoản không có quyền truy cập ứng dụng này");
    }
    const session = toSession(user);
    persistSession(session);
    return delay(session);
  }

  async function logout(): Promise<void> {
    persistSession(null);
    await delay(null);
  }

  async function registerCustomer(
    payload: RegisterCustomerPayload,
  ): Promise<AuthSession> {
    const data = db.read();
    if (data.users.some((u) => u.username === payload.username)) {
      throw new Error("Tên đăng nhập đã được sử dụng");
    }
    if (data.users.some((u) => u.email === payload.email)) {
      throw new Error("Email đã được sử dụng");
    }
    const now = new Date().toISOString();
    const newUser: User = {
      id: `u-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      username: payload.username,
      email: payload.email,
      fullName: payload.fullName,
      phone: payload.phone,
      role: ROLES.CUSTOMER,
      mustChangePassword: false,
      createdAt: now,
      updatedAt: now,
    };
    data.users.push(newUser);
    data.passwords[payload.username] = payload.password;
    db.write(data);

    if (!opts.allowedRoles.includes(newUser.role)) {
      return delay(toSession(newUser));
    }
    const session = toSession(newUser);
    persistSession(session);
    return delay(session);
  }

  async function updateProfile(
    userId: string,
    patch: UpdateProfilePayload,
  ): Promise<User> {
    const data = db.read();
    const idx = data.users.findIndex((u) => u.id === userId);
    if (idx < 0) throw new Error("Không tìm thấy người dùng");
    const updated: User = {
      ...data.users[idx],
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    data.users[idx] = updated;
    db.write(data);

    const session = readSession();
    if (session?.user.id === userId) {
      persistSession({ ...session, user: updated });
    }
    return delay(updated);
  }

  async function changePassword(
    userId: string,
    payload: ChangePasswordPayload,
  ): Promise<User> {
    const data = db.read();
    const user = data.users.find((u) => u.id === userId);
    if (!user) throw new Error("Không tìm thấy người dùng");
    if (data.passwords[user.username] !== payload.currentPassword) {
      throw new Error("Mật khẩu hiện tại không đúng");
    }
    if (payload.newPassword.length < 6) {
      throw new Error("Mật khẩu mới phải có ít nhất 6 ký tự");
    }
    data.passwords[user.username] = payload.newPassword;
    const updated: User = {
      ...user,
      mustChangePassword: false,
      updatedAt: new Date().toISOString(),
    };
    data.users = data.users.map((u) => (u.id === userId ? updated : u));
    db.write(data);

    const session = readSession();
    if (session?.user.id === userId) {
      persistSession({ ...session, user: updated });
    }
    return delay(updated);
  }

  return {
    login,
    logout,
    registerCustomer,
    updateProfile,
    changePassword,
    readSession,
    persistSession,
  };
}

export type AuthService = ReturnType<typeof createAuthService>;
