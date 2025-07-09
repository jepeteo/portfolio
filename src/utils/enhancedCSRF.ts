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

  public static generateToken(): string {
    const array = new Uint8Array(securityConfig.csrf.tokenLength)
    crypto.getRandomValues(array)
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
      ""
    )
  }

  public static createToken(): CSRFToken {
    const now = Date.now()
    const token: CSRFToken = {
      token: this.generateToken(),
      createdAt: now,
      expiresAt: now + securityConfig.csrf.tokenTTL,
      used: false,
    }

    this.storeToken(token)

    return token
  }

  private static storeToken(csrfToken: CSRFToken): void {
    try {
      const tokens = this.getStoredTokens()

      const validTokens = tokens.filter((t) => t.expiresAt > Date.now())

      validTokens.push(csrfToken)

      const limitedTokens = validTokens.slice(-5)

      sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(limitedTokens))
    } catch {
      // Silent fail for security
    }
  }

  private static getStoredTokens(): CSRFToken[] {
    try {
      const stored = sessionStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  public static validateToken(tokenToValidate: string): boolean {
    if (
      !tokenToValidate ||
      tokenToValidate.length !== securityConfig.csrf.tokenLength * 2
    ) {
      return false
    }

    const tokens = this.getStoredTokens()
    const now = Date.now()

    const tokenIndex = tokens.findIndex(
      (t) => t.token === tokenToValidate && t.expiresAt > now && !t.used
    )

    if (tokenIndex === -1) {
      return false
    }

    tokens[tokenIndex].used = true

    try {
      sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(tokens))
    } catch {
      // Silent fail for security
    }

    return true
  }

  public static isTokenValid(tokenToValidate: string): boolean {
    if (
      !tokenToValidate ||
      tokenToValidate.length !== securityConfig.csrf.tokenLength * 2
    ) {
      return false
    }

    const tokens = this.getStoredTokens()
    const now = Date.now()

    const tokenIndex = tokens.findIndex(
      (t) => t.token === tokenToValidate && t.expiresAt > now && !t.used
    )

    return tokenIndex !== -1
  }

  public static getCurrentToken(): string {
    const tokens = this.getStoredTokens()
    const now = Date.now()

    const validToken = tokens.find((t) => t.expiresAt > now && !t.used)

    if (validToken) {
      return validToken.token
    }

    const newToken = this.createToken()
    return newToken.token
  }

  public static hasValidToken(): boolean {
    const tokens = this.getStoredTokens()
    const now = Date.now()

    return tokens.some((t) => t.expiresAt > now && !t.used)
  }

  public static clearTokens(): void {
    try {
      sessionStorage.removeItem(this.STORAGE_KEY)
      sessionStorage.removeItem(this.SESSION_KEY)
    } catch {
      // Silent fail for security
    }
  }

  public static getTokenForForm(): { token: string; fieldName: string } {
    return {
      token: this.getCurrentToken(),
      fieldName: securityConfig.csrf.headerName.toLowerCase().replace("x-", ""),
    }
  }

  public static validateFromFormData(
    formData: FormData | Record<string, unknown>
  ): boolean {
    const fieldName = securityConfig.csrf.headerName
      .toLowerCase()
      .replace("x-", "")

    let token: string | null = null

    if (formData instanceof FormData) {
      token = formData.get(fieldName) as string
    } else {
      token = (formData[fieldName] || formData.csrfToken) as string
    }

    if (!token) {
      return false
    }

    return this.validateToken(token)
  }

  public static createSession(): string {
    const sessionId = this.generateToken()
    try {
      sessionStorage.setItem(this.SESSION_KEY, sessionId)
    } catch {
      // Silent fail for security
    }
    return sessionId
  }

  public static getCurrentSession(): string | null {
    try {
      return sessionStorage.getItem(this.SESSION_KEY)
    } catch {
      return null
    }
  }

  public static cleanup(): void {
    const tokens = this.getStoredTokens()
    const now = Date.now()

    const validTokens = tokens.filter((t) => t.expiresAt > now)

    try {
      sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(validTokens))
    } catch {
      // Silent fail for security
    }
  }
}

export const generateCSRFToken = (): string => {
  return CSRFProtection.getCurrentToken()
}

export const validateCSRFToken = (token: string): boolean => {
  return CSRFProtection.validateToken(token)
}

if (typeof window !== "undefined") {
  CSRFProtection.cleanup()

  setInterval(() => {
    CSRFProtection.cleanup()
  }, 5 * 60 * 1000)
}

export default CSRFProtection
