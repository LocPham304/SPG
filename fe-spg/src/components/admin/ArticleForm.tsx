/* eslint-disable @next/next/no-img-element */
"use client";

import { Check, ImageIcon, Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { ApiError } from "@/lib/api";
import {
  createArticle,
  getAdminArticleById,
  updateArticle,
} from "@/services/articles.service";
import { getAdminCategories } from "@/services/categories.service";
import { getMedia } from "@/services/media.service";
import type {
  ArticleDetail,
  CreateArticleData,
  UpdateArticleData,
} from "@/types/articles";
import {
  FIXED_CATEGORY_CODES,
  type NewsCategory,
} from "@/types/categories";
import type { MediaFile } from "@/types/media";

import { AccessDenied } from "./AccessDenied";
import { AdminPageHeader } from "./AdminPageHeader";
import { RichTextEditor } from "./RichTextEditor";
import { StatusBadge } from "./StatusBadge";
import { useAdminUser } from "./AdminAuthContext";

type ArticleFormProps = {
  articleId?: number;
};

type ArticleFormErrors = {
  categoryId?: string;
  contentHtml?: string;
  slug?: string;
  sourceUrl?: string;
  summary?: string;
  title?: string;
};

type ThumbnailChoice = {
  altText: string | null;
  height: number;
  id: number;
  name: string;
  publicUrl: string;
  width: number;
};

const inputClassName =
  "h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm outline-none focus:border-[#1d2088] focus:ring-2 focus:ring-[#1d2088]/15 disabled:bg-slate-100 disabled:text-slate-500";
const textareaClassName =
  "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-sm outline-none focus:border-[#1d2088] focus:ring-2 focus:ring-[#1d2088]/15 disabled:bg-slate-100 disabled:text-slate-500";
const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  dateStyle: "short",
  timeStyle: "short",
});

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Không xác định"
    : dateFormatter.format(date);
}

function getCategoryName(category: NewsCategory) {
  return (
    category.translations.find((translation) => translation.locale === "vi")
      ?.name ??
    category.translations[0]?.name ??
    category.code
  );
}

function normalizeSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isContentEmpty(value: string) {
  const visibleText = value
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&[a-z0-9#]+;/gi, "")
    .trim();

  return !visibleText && !/<img(?:\s|>)/i.test(value);
}

function toThumbnailChoice(media: MediaFile): ThumbnailChoice {
  return {
    altText: media.altText,
    height: media.height,
    id: media.id,
    name: media.originalName,
    publicUrl: media.publicUrl,
    width: media.width,
  };
}

function ArticleFormLoading() {
  return (
    <div aria-label="Đang tải biểu mẫu bài viết" role="status">
      <div className="mb-5 h-20 animate-pulse rounded-xl bg-white" />
      <div className="h-[620px] animate-pulse rounded-xl bg-white" />
      <span className="sr-only">Đang tải biểu mẫu bài viết...</span>
    </div>
  );
}

export function ArticleForm({ articleId }: ArticleFormProps) {
  const router = useRouter();
  const user = useAdminUser();
  const isEditing = articleId !== undefined;
  const isAdmin = user.role === "admin";
  const slugWasEditedRef = useRef(isEditing);

  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [thumbnailAltText, setThumbnailAltText] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [selectedThumbnail, setSelectedThumbnail] =
    useState<ThumbnailChoice | null>(null);
  const [isThumbnailPickerOpen, setIsThumbnailPickerOpen] =
    useState(false);
  const [errors, setErrors] = useState<ArticleFormErrors>({});
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isForbidden, setIsForbidden] = useState(false);

  const loadFormData = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);
    setApiError("");

    try {
      const [categoriesResponse, mediaResponse, articleResponse] =
        await Promise.all([
          getAdminCategories({
            isActive: true,
            limit: 100,
            locale: "vi",
            page: 1,
          }),
          getMedia({ limit: 100, page: 1 }),
          articleId !== undefined
            ? getAdminArticleById(articleId)
            : Promise.resolve(null),
        ]);

      const fixedCodes = new Set<string>(FIXED_CATEGORY_CODES);
      setCategories(
        categoriesResponse.data.filter(
          (category) =>
            category.isActive && fixedCodes.has(category.code),
        ),
      );
      setMediaFiles(mediaResponse.data);

      if (articleResponse) {
        const vietnameseTranslation = articleResponse.translations.find(
          (translation) => translation.locale === "vi",
        );

        if (!vietnameseTranslation) {
          throw new Error("Bài viết chưa có bản tiếng Việt.");
        }

        setArticle(articleResponse);
        setCategoryId(String(articleResponse.categoryId ?? ""));
        setTitle(vietnameseTranslation.title ?? "");
        setSlug(vietnameseTranslation.slug ?? "");
        setSummary(vietnameseTranslation.summary ?? "");
        setContentHtml(vietnameseTranslation.contentHtml ?? "");
        setSeoTitle(vietnameseTranslation.seoTitle ?? "");
        setSeoDescription(
          vietnameseTranslation.seoDescription ?? "",
        );
        setThumbnailAltText(
          vietnameseTranslation.thumbnailAltText ?? "",
        );
        setSourceUrl(articleResponse.sourceUrl ?? "");
        setIsFeatured(articleResponse.isFeatured);

        if (articleResponse.thumbnail) {
          const mediaMatch = mediaResponse.data.find(
            (media) => media.id === articleResponse.thumbnail?.id,
          );
          setSelectedThumbnail(
            mediaMatch
              ? toThumbnailChoice(mediaMatch)
              : {
                  altText: articleResponse.thumbnail.altText,
                  height: articleResponse.thumbnail.height,
                  id: articleResponse.thumbnail.id,
                  name: "Ảnh đại diện hiện tại",
                  publicUrl: articleResponse.thumbnail.publicUrl,
                  width: articleResponse.thumbnail.width,
                },
          );
        } else {
          setSelectedThumbnail(null);
        }
      }
    } catch (error: unknown) {
      if (error instanceof ApiError && error.status === 403) {
        setIsForbidden(true);
      } else {
        setHasError(true);
      }
    } finally {
      setIsLoading(false);
    }
  }, [articleId]);

  useEffect(() => {
    void loadFormData();
  }, [loadFormData]);

  function validateForm() {
    const nextErrors: ArticleFormErrors = {};

    if (!categoryId) {
      nextErrors.categoryId = "Vui lòng chọn danh mục.";
    }
    if (!title.trim()) {
      nextErrors.title = "Vui lòng nhập tiêu đề bài viết.";
    }
    if (!slug.trim()) {
      nextErrors.slug = "Vui lòng nhập slug.";
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug.trim())) {
      nextErrors.slug =
        "Slug chỉ được chứa chữ thường, số và dấu gạch ngang.";
    }
    if (!summary.trim()) {
      nextErrors.summary = "Vui lòng nhập mô tả ngắn.";
    }
    if (isContentEmpty(contentHtml)) {
      nextErrors.contentHtml = "Vui lòng nhập nội dung bài viết.";
    }
    if (sourceUrl.trim()) {
      try {
        const parsedUrl = new URL(sourceUrl.trim());
        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
          throw new Error("Invalid protocol");
        }
      } catch {
        nextErrors.sourceUrl =
          "Source URL phải là đường dẫn http:// hoặc https:// hợp lệ.";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validateForm()) return;

    const submitter = (event.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement | null;
    const requestedStatus =
      submitter?.value === "published" ? "published" : "draft";

    setIsSaving(true);
    setApiError("");

    try {
      if (articleId !== undefined) {
        const payload: UpdateArticleData = {
          categoryId: Number(categoryId),
          contentHtml,
          seoDescription: seoDescription.trim() || null,
          seoTitle: seoTitle.trim() || null,
          slug: slug.trim(),
          sourceUrl: sourceUrl.trim() || null,
          summary: summary.trim(),
          thumbnailAltText: thumbnailAltText.trim() || null,
          thumbnailId: selectedThumbnail?.id ?? null,
          title: title.trim(),
        };
        await updateArticle(articleId, payload);
        router.push("/admin/articles?updated=1");
      } else {
        const payload: CreateArticleData = {
          categoryId: Number(categoryId),
          contentHtml,
          ...(isAdmin ? { isFeatured } : {}),
          ...(seoDescription.trim()
            ? { seoDescription: seoDescription.trim() }
            : {}),
          ...(seoTitle.trim() ? { seoTitle: seoTitle.trim() } : {}),
          slug: slug.trim(),
          ...(sourceUrl.trim() ? { sourceUrl: sourceUrl.trim() } : {}),
          status: requestedStatus,
          summary: summary.trim(),
          ...(thumbnailAltText.trim()
            ? { thumbnailAltText: thumbnailAltText.trim() }
            : {}),
          ...(selectedThumbnail
            ? { thumbnailId: selectedThumbnail.id }
            : {}),
          title: title.trim(),
        };
        await createArticle(payload);
        router.push("/admin/articles?created=1");
      }
    } catch (error: unknown) {
      if (error instanceof ApiError && error.status === 403) {
        setIsForbidden(true);
      } else if (error instanceof ApiError && error.status === 409) {
        setApiError("Slug đã tồn tại");
      } else if (error instanceof ApiError && error.status === 400) {
        setApiError(error.message);
      } else {
        setApiError("Đã có lỗi xảy ra. Vui lòng thử lại.");
      }
    } finally {
      setIsSaving(false);
    }
  }

  if (isForbidden) return <AccessDenied />;

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
            ? "Cập nhật nội dung bài viết. Trạng thái được quản lý tại danh sách."
            : "Nhập thông tin để tạo một bài viết mới."
        }
        title={isEditing ? "Chỉnh sửa bài viết" : "Tạo bài viết"}
      />

      {isLoading ? <ArticleFormLoading /> : null}

      {!isLoading && hasError ? (
        <section
          className="rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm"
          role="alert"
        >
          <p className="font-semibold text-slate-800">
            Không thể tải dữ liệu bài viết. Vui lòng thử lại.
          </p>
          <button
            className="mt-4 h-10 rounded-lg bg-[#1d2088] px-4 text-sm font-semibold text-white"
            onClick={() => void loadFormData()}
            type="button"
          >
            Thử lại
          </button>
        </section>
      ) : null}

      {!isLoading && !hasError ? (
        <>
          {article ? (
            <section className="mb-5 flex flex-wrap gap-x-6 gap-y-2 rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-600 shadow-sm">
              <p>
                Người tạo:{" "}
                <strong className="text-slate-800">
                  {article.createdBy.fullName}
                </strong>
              </p>
              <p>
                Ngày tạo:{" "}
                <strong className="text-slate-800">
                  {formatDate(article.createdAt)}
                </strong>
              </p>
              <div className="flex items-center gap-2">
                Trạng thái:
                <StatusBadge type="article" value={article.status} />
              </div>
            </section>
          ) : (
            <section className="mb-5 rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-600 shadow-sm">
              Người tạo:{" "}
              <strong className="text-slate-800">
                {user.name} ({user.email})
              </strong>
            </section>
          )}

          {apiError ? (
            <p
              className="mb-5 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
              role="alert"
            >
              {apiError}
            </p>
          ) : null}

          <form
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
            noValidate
            onSubmit={handleSubmit}
          >
            <div className="grid gap-5">
              <div className="grid gap-5 md:grid-cols-2">
                <label>
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    Danh mục <span className="text-red-600">*</span>
                  </span>
                  <select
                    className={inputClassName}
                    disabled={isSaving}
                    onChange={(event) => {
                      setCategoryId(event.target.value);
                      setErrors((current) => ({
                        ...current,
                        categoryId: undefined,
                      }));
                    }}
                    value={categoryId}
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {getCategoryName(category)}
                      </option>
                    ))}
                  </select>
                  <FieldError message={errors.categoryId} />
                </label>

                <div>
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    Ảnh đại diện
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      className="h-11 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                      disabled={isSaving}
                      onClick={() => setIsThumbnailPickerOpen(true)}
                      type="button"
                    >
                      Chọn từ thư viện ảnh
                    </button>
                    {selectedThumbnail ? (
                      <button
                        className="h-11 rounded-lg border border-red-200 bg-white px-4 text-sm font-semibold text-red-600 hover:bg-red-50"
                        disabled={isSaving}
                        onClick={() => setSelectedThumbnail(null)}
                        type="button"
                      >
                        Bỏ chọn ảnh
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>

              {selectedThumbnail ? (
                <div className="flex max-w-xl items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <img
                    alt={
                      selectedThumbnail.altText ||
                      selectedThumbnail.name
                    }
                    className="h-24 w-32 shrink-0 rounded-lg object-cover"
                    src={selectedThumbnail.publicUrl}
                  />
                  <div className="min-w-0">
                    <p
                      className="truncate text-sm font-semibold text-slate-800"
                      title={selectedThumbnail.name}
                    >
                      {selectedThumbnail.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {selectedThumbnail.width} ×{" "}
                      {selectedThumbnail.height}px
                    </p>
                  </div>
                </div>
              ) : null}

              <label>
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Tiêu đề bài viết <span className="text-red-600">*</span>
                </span>
                <input
                  className={inputClassName}
                  disabled={isSaving}
                  maxLength={500}
                  onChange={(event) => {
                    const nextTitle = event.target.value;
                    setTitle(nextTitle);
                    if (!slugWasEditedRef.current) {
                      setSlug(normalizeSlug(nextTitle));
                    }
                    setErrors((current) => ({
                      ...current,
                      title: undefined,
                    }));
                  }}
                  type="text"
                  value={title}
                />
                <FieldError message={errors.title} />
              </label>

              <label>
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Slug <span className="text-red-600">*</span>
                </span>
                <input
                  autoCapitalize="none"
                  className={inputClassName}
                  disabled={isSaving}
                  maxLength={500}
                  onChange={(event) => {
                    slugWasEditedRef.current = true;
                    setSlug(event.target.value.toLowerCase());
                    setErrors((current) => ({
                      ...current,
                      slug: undefined,
                    }));
                  }}
                  placeholder="vi-du-slug-bai-viet"
                  spellCheck={false}
                  value={slug}
                />
                <FieldError message={errors.slug} />
              </label>

              <label>
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Mô tả ngắn <span className="text-red-600">*</span>
                </span>
                <textarea
                  className={textareaClassName}
                  disabled={isSaving}
                  onChange={(event) => {
                    setSummary(event.target.value);
                    setErrors((current) => ({
                      ...current,
                      summary: undefined,
                    }));
                  }}
                  rows={3}
                  value={summary}
                />
                <FieldError message={errors.summary} />
              </label>

              <div>
                <span
                  className="mb-2 block text-sm font-semibold text-slate-700"
                  id="article-content-label"
                >
                  Nội dung bài viết <span className="text-red-600">*</span>
                </span>
                <RichTextEditor
                  error={Boolean(errors.contentHtml)}
                  errorId={
                    errors.contentHtml
                      ? "article-content-error"
                      : undefined
                  }
                  labelId="article-content-label"
                  onChange={(html) => {
                    setContentHtml(html);
                    setErrors((current) => ({
                      ...current,
                      contentHtml: undefined,
                    }));
                  }}
                  value={contentHtml}
                />
                <FieldError
                  id="article-content-error"
                  message={errors.contentHtml}
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <label>
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    SEO title
                  </span>
                  <input
                    className={inputClassName}
                    disabled={isSaving}
                    maxLength={500}
                    onChange={(event) => setSeoTitle(event.target.value)}
                    value={seoTitle}
                  />
                </label>
                <label>
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    SEO description
                  </span>
                  <textarea
                    className={textareaClassName}
                    disabled={isSaving}
                    onChange={(event) =>
                      setSeoDescription(event.target.value)
                    }
                    rows={3}
                    value={seoDescription}
                  />
                </label>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <label>
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    Thumbnail alt text
                  </span>
                  <input
                    className={inputClassName}
                    disabled={isSaving}
                    maxLength={500}
                    onChange={(event) =>
                      setThumbnailAltText(event.target.value)
                    }
                    value={thumbnailAltText}
                  />
                </label>
                <label>
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    Source URL
                    <span className="ml-1 font-normal text-slate-400">
                      (không bắt buộc)
                    </span>
                  </span>
                  <input
                    className={inputClassName}
                    disabled={isSaving}
                    maxLength={1000}
                    onChange={(event) => {
                      setSourceUrl(event.target.value);
                      setErrors((current) => ({
                        ...current,
                        sourceUrl: undefined,
                      }));
                    }}
                    placeholder="https://..."
                    type="url"
                    value={sourceUrl}
                  />
                  <FieldError message={errors.sourceUrl} />
                </label>
              </div>

              {!isEditing && isAdmin ? (
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <input
                    checked={isFeatured}
                    className="size-4 accent-[#1d2088]"
                    disabled={isSaving}
                    onChange={(event) =>
                      setIsFeatured(event.target.checked)
                    }
                    type="checkbox"
                  />
                  Đặt bài viết làm nổi bật
                </label>
              ) : null}
            </div>

            <div className="mt-7 flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-5">
              {isEditing ? (
                <button
                  className="h-10 rounded-lg bg-[#1d2088] px-5 text-sm font-semibold text-white hover:bg-[#171a70] disabled:opacity-60"
                  disabled={isSaving}
                  type="submit"
                >
                  {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              ) : (
                <>
                  <button
                    className="h-10 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                    disabled={isSaving}
                    type="submit"
                    value="draft"
                  >
                    {isSaving ? "Đang lưu..." : "Lưu nháp"}
                  </button>
                  <button
                    className="h-10 rounded-lg bg-[#1d2088] px-4 text-sm font-semibold text-white hover:bg-[#171a70] disabled:opacity-60"
                    disabled={isSaving}
                    type="submit"
                    value="published"
                  >
                    {isSaving ? "Đang đăng..." : "Đăng bài"}
                  </button>
                </>
              )}
            </div>
          </form>
        </>
      ) : null}

      {isThumbnailPickerOpen ? (
        <ThumbnailPicker
          mediaFiles={mediaFiles}
          onClose={() => setIsThumbnailPickerOpen(false)}
          onSelect={(thumbnail) => {
            setSelectedThumbnail(thumbnail);
            if (!thumbnailAltText.trim() && thumbnail.altText) {
              setThumbnailAltText(thumbnail.altText);
            }
            setIsThumbnailPickerOpen(false);
          }}
          selectedId={selectedThumbnail?.id ?? null}
        />
      ) : null}
    </>
  );
}

