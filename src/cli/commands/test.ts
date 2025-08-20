import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import puppeteer from 'puppeteer';
import { logger, withSpinner, createProgressReporter } from '../utils/logger';
import { findProjectRoot, loadProjectConfig } from '../utils/project';

export interface TestOptions {
  comprehensive?: boolean;
  output?: 'json' | 'table';
  saveReport?: boolean;
  timeout?: number;
  headless?: boolean;
}

export interface AIVisibilityTest {
  name: string;
  description: string;
  category: 'content' | 'structure' | 'seo' | 'performance' | 'accessibility';
  weight: number;
  test: (context: TestContext) => Promise<TestResult>;
}

export interface TestResult {
  passed: boolean;
  score: number;
  message: string;
  details?: any;
  suggestions?: string[];
}

export interface TestContext {
  url: string;
  page: any; // Puppeteer page
  html: string;
  projectRoot: string;
  config: any;
}

export interface AIVisibilityReport {
  url: string;
  timestamp: string;
  overallScore: number;
  categoryScores: Record<string, number>;
  tests: Array<{
    name: string;
    category: string;
    passed: boolean;
    score: number;
    message: string;
    suggestions?: string[];
  }>;
  recommendations: string[];
}

/**
 * Test AI visibility and optimization
 */
export async function testCommand(url?: string, options: TestOptions = {}) {
  try {
    logger.section('🤖 AI Visibility Testing');
    
    // Find project root and load configuration
    const projectRoot = await findProjectRoot();
    if (!projectRoot) {
      throw new Error('Not in a valid AI portfolio project directory');
    }

    const config = await loadProjectConfig(projectRoot);
    
    // Determine test URL
    const testUrl = url || config.siteUrl || 'http://localhost:3000';
    
    logger.info(`Testing URL: ${chalk.cyan(testUrl)}`);
    logger.info(`Running ${options.comprehensive ? 'comprehensive' : 'basic'} AI visibility tests...\n`);

    // Run tests
    const report = await runAIVisibilityTests(testUrl, projectRoot, config, options);
    
    // Display results
    if (options.output === 'json') {
      console.log(JSON.stringify(report, null, 2));
    } else {
      displayTestResults(report);
    }
    
    // Save report if requested
    if (options.saveReport) {
      await saveTestReport(projectRoot, report);
    }
    
    // Exit with appropriate code
    const exitCode = report.overallScore >= 80 ? 0 : 1;
    process.exit(exitCode);

  } catch (error: any) {
    logger.error('AI visibility testing failed:', error.message);
    process.exit(1);
  }
}

/**
 * Run comprehensive AI visibility tests
 */
