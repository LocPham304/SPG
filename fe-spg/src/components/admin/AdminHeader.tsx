"use client";

import { LogOut, Menu } from "lucide-react";
import { usePathname } from "next/navigation";

import { getAdminRoleLabel } from "@/lib/admin-auth";
import type { AdminUser } from "@/types/admin";

import { useAuth } from "./AdminAuthContext";

type AdminHeaderProps = {
  onOpenMenu: () => void;
  user: AdminUser;
};

function getPageTitle(pathname: string) {
  if (pathname === "/admin/dashboard") return "Tổng quan";
  if (pathname === "/admin/articles/create") return "Tạo bài viết";
  if (pathname.includes("/admin/articles/") && pathname.endsWith("/edit")) {
    return "Chỉnh sửa bài viết";
  }
  if (pathname.startsWith("/admin/articles")) return "Quản lý bài viết";
  if (
    pathname.startsWith("/admin/contact-messages/") &&
    pathname !== "/admin/contact-messages"
  ) {
    return "Chi tiết liên hệ";
  }
  if (pathname.startsWith("/admin/contact-messages")) {
    return "Quản lý liên hệ";
  }
  if (pathname === "/admin/users/create") return "Tạo nhân viên";
  if (pathname.startsWith("/admin/users")) return "Quản lý nhân viên";
  if (pathname === "/admin/change-password") return "Đổi mật khẩu";
  return "Trang quản trị";
}

export function AdminHeader({ onOpenMenu, user }: AdminHeaderProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex min-h-18 items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 py-3 sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          aria-label="Mở menu quản trị"
          className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white p-0 text-slate-700 lg:hidden"
          onClick={onOpenMenu}
          type="button"
        >
          <Menu aria-hidden="true" size={21} />
        </button>
        <h1 className="truncate text-lg font-bold text-slate-900 sm:text-xl">
          {getPageTitle(pathname)}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="m-0 text-sm font-semibold text-slate-800">{user.name}</p>
          <p className="m-0 text-xs text-slate-500">
            {getAdminRoleLabel(user.role)}
          </p>
        </div>
        <button
          aria-label="Đăng xuất"
          className="flex size-10 items-center justify-center rounded-lg border border-slate-200 bg-white p-0 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          onClick={() => void logout()}
          title="Đăng xuất"
          type="button"
        >
          <LogOut aria-hidden="true" size={19} />
        </button>
      </div>
    </header>
  );
}
