"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { Container } from "@/components/common/Container";
import type {
  QualificationCategoryId,
  QualificationsContent,
} from "@/content/about/qualifications";

import styles from "./QualificationsSection.module.scss";

type QualificationsSectionProps = {
  content: QualificationsContent;
  title: string;
};

type Preview = {
  alt: string;
  src: string;
};

export function QualificationsSection({
  content,
  title,
}: QualificationsSectionProps) {
  const [activeCategories, setActiveCategories] = useState<
    Record<string, QualificationCategoryId>
  >(() =>
    Object.fromEntries(
      content.companies.map((company) => [company.id, company.categories[0].id]),
    ),
  );
  const [preview, setPreview] = useState<Preview | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isClosingRef = useRef(false);
  const previewTriggerRef = useRef<HTMLButtonElement | null>(null);

  const closePreview = useCallback(() => {
    if (isClosingRef.current) return;

    isClosingRef.current = true;
    setIsClosing(true);
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    closeTimeoutRef.current = setTimeout(
      () => {
        setPreview(null);
        setIsClosing(false);
        isClosingRef.current = false;
      },
      prefersReducedMotion ? 0 : 220,
    );
  }, []);

  function openPreview(nextPreview: Preview, trigger: HTMLButtonElement) {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    previewTriggerRef.current = trigger;
    isClosingRef.current = false;
    setIsClosing(false);
    setPreview(nextPreview);
  }

  useEffect(
    () => () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    },
    [],
  );

  useEffect(() => {
    if (!preview) return;

    const previousOverflow = document.body.style.overflow;
    const trigger = previewTriggerRef.current;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closePreview();
    }

    window.addEventListener("keydown", handleKeyDown);
    window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      trigger?.focus();
    };
  }, [closePreview, preview]);

  return (
    <section aria-labelledby="qualifications-heading" className={styles.section}>
      <Container>
        <h2 className={styles.heading} id="qualifications-heading">
          {title}
        </h2>

        <div className={styles.companies}>
          {content.companies.map((company) => {
            const activeId =
              activeCategories[company.id] ?? company.categories[0].id;
            const activeCategory =
              company.categories.find((category) => category.id === activeId) ??
              company.categories[0];

            return (
              <article className={styles.company} key={company.id}>
                <h3 className={styles.companyName}>{company.name}</h3>
                <div className={styles.companyCard}>
                  <div
                    aria-label={company.name}
                    className={styles.tabs}
                    role="tablist"
                  >
                    {company.categories.map((category) => {
                      const isActive = category.id === activeCategory.id;

                      return (
                        <button
                          aria-controls={`${company.id}-${category.id}-panel`}
                          aria-selected={isActive}
                          className={styles.tab}
                          id={`${company.id}-${category.id}-tab`}
                          key={category.id}
                          onClick={() =>
                            setActiveCategories((current) => ({
                              ...current,
                              [company.id]: category.id,
                            }))
                          }
                          role="tab"
                          tabIndex={isActive ? 0 : -1}
                          type="button"
                        >
                          {category.label}
                        </button>
                      );
                    })}
                  </div>

                  <div
                    aria-labelledby={`${company.id}-${activeCategory.id}-tab`}
                    className={styles.gallery}
                    id={`${company.id}-${activeCategory.id}-panel`}
                    key={activeCategory.id}
                    role="tabpanel"
                  >
                    {activeCategory.images.map((src, index) => {
                      const alt = `${company.name} - ${activeCategory.label} ${index + 1}`;

                      return (
                        <button
                          aria-label={alt}
                          className={styles.imageButton}
                          key={src}
                          onClick={(event) => {
                            openPreview({ alt, src }, event.currentTarget);
                          }}
                          type="button"
                        >
                          <Image
                            alt={alt}
                            className={styles.certificate}
                            fill
                            sizes="(max-width: 767px) 42vw, 27vw"
                            src={src}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Container>

      {preview &&
        createPortal(
          <div
            aria-label={preview.alt}
            aria-modal="true"
            className={`${styles.lightbox} ${isClosing ? styles.lightboxClosing : ""}`}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) closePreview();
            }}
            role="dialog"
          >
            <button
              aria-label={content.closeLabel}
              className={styles.closeButton}
              onClick={closePreview}
              ref={closeButtonRef}
              type="button"
            >
              <span />
              <span />
            </button>
            <div className={styles.previewImage}>
              <Image
                alt={preview.alt}
                className={styles.previewCertificate}
                fill
                sizes="92vw"
                src={preview.src}
              />
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
}
