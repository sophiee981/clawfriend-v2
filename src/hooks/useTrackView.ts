"use client";

import { useEffect, useRef } from "react";

interface UseTrackViewOptions {
  /**
   * Minimum percentage of element that must be visible (0-1)
   * Default: 0.5 (50% of element must be visible)
   */
  threshold?: number;
  /**
   * Root margin for intersection observer
   * Default: "0px" (element must be fully in viewport)
   */
  rootMargin?: string;
  /**
   * Minimum time element must be visible before tracking (ms)
   * Default: 500ms
   */
  minVisibleTime?: number;
}

/**
 * Hook to track view when element is actually visible in viewport
 * Uses IntersectionObserver to ensure element is truly visible before tracking
 */
export const useTrackView = (
  onTrack: () => void,
  options?: UseTrackViewOptions
) => {
  const ref = useRef<HTMLDivElement>(null);
  const hasTrackedRef = useRef(false);
  const visibleTimeRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    threshold = 0.5,
    rootMargin = "0px",
    minVisibleTime = 500,
  } = options || {};

  useEffect(() => {
    const element = ref.current;
    if (!element || hasTrackedRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Don't track if already tracked
        if (hasTrackedRef.current) {
          observer.disconnect();
          return;
        }

        if (entry.isIntersecting) {
          // Element is visible, start timer if not already started
          if (visibleTimeRef.current === null) {
            visibleTimeRef.current = Date.now();
          }

          // Clear any existing timeout
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }

          // Set timeout to track after minimum visible time
          timeoutRef.current = setTimeout(() => {
            // Double check before tracking
            if (!hasTrackedRef.current && ref.current) {
              hasTrackedRef.current = true;
              onTrack();
              observer.disconnect();
            }
          }, minVisibleTime);
        } else {
          // Element is not visible, reset timer
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          visibleTimeRef.current = null;
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [onTrack, threshold, rootMargin, minVisibleTime]);

  return ref;
};
