import { apiRequest } from "@/lib/api";
import type {
  AdminRole,
  AuthenticatedAdminUser,
} from "@/types/admin";

type ApiAuthUser = {
  email: string;
  fullName: string;
  id: number;
  mustChangePassword: boolean;
  role: AdminRole;
};

type ApiLoginResponse = {
  accessToken: string;
  user: ApiAuthUser;
};

export type AuthResponse = {
  accessToken: string;
  user: AuthenticatedAdminUser;
};

export type ChangePasswordData = {
  confirmPassword: string;
  currentPassword: string;
  newPassword: string;
};

function mapAuthUser(user: ApiAuthUser): AuthenticatedAdminUser {
  return {
    id: user.id,
    email: user.email,
    name: user.fullName,
    role: user.role,
    mustChangePassword: user.mustChangePassword,
  };
}

function mapAuthResponse(response: ApiLoginResponse): AuthResponse {
  return {
    accessToken: response.accessToken,
    user: mapAuthUser(response.user),
  };
}

export async function login(
  email: string,
  password: string,
  rememberMe: boolean,
) {
  const response = await apiRequest<ApiLoginResponse>("/auth/login", {
    body: JSON.stringify({ email, password, rememberMe }),
    method: "POST",
    skipAuthRefresh: true,
  });

  return mapAuthResponse(response);
}

export async function getMe() {
  const user = await apiRequest<ApiAuthUser>("/auth/me");
  return mapAuthUser(user);
}

export async function refreshToken() {
  const response = await apiRequest<ApiLoginResponse>("/auth/refresh", {
    method: "POST",
    skipAuthRefresh: true,
  });

  return mapAuthResponse(response);
}

export function logout() {
  return apiRequest<{ message: string }>("/auth/logout", {
    method: "POST",
  });
}

export function logoutAll() {
  return apiRequest<{ message: string }>("/auth/logout-all", {
    method: "POST",
  });
}

export function changePassword(data: ChangePasswordData) {
  return apiRequest<{ message: string }>("/auth/change-password", {
    body: JSON.stringify(data),
    method: "PATCH",
  });
}
