import type { Metadata } from "next";

import { AdminArticles } from "@/components/admin/AdminArticles";

export const metadata: Metadata = {
  title: "Quản lý bài viết",
};

export default function AdminArticlesPage() {
  return <AdminArticles />;
}
