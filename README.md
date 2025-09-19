# H5 Games Portal - Static Site

A static HTML5 games portal built with React and Vite, deployed on Cloudflare Pages. This project has been migrated from Next.js to a purely static architecture for better performance and zero server costs.

## 🚀 Features

- **Purely Static**: No server-side rendering or functions - just HTML, CSS, and JavaScript
- **Fast Performance**: Built with Vite for optimal build times and bundle sizes
- **Game Portal**: Browse and play HTML5 games from GameMonetize
- **Daily Random Games**: Deterministic daily game selection
- **Responsive Design**: Works on desktop and mobile devices
- **SEO Optimized**: Proper meta tags and structured data
- **Error Handling**: Graceful error boundaries and retry mechanisms
- **Performance Monitoring**: Built-in performance tracking and Lighthouse CI

## 🏗️ Architecture

- **Framework**: React 19 + Vite 7
- **Routing**: React Router DOM
- **Styling**: CSS Modules + Global CSS
- **Testing**: Vitest + React Testing Library
- **Deployment**: Cloudflare Pages
- **Performance**: Lighthouse CI integration

## 📁 Project Structure

```
├── static-site/                 # Main application directory
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── pages/             # Page components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── utils/             # Utility functions
│   │   └── styles/            # CSS modules and global styles
│   ├── public/                # Static assets
│   ├── scripts/               # Build and deployment scripts
│   └── dist/                  # Build output (generated)
└── .kiro/specs/               # Project specifications and documentation
```

## 🛠️ Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Or install in the static-site directory directly
cd static-site && npm install
```

### Development Server

```bash
# Start development server
npm run dev

# Or from static-site directory
cd static-site && npm run dev
```

The development server will start at `http://localhost:5173`

### Building

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Testing

```bash
# Run tests
npm run test

# Run tests with coverage
cd static-site && npm run test:coverage

# Run tests in UI mode
cd static-site && npm run test:ui
```

### Linting

```bash
# Run ESLint
npm run lint

# Fix linting issues
cd static-site && npm run lint:fix
```

## 🚀 Deployment

The site is configured for deployment on Cloudflare Pages:

### Automatic Deployment (Recommended)

1. Connect your repository to Cloudflare Pages
2. Set build command: `cd static-site && npm run build`
3. Set output directory: `static-site/dist`
4. Deploy automatically on git push

### Manual Deployment

```bash
# Deploy to production
npm run deploy

# Or deploy from static-site directory
cd static-site && npm run deploy:production
```

### Deployment Validation

```bash
# Validate deployment
cd static-site && npm run validate:deployment

# Test local deployment
cd static-site && npm run test:local

# Verify build output
cd static-site && npm run verify:build
```

## 📊 Performance Monitoring

The project includes comprehensive performance monitoring:

```bash
# Run Lighthouse audit
cd static-site && npm run lighthouse

# Generate performance report
cd static-site && npm run perf:report

# Analyze bundle size
cd static-site && npm run build:analyze
```

## 🎮 Game Data

Games are loaded from a static JSON file (`public/games.json`) containing game metadata from GameMonetize. The file includes:

- Game titles and descriptions
- Thumbnails and images
- Game URLs and embed information
- Categories and quality scores
- Orientation and dimension data

## 🔧 Configuration

### Vite Configuration

The Vite configuration (`static-site/vite.config.js`) includes:
- React plugin setup
- Build optimization
- Code splitting
- Asset handling

### Cloudflare Pages Configuration

- `static-site/public/_redirects`: SPA routing configuration
- `static-site/public/_headers`: Caching and security headers
- `static-site/wrangler.toml`: Cloudflare deployment settings

## 🧪 Testing Strategy

- **Unit Tests**: Component and hook testing with Vitest
- **Integration Tests**: Full user flow testing
- **Performance Tests**: Lighthouse CI integration
- **Build Tests**: Deployment validation scripts

## 📈 Migration from Next.js

This project was successfully migrated from Next.js + OpenNext + Cloudflare Workers to a purely static architecture:

- ✅ Eliminated all server-side rendering
- ✅ Removed Cloudflare Workers dependency
- ✅ Converted to client-side routing
- ✅ Maintained all existing functionality
- ✅ Improved performance and reduced costs

For detailed migration documentation, see `.kiro/specs/static-migration/`.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## 📄 License

This project is private and proprietary.

## 🆘 Support

For issues and questions:
1. Check the deployment documentation in `static-site/DEPLOYMENT.md`
2. Review the performance monitoring setup
3. Validate your build with the provided scripts
4. Check Cloudflare Pages deployment logs