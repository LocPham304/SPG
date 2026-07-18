import type { Metadata } from "next";

import { AdminMedia } from "@/components/admin/AdminMedia";

export const metadata: Metadata = {
  title: "Thư viện ảnh",
};

export default function AdminMediaPage() {
  return <AdminMedia />;
}
