import type { Metadata } from "next";

import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const metadata: Metadata = {
  title: "Tổng quan",
};

export default function AdminDashboardPage() {
  return <AdminDashboard />;
}
