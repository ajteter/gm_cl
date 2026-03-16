import React, { useState, useEffect } from 'react';
import { cn } from '../utils/cn';

/**
 * ReviveAdModal - Shown when the player dies and has a revive opportunity.
 *
 * Props:
 * - isOpen: bool
 * - onAccept: fn — called when user clicks "Watch Ad to Revive"
 * - onDecline: fn — called on skip or countdown expiry
 * - adCountdown: number|null — when non-null, displays ad playing countdown instead of loading spinner
 */
export default function ReviveAdModal({ isOpen, onAccept, onDecline, adCountdown = null }) {
  const [countdown, setCountdown] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(5);
      setIsLoading(false);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onDecline();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, onDecline]);

  const handleAcceptClick = () => {
    if (isLoading) return;
    setIsLoading(true);
    onAccept();
  };

  if (!isOpen) return null;

  // Determine body content based on state
  const isWatchingAd = adCountdown !== null && adCountdown > 0;
  const isAdDone = adCountdown !== null && adCountdown <= 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-[90%] max-w-sm bg-zinc-900 border border-white/10 rounded-2xl p-6 flex flex-col items-center shadow-2xl">

        {isWatchingAd ? (
          // --- Ad is playing state ---
          <>
            <h2 className="text-xl font-bold text-white mb-2">Almost there!</h2>
            <p className="text-gray-400 text-center text-sm mb-4">
              Ad is playing... Please wait
            </p>
            <div className="flex items-center justify-center w-16 h-16 rounded-full border-4 border-white/20 border-t-white animate-spin mb-4" />
            <p className="text-white font-bold text-2xl">{adCountdown}s</p>
          </>
        ) : isAdDone ? (
          // --- Ad finished, awaiting revive ---
          <>
            <h2 className="text-xl font-bold text-white mb-2">Reviving...</h2>
            <div className="flex items-center justify-center w-16 h-16 rounded-full border-4 border-white/20 border-t-white animate-spin mb-4" />
          </>
        ) : isLoading ? (
          // --- Loading ad ---
          <>
            <h2 className="text-xl font-bold text-white mb-2">Loading Ad...</h2>
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mt-4" />
          </>
        ) : (
          // --- Default: offer revive ---
          <>
            <h2 className="text-xl font-bold text-white mb-2">Revive Your Bird!</h2>
            <p className="text-gray-400 text-center text-sm mb-2">
              Watch a short ad to continue from where you left off.
            </p>

            <button
              onClick={handleAcceptClick}
              disabled={isLoading}
              className={cn(
                'w-full py-3 mt-4 bg-white text-black font-bold rounded-xl transition-colors flex items-center justify-center gap-2',
                isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200 cursor-pointer'
              )}
            >
              Watch Ad to Revive
            </button>

            <button
              onClick={onDecline}
              disabled={isLoading}
              className={cn(
                'mt-3 text-sm text-white/50 transition-colors',
                isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:text-white/80 cursor-pointer'
              )}
            >
              Skip ({countdown}s)
            </button>
          </>
        )}

      </div>
    </div>
  );
}
