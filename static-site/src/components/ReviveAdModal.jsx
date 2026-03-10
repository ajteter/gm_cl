import React, { useState, useEffect } from 'react';
import { cn } from '../utils/cn';

export default function ReviveAdModal({ isOpen, onAccept, onDecline }) {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(5);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-[90%] max-w-sm bg-zinc-900 border border-white/10 rounded-2xl p-6 flex flex-col items-center shadow-2xl">
        <h2 className="text-xl font-bold text-white mb-2">Revive Your Bird!</h2>
        <p className="text-gray-400 text-center text-sm mb-2">Watch a short ad to continue from where you left off.</p>
        
        <button
          onClick={onAccept}
          className="w-full py-3 mt-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          Watch Ad to Revive
        </button>
        
        <button
          onClick={onDecline}
          className="mt-3 text-sm text-white/50 hover:text-white/80 transition-colors cursor-pointer"
        >
          Skip ({countdown}s)
        </button>
      </div>
    </div>
  );
}
