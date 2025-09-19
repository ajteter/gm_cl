# Implementation Plan

- [x] 1. Set up Vite + React project structure
  - Initialize new Vite project with React template
  - Configure Vite build settings for static output
  - Set up project directory structure (src/, public/, etc.)
  - Install required dependencies (React Router, etc.)
  - _Requirements: 2.1, 2.2, 4.1, 4.2_

- [x] 2. Configure build and deployment setup
  - Create vite.config.js with proper build configuration
  - Set up package.json scripts for dev, build, and preview
  - Configure Cloudflare Pages deployment settings
  - Create _redirects file for SPA routing support
  - _Requirements: 2.1, 2.2, 5.1, 5.3_

- [x] 3. Migrate core styling and assets
  - Copy and adapt globals.css to new project structure
  - Migrate CSS modules from existing components
  - Copy static assets (games.json, images, etc.) to public directory
  - Set up CSS module support in Vite configuration
  - _Requirements: 4.3, 6.2, 6.4_

- [x] 4. Create core application structure
  - Implement main App.jsx component with React Router setup
  - Create main.jsx entry point file
  - Set up basic routing structure for all pages
  - Implement Layout component to replace Next.js layout
  - _Requirements: 4.2, 5.3, 6.1, 6.3_

- [ ] 5. Implement data fetching utilities and hooks
- [x] 5.1 Create useGames custom hook
  - Write useGames hook for fetching games from static JSON
  - Implement loading states and error handling
  - Add retry mechanism for failed requests
  - Write unit tests for useGames hook
  - _Requirements: 1.3, 3.1, 6.2_

- [x] 5.2 Create useRandomGame custom hook
  - Write useRandomGame hook with deterministic daily game selection
  - Implement date-based seeding algorithm from existing code
  - Add error handling and loading states
  - Write unit tests for useRandomGame hook
  - _Requirements: 1.4, 3.2, 6.2_

- [ ] 6. Migrate and convert core components
- [x] 6.1 Migrate GameCard component
  - Convert GameCard.js to GameCard.jsx
  - Update imports and ensure compatibility with Vite
  - Maintain existing styling and functionality
  - Write component tests
  - _Requirements: 3.1, 4.3, 6.1, 6.4_

- [x] 6.2 Migrate GameList component
  - Convert GameList.js to GameList.jsx with client-side rendering
  - Update ad integration to work in static environment
  - Maintain existing grid layout and styling
  - Write component tests
  - _Requirements: 3.1, 3.5, 6.1, 6.4_

- [x] 6.3 Migrate SkeletonCard component
  - Convert SkeletonCard.js to SkeletonCard.jsx
  - Ensure loading states work correctly
  - Maintain existing styling
  - Write component tests
  - _Requirements: 6.1, 6.4_

- [x] 7. Implement page components
- [x] 7.1 Create HomePage component
  - Implement HomePage.jsx combining home and game listing functionality
  - Use useGames hook for data fetching
  - Implement client-side pagination logic
  - Add loading and error states
  - _Requirements: 1.1, 3.1, 4.2, 6.1_

- [x] 7.2 Create RandomGamePage component
  - Convert existing random game page to RandomGamePage.jsx
  - Use useRandomGame hook for daily game selection
  - Maintain URL parameter handling for ad attribution
  - Preserve existing GameClientUI integration
  - _Requirements: 1.4, 3.2, 3.3, 6.1_

- [x] 7.3 Create GamePage component
  - Implement GamePage.jsx for individual game display
  - Handle game selection and display logic
  - Maintain existing game embedding functionality
  - Add proper error handling for invalid game IDs
  - _Requirements: 3.1, 6.1, 6.3_

- [x] 7.4 Create PlayPage component
  - Convert existing play page to PlayPage.jsx
  - Maintain existing functionality and styling
  - Ensure proper client-side rendering
  - _Requirements: 6.1, 6.3_

