import { getTranslations } from "next-intl/server";

import styles from "./SiteLayout.module.scss";

export async function SiteFooter() {
  const t = await getTranslations("footer");

  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <p>{t("copyright", { year: new Date().getFullYear() })}</p>
      </div>
    </footer>
  );
}
