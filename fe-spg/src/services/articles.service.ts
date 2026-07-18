import { apiRequest } from "@/lib/api";
import type {
  ArticleDetail,
  ArticlesListResponse,
  CreateArticleData,
  GetAdminArticlesParams,
  TranslateArticleData,
  TranslateArticleResponse,
  UpdateArticleData,
} from "@/types/articles";

type QueryParamValue = boolean | number | string | null | undefined;

function appendParam(
  query: URLSearchParams,
  key: string,
  value: QueryParamValue,
) {
  if (value === undefined || value === null) return;

  const normalizedValue =
    typeof value === "string" ? value.trim() : String(value);
  const ignoredStringValues = ["", "all", "undefined", "null"];

  if (ignoredStringValues.includes(normalizedValue.toLowerCase())) {
    return;
  }

  query.set(key, normalizedValue);
}

function buildArticlesQuery(params: GetAdminArticlesParams) {
  const query = new URLSearchParams();

  appendParam(query, "page", params.page ?? 1);
  appendParam(query, "limit", params.limit ?? 10);
  appendParam(query, "locale", params.locale ?? "vi");
  appendParam(query, "search", params.search);
  appendParam(query, "status", params.status);
  appendParam(query, "categoryId", params.categoryId);
  appendParam(query, "createdBy", params.createdBy);
  appendParam(query, "isFeatured", params.isFeatured);

  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
}

export function getAdminArticles(params: GetAdminArticlesParams = {}) {
  return apiRequest<ArticlesListResponse>(
    `/admin/articles${buildArticlesQuery(params)}`,
  );
}

export function getAdminArticleById(id: number) {
  return apiRequest<ArticleDetail>(`/admin/articles/${id}`);
}

export function createArticle(data: CreateArticleData) {
  return apiRequest<ArticleDetail>("/admin/articles", {
    body: JSON.stringify(data),
    method: "POST",
  });
}

export function updateArticle(id: number, data: UpdateArticleData) {
  return apiRequest<ArticleDetail>(`/admin/articles/${id}`, {
    body: JSON.stringify(data),
    method: "PATCH",
  });
}

export function publishArticle(id: number) {
  return apiRequest<ArticleDetail>(`/admin/articles/${id}/publish`, {
    method: "POST",
  });
}

export function hideArticle(id: number) {
  return apiRequest<ArticleDetail>(`/admin/articles/${id}/hide`, {
    method: "POST",
  });
}

export function moveArticleToDraft(id: number) {
  return apiRequest<ArticleDetail>(`/admin/articles/${id}/draft`, {
    method: "POST",
  });
}

export function setArticleFeatured(id: number, isFeatured: boolean) {
  return apiRequest<ArticleDetail>(`/admin/articles/${id}/featured`, {
    body: JSON.stringify({ isFeatured }),
    method: "PATCH",
  });
}

export function deleteArticle(id: number) {
  return apiRequest<void>(`/admin/articles/${id}`, {
    method: "DELETE",
  });
}

export function restoreArticle(id: number) {
  return apiRequest<ArticleDetail>(`/admin/articles/${id}/restore`, {
    method: "POST",
  });
}

export function translateArticle(id: number, data: TranslateArticleData = {}) {
  return apiRequest<TranslateArticleResponse>(
    `/admin/articles/${id}/translate`,
    {
      body: JSON.stringify(data),
      method: "POST",
    },
  );
}
