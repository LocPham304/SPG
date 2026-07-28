export type LocaleCode = "vi" | "en" | "zh";

export const FIXED_CATEGORY_CODES = [
  "currentAffairs",
  "groupNews",
  "productDelivery",
  "notices",
] as const;

export type FixedCategoryCode =
  (typeof FIXED_CATEGORY_CODES)[number];

export const FIXED_CATEGORY_NAMES: Record<
  FixedCategoryCode,
  Record<LocaleCode, string>
> = {
  currentAffairs: {
    vi: "Thị Trường",
    en: "Market",
    zh: "市场",
  },
  groupNews: {
    vi: "Tin tức tập đoàn",
    en: "Group news",
    zh: "集团新闻",
  },
  productDelivery: {
    vi: "Cảng thông minh",
    en: "Smart Port",
    zh: "智慧港口",
  },
  notices: {
    vi: "Thông báo",
    en: "Notices",
    zh: "公示公告",
  },
};

export function isFixedCategoryCode(code: string): code is FixedCategoryCode {
  return (FIXED_CATEGORY_CODES as readonly string[]).includes(code);
}

export function getFixedCategoryName(
  code: string,
  locale: LocaleCode = "vi",
) {
  return isFixedCategoryCode(code)
    ? FIXED_CATEGORY_NAMES[code][locale]
    : undefined;
}

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

export function getAdminCategoryName(category: NewsCategory) {
  return (
    getFixedCategoryName(category.code) ??
    category.translations.find((translation) => translation.locale === "vi")
      ?.name ??
    category.translations[0]?.name ??
    category.code
  );
}
