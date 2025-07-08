import { useState, useEffect, useRef, useCallback } from "react"

interface UseProjectImageOptions {
  src: string
  shouldLoad: boolean
  onError?: (projectName: string) => void
  projectName: string
}

interface UseProjectImageReturn {
  imageRef: React.RefObject<HTMLImageElement>
  isLoading: boolean
  hasError: boolean
  isLoaded: boolean
}

export const useProjectImage = ({
  src,
  shouldLoad,
  onError,
  projectName,
}: UseProjectImageOptions): UseProjectImageReturn => {
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)

  const handleLoad = useCallback(() => {
    setIsLoading(false)
    setHasError(false)
    setIsLoaded(true)
  }, [])

  const handleError = useCallback(() => {
    setIsLoading(false)
    setHasError(true)
    setIsLoaded(false)
    onError?.(projectName)
  }, [onError, projectName])

  useEffect(() => {
    if (!shouldLoad) {
      setIsLoading(false)
      setHasError(false)
      setIsLoaded(false)
      return
    }

    // Check if image is already cached
    if (
      imageRef.current &&
      imageRef.current.complete &&
      imageRef.current.naturalHeight > 0
    ) {
      setIsLoaded(true)
      setIsLoading(false)
      return
    }

    // Start loading
    setIsLoading(true)
    setHasError(false)
    setIsLoaded(false)

    // Create new image for preloading
    const img = new Image()
    img.onload = handleLoad
    img.onerror = handleError
    img.src = src

    // Cleanup function
    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [src, shouldLoad, handleLoad, handleError])

  return {
    imageRef,
    isLoading,
    hasError,
    isLoaded,
  }
}
