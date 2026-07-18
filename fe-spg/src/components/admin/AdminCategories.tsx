"use client";

import {
  Eye,
  EyeOff,
  Pencil,
} from "lucide-react";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { ApiError } from "@/lib/api";
import {
  getAdminCategories,
  updateCategoryStatus,
} from "@/services/categories.service";
import type {
  CategoriesListResponse,
  FixedCategoryCode,
  NewsCategory,
} from "@/types/categories";
import { FIXED_CATEGORY_CODES } from "@/types/categories";

import { AccessDenied } from "./AccessDenied";
import { AdminPageHeader } from "./AdminPageHeader";
import { useAdminUser } from "./AdminAuthContext";

const PAGE_SIZE = 10;
const filterClassName =
  "h-10 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm outline-none focus:border-[#1d2088] focus:ring-2 focus:ring-[#1d2088]/15 disabled:bg-slate-100 disabled:text-slate-500";
const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  dateStyle: "short",
  timeStyle: "short",
});

type Notice = {
  tone: "error" | "success";
  text: string;
};

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Không xác định"
    : dateFormatter.format(date);
}

function getVietnameseName(category: NewsCategory) {
  return (
    category.translations.find((item) => item.locale === "vi")?.name ??
    category.translations[0]?.name ??
    category.code
  );
}

function CategoriesLoading() {
  return (
    <div
      aria-label="Đang tải danh sách danh mục"
      className="animate-pulse p-4"
      role="status"
    >
      <div className="grid gap-3">
        {Array.from({ length: 5 }, (_, index) => (
          <div
            className="h-14 rounded-lg bg-slate-100"
            key={index}
          />
        ))}
      </div>
      <span className="sr-only">Đang tải danh sách danh mục...</span>
    </div>
  );
}

