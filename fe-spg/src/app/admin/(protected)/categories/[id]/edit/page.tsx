import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CategoryForm } from "@/components/admin/CategoryForm";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Chỉnh sửa danh mục",
};

export default async function EditAdminCategoryPage({
  params,
}: PageProps) {
  const { id } = await params;
  const categoryId = Number(id);

  if (!Number.isInteger(categoryId) || categoryId < 1) notFound();

  return <CategoryForm categoryId={categoryId} />;
}
