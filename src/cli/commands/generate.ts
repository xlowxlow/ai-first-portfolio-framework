import fs from 'fs-extra';
import path from 'path';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { logger, withSpinner, createProgressReporter } from '../utils/logger';
import { findProjectRoot, loadProjectConfig } from '../utils/project';
import { LLMSTxtGenerator } from '../../generators/llms-txt-generator';
import { StructuredDataGenerator } from '../../generators/structured-data-generator';

export interface GenerateOptions {
  language?: 'en' | 'zh' | 'zh-CN' | 'zh-TW';
  format?: 'markdown' | 'plain' | 'structured' | 'json' | 'html';
  maxLength?: number;
  includeApi?: boolean;
  types?: string;
  validate?: boolean;
  baseUrl?: string;
  includeBlogs?: boolean;
  allowAll?: boolean;
}

/**
 * Generate AI-optimized content
 */
export async function generateCommand(
  type: 'llms' | 'schema' | 'sitemap' | 'robots',
  outputFile?: string,
  options: GenerateOptions = {}
) {
  try {
    logger.section(`Generating ${type.toUpperCase()}`);

    // Find project root and load configuration
    const projectRoot = await findProjectRoot();
    if (!projectRoot) {
      throw new Error('Not in a valid AI portfolio project directory');
    }

    const config = await loadProjectConfig(projectRoot);
    
    switch (type) {
      case 'llms':
        await generateLLMSTxt(projectRoot, config, outputFile, options);
        break;
      case 'schema':
        await generateStructuredData(projectRoot, config, outputFile, options);
        break;
      case 'sitemap':
        await generateSitemap(projectRoot, config, options);
        break;
      case 'robots':
        await generateRobots(projectRoot, config, options);
        break;
      default:
        throw new Error(`Unknown generation type: ${type}`);
    }

    logger.success(`✨ ${type.toUpperCase()} generated successfully!`);

  } catch (error: any) {
    logger.error('Generation failed:', error.message);
    process.exit(1);
  }
}

/**
 * Generate llms.txt file
 */
async function generateLLMSTxt(
  projectRoot: string, 
  config: any, 
  outputFile?: string, 
  options: GenerateOptions = {}
) {
  return withSpinner(
    'Generating llms.txt for AI discoverability',
    async () => {
      // Get generation options
      const llmsOptions = await getLLMSGenerationOptions(options);
      
      // Create generator instance
      const llmsConfig = {
        enabled: true,
        sections: {
          includePersonalInfo: true,
          includeSkills: true,
          includeExperience: true,
          includeProjects: true,
          includeEducation: true,
        },
        format: llmsOptions.format as any,
        maxLength: llmsOptions.maxLength || 8000,
        includeTechnicalDetails: true,
        includeAchievements: true,
      };

      const generatorOptions = {
        language: llmsOptions.language,
        includeApiEndpoints: llmsOptions.includeApi || true,
        format: llmsOptions.format as any,
        includeMetadata: true,
        siteUrl: llmsOptions.baseUrl || config.siteUrl || 'https://example.com',
      };

      const generator = new LLMSTxtGenerator(config, llmsConfig, generatorOptions);
      const content = generator.generate();

      // Determine output path
      const outputPath = outputFile 
        ? path.resolve(projectRoot, outputFile)
        : path.join(projectRoot, 'public', 'llms.txt');

      // Ensure output directory exists
      await fs.ensureDir(path.dirname(outputPath));
      
      // Write content to file
      await fs.writeFile(outputPath, content, 'utf8');
      
      // Show content preview
      const preview = content.slice(0, 200) + (content.length > 200 ? '...' : '');
      logger.info(`\nGenerated content preview:\n${chalk.gray(preview)}\n`);
      logger.info(`📄 File saved to: ${chalk.cyan(path.relative(projectRoot, outputPath))}`);
      logger.info(`📊 Content length: ${chalk.yellow(content.length.toLocaleString())} characters`);
      
      // Validate content length
      if (llmsOptions.maxLength && content.length > llmsOptions.maxLength) {
        logger.warn(`Content exceeds maximum length (${llmsOptions.maxLength}). Consider reducing content.`);
      }
      
      return outputPath;
    }
  );
}

/**
 * Generate structured data
 */
