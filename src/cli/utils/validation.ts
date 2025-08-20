import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { logger } from './logger';

/**
 * Validation utilities for CLI operations
 */

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
  suggestion?: string;
}

/**
 * Validate project name
 */
export function validateProjectName(name: string): boolean | string {
  if (!name || name.trim().length === 0) {
    return 'Project name cannot be empty';
  }

  // Check length
  if (name.length < 2) {
    return 'Project name must be at least 2 characters long';
  }

  if (name.length > 50) {
    return 'Project name must be less than 50 characters';
  }

  // Check for valid characters (npm package name rules)
  if (!/^[a-z0-9-_]+$/i.test(name)) {
    return 'Project name can only contain letters, numbers, hyphens, and underscores';
  }

  // Check for reserved names
  const reservedNames = [
    'node_modules', 'package', 'npm', 'test', 'tests', 'spec', 'specs',
    'src', 'lib', 'bin', 'build', 'dist', 'public', 'static',
    'con', 'prn', 'aux', 'nul', 'com1', 'com2', 'com3', 'com4', 'com5',
    'com6', 'com7', 'com8', 'com9', 'lpt1', 'lpt2', 'lpt3', 'lpt4',
    'lpt5', 'lpt6', 'lpt7', 'lpt8', 'lpt9'
  ];

  if (reservedNames.includes(name.toLowerCase())) {
    return `"${name}" is a reserved name and cannot be used`;
  }

  // Check if name starts with dot or underscore
  if (name.startsWith('.') || name.startsWith('_')) {
    return 'Project name cannot start with a dot or underscore';
  }

  return true;
}

/**
 * Check if directory is empty
 */
export async function checkDirectoryEmpty(dirPath: string): Promise<boolean> {
  try {
    const files = await fs.readdir(dirPath);
    return files.length === 0;
  } catch (error) {
    // Directory doesn't exist, so it's "empty"
    return true;
  }
}

/**
 * Validate email address
 */
export function validateEmail(email: string): boolean | string {
  if (!email || email.trim().length === 0) {
    return 'Email address is required';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }

  if (email.length > 254) {
    return 'Email address is too long';
  }

  return true;
}

/**
 * Validate URL
 */
export function validateUrl(url: string, required = false): boolean | string {
  if (!url || url.trim().length === 0) {
    return required ? 'URL is required' : true;
  }

  try {
    const urlObj = new URL(url);
    
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return 'URL must use HTTP or HTTPS protocol';
    }
    
    return true;
  } catch (error) {
    return 'Please enter a valid URL';
  }
}

/**
 * Validate GitHub username
 */
export function validateGitHubUsername(username: string, required = false): boolean | string {
  if (!username || username.trim().length === 0) {
    return required ? 'GitHub username is required' : true;
  }

  // GitHub username rules
  if (!/^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(username)) {
    return 'GitHub username can only contain alphanumeric characters and hyphens, and cannot start or end with a hyphen';
  }

  if (username.length > 39) {
    return 'GitHub username cannot be longer than 39 characters';
  }

  return true;
}

/**
 * Validate portfolio configuration
 */
