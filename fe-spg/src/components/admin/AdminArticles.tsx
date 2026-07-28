"use client";

import {
  EyeOff,
  FilePenLine,
  Pencil,
  Plus,
  Send,
  Star,
  Trash2,
  type LucideIcon,
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
  deleteArticle,
  getAdminArticles,
  hideArticle,
  moveArticleToDraft,
  publishArticle,
  setArticleFeatured,
} from "@/services/articles.service";
import { getAdminCategories } from "@/services/categories.service";
import type {
  ArticleListItem,
  ArticlesListResponse,
  ArticleStatus,
} from "@/types/articles";
import {
  FIXED_CATEGORY_CODES,
  getAdminCategoryName,
  getFixedCategoryName,
  type NewsCategory,
} from "@/types/categories";

import { AccessDenied } from "./AccessDenied";
import { useAdminConfirm } from "./AdminConfirmDialog";
import { AdminPageHeader } from "./AdminPageHeader";
import { AdminToast } from "./AdminToast";
import { StatusBadge } from "./StatusBadge";
import { useAdminUser } from "./AdminAuthContext";

const PAGE_SIZE = 10;
const inputClassName =
  "h-10 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm outline-none focus:border-[#1d2088] focus:ring-2 focus:ring-[#1d2088]/15";
const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  dateStyle: "short",
  timeStyle: "short",
});

type Notice = {
  text: string;
  tone: "error" | "success";
};

function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Không xác định"
    : dateFormatter.format(date);
}

function ArticlesLoading() {
  return (
    <div
      aria-label="Đang tải danh sách bài viết"
      className="animate-pulse p-4"
      role="status"
    >
      <div className="grid gap-3">
        {Array.from({ length: 7 }, (_, index) => (
          <div className="h-14 rounded-lg bg-slate-100" key={index} />
        ))}
      </div>
      <span className="sr-only">Đang tải danh sách bài viết...</span>
    </div>
  );
}

