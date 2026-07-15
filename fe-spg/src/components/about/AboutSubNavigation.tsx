import { LocalizedLink } from "@/components/common/LocalizedLink";

import styles from "./AboutSubNavigation.module.scss";

export type AboutSubNavigationItem = {
  href: string;
  label: string;
};

type AboutSubNavigationProps = {
  ariaLabel: string;
  currentHref: string;
  items: readonly AboutSubNavigationItem[];
};

export function AboutSubNavigation({
  ariaLabel,
  currentHref,
  items,
}: AboutSubNavigationProps) {
  return (
    <nav aria-label={ariaLabel} className={styles.navigation}>
      <ul>
        {items.map((item) => {
          const isCurrent = item.href === currentHref;

          return (
            <li data-current={isCurrent} key={item.href}>
              <LocalizedLink
                aria-current={isCurrent ? "page" : undefined}
                href={item.href}
              >
                {item.label}
              </LocalizedLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
