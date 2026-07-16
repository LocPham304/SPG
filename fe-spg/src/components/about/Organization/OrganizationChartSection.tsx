"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { Container } from "@/components/common/Container";

import styles from "./OrganizationChartSection.module.scss";

type OrganizationChartSectionProps = {
  closeLabel: string;
  title: string;
};

const organizationChart =
  "/images/uploads/allimg/20241018/1bd9d76794e94538c943455cba3dc984.png";

export function OrganizationChartSection({
  closeLabel,
  title,
}: OrganizationChartSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isClosingRef = useRef(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const closeLightbox = useCallback(() => {
    if (isClosingRef.current) return;

    isClosingRef.current = true;
    setIsClosing(true);
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    closeTimeoutRef.current = setTimeout(
      () => {
        setIsOpen(false);
        setIsClosing(false);
        isClosingRef.current = false;
      },
      prefersReducedMotion ? 0 : 220,
    );
  }, []);

  function openLightbox() {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    isClosingRef.current = false;
    setIsClosing(false);
    setIsOpen(true);
  }

  useEffect(
    () => () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    },
    [],
  );

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const trigger = triggerRef.current;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeLightbox();
    }

    window.addEventListener("keydown", handleKeyDown);
    window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      trigger?.focus();
    };
  }, [closeLightbox, isOpen]);

  return (
    <section
      aria-labelledby="organization-chart-heading"
      className={styles.section}
    >
      <Container>
        <h2 className={styles.heading} id="organization-chart-heading">
          {title}
        </h2>
        <div
          aria-label={title}
          className={styles.chartViewport}
          role="region"
          tabIndex={0}
        >
          <button
            aria-haspopup="dialog"
            className={styles.chartTrigger}
            onClick={openLightbox}
            ref={triggerRef}
            type="button"
          >
            <Image
              alt={title}
              className={styles.chart}
              fill
              sizes="(max-width: 767px) 92vw, 86vw"
              src={organizationChart}
            />
          </button>
        </div>
      </Container>
      {isOpen &&
        createPortal(
          <div
            aria-label={title}
            aria-modal="true"
            className={`${styles.lightbox} ${isClosing ? styles.lightboxClosing : ""}`}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) closeLightbox();
            }}
            role="dialog"
          >
            <button
              aria-label={closeLabel}
              className={styles.closeButton}
              onClick={closeLightbox}
              ref={closeButtonRef}
              type="button"
            >
              <span />
              <span />
            </button>
            <div className={styles.lightboxContent}>
              <Image
                alt={title}
                className={styles.lightboxImage}
                fill
                sizes="100vw"
                src={organizationChart}
              />
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
}
