"use client";

import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

export type ScrollRevealProps = {
  children: ReactNode;
  animation?: "animate__fadeInUp";
  delay?: string;
  duration?: string;
  threshold?: number;
  triggerOnce?: boolean;
  className?: string;
};

type AnimateCssProperties = CSSProperties & {
  "--animate-duration": string;
  "--animate-delay": string;
};

export function ScrollReveal({
  children,
  animation = "animate__fadeInUp",
  delay = "0s",
  duration = "0.65s",
  threshold = 0.15,
  triggerOnce = true,
  className,
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    let animationFrameId = 0;

    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    const updateVisibility = (visible: boolean) => {
      if (visible) {
        setIsVisible(true);
      } else if (!triggerOnce) {
        setIsVisible(false);
      }
    };

    const checkViewportVisibility = () => {
      const rect = element.getBoundingClientRect();
      const viewportHeight =
        window.innerHeight || document.documentElement.clientHeight;
      const visibleHeight =
        Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
      const requiredVisibleHeight = Math.min(
        Math.max(rect.height * threshold, 1),
        viewportHeight * threshold,
      );

      updateVisibility(
        visibleHeight > 0 && visibleHeight >= requiredVisibleHeight,
      );
    };

    const scheduleViewportCheck = () => {
      window.cancelAnimationFrame(animationFrameId);
      animationFrameId = window.requestAnimationFrame(
        checkViewportVisibility,
      );
    };

    const handleMotionPreference = () => {
      setReduceMotion(motionPreference.matches);
      if (motionPreference.matches) setIsVisible(true);
    };

    handleMotionPreference();
    motionPreference.addEventListener("change", handleMotionPreference);

    if (motionPreference.matches || !("IntersectionObserver" in window)) {
      setIsVisible(true);

      return () => {
        window.cancelAnimationFrame(animationFrameId);
        motionPreference.removeEventListener("change", handleMotionPreference);
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        updateVisibility(entry.isIntersecting);

        if (entry.isIntersecting) {
          if (triggerOnce) observer.unobserve(entry.target);
        }
      },
      {
        rootMargin: "0px 0px -6% 0px",
        threshold,
      },
    );

    observer.observe(element);
    window.addEventListener("resize", scheduleViewportCheck);
    window.addEventListener("scroll", scheduleViewportCheck, {
      passive: true,
    });
    scheduleViewportCheck();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener("resize", scheduleViewportCheck);
      window.removeEventListener("scroll", scheduleViewportCheck);
      motionPreference.removeEventListener("change", handleMotionPreference);
    };
  }, [threshold, triggerOnce]);

  const animationStyle = {
    "--animate-duration": duration,
    "--animate-delay": delay,
    animationDelay: delay,
  } as AnimateCssProperties;

  return (
    <div
      className={[
        isVisible ? "" : "opacity-0",
        isVisible && !reduceMotion ? "animate__animated" : "",
        isVisible && !reduceMotion ? animation : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      ref={elementRef}
      style={animationStyle}
    >
      {children}
    </div>
  );
}