type FieldErrorProps = {
  id?: string;
  message?: string;
};

function FieldError({ id, message }: FieldErrorProps) {
  if (!message) return null;

  return (
    <span className="mt-1.5 block text-sm text-red-600" id={id}>
      {message}
    </span>
  );
}

type ThumbnailPickerProps = {
  mediaFiles: MediaFile[];
  onClose: () => void;
  onSelect: (thumbnail: ThumbnailChoice) => void;
  selectedId: number | null;
};

function ThumbnailPicker({
  mediaFiles,
  onClose,
  onSelect,
  selectedId,
}: ThumbnailPickerProps) {
  const [search, setSearch] = useState("");
  const normalizedSearch = search.trim().toLocaleLowerCase("vi");
  const filteredMedia = mediaFiles.filter(
    (media) =>
      !normalizedSearch ||
      media.originalName.toLocaleLowerCase("vi").includes(normalizedSearch) ||
      media.altText?.toLocaleLowerCase("vi").includes(normalizedSearch),
  );

  return (
    <div
      aria-labelledby="thumbnail-picker-title"
      aria-modal="true"
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/55 p-4"
      role="dialog"
    >
      <div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5">
          <div>
            <h2
              className="text-lg font-bold text-slate-900"
              id="thumbnail-picker-title"
            >
              Chọn ảnh từ thư viện
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Chọn một ảnh đã được tải lên hệ thống.
            </p>
          </div>
          <button
            aria-label="Đóng"
            className="flex size-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" size={19} />
          </button>
        </div>

        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row">
          <label className="relative flex-1">
            <Search
              aria-hidden="true"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={17}
            />
            <span className="sr-only">Tìm ảnh</span>
            <input
              className={`${inputClassName} pl-9`}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm theo tên file hoặc mô tả..."
              type="search"
              value={search}
            />
          </label>
          <Link
            className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            href="/admin/media"
          >
            Mở thư viện ảnh
          </Link>
        </div>

        <div className="overflow-y-auto p-4">
          {filteredMedia.length === 0 ? (
            <div className="py-14 text-center">
              <ImageIcon
                aria-hidden="true"
                className="mx-auto text-slate-300"
                size={42}
              />
              <p className="mt-3 font-semibold text-slate-700">
                Chưa có ảnh nào
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {filteredMedia.map((media) => {
                const isSelected = media.id === selectedId;

                return (
                  <button
                    aria-pressed={isSelected}
                    className={`overflow-hidden rounded-xl border bg-white text-left ${
                      isSelected
                        ? "border-[#1d2088] ring-2 ring-[#1d2088]/20"
                        : "border-slate-200 hover:border-slate-400"
                    }`}
                    key={media.id}
                    onClick={() => onSelect(toThumbnailChoice(media))}
                    type="button"
                  >
                    <div className="relative aspect-[4/3] bg-slate-100">
                      <img
                        alt={media.altText || media.originalName}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        src={media.publicUrl}
                      />
                      {isSelected ? (
                        <span className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-[#1d2088] text-white">
                          <Check aria-hidden="true" size={16} />
                        </span>
                      ) : null}
                    </div>
                    <div className="p-3">
                      <p
                        className="truncate text-sm font-semibold text-slate-800"
                        title={media.originalName}
                      >
                        {media.originalName}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {media.width} × {media.height}px
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
