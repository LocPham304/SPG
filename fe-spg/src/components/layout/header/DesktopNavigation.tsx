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
  const isMegaMenuOpen = activeDropdown !== null;

  function focusFirstChild(index: number) {
    const firstLink = document
      .getElementById(`desktop-submenu-${index}`)
      ?.querySelector<HTMLElement>("[data-submenu-link]");

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
      focusFirstChild(index);
      return;
    }

    if (event.key === "Escape") {
      setActiveDropdown(null);
      event.currentTarget.focus();
    }
  }

  function handleBlur(event: FocusEvent<HTMLElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setActiveDropdown(null);
    }
  }

  return (
    <nav
      aria-label={ariaLabel}
      className={styles.desktopNavigation}
      onBlur={handleBlur}
      onMouseLeave={() => setActiveDropdown(null)}
    >
      <ul className={styles.desktopList}>
        {items.map((item, index) => {
          const isOpen = activeDropdown === index;
          const isActive = isItemActive(item, pathname);
          const panelId = `desktop-submenu-${index}`;

          return (
            <li
              className={`${styles.desktopItem} ${isOpen ? styles.desktopItemOpen : ""}`}
              key={item.href}
              onMouseEnter={() => setActiveDropdown(index)}
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
            </li>
          );
        })}
      </ul>

      <div
        aria-hidden={!isMegaMenuOpen}
        className={`${styles.desktopMegaMenu} ${isMegaMenuOpen ? styles.desktopMegaMenuOpen : ""}`}
      >
        <div className={styles.desktopMegaGrid}>
          <div aria-hidden="true" className={styles.desktopMegaSpacer} />
          {items.map((item, index) => {
            const isOpen = activeDropdown === index;

            return (
              <div
                className={`${styles.desktopMegaColumn} ${isOpen ? styles.desktopMegaColumnOpen : ""}`}
                id={`desktop-submenu-${index}`}
                key={item.href}
                onMouseEnter={() => setActiveDropdown(index)}
              >
                {item.children.map((child) => (
                  <LocalizedLink
                    className={styles.desktopMegaLink}
                    data-submenu-link
                    href={child.href}
                    key={child.href}
                    tabIndex={isMegaMenuOpen ? 0 : -1}
                  >
                    {child.label}
                  </LocalizedLink>
                ))}
              </div>
            );
          })}
          <div aria-hidden="true" className={styles.desktopMegaSpacer} />
        </div>
      </div>
    </nav>
  );
}
