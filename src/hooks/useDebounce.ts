import { useCallback } from "react"

/**
 * Creates a debounced version of a function
 * @param func The function to debounce
 * @param delay The delay in milliseconds
 * @returns The debounced function
 */
const useDebounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T => {
  let timeoutId: ReturnType<typeof setTimeout>

  const debouncedFunction = useCallback(
    (...args: Parameters<T>) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => func(...args), delay)
    },
    [func, delay]
  ) as T

  return debouncedFunction
}

export default useDebounce
