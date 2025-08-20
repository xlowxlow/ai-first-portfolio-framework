import puppeteer, { Browser, Page } from 'puppeteer';
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { performance } from 'perf_hooks';

/**
 * AI Crawler Behavior Simulator
 * Simulates how different AI systems crawl and interpret websites
 */

export interface CrawlerConfig {
  userAgent: string;
  timeout: number;
  maxDepth: number;
  respectRobots: boolean;
  followRedirects: boolean;
  processJavaScript: boolean;
  extractionPatterns: string[];
  prioritySelectors: string[];
}

export interface CrawlResult {
  crawlerName: string;
  url: string;
  timestamp: string;
  responseTime: number;
  statusCode: number;
  contentLength: number;
  extractedContent: ExtractedContent;
  aiVisibilityScore: number;
  issues: CrawlIssue[];
  recommendations: string[];
}

export interface ExtractedContent {
  title: string;
  metaDescription: string;
  headings: { level: number; text: string }[];
  paragraphs: string[];
  links: { url: string; text: string; type: 'internal' | 'external' }[];
  images: { src: string; alt: string; title?: string }[];
  structuredData: any[];
  llmsTxt?: string;
  robotsTxt?: string;
  sitemap?: string[];
}

export interface CrawlIssue {
  type: 'error' | 'warning' | 'info';
  category: 'content' | 'structure' | 'performance' | 'seo' | 'accessibility';
  message: string;
  selector?: string;
  impact: 'high' | 'medium' | 'low';
}

export interface SimulationReport {
  url: string;
  timestamp: string;
  crawlerResults: CrawlResult[];
  overallScore: number;
  categoryScores: Record<string, number>;
  commonIssues: CrawlIssue[];
  recommendations: string[];
  summary: string;
}

export class AICrawlerSimulator {
  private browser: Browser | null = null;
  private crawlerConfigs: Record<string, CrawlerConfig>;

  constructor() {
    this.crawlerConfigs = this.initializeCrawlerConfigs();
  }

  /**
   * Initialize crawler configurations for different AI systems
   */
  private initializeCrawlerConfigs(): Record<string, CrawlerConfig> {
    return {
      'OpenAI-GPT': {
        userAgent: 'ChatGPT-User/1.0 (+https://openai.com/chatgpt)',
        timeout: 30000,
        maxDepth: 3,
        respectRobots: true,
        followRedirects: true,
        processJavaScript: true,
        extractionPatterns: [
          'article', 'main', '.content', '.post', '.article-content',
          'h1', 'h2', 'h3', 'p', 'blockquote', 'code', 'pre'
        ],
        prioritySelectors: [
          'title', 'meta[name="description"]', 'h1', 'main', 'article',
          'script[type="application/ld+json"]', '[role="main"]'
        ]
      },
      'Google-Gemini': {
        userAgent: 'Gemini-Bot/1.0 (Google AI)',
        timeout: 25000,
        maxDepth: 5,
        respectRobots: true,
        followRedirects: true,
        processJavaScript: true,
        extractionPatterns: [
          'header', 'nav', 'main', 'article', 'section', 'aside', 'footer',
          'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'ul', 'ol', 'dl'
        ],
        prioritySelectors: [
          'title', 'meta', 'link', 'script[type="application/ld+json"]',
          '[itemscope]', '[data-*]', 'time', 'address'
        ]
      },
      'Claude': {
        userAgent: 'Claude-Web/1.0 (Anthropic AI Assistant)',
        timeout: 20000,
        maxDepth: 4,
        respectRobots: true,
        followRedirects: true,
        processJavaScript: false, // More conservative approach
        extractionPatterns: [
          'h1', 'h2', 'h3', 'p', 'article', 'main', '.content',
          'blockquote', 'code', 'pre', 'table', 'dl', 'summary'
        ],
        prioritySelectors: [
          'title', 'meta[name="description"]', 'meta[property^="og:"]',
          'link[rel="canonical"]', 'script[type="application/ld+json"]',
          '[role="main"]', '[role="article"]'
        ]
      }
    };
  }

