"use client";

import { ArrowUpToLine } from "lucide-react";
import { useEffect, useState } from "react";

import styles from "./SiteLayout.module.scss";

export function BackToTop({ label }: { label: string }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let animationFrame = 0;
    const updateVisibility = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(() => {
        setIsVisible(window.scrollY > Math.max(520, window.innerHeight * 0.65));
      });
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  const scrollToTop = () => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  };

  return (
    <button
      aria-label={label}
      className={styles.globalBackToTop}
      data-visible={isVisible}
      onClick={scrollToTop}
      type="button"
    >
      <ArrowUpToLine aria-hidden="true" size={24} strokeWidth={1.35} />
    </button>
  );
}
