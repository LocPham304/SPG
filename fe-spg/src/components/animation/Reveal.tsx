"use client";

import gsap from "gsap";
import { useLayoutEffect, useRef, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
};

export function Reveal({
  children,
  className,
  delay = 0,
  distance = 24,
}: RevealProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          rootRef.current,
          { autoAlpha: 0, y: distance },
          {
            autoAlpha: 1,
            delay,
            duration: 0.8,
            ease: "power3.out",
            y: 0,
          },
        );
      });
    }, rootRef);

    return () => {
      media.revert();
      context.revert();
    };
  }, [delay, distance]);

  return (
    <div className={className} ref={rootRef}>
      {children}
    </div>
  );
}