async function generateStructuredData(
  projectRoot: string,
  config: any,
  outputFile?: string,
  options: GenerateOptions = {}
) {
  return withSpinner(
    'Generating structured data (Schema.org)',
    async () => {
      // Get generation options
      const schemaOptions = await getSchemaGenerationOptions(options);
      
      // Parse schema types
      const types = schemaOptions.types 
        ? schemaOptions.types.split(',').map(t => t.trim())
        : ['person', 'website', 'creative-work'];
      
      // Create structured data configuration
      const structuredDataConfig = {
        enabled: true,
        schemas: {
          person: types.includes('person'),
          organization: types.includes('organization'),
          webSite: types.includes('website'),
          breadcrumbList: types.includes('breadcrumb'),
        },
        includeJobPostings: types.includes('job-posting'),
        includeProjects: types.includes('creative-work'),
      };

      const generatorOptions = {
        baseUrl: schemaOptions.baseUrl || config.siteUrl || 'https://example.com',
        includeOptionalFields: true,
        validateOutput: schemaOptions.validate || false,
        formatForHTML: schemaOptions.format === 'html',
      };

      const generator = new StructuredDataGenerator(
        config,
        structuredDataConfig,
        generatorOptions
      );

      let content: string;
      let extension: string;
      
      if (schemaOptions.format === 'html') {
        content = generator.generateAllHTMLScriptTags();
        extension = 'html';
      } else {
        const schemas = generator.generateAllSchemas();
        content = JSON.stringify(schemas, null, 2);
        extension = 'json';
      }

      // Validate if requested
      if (schemaOptions.validate) {
        const validationResults = generator.validateAllSchemas();
        const hasErrors = Object.values(validationResults).some(errors => errors.length > 0);
        
        if (hasErrors) {
          logger.warn('Validation warnings found:');
          Object.entries(validationResults).forEach(([schema, errors]) => {
            if (errors.length > 0) {
              logger.warn(`  ${schema}:`);
              errors.forEach(error => {
                logger.warn(`    - ${error.field}: ${error.message}`);
              });
            }
          });
        } else {
          logger.success('✅ All schemas validated successfully');
        }
      }

      // Determine output path
      const outputPath = outputFile 
        ? path.resolve(projectRoot, outputFile)
        : path.join(projectRoot, 'src', 'data', `structured-data.${extension}`);

      // Ensure output directory exists
      await fs.ensureDir(path.dirname(outputPath));
      
      // Write content to file
      await fs.writeFile(outputPath, content, 'utf8');
      
      logger.info(`📄 File saved to: ${chalk.cyan(path.relative(projectRoot, outputPath))}`);
      logger.info(`📊 Generated ${chalk.yellow(types.length)} schema types`);
      
      return outputPath;
    }
  );
}

/**
 * Generate sitemap.xml
 */
async function generateSitemap(projectRoot: string, config: any, options: GenerateOptions = {}) {
  return withSpinner(
    'Generating sitemap.xml',
    async () => {
      const baseUrl = options.baseUrl || config.siteUrl || 'https://example.com';
      const includeBlogs = options.includeBlogs || false;
      
      // Basic pages
      const pages = [
        { url: baseUrl, lastmod: new Date().toISOString(), changefreq: 'weekly', priority: 1.0 },
        { url: `${baseUrl}/about`, lastmod: new Date().toISOString(), changefreq: 'monthly', priority: 0.8 },
        { url: `${baseUrl}/projects`, lastmod: new Date().toISOString(), changefreq: 'weekly', priority: 0.9 },
        { url: `${baseUrl}/contact`, lastmod: new Date().toISOString(), changefreq: 'monthly', priority: 0.7 },
      ];

      // Add blog pages if requested
      if (includeBlogs && config.blogPosts) {
        config.blogPosts.forEach((post: any) => {
          pages.push({
            url: `${baseUrl}/blog/${post.slug}`,
            lastmod: post.updatedDate || post.publishedDate,
            changefreq: 'monthly',
            priority: 0.6
          });
        });
        
        // Add blog index
        pages.push({
          url: `${baseUrl}/blog`,
          lastmod: new Date().toISOString(),
          changefreq: 'weekly',
          priority: 0.8
        });
      }

      // Add project pages
      if (config.projects) {
        config.projects.forEach((project: any) => {
          pages.push({
            url: `${baseUrl}/projects/${project.id}`,
            lastmod: project.endDate || project.startDate,
            changefreq: 'monthly',
            priority: 0.7
          });
        });
      }

      // Generate XML content
      const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

      const outputPath = path.join(projectRoot, 'public', 'sitemap.xml');
      await fs.writeFile(outputPath, sitemapContent, 'utf8');
      
      logger.info(`📄 File saved to: ${chalk.cyan(path.relative(projectRoot, outputPath))}`);
      logger.info(`📊 Generated ${chalk.yellow(pages.length)} URLs`);
      
      return outputPath;
    }
  );
}

