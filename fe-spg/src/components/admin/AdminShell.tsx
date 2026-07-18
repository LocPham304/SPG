"use client";

import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";

import { AccessDenied } from "./AccessDenied";
import { useAuth } from "./AdminAuthContext";
import { AdminHeader } from "./AdminHeader";
import { AdminSidebar } from "./AdminSidebar";

type AdminShellProps = {
  children: ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, isAuthenticated, isLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mustRedirectToPasswordChange = Boolean(
    currentUser?.mustChangePassword &&
      pathname !== "/admin/change-password",
  );

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/admin/login");
      return;
    }

    if (mustRedirectToPasswordChange) {
      router.replace("/admin/change-password");
    }
  }, [
    isAuthenticated,
    isLoading,
    mustRedirectToPasswordChange,
    router,
  ]);

  if (
    isLoading ||
    !isAuthenticated ||
    !currentUser ||
    mustRedirectToPasswordChange
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <p className="text-sm text-slate-500" role="status">
          Đang tải trang quản trị...
        </p>
      </main>
    );
  }

  const isEmployeeOnUsersPage =
    currentUser.role === "employee" &&
    pathname.startsWith("/admin/users");

  return (
    <div className="min-h-screen bg-slate-100 lg:pl-64">
      <AdminSidebar
        isMobileOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        role={currentUser.role}
      />
      <div className="min-w-0">
        <AdminHeader
          onOpenMenu={() => setIsMobileMenuOpen(true)}
          user={currentUser}
        />
        <main className="p-4 sm:p-6 lg:p-8">
          {isEmployeeOnUsersPage ? <AccessDenied /> : children}
        </main>
      </div>
    </div>
  );
}
