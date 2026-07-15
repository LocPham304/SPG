"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { usePathname } from "@/i18n/navigation";

import { DesktopNavigation } from "./DesktopNavigation";
import { HeaderActions } from "./HeaderActions";
import { HeaderLogo } from "./HeaderLogo";
import styles from "./Header.module.scss";
import { MobileNavigation } from "./MobileNavigation";
import { SearchPanel } from "./SearchPanel";
import type { HeaderLabels, HeaderNavigationItem } from "./types";

type HeaderClientProps = {
  items: readonly HeaderNavigationItem[];
  labels: HeaderLabels;
};

export function HeaderClient({ items, labels }: HeaderClientProps) {
  const pathname = usePathname();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  const closeSearch = useCallback(() => setIsSearchOpen(false), []);

  useEffect(() => {
    function updateHeaderState() {
      setIsScrolled(window.scrollY > 96);
    }

    updateHeaderState();
    window.addEventListener("scroll", updateHeaderState, { passive: true });
    return () => window.removeEventListener("scroll", updateHeaderState);
  }, []);

  useEffect(() => {
    setActiveDropdown(null);
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") {
        return;
      }

      setActiveDropdown(null);
      closeSearch();
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [closeSearch]);

  function openSearch() {
    setActiveDropdown(null);
    setIsMenuOpen(false);
    setIsSearchOpen(true);
  }

  function toggleMenu() {
    setActiveDropdown(null);
    setIsSearchOpen(false);
    setIsMenuOpen((current) => !current);
  }

  return (
    <>
      <header
        className={`${styles.header} ${isScrolled ? styles.headerScrolled : ""} ${isHeaderHovered || activeDropdown !== null ? styles.headerInteractive : ""} ${isMenuOpen ? styles.headerMenuOpen : ""}`}
        onMouseEnter={() => setIsHeaderHovered(true)}
        onMouseLeave={() => {
          setIsHeaderHovered(false);
          setActiveDropdown(null);
        }}
      >
        <div className={styles.headerInner}>
          <HeaderLogo
            homeLabel={labels.home}
            isDark={
              isScrolled ||
              isHeaderHovered ||
              activeDropdown !== null ||
              isMenuOpen
            }
          />
          <DesktopNavigation
            activeDropdown={activeDropdown}
            ariaLabel={labels.primaryNavigation}
            items={items}
            pathname={pathname}
            setActiveDropdown={setActiveDropdown}
          />
          <HeaderActions
            closeMenuLabel={labels.closeMenu}
            isMenuOpen={isMenuOpen}
            menuButtonRef={menuButtonRef}
            onMenuToggle={toggleMenu}
            onSearchOpen={openSearch}
            openMenuLabel={labels.openMenu}
            searchLabel={labels.search}
          />
        </div>
      </header>
      <SearchPanel
        closeLabel={labels.closeSearch}
        homeLabel={labels.home}
        isOpen={isSearchOpen}
        onClose={closeSearch}
        placeholder={labels.searchPlaceholder}
        searchLabel={labels.search}
      />
      <MobileNavigation
        ariaLabel={labels.mobileNavigation}
        closeLabel={labels.closeMenu}
        isOpen={isMenuOpen}
        items={items}
        onClose={closeMenu}
        pathname={pathname}
        triggerRef={menuButtonRef}
      />
    </>
  );
}
