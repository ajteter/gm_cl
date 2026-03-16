import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'
import { lazy, Suspense } from 'react'
import Layout from './components/Layout'
import DirectGpvRedirect from './components/DirectGpvRedirect'
import { ErrorFallback } from './components/ErrorBoundary'
import LoadingSpinner from './components/LoadingSpinner'
import { I18nProvider } from './i18n'

// Lazy load page components for code splitting
const HomePage = lazy(() => import('./pages/HomePage'))
const GamePage = lazy(() => import('./pages/GamePage'))
const RandomGamePage = lazy(() => import('./pages/RandomGamePage'))
const PlayPage = lazy(() => import('./pages/PlayPage'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

function App() {
  const handleError = (error, errorInfo) => {
    if (import.meta.env.DEV) {
      console.error('App Error:', error)
      console.error('Error Info:', errorInfo)
    }
  }

  const handleReset = () => {
    window.location.reload()
  }

  return (
    <I18nProvider>
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
                  {/* Main Game Portal Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/floppybird" element={<HomePage />} />
                  <Route path="/game" element={<GamePage />} />
                  <Route path="/game/random" element={<RandomGamePage />} />
                  <Route path="/game/play" element={<PlayPage />} />

                  <Route path="/privacy-policy" element={<PrivacyPage />} />

                  {/* Direct GPV route - redirects to daily game */}
                  <Route path="/game/direct/gpv" element={<DirectGpvRedirect />} />

                  {/* Legacy redirects */}
                  <Route path="/source/:sourceName" element={<Navigate to="/game" replace />} />
                  <Route path="/source/:sourceName/random" element={<Navigate to="/game/random" replace />} />
                  <Route path="/game2/*" element={<Navigate to="/game" replace />} />
                  <Route path="/game3/*" element={<Navigate to="/game" replace />} />
                  <Route path="/game/direct" element={<Navigate to="/game" replace />} />

                  {/* 404 page - must be last */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </Layout>
          </Router>
        </div>
      </ErrorBoundary>
    </I18nProvider>
  )
}

export default App