async function runAIVisibilityTests(
  url: string,
  projectRoot: string,
  config: any,
  options: TestOptions
): Promise<AIVisibilityReport> {
  const browser = await puppeteer.launch({ 
    headless: options.headless !== false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Set realistic viewport and user agent
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent('Mozilla/5.0 (compatible; AI-Portfolio-Tester/1.0; +https://ai-portfolio.dev)');
    
    // Navigate to page with timeout
    await page.goto(url, { 
      waitUntil: 'networkidle0',
      timeout: options.timeout || 30000
    });
    
    // Get page content
    const html = await page.content();
    
    // Create test context
    const context: TestContext = {
      url,
      page,
      html,
      projectRoot,
      config
    };
    
    // Get test suite
    const tests = getTestSuite(options.comprehensive || false);
    
    // Run tests with progress tracking
    const progressReporter = createProgressReporter(tests.length);
    logger.startSpinner('Running AI visibility tests...');
    
    const testResults: Array<{
      name: string;
      category: string;
      passed: boolean;
      score: number;
      message: string;
      suggestions?: string[];
    }> = [];
    
    for (const test of tests) {
      try {
        const result = await test.test(context);
        testResults.push({
          name: test.name,
          category: test.category,
          passed: result.passed,
          score: result.score,
          message: result.message,
          suggestions: result.suggestions
        });
        progressReporter.increment(`Completed: ${test.name}`);
      } catch (error: any) {
        testResults.push({
          name: test.name,
          category: test.category,
          passed: false,
          score: 0,
          message: `Test failed: ${error.message}`,
          suggestions: ['Fix the underlying issue and rerun the test']
        });
        progressReporter.increment(`Failed: ${test.name}`);
      }
    }
    
    logger.stopSpinner('All tests completed');
    
    // Calculate scores
    const categoryScores = calculateCategoryScores(tests, testResults);
    const overallScore = calculateOverallScore(tests, testResults);
    
    // Generate recommendations
    const recommendations = generateRecommendations(testResults, overallScore);
    
    return {
      url,
      timestamp: new Date().toISOString(),
      overallScore,
      categoryScores,
      tests: testResults,
      recommendations
    };
    
  } finally {
    await browser.close();
  }
}

/**
 * Get test suite based on options
 */
function getTestSuite(comprehensive: boolean): AIVisibilityTest[] {
  const basicTests: AIVisibilityTest[] = [
    // Content Tests
    {
      name: 'LLMs.txt Presence',
      description: 'Check if llms.txt file exists and is accessible',
      category: 'content',
      weight: 10,
      test: async (context) => {
        try {
          const response = await context.page.goto(`${context.url}/llms.txt`);
          const status = response?.status() || 404;
          
          if (status === 200) {
            const content = await response?.text() || '';
            const hasContent = content.length > 100;
            
            return {
              passed: hasContent,
              score: hasContent ? 100 : 50,
              message: hasContent ? 'llms.txt found with good content' : 'llms.txt found but content is minimal',
              suggestions: hasContent ? [] : ['Add more detailed content to llms.txt']
            };
          }
          
          return {
            passed: false,
            score: 0,
            message: 'llms.txt not found or not accessible',
            suggestions: ['Create llms.txt file using: create-ai-portfolio generate llms']
          };
        } catch (error) {
          return {
            passed: false,
            score: 0,
            message: 'Failed to check llms.txt',
            suggestions: ['Ensure your website is running and accessible']
          };
        }
      }
    },
    
    // Structure Tests
    {
      name: 'Structured Data',
      description: 'Check for Schema.org structured data',
      category: 'structure',
      weight: 8,
      test: async (context) => {
        const scripts = await context.page.$$eval('script[type="application/ld+json"]', 
          elements => elements.map(el => el.textContent)
        );
        
        let validSchemas = 0;
        const schemaTypes = new Set();
        
        for (const script of scripts) {
          try {
            const data = JSON.parse(script || '{}');
            if (data['@type']) {
              validSchemas++;
              schemaTypes.add(data['@type']);
            }
          } catch (e) {
            // Invalid JSON, skip
          }
        }
        
        const passed = validSchemas > 0;
        const score = Math.min(100, validSchemas * 25);
        
        return {
          passed,
          score,
          message: passed 
            ? `Found ${validSchemas} structured data schemas: ${Array.from(schemaTypes).join(', ')}`
            : 'No valid structured data found',
          suggestions: passed ? [] : ['Add structured data using: create-ai-portfolio generate schema']
        };
      }
    },
    
    // SEO Tests
    {
      name: 'Meta Tags',
      description: 'Check for essential meta tags',
      category: 'seo',
      weight: 7,
      test: async (context) => {
        const metaTags = await context.page.evaluate(() => {
          const tags: Record<string, string> = {};
          
          // Essential meta tags
          const title = document.querySelector('title')?.textContent;
          const description = document.querySelector('meta[name="description"]')?.getAttribute('content');
          const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content');
          const ogDescription = document.querySelector('meta[property="og:description"]')?.getAttribute('content');
          const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute('content');
          const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href');
          
          return {
            title: title || '',
            description: description || '',
            ogTitle: ogTitle || '',
            ogDescription: ogDescription || '',
            ogImage: ogImage || '',
            canonical: canonical || ''
          };
        });
        
        const checks = [
          { key: 'title', name: 'Title tag', required: true },
          { key: 'description', name: 'Meta description', required: true },
          { key: 'ogTitle', name: 'OG title', required: false },
          { key: 'ogDescription', name: 'OG description', required: false },
          { key: 'ogImage', name: 'OG image', required: false },
          { key: 'canonical', name: 'Canonical URL', required: false }
        ];
        
        let score = 0;
        const missing = [];
        
        for (const check of checks) {
          const value = metaTags[check.key as keyof typeof metaTags];
          if (value && value.length > 0) {
            score += check.required ? 30 : 15;
          } else if (check.required) {
            missing.push(check.name);
          }
        }
        
        const passed = missing.length === 0;
        
        return {
          passed,
          score: Math.min(100, score),
          message: passed 
            ? 'All essential meta tags found'
            : `Missing required meta tags: ${missing.join(', ')}`,
          suggestions: missing.length > 0 
            ? ['Add missing meta tags to improve SEO and social sharing']
            : []
        };
      }
    },
    
    // Accessibility Tests
    {
      name: 'Semantic HTML',
      description: 'Check for semantic HTML structure',
      category: 'accessibility',
      weight: 6,
      test: async (context) => {
        const semanticElements = await context.page.evaluate(() => {
          const elements = [
            'main', 'header', 'footer', 'nav', 'article', 'section', 
            'aside', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
          ];
          
          const found = {};
          for (const element of elements) {
            found[element] = document.querySelectorAll(element).length;
          }
          
          return found;
        });
        
        const importantElements = ['main', 'header', 'h1'];
        const missing = importantElements.filter(el => !semanticElements[el]);
        
        const score = Math.max(0, 100 - (missing.length * 25));
        const passed = missing.length === 0;
        
        return {
          passed,
          score,
          message: passed 
            ? 'Good semantic HTML structure found'
            : `Missing important semantic elements: ${missing.join(', ')}`,
          suggestions: missing.length > 0 
            ? ['Use semantic HTML elements for better accessibility and AI understanding']
            : []
        };
      }
    }
  ];

  const comprehensiveTests: AIVisibilityTest[] = [
    ...basicTests,
    
    // Performance Tests
    {
      name: 'Page Load Performance',
      description: 'Check page load speed and Core Web Vitals',
      category: 'performance',
      weight: 8,
      test: async (context) => {
        const metrics = await context.page.metrics();
        const timing = await context.page.evaluate(() => {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          return {
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
            loadComplete: navigation.loadEventEnd - navigation.navigationStart,
            firstContentfulPaint: 0 // Would need more sophisticated measurement
          };
        });
        
        const loadTime = timing.loadComplete;
        let score = 100;
        
        if (loadTime > 5000) score = 20;
        else if (loadTime > 3000) score = 50;
        else if (loadTime > 2000) score = 70;
        else if (loadTime > 1000) score = 90;
        
        const passed = loadTime < 3000;
        
        return {
          passed,
          score,
          message: `Page loaded in ${loadTime}ms`,
          suggestions: passed ? [] : [
            'Optimize images and assets',
            'Enable compression',
            'Use a CDN',
            'Minimize JavaScript and CSS'
          ],
          details: { loadTime, metrics: timing }
        };
      }
    },
    
    // Content Quality Tests
    {
      name: 'Content Readability',
      description: 'Check content structure and readability',
      category: 'content',
      weight: 6,
      test: async (context) => {
        const contentMetrics = await context.page.evaluate(() => {
          const textContent = document.body.textContent || '';
          const words = textContent.split(/\s+/).length;
          const sentences = textContent.split(/[.!?]+/).length;
          const paragraphs = document.querySelectorAll('p').length;
          const headings = document.querySelectorAll('h1,h2,h3,h4,h5,h6').length;
          const links = document.querySelectorAll('a').length;
          
          return {
            wordCount: words,
            sentences,
            paragraphs,
            headings,
            links,
            avgWordsPerSentence: sentences > 0 ? words / sentences : 0
          };
        });
        
        let score = 100;
        const issues = [];
        
        if (contentMetrics.wordCount < 300) {
          score -= 30;
          issues.push('Content is too short (less than 300 words)');
        }
        
        if (contentMetrics.headings < 2) {
          score -= 20;
          issues.push('Need more headings for better structure');
        }
        
        if (contentMetrics.avgWordsPerSentence > 25) {
          score -= 15;
          issues.push('Sentences are too long (harder for AI to parse)');
        }
        
        const passed = issues.length === 0;
        
        return {
          passed,
          score: Math.max(0, score),
          message: passed ? 'Content has good readability' : `Content issues found: ${issues.join(', ')}`,
          suggestions: issues.length > 0 ? [
            'Add more descriptive content',
            'Use shorter sentences',
            'Add more headings to structure content'
          ] : [],
          details: contentMetrics
        };
      }
    },
    
    // AI-specific Tests
    {
      name: 'AI Crawler Friendliness',
      description: 'Check robots.txt and AI crawler policies',
      category: 'seo',
      weight: 5,
      test: async (context) => {
        try {
          const robotsResponse = await context.page.goto(`${context.url}/robots.txt`);
          const robotsContent = await robotsResponse?.text() || '';
          
          const hasAICrawlers = /ChatGPT|Claude|Perplexity|Bard/i.test(robotsContent);
          const allowsAI = !robotsContent.includes('Disallow: /') || robotsContent.includes('Allow: /');
          
          let score = 50; // Base score for having robots.txt
          if (hasAICrawlers) score += 30;
          if (allowsAI) score += 20;
          
          const passed = hasAICrawlers && allowsAI;
          
          return {
            passed,
            score,
            message: passed ? 'AI crawlers are properly configured' : 'AI crawler configuration needs improvement',
            suggestions: passed ? [] : [
              'Add specific AI crawler rules to robots.txt',
              'Ensure AI crawlers can access your content'
            ]
          };
        } catch (error) {
          return {
            passed: false,
            score: 0,
            message: 'robots.txt not found or not accessible',
            suggestions: ['Create robots.txt using: create-ai-portfolio generate robots']
          };
        }
      }
    }
  ];

  return comprehensive ? comprehensiveTests : basicTests;
}

/**
 * Calculate category scores
 */
function calculateCategoryScores(tests: AIVisibilityTest[], results: any[]): Record<string, number> {
  const categories: Record<string, { total: number; weighted: number }> = {};
  
  tests.forEach((test, index) => {
    if (!categories[test.category]) {
      categories[test.category] = { total: 0, weighted: 0 };
    }
    
    const result = results[index];
    categories[test.category].weighted += (result.score * test.weight);
    categories[test.category].total += (100 * test.weight);
  });
  
  const scores: Record<string, number> = {};
  Object.entries(categories).forEach(([category, data]) => {
    scores[category] = Math.round(data.weighted / data.total * 100);
  });
  
  return scores;
}

/**
 * Calculate overall score
 */
function calculateOverallScore(tests: AIVisibilityTest[], results: any[]): number {
  let weightedScore = 0;
  let totalWeight = 0;
  
  tests.forEach((test, index) => {
    const result = results[index];
    weightedScore += (result.score * test.weight);
    totalWeight += (100 * test.weight);
  });
  
  return Math.round(weightedScore / totalWeight * 100);
}

/**
 * Generate recommendations based on test results
 */
function generateRecommendations(results: any[], overallScore: number): string[] {
  const recommendations = [];
  
  if (overallScore < 60) {
    recommendations.push('🚨 Your portfolio needs significant AI optimization improvements');
  } else if (overallScore < 80) {
    recommendations.push('⚠️ Your portfolio has good AI visibility but can be improved');
  } else {
    recommendations.push('✅ Your portfolio has excellent AI visibility!');
  }
  
  // Category-specific recommendations
  const failedTests = results.filter(r => !r.passed);
  
  if (failedTests.some(t => t.category === 'content')) {
    recommendations.push('📝 Improve content quality and structure for better AI understanding');
  }
  
  if (failedTests.some(t => t.category === 'structure')) {
    recommendations.push('🏗️ Add structured data (Schema.org) to help AI systems understand your content');
  }
  
  if (failedTests.some(t => t.category === 'seo')) {
    recommendations.push('🔍 Optimize SEO elements (meta tags, robots.txt) for better discoverability');
  }
  
  if (failedTests.some(t => t.category === 'accessibility')) {
    recommendations.push('♿ Improve accessibility with semantic HTML and proper structure');
  }
  
  if (failedTests.some(t => t.category === 'performance')) {
    recommendations.push('⚡ Optimize performance to ensure AI crawlers can efficiently process your site');
  }
  
  return recommendations;
}

/**
 * Display test results in a formatted table
 */
function displayTestResults(report: AIVisibilityReport) {
  // Overall score
  const scoreColor = report.overallScore >= 80 ? 'green' : 
                    report.overallScore >= 60 ? 'yellow' : 'red';
  
  logger.banner(`Overall AI Visibility Score: ${report.overallScore}%`, scoreColor as any);
  
  // Category scores
  logger.section('Category Scores');
  Object.entries(report.categoryScores).forEach(([category, score]) => {
    const color = score >= 80 ? chalk.green : score >= 60 ? chalk.yellow : chalk.red;
    const emoji = score >= 80 ? '✅' : score >= 60 ? '⚠️' : '❌';
    console.log(`  ${emoji} ${category.padEnd(15)} ${color(`${score}%`)}`);
  });
  
  // Detailed results
  logger.section('Detailed Test Results');
  
  const categories = [...new Set(report.tests.map(t => t.category))];
  
  categories.forEach(category => {
    console.log(`\n${chalk.bold.cyan(category.toUpperCase())}`);
    
    const categoryTests = report.tests.filter(t => t.category === category);
    categoryTests.forEach(test => {
      const icon = test.passed ? chalk.green('✅') : chalk.red('❌');
      const score = test.passed ? chalk.green(`${test.score}%`) : chalk.red(`${test.score}%`);
      
      console.log(`  ${icon} ${test.name.padEnd(30)} ${score}`);
      console.log(`      ${chalk.gray(test.message)}`);
      
      if (test.suggestions && test.suggestions.length > 0) {
        test.suggestions.forEach(suggestion => {
          console.log(`      ${chalk.yellow('💡')} ${chalk.yellow(suggestion)}`);
        });
      }
    });
  });
  
  // Recommendations
  if (report.recommendations.length > 0) {
    logger.section('Recommendations');
    report.recommendations.forEach(rec => {
      console.log(`  ${rec}`);
    });
  }
}

/**
 * Save test report to file
 */
async function saveTestReport(projectRoot: string, report: AIVisibilityReport) {
  const reportsDir = path.join(projectRoot, 'reports');
  await fs.ensureDir(reportsDir);
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `ai-visibility-${timestamp}.json`;
  const filepath = path.join(reportsDir, filename);
  
  await fs.writeJson(filepath, report, { spaces: 2 });
  
  logger.info(`📊 Test report saved to: ${chalk.cyan(path.relative(projectRoot, filepath))}`);
}