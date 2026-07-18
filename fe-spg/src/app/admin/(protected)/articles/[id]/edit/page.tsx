import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleForm } from "@/components/admin/ArticleForm";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Chỉnh sửa bài viết",
};

export default async function EditAdminArticlePage({ params }: PageProps) {
  const { id } = await params;
  const articleId = Number(id);

  if (!Number.isInteger(articleId) || articleId < 1) notFound();

  return <ArticleForm articleId={articleId} />;
}
