import { LocalizedLink } from "@/components/common/LocalizedLink";
import { ResponsiveImage } from "@/components/common/ResponsiveImage";

import styles from "./Header.module.scss";

type HeaderLogoProps = {
  homeLabel: string;
  isDark?: boolean;
};

export function HeaderLogo({ homeLabel, isDark = false }: HeaderLogoProps) {
  return (
    <LocalizedLink aria-label={homeLabel} className={styles.logoLink} href="/">
      <ResponsiveImage
        alt="Shandong Port Equipment Group"
        className={`${styles.logoImage} ${isDark ? styles.logoVisible : ""}`}
        height={32}
        priority
        sizes="(max-width: 767px) 213px, (max-width: 1199px) 320px, 22vw"
        src="/images/public/files/image/logo.png"
        width={320}
      />
      <ResponsiveImage
        alt=""
        aria-hidden="true"
        className={`${styles.logoImage} ${styles.logoWhite} ${isDark ? "" : styles.logoVisible}`}
        height={32}
        priority
        sizes="(max-width: 767px) 213px, (max-width: 1199px) 320px, 22vw"
        src="/images/public/files/image/logo_white.png"
        width={320}
      />
    </LocalizedLink>
  );
}
