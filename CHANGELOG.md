# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Public copy no longer uses em dashes. Sentences use periods, commas, or "to" instead.
- Visitor-facing copy no longer explains redesign decisions. Identity is consistently Senior Full-Stack Engineer. Public archive size is distinguished from 390+ delivered projects.
- SPA route changes start at the top, restore back/forward scroll, and align hash targets below the sticky header.
- Featured case studies are MTX Clinic App (confidential, text-first) and Stoney Holiday Lets. The DNS/email rescue example is a typical Services workflow, not a named client case study.
- Engineering page shows a small curated set of verified technical work plus a Fintech path learning block. Marketing websites are no longer listed as engineering evidence.
- Homepage hero keeps two conversion actions. About copy is specific to 18+ years of production work, with one closing CTA. Service catalog accordions start collapsed.
- Certification stats use the current calendar year, or the latest credential year when the current year is empty. Contact required fields expose native required semantics, announced errors, and a correctly labelled Website URL helper.
- Project archive cards reuse verified screenshots when they exist. The performance dashboard is development-only and no longer overlaps mobile conversion actions.
- SPA and prerender share one JSON-LD graph (WebSite, Person, ProfessionalService plus a small route node). Hydration reuses the prerendered script instead of appending a second one.
- Featured homepage cards no longer create a 12px horizontal overflow at 320px. Missing case-study screenshots stay out of the layout until the file loads.
- Stoney Holiday Lets now uses a live 1280x720 homepage screenshot at `public/images/projects/stoneyholidaylets.webp`.
- Contact page uses a compact hero and puts the form before supporting details so Name is in the first viewport.
- Featured case studies use authored meta descriptions. Stoney Open Graph image is the live project screenshot.
- Engineering fintech path uses a curated verified-learning set and a current learning roadmap, without implying employment.
- Homepage certifications preview is an 8-item cross-disciplinary selection. All 69 credentials remain on /certifications.
- Page and section reveals complete in about 350ms. Header navigation no longer fades in over a long delay.
- Contact form sets `aria-invalid` only when a field has a validation error. Valid or untouched fields omit the attribute.
- Analytics (PostHog, Vercel Analytics / Speed Insights) stay off in local DEV. Unknown SPA paths keep client `noindex` because the Vercel rewrite serves `index.html` for all routes.

### Confirmed still outstanding

- MTX Clinic App remains confidential: no public URL or screens.
- LinkedIn headline and CV PDF still need a manual pass against `src/config/site.ts`.

- Dual-audience information architecture: homepage is a decision page; archives live on dedicated routes (`/projects`, `/engineering`, `/experience`, `/certifications`, `/about`, `/contact`).
- Services grouped as Rescue / Improve / Build, with the emergency route unchanged.
- Contact form requires name, email, and message; optional selectors are collapsed. EmailJS / `api/contact` is unchanged.
- Certifications and projects use URL-backed search, filters, and pagination. All 69 certificates remain in the dataset.
- Experience timeline states freelance overlap as concurrent work and uses identity stats from `src/config/site.ts`.
- Skills are described by evidence of use, not percentage bars.
- Homepage JSON-LD is WebSite + Person + ProfessionalService. FAQPage schema is only on `/about`. Per-page PortfolioSchema JSON-LD was removed from the layout.

### Added

- Hash redirects from legacy homepage anchors (`#projects`, `#faq`, `#contact`, …) to crawlable routes.
- Real 404 page (no silent redirect to home).
- [Content update notes](CONTENT.md) for adding certificates, banking roles, fintech roles, and projects.

## [0.3.1] - 2025-12-23

### Performance

#### Mobile Performance Optimization

- **Self-hosted fonts** - Eliminated external Google Fonts requests

  - Migrated to fontsource packages (Inter, Space Grotesk, JetBrains Mono)
  - Latin subset only (472KB vs 1.7MB) - 72% reduction
  - Fonts now bundled with app for faster loading
  - Removed Google Font preconnect/preload hints

- **LCP Image Fix** - Hero image now visible immediately

  - Removed `opacity-0` from Hero section that blocked LCP
  - Image loads eagerly with `fetchPriority="high"`
  - Expected improvement: 13.6s → <2.5s LCP

- **Deferred PostHog Analytics** - Analytics load after page interactive

  - Lazy load PostHog with `React.lazy()` and `requestIdleCallback`
  - Removed static imports from critical path
  - Expected improvement: 5.7s JS execution moved off main thread

- **Style & Layout Optimization** - Reduced recalculation work
  - Hide decorative grid patterns on mobile (<768px)
  - Reduced animated dots from 8 to 4, desktop-only
  - Simplified gradient animations (2 layers instead of 4)
  - Removed `will-change: background-position` from body
  - Added CSS containment to Hero background
  - Simplified body backgrounds for mobile devices

### Changed

- Hero animations only run on desktop for better mobile performance
- Background decorations disabled on mobile for faster Style & Layout

## [0.3.0] - 2025-01-13

### Added

#### Low Priority UX Improvements

- **Reduced Motion Support** - Accessibility-first animations

  - `useReducedMotion` hook for detecting user motion preferences
  - `getReducedMotionProps()` helper for Framer Motion variants
  - `reducedMotionVariants` preset with safe, subtle animations
  - Respects `prefers-reduced-motion` system setting

