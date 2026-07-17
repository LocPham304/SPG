import type { Metadata } from "next";

import { UserForm } from "@/components/admin/UserForm";

export const metadata: Metadata = {
  title: "Tạo nhân viên",
};

export default function CreateAdminUserPage() {
  return <UserForm />;
}
