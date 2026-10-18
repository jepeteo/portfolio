// lib/contact/submitHandler.ts
import crypto2 from "node:crypto";
import { Resend } from "resend";

// lib/contactCsrf.ts
import crypto from "node:crypto";
var CSRF_COOKIE_NAME = "contact_csrf_token";
var TOKEN_TTL_MS = 30 * 60 * 1e3;
function getSecret() {
  return process.env.CSRF_SECRET || process.env.PUBLIC_SITE_ORIGIN || "tm-portfolio-contact-csrf-fallback-secret";
}
function sign(payload) {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
}
function extractCookieValue(cookieHeader, name) {
  if (!cookieHeader) {
    return "";
  }
  const cookie = cookieHeader.split(";").map((entry) => entry.trim()).find((entry) => entry.startsWith(`${name}=`));
  return cookie ? decodeURIComponent(cookie.split("=").slice(1).join("=")) : "";
}
function isValidSignedToken(token) {
  const parts = token.split(".");
  if (parts.length !== 3) {
    return false;
  }
  const [nonce, expiryRaw, providedSig] = parts;
  const expiry = Number(expiryRaw);
  if (!nonce || !Number.isFinite(expiry) || expiry <= Date.now()) {
    return false;
  }
  const expectedSig = sign(`${nonce}.${expiry}`);
  const expectedBuf = Buffer.from(expectedSig, "hex");
  const providedBuf = Buffer.from(providedSig, "hex");
  if (expectedBuf.length !== providedBuf.length) {
    return false;
  }
  return crypto.timingSafeEqual(expectedBuf, providedBuf);
}
function verifyCsrf(req, providedToken) {
  if (!providedToken || !isValidSignedToken(providedToken)) {
    return false;
  }
  const cookieHeader = Array.isArray(req.headers.cookie) ? req.headers.cookie.join(";") : req.headers.cookie;
  const cookieToken = extractCookieValue(cookieHeader, CSRF_COOKIE_NAME);
  if (!cookieToken || cookieToken.length !== providedToken.length) {
    return false;
  }
  return crypto.timingSafeEqual(
    Buffer.from(cookieToken),
    Buffer.from(providedToken)
  );
}

// lib/turnstile.ts
var SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
async function verifyTurnstileToken(token, remoteIp) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret || !token.trim()) {
    return false;
  }
  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", token);
  if (remoteIp && remoteIp !== "unknown") {
    body.set("remoteip", remoteIp);
  }
  try {
    const response = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body
    });
    if (!response.ok) {
      console.error("Turnstile siteverify HTTP error", response.status);
      return false;
    }
    const result = await response.json();
    if (!result.success) {
      console.error("Turnstile rejected contact submission", result["error-codes"] || []);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Turnstile siteverify failed", error);
    return false;
  }
}

// src/utils/validation.ts
var sanitizeInput = (input) => {
  if (!input || typeof input !== "string") {
    return "";
  }
  return input.trim().replace(/[<>]/g, "").replace(/javascript:/gi, "").replace(/on\w+\s*=/gi, "").replace(/data:/gi, "").replace(/vbscript:/gi, "").substring(0, 1e3);
};

