# Design Document

## Overview

This design outlines the migration strategy from the current Next.js + OpenNext + Cloudflare Workers architecture to a purely static site that can be deployed on Cloudflare Pages with zero function invocations. The migration will use Vite as the build tool with React to maintain the existing component structure while generating only static files.

The key architectural change is moving from server-side rendering (SSR) and API routes to a client-side rendered (CSR) single-page application (SPA) that fetches data from static JSON files.

## Architecture

### Current Architecture
- **Framework**: Next.js 15.3.3 with App Router
- **Deployment**: Cloudflare Workers via OpenNext
- **Data Storage**: Cloudflare KV + static JSON files
- **Rendering**: Mixed SSR and CSR

### Target Architecture
- **Framework**: Vite + React 19
- **Deployment**: Cloudflare Pages (static hosting only)
- **Data Storage**: Static JSON files only
- **Rendering**: Client-side rendering (CSR) only
- **Routing**: Client-side routing with React Router

### Migration Strategy

1. **Replace Next.js with Vite**: Vite provides excellent React support, fast builds, and generates purely static output
2. **Convert all pages to client components**: Remove all server-side rendering dependencies
3. **Implement client-side routing**: Use React Router for navigation
4. **Maintain existing component structure**: Preserve the current component hierarchy and styling
5. **Static data fetching**: All data will be fetched from static JSON files via fetch API

## Components and Interfaces

### Core Components Structure

```
src/
├── components/
│   ├── GameCard.jsx (migrated from .js)
│   ├── GameList.jsx (migrated from .js)
│   ├── SkeletonCard.jsx (migrated from .js)
│   └── Layout.jsx (new, replaces app/layout.js)
├── pages/
│   ├── HomePage.jsx (replaces app/page.js + app/game/page.js)
│   ├── RandomGamePage.jsx (replaces app/game/random/page.js)
│   ├── GamePage.jsx (replaces app/game/page.js)
│   ├── PlayPage.jsx (replaces app/play/page.js)
│   └── PrivacyPage.jsx (replaces app/privacy-policy/page.js)
├── hooks/
│   ├── useGames.js (custom hook for game data fetching)
│   └── useRandomGame.js (custom hook for daily game selection)
├── utils/
│   ├── gameUtils.js (game selection and filtering logic)
│   └── seoUtils.js (SEO metadata management)
├── styles/
│   ├── globals.css (migrated)
│   └── components/ (CSS modules)
├── App.jsx (main app component with routing)
└── main.jsx (entry point)
```

### Data Flow

1. **Static Data**: Games data served from `/public/games.json`
2. **Client Fetching**: Components use custom hooks to fetch data
3. **State Management**: React state for component-level data management
4. **Routing**: React Router handles all navigation

### Key Interfaces

#### Game Data Interface
```typescript
interface Game {
  id: string;
  title: string;
  namespace: string;
  description: string;
  category: string;
  orientation: string;
  quality_score: number;
  width: number;
  height: number;
  date_modified: string;
  date_published: string;
  thumb: string;
  image: string;
  url: string;
}
```

#### Custom Hooks Interface
```typescript
// useGames hook
interface UseGamesReturn {
  games: Game[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// useRandomGame hook  
interface UseRandomGameReturn {
  game: Game | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}
```

## Data Models

### Games Data Model
The existing `games.json` structure will be maintained without changes. The file contains an array of game objects with all necessary metadata for display and gameplay.

### Client-Side Data Management
- **Loading States**: Each data-fetching component will manage loading states
- **Error Handling**: Graceful error handling with retry mechanisms
- **Caching**: Browser-level caching for static JSON files
- **Daily Game Selection**: Deterministic algorithm based on current date for consistent daily games

## Error Handling

### Network Error Handling
```javascript
// Retry mechanism for failed requests
const fetchWithRetry = async (url, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};
```

### Component Error Boundaries
- Implement React Error Boundaries for graceful error handling
- Fallback UI components for failed data loads
- User-friendly error messages with retry options

### Data Validation
- Validate game data structure on fetch
- Handle malformed or missing game data gracefully
- Provide fallback content when data is unavailable

## Testing Strategy

### Unit Testing
- **Framework**: Vitest (Vite's testing framework)
- **Component Testing**: React Testing Library
- **Coverage**: Aim for >80% code coverage on critical components

### Integration Testing
- Test complete user flows (browse games, play random game)
- Test routing and navigation
- Test data fetching and error scenarios

### Build Testing
- Verify static build output contains only HTML/CSS/JS
- Test deployment to Cloudflare Pages
- Validate all routes work correctly in production

### Performance Testing
- Lighthouse audits for performance metrics
- Bundle size analysis
- Loading time comparisons with current implementation

## SEO and Metadata Management

### Static HTML Generation
- Pre-generate HTML with proper meta tags for each route
- Use Vite's HTML template system for SEO metadata
- Implement dynamic meta tag updates for client-side navigation

### Structured Data
- Maintain existing JSON-LD structured data
- Ensure proper schema markup for games and website

### Sitemap and Robots
- Generate static sitemap.xml during build
- Maintain robots.txt configuration
- Preserve existing SEO optimizations

## Build and Deployment Configuration

### Vite Configuration
```javascript
// vite.config.js
export default {
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom']
        }
      }
    }
  },
  base: '/' // For Cloudflare Pages
}
```

### Cloudflare Pages Configuration
- Use `dist/` directory as publish directory
- Configure `_redirects` file for SPA routing
- Set up custom headers for caching optimization

### Build Process
1. **Development**: `npm run dev` - Vite dev server
2. **Build**: `npm run build` - Generate static files
3. **Preview**: `npm run preview` - Test production build locally
4. **Deploy**: Direct upload to Cloudflare Pages or Git integration

## Migration Phases

### Phase 1: Setup and Core Migration
- Set up Vite + React project structure
- Migrate core components and styling
- Implement basic routing

### Phase 2: Feature Migration
- Migrate all page components
- Implement data fetching hooks
- Add error handling and loading states

### Phase 3: Optimization and Testing
- Performance optimization
- Comprehensive testing
- SEO verification

### Phase 4: Deployment and Validation
- Deploy to Cloudflare Pages
- Validate all functionality
- Performance monitoring setup