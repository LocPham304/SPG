import type {
  AdminPermission,
  AdminRole,
} from "@/types/admin";

const permissionsByRole: Record<AdminRole, readonly AdminPermission[]> = {
  admin: ["dashboard", "manageNews", "manageContacts", "manageEmployees"],
  employee: ["manageNews", "manageContacts"],
};

export function getAdminPermissions(role: AdminRole) {
  return permissionsByRole[role];
}

export function getAdminRoleLabel(role: AdminRole) {
  return role === "admin" ? "Admin" : "Nhân viên";
}