// src/content/services.ts
var serviceCategories = [
  {
    id: "emergency-website-support",
    title: "Emergency Website Support",
    intro: "Fast, focused help when something breaks and your site or business is at risk.",
    services: [
      {
        id: "wordpress-emergency-fix",
        title: "WordPress emergency fix",
        shortDescription: "Fast help for broken forms, login issues, fatal errors, plugin conflicts, layout problems, and update-related issues.",
        priceLabel: "From \u20AC150",
        deliveryLabel: "Same day or next day when possible",
        featured: true,
        emergency: true
      },
      {
        id: "website-recovery-after-update",
        title: "Website recovery after update",
        shortDescription: "Repair layout, plugin, theme, or PHP issues caused by recent updates.",
        priceLabel: "From \u20AC150",
        deliveryLabel: "Same day or next day when possible",
        emergency: true
      },
      {
        id: "broken-contact-form-fix",
        title: "Broken contact form fix",
        shortDescription: "Diagnose and repair contact forms, email routing, validation, spam protection, and notification issues.",
        priceLabel: "From \u20AC80",
        deliveryLabel: "Usually fast",
        emergency: true
      },
      {
        id: "white-screen-critical-error-fix",
        title: "White screen or critical error fix",
        shortDescription: "Debug WordPress critical errors and restore access safely where possible.",
        priceLabel: "From \u20AC150",
        emergency: true
      },
      {
        id: "plugin-conflict-diagnosis",
        title: "Plugin conflict diagnosis",
        shortDescription: "Identify conflicting plugins, themes, or PHP version issues and recommend a safe fix.",
        priceLabel: "From \u20AC120"
      },
      {
        id: "website-launch-support",
        title: "Website launch support",
        shortDescription: "Final technical checks before launch, including DNS, SSL, forms, metadata, redirects, analytics, and mobile review.",
        priceLabel: "From \u20AC150"
      }
    ]
  },
  {
    id: "wordpress-woocommerce",
    title: "WordPress and WooCommerce",
    intro: "Practical WordPress and WooCommerce development for stores, plugins, and business workflows.",
    services: [
      {
        id: "woocommerce-checkout-fix",
        title: "WooCommerce checkout fix",
        shortDescription: "Repair checkout errors, payment display issues, broken flows, validation problems, and order-related bugs.",
        priceLabel: "From \u20AC150",
        featured: true
      },
      {
        id: "woocommerce-shipping-rules-setup",
        title: "WooCommerce shipping rules setup",
        shortDescription: "Configure shipping zones, methods, conditions, and special rules for products or regions.",
        priceLabel: "From \u20AC150"
      },
      {
        id: "woocommerce-payment-method-setup",
        title: "WooCommerce payment method setup",
        shortDescription: "Configure Stripe, PayPal, bank transfer, COD, or payment visibility rules.",
        priceLabel: "From \u20AC120"
      },
      {
        id: "woocommerce-custom-checkout-message",
        title: "WooCommerce custom checkout message",
        shortDescription: "Add custom notices, payment instructions, delivery notes, or conditional messages during checkout.",
        priceLabel: "From \u20AC80"
      },
      {
        id: "woocommerce-cod-fee-setup",
        title: "WooCommerce COD fee setup",
        shortDescription: "Add cash-on-delivery fees based on shipping method, zone, or order rules.",
        priceLabel: "From \u20AC100"
      },
      {
        id: "custom-wordpress-snippet",
        title: "Custom WordPress snippet",
        shortDescription: "Small custom functionality without installing unnecessary plugins.",
        priceLabel: "From \u20AC80"
      },
      {
        id: "custom-wordpress-mini-plugin",
        title: "Custom WordPress mini-plugin",
        shortDescription: "Build a lightweight plugin for repeatable business logic, API integration, or admin workflow.",
        priceLabel: "From \u20AC250"
      },
      {
        id: "wordpress-security-hardening",
        title: "WordPress security hardening",
        shortDescription: "Basic hardening, plugin review, user review, update check, and common risk reduction.",
        priceLabel: "From \u20AC150"
      }
    ]
  },
  {
    id: "speed-technical-seo",
    title: "Speed and Technical SEO",
    intro: "Improve performance, Core Web Vitals, and the technical foundations that support search visibility.",
    services: [
      {
        id: "website-speed-mini-fix",
        title: "Website speed mini-fix",
        shortDescription: "Improve load time through image, cache, script, plugin, and frontend cleanup.",
        priceLabel: "From \u20AC150",
        featured: true
      },
      {
        id: "core-web-vitals-review",
        title: "Core Web Vitals review",
        shortDescription: "Review performance metrics and identify practical fixes for user experience and SEO.",
        priceLabel: "From \u20AC150"
      },
      {
        id: "image-optimization-pass",
        title: "Image optimization pass",
        shortDescription: "Compress, resize, convert, and review image loading strategy for better performance.",
        priceLabel: "From \u20AC120"
      },
      {
        id: "technical-seo-audit",
        title: "Technical SEO audit",
        shortDescription: "Review metadata, headings, canonical tags, indexation, sitemap, robots.txt, structured data, and technical risks.",
        priceLabel: "From \u20AC180",
        featured: true
      },
      {
        id: "seo-migration-checklist",
        title: "SEO migration checklist",
        shortDescription: "Plan a safe redesign or platform migration with URL mapping, redirects, metadata, and Search Console checks.",
        priceLabel: "From \u20AC250"
      },
      {
        id: "301-redirect-map",
        title: "301 redirect map",
        shortDescription: "Create or review redirects to preserve rankings and reduce broken URLs after a redesign.",
        priceLabel: "From \u20AC180"
      },
      {
        id: "search-console-setup",
        title: "Search Console setup",
        shortDescription: "Verify property, submit sitemap, check indexing, and review basic technical issues.",
        priceLabel: "From \u20AC100"
      }
    ]
  },
  {
    id: "email-dns-domains",
    title: "Email, DNS and Domains",
    intro: "Resolve email delivery, DNS, SSL, and domain routing issues that affect business communication.",
    services: [
      {
        id: "email-dns-outlook-fix",
        title: "Email, DNS and Outlook fix",
        shortDescription: "Fix business email setup issues, Outlook connection problems, DNS records, SSL, domain routing, and email delivery.",
        priceLabel: "From \u20AC100",
        featured: true,
        emergency: true
      },
      {
        id: "cloudflare-setup",
        title: "Cloudflare setup",
        shortDescription: "Configure DNS, SSL mode, redirects, basic caching, and domain protection.",
        priceLabel: "From \u20AC150"
      },
      {
        id: "spf-dkim-dmarc-setup",
        title: "SPF, DKIM and DMARC setup",
        shortDescription: "Improve business email deliverability and reduce spoofing risks.",
        priceLabel: "From \u20AC150"
      },
      {
        id: "ssl-certificate-issue-fix",
        title: "SSL certificate issue fix",
        shortDescription: "Repair HTTPS, mixed content, redirect loops, and certificate configuration issues.",
        priceLabel: "From \u20AC80",
        emergency: true
      },
      {
        id: "domain-migration-support",
        title: "Domain migration support",
        shortDescription: "Move a domain safely between providers or point it to new hosting without breaking email or the website.",
        priceLabel: "From \u20AC150"
      }
    ]
  },
  {
    id: "landing-pages-business-websites",
    title: "Landing Pages and Business Websites",
    intro: "Clear, conversion-focused pages and websites for campaigns, services, and small businesses.",
    services: [
      {
        id: "one-page-landing-page",
        title: "One-page landing page",
        shortDescription: "A focused page for one offer, service, campaign, event, or business idea.",
        priceLabel: "From \u20AC300",
        featured: true
      },
      {
        id: "service-offer-page",
        title: "Service offer page",
        shortDescription: "A conversion-focused page that explains one service clearly and drives enquiries.",
        priceLabel: "From \u20AC250"
      },
      {
        id: "portfolio-website",
        title: "Portfolio website",
        shortDescription: "A polished website for artists, makers, consultants, beauty professionals, and small businesses.",
        priceLabel: "From \u20AC400"
      },
      {
        id: "small-business-website-refresh",
        title: "Small business website refresh",
        shortDescription: "Improve the structure, copy, layout, responsiveness, and credibility of an existing website.",
        priceLabel: "Fixed quote after scope"
      },
      {
        id: "coming-soon-page",
        title: "Coming soon page",
        shortDescription: "A clean launch page with basic information, contact, and lead capture.",
        priceLabel: "From \u20AC150"
      },
      {
        id: "mobile-first-homepage-redesign",
        title: "Mobile-first homepage redesign",
        shortDescription: "Redesign the homepage around clarity, trust, and mobile usability.",
        priceLabel: "From \u20AC300"
      }
    ]
  },
  {
    id: "ecommerce-product-websites",
    title: "E-commerce and Product Websites",
    intro: "Product-focused websites, shop prototypes, and checkout improvements for growing businesses.",
    services: [
      {
        id: "small-eshop-frontend-prototype",
        title: "Small e-shop frontend prototype",
        shortDescription: "A polished shop prototype with product cards, categories, cart UI, and brand direction.",
        priceLabel: "From \u20AC500"
      },
      {
        id: "product-catalog-website",
        title: "Product catalog website",
        shortDescription: "A product-focused website for businesses not ready for full checkout.",
        priceLabel: "From \u20AC400"
      },
      {
        id: "product-page-improvement",
        title: "Product page improvement",
        shortDescription: "Improve product layout, copy, images, calls to action, and trust signals.",
        priceLabel: "From \u20AC150"
      },
      {
        id: "checkout-flow-review",
        title: "Checkout flow review",
        shortDescription: "Review cart, checkout, payment steps, errors, and friction points.",
        priceLabel: "From \u20AC180"
      },
      {
        id: "stripe-checkout-setup",
        title: "Stripe checkout setup",
        shortDescription: "Setup or repair basic Stripe checkout flows where technically appropriate.",
        priceLabel: "From \u20AC250"
      },
      {
        id: "ecommerce-seo-foundation",
        title: "E-commerce SEO foundation",
        shortDescription: "Metadata, category structure, product schema basics, sitemap, and indexation review.",
        priceLabel: "From \u20AC250"
      }
    ]
  },
  {
    id: "audits-reports",
    title: "Audits and Reports",
    intro: "Structured reviews that identify risks, priorities, and practical next steps.",
    services: [
      {
        id: "technical-audit-video-report",
        title: "Technical audit video/report",
        shortDescription: "A practical review of technical issues, UX problems, SEO risks, and next actions.",
        priceLabel: "From \u20AC120",
        featured: true
      },
      {
        id: "website-health-check",
        title: "Website health check",
        shortDescription: "A focused inspection of updates, errors, performance, forms, mobile layout, and basic SEO.",
        priceLabel: "From \u20AC120"
      },
      {
        id: "ux-ui-review",
        title: "UX/UI review",
        shortDescription: "Identify visual, layout, navigation, readability, and conversion problems.",
        priceLabel: "From \u20AC150"
      },
      {
        id: "accessibility-quick-audit",
        title: "Accessibility quick audit",
        shortDescription: "Review headings, contrast, keyboard flow, form labels, semantics, and common accessibility issues.",
        priceLabel: "From \u20AC150"
      },
      {
        id: "pre-launch-checklist",
        title: "Pre-launch checklist",
        shortDescription: "Review a website before publishing to catch technical, SEO, mobile, analytics, and content issues.",
        priceLabel: "From \u20AC150"
      },
      {
        id: "redesign-risk-audit",
        title: "Redesign risk audit",
        shortDescription: "Identify SEO, redirect, content, analytics, and technical risks before a redesign.",
        priceLabel: "From \u20AC250"
      }
    ]
  },
  {
    id: "internal-tools-automations",
    title: "Internal Tools and Automations",
    intro: "Custom dashboards, workflows, and lightweight tools that reduce manual work.",
    services: [
      {
        id: "client-portal-prototype",
        title: "Client portal prototype",
        shortDescription: "A custom dashboard or portal prototype for agencies and service businesses.",
        priceLabel: "Fixed quote after scope"
      },
      {
        id: "internal-dashboard-prototype",
        title: "Internal dashboard prototype",
        shortDescription: "A focused dashboard for clients, tasks, projects, leads, renewals, or operations.",
        priceLabel: "Fixed quote after scope"
      },
      {
        id: "form-to-dashboard-workflow",
        title: "Form to dashboard workflow",
        shortDescription: "Turn form submissions into a manageable internal workflow.",
        priceLabel: "From \u20AC400"
      },
      {
        id: "admin-panel-small-business",
        title: "Admin panel for small business",
        shortDescription: "A simple admin area for managing business data, requests, or content.",
        priceLabel: "Fixed quote after scope"
      },
      {
        id: "pdf-generation-workflow",
        title: "PDF generation workflow",
        shortDescription: "Generate PDFs for invoices, reports, referrals, confirmations, or internal documents.",
        priceLabel: "From \u20AC300"
      },
      {
        id: "email-notification-workflow",
        title: "Email notification workflow",
        shortDescription: "Send structured internal or customer emails from forms and business actions.",
        priceLabel: "From \u20AC200"
      }
    ]
  },
  {
    id: "maintenance-support",
    title: "Maintenance and Support",
    intro: "Ongoing care, backups, monitoring, and reliable support for business websites.",
    services: [
      {
        id: "website-care-plan",
        title: "Website care plan",
        shortDescription: "Updates, backups, monitoring, checks, and small support tasks.",
        priceLabel: "From \u20AC80/month"
      },
      {
        id: "wordpress-monthly-maintenance",
        title: "WordPress monthly maintenance",
        shortDescription: "WordPress core, theme, plugin updates, backups, uptime checks, and small fixes.",
        priceLabel: "From \u20AC100/month"
      },
      {
        id: "hosting-migration",
        title: "Hosting migration",
        shortDescription: "Move a website to better hosting with minimum downtime.",
        priceLabel: "From \u20AC200"
      },
      {
        id: "backup-system-setup",
        title: "Backup system setup",
        shortDescription: "Configure reliable website backups and restore process.",
        priceLabel: "From \u20AC120"
      },
      {
        id: "website-monitoring-setup",
        title: "Website monitoring setup",
        shortDescription: "Uptime and basic health monitoring for business websites.",
        priceLabel: "From \u20AC100"
      },
      {
        id: "monthly-technical-support-retainer",
        title: "Monthly technical support retainer",
        shortDescription: "Ongoing support for small fixes, advice, updates, and technical changes.",
        priceLabel: "From \u20AC150/month"
      }
    ]
  },
  {
    id: "agency-support",
    title: "Agency Support",
    intro: "Extra development capacity for agencies that need reliable WordPress or Next.js help.",
    services: [
      {
        id: "overflow-wordpress-development",
        title: "Overflow WordPress development",
        shortDescription: "Practical WordPress help for agencies that need extra development capacity.",
        priceLabel: "Fixed quote or day rate"
      },
      {
        id: "overflow-nextjs-development",
        title: "Overflow Next.js development",
        shortDescription: "Frontend and full-stack support for modern React and Next.js projects.",
        priceLabel: "Fixed quote or day rate"
      },
      {
        id: "website-qa-before-launch",
        title: "Website QA before launch",
        shortDescription: "Responsive, accessibility, SEO, form, performance, and deployment checks.",
        priceLabel: "From \u20AC180"
      },
      {
        id: "bug-fixing-sprint",
        title: "Bug fixing sprint",
        shortDescription: "A focused block of time to fix bugs before delivery or launch.",
        priceLabel: "Fixed quote after scope"
      },
      {
        id: "frontend-polish-pass",
        title: "Frontend polish pass",
        shortDescription: "Improve spacing, responsiveness, visual hierarchy, consistency, and mobile presentation.",
        priceLabel: "From \u20AC250"
      },
      {
        id: "seo-migration-support",
        title: "SEO migration support",
        shortDescription: "Support agencies during redesigns or platform migrations where rankings matter.",
        priceLabel: "Fixed quote after scope"
      }
    ]
  }
];
var featuredServices = serviceCategories.flatMap(
  (category) => category.services.filter((service) => service.featured)
);
var emergencyServices = serviceCategories.flatMap(
  (category) => category.services.filter((service) => service.emergency)
);
var requestTypeOptions = [
  { value: "wordpress-emergency", label: "WordPress emergency" },
  { value: "woocommerce-issue", label: "WooCommerce issue" },
  { value: "email-dns-problem", label: "Email/DNS problem" },
  { value: "website-speed", label: "Website speed" },
  { value: "technical-seo", label: "Technical SEO" },
  { value: "landing-page", label: "Landing page" },
  { value: "website-redesign", label: "Website redesign" },
  { value: "maintenance-plan", label: "Maintenance plan" },
  { value: "internal-tool-dashboard", label: "Internal tool/dashboard" },
  { value: "not-sure", label: "Not sure" }
];
var urgencyOptions = [
  { value: "today", label: "Today" },
  { value: "this-week", label: "This week" },
  { value: "this-month", label: "This month" },
  { value: "flexible", label: "Flexible" }
];
var budgetOptions = [
  { value: "under-150", label: "\u20AC80 to \u20AC150" },
  { value: "150-300", label: "\u20AC150 to \u20AC300" },
  { value: "300-700", label: "\u20AC300 to \u20AC700" },
  { value: "700-plus", label: "\u20AC700+" },
  { value: "monthly-support", label: "Monthly support" },
  { value: "not-sure", label: "Not sure yet" }
];

