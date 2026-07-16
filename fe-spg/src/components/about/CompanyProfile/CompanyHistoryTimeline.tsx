import { ChevronDown, Mouse } from "lucide-react";

import type { CompanyHistoryContent } from "@/content/about/company-profile/history";

import styles from "./CompanyHistorySection.module.scss";

type CompanyHistoryTimelineProps = {
  content: CompanyHistoryContent;
};

export function CompanyHistoryTimeline({
  content,
}: CompanyHistoryTimelineProps) {
  return (
    <div className={styles.inner}>
      <h2 className={styles.heading} id="company-history-heading">
        {content.title}
      </h2>

      <ol className={styles.timeline}>
        {content.events.map((event) => (
          <li
            className={styles.event}
            data-side={event.side}
            key={event.year}
          >
            <span aria-hidden="true" className={styles.dot} />
            <div className={styles.eventContent}>
              <time className={styles.year}>{event.year}</time>
              <p className={styles.description}>{event.description}</p>
            </div>
          </li>
        ))}
      </ol>

      <span
        aria-label={content.scrollLabel}
        className={styles.scrollHint}
        role="img"
      >
        <Mouse aria-hidden="true" className={styles.mouseIcon} />
        <ChevronDown aria-hidden="true" className={styles.downIcon} />
      </span>
    </div>
  );
}
