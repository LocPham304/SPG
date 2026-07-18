"use client";

import {
  ImageIcon,
  Pencil,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import {
  type ChangeEvent,
  type FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { ApiError } from "@/lib/api";
import {
  deleteMedia,
  getMedia,
  updateMedia,
  uploadMedia,
} from "@/services/media.service";
import type {
  MediaFile,
  MediaListResponse,
  MediaMimeType,
} from "@/types/media";

import { AccessDenied } from "./AccessDenied";
import { AdminPageHeader } from "./AdminPageHeader";

const PAGE_SIZE = 12;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);
const ALLOWED_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp"]);
const inputClassName =
  "h-10 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-800 outline-none transition focus:border-[#1d2088] focus:ring-2 focus:ring-[#1d2088]/15 disabled:bg-slate-100 disabled:text-slate-500";
const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  dateStyle: "short",
  timeStyle: "short",
});

type Notice = {
  text: string;
  tone: "error" | "success";
};

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Không xác định"
    : dateFormatter.format(date);
}

function formatFileSize(bytes: number) {
  if (!Number.isFinite(bytes) || bytes < 0) return "Không xác định";
  if (bytes < 1024) return `${bytes} B`;

  const kilobytes = bytes / 1024;
  if (kilobytes < 1024) {
    return `${kilobytes.toFixed(kilobytes >= 100 ? 0 : 1)} KB`;
  }

  const megabytes = kilobytes / 1024;
  return `${megabytes.toFixed(megabytes >= 10 ? 1 : 2)} MB`;
}

function getMimeLabel(mimeType: string) {
  const labels: Record<string, string> = {
    "image/jpeg": "JPEG",
    "image/png": "PNG",
    "image/webp": "WebP",
  };

  return labels[mimeType] ?? mimeType;
}

function validateFile(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";

  if (
    !ALLOWED_FILE_TYPES.has(file.type.toLowerCase()) ||
    !ALLOWED_EXTENSIONS.has(extension)
  ) {
    return "Chỉ chấp nhận file JPG, JPEG, PNG hoặc WebP.";
  }

  if (file.size < 1) {
    return "File ảnh không hợp lệ.";
  }

  if (file.size > MAX_FILE_SIZE) {
    return "Ảnh không được vượt quá 5MB.";
  }

  return null;
}

function MediaLoading() {
  return (
    <div
      aria-label="Đang tải thư viện ảnh"
      className="grid animate-pulse gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
      role="status"
    >
      {Array.from({ length: 8 }, (_, index) => (
        <div
          className="overflow-hidden rounded-xl border border-slate-200"
          key={index}
        >
          <div className="aspect-[4/3] bg-slate-100" />
          <div className="grid gap-2 p-4">
            <div className="h-4 w-3/4 rounded bg-slate-100" />
            <div className="h-3 w-full rounded bg-slate-100" />
            <div className="h-3 w-2/3 rounded bg-slate-100" />
          </div>
        </div>
      ))}
      <span className="sr-only">Đang tải thư viện ảnh...</span>
    </div>
  );
}