- **Offline Indicator** - Network connectivity awareness

  - `OfflineIndicator` component with reconnection feedback
  - `useOnlineStatus` hook for online/offline detection
  - Toast-style notification with reconnection confirmation
  - Non-intrusive bottom-left positioning

- **Enhanced Error Boundaries** - Improved error recovery UX

  - Redesigned `ErrorFallback` component with modern styling
  - Dark/light theme support for error screens
  - "Try Again" retry functionality
  - Error details expandable in development mode
  - `componentName` prop for identifying error source

- **Print Styles** - Optimized document printing
  - Hide navigation, interactive elements, and animations
  - Reset colors to black/white for readability
  - Show full URLs after links for reference
  - Page break controls for proper document flow
  - Reduced margins and optimized typography

### Fixed

#### Technical Debt - ESLint Warnings

- Reduced lint warnings from 112 to 16 (react-refresh architectural warnings only)
- Fixed TypeScript `any` types across components, hooks, and utilities
- Added proper interfaces for component props (StatsCard, ColorClasses, etc.)
- Used `LucideIcon` type for icon props consistency
- Fixed generic type constraints in hooks (useDebounce, usePagination)
- Added `Record<string, unknown>` for analytics properties
- Removed unused variables and imports
- Fixed empty block statements with meaningful comments
- Fixed useless escape characters in regex patterns
- Added eslint-disable comments for intentionally any-typed framework APIs

---

## [0.2.0] - 2025-12-23

### Added

#### Medium Priority UX Improvements

- **Micro-interactions** - Enhanced hover effects for interactive elements

  - Card component with lift, glow, scale, and subtle hover variants
  - Spring physics animations for natural feel
  - Configurable per-card interaction styles

- **Toast Notification System** - User feedback for form submissions

  - `Toast` component with success, error, warning, info types
  - `ToastProvider` with configurable position
  - `useToast` hook for easy integration
  - Auto-dismiss with progress bar
  - Accessible ARIA attributes

- **Keyboard Navigation Indicators** - Enhanced accessibility

  - `SkipLink` component for skip-to-main-content
  - `useFocusTrap` hook for modal/menu focus management
  - Enhanced global focus-visible styles
  - High contrast and reduced motion support

- **Empty State Components** - Better UI for empty data

  - `EmptyState` component with animated entrance
  - `NoSearchResults`, `NoProjectsFound`, `NoDataAvailable` presets
  - Action buttons for user recovery paths

- **Scroll Progress Bar** - Visual reading progress indicator
  - `ScrollProgress` component with smooth spring animation
  - Gradient, primary, and accent color schemes
  - `ReadingProgress` variant with time remaining

---

## [0.1.0] - 2025-12-23

### Added

#### UX Improvements

- **Active Section Indicator (Scroll-Spy)** - Enhanced navigation with scroll-aware active section highlighting

  - Improved scroll detection algorithm with passive event listeners
  - Spring-animated gradient underline indicator
  - Visual feedback for current section

- **Skeleton Loading States** - Beautiful loading placeholders for better perceived performance

  - `ProjectCardSkeleton` with shimmer animation effects
  - `ProjectGridSkeleton` for grid layouts
  - `ExperienceCardSkeleton` for experience timeline
  - `CertificateCardSkeleton` for certificates section

- **Enhanced Form Validation UX** - Real-time feedback in contact form

  - `FormField` component with inline validation
  - Character counters for text inputs
  - Animated error messages with Framer Motion
  - Form completion progress indicator
  - Touch-aware validation (validates on blur)

- **Mobile Navigation Animation** - Polished mobile menu interactions

  - Animated hamburger-to-X morphing button
  - Smooth rotation transitions between states
  - Improved touch target accessibility

- **Image Blur-up Placeholders** - Enhanced image loading experience
  - New `BlurImage` component with blur-to-sharp transition
  - Gradient placeholder with shimmer animation
  - Scale animation for depth perception on load
  - Support for multiple aspect ratios
  - Error state with visual feedback

### Changed

- **TypeScript Strictness** - Replaced all `any` types with proper type definitions
  - Added Schema.org types for SEO
  - Extended Web Performance API types
  - Added Navigator and Performance interface extensions
  - Created specific types for experience filters and network information

### Fixed

- **Mobile Menu Transparency** - Fixed semi-transparent background in mobile navigation menu

  - Changed from `bg-slate-900/98` to fully opaque `bg-slate-900`
  - Removed conflicting `backdrop-blur-xl` property

- **Active Indicator Positioning** - Fixed jittery active section indicator on scroll
  - Changed from `left-1/2` with transform to `left-[10%] right-[10%]` positioning
  - Used `scaleX` animation instead of `width` for stable rendering

---

## [0.0.2] - Previous Release

### Features

- Initial portfolio implementation
- React 18 with TypeScript
- Vite build system
- Tailwind CSS styling
- Framer Motion animations
- Dark/Light theme support
- Contact form with EmailJS
- SEO optimization with structured data
- PWA support with service worker
- Performance monitoring
- Accessibility testing utilities
