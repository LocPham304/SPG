"use client";

import { MessageCircle, MessageCircleMore, Phone } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import styles from "./SiteLayout.module.scss";

type ContactSupportProps = {
  phoneLabel: string;
  supportLabel: string;
  zaloLabel: string;
};

const supportPhone = "+84772066685";
const zaloUrl = "https://zalo.me/0772066685";

export function ContactSupport({
  phoneLabel,
  supportLabel,
  zaloLabel,
}: ContactSupportProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className={styles.contactSupport} ref={rootRef}>
      <div
        aria-hidden={!isOpen}
        className={styles.contactSupportMenu}
        data-open={isOpen}
        id="contact-support-menu"
      >
        <a href={`tel:${supportPhone}`} onClick={() => setIsOpen(false)}>
          <span className={styles.contactSupportItemIcon}>
            <Phone aria-hidden="true" size={18} strokeWidth={1.8} />
          </span>
          <span>
            <strong>{phoneLabel}</strong>
          </span>
        </a>
        <a
          href={zaloUrl}
          onClick={() => setIsOpen(false)}
          rel="noopener noreferrer"
          target="_blank"
        >
          <span className={styles.contactSupportItemIcon}>
            <MessageCircle aria-hidden="true" size={18} strokeWidth={1.8} />
          </span>
          <strong>{zaloLabel}</strong>
        </a>
      </div>

      <button
        aria-controls="contact-support-menu"
        aria-expanded={isOpen}
        aria-label={supportLabel}
        className={styles.contactSupportButton}
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <MessageCircleMore aria-hidden="true" size={22} strokeWidth={1.7} />
      </button>
    </div>
  );
}
