"use client";

import type { FocusEvent, KeyboardEvent } from "react";

import { LocalizedLink } from "@/components/common/LocalizedLink";

import styles from "./Header.module.scss";
import type { HeaderNavigationItem } from "./types";

type DesktopNavigationProps = {
  activeDropdown: number | null;
  ariaLabel: string;
  items: readonly HeaderNavigationItem[];
  pathname: string;
  setActiveDropdown: (index: number | null) => void;
};

function isItemActive(item: HeaderNavigationItem, pathname: string) {
  return (
    pathname === item.href ||
    item.children.some(
      (child) =>
        pathname === child.href || pathname.startsWith(`${child.href}/`),
    )
  );
}

export function DesktopNavigation({
  activeDropdown,
  ariaLabel,
  items,
  pathname,
  setActiveDropdown,
}: DesktopNavigationProps) {
  function focusFirstChild(event: KeyboardEvent<HTMLButtonElement>) {
    const firstLink = event.currentTarget.parentElement?.querySelector<HTMLElement>(
      "[data-submenu-link]",
    );
    window.requestAnimationFrame(() => firstLink?.focus());
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setActiveDropdown(activeDropdown === index ? null : index);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveDropdown(index);
      focusFirstChild(event);
      return;
    }

    if (event.key === "Escape") {
      setActiveDropdown(null);
    }
  }

  function handleBlur(event: FocusEvent<HTMLLIElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setActiveDropdown(null);
    }
  }

  return (
    <nav aria-label={ariaLabel} className={styles.desktopNavigation}>
      <ul className={styles.desktopList}>
        {items.map((item, index) => {
          const isOpen = activeDropdown === index;
          const isActive = isItemActive(item, pathname);
          const panelId = `desktop-submenu-${index}`;

          return (
            <li
              className={styles.desktopItem}
              key={item.href}
              onBlur={handleBlur}
              onMouseEnter={() => setActiveDropdown(index)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                aria-controls={panelId}
                aria-expanded={isOpen}
                aria-haspopup="true"
                className={`${styles.desktopTrigger} ${isActive ? styles.activeTrigger : ""}`}
                onClick={() => setActiveDropdown(isOpen ? null : index)}
                onKeyDown={(event) => handleKeyDown(event, index)}
                type="button"
              >
                {item.label}
              </button>
              <div
                aria-hidden={!isOpen}
                className={`${styles.desktopDropdown} ${isOpen ? styles.desktopDropdownOpen : ""}`}
                id={panelId}
              >
                {item.children.map((child) => (
                  <LocalizedLink
                    className={styles.desktopDropdownLink}
                    data-submenu-link
                    href={child.href}
                    key={child.href}
                    tabIndex={isOpen ? 0 : -1}
                  >
                    {child.label}
                  </LocalizedLink>
                ))}
              </div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
