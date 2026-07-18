export const FIXED_CATEGORY_CODES = [
  'currentAffairs',
  'groupNews',
  'productDelivery',
  'notices',
] as const;

export type FixedCategoryCode = (typeof FIXED_CATEGORY_CODES)[number];

export function isFixedCategoryCode(code: string): code is FixedCategoryCode {
  return FIXED_CATEGORY_CODES.some((fixedCode) => fixedCode === code);
}
