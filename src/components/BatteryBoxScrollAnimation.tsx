"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type SyntheticEvent } from "react";
import styles from "./BatteryBoxScrollAnimation.module.css";

type BatteryBoxScrollAnimationProps = {
  frameCount?: number;
  frameBasePath?: string;
  className?: string;
  /**
   * How much of the animation element should be visible before the sequence starts.
   * 0.1 means the sequence starts when roughly 10% of the element has entered the viewport.
   */
  startVisibleRatio?: number;
  /**
   * Where the animation should be complete while leaving the viewport.
   * 0.18 means the final frame is reached when the element bottom is around 18% of the viewport height.
   */
  endViewportRatio?: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function padFrame(index: number) {
  return String(index).padStart(3, "0");
}

export default function BatteryBoxScrollAnimation({
  frameCount = 60,
  frameBasePath = "/animations/battery-box/frames",
  className = "",
  startVisibleRatio = 0.1,
  endViewportRatio = 0.18,
}: BatteryBoxScrollAnimationProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<Array<HTMLImageElement | null>>([]);
  const loadedRef = useRef<boolean[]>([]);
  const frameRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const [isReady, setIsReady] = useState(false);

  const frames = useMemo(
    () =>
      Array.from(
        { length: frameCount },
        (_, index) => `${frameBasePath}/frame-${padFrame(index + 1)}.webp`,
      ),
    [frameBasePath, frameCount],
  );

  const getNearestLoadedFrame = useCallback(
    (index: number) => {
      if (loadedRef.current[index]) return index;

      for (let offset = 1; offset < frameCount; offset += 1) {
        const before = index - offset;
        const after = index + offset;

        if (before >= 0 && loadedRef.current[before]) return before;
        if (after < frameCount && loadedRef.current[after]) return after;
      }

      return 0;
    },
    [frameCount],
  );

  const drawFrame = useCallback(
    (index: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const safeIndex = getNearestLoadedFrame(index);
      const image = imagesRef.current[safeIndex];
      if (!image) return;

      const context = canvas.getContext("2d", { alpha: true });
      if (!context) return;

      const rect = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(rect.width * pixelRatio));
      const height = Math.max(1, Math.round(rect.height * pixelRatio));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      context.clearRect(0, 0, width, height);
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";

      const imageRatio = image.naturalWidth / image.naturalHeight;
      const canvasRatio = width / height;
      let drawWidth = width;
      let drawHeight = height;

      if (imageRatio > canvasRatio) {
        drawHeight = width / imageRatio;
      } else {
        drawWidth = height * imageRatio;
      }

      const x = (width - drawWidth) / 2;
      const y = (height - drawHeight) / 2;
      context.drawImage(image, x, y, drawWidth, drawHeight);
    },
    [getNearestLoadedFrame],
  );

  const getViewportProgress = useCallback(() => {
    const root = rootRef.current;
    if (!root) return 0;

    const rect = root.getBoundingClientRect();
    const viewportHeight = Math.max(window.innerHeight, 1);
    const elementTop = rect.top + window.scrollY;
    const elementHeight = Math.max(rect.height, 1);

    const rawStart = elementTop + elementHeight * startVisibleRatio - viewportHeight;
    const startScroll = Math.max(0, rawStart);
    const endScroll = Math.max(
      startScroll + 1,
      elementTop + elementHeight - viewportHeight * endViewportRatio,
    );

    return clamp((window.scrollY - startScroll) / (endScroll - startScroll), 0, 1);
  }, [endViewportRatio, startVisibleRatio]);

  const updateFrame = useCallback(() => {
    const progress = getViewportProgress();
    const nextFrame = clamp(Math.round(progress * (frameCount - 1)), 0, frameCount - 1);

    if (nextFrame !== frameRef.current) {
      frameRef.current = nextFrame;
    }

    drawFrame(nextFrame);
  }, [drawFrame, frameCount, getViewportProgress]);

  useEffect(() => {
    let cancelled = false;
    imagesRef.current = Array(frameCount).fill(null);
    loadedRef.current = Array(frameCount).fill(false);
    frameRef.current = 0;

    frames.forEach((src, index) => {
      const image = new window.Image();
      image.decoding = "async";
      image.loading = "eager";
      image.src = src;

      image.onload = () => {
        if (cancelled) return;

        imagesRef.current[index] = image;
        loadedRef.current[index] = true;

        if (index === 0) {
          drawFrame(0);
        }

        if (loadedRef.current.every(Boolean)) {
          setIsReady(true);
          updateFrame();
        }
      };

      image.onerror = () => {
        if (cancelled) return;
        loadedRef.current[index] = false;
      };
    });

    return () => {
      cancelled = true;
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [drawFrame, frameCount, frames, updateFrame]);

  useEffect(() => {
    const scheduleUpdate = () => {
      if (rafRef.current !== null) return;

      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        updateFrame();
      });
    };

    updateFrame();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("orientationchange", scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("orientationchange", scheduleUpdate);

      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [updateFrame]);

  const preventAssetMenu = (event: SyntheticEvent) => {
    event.preventDefault();
  };

  return (
    <div
      ref={rootRef}
      className={`${styles.root} ${isReady ? styles.ready : ""} ${className}`.trim()}
      aria-label="Animasi kardus aki"
      onContextMenu={preventAssetMenu}
      onDragStart={preventAssetMenu}
    >
      <div className={styles.stage} aria-hidden="true">
        <span className={styles.halo} />
        <span className={styles.aura} />
        <span className={styles.ringOuter} />
        <span className={styles.ringInner} />
        <span className={styles.scan} />
        <span className={`${styles.spark} ${styles.sparkOne}`} />
        <span className={`${styles.spark} ${styles.sparkTwo}`} />
        <span className={`${styles.spark} ${styles.sparkThree}`} />
        <span className={styles.floor} />
      </div>

      <canvas
        ref={canvasRef}
        className={styles.canvas}
        width={540}
        height={540}
        aria-hidden="true"
      />

      {!isReady ? <span className={styles.loading}>Memuat animasi...</span> : null}
    </div>
  );
}
