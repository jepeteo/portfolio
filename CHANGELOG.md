# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
