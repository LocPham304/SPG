"use client";

import { Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { adminArticles } from "@/data/admin";
import type { AdminArticle, ArticleStatus } from "@/types/admin";

import { AdminPageHeader } from "./AdminPageHeader";
import { StatusBadge } from "./StatusBadge";

const statusFilters: Array<{ label: string; value: "all" | ArticleStatus }> = [
  { label: "Tất cả", value: "all" },
  { label: "Nháp", value: "draft" },
  { label: "Đã đăng", value: "published" },
  { label: "Đang ẩn", value: "hidden" },
];

export function AdminArticles() {
  const [articles, setArticles] = useState<AdminArticle[]>([
    ...adminArticles,
  ]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | ArticleStatus>("all");
  const [message, setMessage] = useState("");

  const filteredArticles = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("vi");

    return articles.filter((article) => {
      const matchesQuery =
        !normalizedQuery ||
        article.title.toLocaleLowerCase("vi").includes(normalizedQuery);
      const matchesStatus = status === "all" || article.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [articles, query, status]);

  function toggleVisibility(article: AdminArticle) {
    const nextStatus = article.status === "hidden" ? "published" : "hidden";
    setArticles((current) =>
      current.map((item) =>
        item.id === article.id ? { ...item, status: nextStatus } : item,
      ),
    );
    setMessage(
      nextStatus === "hidden"
        ? "Đã ẩn bài viết trong bản demo."
        : "Đã hiển thị lại bài viết trong bản demo.",
    );
  }

  function softDelete(articleId: string) {
    setArticles((current) =>
      current.filter((article) => article.id !== articleId),
    );
    setMessage("Đã xóa mềm bài viết khỏi danh sách demo.");
  }

  return (
    <>
      <AdminPageHeader
        actions={
          <Link
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#1d2088] px-4 text-sm font-semibold text-white hover:bg-[#171a70]"
            href="/admin/articles/create"
          >
            <Plus aria-hidden="true" size={18} />
            Tạo bài viết
          </Link>
        }
        description="Tìm kiếm, theo dõi trạng thái và cập nhật các bài viết."
        title="Quản lý bài viết"
      />

      {message ? (
        <p
          className="mb-4 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700"
          role="status"
        >
          {message}
        </p>
      ) : null}

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-3 border-b border-slate-200 p-4 sm:grid-cols-[minmax(0,1fr)_220px]">
          <label>
            <span className="sr-only">Tìm kiếm theo tiêu đề</span>
            <input
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm outline-none focus:border-[#1d2088] focus:ring-2 focus:ring-[#1d2088]/15"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tìm kiếm theo tiêu đề..."
              type="search"
              value={query}
            />
          </label>
          <label>
            <span className="sr-only">Lọc trạng thái</span>
            <select
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-[#1d2088] focus:ring-2 focus:ring-[#1d2088]/15"
              onChange={(event) =>
                setStatus(event.target.value as "all" | ArticleStatus)
              }
              value={status}
            >
              {statusFilters.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] border-collapse text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Tiêu đề</th>
                <th className="px-4 py-3 font-semibold">Danh mục</th>
                <th className="px-4 py-3 font-semibold">Người tạo</th>
                <th className="px-4 py-3 font-semibold">Trạng thái</th>
                <th className="px-4 py-3 font-semibold">Ngày tạo</th>
                <th className="px-4 py-3 font-semibold">Ngày đăng</th>
                <th className="px-4 py-3 text-right font-semibold">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredArticles.map((article) => (
                <tr className="hover:bg-slate-50/70" key={article.id}>
                  <td className="max-w-[320px] px-4 py-4">
                    <p className="m-0 line-clamp-2 font-semibold text-slate-800">
                      {article.title}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-slate-600">
                    {article.category}
                  </td>
                  <td className="px-4 py-4 text-slate-600">
                    {article.authorName}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge type="article" value={article.status} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                    {article.createdAt}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                    {article.publishedAt ?? "—"}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-1">
                      <Link
                        aria-label={`Sửa ${article.title}`}
                        className="flex size-9 items-center justify-center rounded-lg text-slate-500 hover:bg-blue-50 hover:text-[#1d2088]"
                        href={`/admin/articles/${article.id}/edit`}
                        title="Xem và sửa"
                      >
                        <Pencil aria-hidden="true" size={17} />
                      </Link>
                      <button
                        aria-label={
                          article.status === "hidden"
                            ? `Hiện ${article.title}`
                            : `Ẩn ${article.title}`
                        }
                        className="flex size-9 items-center justify-center rounded-lg border-0 bg-transparent p-0 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                        onClick={() => toggleVisibility(article)}
                        title={
                          article.status === "hidden" ? "Hiện bài" : "Ẩn bài"
                        }
                        type="button"
                      >
                        {article.status === "hidden" ? (
                          <Eye aria-hidden="true" size={17} />
                        ) : (
                          <EyeOff aria-hidden="true" size={17} />
                        )}
                      </button>
                      <button
                        aria-label={`Xóa mềm ${article.title}`}
                        className="flex size-9 items-center justify-center rounded-lg border-0 bg-transparent p-0 text-slate-500 hover:bg-red-50 hover:text-red-600"
                        onClick={() => softDelete(article.id)}
                        title="Xóa mềm"
                        type="button"
                      >
                        <Trash2 aria-hidden="true" size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="m-0 font-semibold text-slate-700">
              Không có bài viết phù hợp
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Hãy thay đổi từ khóa hoặc bộ lọc trạng thái.
            </p>
          </div>
        ) : null}
      </section>
    </>
  );
}
