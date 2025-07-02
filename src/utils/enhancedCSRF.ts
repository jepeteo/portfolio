// Enhanced CSRF Protection System for Portfolio (2025)
import { securityConfig } from "./security"

interface CSRFToken {
  token: string
  createdAt: number
  expiresAt: number
  used: boolean
}

export class CSRFProtection {
  private static STORAGE_KEY = "csrf_tokens"
  private static SESSION_KEY = "csrf_session"

  // Generate a cryptographically secure token
  public static generateToken(): string {
    const array = new Uint8Array(securityConfig.csrf.tokenLength)
    crypto.getRandomValues(array)
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
      ""
    )
  }

  // Generate a new CSRF token with expiration
  public static createToken(): CSRFToken {
    const now = Date.now()
    const token: CSRFToken = {
      token: this.generateToken(),
      createdAt: now,
      expiresAt: now + securityConfig.csrf.tokenTTL,
      used: false,
    }

    // Store token in sessionStorage for this session
    this.storeToken(token)

    return token
  }

  // Store token securely
  private static storeToken(csrfToken: CSRFToken): void {
    try {
      // Get existing tokens
      const tokens = this.getStoredTokens()

      // Clean up expired tokens
      const validTokens = tokens.filter((t) => t.expiresAt > Date.now())

      // Add new token
      validTokens.push(csrfToken)

      // Limit to 5 tokens max to prevent memory issues
      const limitedTokens = validTokens.slice(-5)

      sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(limitedTokens))
    } catch (error) {
      console.warn("Failed to store CSRF token:", error)
    }
  }

  // Get stored tokens
  private static getStoredTokens(): CSRFToken[] {
    try {
      const stored = sessionStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.warn("Failed to retrieve CSRF tokens:", error)
      return []
    }
  }

  // Validate a CSRF token
  public static validateToken(tokenToValidate: string): boolean {
    if (
      !tokenToValidate ||
      tokenToValidate.length !== securityConfig.csrf.tokenLength * 2
    ) {
      return false
    }

    const tokens = this.getStoredTokens()
    const now = Date.now()

    // Find matching, non-expired, unused token
    const tokenIndex = tokens.findIndex(
      (t) => t.token === tokenToValidate && t.expiresAt > now && !t.used
    )

    if (tokenIndex === -1) {
      return false
    }

    // Mark token as used (one-time use)
    tokens[tokenIndex].used = true

    // Update storage
    try {
      sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(tokens))
    } catch (error) {
      console.warn("Failed to update CSRF token:", error)
    }

    return true
  }

  // Get the current valid token (or create new one)
  public static getCurrentToken(): string {
    const tokens = this.getStoredTokens()
    const now = Date.now()

    // Find a valid, unused token
    const validToken = tokens.find((t) => t.expiresAt > now && !t.used)

    if (validToken) {
      return validToken.token
    }

    // Create new token if none exists
    const newToken = this.createToken()
    return newToken.token
  }

  // Check if any valid tokens exist
  public static hasValidToken(): boolean {
    const tokens = this.getStoredTokens()
    const now = Date.now()

    return tokens.some((t) => t.expiresAt > now && !t.used)
  }

  // Clear all tokens (useful for logout)
  public static clearTokens(): void {
    try {
      sessionStorage.removeItem(this.STORAGE_KEY)
      sessionStorage.removeItem(this.SESSION_KEY)
    } catch (error) {
      console.warn("Failed to clear CSRF tokens:", error)
    }
  }

  // Get token for form inclusion
  public static getTokenForForm(): { token: string; fieldName: string } {
    return {
      token: this.getCurrentToken(),
      fieldName: securityConfig.csrf.headerName.toLowerCase().replace("x-", ""),
    }
  }

  // Validate token from form data
  public static validateFromFormData(
    formData: FormData | Record<string, any>
  ): boolean {
    const fieldName = securityConfig.csrf.headerName
      .toLowerCase()
      .replace("x-", "")

    let token: string | null = null

    if (formData instanceof FormData) {
      token = formData.get(fieldName) as string
    } else {
      token = formData[fieldName] || formData.csrfToken
    }

    if (!token) {
      console.warn("CSRF token missing from form data")
      return false
    }

    return this.validateToken(token)
  }

  // Create a session identifier
  public static createSession(): string {
    const sessionId = this.generateToken()
    try {
      sessionStorage.setItem(this.SESSION_KEY, sessionId)
    } catch (error) {
      console.warn("Failed to store session ID:", error)
    }
    return sessionId
  }

  // Get current session
  public static getCurrentSession(): string | null {
    try {
      return sessionStorage.getItem(this.SESSION_KEY)
    } catch (error) {
      console.warn("Failed to retrieve session ID:", error)
      return null
    }
  }

  // Cleanup expired tokens (call periodically)
  public static cleanup(): void {
    const tokens = this.getStoredTokens()
    const now = Date.now()

    const validTokens = tokens.filter((t) => t.expiresAt > now)

    try {
      sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(validTokens))
    } catch (error) {
      console.warn("Failed to cleanup CSRF tokens:", error)
    }
  }
}

// Legacy compatibility functions
export const generateCSRFToken = (): string => {
  return CSRFProtection.getCurrentToken()
}

export const validateCSRFToken = (
  token: string,
  _sessionToken?: string
): boolean => {
  // For backward compatibility, ignore sessionToken and use new validation
  return CSRFProtection.validateToken(token)
}

// Auto-cleanup on page load
if (typeof window !== "undefined") {
  // Cleanup expired tokens on page load
  CSRFProtection.cleanup()

  // Cleanup every 5 minutes
  setInterval(() => {
    CSRFProtection.cleanup()
  }, 5 * 60 * 1000)
}

export default CSRFProtection
