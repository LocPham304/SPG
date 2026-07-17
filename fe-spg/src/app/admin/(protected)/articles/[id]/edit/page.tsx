import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleForm } from "@/components/admin/ArticleForm";
import { adminArticles } from "@/data/admin";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const article = adminArticles.find((item) => item.id === id);

  return {
    title: article ? `Chỉnh sửa: ${article.title}` : "Không tìm thấy bài viết",
  };
}

export default async function EditAdminArticlePage({ params }: PageProps) {
  const { id } = await params;
  const article = adminArticles.find((item) => item.id === id);

  if (!article) notFound();

  return <ArticleForm article={article} />;
}
