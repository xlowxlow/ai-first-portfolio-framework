import fs from 'fs-extra';
import path from 'path';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { execSync, spawn } from 'child_process';
import { logger, withSpinner } from '../utils/logger';
import { findProjectRoot, loadProjectConfig } from '../utils/project';

export interface DeployOptions {
  buildCommand?: string;
  outputDirectory?: string;
  env?: string;
  domain?: string;
  autoSetup?: boolean;
  verbose?: boolean;
}

export interface DeployConfig {
  platform: 'vercel' | 'netlify' | 'github-pages' | 'manual';
  buildCommand: string;
  outputDirectory: string;
  environmentVariables: Record<string, string>;
  domain?: string;
  customConfig?: Record<string, any>;
}

/**
 * Deploy portfolio to various platforms
 */
export async function deployCommand(platform?: string, options: DeployOptions = {}) {
  try {
    logger.section('🚀 Portfolio Deployment');
    
    // Find project root and load configuration
    const projectRoot = await findProjectRoot();
    if (!projectRoot) {
      throw new Error('Not in a valid AI portfolio project directory');
    }

    const config = await loadProjectConfig(projectRoot);
    
    // Get deployment configuration
    const deployConfig = await getDeploymentConfig(platform, config, options);
    
    logger.info(`Deploying to: ${chalk.cyan(deployConfig.platform)}`);
    logger.info(`Build command: ${chalk.yellow(deployConfig.buildCommand)}`);
    logger.info(`Output directory: ${chalk.yellow(deployConfig.outputDirectory)}\n`);
    
    // Pre-deployment checks
    await runPreDeploymentChecks(projectRoot, config);
    
    // Build project
    await buildProject(projectRoot, deployConfig);
    
    // Deploy based on platform
    switch (deployConfig.platform) {
      case 'vercel':
        await deployToVercel(projectRoot, deployConfig, options);
        break;
      case 'netlify':
        await deployToNetlify(projectRoot, deployConfig, options);
        break;
      case 'github-pages':
        await deployToGitHubPages(projectRoot, deployConfig, options);
        break;
      default:
        await showManualDeploymentInstructions(projectRoot, deployConfig);
    }
    
    logger.success('🎉 Deployment completed successfully!');
    
  } catch (error: any) {
    logger.error('Deployment failed:', error.message);
    if (options.verbose) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

/**
 * Get deployment configuration
 */
async function getDeploymentConfig(
  platform?: string,
  config?: any,
  options: DeployOptions = {}
): Promise<DeployConfig> {
  
  // Use provided options or prompt user
  if (platform && options.buildCommand && options.outputDirectory) {
    return {
      platform: platform as any,
      buildCommand: options.buildCommand,
      outputDirectory: options.outputDirectory,
      environmentVariables: parseEnvironmentVariables(options.env),
      domain: options.domain,
    };
  }
  
  // Interactive configuration
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'platform',
      message: 'Select deployment platform:',
      choices: [
        {
          name: '▲ Vercel - Fast, easy, and optimized for modern frameworks',
          value: 'vercel',
          short: 'Vercel'
        },
        {
          name: '🌐 Netlify - Great for static sites with powerful features',
          value: 'netlify',
          short: 'Netlify'
        },
        {
          name: '📚 GitHub Pages - Free hosting for public repositories',
          value: 'github-pages',
          short: 'GitHub Pages'
        },
        {
          name: '📋 Manual - Get deployment instructions for other platforms',
          value: 'manual',
          short: 'Manual'
        }
      ],
      default: platform || config?.deployment?.platform || 'vercel'
    },
    {
      type: 'input',
      name: 'buildCommand',
      message: 'Build command:',
      default: options.buildCommand || 'npm run build',
      when: (answers) => answers.platform !== 'manual'
    },
    {
      type: 'input',
      name: 'outputDirectory',
      message: 'Output directory:',
      default: options.outputDirectory || 'dist',
      when: (answers) => answers.platform !== 'manual'
    },
    {
      type: 'input',
      name: 'domain',
      message: 'Custom domain (optional):',
      default: options.domain || config?.deployment?.domain,
      when: (answers) => answers.platform !== 'github-pages'
    },
    {
      type: 'confirm',
      name: 'setupEnvironment',
      message: 'Configure environment variables?',
      default: false,
      when: (answers) => answers.platform !== 'manual'
    }
  ]);
  
  let environmentVariables = parseEnvironmentVariables(options.env);
  
  if (answers.setupEnvironment) {
    environmentVariables = await collectEnvironmentVariables();
  }
  
  return {
    platform: answers.platform,
    buildCommand: answers.buildCommand,
    outputDirectory: answers.outputDirectory,
    environmentVariables,
    domain: answers.domain,
  };
}

