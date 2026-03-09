import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'
import { lazy, useEffect, Suspense } from 'react'
import Layout from './components/Layout'
import DirectGpvRedirect from './components/DirectGpvRedirect'
import { ErrorFallback } from './components/ErrorBoundary'
import LoadingSpinner from './components/LoadingSpinner'
import PerformanceDashboard from './components/PerformanceDashboard'
import { initializePerformanceOptimizations } from './utils/performanceUtils'
import performanceMonitor from './utils/performanceMonitoring'


// Lazy load page components for code splitting
const HomePage = lazy(() => import('./pages/HomePage'))
const GamePage = lazy(() => import('./pages/GamePage'))
const RandomGamePage = lazy(() => import('./pages/RandomGamePage'))
const PlayPage = lazy(() => import('./pages/PlayPage'))
const AdTestPage = lazy(() => import('./pages/AdTestPage'))
const MagSrvTestPage = lazy(() => import('./pages/MagSrvTestPage'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

function App() {
  // Initialize performance optimizations and monitoring
  useEffect(() => {
    initializePerformanceOptimizations();
    performanceMonitor.init();

    // Cleanup on unmount
    return () => {
      performanceMonitor.disconnect();
    };
  }, []);

  const handleError = (error, errorInfo) => {
    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('App Error:', error)
      console.error('Error Info:', errorInfo)
    }

    // In production, you might want to send to error tracking service
    // Example: logErrorToService(error, errorInfo)
  }

  const handleReset = () => {
    // Clear any cached data or reset app state if needed
    // For now, just reload the page as a fallback
    window.location.reload()
  }

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={handleError}
      onReset={handleReset}
    >
      <div className="min-h-screen bg-background text-text-main font-sans antialiased text-white selection:bg-primary/30">
        <Router>
          <Layout>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                {/* Main routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/game" element={<GamePage />} />
                <Route path="/game/random" element={<RandomGamePage />} />
                <Route path="/game/play" element={<PlayPage />} />

                {/* Ad test pages for debugging */}
                <Route path="/ad-test" element={<AdTestPage />} />
                <Route path="/magsrv-test" element={<MagSrvTestPage />} />

                <Route path="/privacy-policy" element={<PrivacyPage />} />

                {/* Direct GPV route - redirects to daily game */}
                <Route path="/game/direct/gpv" element={<DirectGpvRedirect />} />

                {/* Legacy redirects for old source-based routes */}
                <Route path="/source/:sourceName" element={<Navigate to="/game" replace />} />
                <Route path="/source/:sourceName/random" element={<Navigate to="/game/random" replace />} />

                {/* Redirect removed game2/game3 routes to main routes */}
                <Route path="/game2/*" element={<Navigate to="/game" replace />} />
                <Route path="/game3/*" element={<Navigate to="/game" replace />} />

                {/* Additional legacy route patterns that might exist */}
                <Route path="/game/direct" element={<Navigate to="/game" replace />} />

                {/* 404 page - must be last */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </Layout>
        </Router>

        {/* Performance monitoring dashboard (development only) */}
        <PerformanceDashboard />
      </div>
    </ErrorBoundary>
  )
}

export default App