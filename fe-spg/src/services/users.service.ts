import { apiRequest } from "@/lib/api";
import type {
  AdminUser,
  CreateUserData,
  GetUsersParams,
  UpdateUserData,
  UsersListResponse,
} from "@/types/users";

function buildUsersQuery(params: GetUsersParams) {
  const query = new URLSearchParams();

  if (params.page !== undefined) {
    query.set("page", String(params.page));
  }
  if (params.limit !== undefined) {
    query.set("limit", String(params.limit));
  }
  if (params.search?.trim()) {
    query.set("search", params.search.trim());
  }
  if (params.role) {
    query.set("role", params.role);
  }
  if (params.isActive !== undefined) {
    query.set("isActive", String(params.isActive));
  }

  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
}

export function getUsers(params: GetUsersParams = {}) {
  return apiRequest<UsersListResponse>(
    `/admin/users${buildUsersQuery(params)}`,
  );
}

export function getUserById(id: number) {
  return apiRequest<AdminUser>(`/admin/users/${id}`);
}

export function createUser(data: CreateUserData) {
  return apiRequest<AdminUser>("/admin/users", {
    body: JSON.stringify(data),
    method: "POST",
  });
}

export function updateUser(id: number, data: UpdateUserData) {
  return apiRequest<AdminUser>(`/admin/users/${id}`, {
    body: JSON.stringify(data),
    method: "PATCH",
  });
}

export function updateUserStatus(id: number, isActive: boolean) {
  return apiRequest<AdminUser>(`/admin/users/${id}/status`, {
    body: JSON.stringify({ isActive }),
    method: "PATCH",
  });
}

export function resetUserPassword(
  id: number,
  temporaryPassword: string,
) {
  return apiRequest<{ message: string }>(
    `/admin/users/${id}/reset-password`,
    {
      body: JSON.stringify({ temporaryPassword }),
      method: "POST",
    },
  );
}

export function revokeUserSessions(id: number) {
  return apiRequest<{ message: string }>(
    `/admin/users/${id}/sessions`,
    {
      method: "DELETE",
    },
  );
}

export function deleteUser(id: number) {
  return apiRequest<{ message: string }>(`/admin/users/${id}`, {
    method: "DELETE",
  });
}
