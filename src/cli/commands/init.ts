import fs from 'fs-extra';
import path from 'path';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { execSync } from 'child_process';
import { logger, withSpinner } from '../utils/logger';
import { validateProjectName, checkDirectoryEmpty } from '../utils/validation';
import { copyTemplate, processTemplateFiles } from '../utils/template';
import { installDependencies } from '../utils/package-manager';

export interface InitOptions {
  template: 'developer' | 'designer' | 'academic';
  yes: boolean;
  noInstall: boolean;
  verbose: boolean;
}

export interface ProjectConfig {
  projectName: string;
  template: string;
  personalInfo: {
    name: string;
    title: string;
    email: string;
    location: string;
    bio: string;
    website?: string;
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
  features: {
    blog: boolean;
    darkMode: boolean;
    analytics: boolean;
    contactForm: boolean;
    multilingual: boolean;
  };
  deployment: {
    platform: 'vercel' | 'netlify' | 'github-pages' | 'manual';
    domain?: string;
  };
  ai: {
    enableLlmsTxt: boolean;
    enableStructuredData: boolean;
    enableSeoOptimization: boolean;
  };
}

/**
 * Initialize a new AI portfolio project
 */
export async function initCommand(projectName?: string, options: InitOptions = {} as InitOptions) {
  try {
    logger.banner('🚀 AI Portfolio Generator', 'blue');
    logger.info('Creating your AI-optimized portfolio...\n');

    // Step 1: Get project configuration
    logger.step(1, 6, 'Collecting project information');
    const config = await getProjectConfig(projectName, options);
    
    // Step 2: Validate and prepare directory
    logger.step(2, 6, 'Setting up project directory');
    const projectPath = await setupProjectDirectory(config.projectName);
    
    // Step 3: Copy template files
    logger.step(3, 6, 'Copying template files');
    await copyTemplateFiles(projectPath, config);
    
    // Step 4: Process template variables
    logger.step(4, 6, 'Configuring project settings');
    await configureProject(projectPath, config);
    
    // Step 5: Install dependencies
    if (!options.noInstall) {
      logger.step(5, 6, 'Installing dependencies');
      await installProjectDependencies(projectPath, options);
    } else {
      logger.step(5, 6, 'Skipping dependency installation');
    }
    
    // Step 6: Initialize git and final setup
    logger.step(6, 6, 'Finalizing project setup');
    await finalizeProject(projectPath, config);
    
    // Success message and next steps
    showSuccessMessage(config.projectName, options.noInstall);
    
  } catch (error: any) {
    logger.error('Project initialization failed:', error.message);
    if (options.verbose) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

/**
 * Collect project configuration through interactive prompts
 */
async function getProjectConfig(projectName?: string, options: InitOptions): Promise<ProjectConfig> {
  if (options.yes) {
    return getDefaultConfig(projectName || 'my-ai-portfolio', options.template);
  }

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'What is your project name?',
      default: projectName || 'my-ai-portfolio',
      validate: validateProjectName,
    },
    {
      type: 'list',
      name: 'template',
      message: 'Which template would you like to use?',
      choices: [
        {
          name: '🖥️  Developer Portfolio - Modern tech-focused design',
          value: 'developer',
          short: 'Developer'
        },
        {
          name: '🎨 Designer Portfolio - Creative visual showcase',
          value: 'designer',
          short: 'Designer'
        },
        {
          name: '🎓 Academic Portfolio - Research and publications focus',
          value: 'academic',
          short: 'Academic'
        }
      ],
      default: options.template || 'developer',
    },
    {
      type: 'confirm',
      name: 'collectPersonalInfo',
      message: 'Would you like to configure your personal information now?',
      default: true,
    }
  ]);

  let personalInfo = {};
  if (answers.collectPersonalInfo) {
    personalInfo = await collectPersonalInfo();
  }

  const features = await collectFeaturePreferences();
  const deployment = await collectDeploymentPreferences();
  const ai = await collectAIPreferences();

  return {
    projectName: answers.projectName,
    template: answers.template,
    personalInfo: personalInfo as any,
    features,
    deployment,
    ai,
  };
}

