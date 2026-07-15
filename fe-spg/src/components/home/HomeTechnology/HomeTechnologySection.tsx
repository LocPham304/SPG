import { getTranslations } from "next-intl/server";

import { homeTechnologyCategories } from "@/data/home-technology";
import type {
  HomeTechnologyProjectId,
  HomeTechnologyStatId,
} from "@/data/home-technology";
import type { AppLocale } from "@/i18n/routing";

import { HomeTechnologyInteractive } from "./HomeTechnologySection.client";

type HomeTechnologySectionProps = {
  locale: AppLocale;
};

const statMessageKeys = {
  highTech: {
    suffix: "categories.rdLayout.stats.highTech.suffix",
    label: "categories.rdLayout.stats.highTech.label",
  },
  specialized: {
    suffix: "categories.rdLayout.stats.specialized.suffix",
    label: "categories.rdLayout.stats.specialized.label",
  },
  platforms: {
    suffix: "categories.rdLayout.stats.platforms.suffix",
    label: "categories.rdLayout.stats.platforms.label",
  },
  majorEquipment: {
    suffix: "categories.achievements.stats.majorEquipment.suffix",
    label: "categories.achievements.stats.majorEquipment.label",
  },
  progressAwards: {
    suffix: "categories.achievements.stats.progressAwards.suffix",
    label: "categories.achievements.stats.progressAwards.label",
  },
  governmentAwards: {
    suffix: "categories.achievements.stats.governmentAwards.suffix",
    label: "categories.achievements.stats.governmentAwards.label",
  },
  standards: {
    suffix: "categories.achievements.stats.standards.suffix",
    label: "categories.achievements.stats.standards.label",
  },
  patents: {
    suffix: "categories.achievements.stats.patents.suffix",
    label: "categories.achievements.stats.patents.label",
  },
} as const satisfies Record<
  HomeTechnologyStatId,
  { suffix: string; label: string }
>;

const projectMessageKeys = {
  scatterSet: "categories.majorProject.projects.scatterSet",
  deepSeaCages: "categories.majorProject.projects.deepSeaCages",
  railCrane: "categories.majorProject.projects.railCrane",
  provincialPlan: "categories.majorProject.projects.provincialPlan",
  transportProject: "categories.majorProject.projects.transportProject",
} as const satisfies Record<HomeTechnologyProjectId, string>;

export async function HomeTechnologySection({
  locale,
}: HomeTechnologySectionProps) {
  const t = await getTranslations({ locale, namespace: "home.technology" });
  const categories = homeTechnologyCategories.map((category) => {
    const title = t(`categories.${category.id}.title`);

    return {
      ...category,
      title,
      activateLabel: t("activateLabel", { category: title }),
      imageAlt: t("imageAlt", { category: title }),
      stats: category.stats?.map((stat) => {
        const keys = statMessageKeys[stat.id];
        return {
          ...stat,
          suffix: t(keys.suffix),
          label: t(keys.label),
        };
      }),
      projectItems: category.projectItemIds?.map((itemId) =>
        t(projectMessageKeys[itemId]),
      ),
    };
  });

  return (
    <HomeTechnologyInteractive
      locale={locale}
      title={t("title")}
      learnMore={t("learnMore")}
      tabsLabel={t("tabsLabel")}
      categories={categories}
    />
  );
}