export function AdminArticles() {
  const currentUser = useAdminUser();
  const { confirmAction, confirmDialog } = useAdminConfirm();
  const isAdmin = currentUser.role === "admin";
  const [response, setResponse] =
    useState<ArticlesListResponse | null>(null);
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"" | ArticleStatus>("");
  const [categoryId, setCategoryId] = useState("");
  const [featured, setFeatured] = useState<"" | "true" | "false">("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [articlesError, setArticlesError] = useState("");
  const [categoriesError, setCategoriesError] = useState(false);
  const [isForbidden, setIsForbidden] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [pendingAction, setPendingAction] = useState<string | null>(
    null,
  );
  const requestIdRef = useRef(0);

  const loadCategories = useCallback(async () => {
    setCategoriesError(false);

    try {
      const data = await getAdminCategories({
        isActive: true,
        limit: 100,
        locale: "vi",
        page: 1,
      });
      const fixedCodes = new Set<string>(FIXED_CATEGORY_CODES);
      setCategories(
        data.data.filter(
          (category) =>
            category.isActive && fixedCodes.has(category.code),
        ),
      );
    } catch (error: unknown) {
      if (error instanceof ApiError && error.status === 403) {
        setIsForbidden(true);
      } else {
        setCategoriesError(true);
      }
    }
  }, []);

  const loadArticles = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setIsLoading(true);
    setArticlesError("");

    try {
      const data = await getAdminArticles({
        categoryId: categoryId ? Number(categoryId) : undefined,
        isFeatured:
          featured === "" ? undefined : featured === "true",
        limit: PAGE_SIZE,
        locale: "vi",
        page,
        search: search || undefined,
        status: status || undefined,
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
        setArticlesError(
          error instanceof ApiError && error.status === 400
            ? error.message
            : "Không thể tải danh sách bài viết. Vui lòng thử lại.",
        );
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [categoryId, featured, page, search, status]);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [searchInput]);

  useEffect(() => {
    void loadArticles();
  }, [loadArticles]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const message =
      params.get("created") === "1"
        ? "Tạo bài viết thành công"
        : params.get("updated") === "1"
          ? "Cập nhật bài viết thành công"
          : null;

    if (message) {
      setNotice({ text: message, tone: "success" });
      window.history.replaceState(null, "", "/admin/articles");
    }
  }, []);

  function handleActionError(error: unknown) {
    if (error instanceof ApiError && error.status === 403) {
      setIsForbidden(true);
      return;
    }

    setNotice({
      text:
        error instanceof ApiError && error.status === 400
          ? error.message
          : "Đã có lỗi xảy ra. Vui lòng thử lại.",
      tone: "error",
    });
  }

  async function runArticleAction(
    article: ArticleListItem,
    actionName: string,
    action: () => Promise<unknown>,
    successMessage: string,
  ) {
    setPendingAction(`${actionName}-${article.id}`);
    setNotice(null);

    try {
      await action();
      setNotice({ text: successMessage, tone: "success" });
      await loadArticles();
    } catch (error: unknown) {
      handleActionError(error);
    } finally {
      setPendingAction(null);
    }
  }

  async function handleDelete(article: ArticleListItem) {
    const confirmed = await confirmAction({
      confirmLabel: "Xóa bài viết",
      description:
        "Bài viết sẽ bị xóa khỏi hệ thống. Bạn có chắc muốn tiếp tục?",
      title: "Xóa bài viết?",
    });
    if (!confirmed) return;

    await runArticleAction(
      article,
      "delete",
      () => deleteArticle(article.id),
      "Xóa bài viết thành công",
    );
  }

  if (isForbidden) return <AccessDenied />;

  const hasError = Boolean(articlesError || categoriesError);
  const articles = response?.data ?? [];
  const meta = response?.meta;

  return (
    <>
      {confirmDialog}
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

      {notice ? (
        <AdminToast
          message={notice.text}
          onDismiss={() => setNotice(null)}
          tone={notice.tone}
        />
      ) : null}

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-3 border-b border-slate-200 p-4 md:grid-cols-2 xl:grid-cols-[minmax(260px,1fr)_180px_220px_190px]">
          <label>
            <span className="sr-only">
              Tìm kiếm theo tiêu đề hoặc tóm tắt
            </span>
            <input
              className={inputClassName}
              maxLength={255}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Tìm theo tiêu đề hoặc tóm tắt..."
              type="search"
              value={searchInput}
            />
          </label>

          <label>
            <span className="sr-only">Lọc trạng thái</span>
            <select
              className={inputClassName}
              onChange={(event) => {
                setStatus(event.target.value as "" | ArticleStatus);
                setPage(1);
              }}
              value={status}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="draft">Nháp</option>
              <option value="published">Đã đăng</option>
              <option value="hidden">Đang ẩn</option>
            </select>
          </label>

          <label>
            <span className="sr-only">Lọc danh mục</span>
            <select
              className={inputClassName}
              onChange={(event) => {
                setCategoryId(event.target.value);
                setPage(1);
              }}
              value={categoryId}
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {getAdminCategoryName(category)}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="sr-only">Lọc bài viết nổi bật</span>
            <select
              className={inputClassName}
              onChange={(event) => {
                setFeatured(
                  event.target.value as "" | "true" | "false",
                );
                setPage(1);
              }}
              value={featured}
            >
              <option value="">Tất cả nổi bật</option>
              <option value="true">Nổi bật</option>
              <option value="false">Không nổi bật</option>
            </select>
          </label>
        </div>

        {isLoading ? <ArticlesLoading /> : null}

        {!isLoading && hasError ? (
          <div className="px-5 py-12 text-center" role="alert">
            <p className="font-semibold text-slate-800">
              {articlesError ||
                "Không thể tải danh sách bài viết. Vui lòng thử lại."}
            </p>
            <button
              className="mt-4 h-10 rounded-lg bg-[#1d2088] px-4 text-sm font-semibold text-white hover:bg-[#171a70]"
              onClick={() => {
                void loadCategories();
                void loadArticles();
              }}
              type="button"
            >
              Thử lại
            </button>
          </div>
        ) : null}

        {!isLoading && !hasError && articles.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="font-semibold text-slate-700">
              Chưa có bài viết nào
            </p>
          </div>
        ) : null}

        {!isLoading && !hasError && articles.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1200px] border-collapse text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Tiêu đề</th>
                    <th className="px-4 py-3 font-semibold">Danh mục</th>
                    <th className="px-4 py-3 font-semibold">Người tạo</th>
                    <th className="px-4 py-3 font-semibold">Trạng thái</th>
                    <th className="px-4 py-3 font-semibold">Nổi bật</th>
                    <th className="px-4 py-3 font-semibold">Ngày tạo</th>
                    <th className="px-4 py-3 font-semibold">Ngày đăng</th>
                    <th className="px-4 py-3 text-right font-semibold">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {articles.map((article) => (
                    <tr
                      className="hover:bg-slate-50/70"
                      key={article.id}
                    >
                      <td className="max-w-[320px] px-4 py-4">
                        <p
                          className="line-clamp-2 font-semibold text-slate-800"
                          title={article.title ?? undefined}
                        >
                          {article.title || "Bài viết chưa có tiêu đề"}
                        </p>
                        {article.summary ? (
                          <p className="mt-1 line-clamp-1 text-xs text-slate-400">
                            {article.summary}
                          </p>
                        ) : null}
                      </td>
                      <td className="px-4 py-4 text-slate-600">
                        {article.category
                          ? (getFixedCategoryName(article.category.code) ??
                            article.category.name ??
                            article.category.code)
                          : "—"}
                      </td>
                      <td className="px-4 py-4 text-slate-600">
                        {article.createdBy.fullName}
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge
                          type="article"
                          value={article.status}
                        />
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={
                            article.isFeatured
                              ? "font-semibold text-amber-600"
                              : "text-slate-400"
                          }
                        >
                          {article.isFeatured ? "Nổi bật" : "Không"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                        {formatDate(article.createdAt)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                        {formatDate(article.publishedAt)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-1">
                          <ActionLink
                            href={`/admin/articles/${article.id}/edit`}
                            icon={Pencil}
                            label={`Sửa ${article.title ?? "bài viết"}`}
                            title="Sửa"
                          />

                          {article.status !== "published" ? (
                            <ActionButton
                              disabled={pendingAction !== null}
                              icon={Send}
                              label={`Đăng ${article.title ?? "bài viết"}`}
                              onClick={() =>
                                void runArticleAction(
                                  article,
                                  "publish",
                                  () => publishArticle(article.id),
                                  "Đăng bài viết thành công",
                                )
                              }
                              title="Đăng bài"
                            />
                          ) : null}

                          {article.status === "published" ? (
                            <ActionButton
                              disabled={pendingAction !== null}
                              icon={EyeOff}
                              label={`Ẩn ${article.title ?? "bài viết"}`}
                              onClick={() =>
                                void runArticleAction(
                                  article,
                                  "hide",
                                  () => hideArticle(article.id),
                                  "Ẩn bài viết thành công",
                                )
                              }
                              title="Ẩn bài"
                            />
                          ) : null}

                          {article.status !== "draft" ? (
                            <ActionButton
                              disabled={pendingAction !== null}
                              icon={FilePenLine}
                              label={`Chuyển ${
                                article.title ?? "bài viết"
                              } về nháp`}
                              onClick={() =>
                                void runArticleAction(
                                  article,
                                  "draft",
                                  () => moveArticleToDraft(article.id),
                                  "Chuyển bài viết về nháp thành công",
                                )
                              }
                              title="Chuyển về nháp"
                            />
                          ) : null}

                          {isAdmin ? (
                            <ActionButton
                              active={article.isFeatured}
                              disabled={pendingAction !== null}
                              icon={Star}
                              label={
                                article.isFeatured
                                  ? `Bỏ nổi bật ${
                                      article.title ?? "bài viết"
                                    }`
                                  : `Đặt nổi bật ${
                                      article.title ?? "bài viết"
                                    }`
                              }
                              onClick={() =>
                                void runArticleAction(
                                  article,
                                  "featured",
                                  () =>
                                    setArticleFeatured(
                                      article.id,
                                      !article.isFeatured,
                                    ),
                                  article.isFeatured
                                    ? "Bỏ nổi bật bài viết thành công"
                                    : "Đặt bài viết nổi bật thành công",
                                )
                              }
                              title={
                                article.isFeatured
                                  ? "Bỏ nổi bật"
                                  : "Đặt nổi bật"
                              }
                            />
                          ) : null}

                          {isAdmin ? (
                            <ActionButton
                              danger
                              disabled={pendingAction !== null}
                              icon={Trash2}
                              label={`Xóa ${article.title ?? "bài viết"}`}
                              onClick={() => void handleDelete(article)}
                              title="Xóa"
                            />
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {meta ? (
              <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 text-sm sm:flex-row">
                <p className="text-slate-500">
                  Tổng cộng {meta.total} bài viết
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
    </>
  );
}

type ActionButtonProps = {
  active?: boolean;
  danger?: boolean;
  disabled: boolean;
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  title: string;
};

function ActionButton({
  active = false,
  danger = false,
  disabled,
  icon: Icon,
  label,
  onClick,
  title,
}: ActionButtonProps) {
  return (
    <button
      aria-label={label}
      className={`flex size-9 items-center justify-center rounded-lg border-0 bg-transparent p-0 disabled:opacity-40 ${
        danger
          ? "text-slate-500 hover:bg-red-50 hover:text-red-600"
          : active
            ? "bg-amber-50 text-amber-600"
            : "text-slate-500 hover:bg-blue-50 hover:text-[#1d2088]"
      }`}
      disabled={disabled}
      onClick={onClick}
      title={title}
      type="button"
    >
      <Icon aria-hidden="true" size={17} />
    </button>
  );
}

type ActionLinkProps = {
  href: string;
  icon: LucideIcon;
  label: string;
  title: string;
};

function ActionLink({
  href,
  icon: Icon,
  label,
  title,
}: ActionLinkProps) {
  return (
    <Link
      aria-label={label}
      className="flex size-9 items-center justify-center rounded-lg text-slate-500 hover:bg-blue-50 hover:text-[#1d2088]"
      href={href}
      title={title}
    >
      <Icon aria-hidden="true" size={17} />
    </Link>
  );
}
