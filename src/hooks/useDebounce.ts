import { useCallback } from "react"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useDebounce = <T extends (...args: unknown[]) => unknown>(
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
