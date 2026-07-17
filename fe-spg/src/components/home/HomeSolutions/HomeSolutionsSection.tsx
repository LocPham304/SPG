import { getTranslations } from "next-intl/server";

import { LocalizedLink } from "@/components/common/LocalizedLink";
import { ScrollReveal } from "@/components/news/ScrollReveal";
import { homeSolutionItems } from "@/data/home-solutions";
import type { AppLocale } from "@/i18n/routing";

import { HomeSolutionsSlider } from "./HomeSolutionsSlider.client";
import styles from "./HomeSolutions.module.scss";

type HomeSolutionsSectionProps = {
  locale: AppLocale;
};

export async function HomeSolutionsSection({
  locale,
}: HomeSolutionsSectionProps) {
  const t = await getTranslations({ locale, namespace: "home.solutions" });
  const items = homeSolutionItems.map((item) => {
    const title = t(`items.${item.id}`);

    return {
      ...item,
      title,
      imageAlt: t("imageAlt", { category: title }),
    };
  });

  return (
    <section
      className={styles.section}
      aria-labelledby="home-solutions-title"
      data-home-solutions
    >
      <div className={styles.background} aria-hidden="true" />
      <div className={styles.inner}>
        <ScrollReveal
          animation="animate__fadeInUp"
          className={styles.header}
          duration="0.75s"
        >
          <div>
            <h2 id="home-solutions-title" className={styles.heading}>
              {t("title")}
            </h2>
            <p className={styles.subtitle}>{t("subtitle")}</p>
          </div>

          <LocalizedLink className={styles.learnMore} href="/products">
            <span>{t("learnMore")}</span>
            <span className={styles.linkArrow} aria-hidden="true" />
          </LocalizedLink>
        </ScrollReveal>

        <ScrollReveal animation="animate__fadeInUp" delay="0.1s">
          <HomeSolutionsSlider
            items={items}
            sliderLabel={t("sliderLabel")}
            previousLabel={t("previous")}
            nextLabel={t("next")}
          />
        </ScrollReveal>
      </div>
    </section>
  );
}
