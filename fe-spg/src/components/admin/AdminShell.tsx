"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

import { getAdminUser } from "@/lib/admin-auth";
import type { AdminUser } from "@/types/admin";

import { AdminAuthProvider } from "./AdminAuthContext";
import { AdminHeader } from "./AdminHeader";
import { AdminSidebar } from "./AdminSidebar";

type AdminShellProps = {
  children: ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const currentUser = getAdminUser();

    if (!currentUser) {
      router.replace("/admin/login");
      return;
    }

    setUser(currentUser);
    setIsCheckingAuth(false);
  }, [router]);

  if (isCheckingAuth || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <p className="text-sm text-slate-500" role="status">
          Đang tải trang quản trị...
        </p>
      </main>
    );
  }

  return (
    <AdminAuthProvider user={user}>
      <div className="min-h-screen bg-slate-100 lg:pl-64">
        <AdminSidebar
          isMobileOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          role={user.role}
        />
        <div className="min-w-0">
          <AdminHeader
            onOpenMenu={() => setIsMobileMenuOpen(true)}
            user={user}
          />
          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </AdminAuthProvider>
  );
}
