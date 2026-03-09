import { useState, useEffect } from 'react';
import performanceMonitor from '../utils/performanceMonitoring';

/**
 * Performance Dashboard Component
 * Shows Core Web Vitals and other performance metrics in development
 */
const PerformanceDashboard = () => {
  const [metrics, setMetrics] = useState({});
  const [scores, setScores] = useState({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    // Update metrics every 2 seconds
    const interval = setInterval(() => {
      const currentMetrics = performanceMonitor.getMetrics();
      const currentScores = performanceMonitor.getPerformanceScore();
      setMetrics(currentMetrics);
      setScores(currentScores);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Don't render in production
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const getScoreColor = (score) => {
    switch (score) {
      case 'good': return '#0cce6b';
      case 'needs-improvement': return '#ffa400';
      case 'poor': return '#ff4e42';
      default: return '#9aa0a6';
    }
  };

  const formatValue = (value, unit = 'ms') => {
    if (value === undefined || value === null) return 'N/A';
    return `${value}${unit}`;
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        className="w-10 h-10 rounded-full bg-slate-800 border border-white/20 text-xl shadow-lg cursor-pointer flex items-center justify-center hover:bg-slate-700 hover:scale-105 transition-all text-white"
        onClick={() => setIsVisible(!isVisible)}
        title="Toggle Performance Dashboard"
      >
        📊
      </button>

      {isVisible && (
        <div className="absolute bottom-14 right-0 w-80 bg-slate-900 border border-white/20 rounded-xl shadow-2xl p-4 text-white font-sans text-sm animate-fade-in">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/10">
            <h3 className="m-0 font-medium text-white/90">Performance Metrics</h3>
            <button
              className="bg-transparent border-none text-white/50 text-xl cursor-pointer hover:text-white"
              onClick={() => setIsVisible(false)}
            >
              ×
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h4 className="m-0 text-white/50 text-xs uppercase tracking-wider mb-1">Core Web Vitals</h4>
              <div className="flex items-center justify-between py-1 border-b border-white/5 last:border-0">
                <span className="text-white/70 w-24">LCP:</span>
                <span
                  className="font-mono text-right flex-1"
                  style={{ color: getScoreColor(scores.lcp) }}
                >
                  {formatValue(metrics.lcp)}
                </span>
                <span className="ml-2 text-xs px-2 py-0.5 rounded-sm bg-white/10 uppercase">{scores.lcp || 'pending'}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-white/5 last:border-0">
                <span className="text-white/70 w-24">FID:</span>
                <span
                  className="font-mono text-right flex-1"
                  style={{ color: getScoreColor(scores.fid) }}
                >
                  {formatValue(metrics.fid)}
                </span>
                <span className="ml-2 text-xs px-2 py-0.5 rounded-sm bg-white/10 uppercase">{scores.fid || 'pending'}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-white/5 last:border-0">
                <span className="text-white/70 w-24">CLS:</span>
                <span
                  className="font-mono text-right flex-1"
                  style={{ color: getScoreColor(scores.cls) }}
                >
                  {formatValue(metrics.cls, '')}
                </span>
                <span className="ml-2 text-xs px-2 py-0.5 rounded-sm bg-white/10 uppercase">{scores.cls || 'pending'}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h4 className="m-0 text-white/50 text-xs uppercase tracking-wider mb-1">Other Metrics</h4>
              <div className="flex items-center justify-between py-1 border-b border-white/5 last:border-0">
                <span className="text-white/70 w-24">FCP:</span>
                <span className="font-mono text-right flex-1">{formatValue(metrics.fcp)}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-white/5 last:border-0">
                <span className="text-white/70 w-24">TTFB:</span>
                <span className="font-mono text-right flex-1">{formatValue(metrics.ttfb)}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-white/5 last:border-0">
                <span className="text-white/70 w-24">DOM Ready:</span>
                <span className="font-mono text-right flex-1">{formatValue(metrics.domContentLoaded)}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-white/5 last:border-0">
                <span className="text-white/70 w-24">Load Complete:</span>
                <span className="font-mono text-right flex-1">{formatValue(metrics.loadComplete)}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-2 border-t border-white/10 text-center text-white/40 text-[10px]">
            <small>Development only - Core Web Vitals monitoring</small>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceDashboard;