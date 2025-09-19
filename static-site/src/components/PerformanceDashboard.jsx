import { useState, useEffect } from 'react';
import performanceMonitor from '../utils/performanceMonitoring';
import styles from '../styles/components/PerformanceDashboard.module.css';

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
    <div className={styles.dashboard}>
      <button 
        className={styles.toggle}
        onClick={() => setIsVisible(!isVisible)}
        title="Toggle Performance Dashboard"
      >
        📊
      </button>
      
      {isVisible && (
        <div className={styles.panel}>
          <div className={styles.header}>
            <h3>Performance Metrics</h3>
            <button 
              className={styles.close}
              onClick={() => setIsVisible(false)}
            >
              ×
            </button>
          </div>
          
          <div className={styles.metrics}>
            <div className={styles.section}>
              <h4>Core Web Vitals</h4>
              <div className={styles.metric}>
                <span className={styles.label}>LCP:</span>
                <span 
                  className={styles.value}
                  style={{ color: getScoreColor(scores.lcp) }}
                >
                  {formatValue(metrics.lcp)}
                </span>
                <span className={styles.score}>{scores.lcp || 'pending'}</span>
              </div>
              
              <div className={styles.metric}>
                <span className={styles.label}>FID:</span>
                <span 
                  className={styles.value}
                  style={{ color: getScoreColor(scores.fid) }}
                >
                  {formatValue(metrics.fid)}
                </span>
                <span className={styles.score}>{scores.fid || 'pending'}</span>
              </div>
              
              <div className={styles.metric}>
                <span className={styles.label}>CLS:</span>
                <span 
                  className={styles.value}
                  style={{ color: getScoreColor(scores.cls) }}
                >
                  {formatValue(metrics.cls, '')}
                </span>
                <span className={styles.score}>{scores.cls || 'pending'}</span>
              </div>
            </div>
            
            <div className={styles.section}>
              <h4>Other Metrics</h4>
              <div className={styles.metric}>
                <span className={styles.label}>FCP:</span>
                <span className={styles.value}>{formatValue(metrics.fcp)}</span>
              </div>
              
              <div className={styles.metric}>
                <span className={styles.label}>TTFB:</span>
                <span className={styles.value}>{formatValue(metrics.ttfb)}</span>
              </div>
              
              <div className={styles.metric}>
                <span className={styles.label}>DOM Ready:</span>
                <span className={styles.value}>{formatValue(metrics.domContentLoaded)}</span>
              </div>
              
              <div className={styles.metric}>
                <span className={styles.label}>Load Complete:</span>
                <span className={styles.value}>{formatValue(metrics.loadComplete)}</span>
              </div>
            </div>
          </div>
          
          <div className={styles.footer}>
            <small>Development only - Core Web Vitals monitoring</small>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceDashboard;