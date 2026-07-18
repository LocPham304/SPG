import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import type { ReactNode } from "react";

import { AdminAuthProvider } from "@/components/admin/AdminAuthContext";

import "../tailwind.css";
import "./admin.css";

const beVietnamPro = Be_Vietnam_Pro({
  display: "swap",
  subsets: ["latin", "vietnamese"],
  variable: "--font-admin",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Đăng nhập quản trị",
    template: "%s | Quản trị website",
  },
  description: "Khu vực quản trị nội dung website.",
};

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <html
      className={`${beVietnamPro.variable} admin-document`}
      lang="vi"
    >
      <body className="admin-body antialiased">
        <AdminAuthProvider>{children}</AdminAuthProvider>
      </body>
    </html>
  );
}
