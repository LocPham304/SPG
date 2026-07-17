"use client";

import { useEffect } from "react";

type ScrollToSectionProps = {
  targetId: string;
};

export function ScrollToSection({ targetId }: ScrollToSectionProps) {
  useEffect(() => {
    const target = document.getElementById(targetId);

    if (!target) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const frameId = window.requestAnimationFrame(() => {
      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [targetId]);

  return null;
}
