import type { CompanyHistoryContent } from "@/content/about/company-profile/history";
import { ScrollReveal } from "@/components/news/ScrollReveal";

import { CompanyHistoryTimeline } from "./CompanyHistoryTimeline";
import styles from "./CompanyHistorySection.module.scss";

type CompanyHistorySectionProps = {
  content: CompanyHistoryContent;
};

export function CompanyHistorySection({ content }: CompanyHistorySectionProps) {
  return (
    <section
      aria-labelledby="company-history-heading"
      className={styles.section}
      id="company-history"
    >
      <div aria-hidden="true" className={styles.background} />
      <ScrollReveal animation="animate__fadeInUp" duration="0.8s">
        <CompanyHistoryTimeline content={content} />
      </ScrollReveal>
    </section>
  );
}
