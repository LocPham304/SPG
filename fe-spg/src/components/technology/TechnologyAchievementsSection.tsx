import { Container } from "@/components/common/Container";
import type { TechnologyAchievementsContent } from "@/content/technology/technological-achievements";

import styles from "./TechnologyAchievementsSection.module.scss";
import { TechnologyAchievementsSlider } from "./TechnologyAchievementsSlider.client";

type TechnologyAchievementsSectionProps = Pick<
  TechnologyAchievementsContent,
  "groups" | "pageTitle"
>;

export function TechnologyAchievementsSection({
  groups,
  pageTitle,
}: TechnologyAchievementsSectionProps) {
  return (
    <main className={styles.layout}>
      <section className={styles.intro}>
        <Container>
          <h2 className={styles.pageTitle}>{pageTitle}</h2>
        </Container>
      </section>
      {groups.map((group) => (
        <section
          aria-labelledby={`${group.id}-title`}
          className={group.tone === "muted" ? styles.groupMuted : styles.group}
          key={group.id}
        >
          <Container className={styles.groupInner}>
            <h3 className={styles.groupTitle} id={`${group.id}-title`}>
              {group.title}
            </h3>
            <TechnologyAchievementsSlider items={group.items} label={group.title} />
          </Container>
        </section>
      ))}
    </main>
  );
}
