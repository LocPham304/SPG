import { apiRequest } from "@/lib/api";
import type {
  CategoriesListResponse,
  GetAdminCategoriesParams,
  GetPublicCategoriesParams,
  NewsCategory,
  PublicCategory,
  UpdateCategoryData,
} from "@/types/categories";

function buildQuery(
  params: GetAdminCategoriesParams | GetPublicCategoriesParams,
) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === "") return;
    query.set(key, String(value));
  });

  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
}

export function getAdminCategories(
  params: GetAdminCategoriesParams = {},
) {
  return apiRequest<CategoriesListResponse>(
    `/admin/categories${buildQuery(params)}`,
  );
}

export function getAdminCategoryById(id: number) {
  return apiRequest<NewsCategory>(`/admin/categories/${id}`);
}

export function updateCategory(
  id: number,
  data: UpdateCategoryData,
) {
  return apiRequest<NewsCategory>(`/admin/categories/${id}`, {
    body: JSON.stringify(data),
    method: "PATCH",
  });
}

export function updateCategoryStatus(id: number, isActive: boolean) {
  return apiRequest<NewsCategory>(
    `/admin/categories/${id}/status`,
    {
      body: JSON.stringify({ isActive }),
      method: "PATCH",
    },
  );
}

export function getPublicCategories(
  params: GetPublicCategoriesParams = {},
) {
  return apiRequest<PublicCategory[]>(
    `/news/categories${buildQuery(params)}`,
  );
}
