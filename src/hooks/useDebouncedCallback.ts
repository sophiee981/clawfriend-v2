import { useCallback, useRef } from "react";

/**
 * Returns a debounced version of the callback that delays execution until
 * after `delay` ms have elapsed since the last call.
 */
export function useDebouncedCallback<
  T extends (...args: Parameters<T>) => void
>(callback: T, delay: number): T {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(callback);

  callbackRef.current = callback;

  const debouncedFn = useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
        timeoutRef.current = null;
      }, delay);
    }) as T,
    [delay]
  );

  return debouncedFn;
}
