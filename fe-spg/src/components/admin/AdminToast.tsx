"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type AdminToastTone = "error" | "success" | "warning";

type AdminToastProps = {
  duration?: number;
  message: string;
  onDismiss: () => void;
  tone: AdminToastTone;
};

const toneClassNames: Record<AdminToastTone, string> = {
  error: "border-red-300 text-red-700",
  success: "border-emerald-300 text-emerald-800",
  warning: "border-amber-300 text-amber-800",
};

export function AdminToast({
  duration = 4500,
  message,
  onDismiss,
  tone,
}: AdminToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const onDismissRef = useRef(onDismiss);

  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

  useEffect(() => {
    let dismissTimeoutId: number | undefined;
    const animationFrameId = window.requestAnimationFrame(() => {
      setIsVisible(true);
    });
    const timeoutId = window.setTimeout(() => {
      setIsVisible(false);
      dismissTimeoutId = window.setTimeout(() => {
        onDismissRef.current();
      }, 180);
    }, duration);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.clearTimeout(timeoutId);
      if (dismissTimeoutId !== undefined) {
        window.clearTimeout(dismissTimeoutId);
      }
    };
  }, [duration, message, tone]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className={`fixed right-4 top-4 z-[1000] w-[min(420px,calc(100vw-32px))] border bg-white px-[18px] py-4 text-sm font-semibold leading-[1.55] shadow-[0_16px_40px_rgba(15,23,42,0.18)] transition duration-200 ease-out sm:right-6 sm:top-6 ${
        toneClassNames[tone]
      } ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "-translate-y-2 opacity-0"
      }`}
      role={tone === "error" ? "alert" : "status"}
    >
      {message}
    </div>,
    document.body,
  );
}
