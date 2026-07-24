"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import styles from "./HomeAbout.module.scss";

const YOUTUBE_EMBED_URL =
  "https://www.youtube.com/embed/6v1ibWiwJIw?si=06GMsHrWjykF1dHC&autoplay=1&rel=0";

type HomeAboutYouTubeProps = {
  closeLabel: string;
  playLabel: string;
  title: string;
};

export function HomeAboutYouTube({
  closeLabel,
  playLabel,
  title,
}: HomeAboutYouTubeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const trigger = triggerRef.current;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      trigger?.focus();
    };
  }, [isOpen]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={styles.videoTrigger}
        aria-label={playLabel}
        onClick={() => setIsOpen(true)}
      >
        <span className={styles.videoThumbnail} aria-hidden="true" />
        <span className={styles.videoShade} aria-hidden="true" />
        <span className={styles.videoPlayIcon} aria-hidden="true">
          <svg viewBox="0 0 24 24" role="presentation">
            <path d="M8.4 5.7v12.6L18.9 12 8.4 5.7Z" />
          </svg>
        </span>
      </button>

      {isOpen && typeof document !== "undefined"
        ? createPortal(
            <div
              className={styles.videoModalBackdrop}
              role="dialog"
              aria-label={title}
              aria-modal="true"
              onMouseDown={() => setIsOpen(false)}
            >
              <button
                ref={closeButtonRef}
                type="button"
                className={styles.videoModalClose}
                aria-label={closeLabel}
                onMouseDown={(event) => event.stopPropagation()}
                onClick={() => setIsOpen(false)}
              >
                <span aria-hidden="true" />
              </button>
              <div
                className={styles.videoModalShell}
                onMouseDown={(event) => event.stopPropagation()}
              >
                <div className={styles.videoModal}>
                  <iframe
                    className={styles.videoIframe}
                    src={YOUTUBE_EMBED_URL}
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
