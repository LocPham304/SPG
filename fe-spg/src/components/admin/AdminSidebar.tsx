"use client";

import {
  FolderTree,
  Images,
  LayoutDashboard,
  LogOut,
  MessagesSquare,
  Newspaper,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import type { AdminRole } from "@/types/admin";

import { useAuth } from "./AdminAuthContext";

type AdminSidebarProps = {
  isMobileOpen: boolean;
  onClose: () => void;
  role: AdminRole;
};

type AdminNavigationItem = {
  href: string;
  icon: LucideIcon;
  label: string;
  roles: readonly AdminRole[];
};

const navigationItems: readonly AdminNavigationItem[] = [
  {
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    label: "Tổng quan",
    roles: ["admin"],
  },
  {
    href: "/admin/articles",
    icon: Newspaper,
    label: "Quản lý bài viết",
    roles: ["admin", "employee"],
  },
  {
    href: "/admin/categories",
    icon: FolderTree,
    label: "Quản lý danh mục",
    roles: ["admin", "employee"],
  },
  {
    href: "/admin/media",
    icon: Images,
    label: "Thư viện ảnh",
    roles: ["admin", "employee"],
  },
  {
    href: "/admin/contact-messages",
    icon: MessagesSquare,
    label: "Quản lý liên hệ",
    roles: ["admin", "employee"],
  },
  {
    href: "/admin/users",
    icon: Users,
    label: "Quản lý nhân viên",
    roles: ["admin"],
  },
] as const;

export function AdminSidebar({
  isMobileOpen,
  onClose,
  role,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const visibleItems = navigationItems.filter((item) =>
    item.roles.includes(role),
  );

  return (
    <>
      {isMobileOpen ? (
        <button
          aria-label="Đóng menu quản trị"
          className="fixed inset-0 z-40 border-0 bg-slate-950/40 p-0 lg:hidden"
          onClick={onClose}
          type="button"
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex h-18 items-center justify-between border-b border-slate-200 px-5">
          <Link
            aria-label="Trang quản trị"
            className="block"
            href={role === "admin" ? "/admin/dashboard" : "/admin/articles"}
            onClick={onClose}
          >
            <Image
              alt="Tập đoàn Thiết bị Cảng Sơn Đông"
              className="h-auto w-[190px]"
              height={32}
              priority
              src="/images/public/files/image/logo.png"
              width={320}
            />
          </Link>
          <button
            aria-label="Đóng menu"
            className="flex size-9 items-center justify-center rounded-lg border-0 bg-transparent p-0 text-slate-500 hover:bg-slate-100 lg:hidden"
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" size={20} />
          </button>
        </div>

        <nav aria-label="Điều hướng quản trị" className="flex-1 p-4">
          <ul className="m-0 grid list-none gap-1 p-0">
            {visibleItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <li key={item.href}>
                  <Link
                    aria-current={isActive ? "page" : undefined}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold ${
                      isActive
                        ? "bg-[#1d2088] text-white"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                    href={item.href}
                    onClick={onClose}
                  >
                    <Icon aria-hidden="true" size={19} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-slate-200 p-4">
          <button
            className="flex w-full items-center gap-3 rounded-lg border-0 bg-transparent px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            onClick={() => void logout()}
            type="button"
          >
            <LogOut aria-hidden="true" size={19} />
            Đăng xuất
          </button>
        </div>
      </aside>
    </>
  );
}
