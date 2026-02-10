import { useEffect, useRef } from "react";

interface UseInfiniteScrollProps {
  hasNextPage: boolean;
  isLoadingMore: boolean;
  isLoading: boolean;
  fetchNextPage: () => void;
}

export const useInfiniteScroll = ({
  hasNextPage,
  isLoadingMore,
  isLoading,
  fetchNextPage,
}: UseInfiniteScrollProps) => {
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasNextPage &&
          !isLoadingMore &&
          !isLoading
        ) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasNextPage, isLoadingMore, isLoading, fetchNextPage]);

  return observerTarget;
};
