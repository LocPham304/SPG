import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { LocalizedLink } from "@/components/common/LocalizedLink";
import type { AppLocale } from "@/i18n/routing";

import styles from "./HomeAbout.module.scss";

const HOME_ABOUT_IMAGE =
  "/images/public/files/image/index_img2.jpg" as const;

type HomeAboutSectionProps = {
  locale: AppLocale;
};

export async function HomeAboutSection({ locale }: HomeAboutSectionProps) {
  const [aboutT, commonT] = await Promise.all([
    getTranslations({ locale, namespace: "home.about" }),
    getTranslations({ locale, namespace: "common" }),
  ]);

  return (
    <section
      className={styles.section}
      data-home-about
      data-content-status="temporary"
      aria-labelledby="home-about-title"
    >
      <div className={styles.content}>
        <h2 id="home-about-title" className={styles.heading}>
          {aboutT("title")}
        </h2>
        <p className={styles.companyName}>{aboutT("companyName")}</p>
        <div className={styles.bodyCopy}>
          <p>{aboutT("paragraphs.introduction")}</p>
          <p>{aboutT("paragraphs.business")}</p>
        </div>
        <LocalizedLink
          className={styles.learnMore}
          href="/about/company-profile"
        >
          <span>{commonT("learnMore")}</span>
          <span className={styles.arrow} aria-hidden="true" />
        </LocalizedLink>
      </div>

      <div className={styles.media}>
        <Image
          className={styles.image}
          src={HOME_ABOUT_IMAGE}
          alt={aboutT("imageAlt")}
          fill
          sizes="(max-width: 900px) 100vw, 57vw"
        />
      </div>
    </section>
  );
}