export function validatePortfolioConfig(config: any): ValidationError[] {
  const errors: ValidationError[] = [];

  // Personal info validation
  if (!config.personalInfo) {
    errors.push({
      field: 'personalInfo',
      message: 'Personal information is required',
      severity: 'error',
      suggestion: 'Add personalInfo object to your configuration'
    });
  } else {
    const personalInfo = config.personalInfo;

    if (!personalInfo.name || personalInfo.name.trim().length === 0) {
      errors.push({
        field: 'personalInfo.name',
        message: 'Name is required',
        severity: 'error',
        suggestion: 'Add your full name to personalInfo.name'
      });
    }

    if (!personalInfo.title || personalInfo.title.trim().length === 0) {
      errors.push({
        field: 'personalInfo.title',
        message: 'Professional title is required',
        severity: 'error',
        suggestion: 'Add your professional title to personalInfo.title'
      });
    }

    if (!personalInfo.bio || personalInfo.bio.trim().length < 50) {
      errors.push({
        field: 'personalInfo.bio',
        message: 'Bio should be at least 50 characters long',
        severity: 'warning',
        suggestion: 'Write a more detailed bio to help AI systems understand your background'
      });
    }

    if (personalInfo.email) {
      const emailValid = validateEmail(personalInfo.email);
      if (emailValid !== true) {
        errors.push({
          field: 'personalInfo.email',
          message: emailValid as string,
          severity: 'error',
          suggestion: 'Provide a valid email address'
        });
      }
    }

    if (personalInfo.website) {
      const urlValid = validateUrl(personalInfo.website);
      if (urlValid !== true) {
        errors.push({
          field: 'personalInfo.website',
          message: urlValid as string,
          severity: 'error',
          suggestion: 'Provide a valid website URL'
        });
      }
    }

    if (personalInfo.github) {
      const githubValid = validateGitHubUsername(personalInfo.github);
      if (githubValid !== true) {
        errors.push({
          field: 'personalInfo.github',
          message: githubValid as string,
          severity: 'error',
          suggestion: 'Provide a valid GitHub username'
        });
      }
    }
  }

  // Skills validation
  if (!config.skills || !Array.isArray(config.skills) || config.skills.length === 0) {
    errors.push({
      field: 'skills',
      message: 'At least one skill is required',
      severity: 'warning',
      suggestion: 'Add your technical skills to help showcase your expertise'
    });
  } else {
    config.skills.forEach((skill: any, index: number) => {
      if (!skill.name || skill.name.trim().length === 0) {
        errors.push({
          field: `skills[${index}].name`,
          message: 'Skill name is required',
          severity: 'error',
          suggestion: 'Provide a name for each skill'
        });
      }

      if (!skill.level) {
        errors.push({
          field: `skills[${index}].level`,
          message: 'Skill level is required',
          severity: 'warning',
          suggestion: 'Specify skill level (Beginner, Intermediate, Advanced, Expert)'
        });
      } else if (!['Beginner', 'Intermediate', 'Advanced', 'Expert'].includes(skill.level)) {
        errors.push({
          field: `skills[${index}].level`,
          message: 'Invalid skill level',
          severity: 'warning',
          suggestion: 'Use one of: Beginner, Intermediate, Advanced, Expert'
        });
      }

      if (!skill.category) {
        errors.push({
          field: `skills[${index}].category`,
          message: 'Skill category is recommended',
          severity: 'warning',
          suggestion: 'Categorize skills (Frontend, Backend, Database, etc.)'
        });
      }
    });
  }

  // Projects validation
  if (!config.projects || !Array.isArray(config.projects)) {
    errors.push({
      field: 'projects',
      message: 'Projects array is required',
      severity: 'warning',
      suggestion: 'Add your portfolio projects to showcase your work'
    });
  } else if (config.projects.length === 0) {
    errors.push({
      field: 'projects',
      message: 'At least one project is recommended',
      severity: 'warning',
      suggestion: 'Add your best projects to create an impressive portfolio'
    });
  } else {
    config.projects.forEach((project: any, index: number) => {
      if (!project.title || project.title.trim().length === 0) {
        errors.push({
          field: `projects[${index}].title`,
          message: 'Project title is required',
          severity: 'error',
          suggestion: 'Provide a title for each project'
        });
      }

      if (!project.description || project.description.trim().length < 20) {
        errors.push({
          field: `projects[${index}].description`,
          message: 'Project description should be at least 20 characters',
          severity: 'warning',
          suggestion: 'Write a detailed description to help others understand your project'
        });
      }

      if (!project.technologies || !Array.isArray(project.technologies) || project.technologies.length === 0) {
        errors.push({
          field: `projects[${index}].technologies`,
          message: 'Project technologies are recommended',
          severity: 'warning',
          suggestion: 'List the technologies used in this project'
        });
      }

      if (project.demoUrl) {
        const urlValid = validateUrl(project.demoUrl);
        if (urlValid !== true) {
          errors.push({
            field: `projects[${index}].demoUrl`,
            message: urlValid as string,
            severity: 'error',
            suggestion: 'Provide a valid demo URL'
          });
        }
      }

      if (project.githubUrl) {
        const urlValid = validateUrl(project.githubUrl);
        if (urlValid !== true) {
          errors.push({
            field: `projects[${index}].githubUrl`,
            message: urlValid as string,
            severity: 'error',
            suggestion: 'Provide a valid GitHub URL'
          });
        }
      }
    });
  }

  return errors;
}