// src/utils/secureContactValidation.ts
var validationPatterns = {
  email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  name: /^[a-zA-ZÀ-ÿ\u0100-\u017F\u0180-\u024F\s'.-]{2,50}$/,
  websiteUrl: /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=%]*)?$/i
};
var validateEmailSecure = (email) => {
  if (!email || typeof email !== "string") return false;
  const cleanEmail = email.replace(/\s/g, "");
  const suspiciousPatterns = [
    /script/gi,
    /javascript/gi,
    /vbscript/gi,
    /onload/gi,
    /onerror/gi,
    /eval\(/gi,
    /<.*>/gi
    // HTML tags
  ];
  if (suspiciousPatterns.some((pattern) => pattern.test(cleanEmail))) {
    return false;
  }
  return validationPatterns.email.test(cleanEmail) && cleanEmail.length >= 5 && cleanEmail.length <= 254;
};
var validateNameSecure = (name) => {
  if (!name || typeof name !== "string") return false;
  const trimmed = name.trim();
  const suspiciousPatterns = [
    /script/gi,
    /javascript/gi,
    /vbscript/gi,
    /onload/gi,
    /onerror/gi,
    /eval\(/gi,
    /<.*>/gi,
    // HTML tags
    /\{.*\}/gi
    // Template literals
  ];
  if (suspiciousPatterns.some((pattern) => pattern.test(trimmed))) {
    return false;
  }
  return validationPatterns.name.test(trimmed);
};
var validateMessageSecure = (message) => {
  if (!message || typeof message !== "string") return false;
  const trimmed = message.trim();
  if (trimmed.length < 10 || trimmed.length > 2e3) return false;
  const suspiciousPatterns = [
    /script/gi,
    /javascript/gi,
    /vbscript/gi,
    /onload/gi,
    /onerror/gi,
    /eval\(/gi,
    /<script.*?>/gi,
    /<iframe.*?>/gi,
    /<object.*?>/gi,
    /<embed.*?>/gi
  ];
  if (suspiciousPatterns.some((pattern) => pattern.test(trimmed))) {
    return false;
  }
  return true;
};
var validateSubjectSecure = (subject) => {
  if (!subject || typeof subject !== "string") return false;
  const trimmed = subject.trim();
  if (trimmed.length < 3 || trimmed.length > 100) return false;
  const suspiciousPatterns = [
    /script/gi,
    /javascript/gi,
    /vbscript/gi,
    /onload/gi,
    /onerror/gi,
    /eval\(/gi,
    /<.*>/gi
    // HTML tags
  ];
  if (suspiciousPatterns.some((pattern) => pattern.test(trimmed))) {
    return false;
  }
  return true;
};
var validateWebsiteUrlOptional = (url) => {
  if (!url || !url.trim()) return true;
  const trimmed = url.trim();
  if (trimmed.length > 500) return false;
  return validationPatterns.websiteUrl.test(trimmed);
};
var allowedRequestTypes = new Set(
  requestTypeOptions.map((option) => option.value)
);
var allowedUrgency = new Set(urgencyOptions.map((option) => option.value));
var allowedBudget = new Set(budgetOptions.map((option) => option.value));
var sanitizeContactFormData = (data) => {
  const requestType = data.requestType && allowedRequestTypes.has(data.requestType) ? data.requestType : void 0;
  const urgency = data.urgency && allowedUrgency.has(data.urgency) ? data.urgency : void 0;
  const budget = data.budget && allowedBudget.has(data.budget) ? data.budget : void 0;
  return {
    name: sanitizeInput(data.name),
    email: sanitizeInput(data.email).toLowerCase(),
    subject: sanitizeInput(data.subject),
    message: sanitizeInput(data.message),
    requestType,
    urgency,
    budget,
    websiteUrl: data.websiteUrl ? sanitizeInput(data.websiteUrl).trim() : void 0,
    csrfToken: data.csrfToken,
    timestamp: data.timestamp,
    honeypot: data.honeypot,
    sourcePage: data.sourcePage ? sanitizeInput(data.sourcePage).slice(0, 200) : void 0
  };
};
var detectBot = (data) => {
  if (data.honeypot && data.honeypot.trim() !== "") {
    return true;
  }
  if (data.timestamp) {
    const submissionTime = Date.now() - data.timestamp;
    if (submissionTime < 3e3) {
      return true;
    }
  }
  const combinedText = `${data.name} ${data.email} ${data.subject} ${data.message}`.toLowerCase();
  const spamPatterns = [/viagra/i, /cialis/i, /\bcasino\b/i];
  return spamPatterns.some((pattern) => pattern.test(combinedText));
};
var validateContactFormSecure = (data) => {
  const errors = {};
  const isBot = detectBot(data);
  if (isBot) {
    return {
      isValid: false,
      errors: { general: "Invalid submission detected" },
      isBot: true
    };
  }
  if (!validateNameSecure(data.name)) {
    errors.name = "Please enter a valid name (2-50 characters, letters only)";
  }
  if (!validateEmailSecure(data.email)) {
    errors.email = "Please enter a valid email address";
  }
  if (!validateSubjectSecure(data.subject)) {
    errors.subject = "Please enter a valid subject (3-100 characters)";
  }
  if (!validateMessageSecure(data.message)) {
    errors.message = "Please enter a valid message (10-2000 characters)";
  }
  if (data.websiteUrl && !validateWebsiteUrlOptional(data.websiteUrl)) {
    errors.websiteUrl = "Please enter a valid website URL";
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    isBot: false
  };
};

// lib/contact/submitHandler.ts
var RATE_LIMIT_WINDOW_MS = 15 * 60 * 1e3;
var RATE_LIMIT_MAX = 5;
var RATE_LIMIT_BLOCK_MS = 30 * 60 * 1e3;
var rateLimitStore = /* @__PURE__ */ new Map();
function getHeader(req, key) {
  const raw = req.headers[key];
  if (Array.isArray(raw)) return raw[0] ?? "";
  return raw ?? "";
}
function getClientIp(req) {
  const forwardedFor = getHeader(req, "x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  const realIp = getHeader(req, "x-real-ip");
  return realIp || req.socket?.remoteAddress || "unknown";
}
function getRequestFingerprint(req) {
  const ip = getClientIp(req);
  const userAgent = getHeader(req, "user-agent") || "unknown";
  return `${ip}:${userAgent}`;
}
function cleanupRateLimits() {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.blockedUntil && value.blockedUntil <= now) {
      rateLimitStore.delete(key);
      continue;
    }
    if (!value.blockedUntil && now - value.windowStart > RATE_LIMIT_WINDOW_MS) {
      rateLimitStore.delete(key);
    }
  }
}
function checkRateLimit(fingerprint) {
  cleanupRateLimits();
  const now = Date.now();
  const current = rateLimitStore.get(fingerprint);
  if (!current) {
    return { allowed: true, retryAfterSec: 0 };
  }
  if (current.blockedUntil && current.blockedUntil > now) {
    return {
      allowed: false,
      retryAfterSec: Math.ceil((current.blockedUntil - now) / 1e3)
    };
  }
  if (now - current.windowStart > RATE_LIMIT_WINDOW_MS) {
    return { allowed: true, retryAfterSec: 0 };
  }
  return {
    allowed: current.attempts < RATE_LIMIT_MAX,
    retryAfterSec: Math.ceil((current.windowStart + RATE_LIMIT_WINDOW_MS - now) / 1e3)
  };
}
function recordAttempt(fingerprint, shouldBlock = false) {
  const now = Date.now();
  const existing = rateLimitStore.get(fingerprint);
  if (!existing || now - existing.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitStore.set(fingerprint, {
      attempts: 1,
      windowStart: now,
      blockedUntil: shouldBlock ? now + RATE_LIMIT_BLOCK_MS : void 0
    });
    return;
  }
  const attempts = existing.attempts + 1;
  rateLimitStore.set(fingerprint, {
    attempts,
    windowStart: existing.windowStart,
    blockedUntil: shouldBlock || attempts >= RATE_LIMIT_MAX ? now + RATE_LIMIT_BLOCK_MS : void 0
  });
}
var CANONICAL_ORIGINS = /* @__PURE__ */ new Set([
  "https://www.theodorosmentis.com",
  "https://theodorosmentis.com"
]);
var DEFAULT_FROM = "Theodoros Mentis <notifications@theodorosmentis.com>";
var DEFAULT_TO = "contact@theodorosmentis.com";
function isAllowedOrigin(origin) {
  if (!origin) return false;
  if (CANONICAL_ORIGINS.has(origin)) return true;
  const productionOrigin = process.env.PUBLIC_SITE_ORIGIN;
  if (productionOrigin && origin === productionOrigin) {
    return true;
  }
  return origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:");
}
function escapeHtml(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function present(value) {
  return value?.trim() ?? "";
}
function formatSubmittedAt(date) {
  const formatted = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Berlin",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  }).format(date);
  return `${formatted} Europe/Berlin`;
}
function websiteHref(value) {
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    const url = new URL(withProtocol);
    if (url.protocol !== "http:" && url.protocol !== "https:") return void 0;
    return url.href;
  } catch {
    return void 0;
  }
}
function contactDetailRows(data, submittedAt) {
  const rows = [
    { label: "Name", text: data.name },
    { label: "Email", text: data.email, href: `mailto:${data.email}` }
  ];
  const requestType = present(data.requestType);
  const urgency = present(data.urgency);
  const budget = present(data.budget);
  const website = present(data.websiteUrl);
  const sourcePage = present(data.sourcePage);
  if (requestType) rows.push({ label: "Request type", text: requestType });
  if (urgency) rows.push({ label: "Urgency", text: urgency });
  if (budget) rows.push({ label: "Budget", text: budget });
  if (website) rows.push({ label: "Website", text: website, href: websiteHref(website) });
  if (sourcePage) rows.push({ label: "Source page", text: sourcePage });
  rows.push({ label: "Submitted", text: submittedAt });
  return rows;
}
function renderContactText(data, rows) {
  const details = rows.map((row) => `${row.label}: ${row.text}`).join("\n");
  return [
    "New enquiry",
    "Theodoros Mentis",
    "",
    data.subject,
    "",
    data.message,
    "",
    details,
    "",
    "Reply to this email to reach the visitor."
  ].join("\n");
}
function renderDetailValue(row) {
  const text = escapeHtml(row.text);
  if (!row.href) return text;
  return `<a href="${escapeHtml(row.href)}" style="color:#0369a1;text-decoration:underline;">${text}</a>`;
}
function renderContactHtml(data, rows) {
  const message = escapeHtml(data.message).replace(/\r\n|\n|\r/g, "<br />");
  const detailRows = rows.map(
    (row) => `<tr>
        <td style="padding:8px 16px 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.4;color:#64748b;vertical-align:top;width:120px;">${escapeHtml(row.label)}</td>
        <td style="padding:8px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.4;color:#0f172a;vertical-align:top;">${renderDetailValue(row)}</td>
      </tr>`
  ).join("");
  return `<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:0;background:#f4f6f8;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;">
      <tr>
        <td align="center" style="padding:24px 12px;">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:100%;max-width:560px;background:#ffffff;border-radius:4px;">
            <tr>
              <td style="background:#0369a1;padding:16px 24px;border-radius:4px 4px 0 0;">
                <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:0.04em;text-transform:uppercase;color:#e0f2fe;">New enquiry</p>
                <p style="margin:4px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.3;font-weight:bold;color:#ffffff;">Theodoros Mentis</p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px;">
                <h1 style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:20px;line-height:1.3;font-weight:bold;color:#0f172a;">${escapeHtml(data.subject)}</h1>
                <div style="margin:0 0 24px;padding:16px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:4px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#0f172a;">${message}</div>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${detailRows}</table>
                <p style="margin:24px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.4;color:#64748b;">Reply to this email to reach the visitor.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
async function sendViaResend(data, csrfToken) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM || DEFAULT_FROM;
  const toEmail = process.env.CONTACT_EMAIL || DEFAULT_TO;
  if (!apiKey) {
    console.error("Contact email is not configured: RESEND_API_KEY is missing");
    throw new Error("Email provider is not configured");
  }
  const submittedAt = formatSubmittedAt(/* @__PURE__ */ new Date());
  const rows = contactDetailRows(data, submittedAt);
  const text = renderContactText(data, rows);
  const html = renderContactHtml(data, rows);
  const idempotencyKey = `contact-form/${crypto2.createHash("sha256").update(csrfToken).digest("hex")}`;
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send(
    {
      from,
      to: [toEmail],
      replyTo: data.email,
      subject: data.subject,
      text,
      html
    },
    { idempotencyKey }
  );
  if (error) {
    console.error("Resend rejected contact email", error);
    throw new Error(error.message);
  }
}
async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  const origin = getHeader(req, "origin");
  if (!isAllowedOrigin(origin)) {
    res.status(403).json({ error: "Invalid origin" });
    return;
  }
  const payload = req.body || {};
  const csrfToken = payload.csrfToken || getHeader(req, "x-csrf-token");
  if (!verifyCsrf(req, csrfToken || "")) {
    res.status(403).json({ error: "CSRF validation failed" });
    return;
  }
  const fingerprint = getRequestFingerprint(req);
  const rateLimit = checkRateLimit(fingerprint);
  if (!rateLimit.allowed) {
    res.status(429).json({
      error: "Too many submissions. Please try again later.",
      retryAfterSeconds: rateLimit.retryAfterSec
    });
    return;
  }
  const turnstileOk = await verifyTurnstileToken(
    payload.turnstileToken || "",
    getClientIp(req)
  );
  if (!turnstileOk) {
    recordAttempt(fingerprint, false);
    res.status(400).json({
      error: "Security check failed. Please try again."
    });
    return;
  }
  const secureData = {
    name: payload.name || "",
    email: payload.email || "",
    subject: payload.subject || "",
    message: payload.message || "",
    requestType: payload.requestType || "",
    urgency: payload.urgency || "",
    budget: payload.budget || "",
    websiteUrl: payload.websiteUrl || "",
    honeypot: payload.honeypot || "",
    timestamp: payload.timestamp || 0,
    sourcePage: payload.sourcePage || ""
  };
  if (detectBot(secureData)) {
    recordAttempt(fingerprint, true);
    res.status(400).json({ error: "Bot-like submission detected" });
    return;
  }
  const validation = validateContactFormSecure(secureData);
  if (!validation.isValid) {
    recordAttempt(fingerprint, false);
    res.status(400).json({
      error: "Validation failed",
      fields: validation.errors
    });
    return;
  }
  const sanitized = sanitizeContactFormData(secureData);
  try {
    await sendViaResend(sanitized, csrfToken);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Contact email failed", error);
    res.status(502).json({ error: "Email provider rejected the request" });
  }
}
export {
  handler as default
};
