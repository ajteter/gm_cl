import { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'

/**
 * Convert a 2-letter ISO country code to an Emoji flag.
 * Falls back to 🌍 for unknown/missing codes.
 */
function countryToFlag(code) {
  if (!code || code === 'XX' || code.length !== 2) return '🌍'
  const points = code
    .toUpperCase()
    .split('')
    .map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)
  return String.fromCodePoint(...points)
}

/**
 * LeaderboardSystem — manages the full "Game Over → Name Input → Top 10" flow.
 *
 * Props:
 *   isOpen      – whether the modal is visible
 *   score       – the player's final score
 *   onClose     – callback to close the modal (parent resets state)
 *   iframeRef   – ref to the game iframe (for postMessage)
 *   gameUrl     – game URL used for targetOrigin
 */
export default function LeaderboardSystem({
  isOpen,
  score,
  onClose,
  iframeRef,
  gameUrl,
}) {
  const [leaderboard, setLeaderboard] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [needsName, setNeedsName] = useState(false)
  const [playerName, setPlayerName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [error, setError] = useState(null)

  // -----------------------------------------------------------------------
  // Fetch leaderboard
  // -----------------------------------------------------------------------
  const fetchLeaderboard = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/leaderboard')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setLeaderboard(data)
      return data
    } catch {
      setError('Could not load leaderboard')
      return []
    } finally {
      setIsLoading(false)
    }
  }, [])

  // -----------------------------------------------------------------------
  // On open: reset state & fetch
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (!isOpen || score <= 0) return
    setHasSubmitted(false)
    setPlayerName('')
    setNeedsName(false)
    setError(null)

    fetchLeaderboard().then((data) => {
      if (data.length < 10 || score >= data[data.length - 1].score) {
        setNeedsName(true)
      }
    })
  }, [isOpen, score, fetchLeaderboard])

  // -----------------------------------------------------------------------
  // Submit score
  // -----------------------------------------------------------------------
  const handleSubmitScore = async () => {
    const trimmed = playerName.trim()
    if (!trimmed || isSubmitting) return
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerName: trimmed.slice(0, 10), score }),
      })
      if (!res.ok) throw new Error('Submit failed')
      setHasSubmitted(true)
      setNeedsName(false)
      await fetchLeaderboard()
    } catch {
      setError('Failed to submit score')
    } finally {
      setIsSubmitting(false)
    }
  }

  // -----------------------------------------------------------------------
  // Skip name input
  // -----------------------------------------------------------------------
  const handleSkipName = () => {
    setNeedsName(false)
  }

  // -----------------------------------------------------------------------
  // Play Again — restart the game via postMessage
  // -----------------------------------------------------------------------
  const handlePlayAgain = () => {
    if (iframeRef?.current?.contentWindow && gameUrl) {
      try {
        const origin = new URL(gameUrl, window.location.origin).origin
        iframeRef.current.contentWindow.postMessage(
          { type: 'RESTART_GAME' },
          origin
        )
      } catch {
        iframeRef.current.contentWindow.postMessage(
          { type: 'RESTART_GAME' },
          '*'
        )
      }
    }
    onClose()
  }

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/80 backdrop-blur-sm pt-6"
      style={{ animation: 'fadeIn .2s ease' }}
    >
      <div
        className="w-full max-w-sm mx-4 rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, rgba(17,24,39,.97), rgba(31,41,55,.97))',
          animation: 'slideUp .3s ease',
        }}
      >
        {/* ---- Header ---- */}
        <div className="px-6 pt-6 pb-4 text-center border-b border-white/10">
          <h2 className="text-xl font-bold text-white flex items-center justify-center gap-2">
            🏆 Global Top 10
          </h2>
          <div className="mt-3 text-3xl font-black text-amber-400 tabular-nums">
            Your Score: {score}
          </div>
        </div>

        {/* ---- Name Input (only when qualified & not yet submitted) ---- */}
        {needsName && !hasSubmitted && (
          <div className="px-6 py-4 border-b border-white/10 bg-amber-500/10">
            <p className="text-amber-300 text-sm font-semibold mb-3 text-center">
              🎉 You made the Top 10! Enter your name:
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value.slice(0, 10))}
                placeholder="Your name"
                maxLength={10}
                autoFocus
                className="flex-1 px-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-amber-400/60 text-sm"
                onKeyDown={(e) => e.key === 'Enter' && handleSubmitScore()}
              />
              <button
                onClick={handleSubmitScore}
                disabled={!playerName.trim() || isSubmitting}
                className="px-4 py-2.5 rounded-xl bg-amber-500 text-black font-bold text-sm hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                {isSubmitting ? '...' : 'Save'}
              </button>
            </div>
            <div className="flex items-center justify-between mt-3">
              <span className="text-white/30 text-xs">
                {playerName.length}/10
              </span>
              <button
                onClick={handleSkipName}
                className="px-4 py-1.5 rounded-lg border border-white/20 text-white/60 text-sm font-medium hover:bg-white/10 hover:text-white/80 transition-colors cursor-pointer"
              >
                Skip
              </button>
            </div>
          </div>
        )}

        {/* ---- Leaderboard List ---- */}
        <div className="px-4 py-3 max-h-[40vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 rounded-full border-4 border-white/20 border-t-amber-400 animate-spin" />
            </div>
          ) : error ? (
            <p className="text-red-400 text-center py-6 text-sm">{error}</p>
          ) : leaderboard.length === 0 ? (
            <p className="text-white/50 text-center py-6 text-sm">
              No scores yet. Be the first!
            </p>
          ) : (
            <div className="space-y-1">
              {leaderboard.map((entry, i) => {
                const isPlayerEntry =
                  hasSubmitted &&
                  entry.player_name === playerName.trim() &&
                  entry.score === score
                return (
                  <div
                    key={`${entry.player_name}-${entry.score}-${i}`}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                      isPlayerEntry
                        ? 'bg-amber-500/20 border border-amber-500/30'
                        : 'bg-white/5'
                    }`}
                  >
                    <span
                      className={`w-7 text-center font-black text-sm ${
                        i === 0
                          ? 'text-amber-400'
                          : i === 1
                            ? 'text-gray-300'
                            : i === 2
                              ? 'text-orange-400'
                              : 'text-white/50'
                      }`}
                    >
                      {i === 0 ? '👑' : `#${i + 1}`}
                    </span>
                    <span className="text-lg leading-none">
                      {countryToFlag(entry.country)}
                    </span>
                    <span className="flex-1 text-white font-medium text-sm truncate">
                      {entry.player_name}
                    </span>
                    <span className="text-white/80 font-bold tabular-nums text-sm">
                      {entry.score}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* ---- Play Again Button ---- */}
        <div className="px-6 py-4 border-t border-white/10">
          <button
            onClick={handlePlayAgain}
            className="w-full py-3 rounded-xl bg-white text-black font-bold text-base hover:bg-gray-200 transition-colors active:scale-95 transform cursor-pointer"
          >
            🔄 Play Again
          </button>
        </div>
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

LeaderboardSystem.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  score: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  iframeRef: PropTypes.object,
  gameUrl: PropTypes.string,
}
