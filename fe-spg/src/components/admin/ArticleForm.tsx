"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import { articleCategories } from "@/data/admin";
import type { AdminArticle, ArticleStatus } from "@/types/admin";

import { AccessDenied } from "./AccessDenied";
import { AdminPageHeader } from "./AdminPageHeader";
import { RichTextEditor } from "./RichTextEditor";
import { StatusBadge } from "./StatusBadge";
import { useAdminUser } from "./AdminAuthContext";

type ArticleFormProps = {
  article?: AdminArticle;
};

type ArticleFormErrors = {
  category?: string;
  content?: string;
  summary?: string;
  title?: string;
};

const inputClassName =
  "h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm outline-none focus:border-[#1d2088] focus:ring-2 focus:ring-[#1d2088]/15";
const textareaClassName =
  "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-sm outline-none focus:border-[#1d2088] focus:ring-2 focus:ring-[#1d2088]/15";

export function ArticleForm({ article }: ArticleFormProps) {
  const user = useAdminUser();
  const isEditing = Boolean(article);
  const canEdit =
    user.role === "admin" || !article || article.authorEmail === user.email;
  const [title, setTitle] = useState(article?.title ?? "");
  const [summary, setSummary] = useState(article?.summary ?? "");
  const [category, setCategory] = useState(article?.category ?? "");
  const [content, setContent] = useState(article?.content ?? "");
  const [seoTitle, setSeoTitle] = useState(article?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(
    article?.seoDescription ?? "",
  );
  const [imageName, setImageName] = useState(
    article?.featuredImage ?? "",
  );
  const [adminStatus, setAdminStatus] = useState<ArticleStatus>(
    article?.status ?? "draft",
  );
  const [errors, setErrors] = useState<ArticleFormErrors>({});
  const [message, setMessage] = useState("");

  if (!canEdit) return <AccessDenied />;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: ArticleFormErrors = {};

    if (!title.trim()) nextErrors.title = "Vui lòng nhập tiêu đề bài viết";
    if (!summary.trim()) nextErrors.summary = "Vui lòng nhập mô tả ngắn";
    if (!category) nextErrors.category = "Vui lòng chọn danh mục";
    if (!content.trim()) nextErrors.content = "Vui lòng nhập nội dung bài viết";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setMessage("");
      return;
    }

    const submitter = (event.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement | null;
    const requestedStatus =
      (submitter?.value as ArticleStatus | undefined) ?? adminStatus;
    const finalStatus =
      user.role === "employee" && requestedStatus === "published"
        ? "pending_review"
        : requestedStatus;

    setErrors({});
    setAdminStatus(finalStatus);
    setMessage(
      isEditing
        ? "Đã lưu thay đổi bài viết trong bản demo."
        : "Đã tạo bài viết trong bản demo.",
    );
  }

  return (
    <>
      <AdminPageHeader
        actions={
          <Link
            className="inline-flex h-10 items-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            href="/admin/articles"
          >
            Quay lại danh sách
          </Link>
        }
        description={
          isEditing
            ? "Cập nhật nội dung và trạng thái bài viết."
            : "Nhập thông tin để tạo một bài viết mới."
        }
        title={isEditing ? "Chỉnh sửa bài viết" : "Tạo bài viết"}
      />

      {article ? (
        <section className="mb-5 flex flex-wrap gap-x-6 gap-y-2 rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-600 shadow-sm">
          <p className="m-0">
            Người tạo:{" "}
            <strong className="text-slate-800">{article.authorName}</strong>
          </p>
          <p className="m-0">
            Ngày tạo:{" "}
            <strong className="text-slate-800">{article.createdAt}</strong>
          </p>
          <div className="flex items-center gap-2">
            Trạng thái:
            <StatusBadge type="article" value={adminStatus} />
          </div>
        </section>
      ) : null}

      {message ? (
        <p
          className="mb-5 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
          role="status"
        >
          {message}
        </p>
      ) : null}

      <form
        className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        noValidate
        onSubmit={handleSubmit}
      >
        <div className="grid gap-5">
          <label>
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Tiêu đề bài viết <span className="text-red-600">*</span>
            </span>
            <input
              className={inputClassName}
              onChange={(event) => setTitle(event.target.value)}
              type="text"
              value={title}
            />
            {errors.title ? (
              <span className="mt-1.5 block text-sm text-red-600">
                {errors.title}
              </span>
            ) : null}
          </label>

          <label>
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Mô tả ngắn <span className="text-red-600">*</span>
            </span>
            <textarea
              className={textareaClassName}
              onChange={(event) => setSummary(event.target.value)}
              rows={3}
              value={summary}
            />
            {errors.summary ? (
              <span className="mt-1.5 block text-sm text-red-600">
                {errors.summary}
              </span>
            ) : null}
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            <label>
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Danh mục <span className="text-red-600">*</span>
              </span>
              <select
                className={inputClassName}
                onChange={(event) => setCategory(event.target.value)}
                value={category}
              >
                <option value="">Chọn danh mục</option>
                {articleCategories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              {errors.category ? (
                <span className="mt-1.5 block text-sm text-red-600">
                  {errors.category}
                </span>
              ) : null}
            </label>

            <label>
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Ảnh đại diện
              </span>
              <input
                accept="image/*"
                className="block h-11 w-full cursor-pointer rounded-lg border border-slate-300 bg-white text-sm text-slate-600 file:mr-3 file:h-full file:border-0 file:border-r file:border-slate-200 file:bg-slate-50 file:px-3 file:text-sm file:font-semibold"
                onChange={(event) =>
                  setImageName(event.target.files?.[0]?.name ?? "")
                }
                type="file"
              />
              {imageName ? (
                <span className="mt-1.5 block text-xs text-slate-500">
                  Đã chọn: {imageName}
                </span>
              ) : null}
            </label>
          </div>

          <div>
            <span
              className="mb-2 block text-sm font-semibold text-slate-700"
              id="article-content-label"
            >
              Nội dung bài viết <span className="text-red-600">*</span>
            </span>
            <RichTextEditor
              error={Boolean(errors.content)}
              errorId={
                errors.content ? "article-content-error" : undefined
              }
              labelId="article-content-label"
              onChange={(html) => {
                setContent(html);
                if (errors.content) {
                  setErrors((current) => ({
                    ...current,
                    content: undefined,
                  }));
                }
              }}
              value={content}
            />
            {errors.content ? (
              <span
                className="mt-1.5 block text-sm text-red-600"
                id="article-content-error"
              >
                {errors.content}
              </span>
            ) : null}
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label>
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                SEO title
              </span>
              <input
                className={inputClassName}
                onChange={(event) => setSeoTitle(event.target.value)}
                type="text"
                value={seoTitle}
              />
            </label>
            <label>
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                SEO description
              </span>
              <textarea
                className={textareaClassName}
                onChange={(event) => setSeoDescription(event.target.value)}
                rows={3}
                value={seoDescription}
              />
            </label>
          </div>

          {article && user.role === "admin" ? (
            <label className="max-w-sm">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Trạng thái quản trị
              </span>
              <select
                className={inputClassName}
                onChange={(event) =>
                  setAdminStatus(event.target.value as ArticleStatus)
                }
                value={adminStatus}
              >
                <option value="draft">Nháp</option>
                <option value="pending_review">Chờ duyệt</option>
                <option value="published">Đã đăng</option>
                <option value="hidden">Đang ẩn</option>
                <option value="rejected">Từ chối</option>
              </select>
            </label>
          ) : null}
        </div>

        <div className="mt-7 flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-5">
          <button
            className="h-10 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            name="action"
            type="submit"
            value="draft"
          >
            Lưu nháp
          </button>
          <button
            className="h-10 rounded-lg border border-[#1d2088] bg-white px-4 text-sm font-semibold text-[#1d2088] hover:bg-blue-50"
            name="action"
            type="submit"
            value="pending_review"
          >
            Gửi duyệt
          </button>
          {user.role === "admin" ? (
            <button
              className="h-10 rounded-lg border-0 bg-[#1d2088] px-4 text-sm font-semibold text-white hover:bg-[#171a70]"
              name="action"
              type="submit"
              value="published"
            >
              Đăng bài
            </button>
          ) : null}
        </div>
      </form>
    </>
  );
}
