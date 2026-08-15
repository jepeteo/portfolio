export const HEADER_SCROLL_OFFSET = "7rem"

export const hashTargetId = (hash: string) => {
  if (!hash) return ""
  try {
    return decodeURIComponent(hash.replace(/^#/, ""))
  } catch {
    return hash.replace(/^#/, "")
  }
}

export const waitForElement = (
  id: string,
  timeoutMs = 1500
): Promise<HTMLElement | null> => {
  if (!id || typeof document === "undefined") {
    return Promise.resolve(null)
  }

  const existing = document.getElementById(id)
  if (existing) return Promise.resolve(existing)

  return new Promise((resolve) => {
    const finish = (node: HTMLElement | null) => {
      window.clearTimeout(timer)
      observer.disconnect()
      resolve(node)
    }

    const observer = new MutationObserver(() => {
      const node = document.getElementById(id)
      if (node) finish(node)
    })

    const timer = window.setTimeout(() => {
      finish(document.getElementById(id))
    }, timeoutMs)

    observer.observe(document.body, { childList: true, subtree: true })
  })
}

export const shouldRestoreScroll = (
  navigationType: string,
  hash: string
) => navigationType === "POP" && !hash
