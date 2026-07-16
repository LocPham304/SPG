import type { CompanyHistoryContent } from "@/content/about/company-profile/history";

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
      <CompanyHistoryTimeline content={content} />
    </section>
  );
}
