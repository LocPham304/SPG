"use client";

import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

import { LocalizedLink } from "@/components/common/LocalizedLink";

import styles from "./SiteLayout.module.scss";

export type FooterNavigationGroup = {
  id: string;
  href: string;
  label: string;
  children: readonly {
    href: string;
    label: string;
  }[];
};

type FooterNavigationProps = {
  ariaLabel: string;
  groups: readonly FooterNavigationGroup[];
};

export function FooterNavigation({
  ariaLabel,
  groups,
}: FooterNavigationProps) {
  const [openGroupId, setOpenGroupId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1199px)");
    const updateViewport = () => setIsMobile(mediaQuery.matches);
    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);
    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  return (
    <nav className={styles.footerNavigation} aria-label={ariaLabel}>
      {groups.map((group) => {
        const isOpen = openGroupId === group.id;
        const panelId = `footer-navigation-${group.id}`;

        return (
          <section className={styles.footerColumn} key={group.id}>
            <h2 className={styles.footerDesktopHeading}>
              <LocalizedLink
                href={group.href}
                prefetch={false}
                rel={group.href.startsWith("http") ? "noopener noreferrer" : undefined}
                target={group.href.startsWith("http") ? "_blank" : undefined}
              >
                {group.label}
              </LocalizedLink>
            </h2>
            <button
              aria-controls={panelId}
              aria-expanded={isOpen}
              className={styles.footerMobileHeading}
              onClick={() => setOpenGroupId(isOpen ? null : group.id)}
              type="button"
            >
              <span>{group.label}</span>
              <ChevronRight aria-hidden="true" size={16} strokeWidth={2} />
            </button>
            <ul
              aria-hidden={isMobile && !isOpen}
              className={styles.footerSubNavigation}
              data-open={isOpen}
              id={panelId}
            >
              {group.children.map((item) => (
                <li key={item.href}>
                  <LocalizedLink
                    href={item.href}
                    prefetch={false}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    tabIndex={isMobile && !isOpen ? -1 : undefined}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                  >
                    {item.label}
                  </LocalizedLink>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </nav>
  );
}
