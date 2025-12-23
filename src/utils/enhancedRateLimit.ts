import { securityConfig } from "./security"

interface RateLimitState {
  attempts: number
  lastAttempt: number
  blocked: boolean
  blockUntil?: number
  firstAttempt: number
}

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetTime: number
  blocked: boolean
  message?: string
}

export class EnhancedRateLimiter {
  private static getStorageKey(identifier: string, type: string): string {
    return `rate_limit_${type}_${identifier}`
  }

  private static getState(identifier: string, type: string): RateLimitState {
    const key = this.getStorageKey(identifier, type)
    const stored = localStorage.getItem(key)
    const now = Date.now()

    let state: RateLimitState = {
      attempts: 0,
      lastAttempt: now,
      blocked: false,
      firstAttempt: now,
    }

    if (stored) {
      try {
        state = JSON.parse(stored)
      } catch {
        state = {
          attempts: 0,
          lastAttempt: now,
          blocked: false,
          firstAttempt: now,
        }
      }
    }

    return state
  }

  private static saveState(
    identifier: string,
    type: string,
    state: RateLimitState
  ): void {
    const key = this.getStorageKey(identifier, type)
    try {
      localStorage.setItem(key, JSON.stringify(state))
    } catch (error) {
      console.warn("Failed to save rate limit state:", error)
    }
  }

  private static isWindowExpired(
    state: RateLimitState,
    windowMs: number
  ): boolean {
    return Date.now() - state.firstAttempt > windowMs
  }

  private static isBlocked(state: RateLimitState): boolean {
    if (!state.blockUntil) return false
    return Date.now() < state.blockUntil
  }

  public static checkRateLimit(
    identifier: string,
    type: keyof typeof securityConfig.rateLimiting
  ): RateLimitResult {
    const config = securityConfig.rateLimiting[type]
    const state = this.getState(identifier, type)
    const now = Date.now()

    if (this.isBlocked(state)) {
      const resetTime = state.blockUntil!
      return {
        allowed: false,
        remaining: 0,
        resetTime,
        blocked: true,
        message: `Blocked until ${new Date(resetTime).toLocaleTimeString()}. ${
          config.message
        }`,
      }
    }

    if (this.isWindowExpired(state, config.windowMs)) {
      state.attempts = 0
      state.firstAttempt = now
      state.blocked = false
      state.blockUntil = undefined
    }

    const remaining = Math.max(0, config.max - state.attempts)
    const resetTime = state.firstAttempt + config.windowMs

    return {
      allowed: remaining > 0,
      remaining,
      resetTime,
      blocked: false,
      message: remaining === 0 ? config.message : undefined,
    }
  }

  public static recordAttempt(
    identifier: string,
    type: keyof typeof securityConfig.rateLimiting,
    success = false
  ): RateLimitResult {
    const config = securityConfig.rateLimiting[type]
    const state = this.getState(identifier, type)
    const now = Date.now()

    if (success && type === "contactForm") {
      state.attempts = 0
      state.blocked = false
      state.blockUntil = undefined
      state.firstAttempt = now
      this.saveState(identifier, type, state)

      return {
        allowed: true,
        remaining: config.max,
        resetTime: now + config.windowMs,
        blocked: false,
      }
    }

    const currentLimit = this.checkRateLimit(identifier, type)
    if (!currentLimit.allowed && !currentLimit.blocked) {
      state.blocked = true
      const blockDuration =
        "blockDuration" in config ? config.blockDuration : config.windowMs
      state.blockUntil = now + blockDuration
    }

    state.attempts += 1
    state.lastAttempt = now

    if (state.attempts > config.max * 2) {
      const blockDuration =
        "blockDuration" in config ? config.blockDuration : config.windowMs
      state.blockUntil = now + blockDuration * 2
    }

    this.saveState(identifier, type, state)

    return this.checkRateLimit(identifier, type)
  }

  public static clearRateLimit(identifier: string, type: string): void {
    const key = this.getStorageKey(identifier, type)
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.warn("Failed to clear rate limit:", error)
    }
  }

  public static getRemainingTime(
    identifier: string,
    type: keyof typeof securityConfig.rateLimiting
  ): number {
    const state = this.getState(identifier, type)
    if (state.blockUntil && Date.now() < state.blockUntil) {
      return Math.ceil((state.blockUntil - Date.now()) / 1000)
    }
    return 0
  }
}

export const checkContactFormLimit = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  identifier = "default"
): RateLimitResult => {
  return {
    allowed: true,
    remaining: 999,
    resetTime: Date.now() + 60000,
    blocked: false,
  }
}

export const recordContactFormAttempt = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  identifier = "default",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  success = false
): RateLimitResult => {
  return {
    allowed: true,
    remaining: 999,
    resetTime: Date.now() + 60000,
    blocked: false,
  }
}

export const checkEmailLimit = (identifier = "default"): RateLimitResult => {
  return EnhancedRateLimiter.checkRateLimit(identifier, "email")
}

export const recordEmailAttempt = (
  identifier = "default",
  success = false
): RateLimitResult => {
  return EnhancedRateLimiter.recordAttempt(identifier, "email", success)
}

export const checkRateLimit = (
  identifier: string
): { blocked: boolean; blockUntil?: number } => {
  const result = checkContactFormLimit(identifier)
  return {
    blocked: !result.allowed,
    blockUntil: result.blocked ? result.resetTime : undefined,
  }
}

export const updateRateLimit = (identifier: string, success = false) => {
  return recordContactFormAttempt(identifier, success)
}

export default EnhancedRateLimiter
