import { getTranslations } from "next-intl/server";

import { LocalizedLink } from "@/components/common/LocalizedLink";
import { ResponsiveImage } from "@/components/common/ResponsiveImage";
import { mainNavigation } from "@/data/navigation";

import { LanguageSwitcher } from "./LanguageSwitcher";
import styles from "./SiteLayout.module.scss";

export async function SiteHeader() {
  const t = await getTranslations("navigation");

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <LocalizedLink aria-label={t("home")} href="/">
          <ResponsiveImage
            alt="Shandong Port Equipment Group"
            className={styles.logo}
            height={32}
            priority
            sizes="(max-width: 767px) 190px, 320px"
            src="/images/public/files/image/logo.png"
            width={320}
          />
        </LocalizedLink>
        <nav aria-label={t("primaryNavigation")} className={styles.navigation}>
          <ul className={styles.navList}>
            {mainNavigation.map((item) => (
              <li key={item.href}>
                <LocalizedLink className={styles.navLink} href={item.href}>
                  {t(item.label)}
                </LocalizedLink>
              </li>
            ))}
          </ul>
        </nav>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
