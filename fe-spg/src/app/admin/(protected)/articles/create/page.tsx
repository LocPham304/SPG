import type { Metadata } from "next";

import { ArticleForm } from "@/components/admin/ArticleForm";

export const metadata: Metadata = {
  title: "Tạo bài viết",
};

export default function CreateAdminArticlePage() {
  return <ArticleForm />;
}
