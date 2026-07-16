"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

import { LocalizedLink } from "@/components/common/LocalizedLink";

import styles from "./Header.module.scss";
import type { HeaderNavigationItem } from "./types";

type MobileNavigationProps = {
  ariaLabel: string;
  closeLabel: string;
  isOpen: boolean;
  items: readonly HeaderNavigationItem[];
  onClose: () => void;
  pathname: string;
  triggerRef: RefObject<HTMLButtonElement | null>;
};

const focusableSelector =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function MobileNavigation({
  ariaLabel,
  closeLabel,
  isOpen,
  items,
  onClose,
  pathname,
  triggerRef,
}: MobileNavigationProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setOpenAccordion(null);
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const firstControl = drawerRef.current?.querySelector<HTMLElement>(
      focusableSelector,
    );
    const focusFrame = window.requestAnimationFrame(() => firstControl?.focus());
    const focusTimer = window.setTimeout(() => firstControl?.focus(), 50);

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        triggerRef.current?.focus();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const controls = Array.from(
        drawerRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? [],
      );
      if (controls.length === 0) {
        return;
      }

      const first = controls[0];
      const last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, triggerRef]);

  return (
    <>
      {isOpen ? (
        <button
          aria-label={closeLabel}
          className={styles.menuOverlay}
          onClick={onClose}
          type="button"
        />
      ) : null}
      <div
        aria-hidden={!isOpen}
        aria-label={ariaLabel}
        aria-modal="true"
        className={`${styles.mobileDrawer} ${isOpen ? styles.mobileDrawerOpen : ""}`}
        ref={drawerRef}
        role="dialog"
      >
        <nav aria-label={ariaLabel}>
          <ul className={styles.mobileList}>
            {items.map((item, index) => {
              const isExpanded = openAccordion === index;
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              const panelId = `mobile-submenu-${index}`;

              return (
                <li className={styles.mobileItem} key={item.href}>
                  <div className={styles.mobileAccordionRow}>
                    <LocalizedLink
                      className={`${styles.mobileParentLink} ${isActive ? styles.mobileActive : ""}`}
                      href={item.href}
                      onClick={onClose}
                      tabIndex={isOpen ? 0 : -1}
                    >
                      {item.label}
                    </LocalizedLink>
                    <button
                      aria-controls={panelId}
                      aria-expanded={isExpanded}
                      aria-label={item.label}
                      className={`${styles.mobileAccordionButton} ${isActive ? styles.mobileActive : ""}`}
                      onClick={() =>
                        setOpenAccordion(isExpanded ? null : index)
                      }
                      tabIndex={isOpen ? 0 : -1}
                      type="button"
                    >
                      <span
                        aria-hidden="true"
                        className={`${styles.mobileArrow} ${isExpanded ? styles.mobileArrowOpen : ""}`}
                      />
                    </button>
                  </div>
                  <div
                    className={`${styles.mobileSubmenu} ${isExpanded ? styles.mobileSubmenuOpen : ""}`}
                    id={panelId}
                  >
                    <div className={styles.mobileSubmenuInner}>
                      {item.children.map((child) => (
                        <LocalizedLink
                          className={styles.mobileSubmenuLink}
                          href={child.href}
                          key={child.href}
                          onClick={onClose}
                          tabIndex={isOpen && isExpanded ? 0 : -1}
                        >
                          {child.label}
                        </LocalizedLink>
                      ))}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
}
