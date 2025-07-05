# Deployment Guide - theodorosmentis.com

## 🚀 Vercel Deployment Setup

### Prerequisites

1. ✅ Domain purchased: `theodorosmentis.com`
2. ✅ Vercel account created
3. ✅ GitHub repository ready

### Steps to Deploy

#### 1. Connect to Vercel

```bash
# Install Vercel CLI (optional)
npm i -g vercel

# Or deploy via Vercel Dashboard
```

#### 2. Import Project

- Go to [Vercel Dashboard](https://vercel.com/dashboard)
- Click "Add New" → "Project"
- Import from GitHub repository
- Select your portfolio repository

#### 3. Configure Build Settings

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

#### 4. Environment Variables

Add these in Vercel Dashboard under Settings → Environment Variables:

```bash
VITE_APP_ENV=production
VITE_APP_DOMAIN=theodorosmentis.com
VITE_ENABLE_MONITORING=true
VITE_ENABLE_PERFORMANCE_DASHBOARD=false

# Vercel Analytics & Speed Insights (REQUIRED for analytics)
VITE_VERCEL_ANALYTICS_ENABLED=true
VITE_VERCEL_SPEED_INSIGHTS_ENABLED=true

# EmailJS Configuration (add your real values)
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

> **Important**: The Vercel Analytics and Speed Insights will only load when:
> 1. The environment variables are set to `true`
> 2. The site is running on Vercel (vercel.app domain or theodorosmentis.com)
> 3. They fail gracefully if disabled or unavailable

#### 5. Custom Domain Setup

1. In Vercel Dashboard → Project Settings → Domains
2. Add `theodorosmentis.com`
3. Add `www.theodorosmentis.com` (redirect to main domain)
4. Configure DNS records as instructed by Vercel

#### 6. Security Headers

✅ Already configured in `vercel.json`:

- CSP (Content Security Policy)
- HSTS (HTTP Strict Transport Security)
- X-Frame-Options
- X-Content-Type-Options

### 🎯 Performance Optimizations Included

✅ **CLS Prevention**: Fixed heights, layout containment
✅ **Image Optimization**: Proper dimensions, lazy loading
✅ **Code Splitting**: Lazy-loaded components
✅ **Bundle Optimization**: Tree-shaking, minification
✅ **Caching**: Aggressive caching for static assets

### 📊 Expected Core Web Vitals

- **LCP**: < 2.5s (Optimized images and lazy loading)
- **FID**: < 100ms (Optimized JavaScript)
- **CLS**: < 0.1 (Fixed layouts and dimensions)

### 🔧 Post-Deployment

1. Test the live site: `https://theodorosmentis.com`
2. **Set up Vercel Analytics & Speed Insights**:
   - Go to Vercel Dashboard → Project → Analytics tab
   - Enable Analytics and Speed Insights
   - Verify environment variables are set correctly
3. Run Lighthouse audit
4. Monitor performance with built-in dashboard
5. Update EmailJS configuration for contact form

### 📊 Analytics & Monitoring

✅ **Vercel Analytics**: Tracks page views and user interactions
✅ **Vercel Speed Insights**: Monitors Core Web Vitals in real-time  
✅ **Failsafe Integration**: Only loads when enabled and on Vercel platform
✅ **Privacy-First**: No personal data tracking, aggregated metrics only

### 🚀 Continuous Deployment

- Every push to `main` branch auto-deploys
- Preview deployments for pull requests
- Rollback available in Vercel Dashboard

---

**Ready to deploy!** 🎉
