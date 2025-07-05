import { useCallback } from "react"

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
