"use client";

import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useTransition, type ChangeEvent } from "react";

import { usePathname, useRouter } from "@/i18n/navigation";
import {
  isAppLocale,
  localeNames,
  locales,
  type AppLocale,
} from "@/i18n/routing";

import styles from "./SiteLayout.module.scss";

export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("navigation");
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value;

    if (!isAppLocale(nextLocale) || nextLocale === locale) {
      return;
    }

    const query = searchParams.toString();
    const hash = window.location.hash;
    const nextPath = `${pathname}${query ? `?${query}` : ""}${hash}`;

    startTransition(() => {
      router.replace(nextPath, { locale: nextLocale as AppLocale });
    });
  }

  return (
    <label className={styles.languageField}>
      <span className={styles.languageLabel}>{t("language")}</span>
      <select
        aria-label={t("language")}
        className={styles.languageSelect}
        disabled={isPending}
        onChange={handleChange}
        value={locale}
      >
        {locales.map((item) => (
          <option key={item} value={item}>
            {localeNames[item]}
          </option>
        ))}
      </select>
    </label>
  );
}
