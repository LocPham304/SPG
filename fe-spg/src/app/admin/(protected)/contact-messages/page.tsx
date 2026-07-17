import type { Metadata } from "next";

import { AdminContacts } from "@/components/admin/AdminContacts";

export const metadata: Metadata = {
  title: "Quản lý liên hệ",
};

export default function AdminContactMessagesPage() {
  return <AdminContacts />;
}
