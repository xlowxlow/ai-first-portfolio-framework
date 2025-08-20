import inquirer from 'inquirer';
import chalk from 'chalk';
import { logger, withSpinner } from '../utils/logger';
import { AICrawlerSimulator } from '../../tools/ai-crawler-simulator';
import { CrawlerReportGenerator } from '../../tools/crawler-report-generator';

export interface CrawlerSimulateOptions {
  crawlers?: string[];
  format?: 'console' | 'html' | 'json' | 'csv' | 'all';
  output?: string;
  screenshots?: boolean;
  comprehensive?: boolean;
  timeout?: number;
}

/**
 * Simulate AI crawler behavior and generate reports
 */
export async function crawlerSimulateCommand(url?: string, options: CrawlerSimulateOptions = {}) {
  try {
    logger.section('🤖 AI Crawler Behavior Simulator');
    
    // Get target URL if not provided
    if (!url) {
      const urlInput = await inquirer.prompt([{
        type: 'input',
        name: 'url',
        message: 'Enter the URL to simulate AI crawler behavior:',
        validate: (input) => {
          try {
            new URL(input);
            return true;
          } catch {
            return 'Please enter a valid URL (including http:// or https://)';
          }
        }
      }]);
      url = urlInput.url;
    }

    // Get simulation options if not provided
    const simulationOptions = await getSimulationOptions(options);
    
    logger.info(`Target URL: ${chalk.cyan(url)}`);
    logger.info(`Output format: ${chalk.yellow(simulationOptions.format)}`);
    logger.info(`Screenshots: ${simulationOptions.screenshots ? chalk.green('Yes') : chalk.gray('No')}`);
    logger.info('');
    
    // Initialize simulator
    const simulator = new AICrawlerSimulator();
    
    try {
      await withSpinner(
        'Initializing AI crawler simulator',
        async () => {
          await simulator.initialize(!simulationOptions.screenshots);
        },
        'Simulator ready'
      );
      
      // Run simulation
      const report = await simulator.simulateAllCrawlers(url!, {
        includeSubpages: simulationOptions.comprehensive,
        saveScreenshots: simulationOptions.screenshots
      });
      
      // Generate reports based on format
      await generateReports(report, simulationOptions);
      
      // Display success message
      logger.success('🎉 AI crawler simulation completed successfully!');
      
      // Show quick summary
      const avgScore = report.overallScore;
      const scoreColor = avgScore >= 80 ? 'green' : avgScore >= 60 ? 'yellow' : 'red';
      logger.info(`📊 Overall AI Visibility Score: ${chalk[scoreColor](avgScore + '%')}`);
      
      if (avgScore < 60) {
        logger.warn('⚠️  Your website needs significant optimization for AI crawlers');
      } else if (avgScore < 80) {
        logger.info('✨ Good AI visibility! Some improvements possible');
      } else {
        logger.success('🚀 Excellent AI visibility! Your website is well-optimized');
      }
      
    } finally {
      await simulator.close();
    }
    
  } catch (error: any) {
    logger.error('AI crawler simulation failed:', error.message);
    process.exit(1);
  }
}

/**
 * Get simulation options through prompts if not provided
 */
async function getSimulationOptions(options: CrawlerSimulateOptions): Promise<Required<CrawlerSimulateOptions>> {
  const questions = [];
  
  // Output format
  if (!options.format) {
    questions.push({
      type: 'list',
      name: 'format',
      message: 'Select output format:',
      choices: [
        { name: '📊 Console table (interactive)', value: 'console' },
        { name: '🌐 HTML report (comprehensive)', value: 'html' },
        { name: '📄 JSON data (for analysis)', value: 'json' },
        { name: '📈 CSV data (for spreadsheets)', value: 'csv' },
        { name: '🎯 All formats', value: 'all' }
      ],
      default: 'console'
    });
  }
  
  // Screenshots
  if (options.screenshots === undefined) {
    questions.push({
      type: 'confirm',
      name: 'screenshots',
      message: 'Capture screenshots for visual analysis?',
      default: false
    });
  }
  
  // Comprehensive analysis
  if (options.comprehensive === undefined) {
    questions.push({
      type: 'confirm',
      name: 'comprehensive',
      message: 'Run comprehensive analysis (includes subpage analysis)?',
      default: false
    });
  }
  
  // Get answers for missing options
  const answers = questions.length > 0 ? await inquirer.prompt(questions) : {};
  
  return {
    crawlers: options.crawlers || ['OpenAI-GPT', 'Google-Gemini', 'Claude'],
    format: options.format || answers.format || 'console',
    output: options.output || '',
    screenshots: options.screenshots !== undefined ? options.screenshots : (answers.screenshots || false),
    comprehensive: options.comprehensive !== undefined ? options.comprehensive : (answers.comprehensive || false),
    timeout: options.timeout || 30000
  };
}

/**
 * Generate reports based on selected format
 */
