"use client";

import { useEffect, useRef, type FormEvent } from "react";

import { HeaderLogo } from "./HeaderLogo";
import styles from "./Header.module.scss";

type SearchPanelProps = {
  closeLabel: string;
  homeLabel: string;
  isOpen: boolean;
  onClose: () => void;
  placeholder: string;
  searchLabel: string;
};

export function SearchPanel({
  closeLabel,
  homeLabel,
  isOpen,
  onClose,
  placeholder,
  searchLabel,
}: SearchPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      window.requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <div
      aria-hidden={!isOpen}
      className={`${styles.searchPanel} ${isOpen ? styles.searchPanelOpen : ""}`}
    >
      <HeaderLogo homeLabel={homeLabel} isDark />
      <form className={styles.searchForm} onSubmit={handleSubmit} role="search">
        <input
          aria-label={searchLabel}
          autoComplete="off"
          className={styles.searchInput}
          placeholder={placeholder}
          ref={inputRef}
          tabIndex={isOpen ? 0 : -1}
          type="search"
        />
        <button
          aria-label={searchLabel}
          className={styles.searchSubmit}
          tabIndex={isOpen ? 0 : -1}
          type="submit"
        >
          <span aria-hidden="true" className={styles.searchIcon} />
        </button>
      </form>
      <button
        aria-label={closeLabel}
        className={styles.searchClose}
        onClick={onClose}
        tabIndex={isOpen ? 0 : -1}
        type="button"
      >
        <span />
        <span />
      </button>
    </div>
  );
}
