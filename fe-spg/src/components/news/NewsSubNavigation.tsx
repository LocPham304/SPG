import { LocalizedLink } from "@/components/common/LocalizedLink";

import styles from "./NewsSubNavigation.module.scss";

export type NewsSubNavigationItem = {
  href: string;
  label: string;
};

type NewsSubNavigationProps = {
  ariaLabel: string;
  currentHref: string;
  items: readonly NewsSubNavigationItem[];
};

export function NewsSubNavigation({
  ariaLabel,
  currentHref,
  items,
}: NewsSubNavigationProps) {
  return (
    <nav aria-label={ariaLabel} className={styles.navigation}>
      <ul>
        {items.map((item) => {
          const itemPath = item.href.split("?")[0];
          const currentPath = currentHref.split("?")[0];
          const isCurrent = itemPath === currentPath;

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
