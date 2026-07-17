export const newsCategorySlugs = [
  "current-affairs",
  "group-news",
  "product-delivery",
  "notices",
] as const;

export type NewsCategorySlug = (typeof newsCategorySlugs)[number];

export function isNewsCategorySlug(value: string): value is NewsCategorySlug {
  return newsCategorySlugs.includes(value as NewsCategorySlug);
}

export function getNewsDetailPath(
  category: NewsCategorySlug,
  articleId: string,
) {
  return `/news/${category}/${articleId}`;
}