- [x] 7.5 Create PrivacyPage component
  - Convert privacy policy page to PrivacyPage.jsx
  - Maintain existing content and styling
  - Ensure static rendering works correctly
  - _Requirements: 6.1, 6.3_

- [x] 8. Implement SEO and metadata management
- [x] 8.1 Create SEO utilities
  - Write seoUtils.js for dynamic meta tag management
  - Implement functions for updating page titles and descriptions
  - Add structured data generation utilities
  - _Requirements: 3.4, 5.2_

- [x] 8.2 Add meta tag management to components
  - Implement dynamic meta tag updates in page components
  - Add proper Open Graph and Twitter Card metadata
  - Ensure SEO metadata works with client-side routing
  - _Requirements: 3.4, 5.2_

- [x] 9. Implement routing and navigation
- [x] 9.1 Set up React Router configuration
  - Configure all routes in App.jsx
  - Implement proper route handling for existing URL patterns
  - Add 404 error page handling
  - _Requirements: 5.3, 6.3_

- [x] 9.2 Handle legacy route redirects
  - Implement client-side redirects for old source-based routes
  - Ensure backward compatibility with existing URLs
  - Add proper redirect logic in routing configuration
  - _Requirements: 5.3, 6.3_

- [x] 10. Migrate GameClientUI and game playing functionality
  - Convert GameClientUI.js to work with new architecture
  - Ensure URL parameter handling for ad attribution works
  - Maintain iframe embedding and game loading logic
  - Test game playing functionality thoroughly
  - _Requirements: 3.3, 3.2, 6.1_

- [x] 11. Implement error handling and loading states
- [x] 11.1 Create error boundary components
  - Implement React Error Boundary for graceful error handling
  - Create fallback UI components for error states
  - Add retry mechanisms for failed operations
  - _Requirements: 1.1, 1.2_

- [x] 11.2 Add comprehensive loading states
  - Implement loading indicators for all data fetching operations
  - Ensure smooth transitions between loading and loaded states
  - Add skeleton loading for better user experience
  - _Requirements: 1.1, 3.1_

- [x] 12. Set up testing framework and write tests
- [x] 12.1 Configure Vitest testing environment
  - Set up Vitest configuration for component testing
  - Configure React Testing Library
  - Set up test coverage reporting
  - _Requirements: 2.2, 4.2_

- [x] 12.2 Write comprehensive component tests
  - Write unit tests for all custom hooks
  - Write component tests for all page components
  - Write integration tests for routing and data flow
  - Achieve >80% test coverage
  - _Requirements: 2.2, 4.2_

- [x] 13. Optimize build output and performance
- [x] 13.1 Configure build optimization
  - Set up code splitting and lazy loading
  - Optimize bundle sizes and asset loading
  - Configure proper caching headers
  - _Requirements: 2.1, 5.1, 5.2_

- [x] 13.2 Implement performance monitoring
  - Add performance metrics tracking
  - Set up Lighthouse CI for automated audits
  - Optimize Core Web Vitals scores
  - _Requirements: 5.1, 5.2_

- [x] 14. Create deployment configuration
- [x] 14.1 Set up Cloudflare Pages configuration
  - Create proper build and deployment scripts
  - Configure _redirects file for SPA routing
  - Set up environment variables if needed
  - _Requirements: 5.1, 5.3, 5.4_

- [x] 14.2 Test deployment and validate functionality
  - Deploy to Cloudflare Pages staging environment
  - Validate all routes and functionality work correctly
  - Verify zero function invocations in Cloudflare analytics
  - Test performance and loading times
  - _Requirements: 5.1, 5.4, 5.5_

- [x] 15. Final validation and cleanup
  - Remove all Next.js and OpenNext dependencies
  - Clean up unused configuration files
  - Update documentation and README
  - Perform final testing of all functionality
  - _Requirements: 2.3, 2.4, 6.1_