/**
 * Collect personal information
 */
async function collectPersonalInfo() {
  logger.section('Personal Information');
  
  return await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Your full name:',
      validate: (input) => input.trim().length > 0 || 'Name is required',
    },
    {
      type: 'input',
      name: 'title',
      message: 'Your professional title:',
      validate: (input) => input.trim().length > 0 || 'Title is required',
    },
    {
      type: 'input',
      name: 'email',
      message: 'Your email address:',
      validate: (input) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(input) || 'Please enter a valid email address';
      },
    },
    {
      type: 'input',
      name: 'location',
      message: 'Your location (e.g., "San Francisco, CA"):',
    },
    {
      type: 'editor',
      name: 'bio',
      message: 'Your bio/description:',
      default: 'Tell us about yourself...',
    },
    {
      type: 'input',
      name: 'website',
      message: 'Your website URL (optional):',
      validate: (input) => {
        if (!input) return true;
        try {
          new URL(input);
          return true;
        } catch {
          return 'Please enter a valid URL';
        }
      },
    },
    {
      type: 'input',
      name: 'github',
      message: 'Your GitHub username (optional):',
    },
    {
      type: 'input',
      name: 'linkedin',
      message: 'Your LinkedIn profile URL (optional):',
    },
    {
      type: 'input',
      name: 'twitter',
      message: 'Your Twitter handle (optional):',
    },
  ]);
}

/**
 * Collect feature preferences
 */
async function collectFeaturePreferences() {
  logger.section('Features');
  
  return await inquirer.prompt([
    {
      type: 'confirm',
      name: 'blog',
      message: 'Include blog functionality?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'darkMode',
      message: 'Enable dark mode support?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'analytics',
      message: 'Include analytics tracking?',
      default: false,
    },
    {
      type: 'confirm',
      name: 'contactForm',
      message: 'Include contact form?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'multilingual',
      message: 'Enable multilingual support?',
      default: false,
    },
  ]);
}

/**
 * Collect deployment preferences
 */
async function collectDeploymentPreferences() {
  logger.section('Deployment');
  
  const deployment = await inquirer.prompt([
    {
      type: 'list',
      name: 'platform',
      message: 'Preferred deployment platform:',
      choices: [
        { name: 'Vercel - Recommended for fast deployment', value: 'vercel' },
        { name: 'Netlify - Great for static sites', value: 'netlify' },
        { name: 'GitHub Pages - Free hosting', value: 'github-pages' },
        { name: 'Manual deployment', value: 'manual' },
      ],
      default: 'vercel',
    },
    {
      type: 'input',
      name: 'domain',
      message: 'Custom domain (optional):',
      when: (answers) => answers.platform !== 'github-pages',
    },
  ]);

  return deployment;
}

/**
 * Collect AI optimization preferences
 */
async function collectAIPreferences() {
  logger.section('AI Optimization');
  
  return await inquirer.prompt([
    {
      type: 'confirm',
      name: 'enableLlmsTxt',
      message: 'Generate llms.txt for AI discoverability?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'enableStructuredData',
      message: 'Include structured data (Schema.org) for SEO?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'enableSeoOptimization',
      message: 'Enable advanced SEO optimization?',
      default: true,
    },
  ]);
}

/**
 * Get default configuration
 */
function getDefaultConfig(projectName: string, template: string): ProjectConfig {
  return {
    projectName,
    template,
    personalInfo: {
      name: 'Your Name',
      title: 'Your Title',
      email: 'your.email@example.com',
      location: 'Your Location',
      bio: 'Your bio goes here...',
    },
    features: {
      blog: true,
      darkMode: true,
      analytics: false,
      contactForm: true,
      multilingual: false,
    },
    deployment: {
      platform: 'vercel',
    },
    ai: {
      enableLlmsTxt: true,
      enableStructuredData: true,
      enableSeoOptimization: true,
    },
  };
}

/**
 * Setup project directory
 */