export function AdminCategories() {
  const currentUser = useAdminUser();
  const isAdmin = currentUser.role === "admin";
  const [response, setResponse] =
    useState<CategoriesListResponse | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"" | "active" | "hidden">("");
  const [homeVisibility, setHomeVisibility] = useState<
    "" | "shown" | "not_shown"
  >("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isForbidden, setIsForbidden] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [pendingAction, setPendingAction] = useState<number | null>(null);
  const requestIdRef = useRef(0);

  const loadCategories = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setIsLoading(true);
    setHasError(false);

    try {
      const data = await getAdminCategories({
        isActive:
          !isAdmin || status === ""
            ? undefined
            : status === "active",
        limit: PAGE_SIZE,
        page,
        search: search || undefined,
        showOnHome:
          homeVisibility === ""
            ? undefined
            : homeVisibility === "shown",
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
      if (requestId === requestIdRef.current) setIsLoading(false);
    }
  }, [homeVisibility, isAdmin, page, search, status]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [searchInput]);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const message =
      params.get("updated") === "1"
        ? "Cập nhật danh mục thành công"
        : null;

    if (message) {
      setNotice({ text: message, tone: "success" });
      window.history.replaceState(null, "", "/admin/categories");
    }
  }, []);

  if (isForbidden) return <AccessDenied />;

  function handleMutationError(error: unknown, conflictMessage?: string) {
    if (error instanceof ApiError && error.status === 403) {
      setIsForbidden(true);
      return;
    }

    setNotice({
      text:
        error instanceof ApiError &&
        error.status === 409 &&
        conflictMessage
          ? conflictMessage
          : "Đã có lỗi xảy ra. Vui lòng thử lại.",
      tone: "error",
    });
  }

  async function handleStatusChange(category: NewsCategory) {
    const nextIsActive = !category.isActive;

    if (
      !nextIsActive &&
      !window.confirm("Bạn có chắc muốn ẩn danh mục này?")
    ) {
      return;
    }

    setPendingAction(category.id);
    setNotice(null);

    try {
      await updateCategoryStatus(category.id, nextIsActive);
      setNotice({
        text: nextIsActive
          ? "Bật danh mục thành công"
          : "Ẩn danh mục thành công",
        tone: "success",
      });
      await loadCategories();
    } catch (error: unknown) {
      handleMutationError(error);
    } finally {
      setPendingAction(null);
    }
  }

  const fixedCategoryCodes = new Set<string>(FIXED_CATEGORY_CODES);
  const categories = (response?.data ?? []).filter(
    (category): category is NewsCategory & { code: FixedCategoryCode } =>
      fixedCategoryCodes.has(category.code),
  );
  const meta = response?.meta;

  return (
    <>
      <AdminPageHeader
        description={
          isAdmin
            ? "Quản lý danh mục bài viết và nội dung đa ngôn ngữ."
            : "Danh sách danh mục bài viết đang hoạt động."
        }
        title="Quản lý danh mục"
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

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-3 border-b border-slate-200 p-4 md:grid-cols-[minmax(260px,1fr)_190px_190px]">
          <label>
            <span className="sr-only">
              Tìm kiếm theo code, slug hoặc tên danh mục
            </span>
            <input
              className={filterClassName}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Tìm theo code, slug hoặc tên..."
              type="search"
              value={searchInput}
            />
          </label>

          <label>
            <span className="sr-only">Lọc theo trạng thái</span>
            <select
              className={filterClassName}
              disabled={!isAdmin}
              onChange={(event) => {
                setStatus(
                  event.target.value as "" | "active" | "hidden",
                );
                setPage(1);
              }}
              value={isAdmin ? status : "active"}
            >
              {isAdmin ? <option value="">Tất cả trạng thái</option> : null}
              <option value="active">Đang hoạt động</option>
              {isAdmin ? <option value="hidden">Đã ẩn</option> : null}
            </select>
          </label>

          <label>
            <span className="sr-only">
              Lọc theo hiển thị trang chủ
            </span>
            <select
              className={filterClassName}
              onChange={(event) => {
                setHomeVisibility(
                  event.target.value as
                    | ""
                    | "shown"
                    | "not_shown",
                );
                setPage(1);
              }}
              value={homeVisibility}
            >
              <option value="">Tất cả hiển thị</option>
              <option value="shown">Có hiển thị</option>
              <option value="not_shown">Không hiển thị</option>
            </select>
          </label>
        </div>

        {isLoading ? <CategoriesLoading /> : null}

        {!isLoading && hasError ? (
          <div className="px-5 py-12 text-center" role="alert">
            <p className="font-semibold text-slate-800">
              Không thể tải danh sách danh mục. Vui lòng thử lại.
            </p>
            <button
              className="mt-4 h-10 rounded-lg bg-[#1d2088] px-4 text-sm font-semibold text-white hover:bg-[#171a70]"
              onClick={() => void loadCategories()}
              type="button"
            >
              Thử lại
            </button>
          </div>
        ) : null}

        {!isLoading && !hasError && categories.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="m-0 font-semibold text-slate-700">
              Chưa có danh mục nào
            </p>
          </div>
        ) : null}

        {!isLoading && !hasError && categories.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] border-collapse text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold">
                      Tên danh mục tiếng Việt
                    </th>
                    <th className="px-4 py-3 font-semibold">Code</th>
                    <th className="px-4 py-3 font-semibold">Slug</th>
                    <th className="px-4 py-3 font-semibold">Thứ tự</th>
                    <th className="px-4 py-3 font-semibold">
                      Hiển thị trang chủ
                    </th>
                    <th className="px-4 py-3 font-semibold">
                      Trạng thái
                    </th>
                    <th className="px-4 py-3 font-semibold">Ngày tạo</th>
                    {isAdmin ? (
                      <th className="px-4 py-3 text-right font-semibold">
                        Hành động
                      </th>
                    ) : null}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {categories.map((category) => (
                    <tr
                      className="hover:bg-slate-50/70"
                      key={category.id}
                    >
                      <td className="px-4 py-4 font-semibold text-slate-800">
                        {getVietnameseName(category)}
                      </td>
                      <td className="px-4 py-4 text-slate-600">
                        {category.code}
                      </td>
                      <td className="px-4 py-4 text-slate-600">
                        {category.slug}
                      </td>
                      <td className="px-4 py-4 text-slate-600">
                        {category.sortOrder}
                      </td>
                      <td className="px-4 py-4">
                        <BooleanBadge
                          falseLabel="Không"
                          value={category.showOnHome}
                          trueLabel="Có"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <BooleanBadge
                          falseLabel="Đã ẩn"
                          value={category.isActive}
                          trueLabel="Đang hoạt động"
                        />
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                        {formatDate(category.createdAt)}
                      </td>
                      {isAdmin ? (
                        <td className="px-4 py-4">
                          <div className="flex justify-end gap-1">
                            <Link
                              aria-label={`Sửa ${getVietnameseName(category)}`}
                              className="flex size-9 items-center justify-center rounded-lg text-slate-500 hover:bg-blue-50 hover:text-[#1d2088]"
                              href={`/admin/categories/${category.id}/edit`}
                              title="Sửa danh mục"
                            >
                              <Pencil aria-hidden="true" size={17} />
                            </Link>
                            <button
                              aria-label={
                                category.isActive
                                  ? `Ẩn ${getVietnameseName(category)}`
                                  : `Bật ${getVietnameseName(category)}`
                              }
                              className="flex size-9 items-center justify-center rounded-lg text-slate-500 hover:bg-amber-50 hover:text-amber-700 disabled:opacity-40"
                              disabled={pendingAction !== null}
                              onClick={() =>
                                void handleStatusChange(category)
                              }
                              title={
                                category.isActive
                                  ? "Ẩn danh mục"
                                  : "Bật danh mục"
                              }
                              type="button"
                            >
                              {category.isActive ? (
                                <EyeOff aria-hidden="true" size={17} />
                              ) : (
                                <Eye aria-hidden="true" size={17} />
                              )}
                            </button>
                          </div>
                        </td>
                      ) : null}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {meta ? (
              <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 text-sm sm:flex-row">
                <p className="text-slate-500">
                  Tổng cộng {meta.total} danh mục
                </p>
                <div className="flex items-center gap-3">
                  <button
                    className="h-9 rounded-lg border border-slate-300 bg-white px-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
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
                    className="h-9 rounded-lg border border-slate-300 bg-white px-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
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
    </>
  );
}

type BooleanBadgeProps = {
  falseLabel: string;
  trueLabel: string;
  value: boolean;
};

function BooleanBadge({
  falseLabel,
  trueLabel,
  value,
}: BooleanBadgeProps) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${
        value
          ? "bg-emerald-50 text-emerald-700"
          : "bg-slate-100 text-slate-700"
      }`}
    >
      {value ? trueLabel : falseLabel}
    </span>
  );
}
