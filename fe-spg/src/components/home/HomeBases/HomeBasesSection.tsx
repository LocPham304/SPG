import { Wrench } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { LocalizedLink } from "@/components/common/LocalizedLink";
import { ScrollReveal } from "@/components/news/ScrollReveal";
import { getStaggerDelay } from "@/components/news/animation";
import { homeBaseItems } from "@/data/home-bases";
import type { AppLocale } from "@/i18n/routing";

import styles from "./HomeBases.module.scss";

type HomeBasesSectionProps = {
  locale: AppLocale;
};

export async function HomeBasesSection({ locale }: HomeBasesSectionProps) {
  const t = await getTranslations({ locale, namespace: "home.bases" });

  return (
    <section
      className={styles.section}
      aria-labelledby="home-bases-title"
      data-home-bases
    >
      <div className={styles.scroller}>
        <div className={styles.track} role="list">
          <div className={styles.introduction} role="listitem">
            <ScrollReveal animation="animate__fadeInUp" duration="0.7s">
              <h2 id="home-bases-title" className={styles.heading}>
                {t("title")}
              </h2>
              <p className={styles.summary}>{t("description")}</p>
            </ScrollReveal>
          </div>

          {homeBaseItems.map((base, index) => (
            <LocalizedLink
              href="/about/company-profile#about-bases"
              key={base.id}
              className={`${styles.baseItem} ${
                base.status === "available"
                  ? styles.available
                  : styles.underConstruction
              }`}
              role="listitem"
            >
              <ScrollReveal
                animation="animate__fadeInUp"
                className={styles.baseContent}
                delay={getStaggerDelay(index)}
                duration="0.7s"
              >
                <h3 className={styles.baseTitle}>
                  {t(`items.${base.id}.title`)}
                </h3>
                <div className={styles.descriptions}>
                  {base.descriptionKeys.map((descriptionKey) => (
                    <p key={descriptionKey}>{t(descriptionKey)}</p>
                  ))}
                </div>

                {base.status === "available" ? (
                  <span className={styles.actionIcon} aria-hidden="true">
                    <span className={styles.chevron} />
                  </span>
                ) : (
                  <Wrench
                    className={styles.wrench}
                    aria-label={t("underConstructionLabel", {
                      base: t(`items.${base.id}.title`),
                    })}
                    strokeWidth={1.7}
                  />
                )}
              </ScrollReveal>
            </LocalizedLink>
          ))}
        </div>
      </div>
    </section>
  );
}