async function setupProjectDirectory(projectName: string): Promise<string> {
  const projectPath = path.resolve(process.cwd(), projectName);
  
  return withSpinner(
    `Creating project directory: ${projectName}`,
    async () => {
      // Check if directory exists and is empty
      if (await fs.pathExists(projectPath)) {
        const isEmpty = await checkDirectoryEmpty(projectPath);
        if (!isEmpty) {
          throw new Error(`Directory ${projectName} already exists and is not empty`);
        }
      } else {
        await fs.ensureDir(projectPath);
      }
      
      return projectPath;
    },
    `Project directory created successfully`
  );
}

/**
 * Copy template files to project directory
 */
async function copyTemplateFiles(projectPath: string, config: ProjectConfig) {
  return withSpinner(
    `Copying ${config.template} template files`,
    async () => {
      const templatePath = path.join(__dirname, '../../templates', config.template);
      await copyTemplate(templatePath, projectPath, config);
    },
    'Template files copied successfully'
  );
}

/**
 * Configure project with user settings
 */
async function configureProject(projectPath: string, config: ProjectConfig) {
  return withSpinner(
    'Configuring project settings',
    async () => {
      // Process template files with configuration
      await processTemplateFiles(projectPath, config);
      
      // Create configuration files
      await createConfigFiles(projectPath, config);
      
      // Update package.json
      await updatePackageJson(projectPath, config);
    },
    'Project configuration completed'
  );
}

/**
 * Create configuration files
 */
async function createConfigFiles(projectPath: string, config: ProjectConfig) {
  const configPath = path.join(projectPath, 'src/config/user.config.ts');
  
  const configContent = `// Auto-generated configuration
export const userConfig = ${JSON.stringify(config, null, 2)};

export default userConfig;
`;

  await fs.writeFile(configPath, configContent);
  
  // Create environment file
  const envContent = `# Environment variables
SITE_NAME="${config.projectName}"
SITE_URL="https://${config.projectName}.vercel.app"
${config.features.analytics ? 'GOOGLE_ANALYTICS_ID=""' : ''}
${config.deployment.domain ? `CUSTOM_DOMAIN="${config.deployment.domain}"` : ''}
`;

  await fs.writeFile(path.join(projectPath, '.env.example'), envContent);
  await fs.writeFile(path.join(projectPath, '.env.local'), envContent);
}

/**
 * Update package.json with project details
 */
async function updatePackageJson(projectPath: string, config: ProjectConfig) {
  const packageJsonPath = path.join(projectPath, 'package.json');
  const packageJson = await fs.readJson(packageJsonPath);
  
  packageJson.name = config.projectName;
  packageJson.description = `AI-optimized portfolio for ${config.personalInfo.name}`;
  packageJson.author = config.personalInfo.name;
  
  if (config.personalInfo.github) {
    packageJson.repository = {
      type: 'git',
      url: `https://github.com/${config.personalInfo.github}/${config.projectName}.git`
    };
    packageJson.homepage = `https://github.com/${config.personalInfo.github}/${config.projectName}#readme`;
  }
  
  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
}

/**
 * Install project dependencies
 */
async function installProjectDependencies(projectPath: string, options: InitOptions) {
  return withSpinner(
    'Installing dependencies (this may take a while)',
    async () => {
      await installDependencies(projectPath);
    },
    'Dependencies installed successfully'
  );
}

/**
 * Finalize project setup
 */
async function finalizeProject(projectPath: string, config: ProjectConfig) {
  return withSpinner(
    'Finalizing project setup',
    async () => {
      // Initialize git repository
      try {
        execSync('git init', { cwd: projectPath, stdio: 'ignore' });
        execSync('git add .', { cwd: projectPath, stdio: 'ignore' });
        execSync('git commit -m "Initial commit: AI Portfolio setup"', { 
          cwd: projectPath, 
          stdio: 'ignore' 
        });
      } catch (error) {
        logger.warn('Failed to initialize git repository');
      }
      
      // Create additional files
      await createReadme(projectPath, config);
      await createGitignore(projectPath);
      
      // Generate initial AI-optimized content
      if (config.ai.enableLlmsTxt) {
        await generateInitialLlmsTxt(projectPath, config);
      }
      
      if (config.ai.enableStructuredData) {
        await generateInitialStructuredData(projectPath, config);
      }
    },
    'Project setup completed'
  );
}

