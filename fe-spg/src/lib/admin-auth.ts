import type {
  AdminPermission,
  AdminRole,
  AdminUser,
} from "@/types/admin";

const ADMIN_USER_STORAGE_KEY = "spg-admin-user";

type DemoAccount = AdminUser & {
  password: string;
};

// Tài khoản chỉ phục vụ demo frontend.
// TODO: Thay toàn bộ fake login này bằng API xác thực thật.
const demoAccounts: readonly DemoAccount[] = [
  {
    email: "admin@example.com",
    name: "Quản trị viên",
    password: "Admin@123",
    role: "admin",
  },
  {
    email: "employee@example.com",
    name: "Nhân viên",
    password: "Employee@123",
    role: "employee",
  },
];

const permissionsByRole: Record<AdminRole, readonly AdminPermission[]> = {
  admin: ["dashboard", "manageNews", "manageContacts", "manageEmployees"],
  employee: ["manageNews", "manageContacts"],
};

export async function loginAdmin(
  email: string,
  password: string,
): Promise<AdminUser | null> {
  // Giữ trạng thái loading đủ rõ khi demo; bỏ khi chuyển sang API thật.
  await new Promise((resolve) => window.setTimeout(resolve, 500));

  const normalizedEmail = email.trim().toLowerCase();
  const account = demoAccounts.find(
    (item) =>
      item.email.toLowerCase() === normalizedEmail &&
      item.password === password,
  );

  if (!account) return null;

  return {
    email: account.email,
    name: account.name,
    role: account.role,
  };
}

export function saveAdminUser(user: AdminUser, remember: boolean) {
  const selectedStorage = remember ? window.localStorage : window.sessionStorage;
  const otherStorage = remember ? window.sessionStorage : window.localStorage;

  otherStorage.removeItem(ADMIN_USER_STORAGE_KEY);
  selectedStorage.setItem(ADMIN_USER_STORAGE_KEY, JSON.stringify(user));
}

export function getAdminUser(): AdminUser | null {
  const storedUser =
    window.localStorage.getItem(ADMIN_USER_STORAGE_KEY) ??
    window.sessionStorage.getItem(ADMIN_USER_STORAGE_KEY);

  if (!storedUser) return null;

  try {
    const user = JSON.parse(storedUser) as Partial<AdminUser>;
    const role = user.role;
    const isValidRole = role === "admin" || role === "employee";

    if (
      typeof user.email !== "string" ||
      typeof user.name !== "string" ||
      !isValidRole
    ) {
      clearAdminUser();
      return null;
    }

    return {
      email: user.email,
      name: user.name,
      role,
    };
  } catch {
    clearAdminUser();
    return null;
  }
}

export function clearAdminUser() {
  window.localStorage.removeItem(ADMIN_USER_STORAGE_KEY);
  window.sessionStorage.removeItem(ADMIN_USER_STORAGE_KEY);
}

export function getAdminPermissions(role: AdminRole) {
  return permissionsByRole[role];
}

export function getAdminRoleLabel(role: AdminRole) {
  return role === "admin" ? "Admin" : "Nhân viên";
}
