/* eslint-disable @next/next/no-img-element */
"use client";

import { ImageIcon, Languages } from "lucide-react";
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
  translateArticle,
  updateArticle,
} from "@/services/articles.service";
import { getAdminCategories } from "@/services/categories.service";
import { uploadMedia } from "@/services/media.service";
import type {
  ArticleDetail,
  ArticleTranslationInput,
  CreateArticleData,
  TranslationStatus,
  UpdateArticleData,
} from "@/types/articles";
import {
  FIXED_CATEGORY_CODES,
  type LocaleCode,
  type NewsCategory,
} from "@/types/categories";
import {
  MEDIA_MIME_TYPES,
  type MediaFile,
} from "@/types/media";

import { AccessDenied } from "./AccessDenied";
import { useAdminConfirm } from "./AdminConfirmDialog";
import { AdminPageHeader } from "./AdminPageHeader";
import { AdminToast } from "./AdminToast";
import { RichTextEditor } from "./RichTextEditor";
import { StatusBadge } from "./StatusBadge";
import { useAdminUser } from "./AdminAuthContext";

type ArticleFormProps = {
  articleId?: number;
};

type CommonFormErrors = {
  categoryId?: string;
  sourceUrl?: string;
};

type TranslationFieldErrors = Partial<
  Record<"contentHtml" | "slug" | "summary" | "title", string>
>;

type TranslationFormValue = Omit<ArticleTranslationInput, "locale"> & {
  translationError?: string | null;
  translationStatus?: TranslationStatus;
};

type TranslationFormState = Record<LocaleCode, TranslationFormValue>;

type TranslationErrors = Record<LocaleCode, TranslationFieldErrors>;

type ThumbnailChoice = {
  altText: string | null;
  height: number;
  id: number;
  name: string;
  publicUrl: string;
  width: number;
};

type PendingThumbnail = {
  file: File;
  previewUrl: string;
};

const inputClassName =
  "h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm outline-none focus:border-[#1d2088] focus:ring-2 focus:ring-[#1d2088]/15 disabled:bg-slate-100 disabled:text-slate-500";
const textareaClassName =
  "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-sm outline-none focus:border-[#1d2088] focus:ring-2 focus:ring-[#1d2088]/15 disabled:bg-slate-100 disabled:text-slate-500";
const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  dateStyle: "short",
  timeStyle: "short",
});
const ARTICLE_LOCALES = ["vi", "en", "zh"] as const;
const MAX_THUMBNAIL_SIZE_BYTES = 5 * 1024 * 1024;
const localeLabels: Record<LocaleCode, string> = {
  vi: "Tiếng Việt",
  en: "English",
  zh: "中文",
};
const translationStatusLabels: Partial<Record<TranslationStatus, string>> = {
  queued: "Chờ dịch",
  translating: "Đang dịch",
  auto_translated: "Dịch tự động",
  reviewed: "Đã chỉnh sửa",
  outdated: "Có thể đã cũ",
  failed: "Dịch lỗi",
};

function createEmptyTranslation(): TranslationFormValue {
  return {
    contentHtml: "",
    seoDescription: "",
    seoTitle: "",
    slug: "",
    summary: "",
    thumbnailAltText: "",
    title: "",
  };
}

function createEmptyTranslations(): TranslationFormState {
  return {
    vi: createEmptyTranslation(),
    en: createEmptyTranslation(),
    zh: createEmptyTranslation(),
  };
}

function createEmptyTranslationErrors(): TranslationErrors {
  return { vi: {}, en: {}, zh: {} };
}

