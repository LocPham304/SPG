import { getTranslations } from "next-intl/server";

import { LocalizedLink } from "@/components/common/LocalizedLink";
import { ScrollReveal } from "@/components/news/ScrollReveal";
import type { AppLocale } from "@/i18n/routing";

import styles from "./HomeAbout.module.scss";
import { HomeAboutYouTube } from "./HomeAboutYouTube.client";

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
      <ScrollReveal
        animation="animate__fadeInUp"
        className={styles.content}
        duration="0.75s"
      >
        <h2 id="home-about-title" className={styles.heading}>
          {aboutT("title")}
        </h2>
        <p className={styles.companyName}>{aboutT("companyName")}</p>
        <div className={styles.bodyCopy}>
          <p>{aboutT("paragraphs.introduction")}</p>
          <p>
            {aboutT.rich("paragraphs.business", {
              highlight: (chunks) => (
                <strong className={styles.highlightedTerm}>{chunks}</strong>
              ),
            })}
          </p>
        </div>
        <LocalizedLink
          className={styles.learnMore}
          href="/about/company-profile"
        >
          <span>{commonT("learnMore")}</span>
          <span className={styles.arrow} aria-hidden="true" />
        </LocalizedLink>
      </ScrollReveal>

      <ScrollReveal
        animation="animate__fadeInUp"
        className={styles.media}
        delay="0.1s"
        duration="0.75s"
      >
        <HomeAboutYouTube
          closeLabel={aboutT("videoCloseLabel")}
          playLabel={aboutT("videoPlayLabel")}
          title={aboutT("videoTitle")}
        />
      </ScrollReveal>
    </section>
  );
}
