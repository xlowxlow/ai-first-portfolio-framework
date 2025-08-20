import { AICrawlerSimulator, ExtractedContent, CrawlResult, CrawlIssue } from './ai-crawler-simulator';
import { CrawlerReportGenerator } from './crawler-report-generator';
import puppeteer from 'puppeteer';

// Mock puppeteer for testing
jest.mock('puppeteer', () => ({
  launch: jest.fn(),
}));

// Mock fs-extra for testing
jest.mock('fs-extra', () => ({
  ensureDir: jest.fn(),
  writeFile: jest.fn(),
  writeJson: jest.fn(),
  readdir: jest.fn(),
  pathExists: jest.fn(),
  stat: jest.fn(),
}));

describe('AICrawlerSimulator', () => {
  let simulator: AICrawlerSimulator;
  let mockBrowser: any;
  let mockPage: any;

  beforeEach(() => {
    // Setup mock browser and page
    mockPage = {
      setUserAgent: jest.fn(),
      setViewport: jest.fn(),
      setJavaScriptEnabled: jest.fn(),
      goto: jest.fn(),
      content: jest.fn(),
      evaluate: jest.fn(),
      metrics: jest.fn(),
      screenshot: jest.fn(),
      close: jest.fn(),
    };

    mockBrowser = {
      newPage: jest.fn().mockResolvedValue(mockPage),
      close: jest.fn(),
    };

    (puppeteer.launch as jest.Mock).mockResolvedValue(mockBrowser);
    
    simulator = new AICrawlerSimulator();
  });

  afterEach(async () => {
    if (simulator) {
      await simulator.close();
    }
  });

  describe('initialization', () => {
    test('should initialize browser instance', async () => {
      await simulator.initialize();
      
      expect(puppeteer.launch).toHaveBeenCalledWith({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-web-security'
        ]
      });
    });

    test('should close browser instance', async () => {
      await simulator.initialize();
      await simulator.close();
      
      expect(mockBrowser.close).toHaveBeenCalled();
    });
  });

  describe('crawler configurations', () => {
    test('should have OpenAI GPT crawler config', () => {
      const config = (simulator as any).crawlerConfigs['OpenAI-GPT'];
      
      expect(config).toBeDefined();
      expect(config.userAgent).toContain('ChatGPT-User');
      expect(config.processJavaScript).toBe(true);
      expect(config.respectRobots).toBe(true);
    });

    test('should have Google Gemini crawler config', () => {
      const config = (simulator as any).crawlerConfigs['Google-Gemini'];
      
      expect(config).toBeDefined();
      expect(config.userAgent).toContain('Gemini-Bot');
      expect(config.processJavaScript).toBe(true);
      expect(config.maxDepth).toBe(5);
    });

    test('should have Claude crawler config', () => {
      const config = (simulator as any).crawlerConfigs['Claude'];
      
      expect(config).toBeDefined();
      expect(config.userAgent).toContain('Claude-Web');
      expect(config.processJavaScript).toBe(false);
      expect(config.maxDepth).toBe(4);
    });
  });

  describe('content extraction', () => {
    test('should extract basic page content', async () => {
      const mockContent = {
        title: 'Test Page',
        metaDescription: 'This is a test page',
        headings: [
          { level: 1, text: 'Main Heading' },
          { level: 2, text: 'Sub Heading' }
        ],
        paragraphs: ['First paragraph content', 'Second paragraph content'],
        links: [
          { url: 'https://external.com', text: 'External Link', type: 'external' },
          { url: '/internal', text: 'Internal Link', type: 'internal' }
        ],
        images: [
          { src: 'image1.jpg', alt: 'Description 1' },
          { src: 'image2.jpg', alt: 'Description 2' }
        ],
        structuredData: [
          { '@type': 'Person', name: 'John Doe' },
          { '@type': 'WebSite', name: 'Test Site' }
        ]
      };

      mockPage.evaluate.mockResolvedValue(mockContent);
      mockPage.goto.mockResolvedValue({ status: () => 200, text: () => 'page content' });
      mockPage.metrics.mockResolvedValue({ TaskDuration: 1000 });

      await simulator.initialize();
      const result = await simulator.simulateCrawler('OpenAI-GPT', 'https://test.com');

      expect(result.extractedContent.title).toBe('Test Page');
      expect(result.extractedContent.headings).toHaveLength(2);
      expect(result.extractedContent.structuredData).toHaveLength(2);
    });
  });

  describe('AI visibility analysis', () => {
    test('should score high for well-optimized content', async () => {
      const mockContent = {
        title: 'Comprehensive Portfolio - John Doe Developer',
        metaDescription: 'Experienced full-stack developer specializing in React, Node.js, and cloud architecture. View my projects and professional experience.',
        headings: [
          { level: 1, text: 'John Doe - Full Stack Developer' },
          { level: 2, text: 'About Me' },
          { level: 2, text: 'Projects' }
        ],
        paragraphs: [
          'I am a passionate full-stack developer with 5+ years of experience building scalable web applications.',
          'My expertise includes modern JavaScript frameworks, cloud deployment, and agile development practices.',
          'I enjoy solving complex problems and creating user-friendly applications that make a difference.'
        ],
        links: [
          { url: 'https://github.com/johndoe', text: 'GitHub Profile', type: 'external' },
          { url: '/projects', text: 'View Projects', type: 'internal' }
        ],
        images: [
          { src: 'profile.jpg', alt: 'John Doe professional headshot' },
          { src: 'project1.jpg', alt: 'Screenshot of e-commerce project' }
        ],
        structuredData: [
          { '@type': 'Person', name: 'John Doe', jobTitle: 'Full Stack Developer' }
        ]
      };

      mockPage.evaluate.mockResolvedValue(mockContent);
      mockPage.goto.mockResolvedValue({ status: () => 200, text: () => 'comprehensive content' });
      mockPage.metrics.mockResolvedValue({ TaskDuration: 1500 });

      await simulator.initialize();
      const result = await simulator.simulateCrawler('OpenAI-GPT', 'https://johndoe.dev');

      expect(result.aiVisibilityScore).toBeGreaterThan(85);
      expect(result.issues).toHaveLength(0);
    });

    test('should score low for poorly optimized content', async () => {
      const mockContent = {
        title: 'Home',
        metaDescription: '',
        headings: [],
        paragraphs: ['Hi'],
        links: [],
        images: [
          { src: 'img1.jpg', alt: '' },
          { src: 'img2.jpg', alt: '' }
        ],
        structuredData: []
      };

      mockPage.evaluate.mockResolvedValue(mockContent);
      mockPage.goto.mockResolvedValue({ status: () => 200, text: () => 'minimal content' });
      mockPage.metrics.mockResolvedValue({ TaskDuration: 2000 });

      await simulator.initialize();
      const result = await simulator.simulateCrawler('Claude', 'https://example.com');

      expect(result.aiVisibilityScore).toBeLessThan(50);
      expect(result.issues.length).toBeGreaterThan(3);
      
      // Should have issues for missing title, meta description, headings, etc.
      const issueTypes = result.issues.map(issue => issue.category);
      expect(issueTypes).toContain('seo');
      expect(issueTypes).toContain('structure');
      expect(issueTypes).toContain('accessibility');
    });
  });

  describe('error handling', () => {
    test('should handle network errors gracefully', async () => {
      mockPage.goto.mockRejectedValue(new Error('Network timeout'));

      await simulator.initialize();
      
      await expect(
        simulator.simulateCrawler('OpenAI-GPT', 'https://unreachable.com')
      ).rejects.toThrow('Network timeout');
    });

    test('should handle invalid crawler names', async () => {
      await simulator.initialize();
      
      await expect(
        simulator.simulateCrawler('InvalidCrawler', 'https://test.com')
      ).rejects.toThrow('Unknown crawler: InvalidCrawler');
    });
  });

  describe('full simulation', () => {
    test('should run simulation for all crawlers', async () => {
      const mockContent = {
        title: 'Test Site',
        metaDescription: 'A test website for AI crawler simulation',
        headings: [{ level: 1, text: 'Welcome' }],
        paragraphs: ['Welcome to our test website'],
        links: [],
        images: [],
        structuredData: []
      };

      mockPage.evaluate.mockResolvedValue(mockContent);
      mockPage.goto.mockResolvedValue({ status: () => 200, text: () => 'test content' });
      mockPage.metrics.mockResolvedValue({ TaskDuration: 1200 });

      await simulator.initialize();
      const report = await simulator.simulateAllCrawlers('https://test.com');

      expect(report.crawlerResults).toHaveLength(3); // OpenAI-GPT, Google-Gemini, Claude
      expect(report.overallScore).toBeGreaterThan(0);
      expect(report.categoryScores).toHaveProperty('seo');
      expect(report.categoryScores).toHaveProperty('structure');
      expect(report.categoryScores).toHaveProperty('content');
      expect(report.summary).toContain('AI Crawler Simulation completed');
    });
  });
});

