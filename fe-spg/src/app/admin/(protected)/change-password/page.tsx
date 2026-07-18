import type { Metadata } from "next";

import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";

export const metadata: Metadata = {
  title: "Đổi mật khẩu",
};

export default function AdminChangePasswordPage() {
  return <ChangePasswordForm />;
}