/**
 * Validate file exists
 */
export async function validateFileExists(filePath: string): Promise<boolean | string> {
  try {
    const stats = await fs.stat(filePath);
    if (stats.isFile()) {
      return true;
    } else {
      return `${filePath} exists but is not a file`;
    }
  } catch (error) {
    return `File does not exist: ${filePath}`;
  }
}

/**
 * Validate directory exists
 */
export async function validateDirectoryExists(dirPath: string): Promise<boolean | string> {
  try {
    const stats = await fs.stat(dirPath);
    if (stats.isDirectory()) {
      return true;
    } else {
      return `${dirPath} exists but is not a directory`;
    }
  } catch (error) {
    return `Directory does not exist: ${dirPath}`;
  }
}

/**
 * Validate JSON file
 */
export async function validateJsonFile(filePath: string): Promise<boolean | string> {
  const fileExists = await validateFileExists(filePath);
  if (fileExists !== true) {
    return fileExists;
  }

  try {
    const content = await fs.readFile(filePath, 'utf8');
    JSON.parse(content);
    return true;
  } catch (error) {
    return `Invalid JSON in file: ${filePath}`;
  }
}

/**
 * Validate package.json
 */
export async function validatePackageJson(projectRoot: string): Promise<ValidationError[]> {
  const errors: ValidationError[] = [];
  const packageJsonPath = path.join(projectRoot, 'package.json');

  const fileExists = await validateFileExists(packageJsonPath);
  if (fileExists !== true) {
    errors.push({
      field: 'package.json',
      message: 'package.json file not found',
      severity: 'error',
      suggestion: 'Create a package.json file with npm init'
    });
    return errors;
  }

  try {
    const packageJson = await fs.readJson(packageJsonPath);

    if (!packageJson.name) {
      errors.push({
        field: 'package.json.name',
        message: 'Package name is required',
        severity: 'error',
        suggestion: 'Add a name field to package.json'
      });
    }

    if (!packageJson.scripts) {
      errors.push({
        field: 'package.json.scripts',
        message: 'No scripts found',
        severity: 'warning',
        suggestion: 'Add build and dev scripts to package.json'
      });
    } else {
      if (!packageJson.scripts.build) {
        errors.push({
          field: 'package.json.scripts.build',
          message: 'Build script is recommended',
          severity: 'warning',
          suggestion: 'Add a build script for production builds'
        });
      }

      if (!packageJson.scripts.dev && !packageJson.scripts.start) {
        errors.push({
          field: 'package.json.scripts.dev',
          message: 'Development script is recommended',
          severity: 'warning',
          suggestion: 'Add a dev or start script for development'
        });
      }
    }

    if (!packageJson.dependencies && !packageJson.devDependencies) {
      errors.push({
        field: 'package.json.dependencies',
        message: 'No dependencies found',
        severity: 'warning',
        suggestion: 'Install necessary dependencies for your project'
      });
    }

  } catch (error) {
    errors.push({
      field: 'package.json',
      message: 'Invalid package.json format',
      severity: 'error',
      suggestion: 'Fix JSON syntax errors in package.json'
    });
  }

  return errors;
}

/**
 * Display validation errors
 */
