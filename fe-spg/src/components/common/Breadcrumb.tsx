import { LocalizedLink } from "./LocalizedLink";
import styles from "./Common.module.scss";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: readonly BreadcrumbItem[];
  ariaLabel: string;
};

export function Breadcrumb({ items, ariaLabel }: BreadcrumbProps) {
  return (
    <nav aria-label={ariaLabel}>
      <ol className={styles.breadcrumbs}>
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`}>
            {index > 0 ? (
              <span aria-hidden="true" className={styles.separator}>
                /
              </span>
            ) : null}{" "}
            {item.href ? (
              <LocalizedLink className={styles.breadcrumbLink} href={item.href}>
                {item.label}
              </LocalizedLink>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
