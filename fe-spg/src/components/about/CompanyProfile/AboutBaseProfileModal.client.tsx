"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

import type {
  AboutBasePopupCopy,
  AboutBaseProfile,
} from "@/content/about/company-profile/base-profiles";

import styles from "./AboutBasesSection.module.scss";

type AboutBaseProfileModalProps = {
  profiles: readonly AboutBaseProfile[];
  copy: AboutBasePopupCopy;
  onClose: () => void;
};

export function AboutBaseProfileModal({
  profiles,
  copy,
  onClose,
}: AboutBaseProfileModalProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const profile = profiles[activeIndex];
  const hasMultipleProfiles = profiles.length > 1;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      closeButtonRef.current?.focus();
    }
  }, [isMounted]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }

      if (hasMultipleProfiles && event.key === "ArrowLeft") {
        setActiveIndex((current) =>
          current === 0 ? profiles.length - 1 : current - 1,
        );
      }

      if (hasMultipleProfiles && event.key === "ArrowRight") {
        setActiveIndex((current) => (current + 1) % profiles.length);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [hasMultipleProfiles, onClose, profiles.length]);

  if (!isMounted || !profile) {
    return null;
  }

  const showPrevious = () => {
    setActiveIndex((current) =>
      current === 0 ? profiles.length - 1 : current - 1,
    );
  };

  const showNext = () => {
    setActiveIndex((current) => (current + 1) % profiles.length);
  };

  return createPortal(
    <div
      className={styles.modalBackdrop}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        aria-labelledby={titleId}
        aria-modal="true"
        className={styles.modal}
        role="dialog"
      >
        <button
          aria-label={copy.closeLabel}
          className={styles.modalClose}
          onClick={onClose}
          ref={closeButtonRef}
          type="button"
        >
          <X aria-hidden="true" />
        </button>

        <div className={styles.modalHero}>
          <Image
            alt=""
            aria-hidden="true"
            className={styles.modalHeroImage}
            fill
            sizes="(max-width: 767px) 100vw, 92vw"
            src={profile.image}
          />
          <div className={styles.modalHeroShade} />
          <h2 className={styles.modalTitle} id={titleId}>
            {profile.title}
          </h2>

          {hasMultipleProfiles ? (
            <div className={styles.modalNavigation}>
              <button
                aria-label={copy.previousLabel}
                className={styles.modalNavigationButton}
                onClick={showPrevious}
                type="button"
              >
                <ChevronLeft aria-hidden="true" />
              </button>
              <button
                aria-label={copy.nextLabel}
                className={styles.modalNavigationButton}
                onClick={showNext}
                type="button"
              >
                <ChevronRight aria-hidden="true" />
              </button>
            </div>
          ) : null}
        </div>

        <div className={styles.modalContent}>
          {profile.paragraphs.map((paragraph, index) => (
            <p key={`${profile.title}-${index}`}>{paragraph}</p>
          ))}
        </div>
      </section>
    </div>,
    document.body,
  );
}