describe('CrawlerReportGenerator', () => {
  const mockReport = {
    url: 'https://test.com',
    timestamp: '2024-01-15T10:30:00.000Z',
    overallScore: 75,
    categoryScores: {
      content: 80,
      structure: 70,
      performance: 85,
      seo: 65,
      accessibility: 75
    },
    crawlerResults: [
      {
        crawlerName: 'OpenAI-GPT',
        url: 'https://test.com',
        timestamp: '2024-01-15T10:30:00.000Z',
        responseTime: 1500,
        statusCode: 200,
        contentLength: 2048,
        aiVisibilityScore: 80,
        extractedContent: {
          title: 'Test Portfolio',
          metaDescription: 'A professional portfolio website',
          headings: [{ level: 1, text: 'Welcome' }],
          paragraphs: ['Content here'],
          links: [],
          images: [],
          structuredData: []
        },
        issues: [
          {
            type: 'warning' as const,
            category: 'seo' as const,
            message: 'Consider adding more structured data',
            impact: 'medium' as const
          }
        ],
        recommendations: ['Add Schema.org structured data']
      }
    ],
    commonIssues: [],
    recommendations: ['Improve SEO optimization'],
    summary: 'Good AI visibility with room for improvement'
  };

  describe('console report generation', () => {
    test('should generate console report without errors', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      CrawlerReportGenerator.generateConsoleReport(mockReport);
      
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('file report generation', () => {
    test('should generate HTML report', async () => {
      const fs = require('fs-extra');
      fs.ensureDir.mockResolvedValue(undefined);
      fs.writeFile.mockResolvedValue(undefined);

      const filePath = await CrawlerReportGenerator.generateHTMLReport(mockReport);
      
      expect(filePath).toContain('.html');
      expect(fs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('.html'),
        expect.stringContaining('<!DOCTYPE html>'),
        'utf8'
      );
    });

    test('should generate JSON report', async () => {
      const fs = require('fs-extra');
      fs.ensureDir.mockResolvedValue(undefined);
      fs.writeFile.mockResolvedValue(undefined);

      const filePath = await CrawlerReportGenerator.generateJSONReport(mockReport);
      
      expect(filePath).toContain('.json');
      expect(fs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('.json'),
        expect.stringContaining('"overallScore": 75'),
        'utf8'
      );
    });

    test('should generate CSV report', async () => {
      const fs = require('fs-extra');
      fs.ensureDir.mockResolvedValue(undefined);
      fs.writeFile.mockResolvedValue(undefined);

      const filePath = await CrawlerReportGenerator.generateCSVReport(mockReport);
      
      expect(filePath).toContain('.csv');
      expect(fs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('.csv'),
        expect.stringContaining('Crawler,Score,ResponseTime'),
        'utf8'
      );
    });
  });
});