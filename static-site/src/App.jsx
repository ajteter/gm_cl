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
import './App.css'

// Lazy load page components for code splitting
const HomePage = lazy(() => import('./pages/HomePage'))
const GamePage = lazy(() => import('./pages/GamePage'))
const RandomGamePage = lazy(() => import('./pages/RandomGamePage'))
const PlayPage = lazy(() => import('./pages/PlayPage'))
const HomePage2 = lazy(() => import('./pages/HomePage2'))
const Game2Page = lazy(() => import('./pages/Game2Page'))
const RandomGame2Page = lazy(() => import('./pages/RandomGame2Page'))
const Play2Page = lazy(() => import('./pages/Play2Page'))
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
      <div className="app">
        <Router>
          <Layout>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                {/* Main routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/game" element={<GamePage />} />
                <Route path="/game/random" element={<RandomGamePage />} />
                <Route path="/game/play" element={<PlayPage />} />
                
                {/* Game2 routes with different ad configuration */}
                <Route path="/game2" element={<HomePage2 />} />
                <Route path="/game2/game" element={<Game2Page />} />
                <Route path="/game2/random" element={<RandomGame2Page />} />
                <Route path="/game2/play" element={<Play2Page />} />
                
                <Route path="/privacy-policy" element={<PrivacyPage />} />
                
                {/* Direct GPV route - redirects to daily game */}
                <Route path="/game/direct/gpv" element={<DirectGpvRedirect />} />
                
                {/* Legacy redirects for old source-based routes */}
                <Route path="/source/:sourceName" element={<Navigate to="/game" replace />} />
                <Route path="/source/:sourceName/random" element={<Navigate to="/game/random" replace />} />
                
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