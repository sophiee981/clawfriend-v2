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
 */
export const useParallax = (speed: number = 0.5) => {
  const ref = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);
  const rafRef = useRef<number | null>(null);
  const speedRef = useRef(speed);

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

    const handleScroll = () => {
      const scrollContainer = document.querySelector(
        "[data-landing-scroll-container]"
      ) as HTMLElement;
      
      if (!scrollContainer) return;

      const scrollY = scrollContainer.scrollTop;
      const elementTop = element.offsetTop;
      const elementHeight = element.offsetHeight;
      const windowHeight = window.innerHeight;

      // Only apply parallax when element is near viewport
      if (
        scrollY + windowHeight > elementTop &&
        scrollY < elementTop + elementHeight
      ) {
        const parallaxOffset = (scrollY - elementTop) * speedRef.current;

        // Use requestAnimationFrame to batch updates
        if (rafRef.current !== null) {
          cancelAnimationFrame(rafRef.current);
        }

        rafRef.current = requestAnimationFrame(() => {
          setOffset(parallaxOffset);
          rafRef.current = null;
        });
      }
    };

    const scrollContainer = document.querySelector(
      "[data-landing-scroll-container]"
    );

    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
      handleScroll(); // Initial call
    }

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, []); // Empty deps - speed is handled via ref

  return { ref, offset };
};

/**
 * Hook for scroll progress
 */
export const useScrollProgress = () => {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const lastProgressRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollContainer = document.querySelector(
        "[data-landing-scroll-container]"
      ) as HTMLElement;

      if (!scrollContainer) return;

      const scrollTop = scrollContainer.scrollTop;
      const scrollHeight = scrollContainer.scrollHeight;
      const clientHeight = scrollContainer.clientHeight;

      const totalScroll = scrollHeight - clientHeight;
      const currentProgress = (scrollTop / totalScroll) * 100;
      const clampedProgress = Math.min(100, Math.max(0, currentProgress));

      // Only update if progress changed significantly (reduce unnecessary updates)
      if (Math.abs(clampedProgress - lastProgressRef.current) < 0.1) {
        return;
      }

      lastProgressRef.current = clampedProgress;

      // Use requestAnimationFrame to batch updates
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        setProgress(clampedProgress);
        rafRef.current = null;
      });
    };

    const scrollContainer = document.querySelector(
      "[data-landing-scroll-container]"
    );

    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
      handleScroll(); // Initial call
    }

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
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