/**
 * Parse environment variables from string
 */
function parseEnvironmentVariables(envString?: string): Record<string, string> {
  if (!envString) return {};
  
  const envVars: Record<string, string> = {};
  const pairs = envString.split(',');
  
  pairs.forEach(pair => {
    const [key, value] = pair.split('=');
    if (key && value) {
      envVars[key.trim()] = value.trim();
    }
  });
  
  return envVars;
}

/**
 * Collect environment variables interactively
 */
async function collectEnvironmentVariables(): Promise<Record<string, string>> {
  const envVars: Record<string, string> = {};
  
  logger.info('\n📝 Configure environment variables (press Enter with empty name to finish):');
  
  while (true) {
    const { name } = await inquirer.prompt([{
      type: 'input',
      name: 'name',
      message: 'Environment variable name:',
    }]);
    
    if (!name) break;
    
    const { value } = await inquirer.prompt([{
      type: 'input',
      name: 'value',
      message: `Value for ${name}:`,
    }]);
    
    envVars[name] = value || '';
  }
  
  return envVars;
}

/**
 * Run pre-deployment checks
 */
async function runPreDeploymentChecks(projectRoot: string, config: any) {
  return withSpinner(
    'Running pre-deployment checks',
    async () => {
      const checks = [];
      
      // Check if package.json exists
      const packageJsonPath = path.join(projectRoot, 'package.json');
      if (!await fs.pathExists(packageJsonPath)) {
        throw new Error('package.json not found');
      }
      checks.push('✅ package.json found');
      
      // Check if build script exists
      const packageJson = await fs.readJson(packageJsonPath);
      if (!packageJson.scripts?.build) {
        logger.warn('No build script found in package.json');
      } else {
        checks.push('✅ Build script found');
      }
      
      // Check for environment file
      const envPath = path.join(projectRoot, '.env.example');
      if (await fs.pathExists(envPath)) {
        checks.push('✅ Environment example found');
      }
      
      // Check for AI optimization files
      const llmsTxtPath = path.join(projectRoot, 'public', 'llms.txt');
      if (await fs.pathExists(llmsTxtPath)) {
        checks.push('✅ llms.txt found');
      } else {
        logger.warn('llms.txt not found - run "create-ai-portfolio generate llms" to create it');
      }
      
      logger.debug('Pre-deployment checks:', checks);
    },
    'Pre-deployment checks completed'
  );
}

/**
 * Build project
 */
async function buildProject(projectRoot: string, deployConfig: DeployConfig) {
  return withSpinner(
    `Building project with: ${deployConfig.buildCommand}`,
    async () => {
      try {
        execSync(deployConfig.buildCommand, {
          cwd: projectRoot,
          stdio: 'pipe',
          env: {
            ...process.env,
            ...deployConfig.environmentVariables
          }
        });
        
        // Verify build output
        const outputPath = path.join(projectRoot, deployConfig.outputDirectory);
        if (!await fs.pathExists(outputPath)) {
          throw new Error(`Build output directory not found: ${deployConfig.outputDirectory}`);
        }
        
        const files = await fs.readdir(outputPath);
        if (files.length === 0) {
          throw new Error('Build output directory is empty');
        }
        
      } catch (error: any) {
        if (error.stdout) {
          logger.debug('Build stdout:', error.stdout.toString());
        }
        if (error.stderr) {
          logger.error('Build stderr:', error.stderr.toString());
        }
        throw new Error(`Build failed: ${error.message}`);
      }
    },
    'Project built successfully'
  );
}

/**
 * Deploy to Vercel
 */
