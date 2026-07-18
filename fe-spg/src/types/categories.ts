export type LocaleCode = "vi" | "en" | "zh";

export const FIXED_CATEGORY_CODES = [
  "currentAffairs",
  "groupNews",
  "productDelivery",
  "notices",
] as const;

export type FixedCategoryCode =
  (typeof FIXED_CATEGORY_CODES)[number];

export type CategoryTranslation = {
  description: string | null;
  id?: number;
  locale: LocaleCode;
  name: string;
};

export type NewsCategory = {
  code: string;
  createdAt: string;
  createdBy?: number | null;
  id: number;
  isActive: boolean;
  showOnHome: boolean;
  slug: string;
  sortOrder: number;
  translations: CategoryTranslation[];
  updatedAt: string;
  updatedBy?: number | null;
};

export type CategoriesListResponse = {
  data: NewsCategory[];
  meta: {
    limit: number;
    page: number;
    total: number;
    totalPages: number;
  };
};

export type PublicCategory = {
  code: string;
  description: string | null;
  id: number;
  name: string;
  showOnHome: boolean;
  slug: string;
  sortOrder: number;
};

export type GetAdminCategoriesParams = {
  isActive?: boolean;
  limit?: number;
  locale?: LocaleCode;
  page?: number;
  search?: string;
  showOnHome?: boolean;
};

export type GetPublicCategoriesParams = {
  locale?: LocaleCode;
  showOnHome?: boolean;
};

export type CategoryTranslationInput = {
  description?: string | null;
  locale: LocaleCode;
  name: string;
};

export type UpdateCategoryData = {
  isActive?: boolean;
  showOnHome?: boolean;
  slug?: string;
  sortOrder?: number;
  translations?: CategoryTranslationInput[];
};
