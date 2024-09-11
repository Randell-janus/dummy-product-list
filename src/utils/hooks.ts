import { useCallback, useEffect, useState } from "react";

// export function useDebounce(
//   effect: () => void,
//   dependencies: React.DependencyList,
//   delay: number
// ) {
//   const callback = useCallback(effect, dependencies);

//   useEffect(() => {
//     if (dependencies[0]) {
//       const timeout = setTimeout(callback, delay);
//       return () => clearTimeout(timeout);
//     }
//   }, [callback, delay]);
// }

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