  /**
   * Initialize browser instance
   */
  async initialize(headless = true): Promise<void> {
    this.browser = await puppeteer.launch({
      headless,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security'
      ]
    });
  }

  /**
   * Close browser instance
   */
  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  /**
   * Simulate AI crawler behavior for a specific URL
   */
  async simulateCrawler(
    crawlerName: string, 
    url: string, 
    options: { includeSubpages?: boolean; saveScreenshots?: boolean } = {}
  ): Promise<CrawlResult> {
    const config = this.crawlerConfigs[crawlerName];
    if (!config) {
      throw new Error(`Unknown crawler: ${crawlerName}`);
    }

    if (!this.browser) {
      await this.initialize();
    }

    const page = await this.browser!.newPage();
    const startTime = performance.now();
    
    try {
      // Set user agent
      await page.setUserAgent(config.userAgent);
      
      // Set viewport to simulate different devices
      await page.setViewport({ width: 1920, height: 1080 });
      
      // Configure JavaScript execution based on crawler behavior
      await page.setJavaScriptEnabled(config.processJavaScript);
      
      // Navigate to page with timeout
      const response = await page.goto(url, {
        waitUntil: config.processJavaScript ? 'networkidle0' : 'domcontentloaded',
        timeout: config.timeout
      });
      
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      // Extract content based on crawler's behavior
      const extractedContent = await this.extractContent(page, config);
      
      // Analyze AI visibility
      const { score, issues } = await this.analyzeAIVisibility(page, extractedContent, config);
      
      // Generate recommendations
      const recommendations = this.generateRecommendations(issues, crawlerName);
      
      // Save screenshot if requested
      if (options.saveScreenshots) {
        await this.saveScreenshot(page, crawlerName, url);
      }
      
      return {
        crawlerName,
        url,
        timestamp: new Date().toISOString(),
        responseTime,
        statusCode: response?.status() || 0,
        contentLength: (await response?.text())?.length || 0,
        extractedContent,
        aiVisibilityScore: score,
        issues,
        recommendations
      };
      
    } finally {
      await page.close();
    }
  }

  /**
   * Extract content from page based on crawler configuration
   */
  private async extractContent(page: Page, config: CrawlerConfig): Promise<ExtractedContent> {
    return await page.evaluate((patterns, prioritySelectors) => {
      // Extract title and meta
      const title = document.title || '';
      const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
      
      // Extract headings
      const headings: { level: number; text: string }[] = [];
      for (let i = 1; i <= 6; i++) {
        const elements = document.querySelectorAll(`h${i}`);
        elements.forEach(el => {
          headings.push({
            level: i,
            text: el.textContent?.trim() || ''
          });
        });
      }
      
      // Extract paragraphs
      const paragraphs = Array.from(document.querySelectorAll('p'))
        .map(p => p.textContent?.trim() || '')
        .filter(text => text.length > 20);
      
      // Extract links
      const links = Array.from(document.querySelectorAll('a[href]'))
        .map(link => {
          const href = link.getAttribute('href') || '';
          const text = link.textContent?.trim() || '';
          const isExternal = href.startsWith('http') && !href.includes(window.location.hostname);
          
          return {
            url: href,
            text,
            type: isExternal ? 'external' as const : 'internal' as const
          };
        })
        .filter(link => link.text.length > 0);
      
      // Extract images
      const images = Array.from(document.querySelectorAll('img'))
        .map(img => ({
          src: img.src || '',
          alt: img.alt || '',
          title: img.title
        }))
        .filter(img => img.src.length > 0);
      
      // Extract structured data
      const structuredData: any[] = [];
      const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
      jsonLdScripts.forEach(script => {
        try {
          const data = JSON.parse(script.textContent || '{}');
          structuredData.push(data);
        } catch (e) {
          // Invalid JSON, skip
        }
      });
      
      return {
        title,
        metaDescription,
        headings,
        paragraphs,
        links,
        images,
        structuredData
      };
    }, config.extractionPatterns, config.prioritySelectors);
  }

  /**
   * Fetch additional AI-specific files
   */
  private async fetchAIFiles(baseUrl: string): Promise<{ llmsTxt?: string; robotsTxt?: string; sitemap?: string[] }> {
    const files: { llmsTxt?: string; robotsTxt?: string; sitemap?: string[] } = {};
    
    try {
      // Try to fetch llms.txt
      const llmsResponse = await fetch(`${baseUrl}/llms.txt`);
      if (llmsResponse.ok) {
        files.llmsTxt = await llmsResponse.text();
      }
    } catch (e) {
      // File doesn't exist or network error
    }
    
    try {
      // Try to fetch robots.txt
      const robotsResponse = await fetch(`${baseUrl}/robots.txt`);
      if (robotsResponse.ok) {
        files.robotsTxt = await robotsResponse.text();
      }
    } catch (e) {
      // File doesn't exist or network error
    }
    
    try {
      // Try to fetch sitemap.xml
      const sitemapResponse = await fetch(`${baseUrl}/sitemap.xml`);
      if (sitemapResponse.ok) {
        const sitemapText = await sitemapResponse.text();
        // Simple XML parsing to extract URLs
        const urlMatches = sitemapText.match(/<loc>(.*?)<\/loc>/g);
        if (urlMatches) {
          files.sitemap = urlMatches.map(match => 
            match.replace(/<\/?loc>/g, '')
          );
        }
      }
    } catch (e) {
      // File doesn't exist or network error
    }
    
    return files;
  }

  /**
   * Analyze AI visibility and generate score
   */
  private async analyzeAIVisibility(
    page: Page, 
    content: ExtractedContent, 
    config: CrawlerConfig
  ): Promise<{ score: number; issues: CrawlIssue[] }> {
    const issues: CrawlIssue[] = [];
    let score = 100;
    
    // Check title
    if (!content.title || content.title.length < 10) {
      issues.push({
        type: 'error',
        category: 'seo',
        message: 'Title is missing or too short',
        impact: 'high'
      });
      score -= 15;
    }
    
    // Check meta description
    if (!content.metaDescription || content.metaDescription.length < 50) {
      issues.push({
        type: 'warning',
        category: 'seo',
        message: 'Meta description is missing or too short',
        impact: 'medium'
      });
      score -= 10;
    }
    
    // Check heading structure
    const h1Count = content.headings.filter(h => h.level === 1).length;
    if (h1Count === 0) {
      issues.push({
        type: 'error',
        category: 'structure',
        message: 'No H1 heading found',
        impact: 'high'
      });
      score -= 15;
    } else if (h1Count > 1) {
      issues.push({
        type: 'warning',
        category: 'structure',
        message: 'Multiple H1 headings found',
        impact: 'medium'
      });
      score -= 5;
    }
    
    // Check content amount
    if (content.paragraphs.length < 3) {
      issues.push({
        type: 'warning',
        category: 'content',
        message: 'Insufficient content for AI understanding',
        impact: 'medium'
      });
      score -= 10;
    }
    
    // Check structured data
    if (content.structuredData.length === 0) {
      issues.push({
        type: 'warning',
        category: 'seo',
        message: 'No structured data found',
        impact: 'medium'
      });
      score -= 8;
    }
    
    // Check images alt text
    const imagesWithoutAlt = content.images.filter(img => !img.alt || img.alt.length === 0);
    if (imagesWithoutAlt.length > 0) {
      issues.push({
        type: 'warning',
        category: 'accessibility',
        message: `${imagesWithoutAlt.length} images missing alt text`,
        impact: 'medium'
      });
      score -= Math.min(10, imagesWithoutAlt.length * 2);
    }
    
    // Performance analysis
    const performanceMetrics = await page.metrics();
    if (performanceMetrics.TaskDuration && performanceMetrics.TaskDuration > 3000) {
      issues.push({
        type: 'warning',
        category: 'performance',
        message: 'Page load time is slow',
        impact: 'medium'
      });
      score -= 5;
    }
    
    return { score: Math.max(0, score), issues };
  }

  /**
   * Generate crawler-specific recommendations
   */
  private generateRecommendations(issues: CrawlIssue[], crawlerName: string): string[] {
    const recommendations: string[] = [];
    
    // General recommendations
    const errorIssues = issues.filter(i => i.type === 'error');
    const warningIssues = issues.filter(i => i.type === 'warning');
    
    if (errorIssues.length > 0) {
      recommendations.push('🚨 Fix critical errors to improve AI visibility');
    }
    
    if (warningIssues.length > 0) {
      recommendations.push('⚠️ Address warnings to optimize AI understanding');
    }
    
    // Crawler-specific recommendations
    switch (crawlerName) {
      case 'OpenAI-GPT':
        recommendations.push('💡 Ensure clear content structure with proper headings');
        recommendations.push('📝 Add detailed descriptions in natural language');
        if (issues.some(i => i.category === 'content')) {
          recommendations.push('📚 Increase content depth and context for better GPT understanding');
        }
        break;
        
      case 'Google-Gemini':
        recommendations.push('🔍 Optimize structured data for better search integration');
        recommendations.push('🌐 Ensure proper semantic HTML usage');
        if (issues.some(i => i.category === 'seo')) {
          recommendations.push('📊 Add comprehensive metadata and schema markup');
        }
        break;
        
      case 'Claude':
        recommendations.push('📖 Focus on clear, readable content structure');
        recommendations.push('🎯 Use semantic HTML elements appropriately');
        if (issues.some(i => i.category === 'structure')) {
          recommendations.push('🏗️ Improve document outline with proper heading hierarchy');
        }
        break;
    }
    
    return recommendations;
  }

  /**
   * Save screenshot for visual analysis
   */
  private async saveScreenshot(page: Page, crawlerName: string, url: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const urlHash = Buffer.from(url).toString('base64').slice(0, 10);
    const filename = `screenshot-${crawlerName}-${urlHash}-${timestamp}.png`;
    
    const screenshotsDir = path.join(process.cwd(), 'crawler-reports', 'screenshots');
    await fs.ensureDir(screenshotsDir);
    
    const filepath = path.join(screenshotsDir, filename);
    await page.screenshot({ path: filepath, fullPage: true });
  }

  /**
   * Run simulation for all configured crawlers
   */
  async simulateAllCrawlers(
    url: string, 
    options: { includeSubpages?: boolean; saveScreenshots?: boolean } = {}
  ): Promise<SimulationReport> {
    console.log(chalk.blue('🤖 Starting AI Crawler Simulation...'));
    console.log(chalk.gray(`Target URL: ${url}\n`));
    
    const crawlerResults: CrawlResult[] = [];
    
    // Run each crawler simulation
    for (const [crawlerName] of Object.entries(this.crawlerConfigs)) {
      console.log(chalk.yellow(`🔍 Simulating ${crawlerName} crawler...`));
      
      try {
        const result = await this.simulateCrawler(crawlerName, url, options);
        crawlerResults.push(result);
        
        console.log(chalk.green(`✅ ${crawlerName} completed (Score: ${result.aiVisibilityScore}%)`));
      } catch (error) {
        console.log(chalk.red(`❌ ${crawlerName} failed: ${error}`));
        
        // Add failed result
        crawlerResults.push({
          crawlerName,
          url,
          timestamp: new Date().toISOString(),
          responseTime: 0,
          statusCode: 0,
          contentLength: 0,
          extractedContent: {
            title: '',
            metaDescription: '',
            headings: [],
            paragraphs: [],
            links: [],
            images: [],
            structuredData: []
          },
          aiVisibilityScore: 0,
          issues: [{ type: 'error', category: 'performance', message: `Crawler failed: ${error}`, impact: 'high' }],
          recommendations: ['Fix website accessibility issues']
        });
      }
    }
    
    // Generate overall analysis
    const overallScore = crawlerResults.length > 0 
      ? Math.round(crawlerResults.reduce((sum, r) => sum + r.aiVisibilityScore, 0) / crawlerResults.length)
      : 0;
    
    const categoryScores = this.calculateCategoryScores(crawlerResults);
    const commonIssues = this.findCommonIssues(crawlerResults);
    const recommendations = this.generateOverallRecommendations(crawlerResults);
    const summary = this.generateSummary(overallScore, crawlerResults);
    
    return {
      url,
      timestamp: new Date().toISOString(),
      crawlerResults,
      overallScore,
      categoryScores,
      commonIssues,
      recommendations,
      summary
    };
  }

  /**
   * Calculate category-wise scores
   */
  private calculateCategoryScores(results: CrawlResult[]): Record<string, number> {
    const categories = ['content', 'structure', 'performance', 'seo', 'accessibility'];
    const categoryScores: Record<string, number> = {};
    
    categories.forEach(category => {
      let totalScore = 0;
      let count = 0;
      
      results.forEach(result => {
        const categoryIssues = result.issues.filter(issue => issue.category === category);
        let categoryScore = 100;
        
        categoryIssues.forEach(issue => {
          const penalty = issue.impact === 'high' ? 15 : issue.impact === 'medium' ? 10 : 5;
          categoryScore -= penalty;
        });
        
        totalScore += Math.max(0, categoryScore);
        count++;
      });
      
      categoryScores[category] = count > 0 ? Math.round(totalScore / count) : 0;
    });
    
    return categoryScores;
  }

  /**
   * Find issues that appear across multiple crawlers
   */
  private findCommonIssues(results: CrawlResult[]): CrawlIssue[] {
    const issueMap = new Map<string, { issue: CrawlIssue; count: number }>();
    
    results.forEach(result => {
      result.issues.forEach(issue => {
        const key = `${issue.category}:${issue.message}`;
        if (issueMap.has(key)) {
          issueMap.get(key)!.count++;
        } else {
          issueMap.set(key, { issue, count: 1 });
        }
      });
    });
    
    // Return issues that appear in at least 2 crawlers
    return Array.from(issueMap.values())
      .filter(item => item.count >= 2)
      .map(item => item.issue)
      .sort((a, b) => {
        const impactOrder = { 'high': 3, 'medium': 2, 'low': 1 };
        return impactOrder[b.impact] - impactOrder[a.impact];
      });
  }

  /**
   * Generate overall recommendations
   */
  private generateOverallRecommendations(results: CrawlResult[]): string[] {
    const recommendations = new Set<string>();
    
    // Add crawler-specific recommendations
    results.forEach(result => {
      result.recommendations.forEach(rec => recommendations.add(rec));
    });
    
    // Add overall analysis
    const avgScore = results.reduce((sum, r) => sum + r.aiVisibilityScore, 0) / results.length;
    
    if (avgScore < 60) {
      recommendations.add('🚨 Critical: Your website needs significant AI optimization improvements');
    } else if (avgScore < 80) {
      recommendations.add('⚠️ Your website has good AI visibility but can be improved');
    } else {
      recommendations.add('✅ Excellent! Your website is well-optimized for AI crawlers');
    }
    
    return Array.from(recommendations);
  }

  /**
   * Generate summary text
   */
  private generateSummary(overallScore: number, results: CrawlResult[]): string {
    const successfulCrawlers = results.filter(r => r.aiVisibilityScore > 0).length;
    const totalCrawlers = results.length;
    
    let summary = `AI Crawler Simulation completed for ${totalCrawlers} crawlers. `;
    summary += `${successfulCrawlers} crawlers successfully analyzed the website. `;
    summary += `Overall AI visibility score: ${overallScore}%. `;
    
    if (overallScore >= 80) {
      summary += 'Your website is well-optimized for AI discovery.';
    } else if (overallScore >= 60) {
      summary += 'Your website has good AI visibility with room for improvement.';
    } else {
      summary += 'Your website needs significant optimization for better AI visibility.';
    }
    
    return summary;
  }
}