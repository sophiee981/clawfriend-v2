import { useState, useEffect, useRef, useCallback } from "react";

interface UseScrollToTopOptions {
    /**
     * CSS selector for the scrollable container
     * If not provided, will use the ref passed to the hook
     */
    containerSelector?: string;
    /**
     * Threshold in pixels to show the scroll to top button
     * @default 300
     */
    threshold?: number;
    /**
     * Scroll behavior when scrolling to top
     * @default "smooth"
     */
    behavior?: ScrollBehavior;
}

interface UseScrollToTopReturn {
    /**
     * Whether to show the scroll to top button
     */
    showScrollTop: boolean;
    /**
     * Function to scroll to top
     */
    scrollToTop: () => void;
    /**
     * Ref to attach to the scrollable container (if not using containerSelector)
     */
    scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Custom hook to handle scroll to top functionality
 * 
 * @example
 * // Using with containerSelector
 * const { showScrollTop, scrollToTop } = useScrollToTop({
 *   containerSelector: '.my-scrollable-container',
 *   threshold: 300
 * });
 * 
 * @example
 * // Using with ref
 * const { showScrollTop, scrollToTop, scrollContainerRef } = useScrollToTop();
 * // Then attach scrollContainerRef to your scrollable element
 */
export const useScrollToTop = (
    options: UseScrollToTopOptions = {}
): UseScrollToTopReturn => {
    const {
        containerSelector,
        threshold = 300,
        behavior = "smooth",
    } = options;

    const [showScrollTop, setShowScrollTop] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const internalContainerRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        // Get the scrollable container
        let scrollContainer: HTMLElement | null = null;

        if (containerSelector) {
            scrollContainer = document.querySelector(containerSelector);
        } else if (scrollContainerRef.current) {
            scrollContainer = scrollContainerRef.current;
        }

        if (!scrollContainer) return;

        internalContainerRef.current = scrollContainer;

        const handleScroll = () => {
            setShowScrollTop(scrollContainer!.scrollTop > threshold);
        };

        // Initial check
        handleScroll();

        scrollContainer.addEventListener("scroll", handleScroll);
        return () => scrollContainer?.removeEventListener("scroll", handleScroll);
    }, [containerSelector, threshold]);

    const scrollToTop = useCallback(() => {
        const container = internalContainerRef.current;
        if (container) {
            container.scrollTo({
                top: 0,
                behavior,
            });
        }
    }, [behavior]);

    return {
        showScrollTop,
        scrollToTop,
        scrollContainerRef,
    };
};