export function displayValidationErrors(errors: ValidationError[]): void {
  if (errors.length === 0) {
    logger.success('✅ No validation errors found');
    return;
  }

  const errorCount = errors.filter(e => e.severity === 'error').length;
  const warningCount = errors.filter(e => e.severity === 'warning').length;

  logger.section('Validation Results');

  if (errorCount > 0) {
    logger.error(`Found ${errorCount} error(s) and ${warningCount} warning(s):`);
  } else {
    logger.warn(`Found ${warningCount} warning(s):`);
  }

  console.log(); // Empty line

  errors.forEach(error => {
    const icon = error.severity === 'error' ? chalk.red('❌') : chalk.yellow('⚠️');
    const fieldName = chalk.cyan(error.field);
    const message = error.severity === 'error' ? chalk.red(error.message) : chalk.yellow(error.message);

    console.log(`  ${icon} ${fieldName}: ${message}`);

    if (error.suggestion) {
      console.log(`      ${chalk.gray('💡')} ${chalk.gray(error.suggestion)}`);
    }
  });

  console.log(); // Empty line

  if (errorCount > 0) {
    logger.error('Please fix the errors above before proceeding');
  } else {
    logger.info('Warnings don\'t prevent deployment but should be addressed for better results');
  }
}

/**
 * Validate build output
 */
export async function validateBuildOutput(buildDir: string): Promise<ValidationError[]> {
  const errors: ValidationError[] = [];

  const dirExists = await validateDirectoryExists(buildDir);
  if (dirExists !== true) {
    errors.push({
      field: 'build.output',
      message: 'Build output directory not found',
      severity: 'error',
      suggestion: `Run build command to generate ${buildDir} directory`
    });
    return errors;
  }

  try {
    const files = await fs.readdir(buildDir);
    
    if (files.length === 0) {
      errors.push({
        field: 'build.output',
        message: 'Build output directory is empty',
        severity: 'error',
        suggestion: 'Build process may have failed, check build logs'
      });
    }

    // Check for essential files
    const indexExists = files.some(file => file === 'index.html');
    if (!indexExists) {
      errors.push({
        field: 'build.index',
        message: 'index.html not found in build output',
        severity: 'error',
        suggestion: 'Ensure your build process generates an index.html file'
      });
    }

    // Check for AI optimization files
    const publicDir = path.join(buildDir, 'public');
    if (await fs.pathExists(publicDir)) {
      const publicFiles = await fs.readdir(publicDir);
      
      if (!publicFiles.includes('llms.txt')) {
        errors.push({
          field: 'ai.llms',
          message: 'llms.txt not found in build output',
          severity: 'warning',
          suggestion: 'Generate llms.txt with: create-ai-portfolio generate llms'
        });
      }

      if (!publicFiles.includes('robots.txt')) {
        errors.push({
          field: 'ai.robots',
          message: 'robots.txt not found in build output',
          severity: 'warning',
          suggestion: 'Generate robots.txt with: create-ai-portfolio generate robots'
        });
      }
    }

  } catch (error) {
    errors.push({
      field: 'build.validation',
      message: 'Failed to validate build output',
      severity: 'error',
      suggestion: 'Check build directory permissions and contents'
    });
  }

  return errors;
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>\"'&]/g, '');
}

/**
 * Validate environment variables
 */
export function validateEnvironmentVariables(envVars: Record<string, string>): ValidationError[] {
  const errors: ValidationError[] = [];

  Object.entries(envVars).forEach(([key, value]) => {
    // Check key format
    if (!/^[A-Z_][A-Z0-9_]*$/.test(key)) {
      errors.push({
        field: `env.${key}`,
        message: 'Environment variable names should be UPPERCASE with underscores',
        severity: 'warning',
        suggestion: `Consider renaming to ${key.toUpperCase().replace(/[^A-Z0-9_]/g, '_')}`
      });
    }

    // Check for sensitive data
    const sensitivePatterns = [
      /password/i,
      /secret/i,
      /token/i,
      /key/i,
      /credential/i
    ];

    if (sensitivePatterns.some(pattern => pattern.test(key)) && value.length < 10) {
      errors.push({
        field: `env.${key}`,
        message: 'Sensitive environment variable seems too short',
        severity: 'warning',
        suggestion: 'Ensure sensitive values are properly set and secure'
      });
    }

    // Check for URLs
    if (key.includes('URL') && value && !value.startsWith('http')) {
      errors.push({
        field: `env.${key}`,
        message: 'URL environment variable should start with http:// or https://',
        severity: 'warning',
        suggestion: 'Ensure URL values are complete and valid'
      });
    }
  });

  return errors;
}