export function AdminMedia() {
  const [response, setResponse] =
    useState<MediaListResponse | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [mimeType, setMimeType] = useState<"" | MediaMimeType>("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isForbidden, setIsForbidden] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [pendingMediaId, setPendingMediaId] = useState<number | null>(
    null,
  );
  const [editingMedia, setEditingMedia] = useState<MediaFile | null>(
    null,
  );
  const [editError, setEditError] = useState("");
  const requestIdRef = useRef(0);

  const loadMedia = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setIsLoading(true);
    setHasError(false);

    try {
      const data = await getMedia({
        limit: PAGE_SIZE,
        mimeType: mimeType || undefined,
        page,
        search: search || undefined,
      });

      if (requestId !== requestIdRef.current) return;

      const lastPage = Math.max(1, data.meta.totalPages);
      if (page > lastPage) {
        setPage(lastPage);
        return;
      }

      setResponse(data);
    } catch (error: unknown) {
      if (requestId !== requestIdRef.current) return;

      setResponse(null);
      if (error instanceof ApiError && error.status === 403) {
        setIsForbidden(true);
      } else {
        setHasError(true);
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [mimeType, page, search]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [searchInput]);

  useEffect(() => {
    void loadMedia();
  }, [loadMedia]);

  async function handleUploadSuccess() {
    setNotice({
      text: "Tải ảnh lên thành công",
      tone: "success",
    });

    if (page !== 1) {
      setPage(1);
    } else {
      await loadMedia();
    }
  }

  async function handleUpdateAltText(altText: string) {
    if (!editingMedia) return;

    const mediaId = editingMedia.id;
    setPendingMediaId(mediaId);
    setEditError("");
    setNotice(null);

    try {
      await updateMedia(mediaId, {
        altText: altText.trim() || null,
      });
      setEditingMedia(null);
      setNotice({
        text: "Cập nhật mô tả ảnh thành công",
        tone: "success",
      });
      await loadMedia();
    } catch (error: unknown) {
      if (error instanceof ApiError && error.status === 403) {
        setIsForbidden(true);
      } else {
        setEditError("Đã có lỗi xảy ra. Vui lòng thử lại.");
      }
    } finally {
      setPendingMediaId(null);
    }
  }

  async function handleDelete(media: MediaFile) {
    if (!window.confirm("Bạn có chắc muốn xóa ảnh này?")) return;

    setPendingMediaId(media.id);
    setNotice(null);

    try {
      await deleteMedia(media.id);
      setNotice({
        text: "Xóa ảnh thành công",
        tone: "success",
      });
      await loadMedia();
    } catch (error: unknown) {
      if (error instanceof ApiError && error.status === 403) {
        setIsForbidden(true);
      } else {
        setNotice({
          text:
            error instanceof ApiError && error.status === 409
              ? "Không thể xóa ảnh đang được sử dụng"
              : "Đã có lỗi xảy ra. Vui lòng thử lại.",
          tone: "error",
        });
      }
    } finally {
      setPendingMediaId(null);
    }
  }

  if (isForbidden) return <AccessDenied />;

  const mediaFiles = response?.data ?? [];
  const meta = response?.meta;

  return (
    <>
      <AdminPageHeader
        description="Tải lên và quản lý hình ảnh sử dụng trong nội dung website."
        title="Thư viện ảnh"
      />

      {notice ? (
        <p
          className={`mb-4 rounded-lg border px-4 py-3 text-sm ${
            notice.tone === "success"
              ? "border-emerald-100 bg-emerald-50 text-emerald-700"
              : "border-red-100 bg-red-50 text-red-700"
          }`}
          role={notice.tone === "error" ? "alert" : "status"}
        >
          {notice.text}
        </p>
      ) : null}

      <MediaUpload
        onForbidden={() => setIsForbidden(true)}
        onSuccess={handleUploadSuccess}
      />

      <section className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-3 border-b border-slate-200 p-4 md:grid-cols-[minmax(260px,1fr)_200px]">
          <label>
            <span className="sr-only">
              Tìm kiếm theo tên file hoặc mô tả
            </span>
            <input
              className={inputClassName}
              maxLength={255}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Tìm theo tên file hoặc mô tả..."
              type="search"
              value={searchInput}
            />
          </label>

          <label>
            <span className="sr-only">Lọc theo định dạng ảnh</span>
            <select
              className={inputClassName}
              onChange={(event) => {
                setMimeType(event.target.value as "" | MediaMimeType);
                setPage(1);
              }}
              value={mimeType}
            >
              <option value="">Tất cả định dạng</option>
              <option value="image/jpeg">JPEG</option>
              <option value="image/png">PNG</option>
              <option value="image/webp">WebP</option>
            </select>
          </label>
        </div>

        {isLoading ? <MediaLoading /> : null}

        {!isLoading && hasError ? (
          <div className="px-5 py-12 text-center" role="alert">
            <p className="font-semibold text-slate-800">
              Không thể tải thư viện ảnh. Vui lòng thử lại.
            </p>
            <button
              className="mt-4 h-10 rounded-lg bg-[#1d2088] px-4 text-sm font-semibold text-white hover:bg-[#171a70]"
              onClick={() => void loadMedia()}
              type="button"
            >
              Thử lại
            </button>
          </div>
        ) : null}

        {!isLoading && !hasError && mediaFiles.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <ImageIcon
              aria-hidden="true"
              className="mx-auto text-slate-300"
              size={42}
            />
            <p className="mt-3 font-semibold text-slate-700">
              Chưa có ảnh nào
            </p>
          </div>
        ) : null}

        {!isLoading && !hasError && mediaFiles.length > 0 ? (
          <>
            <div className="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {mediaFiles.map((media) => (
                <MediaCard
                  isPending={pendingMediaId === media.id}
                  key={media.id}
                  media={media}
                  onDelete={() => void handleDelete(media)}
                  onEdit={() => {
                    setEditError("");
                    setEditingMedia(media);
                  }}
                />
              ))}
            </div>

            {meta ? (
              <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 text-sm sm:flex-row">
                <p className="text-slate-500">
                  Tổng cộng {meta.total} ảnh
                </p>
                <div className="flex items-center gap-3">
                  <button
                    className="h-9 rounded-lg border border-slate-300 bg-white px-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                    disabled={page <= 1}
                    onClick={() =>
                      setPage((current) => Math.max(1, current - 1))
                    }
                    type="button"
                  >
                    Trang trước
                  </button>
                  <span className="text-slate-600">
                    Trang {meta.page}/{Math.max(1, meta.totalPages)}
                  </span>
                  <button
                    className="h-9 rounded-lg border border-slate-300 bg-white px-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                    disabled={page >= meta.totalPages}
                    onClick={() => setPage((current) => current + 1)}
                    type="button"
                  >
                    Trang sau
                  </button>
                </div>
              </div>
            ) : null}
          </>
        ) : null}
      </section>

      {editingMedia ? (
        <EditAltTextModal
          error={editError}
          isSaving={pendingMediaId === editingMedia.id}
          media={editingMedia}
          onClose={() => {
            setEditError("");
            setEditingMedia(null);
          }}
          onSubmit={handleUpdateAltText}
        />
      ) : null}
    </>
  );
}