async function generateReports(report: any, options: Required<CrawlerSimulateOptions>) {
  const formats = options.format === 'all' 
    ? ['console', 'html', 'json', 'csv'] 
    : [options.format];
  
  for (const format of formats) {
    switch (format) {
      case 'console':
        CrawlerReportGenerator.generateConsoleReport(report);
        break;
        
      case 'html':
        await withSpinner(
          'Generating HTML report',
          async () => {
            const filepath = await CrawlerReportGenerator.generateHTMLReport(report, options.output);
            logger.info(`📄 HTML report saved: ${chalk.cyan(filepath)}`);
          },
          'HTML report generated'
        );
        break;
        
      case 'json':
        await withSpinner(
          'Generating JSON report',
          async () => {
            const filepath = await CrawlerReportGenerator.generateJSONReport(report, options.output);
            logger.info(`📄 JSON report saved: ${chalk.cyan(filepath)}`);
          },
          'JSON report generated'
        );
        break;
        
      case 'csv':
        await withSpinner(
          'Generating CSV report',
          async () => {
            const filepath = await CrawlerReportGenerator.generateCSVReport(report, options.output);
            logger.info(`📄 CSV report saved: ${chalk.cyan(filepath)}`);
          },
          'CSV report generated'
        );
        break;
    }
  }
}

/**
 * List available AI crawlers
 */
export async function listCrawlersCommand() {
  logger.section('🤖 Available AI Crawlers');
  
  const crawlers = [
    {
      name: 'OpenAI GPT',
      id: 'OpenAI-GPT',
      description: 'Simulates how ChatGPT and OpenAI systems crawl websites',
      features: ['JavaScript execution', 'Deep content analysis', 'Context understanding'],
      userAgent: 'ChatGPT-User/1.0 (+https://openai.com/chatgpt)'
    },
    {
      name: 'Google Gemini',
      id: 'Google-Gemini',
      description: 'Simulates Google\'s Gemini AI crawler behavior',
      features: ['Comprehensive crawling', 'Structured data focus', 'Multi-modal analysis'],
      userAgent: 'Gemini-Bot/1.0 (Google AI)'
    },
    {
      name: 'Claude',
      id: 'Claude',
      description: 'Simulates Anthropic\'s Claude AI assistant crawling',
      features: ['Conservative approach', 'Content quality focus', 'Safety-first parsing'],
      userAgent: 'Claude-Web/1.0 (Anthropic AI Assistant)'
    }
  ];
  
  crawlers.forEach((crawler, index) => {
    console.log(`\n${chalk.bold.cyan(`${index + 1}. ${crawler.name}`)} (${crawler.id})`);
    console.log(`   ${chalk.gray(crawler.description)}`);
    console.log(`   ${chalk.bold('Features:')} ${crawler.features.join(', ')}`);
    console.log(`   ${chalk.bold('User Agent:')} ${chalk.gray(crawler.userAgent)}`);
  });
  
  console.log(`\n${chalk.bold('Usage Examples:')}`);
  console.log(`   ${chalk.cyan('create-ai-portfolio crawler-simulate https://example.com')}`);
  console.log(`   ${chalk.cyan('create-ai-portfolio crawler-simulate https://example.com --format html --screenshots')}`);
  console.log(`   ${chalk.cyan('create-ai-portfolio crawler-simulate https://example.com --format all --comprehensive')}`);
  console.log();
}

/**
 * Get crawler simulation statistics
 */
export async function crawlerStatsCommand() {
  logger.section('📊 AI Crawler Simulation Statistics');
  
  // Check if reports directory exists
  const fs = require('fs-extra');
  const path = require('path');
  const reportsDir = path.join(process.cwd(), 'crawler-reports');
  
  if (!await fs.pathExists(reportsDir)) {
    logger.info('No simulation reports found.');
    logger.info(`Run ${chalk.cyan('create-ai-portfolio crawler-simulate <url>')} to generate reports.`);
    return;
  }
  
  try {
    const files = await fs.readdir(reportsDir);
    const jsonReports = files.filter(f => f.endsWith('.json'));
    const htmlReports = files.filter(f => f.endsWith('.html'));
    const csvReports = files.filter(f => f.endsWith('.csv'));
    const screenshots = files.filter(f => f.endsWith('.png'));
    
    console.log(`📁 Reports Directory: ${chalk.cyan(reportsDir)}`);
    console.log(`📊 Total Reports: ${jsonReports.length + htmlReports.length + csvReports.length}`);
    console.log(`   • JSON reports: ${jsonReports.length}`);
    console.log(`   • HTML reports: ${htmlReports.length}`);
    console.log(`   • CSV reports: ${csvReports.length}`);
    console.log(`📸 Screenshots: ${screenshots.length}`);
    
    if (jsonReports.length > 0) {
      console.log(`\n${chalk.bold('Recent Reports:')}`);
      const recentReports = jsonReports
        .sort((a, b) => b.localeCompare(a))
        .slice(0, 5);
      
      for (const reportFile of recentReports) {
        try {
          const reportPath = path.join(reportsDir, reportFile);
          const report = await fs.readJson(reportPath);
          const stats = await fs.stat(reportPath);
          const date = stats.mtime.toLocaleDateString();
          const score = report.overallScore || 0;
          const scoreColor = score >= 80 ? 'green' : score >= 60 ? 'yellow' : 'red';
          
          console.log(`   • ${chalk.gray(date)} - ${report.url} - Score: ${chalk[scoreColor](score + '%')}`);
        } catch (e) {
          console.log(`   • ${reportFile} (parsing error)`);
        }
      }
    }
    
    console.log(`\n${chalk.bold('Commands:')}`);
    console.log(`   ${chalk.cyan('create-ai-portfolio crawler-simulate <url>')} - Run new simulation`);
    console.log(`   ${chalk.cyan('ls crawler-reports/')} - List all report files`);
    console.log(`   ${chalk.cyan('open crawler-reports/')} - Open reports directory`);
    
  } catch (error) {
    logger.error('Failed to read reports directory:', error);
  }
}