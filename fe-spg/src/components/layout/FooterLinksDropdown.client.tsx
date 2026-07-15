"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { footerPartnerLinks } from "@/data/company";

import styles from "./SiteLayout.module.scss";

type FooterLinksDropdownProps = {
  label: string;
  menuLabel: string;
};

export function FooterLinksDropdown({
  label,
  menuLabel,
}: FooterLinksDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className={styles.footerLinks} ref={rootRef}>
      <div
        aria-hidden={!isOpen}
        aria-label={menuLabel}
        className={styles.footerLinksMenu}
        data-open={isOpen}
        id="footer-partner-links"
      >
        {footerPartnerLinks.map((link) => (
          <a
            href={link.href}
            key={link.href}
            onClick={() => setIsOpen(false)}
            rel="noopener noreferrer"
            tabIndex={isOpen ? 0 : -1}
            target="_blank"
          >
            {link.label}
          </a>
        ))}
      </div>
      <button
        aria-controls="footer-partner-links"
        aria-expanded={isOpen}
        className={styles.footerLinksTrigger}
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <span>{label}</span>
        <ChevronDown aria-hidden="true" size={13} strokeWidth={1.8} />
      </button>
    </div>
  );
}