type MediaUploadProps = {
  onForbidden: () => void;
  onSuccess: () => Promise<void>;
};

function MediaUpload({
  onForbidden,
  onSuccess,
}: MediaUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [altText, setAltText] = useState("");
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0] ?? null;
    setFile(selectedFile);
    setError(selectedFile ? validateFile(selectedFile) ?? "" : "");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file) {
      setError("Vui lòng chọn một file ảnh.");
      return;
    }

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setIsUploading(true);

    try {
      await uploadMedia(file, altText);
      setFile(null);
      setAltText("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      await onSuccess();
    } catch (uploadError: unknown) {
      if (uploadError instanceof ApiError && uploadError.status === 403) {
        onForbidden();
      } else if (
        uploadError instanceof ApiError &&
        uploadError.status === 400
      ) {
        setError(
          uploadError.message ||
            "File ảnh không hợp lệ. Vui lòng kiểm tra lại.",
        );
      } else {
        setError("Đã có lỗi xảy ra. Vui lòng thử lại.");
      }
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-base font-bold text-slate-900">
          Tải ảnh lên
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Hỗ trợ JPG, JPEG, PNG, WebP; dung lượng tối đa 5MB.
        </p>
      </div>

      <form
        className="grid items-end gap-4 lg:grid-cols-[minmax(240px,1fr)_minmax(280px,1fr)_auto]"
        noValidate
        onSubmit={handleSubmit}
      >
        <label>
          <span className="mb-1.5 block text-sm font-semibold text-slate-700">
            Chọn file ảnh
          </span>
          <input
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            className="block h-10 w-full rounded-lg border border-slate-300 bg-white text-sm text-slate-600 file:mr-3 file:h-full file:border-0 file:border-r file:border-slate-200 file:bg-slate-50 file:px-3 file:text-sm file:font-semibold file:text-slate-700"
            disabled={isUploading}
            onChange={handleFileChange}
            ref={fileInputRef}
            type="file"
          />
        </label>

        <label>
          <span className="mb-1.5 block text-sm font-semibold text-slate-700">
            Mô tả ảnh
            <span className="ml-1 font-normal text-slate-400">
              (không bắt buộc)
            </span>
          </span>
          <input
            className={inputClassName}
            disabled={isUploading}
            maxLength={255}
            onChange={(event) => setAltText(event.target.value)}
            placeholder="Nhập nội dung alt text..."
            value={altText}
          />
        </label>

        <button
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#1d2088] px-5 text-sm font-semibold text-white hover:bg-[#171a70] disabled:opacity-60"
          disabled={isUploading}
          type="submit"
        >
          <Upload aria-hidden="true" size={17} />
          {isUploading ? "Đang tải lên..." : "Tải lên"}
        </button>
      </form>

      {file && !error ? (
        <p className="mt-3 text-sm text-slate-500">
          Đã chọn: {file.name} ({formatFileSize(file.size)})
        </p>
      ) : null}

      {error ? (
        <p
          className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </section>
  );
}

type MediaCardProps = {
  isPending: boolean;
  media: MediaFile;
  onDelete: () => void;
  onEdit: () => void;
};

function MediaCard({
  isPending,
  media,
  onDelete,
  onEdit,
}: MediaCardProps) {
  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        {/* Dynamic Supabase URLs cannot be enumerated in Next image config. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt={media.altText || media.originalName}
          className="h-full w-full object-cover"
          loading="lazy"
          src={media.publicUrl}
        />
        <span className="absolute right-2 top-2 rounded-md bg-slate-950/75 px-2 py-1 text-[11px] font-semibold text-white">
          {getMimeLabel(media.mimeType)}
        </span>
      </div>

      <div className="p-4">
        <h3
          className="truncate text-sm font-bold text-slate-800"
          title={media.originalName}
        >
          {media.originalName}
        </h3>
        <p
          className="mt-1 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500"
          title={media.altText ?? undefined}
        >
          {media.altText || "Chưa có mô tả ảnh"}
        </p>

        <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
          <div>
            <dt className="inline text-slate-400">Kích thước: </dt>
            <dd className="inline font-medium text-slate-600">
              {media.width} × {media.height}
            </dd>
          </div>
          <div>
            <dt className="inline text-slate-400">Dung lượng: </dt>
            <dd className="inline font-medium text-slate-600">
              {formatFileSize(media.sizeBytes)}
            </dd>
          </div>
          <div className="col-span-2">
            <dt className="inline text-slate-400">Ngày tải: </dt>
            <dd className="inline font-medium text-slate-600">
              {formatDate(media.createdAt)}
            </dd>
          </div>
        </dl>

        <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">
          <button
            className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            disabled={isPending}
            onClick={onEdit}
            type="button"
          >
            <Pencil aria-hidden="true" size={15} />
            Sửa mô tả
          </button>
          <button
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-red-200 px-3 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
            disabled={isPending}
            onClick={onDelete}
            type="button"
          >
            <Trash2 aria-hidden="true" size={15} />
            {isPending ? "Đang xóa..." : "Xóa"}
          </button>
        </div>
      </div>
    </article>
  );
}

type EditAltTextModalProps = {
  error: string;
  isSaving: boolean;
  media: MediaFile;
  onClose: () => void;
  onSubmit: (altText: string) => Promise<void>;
};

function EditAltTextModal({
  error,
  isSaving,
  media,
  onClose,
  onSubmit,
}: EditAltTextModalProps) {
  const [altText, setAltText] = useState(media.altText ?? "");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void onSubmit(altText);
  }

  return (
    <div
      aria-labelledby="edit-media-title"
      aria-modal="true"
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 p-4"
      role="dialog"
    >
      <div className="w-full max-w-lg rounded-xl bg-white p-5 shadow-xl sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2
              className="text-lg font-bold text-slate-900"
              id="edit-media-title"
            >
              Sửa mô tả ảnh
            </h2>
            <p
              className="mt-1 truncate text-sm text-slate-500"
              title={media.originalName}
            >
              {media.originalName}
            </p>
          </div>
          <button
            aria-label="Đóng"
            className="flex size-9 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
            disabled={isSaving}
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" size={19} />
          </button>
        </div>

        <form noValidate onSubmit={handleSubmit}>
          <label>
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">
              Mô tả ảnh
            </span>
            <textarea
              className="min-h-28 w-full resize-y rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-[#1d2088] focus:ring-2 focus:ring-[#1d2088]/15"
              disabled={isSaving}
              maxLength={255}
              onChange={(event) => setAltText(event.target.value)}
              placeholder="Nhập nội dung alt text..."
              value={altText}
            />
          </label>
          <p className="mt-1 text-right text-xs text-slate-400">
            {altText.length}/255
          </p>

          {error ? (
            <p
              className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
              role="alert"
            >
              {error}
            </p>
          ) : null}

          <div className="mt-5 flex justify-end gap-3 border-t border-slate-200 pt-4">
            <button
              className="h-10 rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700"
              disabled={isSaving}
              onClick={onClose}
              type="button"
            >
              Hủy
            </button>
            <button
              className="h-10 rounded-lg bg-[#1d2088] px-4 text-sm font-semibold text-white disabled:opacity-60"
              disabled={isSaving}
              type="submit"
            >
              {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
