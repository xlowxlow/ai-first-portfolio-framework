// Performance optimization utilities for the Developer Portfolio template

/**
 * Lazy loading utility for images and components
 */
export class LazyLoader {
  private observer: IntersectionObserver;
  private imageObserver: IntersectionObserver;

  constructor() {
    // Initialize Intersection Observer for lazy loading
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.loadElement(entry.target as HTMLElement);
            this.observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.01
      }
    );

    // Separate observer for images with different settings
    this.imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.loadImage(entry.target as HTMLImageElement);
            this.imageObserver.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '200px 0px',
        threshold: 0.01
      }
    );

    this.init();
  }

  private init() {
    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupLazyElements());
    } else {
      this.setupLazyElements();
    }
  }

  private setupLazyElements() {
    // Setup lazy loading for images
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach((img) => this.imageObserver.observe(img));

    // Setup lazy loading for other elements
    const lazyElements = document.querySelectorAll('[data-lazy]');
    lazyElements.forEach((element) => this.observer.observe(element));
  }

  private loadImage(img: HTMLImageElement) {
    const src = img.dataset.src;
    const srcset = img.dataset.srcset;
    
    if (src) {
      img.src = src;
      img.removeAttribute('data-src');
    }
    
    if (srcset) {
      img.srcset = srcset;
      img.removeAttribute('data-srcset');
    }

    img.classList.remove('lazy');
    img.classList.add('loaded');
  }

  private loadElement(element: HTMLElement) {
    // Load lazy content
    const content = element.dataset.lazyContent;
    if (content) {
      element.innerHTML = content;
      element.removeAttribute('data-lazy-content');
    }

    // Load lazy scripts
    const script = element.dataset.lazyScript;
    if (script) {
      const scriptElement = document.createElement('script');
      scriptElement.src = script;
      scriptElement.async = true;
      document.head.appendChild(scriptElement);
      element.removeAttribute('data-lazy-script');
    }

    element.classList.remove('lazy');
    element.classList.add('loaded');
  }

  public observe(element: HTMLElement) {
    if (element.tagName === 'IMG') {
      this.imageObserver.observe(element);
    } else {
      this.observer.observe(element);
    }
  }

  public disconnect() {
    this.observer.disconnect();
    this.imageObserver.disconnect();
  }
}

/**
 * Image optimization utilities
 */
export class ImageOptimizer {
  /**
   * Generate responsive image srcset
   */
  static generateSrcSet(baseUrl: string, sizes: number[] = [320, 640, 960, 1280, 1920]): string {
    return sizes
      .map(size => `${baseUrl}?w=${size}&q=75 ${size}w`)
      .join(', ');
  }

  /**
   * Get optimal image format based on browser support
   */
  static getOptimalFormat(): 'webp' | 'avif' | 'jpg' {
    if (this.supportsAvif()) return 'avif';
    if (this.supportsWebP()) return 'webp';
    return 'jpg';
  }

  /**
   * Check WebP support
   */
  static supportsWebP(): boolean {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').startsWith('data:image/webp');
  }

  /**
   * Check AVIF support
   */
  static supportsAvif(): boolean {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    try {
      return canvas.toDataURL('image/avif').startsWith('data:image/avif');
    } catch {
      return false;
    }
  }

  /**
   * Preload critical images
   */
  static preloadCriticalImages(urls: string[]) {
    urls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = url;
      document.head.appendChild(link);
    });
  }
}

/**
 * Code splitting and dynamic imports
 */
export class CodeSplitter {
  private static loadedModules = new Set<string>();
  private static loadingModules = new Map<string, Promise<any>>();

  /**
   * Dynamically import a module with caching
   */
  static async importModule(modulePath: string): Promise<any> {
    if (this.loadedModules.has(modulePath)) {
      return Promise.resolve();
    }

    if (this.loadingModules.has(modulePath)) {
      return this.loadingModules.get(modulePath);
    }

    const importPromise = import(modulePath)
      .then(module => {
        this.loadedModules.add(modulePath);
        this.loadingModules.delete(modulePath);
        return module;
      })
      .catch(error => {
        this.loadingModules.delete(modulePath);
        throw error;
      });

    this.loadingModules.set(modulePath, importPromise);
    return importPromise;
  }

  /**
   * Load component when needed
   */
  static async loadComponent(
    componentName: string,
    container: HTMLElement,
    props: Record<string, any> = {}
  ): Promise<void> {
    try {
      const module = await this.importModule(`/components/${componentName}.js`);
      const ComponentClass = module.default || module[componentName];
      
      if (ComponentClass) {
        const component = new ComponentClass(props);
        component.render(container);
      }
    } catch (error) {
      console.error(`Failed to load component ${componentName}:`, error);
    }
  }
}

/**
 * Resource hints and preloading
 */