async function deployToVercel(projectRoot: string, deployConfig: DeployConfig, options: DeployOptions) {
  logger.section('Deploying to Vercel');
  
  // Check if Vercel CLI is installed
  try {
    execSync('vercel --version', { stdio: 'ignore' });
  } catch (error) {
    logger.info('Installing Vercel CLI...');
    try {
      execSync('npm install -g vercel@latest', { stdio: 'inherit' });
    } catch (installError) {
      throw new Error('Failed to install Vercel CLI. Please install it manually: npm install -g vercel');
    }
  }
  
  // Create or update vercel.json
  await createVercelConfig(projectRoot, deployConfig);
  
  // Deploy with Vercel CLI
  return withSpinner(
    'Deploying to Vercel',
    async () => {
      const vercelArgs = ['--prod', '--yes'];
      
      if (deployConfig.domain) {
        // Note: Domain setup requires additional steps in Vercel dashboard
        logger.info(`Custom domain configured: ${deployConfig.domain}`);
      }
      
      const child = spawn('vercel', vercelArgs, {
        cwd: projectRoot,
        stdio: 'pipe',
        env: {
          ...process.env,
          ...deployConfig.environmentVariables
        }
      });
      
      let output = '';
      let url = '';
      
      child.stdout?.on('data', (data) => {
        const text = data.toString();
        output += text;
        
        // Extract deployment URL
        const urlMatch = text.match(/https:\/\/[^\s]+\.vercel\.app/);
        if (urlMatch) {
          url = urlMatch[0];
        }
        
        if (options.verbose) {
          process.stdout.write(text);
        }
      });
      
      child.stderr?.on('data', (data) => {
        if (options.verbose) {
          process.stderr.write(data);
        }
      });
      
      return new Promise((resolve, reject) => {
        child.on('close', (code) => {
          if (code === 0) {
            logger.success(`🌐 Deployed to: ${chalk.cyan(url)}`);
            logger.info('📊 Visit the Vercel dashboard to configure custom domains and environment variables');
            resolve(url);
          } else {
            reject(new Error(`Vercel deployment failed with code ${code}`));
          }
        });
      });
    }
  );
}

/**
 * Create Vercel configuration
 */
async function createVercelConfig(projectRoot: string, deployConfig: DeployConfig) {
  const vercelConfig = {
    version: 2,
    buildCommand: deployConfig.buildCommand,
    outputDirectory: deployConfig.outputDirectory,
    framework: 'astro', // Assume Astro framework
    functions: {},
    headers: [
      {
        source: '/llms.txt',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain; charset=utf-8'
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600'
          }
        ]
      }
    ],
    redirects: [],
    rewrites: []
  };
  
  const vercelConfigPath = path.join(projectRoot, 'vercel.json');
  await fs.writeJson(vercelConfigPath, vercelConfig, { spaces: 2 });
  
  logger.debug('Created vercel.json configuration');
}

/**
 * Deploy to Netlify
 */
async function deployToNetlify(projectRoot: string, deployConfig: DeployConfig, options: DeployOptions) {
  logger.section('Deploying to Netlify');
  
  // Create netlify.toml configuration
  await createNetlifyConfig(projectRoot, deployConfig);
  
  // Check if Netlify CLI is installed
  try {
    execSync('netlify --version', { stdio: 'ignore' });
  } catch (error) {
    logger.info('Installing Netlify CLI...');
    try {
      execSync('npm install -g netlify-cli@latest', { stdio: 'inherit' });
    } catch (installError) {
      throw new Error('Failed to install Netlify CLI. Please install it manually: npm install -g netlify-cli');
    }
  }
  
  // Deploy with Netlify CLI
  return withSpinner(
    'Deploying to Netlify',
    async () => {
      const netlifyArgs = ['deploy', '--prod', '--dir', deployConfig.outputDirectory];
      
      const child = spawn('netlify', netlifyArgs, {
        cwd: projectRoot,
        stdio: 'pipe',
        env: {
          ...process.env,
          ...deployConfig.environmentVariables
        }
      });
      
      let output = '';
      let url = '';
      
      child.stdout?.on('data', (data) => {
        const text = data.toString();
        output += text;
        
        // Extract deployment URL
        const urlMatch = text.match(/https:\/\/[^\s]+\.netlify\.app/);
        if (urlMatch) {
          url = urlMatch[0];
        }
        
        if (options.verbose) {
          process.stdout.write(text);
        }
      });
      
      child.stderr?.on('data', (data) => {
        if (options.verbose) {
          process.stderr.write(data);
        }
      });
      
      return new Promise((resolve, reject) => {
        child.on('close', (code) => {
          if (code === 0) {
            logger.success(`🌐 Deployed to: ${chalk.cyan(url)}`);
            logger.info('📊 Visit the Netlify dashboard to configure custom domains and environment variables');
            resolve(url);
          } else {
            reject(new Error(`Netlify deployment failed with code ${code}`));
          }
        });
      });
    }
  );
}

/**
 * Create Netlify configuration
 */
