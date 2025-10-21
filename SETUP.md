# 🚀 Portfolio Setup Guide

## Prerequisites

- **Node.js**: >= 22.0.0 ([Download](https://nodejs.org/))
- **npm**: >= 10.0.0
- **Git**: Latest version

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/jepeteo/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173)

## Environment Variables Setup

### Required for Contact Form

To enable the contact form, you need EmailJS credentials:

1. **Create EmailJS Account**
   - Go to [EmailJS](https://www.emailjs.com/)
   - Sign up for free account
   - Create an email service
   - Create an email template

2. **Configure `.env.local`**
   ```bash
   VITE_EMAILJS_SERVICE_ID=your_service_id_here
   VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
   VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
   ```

### Optional: Analytics

#### PostHog (Development/Production Analytics)
```bash
VITE_ENABLE_POSTHOG=true
VITE_PUBLIC_POSTHOG_KEY=your_posthog_key
VITE_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
```

**Note**: Vercel Analytics works automatically when deployed to Vercel - no setup needed!

### Feature Flags

```bash
# Enable/disable features
VITE_ENABLE_MONITORING=true
VITE_ENABLE_PERFORMANCE_DASHBOARD=true
VITE_ENABLE_SERVICE_WORKER=true
VITE_ENABLE_OFFLINE_MODE=true
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |
| `npm run type-check` | Check TypeScript types |
| `npm run clean` | Clean build artifacts |
| `npm run check-urls` | Validate project URLs |
| `npm run performance:analyze` | Analyze bundle size |

## Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Deploy to Vercel**
   - Import project in [Vercel Dashboard](https://vercel.com/new)
   - Set environment variables in Vercel Dashboard
   - Deploy automatically on push

3. **Set Production Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all required variables from `.env.example`
   - Enable Vercel Analytics and Speed Insights

### Manual Deployment

```bash
npm run build
# Upload dist/ folder to your hosting provider
```

## Troubleshooting

### Node Version Issues
```bash
# Check your Node version
node --version

# If using nvm, switch to Node 22
nvm use 22
```

### Port Already in Use
```bash
# Kill process on port 5173
npx kill-port 5173

# Or Vite will automatically use next available port
```

### Build Errors
```bash
# Clean install
npm run clean
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors
```bash
# Check for type errors
npm run type-check
```

## Project Structure

```
portfolio/
├── src/
│   ├── components/     # React components
│   ├── assets/         # JSON data & images
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   ├── context/        # React context
│   ├── types/          # TypeScript types
│   └── styles/         # CSS files
├── public/             # Static assets
├── dist/               # Build output (gitignored)
└── .env.local          # Local environment variables (gitignored)
```

## Need Help?

- 📧 Email: th.mentis@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/jepeteo/portfolio/issues)
- 📖 Docs: Check `README.md` for more details

## Performance Tips

- Use `npm run performance:analyze` to check bundle size
- Keep main bundle under 500KB
- Optimize images before adding to project
- Use lazy loading for heavy components

---

**Happy coding! 🚀**
