import type { Role } from "./role";

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  phone?: string;
  role: Role;
  /** Link to cinema branch (for CINEMA_MANAGER / STAFF). */
  cinemaId?: string;
  /** If true, the user must change password before accessing the app. */
  mustChangePassword: boolean;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthSession {
  user: User;
  token: string;
  issuedAt: string;
  expiresAt: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCustomerPayload {
  username: string;
  email: string;
  fullName: string;
  phone?: string;
  password: string;
}

export interface CreateAccountPayload {
  username: string;
  email: string;
  fullName: string;
  phone?: string;
  role: Role;
  cinemaId?: string;
  /** Temporary password issued by the creator; user must change on first login. */
  temporaryPassword: string;
}

export interface UpdateProfilePayload {
  fullName?: string;
  phone?: string;
  email?: string;
  avatarUrl?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface ResetPasswordPayload {
  targetUserId: string;
  temporaryPassword: string;
}