/**
 * Generate robots.txt
 */
async function generateRobots(projectRoot: string, config: any, options: GenerateOptions = {}) {
  return withSpinner(
    'Generating robots.txt',
    async () => {
      const baseUrl = options.baseUrl || config.siteUrl || 'https://example.com';
      const allowAll = options.allowAll || false;
      
      let robotsContent = '';
      
      if (allowAll) {
        robotsContent = `User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# AI Crawlers
User-agent: ChatGPT-User
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: PerplexityBot
Allow: /
`;
      } else {
        robotsContent = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /*.json$
Disallow: /private/

# Crawl delay for all bots
Crawl-delay: 1

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# AI Crawlers - More permissive
User-agent: ChatGPT-User
Allow: /
Disallow: /admin/
Disallow: /private/

User-agent: Claude-Web  
Allow: /
Disallow: /admin/
Disallow: /private/

User-agent: PerplexityBot
Allow: /
Disallow: /admin/
Disallow: /private/

User-agent: Bard
Allow: /
Disallow: /admin/
Disallow: /private/

# Search Engine Bots
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: DuckDuckBot
Allow: /
`;
      }

      const outputPath = path.join(projectRoot, 'public', 'robots.txt');
      await fs.writeFile(outputPath, robotsContent, 'utf8');
      
      logger.info(`📄 File saved to: ${chalk.cyan(path.relative(projectRoot, outputPath))}`);
      
      return outputPath;
    }
  );
}

/**
 * Get LLMs generation options through prompts
 */
async function getLLMSGenerationOptions(options: GenerateOptions) {
  if (Object.keys(options).length > 0) {
    return options;
  }

  return await inquirer.prompt([
    {
      type: 'list',
      name: 'language',
      message: 'Select output language:',
      choices: [
        { name: 'English', value: 'en' },
        { name: '中文 (简体)', value: 'zh-CN' },
        { name: '中文 (繁體)', value: 'zh-TW' },
        { name: '中文 (通用)', value: 'zh' },
      ],
      default: 'en',
    },
    {
      type: 'list',
      name: 'format',
      message: 'Select output format:',
      choices: [
        { name: 'Markdown (recommended)', value: 'markdown' },
        { name: 'Plain text', value: 'plain' },
        { name: 'Structured format', value: 'structured' },
      ],
      default: 'markdown',
    },
    {
      type: 'input',
      name: 'maxLength',
      message: 'Maximum content length (characters):',
      default: '8000',
      validate: (input) => {
        const num = parseInt(input);
        return !isNaN(num) && num > 0 || 'Please enter a valid positive number';
      },
      filter: (input) => parseInt(input),
    },
    {
      type: 'confirm',
      name: 'includeApi',
      message: 'Include API endpoint documentation?',
      default: true,
    },
    {
      type: 'input',
      name: 'baseUrl',
      message: 'Your website base URL:',
      default: 'https://example.com',
      validate: (input) => {
        try {
          new URL(input);
          return true;
        } catch {
          return 'Please enter a valid URL';
        }
      },
    },
  ]);
}

/**
 * Get schema generation options through prompts
 */
async function getSchemaGenerationOptions(options: GenerateOptions) {
  if (Object.keys(options).length > 0) {
    return options;
  }

  return await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'types',
      message: 'Select schema types to generate:',
      choices: [
        { name: 'Person - Personal information', value: 'person', checked: true },
        { name: 'WebSite - Website information', value: 'website', checked: true },
        { name: 'CreativeWork - Projects and portfolio items', value: 'creative-work', checked: true },
        { name: 'Organization - Company/organization info', value: 'organization' },
        { name: 'BreadcrumbList - Navigation breadcrumbs', value: 'breadcrumb' },
        { name: 'JobPosting - Current job positions', value: 'job-posting' },
      ],
      validate: (answer) => answer.length > 0 || 'Please select at least one schema type',
      filter: (answer) => answer.join(','),
    },
    {
      type: 'list',
      name: 'format',
      message: 'Select output format:',
      choices: [
        { name: 'JSON (for data processing)', value: 'json' },
        { name: 'HTML script tags (for embedding)', value: 'html' },
      ],
      default: 'json',
    },
    {
      type: 'confirm',
      name: 'validate',
      message: 'Validate generated schemas?',
      default: true,
    },
    {
      type: 'input',
      name: 'baseUrl',
      message: 'Your website base URL:',
      default: 'https://example.com',
      validate: (input) => {
        try {
          new URL(input);
          return true;
        } catch {
          return 'Please enter a valid URL';
        }
      },
    },
  ]);
}