import type { Metadata } from "next";

import { AdminCategories } from "@/components/admin/AdminCategories";

export const metadata: Metadata = {
  title: "Quản lý danh mục",
};

export default function AdminCategoriesPage() {
  return <AdminCategories />;
}
