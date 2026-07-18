export type UserRole = "admin" | "employee";

export type AdminUser = {
  createdAt: string;
  email: string;
  fullName: string;
  id: number;
  isActive: boolean;
  lastLoginAt: string | null;
  mustChangePassword: boolean;
  passwordChangedAt: string | null;
  phone: string | null;
  role: UserRole;
  updatedAt: string;
};

export type UsersListResponse = {
  data: AdminUser[];
  meta: {
    limit: number;
    page: number;
    total: number;
    totalPages: number;
  };
};

export type GetUsersParams = {
  isActive?: boolean;
  limit?: number;
  page?: number;
  role?: UserRole;
  search?: string;
};

export type CreateUserData = {
  email: string;
  fullName: string;
  isActive: boolean;
  mustChangePassword: boolean;
  phone: string;
  role: UserRole;
  temporaryPassword: string;
};

export type UpdateUserData = {
  fullName?: string;
  isActive?: boolean;
  phone?: string | null;
  role?: UserRole;
};
