import { getTranslations } from "next-intl/server";

import { Container } from "@/components/common/Container";
import { ScrollReveal } from "@/components/news/ScrollReveal";
import { getAboutBaseProfiles } from "@/content/about/company-profile/base-profiles";
import { homeBaseItems, type HomeBaseId } from "@/data/home-bases";
import type { AppLocale } from "@/i18n/routing";

import { AboutBasesSlider } from "./AboutBasesSlider.client";
import styles from "./AboutBasesSection.module.scss";

type AboutBasesSectionProps = {
  locale: AppLocale;
};

type BaseIllustration = {
  src: string;
  width: number;
  height: number;
};

const baseIllustrations: Partial<Record<HomeBaseId, BaseIllustration>> = {
  qingdao: {
    src: "/images/public/files/image/about_introduction_img2.png",
    width: 186,
    height: 168,
  },
  rizhao: {
    src: "/images/public/files/image/about_introduction_img3.png",
    width: 188,
    height: 160,
  },
  yantai: {
    src: "/images/public/files/image/about_introduction_img4.png",
    width: 166,
    height: 186,
  },
  haiyang: {
    src: "/images/public/files/image/4db16f8d079d5bafd8adcd34d31f1390.png",
    width: 180,
    height: 180,
  },
  huaihai: {
    src: "/images/public/files/image/956173de41fa8f47b98dac300038bb1b.png",
    width: 174,
    height: 179,
  },
};

export async function AboutBasesSection({ locale }: AboutBasesSectionProps) {
  const popupData = getAboutBaseProfiles(locale);
  const [t, common] = await Promise.all([
    getTranslations({ locale, namespace: "home.bases" }),
    getTranslations({ locale, namespace: "common" }),
  ]);
  const items = homeBaseItems.map((base) => ({
    id: base.id,
    title: t(`items.${base.id}.title`),
    descriptions: base.descriptionKeys.map((key) => t(key)),
    illustration: baseIllustrations[base.id],
    profiles: popupData.profiles[base.id],
  }));

  return (
    <section
      aria-labelledby="about-bases-heading"
      className={styles.section}
      id="about-bases"
    >
      <Container className={styles.container}>
        <ScrollReveal animation="animate__fadeInUp">
          <h2 className={styles.heading} id="about-bases-heading">
            {t("title")}
          </h2>
        </ScrollReveal>
        <ScrollReveal animation="animate__fadeInUp" delay="0.1s">
          <AboutBasesSlider
            items={items}
            learnMoreLabel={common("learnMore")}
            nextLabel={common("next")}
            popupCopy={popupData.copy}
            previousLabel={common("previous")}
          />
        </ScrollReveal>
      </Container>
    </section>
  );
}