/**
 * Create README.md file
 */
async function createReadme(projectPath: string, config: ProjectConfig) {
  const readmeContent = `# ${config.projectName}

AI-optimized portfolio for ${config.personalInfo.name}

## 🚀 Quick Start

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
\`\`\`

## 🤖 AI Features

- ✅ LLMs.txt for AI discoverability
- ✅ Structured data (Schema.org)
- ✅ SEO optimization
- ✅ Performance optimization

## 📝 Customization

Edit your configuration in \`src/config/user.config.ts\`

## 🚀 Deployment

This portfolio is configured for ${config.deployment.platform} deployment.

\`\`\`bash
# Deploy with CLI
npx create-ai-portfolio deploy ${config.deployment.platform}
\`\`\`

---

Generated with [AI Portfolio Generator](https://github.com/your-repo/ai-portfolio-generator)
`;

  await fs.writeFile(path.join(projectPath, 'README.md'), readmeContent);
}

/**
 * Create .gitignore file
 */
async function createGitignore(projectPath: string) {
  const gitignoreContent = `# Dependencies
node_modules/
.pnp
.pnp.js

# Production build
dist/
build/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# IDE files
.vscode/
.idea/
*.swp
*.swo

# Temporary files
tmp/
temp/

# Cache directories
.cache/
.parcel-cache/
.next/
.nuxt/
.vuepress/dist/

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env.test
`;

  await fs.writeFile(path.join(projectPath, '.gitignore'), gitignoreContent);
}

/**
 * Generate initial llms.txt file
 */
async function generateInitialLlmsTxt(projectPath: string, config: ProjectConfig) {
  const { LLMSTxtGenerator } = await import('../../generators/llms-txt-generator');
  
  // Create basic portfolio config from user input
  const portfolioConfig = {
    personalInfo: config.personalInfo,
    skills: [], // Will be filled by user later
    projects: [],
    experience: [],
    education: [],
    certifications: [],
  };
  
  const llmsContent = LLMSTxtGenerator.generateDefault(portfolioConfig as any, {
    language: 'en',
    includeApiEndpoints: true,
    siteUrl: `https://${config.projectName}.vercel.app`,
  });
  
  await fs.writeFile(path.join(projectPath, 'public/llms.txt'), llmsContent);
}

/**
 * Generate initial structured data
 */
async function generateInitialStructuredData(projectPath: string, config: ProjectConfig) {
  const { StructuredDataGenerator } = await import('../../generators/structured-data-generator');
  
  const portfolioConfig = {
    personalInfo: config.personalInfo,
    skills: [],
    projects: [],
    experience: [],
    education: [],
    certifications: [],
  };
  
  const structuredData = StructuredDataGenerator.generateDefault(
    portfolioConfig as any,
    `https://${config.projectName}.vercel.app`
  );
  
  const structuredDataPath = path.join(projectPath, 'src/data/structured-data.json');
  await fs.writeFile(structuredDataPath, structuredData);
}

/**
 * Show success message and next steps
 */
function showSuccessMessage(projectName: string, skipInstall: boolean) {
  logger.success('\n🎉 Project created successfully!\n');
  
  const nextSteps = [
    `cd ${projectName}`,
    ...(skipInstall ? ['npm install'] : []),
    'npm run dev',
  ];
  
  logger.box([
    '📝 Next steps:',
    '',
    ...nextSteps.map(step => `  ${chalk.cyan('$')} ${step}`),
    '',
    '🤖 AI Features:',
    '  • Edit src/config/user.config.ts to customize your portfolio',
    '  • Run "npx create-ai-portfolio generate llms" to update llms.txt',
    '  • Run "npx create-ai-portfolio test ai-visibility" to test AI optimization',
    '',
    '🚀 Deploy when ready:',
    '  • Run "npx create-ai-portfolio deploy" for automated deployment'
  ]);
  
  logger.info('\n📚 Documentation: https://ai-portfolio-docs.vercel.app');
  logger.info('🆘 Need help? https://github.com/ai-portfolio/support\n');
}