function toTranslationFormState(article: ArticleDetail): TranslationFormState {
  const nextTranslations = createEmptyTranslations();

  for (const translation of article.translations) {
    nextTranslations[translation.locale] = {
      contentHtml: translation.contentHtml ?? "",
      seoDescription: translation.seoDescription ?? "",
      seoTitle: translation.seoTitle ?? "",
      slug: translation.slug ?? "",
      summary: translation.summary ?? "",
      thumbnailAltText: translation.thumbnailAltText ?? "",
      title: translation.title ?? "",
      translationError: translation.translationError,
      translationStatus: translation.translationStatus,
    };
  }

  return nextTranslations;
}

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
  const { confirmAction, confirmDialog } = useAdminConfirm();
  const isEditing = articleId !== undefined;
  const isAdmin = user.role === "admin";
  const slugWasEditedRef = useRef<Record<LocaleCode, boolean>>({
    vi: isEditing,
    en: isEditing,
    zh: isEditing,
  });
  const pendingThumbnailUrlRef = useRef<string | null>(null);
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [activeLocale, setActiveLocale] = useState<LocaleCode>("vi");
  const [translations, setTranslations] = useState<TranslationFormState>(
    createEmptyTranslations,
  );
  const [selectedThumbnail, setSelectedThumbnail] =
    useState<ThumbnailChoice | null>(null);
  const [pendingThumbnail, setPendingThumbnail] =
    useState<PendingThumbnail | null>(null);
  const [thumbnailError, setThumbnailError] = useState("");
  const [commonErrors, setCommonErrors] = useState<CommonFormErrors>({});
  const [translationErrors, setTranslationErrors] = useState<TranslationErrors>(
    createEmptyTranslationErrors,
  );
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [overwriteTranslations, setOverwriteTranslations] = useState(false);
  const [editorRevision, setEditorRevision] = useState(0);
  const [translationNotice, setTranslationNotice] = useState<{
    kind: "success" | "warning";
    text: string;
  } | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isForbidden, setIsForbidden] = useState(false);

  const loadFormData = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);
    setApiError("");
    try {
      const [categoriesResponse, articleResponse] = await Promise.all([
          getAdminCategories({
            isActive: true,
            limit: 100,
            locale: "vi",
            page: 1,
          }),
          articleId !== undefined
            ? getAdminArticleById(articleId)
            : Promise.resolve(null),
        ]);
      const fixedCodes = new Set<string>(FIXED_CATEGORY_CODES);
      setCategories(
        categoriesResponse.data.filter(
          (category) => category.isActive && fixedCodes.has(category.code),
        ),
      );

      if (articleResponse) {
        const nextTranslations = toTranslationFormState(articleResponse);
        for (const translation of articleResponse.translations) {
          slugWasEditedRef.current[translation.locale] = Boolean(
            translation.slug,
          );
        }
        setTranslations(nextTranslations);
        setArticle(articleResponse);
        setCategoryId(String(articleResponse.categoryId ?? ""));
        setSourceUrl(articleResponse.sourceUrl ?? "");
        setIsFeatured(articleResponse.isFeatured);

        if (articleResponse.thumbnail) {
          setSelectedThumbnail({
            altText: articleResponse.thumbnail.altText,
            height: articleResponse.thumbnail.height,
            id: articleResponse.thumbnail.id,
            name: "Ảnh đại diện hiện tại",
            publicUrl: articleResponse.thumbnail.publicUrl,
            width: articleResponse.thumbnail.width,
          });
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

  useEffect(
    () => () => {
      if (pendingThumbnailUrlRef.current) {
        URL.revokeObjectURL(pendingThumbnailUrlRef.current);
      }
    },
    [],
  );

  function clearPendingThumbnail() {
    if (pendingThumbnailUrlRef.current) {
      URL.revokeObjectURL(pendingThumbnailUrlRef.current);
      pendingThumbnailUrlRef.current = null;
    }
    setPendingThumbnail(null);
  }

  function handleThumbnailFile(file: File | undefined) {
    if (!file) return;

    if (
      !MEDIA_MIME_TYPES.includes(
        file.type as (typeof MEDIA_MIME_TYPES)[number],
      )
    ) {
      setThumbnailError("Chỉ hỗ trợ ảnh JPG, JPEG, PNG hoặc WebP.");
      return;
    }

    if (file.size > MAX_THUMBNAIL_SIZE_BYTES) {
      setThumbnailError("Ảnh đại diện không được vượt quá 5MB.");
      return;
    }

    clearPendingThumbnail();
    const previewUrl = URL.createObjectURL(file);
    pendingThumbnailUrlRef.current = previewUrl;
    setPendingThumbnail({ file, previewUrl });
    setSelectedThumbnail(null);
    setThumbnailError("");
  }

  function updateTranslation(
    locale: LocaleCode,
    field: keyof ArticleTranslationInput,
    value: string,
  ) {
    if (field === "locale") return;
    setTranslations((current) => ({
      ...current,
      [locale]: { ...current[locale], [field]: value },
    }));
    setTranslationErrors((current) => ({
      ...current,
      [locale]: { ...current[locale], [field]: undefined },
    }));
  }

  function hasAnyTranslationContent(value: TranslationFormValue) {
    return [
      value.title,
      value.slug,
      value.summary,
      value.contentHtml,
      value.seoTitle,
      value.seoDescription,
      value.thumbnailAltText,
    ].some((field) => field.trim().length > 0);
  }

  function validateForm() {
    const nextCommonErrors: CommonFormErrors = {};
    const nextTranslationErrors = createEmptyTranslationErrors();
    let firstInvalidLocale: LocaleCode | null = null;

    if (!categoryId) {
      nextCommonErrors.categoryId = "Vui lòng chọn danh mục.";
    }
    if (sourceUrl.trim()) {
      try {
        const parsedUrl = new URL(sourceUrl.trim());
        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
          throw new Error("Invalid protocol");
        }
      } catch {
        nextCommonErrors.sourceUrl =
          "Source URL phải là đường dẫn http:// hoặc https:// hợp lệ.";
      }
    }

    for (const locale of ARTICLE_LOCALES) {
      const value = translations[locale];
      const isRequired = locale === "vi" || hasAnyTranslationContent(value);
      if (!isRequired) continue;

      if (!value.title.trim()) {
        nextTranslationErrors[locale].title = "Vui lòng nhập tiêu đề bài viết.";
      }
      if (!value.slug.trim()) {
        nextTranslationErrors[locale].slug = "Vui lòng nhập slug.";
      } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.slug.trim())) {
        nextTranslationErrors[locale].slug =
          "Slug chỉ được chứa chữ thường, số và dấu gạch ngang.";
      }
      if (!value.summary.trim()) {
        nextTranslationErrors[locale].summary = "Vui lòng nhập mô tả ngắn.";
      }
      if (isContentEmpty(value.contentHtml)) {
        nextTranslationErrors[locale].contentHtml =
          "Vui lòng nhập nội dung bài viết.";
      }
      if (
        !firstInvalidLocale &&
        Object.keys(nextTranslationErrors[locale]).length > 0
      ) {
        firstInvalidLocale = locale;
      }
    }

    setCommonErrors(nextCommonErrors);
    setTranslationErrors(nextTranslationErrors);
    if (firstInvalidLocale) setActiveLocale(firstInvalidLocale);
    return Object.keys(nextCommonErrors).length === 0 && !firstInvalidLocale;
  }

  function buildTranslationPayload(): ArticleTranslationInput[] {
    return ARTICLE_LOCALES.map((locale) => ({
      locale,
      contentHtml: translations[locale].contentHtml,
      seoDescription: translations[locale].seoDescription,
      seoTitle: translations[locale].seoTitle,
      slug: translations[locale].slug,
      summary: translations[locale].summary,
      thumbnailAltText: translations[locale].thumbnailAltText,
      title: translations[locale].title,
    }));
  }

  async function handleAutoTranslate() {
    if (articleId === undefined || isSaving || isTranslating) return;
    const confirmed = await confirmAction({
      confirmLabel: "Dịch tự động",
      description:
        "Hệ thống sẽ dịch nội dung tiếng Việt sang English và 中文.",
      title: "Tiếp tục dịch tự động?",
      tone: "primary",
    });
    if (!confirmed) return;

    setIsTranslating(true);
    setApiError("");
    setTranslationNotice(null);

    try {
      const response = await translateArticle(articleId, {
        overwrite: overwriteTranslations,
        targets: ["en", "zh"],
      });
      setTranslations((current) => {
        const next = { ...current };
        for (const result of response.results) {
          next[result.locale] = {
            contentHtml: result.contentHtml ?? "",
            seoDescription: result.seoDescription ?? "",
            seoTitle: result.seoTitle ?? "",
            slug: result.slug ?? "",
            summary: result.summary ?? "",
            thumbnailAltText: result.thumbnailAltText ?? "",
            title: result.title ?? "",
            translationError: result.translationError,
            translationStatus: result.status,
          };
          slugWasEditedRef.current[result.locale] = Boolean(result.slug);
        }
        return next;
      });
      setEditorRevision((current) => current + 1);

      const firstTranslated = response.results.find(
        (result) => !result.skipped,
      );
      if (firstTranslated) setActiveLocale(firstTranslated.locale);

      if (response.results.some((result) => result.skipped)) {
        setTranslationNotice({
          kind: "warning",
          text: "Một số bản dịch đã được chỉnh sửa thủ công nên không bị ghi đè",
        });
      } else {
        setTranslationNotice({
          kind: "success",
          text: "Dịch tự động thành công",
        });
      }
    } catch (error: unknown) {
      if (error instanceof ApiError && error.status === 403) {
        setIsForbidden(true);
      } else if (error instanceof ApiError && error.status === 503) {
        setApiError("Dịch tự động chưa được cấu hình");
      } else {
        setApiError("Không thể dịch tự động. Vui lòng thử lại.");
      }

      try {
        const latestArticle = await getAdminArticleById(articleId);
        setArticle(latestArticle);
        setTranslations(toTranslationFormState(latestArticle));
        setEditorRevision((current) => current + 1);
      } catch {
        // Giữ nguyên lỗi dịch ban đầu nếu không thể tải lại chi tiết.
      }
    } finally {
      setIsTranslating(false);
    }
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
    setTranslationNotice(null);

    try {
      let thumbnail = selectedThumbnail;

      if (pendingThumbnail) {
        const uploadedMedia = await uploadMedia(
          pendingThumbnail.file,
          translations.vi.thumbnailAltText,
        );
        thumbnail = toThumbnailChoice(uploadedMedia);
        setSelectedThumbnail(thumbnail);
        clearPendingThumbnail();
      }

      if (articleId !== undefined) {
        const payload: UpdateArticleData = {
          categoryId: Number(categoryId),
          sourceUrl: sourceUrl.trim() || null,
          thumbnailId: thumbnail?.id ?? null,
          translations: buildTranslationPayload(),
        };
        await updateArticle(articleId, payload);
        router.push("/admin/articles?updated=1");
      } else {
        const payload: CreateArticleData = {
          categoryId: Number(categoryId),
          ...(isAdmin ? { isFeatured } : {}),
          ...(sourceUrl.trim() ? { sourceUrl: sourceUrl.trim() } : {}),
          status: requestedStatus,
          ...(thumbnail ? { thumbnailId: thumbnail.id } : {}),
          translations: buildTranslationPayload(),
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
  const activeTranslation = translations[activeLocale];
  const activeErrors = translationErrors[activeLocale];
  const statusLabel =
    activeLocale === "vi"
      ? null
      : translationStatusLabels[
          activeTranslation.translationStatus ?? "queued"
        ];
  const isBusy = isSaving || isTranslating;

  return (
    <>
      {confirmDialog}
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
            ? "Cập nhật nội dung tiếng Việt, English và 中文."
            : "Tiếng Việt bắt buộc; English và 中文 có thể bổ sung sau."
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
          <section className="mb-5 flex flex-wrap gap-x-6 gap-y-2 rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-600 shadow-sm">
            <p>
              Người tạo:{" "}
              <strong className="text-slate-800">
                {article?.createdBy.fullName ?? user.name}
              </strong>
            </p>
            {article ? (
              <>
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
              </>
            ) : null}
          </section>
          {apiError ? (
            <AdminToast
              message={apiError}
              onDismiss={() => setApiError("")}
              tone="error"
            />
          ) : translationNotice ? (
            <AdminToast
              message={translationNotice.text}
              onDismiss={() => setTranslationNotice(null)}
              tone={translationNotice.kind}
            />
          ) : null}
          <form
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
            noValidate
            onSubmit={handleSubmit}
          >
            <fieldset className="contents" disabled={isBusy}>
              <section className="grid gap-5">
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
                        setCommonErrors((current) => ({
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
                    <FieldError message={commonErrors.categoryId} />
                  </label>
                  <div>
                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                      Ảnh đại diện
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <label className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                        <ImageIcon aria-hidden="true" size={18} />
                        Chọn ảnh từ thiết bị
                        <input
                          accept={MEDIA_MIME_TYPES.join(",")}
                          className="sr-only"
                          onChange={(event) => {
                            handleThumbnailFile(event.target.files?.[0]);
                            event.target.value = "";
                          }}
                          type="file"
                        />
                      </label>
                      {selectedThumbnail || pendingThumbnail ? (
                        <button
                          className="h-11 rounded-lg border border-red-200 px-4 text-sm font-semibold text-red-600 hover:bg-red-50"
                          disabled={isSaving}
                          onClick={() => {
                            clearPendingThumbnail();
                            setSelectedThumbnail(null);
                            setThumbnailError("");
                          }}
                          type="button"
                        >
                          Bỏ chọn ảnh
                        </button>
                      ) : null}
                    </div>
                    {thumbnailError ? (
                      <p className="mt-1.5 text-sm text-red-600" role="alert">
                        {thumbnailError}
                      </p>
                    ) : (
                      <p className="mt-1.5 text-xs text-slate-500">
                        Hỗ trợ JPG, JPEG, PNG, WebP; tối đa 5MB.
                      </p>
                    )}
                  </div>
                </div>
                {pendingThumbnail || selectedThumbnail ? (
                  <div className="flex max-w-xl items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <img
                      alt={
                        pendingThumbnail
                          ? translations.vi.thumbnailAltText ||
                            pendingThumbnail.file.name
                          : selectedThumbnail?.altText ||
                            selectedThumbnail?.name ||
                            "Ảnh đại diện"
                      }
                      className="h-24 w-32 shrink-0 rounded-lg object-cover"
                      src={
                        pendingThumbnail?.previewUrl ??
                        selectedThumbnail?.publicUrl
                      }
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {pendingThumbnail?.file.name ?? selectedThumbnail?.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {pendingThumbnail
                          ? "Sẽ tải lên khi lưu bài viết"
                          : `${selectedThumbnail?.width} × ${selectedThumbnail?.height}px`}
                      </p>
                    </div>
                  </div>
                ) : null}
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
                      setCommonErrors((current) => ({
                        ...current,
                        sourceUrl: undefined,
                      }));
                    }}
                    placeholder="https://..."
                    type="url"
                    value={sourceUrl}
                  />
                  <FieldError message={commonErrors.sourceUrl} />
                </label>
                {!isEditing && isAdmin ? (
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <input
                      checked={isFeatured}
                      className="size-4 accent-[#1d2088]"
                      disabled={isSaving}
                      onChange={(event) => setIsFeatured(event.target.checked)}
                      type="checkbox"
                    />
                    Đặt bài viết làm nổi bật
                  </label>
                ) : null}
              </section>

              <section className="mt-7 border-t border-slate-200 pt-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-slate-50 p-3">
                  {isEditing ? (
                    <>
                      <button
                        className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1d2088] px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={isBusy}
                        onClick={() => void handleAutoTranslate()}
                        type="button"
                      >
                        <Languages aria-hidden="true" className="size-4" />
                        {isTranslating ? "Đang dịch..." : "Dịch tự động"}
                      </button>
                      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                        <input
                          checked={overwriteTranslations}
                          className="size-4 accent-[#1d2088]"
                          disabled={isBusy}
                          onChange={(event) =>
                            setOverwriteTranslations(event.target.checked)
                          }
                          type="checkbox"
                        />
                        Ghi đè bản dịch hiện có
                      </label>
                    </>
                  ) : (
                    <p className="text-sm text-slate-600">
                      Vui lòng lưu bài viết trước khi dịch tự động
                    </p>
                  )}
                </div>
                <div className="flex gap-1 overflow-x-auto border-b border-slate-200">
                  {ARTICLE_LOCALES.map((locale) => (
                    <button
                      aria-selected={activeLocale === locale}
                      className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold ${
                        activeLocale === locale
                          ? "border-[#1d2088] text-[#1d2088]"
                          : "border-transparent text-slate-500 hover:text-slate-800"
                      }`}
                      key={locale}
                      onClick={() => setActiveLocale(locale)}
                      role="tab"
                      type="button"
                    >
                      {localeLabels[locale]}
                      {locale === "vi" ? (
                        <span className="ml-1 text-red-600">*</span>
                      ) : null}
                    </button>
                  ))}
                </div>

                <div className="grid gap-5 pt-5" role="tabpanel">
                  {statusLabel ? (
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                        {statusLabel}
                      </span>
                      {activeTranslation.translationStatus === "outdated" ? (
                        <p className="text-sm text-amber-700">
                          Bản dịch này có thể đã cũ vì nội dung tiếng Việt đã
                          thay đổi.
                        </p>
                      ) : null}
                      {activeTranslation.translationStatus === "failed" &&
                      activeTranslation.translationError ? (
                        <p className="text-sm text-red-700">
                          {activeTranslation.translationError}
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                  <label>
                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                      Tiêu đề
                      {activeLocale === "vi" ? (
                        <span className="ml-1 text-red-600">*</span>
                      ) : null}
                    </span>
                    <input
                      className={inputClassName}
                      disabled={isSaving}
                      maxLength={500}
                      onChange={(event) => {
                        const nextTitle = event.target.value;
                        updateTranslation(activeLocale, "title", nextTitle);
                        if (!slugWasEditedRef.current[activeLocale]) {
                          updateTranslation(
                            activeLocale,
                            "slug",
                            normalizeSlug(nextTitle),
                          );
                        }
                      }}
                      value={activeTranslation.title}
                    />
                    <FieldError message={activeErrors.title} />
                  </label>
                  <label>
                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                      Slug
                      {activeLocale === "vi" ? (
                        <span className="ml-1 text-red-600">*</span>
                      ) : null}
                    </span>
                    <input
                      autoCapitalize="none"
                      className={inputClassName}
                      disabled={isSaving}
                      maxLength={500}
                      onChange={(event) => {
                        slugWasEditedRef.current[activeLocale] = true;
                        updateTranslation(
                          activeLocale,
                          "slug",
                          event.target.value.toLowerCase(),
                        );
                      }}
                      spellCheck={false}
                      value={activeTranslation.slug}
                    />
                    <FieldError message={activeErrors.slug} />
                  </label>
                  <label>
                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                      Mô tả ngắn
                      {activeLocale === "vi" ? (
                        <span className="ml-1 text-red-600">*</span>
                      ) : null}
                    </span>
                    <textarea
                      className={textareaClassName}
                      disabled={isSaving}
                      onChange={(event) =>
                        updateTranslation(
                          activeLocale,
                          "summary",
                          event.target.value,
                        )
                      }
                      rows={3}
                      value={activeTranslation.summary}
                    />
                    <FieldError message={activeErrors.summary} />
                  </label>
                  <div>
                    <span
                      className="mb-2 block text-sm font-semibold text-slate-700"
                      id={`article-content-label-${activeLocale}`}
                    >
                      Nội dung
                      {activeLocale === "vi" ? (
                        <span className="ml-1 text-red-600">*</span>
                      ) : null}
                    </span>
                    <RichTextEditor
                      error={Boolean(activeErrors.contentHtml)}
                      errorId={
                        activeErrors.contentHtml
                          ? `article-content-error-${activeLocale}`
                          : undefined
                      }
                      key={`${activeLocale}-${editorRevision}`}
                      labelId={`article-content-label-${activeLocale}`}
                      onChange={(html) =>
                        updateTranslation(activeLocale, "contentHtml", html)
                      }
                      value={activeTranslation.contentHtml}
                    />
                    <FieldError
                      id={`article-content-error-${activeLocale}`}
                      message={activeErrors.contentHtml}
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
                        onChange={(event) =>
                          updateTranslation(
                            activeLocale,
                            "seoTitle",
                            event.target.value,
                          )
                        }
                        value={activeTranslation.seoTitle}
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
                          updateTranslation(
                            activeLocale,
                            "seoDescription",
                            event.target.value,
                          )
                        }
                        rows={3}
                        value={activeTranslation.seoDescription}
                      />
                    </label>
                  </div>
                  <label>
                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                      Thumbnail alt text
                    </span>
                    <input
                      className={inputClassName}
                      disabled={isSaving}
                      maxLength={500}
                      onChange={(event) =>
                        updateTranslation(
                          activeLocale,
                          "thumbnailAltText",
                          event.target.value,
                        )
                      }
                      value={activeTranslation.thumbnailAltText}
                    />
                  </label>
                </div>
              </section>

              <div className="mt-7 flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-5">
                {isEditing ? (
                  <button
                    className="h-10 rounded-lg bg-[#1d2088] px-5 text-sm font-semibold text-white disabled:opacity-60"
                    disabled={isSaving}
                    type="submit"
                  >
                    {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                  </button>
                ) : (
                  <>
                    <button
                      className="h-10 rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700 disabled:opacity-60"
                      disabled={isSaving}
                      type="submit"
                      value="draft"
                    >
                      {isSaving ? "Đang lưu..." : "Lưu nháp"}
                    </button>
                    <button
                      className="h-10 rounded-lg bg-[#1d2088] px-4 text-sm font-semibold text-white disabled:opacity-60"
                      disabled={isSaving}
                      type="submit"
                      value="published"
                    >
                      {isSaving ? "Đang đăng..." : "Đăng bài"}
                    </button>
                  </>
                )}
              </div>
            </fieldset>
          </form>
        </>
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
