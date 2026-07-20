"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState, useTransition } from "react";

import { usePathname, useRouter } from "@/i18n/navigation";
import {
  localeNames,
  localeShortNames,
  locales,
  type AppLocale,
} from "@/i18n/routing";

import { useNewsLocaleLinks } from "./NewsLocaleLinksContext";
import styles from "./header/Header.module.scss";

type LanguageSwitcherProps = {
  onNavigate?: () => void;
};

export function LanguageSwitcher({
  onNavigate,
}: LanguageSwitcherProps) {
  const locale = useLocale();
  const t = useTranslations("navigation");
  const pathname = usePathname();
  const router = useRouter();
  const newsLocaleLinks = useNewsLocaleLinks();
  const rootRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function changeLocale(nextLocale: AppLocale) {
    if (nextLocale === locale) {
      setIsOpen(false);
      return;
    }

    const isNewsDetail = pathname.startsWith("/news/");
    const translatedNewsPath = newsLocaleLinks?.[nextLocale];
    const nextPathname = isNewsDetail
      ? (translatedNewsPath ?? "/news")
      : pathname;
    const query =
      isNewsDetail && !translatedNewsPath
        ? ""
        : window.location.search.slice(1);
    const hash = window.location.hash;
    const nextPath = `${nextPathname}${query ? `?${query}` : ""}${hash}`;

    setIsOpen(false);
    onNavigate?.();
    startTransition(() => {
      router.replace(nextPath, { locale: nextLocale });
    });
  }

  return (
    <div className={styles.languageSwitcher} ref={rootRef}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={t("language")}
        className={styles.languageTrigger}
        disabled={isPending}
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        {localeShortNames[locale as AppLocale]}
        <span aria-hidden="true" className={styles.languageChevron} />
      </button>
      <div
        aria-label={t("language")}
        className={`${styles.languageMenu} ${isOpen ? styles.languageMenuOpen : ""}`}
        role="listbox"
      >
        {locales.map((item) => (
          <button
            aria-selected={item === locale}
            className={styles.languageOption}
            key={item}
            onClick={() => changeLocale(item)}
            role="option"
            tabIndex={isOpen ? 0 : -1}
            type="button"
          >
            <span>{localeShortNames[item]}</span>
            <span className={styles.languageName}>{localeNames[item]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
