# H5 Games Portal - Static Implementation

This is a high-performance, static H5 Games Portal built with React 19 and Vite, optimized for **Cloudflare Pages**.

## 🏗️ Technical Architecture

- **Core**: React 19 + Vite 7 (Pure Static SPA)
- **Styling**: Tailwind CSS v4 (Glassmorphism & Dark Theme)
- **Routing**: React Router DOM (Single System Architecture)
- **Deployment**: Cloudflare Pages (Zero Functions, Zero Workers)

## 🎮 Game Systems

The project currently focuses on a single-system architecture:
- **Featured Game**: Floppy Bird (Custom implementation with revive & invincibility mechanics)
- **Game Library**: Dynamic loading from `games.json`
- **Ad Integration**: High-performance iframe-based advertisements

## 🚀 Key Features

- **Performance**: Lighthouse scores >90, aggressive code splitting, and lazy loading.
- **Revive Mechanic**: Integrated watch-ad-to-revive flow for featured games.
- **SEO Optimized**: Dynamic metadata management in `Layout.jsx` with canonical URLs.
- **Glassmorphism UI**: Modern, premium dark theme designed for mobile webviews.

## 🛠️ Development

```bash
npm install        # Install dependencies
npm run dev        # Local development
npm run build      # Production build (dist/)
npm run preview    # Preview static build locally
```

## 🚀 Deployment

The site is optimized for **Cloudflare Pages** which offers:
- **Unlimited Free Requests**: No worker CPU/request limits.
- **Global CDN**: Ultra-fast asset delivery.
- **Zero Function Invocations**: 100% static asset serving.

```bash
# Direct deployment via Wrangler
npm run deploy:production
```

## 📁 Directory Structure

```
static-site/
├── public/               # Static assets & games
│   ├── games/            # Self-hosted game files
│   └── games.json        # Game library data
├── src/
│   ├── components/       # UI Components (Card, List, Client)
│   ├── pages/            # Route pages (Home, Play, Random)
│   ├── hooks/            # Custom React hooks (useGames, useSEO)
│   └── utils/            # Performance & SEO utilities
└── wrangler.toml         # Cloudflare Pages configuration
```

## 🔧 Optimization Notes

- **Death of Dead Code**: All unused components (MagSrv, Adcash legacy) have been removed.
- **Bundle Optimization**: Built-in tree-shaking reduces bundle size by ~20KB.
- **Caching**: Configured in `wrangler.toml` for aggressive long-term asset caching.
