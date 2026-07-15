"use client";

import type { RefObject } from "react";

import { LanguageSwitcher } from "../LanguageSwitcher";
import styles from "./Header.module.scss";

type HeaderActionsProps = {
  closeMenuLabel: string;
  isMenuOpen: boolean;
  menuButtonRef: RefObject<HTMLButtonElement | null>;
  onMenuToggle: () => void;
  onSearchOpen: () => void;
  openMenuLabel: string;
  searchLabel: string;
};

export function HeaderActions({
  closeMenuLabel,
  isMenuOpen,
  menuButtonRef,
  onMenuToggle,
  onSearchOpen,
  openMenuLabel,
  searchLabel,
}: HeaderActionsProps) {
  return (
    <div className={styles.headerActions}>
      <LanguageSwitcher onNavigate={isMenuOpen ? onMenuToggle : undefined} />
      <button
        aria-label={searchLabel}
        className={styles.searchButton}
        onClick={onSearchOpen}
        type="button"
      >
        <span aria-hidden="true" className={styles.searchIcon} />
      </button>
      <button
        aria-expanded={isMenuOpen}
        aria-label={isMenuOpen ? closeMenuLabel : openMenuLabel}
        className={`${styles.menuButton} ${isMenuOpen ? styles.menuButtonOpen : ""}`}
        onClick={onMenuToggle}
        ref={menuButtonRef}
        type="button"
      >
        <span />
        <span />
        <span />
      </button>
    </div>
  );
}
