import { useEffect, useRef } from "react";

type Callback<T extends unknown[]> = (...args: T) => void;

const useDebounce = <T extends unknown[]>(
  callback: Callback<T>,
  delay: number,
) => {
  const timerIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerIdRef.current) clearTimeout(timerIdRef.current);
    };
  }, []);

  const debounceCallback = (...args: T) => {
    if (timerIdRef.current) {
      clearTimeout(timerIdRef.current);
    }
    timerIdRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };
  return debounceCallback;
};
export default useDebounce;
