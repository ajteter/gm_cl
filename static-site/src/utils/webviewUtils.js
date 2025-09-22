/**
 * WebView Environment Detection and Utilities
 * 专为App WebView环境设计的工具函数
 */

/**
 * 检测是否运行在WebView环境中
 */
export function isWebView() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  // 检测常见的WebView标识
  const webViewIndicators = [
    /wv/i, // Android WebView
    /WebView/i, // Generic WebView
    /; wv\)/i, // Android WebView pattern
    /Version\/[\d.]+.*Mobile.*Safari/i, // iOS WebView pattern
  ];
  
  return webViewIndicators.some(pattern => pattern.test(userAgent));
}

/**
 * 检测具体的WebView类型
 */
export function getWebViewType() {
  const userAgent = navigator.userAgent || '';
  
  if (/iPhone|iPad|iPod/i.test(userAgent)) {
    if (/Version\/[\d.]+.*Mobile.*Safari/i.test(userAgent) && !/CriOS|FxiOS/i.test(userAgent)) {
      return 'ios-webview';
    }
  }
  
  if (/Android/i.test(userAgent)) {
    if (/wv|WebView/i.test(userAgent)) {
      return 'android-webview';
    }
  }
  
  return 'unknown';
}

/**
 * 获取WebView环境信息
 */
export function getWebViewInfo() {
  return {
    isWebView: isWebView(),
    type: getWebViewType(),
    userAgent: navigator.userAgent,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio || 1
    },
    features: {
      localStorage: typeof Storage !== 'undefined',
      sessionStorage: typeof sessionStorage !== 'undefined',
      indexedDB: typeof indexedDB !== 'undefined',
      webGL: !!window.WebGLRenderingContext,
      touchEvents: 'ontouchstart' in window,
      geolocation: !!navigator.geolocation,
      camera: !!navigator.mediaDevices,
    }
  };
}

/**
 * WebView特定的错误处理
 */
export function handleWebViewError(error, context = 'unknown') {
  const errorInfo = {
    message: error.message,
    stack: error.stack,
    context,
    webViewInfo: getWebViewInfo(),
    timestamp: new Date().toISOString(),
    url: window.location.href
  };
  
  // 在开发环境中输出详细信息
  if (process.env.NODE_ENV === 'development') {
    console.group(`[WebView Error] ${context}`);
    console.error('Error:', error);
    console.log('WebView Info:', errorInfo.webViewInfo);
    console.log('Full Error Info:', errorInfo);
    console.groupEnd();
  }
  
  // 可以在这里添加错误上报逻辑
  // reportErrorToAnalytics(errorInfo);
  
  return errorInfo;
}

/**
 * WebView中的安全URL检查
 */
export function isSafeUrl(url) {
  try {
    const urlObj = new URL(url);
    const allowedProtocols = ['http:', 'https:'];
    const allowedDomains = [
      'gamemonetize.com',
      'html5.gamemonetize.com',
      'a.magsrv.com',
      'www.highperformanceformat.com'
    ];
    
    // 检查协议
    if (!allowedProtocols.includes(urlObj.protocol)) {
      return false;
    }
    
    // 检查域名（对于游戏和广告URL）
    const hostname = urlObj.hostname.toLowerCase();
    const isAllowedDomain = allowedDomains.some(domain => 
      hostname === domain || hostname.endsWith('.' + domain)
    );
    
    return isAllowedDomain;
  } catch (e) {
    return false;
  }
}

/**
 * WebView中的性能监控
 */
export function monitorWebViewPerformance() {
  if (!window.performance || !window.performance.mark) {
    return;
  }
  
  const marks = {
    'webview-init': performance.now(),
    'dom-ready': null,
    'load-complete': null
  };
  
  // DOM准备完成
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      marks['dom-ready'] = performance.now();
      performance.mark('webview-dom-ready');
    });
  } else {
    marks['dom-ready'] = performance.now();
    performance.mark('webview-dom-ready');
  }
  
  // 页面加载完成
  if (document.readyState === 'complete') {
    marks['load-complete'] = performance.now();
    performance.mark('webview-load-complete');
  } else {
    window.addEventListener('load', () => {
      marks['load-complete'] = performance.now();
      performance.mark('webview-load-complete');
    });
  }
  
  return marks;
}

/**
 * WebView中的网络状态检测
 */
export function getNetworkInfo() {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  
  return {
    online: navigator.onLine,
    effectiveType: connection?.effectiveType || 'unknown',
    downlink: connection?.downlink || 0,
    rtt: connection?.rtt || 0,
    saveData: connection?.saveData || false
  };
}

/**
 * 初始化WebView环境
 */
export function initWebViewEnvironment() {
  const webViewInfo = getWebViewInfo();
  
  // 在开发环境中输出WebView信息
  if (process.env.NODE_ENV === 'development') {
    console.group('[WebView Environment]');
    console.log('WebView Info:', webViewInfo);
    console.log('Network Info:', getNetworkInfo());
    console.groupEnd();
  }
  
  // 开始性能监控
  monitorWebViewPerformance();
  
  // 设置全局错误处理
  window.addEventListener('error', (event) => {
    handleWebViewError(event.error, 'global-error');
  });
  
  window.addEventListener('unhandledrejection', (event) => {
    handleWebViewError(event.reason, 'unhandled-promise');
  });
  
  return webViewInfo;
}