"use client";

import { useEffect, useRef } from "react";

import styles from "./SiteLayout.module.scss";

export function FooterWave() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let animationFrame = 0;

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(rect.width * ratio));
      const height = Math.max(1, Math.round(rect.height * ratio));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, rect.width, rect.height);
      context.lineWidth = 0.7;

      const lineCount = 34;
      for (let line = 0; line < lineCount; line += 1) {
        const progress = line / (lineCount - 1);
        const amplitude = 26 + progress * 70;
        const baseline = rect.height * (0.49 + progress * 0.34);
        const phase = frame * 0.012 + line * 0.065;

        context.beginPath();
        for (let x = -20; x <= rect.width + 20; x += 8) {
          const wave =
            Math.sin(x * 0.008 + phase) * amplitude +
            Math.sin(x * 0.0032 - phase * 0.7) * amplitude * 0.42;
          const y = baseline + wave;
          if (x === -20) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        context.strokeStyle = `rgba(57, 145, 210, ${0.045 + progress * 0.035})`;
        context.stroke();
      }
    };

    const animate = () => {
      frame += 1;
      draw();
      animationFrame = window.requestAnimationFrame(animate);
    };

    const resizeObserver = new ResizeObserver(draw);
    resizeObserver.observe(canvas);
    draw();
    if (!reducedMotion.matches) animate();

    return () => {
      resizeObserver.disconnect();
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className={styles.footerWave} aria-hidden="true" />
  );
}
