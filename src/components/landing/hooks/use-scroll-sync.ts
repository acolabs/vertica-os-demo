"use client";
import { useEffect, useState, useCallback, useRef } from "react";

/**
 * Maps scroll position of an element to a 0-1 progress value.
 * Used to sync scroll position to Remotion Player frame.
 */
export function useScrollSync(ref: React.RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number>(0);

  const handleScroll = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      // Element top relative to viewport, normalized to 0-1 range
      // 0 = element just entered bottom of viewport
      // 1 = element has scrolled past top of viewport
      const elementHeight = rect.height;
      const rawProgress =
        (windowHeight - rect.top) / (windowHeight + elementHeight);
      setProgress(Math.max(0, Math.min(1, rawProgress)));
    });
  }, [ref]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleScroll]);

  return progress;
}