async function createNetlifyConfig(projectRoot: string, deployConfig: DeployConfig) {
  const netlifyConfig = `[build]
  command = "${deployConfig.buildCommand}"
  publish = "${deployConfig.outputDirectory}"

[build.environment]
${Object.entries(deployConfig.environmentVariables)
  .map(([key, value]) => `  ${key} = "${value}"`)
  .join('\n')}

[[headers]]
  for = "/llms.txt"
  [headers.values]
    Content-Type = "text/plain; charset=utf-8"
    Cache-Control = "public, max-age=3600"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
`;
  
  const netlifyConfigPath = path.join(projectRoot, 'netlify.toml');
  await fs.writeFile(netlifyConfigPath, netlifyConfig);
  
  logger.debug('Created netlify.toml configuration');
}

/**
 * Deploy to GitHub Pages
 */
async function deployToGitHubPages(projectRoot: string, deployConfig: DeployConfig, options: DeployOptions) {
  logger.section('Deploying to GitHub Pages');
  
  // Create GitHub Actions workflow
  await createGitHubActionsWorkflow(projectRoot, deployConfig);
  
  logger.info('GitHub Actions workflow created!');
  logger.box([
    '📚 GitHub Pages Deployment Setup:',
    '',
    '1. Commit and push the .github/workflows/deploy.yml file',
    '2. Go to your repository settings on GitHub',
    '3. Navigate to Pages → Source',
    '4. Select "GitHub Actions" as the source',
    '5. Push any changes to trigger deployment',
    '',
    '🌐 Your site will be available at:',
    `   https://{username}.github.io/{repository-name}`
  ]);
}

/**
 * Create GitHub Actions workflow
 */
async function createGitHubActionsWorkflow(projectRoot: string, deployConfig: DeployConfig) {
  const workflowContent = `name: Deploy AI Portfolio to GitHub Pages

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build project
        run: ${deployConfig.buildCommand}
        env:
${Object.entries(deployConfig.environmentVariables)
  .map(([key, value]) => `          ${key}: \${{ secrets.${key} }}`)
  .join('\n')}
        
      - name: Setup Pages
        uses: actions/configure-pages@v4
        
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './${deployConfig.outputDirectory}'
          
  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
`;
  
  const workflowDir = path.join(projectRoot, '.github', 'workflows');
  await fs.ensureDir(workflowDir);
  
  const workflowPath = path.join(workflowDir, 'deploy.yml');
  await fs.writeFile(workflowPath, workflowContent);
  
  logger.debug('Created GitHub Actions workflow');
}

/**
 * Show manual deployment instructions
 */
async function showManualDeploymentInstructions(projectRoot: string, deployConfig: DeployConfig) {
  const distSize = await getDirectorySize(path.join(projectRoot, deployConfig.outputDirectory));
  
  logger.box([
    '📋 Manual Deployment Instructions:',
    '',
    `1. Build your project: ${deployConfig.buildCommand}`,
    `2. Upload the contents of "${deployConfig.outputDirectory}" to your web server`,
    `3. Configure your web server to serve the files`,
    '',
    '📊 Build Information:',
    `   Output directory: ${deployConfig.outputDirectory}`,
    `   Total size: ${distSize}`,
    '',
    '🔧 Server Configuration Tips:',
    '   • Set up HTTPS for better SEO',
    '   • Configure proper MIME types',
    '   • Enable compression (gzip/brotli)',
    '   • Set up proper cache headers',
    '   • Ensure llms.txt is accessible at /llms.txt',
    '',
    '🤖 AI Optimization:',
    '   • Verify /llms.txt is accessible',
    '   • Check /robots.txt configuration',
    '   • Test structured data with Google Rich Results Test'
  ]);
}

/**
 * Get directory size
 */
async function getDirectorySize(dirPath: string): Promise<string> {
  try {
    const stats = await fs.stat(dirPath);
    if (!stats.isDirectory()) {
      return '0 B';
    }
    
    let totalSize = 0;
    const files = await fs.readdir(dirPath, { withFileTypes: true });
    
    for (const file of files) {
      const filePath = path.join(dirPath, file.name);
      if (file.isDirectory()) {
        const subSize = await getDirectorySize(filePath);
        totalSize += parseInt(subSize) || 0;
      } else {
        const fileStats = await fs.stat(filePath);
        totalSize += fileStats.size;
      }
    }
    
    return formatBytes(totalSize);
  } catch (error) {
    return '0 B';
  }
}

/**
 * Format bytes to human readable string
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}