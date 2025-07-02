# Security Hardening Documentation - Portfolio 2025

This document outlines the comprehensive security measures implemented in the portfolio project as part of the 2025 enhancement roadmap.

## Overview

The security hardening implementation provides multiple layers of protection including:

- Content Security Policy (CSP)
- Security Headers
- Rate Limiting
- CSRF Protection
- Input Validation & Sanitization
- Bot Detection
- XSS Protection

## 🛡️ Security Features

### 1. Content Security Policy (CSP)

**Location**: `src/utils/security.ts`, `index.html`, `src/middleware/security.middleware.ts`

**Implementation**:

- Strict CSP headers prevent XSS attacks
- Whitelisted domains for scripts, styles, and resources
- Blocks inline scripts and styles in production
- Frame ancestors protection

**Headers Set**:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.emailjs.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.emailjs.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests;
```

### 2. Security Headers

**Location**: `src/middleware/security.middleware.ts`, `index.html`

**Headers Implemented**:

- `X-XSS-Protection: 1; mode=block`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), ...`
- `Cross-Origin-Embedder-Policy: require-corp`
- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Resource-Policy: same-origin`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`

### 3. Enhanced Rate Limiting

**Location**: `src/utils/enhancedRateLimit.ts`

**Features**:

- **Contact Form**: 3 attempts per 15 minutes, 30-minute block
- **Email API**: 5 attempts per hour, 24-hour block
- **General API**: 100 requests per 15 minutes
- Progressive blocking with exponential backoff
- Persistent storage using localStorage
- Automatic cleanup of expired entries

**Usage**:

```typescript
import {
  checkContactFormLimit,
  recordContactFormAttempt,
} from "./utils/enhancedRateLimit"

// Check if request is allowed
const result = checkContactFormLimit("user-ip")
if (!result.allowed) {
  // Handle rate limit
}

// Record attempt
recordContactFormAttempt("user-ip")
```

### 4. CSRF Protection

**Location**: `src/utils/enhancedCSRF.ts`

**Features**:

- Cryptographically secure token generation
- Token expiration (15 minutes default)
- One-time use tokens
- Automatic token rotation
- Session-based storage
- Token validation with timing attack protection

**Usage**:

```typescript
import { CSRFProtection } from "./utils/enhancedCSRF"

// Generate token
const token = CSRFProtection.getCurrentToken()

// Validate token
const isValid = CSRFProtection.validateToken(token)
```

### 5. Input Validation & Sanitization

**Location**: `src/utils/secureContactValidation.ts`, `src/utils/contactValidation.ts`

**Features**:

- HTML entity encoding
- Script tag removal
- SQL injection prevention
- Email format validation
- Length limits enforcement
- Special character handling

**Functions**:

- `sanitizeContactFormData()` - Comprehensive form sanitization
- `validateContactFormSecure()` - Enhanced validation with security checks
- `sanitizeTextInput()` - General text sanitization
- `sanitizeEmail()` - Email-specific sanitization

### 6. Bot Detection

**Location**: `src/utils/secureContactValidation.ts`

**Detection Methods**:

- **Honeypot Field**: Hidden field that should remain empty
- **Timing Analysis**: Submissions faster than 3 seconds are flagged
- **Form Pattern Analysis**: Suspicious input patterns
- **JavaScript Validation**: Ensures client-side JS is running

**Implementation**:

```typescript
// Honeypot field (hidden)
;<input
  type="text"
  name="website"
  style={{ display: "none" }}
  value={honeypot}
  onChange={(e) => setHoneypot(e.target.value)}
/>

// Timing check
const submissionTime = Date.now() - startTime
if (submissionTime < 3000) {
  // Flag as potential bot
}
```

### 7. XSS Protection

**Implementation**:

- CSP headers block inline scripts
- Input sanitization removes dangerous content
- Output encoding prevents script injection
- DOM manipulation protection

## 🚀 Server-Side Integration

### Express.js Integration

```javascript
import { expressSecurityMiddleware } from "./src/middleware/security.middleware"

app.use(expressSecurityMiddleware())
```

### Next.js Integration

```javascript
// next.config.js
import { nextSecurityHeaders } from "./src/middleware/security.middleware"

module.exports = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: Object.entries(nextSecurityHeaders()).map(([key, value]) => ({
          key,
          value,
        })),
      },
    ]
  },
}
```

### Vite Integration (Development)

```javascript
// vite.config.js
import { viteSecurityPlugin } from "./src/middleware/security.middleware"

export default {
  plugins: [
    viteSecurityPlugin(),
    // ... other plugins
  ],
}
```

## 📋 Configuration

### Security Configuration

**Location**: `src/utils/security.ts`

```typescript
export const securityConfig = {
  csp: {
    scriptSrc: ["'self'", "https://cdn.emailjs.com"],
    styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    // ... more CSP settings
  },
  rateLimiting: {
    contactForm: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 3, // 3 attempts
      blockDuration: 30 * 60 * 1000, // 30 minutes
    },
    // ... more rate limiting settings
  },
  csrf: {
    tokenLength: 32,
    tokenTTL: 15 * 60 * 1000, // 15 minutes
  },
  // ... more security settings
}
```

## 🧪 Testing Security Features

### Rate Limiting Test

1. Submit contact form 4 times quickly
2. Should see rate limit message on 4th attempt
3. Wait for block to expire

### CSRF Protection Test

1. Open browser dev tools
2. Try to submit form with invalid CSRF token
3. Should see validation error

### Bot Detection Test

1. Fill honeypot field programmatically
2. Submit form very quickly (< 3 seconds)
3. Should be flagged as bot

### XSS Protection Test

1. Try entering `<script>alert('xss')</script>` in form fields
2. Should be sanitized and safe

## 🔧 Environment Variables

```env
# EmailJS Configuration (for contact form)
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
VITE_CONTACT_EMAIL=your_email@domain.com

# Production Security
NODE_ENV=production
```

## 📈 Monitoring & Logging

### Rate Limit Monitoring

Rate limit events are logged to console:

- When limits are hit
- When blocks are applied
- When blocks expire

### CSRF Monitoring

CSRF events logged:

- Token generation
- Token validation failures
- Token cleanup

### Bot Detection Monitoring

Bot detection events:

- Honeypot field filled
- Timing violations
- Pattern matches

## 🚨 Security Checklist

- [x] Content Security Policy (CSP) implemented
- [x] Security headers configured
- [x] Rate limiting active
- [x] CSRF protection enabled
- [x] Input validation/sanitization
- [x] Bot detection mechanisms
- [x] XSS protection measures
- [x] Server-side middleware ready
- [x] Documentation complete
- [ ] Production deployment testing
- [ ] Security audit conducted
- [ ] Penetration testing performed

## 🔄 Maintenance

### Regular Tasks

1. **Monthly**: Review and update CSP whitelist
2. **Quarterly**: Audit rate limiting effectiveness
3. **Bi-annually**: Security configuration review
4. **Annually**: Full security audit

### Updates Required

- Update CSP when adding new external services
- Adjust rate limits based on usage patterns
- Review and update sanitization rules
- Monitor for new security vulnerabilities

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CSP Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Security Headers](https://securityheaders.com/)
- [CSRF Protection](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)

---

**Last Updated**: July 2, 2025  
**Version**: 1.0  
**Author**: Theodoros Mentis
