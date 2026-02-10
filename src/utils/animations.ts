"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Hook to detect if element is in viewport using Intersection Observer
 */
export const useInView = (options?: IntersectionObserverInit) => {
  const ref = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);
  const hasAnimatedRef = useRef(false);
  const optionsRef = useRef(options);

  // Update options ref when options change
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setIsInView(true);
      hasAnimatedRef.current = true;
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          setIsInView(true);
          hasAnimatedRef.current = true;
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
        ...optionsRef.current,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []); // Empty deps - only run once

  return { ref, isInView };
};

/**
 * Hook for parallax scrolling effect
 * Optimized: only calculates when element is in viewport, uses RAF throttling
 */
export const useParallax = (speed: number = 0.5) => {
  const ref = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);
  const rafRef = useRef<number | null>(null);
  const speedRef = useRef(speed);
  const scrollContainerRef = useRef<HTMLElement | null>(null);
  const lastOffsetRef = useRef(0);

  // Update speed ref when speed changes
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const scrollContainer = document.querySelector(
      "[data-landing-scroll-container]"
    ) as HTMLElement;

    if (!scrollContainer) return;

    scrollContainerRef.current = scrollContainer;

    // Cache element position to avoid repeated getBoundingClientRect calls
    let cachedElementTop = element.offsetTop;
    let cachedElementHeight = element.offsetHeight;
    const windowHeight = window.innerHeight;

    const handleScroll = () => {
      if (!scrollContainerRef.current || !element) return;

      const scrollY = scrollContainerRef.current.scrollTop;

      // Only apply parallax when element is near viewport (with buffer)
      const viewportTop = scrollY;
      const viewportBottom = scrollY + windowHeight;
      const elementBottom = cachedElementTop + cachedElementHeight;

      // Check if element is in viewport with buffer zone
      if (
        viewportBottom + windowHeight > cachedElementTop &&
        viewportTop - windowHeight < elementBottom
      ) {
        const parallaxOffset = (scrollY - cachedElementTop) * speedRef.current;

        // Only update if offset changed significantly (reduce unnecessary updates)
        if (Math.abs(parallaxOffset - lastOffsetRef.current) < 0.5) {
          return;
        }

        // Use requestAnimationFrame to batch updates
        if (rafRef.current !== null) {
          cancelAnimationFrame(rafRef.current);
        }

        rafRef.current = requestAnimationFrame(() => {
          lastOffsetRef.current = parallaxOffset;
          setOffset(parallaxOffset);
          rafRef.current = null;
        });
      } else {
        // Reset offset when element is far from viewport
        if (lastOffsetRef.current !== 0) {
          if (rafRef.current !== null) {
            cancelAnimationFrame(rafRef.current);
          }
          rafRef.current = requestAnimationFrame(() => {
            lastOffsetRef.current = 0;
            setOffset(0);
            rafRef.current = null;
          });
        }
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call

    // Update cached position on resize
    const handleResize = () => {
      if (element) {
        cachedElementTop = element.offsetTop;
        cachedElementHeight = element.offsetHeight;
      }
    };
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      scrollContainer.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      scrollContainerRef.current = null;
    };
  }, []); // Empty deps - speed is handled via ref

  return { ref, offset };
};

/**
 * Hook for scroll progress
 * Optimized for performance: uses RAF throttling and reduces state updates
 */
export const useScrollProgress = () => {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const lastProgressRef = useRef(0);
  const scrollContainerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const scrollContainer = document.querySelector(
      "[data-landing-scroll-container]"
    ) as HTMLElement;

    if (!scrollContainer) return;

    scrollContainerRef.current = scrollContainer;

    const handleScroll = () => {
      // Cancel previous RAF if exists
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }

      // Batch scroll updates using RAF
      rafRef.current = requestAnimationFrame(() => {
        if (!scrollContainerRef.current) {
          rafRef.current = null;
          return;
        }

        const scrollTop = scrollContainerRef.current.scrollTop;
        const scrollHeight = scrollContainerRef.current.scrollHeight;
        const clientHeight = scrollContainerRef.current.clientHeight;

        const totalScroll = scrollHeight - clientHeight;
        if (totalScroll <= 0) {
          rafRef.current = null;
          return;
        }

        const currentProgress = (scrollTop / totalScroll) * 100;
        const clampedProgress = Math.min(100, Math.max(0, currentProgress));

        // Only update if progress changed significantly (increase threshold to reduce updates)
        // Changed from 0.5% to 1% to reduce state updates by ~50%
        if (Math.abs(clampedProgress - lastProgressRef.current) >= 1) {
          lastProgressRef.current = clampedProgress;
          setProgress(clampedProgress);
        }

        rafRef.current = null;
      });
    };

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      scrollContainer.removeEventListener("scroll", handleScroll);
      scrollContainerRef.current = null;
    };
  }, []);

  return progress;
};

/**
 * Hook for staggered animations
 */
export const useStaggeredInView = (
  itemCount: number,
  staggerDelay: number = 100
) => {
  const ref = useRef<HTMLElement>(null);
  const [visibleItems, setVisibleItems] = useState<number[]>([]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setVisibleItems(Array.from({ length: itemCount }, (_, i) => i));
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Stagger the appearance of items
          Array.from({ length: itemCount }).forEach((_, index) => {
            setTimeout(() => {
              setVisibleItems((prev) => [...prev, index]);
            }, index * staggerDelay);
          });
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [itemCount, staggerDelay]);

  return { ref, visibleItems };
};

/**
 * Animation variants for different types
 */
export const animationVariants = {
  fadeInUp: {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
  fadeInDown: {
    hidden: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0 },
  },
  fadeInLeft: {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
  },
  fadeInRight: {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  },
  slideInUp: {
    hidden: { y: 100, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  },
};

/**
 * Get animation classes based on state
 */
export const getAnimationClasses = (
  isVisible: boolean,
  variant: keyof typeof animationVariants = "fadeInUp",
  duration: number = 600
) => {
  if (!isVisible) {
    return "opacity-0 translate-y-10";
  }

  const durationClass = `duration-${duration}`;

  switch (variant) {
    case "fadeInUp":
      return `animate-in fade-in slide-in-from-bottom-10 ${durationClass}`;
    case "fadeInDown":
      return `animate-in fade-in slide-in-from-top-10 ${durationClass}`;
    case "fadeInLeft":
      return `animate-in fade-in slide-in-from-left-10 ${durationClass}`;
    case "fadeInRight":
      return `animate-in fade-in slide-in-from-right-10 ${durationClass}`;
    case "scaleIn":
      return `animate-in fade-in zoom-in-95 ${durationClass}`;
    case "slideInUp":
      return `animate-in fade-in slide-in-from-bottom-20 ${durationClass}`;
    default:
      return `animate-in fade-in ${durationClass}`;
  }
};

/**
 * Utility to check if reduced motion is preferred
 */
export const prefersReducedMotion = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};
