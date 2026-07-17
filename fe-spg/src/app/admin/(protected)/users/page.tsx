import type { Metadata } from "next";

import { AdminUsers } from "@/components/admin/AdminUsers";

export const metadata: Metadata = {
  title: "Quản lý nhân viên",
};

export default function AdminUsersPage() {
  return <AdminUsers />;
}
