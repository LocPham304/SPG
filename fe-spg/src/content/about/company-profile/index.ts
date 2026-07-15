import type { AppLocale } from "@/i18n/routing";

import { companyProfileEn } from "./en";
import type { CompanyProfileContent } from "./types";
import { companyProfileVi } from "./vi";
import { companyProfileZh } from "./zh";

const companyProfileContent = {
  vi: companyProfileVi,
  en: companyProfileEn,
  zh: companyProfileZh,
} satisfies Record<AppLocale, CompanyProfileContent>;

export function getCompanyProfileContent(locale: AppLocale) {
  return companyProfileContent[locale];
}

export type { CompanyProfileContent } from "./types";