export class ResourceOptimizer {
  /**
   * Add DNS prefetch for external domains
   */
  static prefetchDNS(domains: string[]) {
    domains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = `//${domain}`;
      document.head.appendChild(link);
    });
  }

  /**
   * Preload critical resources
   */
  static preloadResources(resources: Array<{url: string, as: string, type?: string}>) {
    resources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.url;
      link.as = resource.as;
      if (resource.type) {
        link.type = resource.type;
      }
      document.head.appendChild(link);
    });
  }

  /**
   * Prefetch resources for next navigation
   */
  static prefetchNextPage(urls: string[]) {
    urls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      document.head.appendChild(link);
    });
  }

  /**
   * Preconnect to external origins
   */
  static preconnect(origins: string[]) {
    origins.forEach(origin => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = origin;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }
}

/**
 * Performance monitoring and metrics
 */
export class PerformanceMonitor {
  private static metrics: Record<string, number> = {};

  /**
   * Mark the start of a performance measurement
   */
  static markStart(name: string) {
    performance.mark(`${name}-start`);
  }

  /**
   * Mark the end of a performance measurement
   */
  static markEnd(name: string) {
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    
    const measure = performance.getEntriesByName(name)[0];
    this.metrics[name] = measure.duration;
    
    return measure.duration;
  }

  /**
   * Get Core Web Vitals
   */
  static async getCoreWebVitals(): Promise<{
    LCP?: number;
    FID?: number;
    CLS?: number;
    FCP?: number;
    TTFB?: number;
  }> {
    const vitals: any = {};

    try {
      // Import web-vitals library dynamically
      const webVitals = await import('web-vitals');
      
      return new Promise((resolve) => {
        let completed = 0;
        const total = 5;

        const checkComplete = () => {
          completed++;
          if (completed === total) {
            resolve(vitals);
          }
        };

        webVitals.getLCP((metric) => {
          vitals.LCP = metric.value;
          checkComplete();
        });

        webVitals.getFID((metric) => {
          vitals.FID = metric.value;
          checkComplete();
        });

        webVitals.getCLS((metric) => {
          vitals.CLS = metric.value;
          checkComplete();
        });

        webVitals.getFCP((metric) => {
          vitals.FCP = metric.value;
          checkComplete();
        });

        webVitals.getTTFB((metric) => {
          vitals.TTFB = metric.value;
          checkComplete();
        });

        // Timeout after 10 seconds
        setTimeout(() => resolve(vitals), 10000);
      });
    } catch (error) {
      console.warn('Failed to load web-vitals library:', error);
      return vitals;
    }
  }

  /**
   * Report performance metrics
   */
  static reportMetrics(endpoint?: string) {
    const metrics = {
      ...this.metrics,
      navigation: this.getNavigationTiming(),
      memory: this.getMemoryInfo()
    };

    if (endpoint) {
      // Send to analytics endpoint
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metrics)
      }).catch(error => console.warn('Failed to report metrics:', error));
    }

    return metrics;
  }

  /**
   * Get navigation timing metrics
   */
  private static getNavigationTiming() {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (!navigation) return {};

    return {
      dns: navigation.domainLookupEnd - navigation.domainLookupStart,
      tcp: navigation.connectEnd - navigation.connectStart,
      tls: navigation.requestStart - navigation.secureConnectionStart,
      ttfb: navigation.responseStart - navigation.requestStart,
      download: navigation.responseEnd - navigation.responseStart,
      domInteractive: navigation.domInteractive - navigation.navigationStart,
      domComplete: navigation.domComplete - navigation.navigationStart,
      loadComplete: navigation.loadEventEnd - navigation.navigationStart
    };
  }

  /**
   * Get memory information (Chrome only)
   */
  private static getMemoryInfo() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit
      };
    }
    return {};
  }
}

/**
 * Service Worker utilities for caching
 */
export class ServiceWorkerManager {
  /**
   * Register service worker
   */
  static async register(swPath: string = '/sw.js'): Promise<ServiceWorkerRegistration | null> {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Worker not supported');
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.register(swPath);
      console.log('Service Worker registered:', registration);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }

  /**
   * Update service worker
   */
  static async update(): Promise<void> {
    if (!('serviceWorker' in navigator)) return;

    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.update();
    }
  }

  /**
   * Show update available notification
   */
  static onUpdateAvailable(callback: () => void) {
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker.addEventListener('controllerchange', callback);
  }
}

// Initialize performance optimizations
export function initializePerformanceOptimizations() {
  // Initialize lazy loading
  new LazyLoader();

  // Preconnect to external services
  ResourceOptimizer.preconnect([
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://cdn.jsdelivr.net'
  ]);

  // DNS prefetch for common external domains
  ResourceOptimizer.prefetchDNS([
    'github.com',
    'linkedin.com',
    'twitter.com',
    'google-analytics.com'
  ]);

  // Register service worker
  ServiceWorkerManager.register();

  // Start performance monitoring
  PerformanceMonitor.markStart('app-init');
  
  // Mark app initialization complete after DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    PerformanceMonitor.markEnd('app-init');
  });

  // Report Core Web Vitals after page load
  window.addEventListener('load', async () => {
    setTimeout(async () => {
      const vitals = await PerformanceMonitor.getCoreWebVitals();
      console.log('Core Web Vitals:', vitals);
    }, 1000);
  });
}

// Auto-initialize if this script is loaded directly
if (typeof window !== 'undefined') {
  initializePerformanceOptimizations();
}