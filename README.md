# Modern Portfolio Website

[![Version](https://img.shields.io/badge/version-0.2.0-blue.svg)](https://github.com/jepeteo/portfolio)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

A high-performance, accessible portfolio website built with modern web technologies and best practices.

🌐 **Live Site**: [theodorosmentis.com](https://theodorosmentis.com)

## ✨ Features

### Core Features

- **Modern Design**: Clean, professional interface with smooth animations
- **Interactive UI**: Responsive design with Framer Motion animations
- **Project Showcase**: Comprehensive display of React projects, web projects, and client work
- **Experience Timeline**: Interactive work history with detailed descriptions
- **Skills Matrix**: Categorized technical skills with proficiency indicators
- **Certificates Gallery**: Professional certifications with filtering and stats
- **Contact Form**: Email integration via EmailJS with real-time validation and rate limiting
- **Dark/Light Mode**: Seamless theme switching with system preference detection

### UX Enhancements (v0.1.0)

- **Scroll-Spy Navigation**: Active section indicator with spring animations
- **Skeleton Loading States**: Beautiful shimmer placeholders for perceived performance
- **Form Validation UX**: Real-time feedback, character counters, and progress indicator
- **Mobile Nav Animation**: Animated hamburger-to-X morphing button
- **Image Blur-up Loading**: Smooth blur-to-sharp transitions with gradient placeholders

### UX Enhancements (v0.2.0)

- **Micro-interactions**: Enhanced card hover effects with lift, glow, and scale variants
- **Toast Notifications**: User feedback system for form submissions
- **Keyboard Navigation**: Skip links, focus trapping, enhanced focus indicators
- **Empty States**: Beautiful UI components for empty data scenarios
- **Scroll Progress Bar**: Visual reading progress indicator with smooth animation

### Performance & Optimization

- **Code Splitting**: Optimized lazy loading for all major components
- **Bundle Optimization**: 391KB main bundle (117KB gzipped)
- **CSS Optimization**: 105KB CSS (15.66KB gzipped)
- **Service Worker**: Advanced caching strategies for offline support
- **Image Optimization**: WebP format with lazy loading
- **Preloading**: Intelligent component preloading on hover/intersection

### Developer Experience

- **TypeScript**: Fully typed codebase (0 errors)
- **ESLint**: Configured with React best practices
- **Modern Build**: Vite 5 for fast development and builds
- **Hot Module Replacement**: Instant updates during development
- **Performance Monitoring**: Built-in metrics tracking

### Analytics & Monitoring

- **PostHog**: Advanced analytics and feature flags
- **Vercel Analytics**: Performance tracking
- **Speed Insights**: Core Web Vitals monitoring
- **Production Monitor**: Error tracking and reporting
- **Accessibility Testing**: Built-in a11y checker

## 🛠️ Technologies

### Core Stack

- **React 18.2** - UI library with latest features
- **TypeScript 5.6** - Type-safe development
- **Vite 5.4** - Next-generation build tool
- **Tailwind CSS 3.4** - Utility-first CSS framework

### UI & Animations

- **Framer Motion 12** - Production-ready animations
- **Lucide React** - Beautiful icon set
- **React Typed** - Typing animations
- **Container Queries** - Modern responsive design

### Integration & Analytics

- **EmailJS** - Contact form integration
- **PostHog** - Product analytics
- **Vercel Analytics** - Performance tracking
- **Service Workers** - Offline functionality

### Deployment Header Notes

- **Cross-Origin-Embedder-Policy**: Uses `credentialless` in production headers.
- **Why not `require-corp`**: The site loads third-party analytics and contact-provider resources that may not return compatible CORP/CORS headers in every path.
- **Security stance**: Keep strict CSP and other security headers, but avoid unnecessary cross-origin isolation requirements that can block analytics/contact behavior.

### Development Tools

- **ESLint** - Code quality enforcement
- **PostCSS** - CSS processing
- **Autoprefixer** - Browser compatibility

## 🚀 Getting Started

### Prerequisites

- Node.js >= 22.0.0
- npm >= 10.0.0

### Installation

```bash
# Clone the repository
git clone https://github.com/jepeteo/portfolio.git

# Navigate to project directory
cd portfolio

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Add your API keys to .env
# EMAILJS_SERVICE_ID=your_service_id
# EMAILJS_TEMPLATE_ID=your_template_id
# EMAILJS_PUBLIC_KEY=your_public_key
# CONTACT_EMAIL=your_email@example.com
# PUBLIC_SITE_ORIGIN=https://theodorosmentis.com
# VITE_POSTHOG_API_KEY=your_posthog_key
# VITE_POSTHOG_HOST=https://eu.i.posthog.com
```

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Type checking
npm run type-check

# Check project URLs
npm run check-urls

# Verify service worker pre-cache assets after build
npm run build && npm run verify:sw-precache
```

## 📁 Project Structure

```
portfolio/
├── public/
│   ├── cv/              # Resume/CV files
│   ├── images/          # Optimized images
│   ├── sw.js           # Service worker
│   └── manifest.json   # PWA manifest
├── src/
│   ├── assets/         # Data files (JSON)
│   ├── components/     # React components
│   │   ├── animations/ # Animation components
│   │   ├── certificates/ # Certificate components
│   │   ├── experience/ # Experience components
│   │   ├── icons/      # Icon components
│   │   ├── loading/    # Loading states
│   │   ├── modern/     # Modern UI components
│   │   ├── navigation/ # Navigation components
│   │   ├── skills/     # Skills components
│   │   └── ui/         # Reusable UI components
│   ├── context/        # React context
│   ├── design-system/  # Design tokens
│   ├── hooks/          # Custom React hooks
│   ├── styles/         # Global styles
│   ├── types/          # TypeScript types
│   ├── utils/          # Utility functions
│   └── middleware/     # Security middleware
├── scripts/            # Build scripts
└── docs/              # Documentation

```

## 🎨 Design System

The project uses a modern design system with:

- **Design Tokens**: Semantic color system with CSS variables
- **Typography Scale**: Fluid typography with proper hierarchy
- **Spacing System**: Consistent spacing using Tailwind
- **Animation System**: Predefined animations with Framer Motion
- **Component Library**: Reusable, accessible components

## 🔒 Security

- **Content Security Policy**: Strict CSP headers
- **Rate Limiting**: Form submission protection
- **Input Validation**: Sanitization and validation
- **CSRF Protection**: Token-based security
- **Secure Storage**: Encrypted local storage
- **Bot Detection**: Honeypot and timing checks

## ♿ Accessibility

- **WCAG 2.1 AA Compliant**: Meets accessibility standards
- **Semantic HTML**: Proper HTML structure
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Visible focus indicators
- **Color Contrast**: Meets contrast requirements

## 📊 Performance Metrics

- **Lighthouse Score**: 95+ across all categories
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.5s
- **Cumulative Layout Shift**: < 0.1
- **Bundle Size**: 391KB (117KB gzipped)

## 🔄 Recent Improvements (October 2025)

- ✅ Migrated to Node.js 22
- ✅ Fixed all TypeScript errors (64 → 0)
- ✅ Removed 10 unused packages (Flowbite)
- ✅ Cleaned up 45 unused icon imports
- ✅ Improved error handling across codebase
- ✅ Added comprehensive setup documentation
- ✅ Fixed PostHog integration issues
- ✅ Optimized bundle size (-25% JS, -62% CSS)
- ✅ Improved build performance (-40% build time)
- ✅ Enhanced code quality (181 → 173 ESLint warnings)

## 📝 Environment Variables

Create a `.env` file in the root directory:

```env
# Contact API / EmailJS configuration (server-side)
EMAILJS_SERVICE_ID=your_service_id
EMAILJS_TEMPLATE_ID=your_template_id
EMAILJS_PUBLIC_KEY=your_public_key
CONTACT_EMAIL=your_email@example.com
PUBLIC_SITE_ORIGIN=https://theodorosmentis.com

# PostHog Analytics
VITE_POSTHOG_API_KEY=your_posthog_key
VITE_POSTHOG_HOST=https://eu.i.posthog.com
VITE_ENABLE_POSTHOG=true

# Monitoring
VITE_ENABLE_MONITORING=true
```

## 📚 Documentation

- [Setup Guide](SETUP.md) - Comprehensive setup instructions
- [PRD](PRD.md) - Product requirements document
- [Deployment Notes](src/docs/DEPLOYMENT.md) - Deployment guides

## 🤝 Contributing

This is a personal portfolio project, but suggestions and feedback are welcome! Feel free to open an issue or reach out via email.

## 📧 Contact

**Theodoros Mentis**

- Email: [th.mentis@gmail.com](mailto:th.mentis@gmail.com)
- Website: [theodorosmentis.com](https://theodorosmentis.com)
- GitHub: [@jepeteo](https://github.com/jepeteo)
- LinkedIn: [theodorosmentis](https://linkedin.com/in/theodorosmentis)

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---

**Built with ❤️ using React, TypeScript, and modern web technologies**
