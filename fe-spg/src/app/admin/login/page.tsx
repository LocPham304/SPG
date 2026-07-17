import type { Metadata } from "next";

import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const metadata: Metadata = {
  title: "Đăng nhập quản trị",
};

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-slate-50 px-4 py-10">
      <AdminLoginForm />
    </main>
  );
}
