#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import { initCommand } from './commands/init';
import { generateCommand } from './commands/generate';
import { testCommand } from './commands/test';
import { deployCommand } from './commands/deploy';
import { crawlerSimulateCommand, listCrawlersCommand, crawlerStatsCommand } from './commands/crawler-simulate';
import { logger } from './utils/logger';
import { checkNodeVersion, checkDependencies } from './utils/system-check';

// Package information
const pkg = require('../../package.json');

/**
 * Main CLI entry point
 */
async function main() {
  try {
    // Display banner
    console.log(
      chalk.cyan(`
    ┌─────────────────────────────────────┐
    │                                     │
    │     🤖  AI Portfolio Generator      │
    │                                     │
    └─────────────────────────────────────┘
      `)
    );
    
    console.log(
      chalk.gray(`✨ Create AI-optimized portfolio websites\n`) +
      chalk.gray(`Version: ${pkg.version}\n`)
    );

    // Check system requirements
    await checkNodeVersion();
    
    // Setup CLI commands
    program
      .name('create-ai-portfolio')
      .description('CLI tool for creating AI-optimized portfolio websites')
      .version(pkg.version, '-v, --version', 'display version number');

    // Init command
    program
      .command('init [project-name]')
      .description('Initialize a new AI portfolio project')
      .option('-t, --template <template>', 'Template to use (developer, designer, academic)', 'developer')
      .option('-y, --yes', 'Skip prompts and use default values')
      .option('--no-install', 'Skip dependency installation')
      .option('--verbose', 'Enable verbose logging')
      .action(initCommand);

    // Generate commands
    const generateCmd = program
      .command('generate')
      .description('Generate AI-optimized content');

    generateCmd
      .command('llms [output-file]')
      .description('Generate llms.txt file for AI discoverability')
      .option('-l, --language <lang>', 'Output language (en, zh, zh-CN, zh-TW)', 'en')
      .option('-f, --format <format>', 'Output format (markdown, plain, structured)', 'markdown')
      .option('--max-length <length>', 'Maximum content length', '8000')
      .option('--include-api', 'Include API endpoint documentation')
      .action((outputFile, options) => generateCommand('llms', outputFile, options));

    generateCmd
      .command('schema [output-file]')
      .description('Generate structured data (Schema.org) for SEO')
      .option('-t, --types <types>', 'Schema types to generate (person,website,creative-work)', 'person,website')
      .option('-f, --format <format>', 'Output format (json, html)', 'json')
      .option('--validate', 'Validate generated schema')
      .action((outputFile, options) => generateCommand('schema', outputFile, options));

    generateCmd
      .command('sitemap')
      .description('Generate sitemap.xml for search engines')
      .option('-u, --base-url <url>', 'Base URL for the website')
      .option('--include-blog', 'Include blog posts in sitemap')
      .action((options) => generateCommand('sitemap', null, options));

    generateCmd
      .command('robots')
      .description('Generate robots.txt file')
      .option('-u, --base-url <url>', 'Base URL for the website')
      .option('--allow-all', 'Allow all crawlers (default: selective)')
      .action((options) => generateCommand('robots', null, options));

    // Test command
    program
      .command('test')
      .description('Test AI visibility and optimization')
      .command('ai-visibility [url]')
      .description('Test how AI-friendly your portfolio is')
      .option('--comprehensive', 'Run comprehensive AI visibility tests')
      .option('--output <format>', 'Output format (json, table)', 'table')
      .option('--save-report', 'Save test report to file')
      .action(testCommand);

    // AI Crawler Simulation commands
    const crawlerCmd = program
      .command('crawler')
      .description('AI crawler behavior simulation and analysis');

    crawlerCmd
      .command('simulate [url]')
      .description('Simulate AI crawler behavior and analyze website')
      .option('--crawlers <crawlers>', 'Specify crawlers to simulate (OpenAI-GPT,Google-Gemini,Claude)')
      .option('-f, --format <format>', 'Output format (console, html, json, csv, all)', 'console')
      .option('-o, --output <file>', 'Output file name (optional)')
      .option('--screenshots', 'Capture screenshots for visual analysis')
      .option('--comprehensive', 'Run comprehensive analysis including subpages')
      .option('--timeout <ms>', 'Timeout for each crawler in milliseconds', '30000')
      .action(crawlerSimulateCommand);

    crawlerCmd
      .command('list')
      .description('List available AI crawlers and their configurations')
      .action(listCrawlersCommand);

    crawlerCmd
      .command('stats')
      .description('Show statistics of previous crawler simulations')
      .action(crawlerStatsCommand);

    // Deploy command
    program
      .command('deploy [platform]')
      .description('Deploy your portfolio to various platforms')
      .option('--build-command <cmd>', 'Custom build command')
      .option('--output-directory <dir>', 'Output directory', 'dist')
      .option('--env <env>', 'Environment variables (key=value)')
      .option('--domain <domain>', 'Custom domain')
      .option('--auto-setup', 'Automatically setup deployment configuration')
      .action(deployCommand);

    // Additional utility commands
    program
      .command('validate [config-file]')
      .description('Validate portfolio configuration')
      .option('--fix', 'Automatically fix common issues')
      .action(async (configFile, options) => {
        const { validateCommand } = await import('./commands/validate');
        await validateCommand(configFile, options);
      });

    program
      .command('optimize')
      .description('Optimize portfolio for performance and AI visibility')
      .option('--images', 'Optimize images')
      .option('--bundle', 'Optimize JavaScript bundles')
      .option('--seo', 'Optimize SEO settings')
      .action(async (options) => {
        const { optimizeCommand } = await import('./commands/optimize');
        await optimizeCommand(options);
      });

    program
      .command('serve')
      .description('Start development server')
      .option('-p, --port <port>', 'Port to serve on', '3000')
      .option('--host <host>', 'Host to serve on', 'localhost')
      .option('--open', 'Open browser automatically')
      .action(async (options) => {
        const { serveCommand } = await import('./commands/serve');
        await serveCommand(options);
      });

    // Error handling for unknown commands
    program.on('command:*', (operands) => {
      logger.error(`Unknown command: ${operands[0]}`);
      logger.info('Run --help to see available commands');
      process.exit(1);
    });

    // Global error handler
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error.message);
      if (program.opts().verbose) {
        console.error(error.stack);
      }
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
      process.exit(1);
    });

    // Handle SIGINT (Ctrl+C)
    process.on('SIGINT', () => {
      logger.info('\n👋 Goodbye!');
      process.exit(0);
    });

    // Parse arguments
    await program.parseAsync(process.argv);

    // Show help if no command provided
    if (!process.argv.slice(2).length) {
      program.help();
    }

  } catch (error) {
    logger.error('CLI initialization failed:', error);
    process.exit(1);
  }
}

// Run CLI
if (require.main === module) {
  main();
}

export { main };