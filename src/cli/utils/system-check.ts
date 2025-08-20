import { execSync } from 'child_process';
import semver from 'semver';
import chalk from 'chalk';
import { logger } from './logger';

export interface SystemRequirements {
  node: {
    required: string;
    current?: string;
    satisfied: boolean;
  };
  npm: {
    required: string;
    current?: string;
    satisfied: boolean;
  };
  git: {
    required: boolean;
    available: boolean;
  };
  dependencies: {
    [key: string]: {
      available: boolean;
      version?: string;
    };
  };
}

/**
 * Check Node.js version
 */
export async function checkNodeVersion(required = '16.0.0'): Promise<void> {
  const currentVersion = process.version;
  const versionWithoutV = currentVersion.replace('v', '');
  
  if (!semver.gte(versionWithoutV, required)) {
    logger.error(`Node.js version ${required} or higher is required`);
    logger.error(`Current version: ${currentVersion}`);
    logger.info(`Please upgrade Node.js from: ${chalk.cyan('https://nodejs.org/')}`);
    process.exit(1);
  }
  
  logger.debug(`✅ Node.js version: ${currentVersion}`);
}

/**
 * Check npm version
 */
export async function checkNpmVersion(required = '8.0.0'): Promise<void> {
  try {
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    
    if (!semver.gte(npmVersion, required)) {
      logger.warn(`npm version ${required} or higher is recommended`);
      logger.warn(`Current version: ${npmVersion}`);
      logger.info(`Upgrade with: ${chalk.cyan('npm install -g npm@latest')}`);
    } else {
      logger.debug(`✅ npm version: ${npmVersion}`);
    }
  } catch (error) {
    logger.error('npm is not installed or not accessible');
    process.exit(1);
  }
}

/**
 * Check if Git is installed
 */
export async function checkGit(): Promise<boolean> {
  try {
    const gitVersion = execSync('git --version', { encoding: 'utf8', stdio: 'pipe' }).trim();
    logger.debug(`✅ Git available: ${gitVersion}`);
    return true;
  } catch (error) {
    logger.warn('Git is not installed or not accessible');
    logger.info(`Install Git from: ${chalk.cyan('https://git-scm.com/')}`);
    return false;
  }
}

/**
 * Check for required dependencies
 */
export async function checkDependencies(dependencies: string[] = []): Promise<void> {
  const results: Record<string, boolean> = {};
  
  for (const dep of dependencies) {
    try {
      execSync(`${dep} --version`, { stdio: 'ignore' });
      results[dep] = true;
      logger.debug(`✅ ${dep} is available`);
    } catch (error) {
      results[dep] = false;
      logger.warn(`⚠️ ${dep} is not installed`);
    }
  }
  
  const missing = Object.entries(results)
    .filter(([_, available]) => !available)
    .map(([dep]) => dep);
  
  if (missing.length > 0) {
    logger.warn(`Missing optional dependencies: ${missing.join(', ')}`);
    logger.info('Some features may not be available without these dependencies');
  }
}

/**
 * Get system information
 */
export function getSystemInfo(): SystemRequirements {
  const requirements: SystemRequirements = {
    node: {
      required: '16.0.0',
      current: process.version,
      satisfied: false
    },
    npm: {
      required: '8.0.0',
      satisfied: false
    },
    git: {
      required: false,
      available: false
    },
    dependencies: {}
  };
  
  // Check Node.js
  const nodeVersion = process.version.replace('v', '');
  requirements.node.satisfied = semver.gte(nodeVersion, requirements.node.required);
  
  // Check npm
  try {
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    requirements.npm.current = npmVersion;
    requirements.npm.satisfied = semver.gte(npmVersion, requirements.npm.required);
  } catch (error) {
    requirements.npm.satisfied = false;
  }
  
  // Check Git
  try {
    execSync('git --version', { stdio: 'ignore' });
    requirements.git.available = true;
  } catch (error) {
    requirements.git.available = false;
  }
  
  return requirements;
}

/**
 * Display system information
 */
export function displaySystemInfo(requirements: SystemRequirements): void {
  logger.section('System Information');
  
  // Node.js
  const nodeIcon = requirements.node.satisfied ? '✅' : '❌';
  const nodeColor = requirements.node.satisfied ? chalk.green : chalk.red;
  console.log(`  ${nodeIcon} Node.js: ${nodeColor(requirements.node.current || 'Not found')} (required: ${requirements.node.required})`);
  
  // npm
  const npmIcon = requirements.npm.satisfied ? '✅' : '❌';
  const npmColor = requirements.npm.satisfied ? chalk.green : chalk.red;
  console.log(`  ${npmIcon} npm: ${npmColor(requirements.npm.current || 'Not found')} (required: ${requirements.npm.required})`);
  
  // Git
  const gitIcon = requirements.git.available ? '✅' : '⚠️';
  const gitColor = requirements.git.available ? chalk.green : chalk.yellow;
  console.log(`  ${gitIcon} Git: ${gitColor(requirements.git.available ? 'Available' : 'Not found')}`);
  
  // Dependencies
  if (Object.keys(requirements.dependencies).length > 0) {
    console.log('\n  Optional Dependencies:');
    Object.entries(requirements.dependencies).forEach(([dep, info]) => {
      const icon = info.available ? '✅' : '⚠️';
      const color = info.available ? chalk.green : chalk.yellow;
      const version = info.version ? ` (${info.version})` : '';
      console.log(`    ${icon} ${dep}: ${color(info.available ? 'Available' : 'Not found')}${version}`);
    });
  }
}

/**
 * Check disk space
 */
export function checkDiskSpace(): { available: number; required: number; sufficient: boolean } {
  try {
    const stats = require('fs').statSync('.');
    // This is a simplified check - in a real implementation, 
    // you would use platform-specific commands or libraries
    return {
      available: 1000, // MB - placeholder
      required: 100,   // MB
      sufficient: true
    };
  } catch (error) {
    return {
      available: 0,
      required: 100,
      sufficient: false
    };
  }
}

/**
 * Check network connectivity
 */
export async function checkNetworkConnectivity(): Promise<boolean> {
  try {
    const { execSync } = require('child_process');
    
    // Try to ping a reliable server
    if (process.platform === 'win32') {
      execSync('ping -n 1 8.8.8.8', { stdio: 'ignore', timeout: 5000 });
    } else {
      execSync('ping -c 1 8.8.8.8', { stdio: 'ignore', timeout: 5000 });
    }
    
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Check for common issues
 */
export async function diagnoseCommonIssues(): Promise<string[]> {
  const issues: string[] = [];
  
  // Check Node.js version
  const nodeVersion = process.version.replace('v', '');
  if (semver.lt(nodeVersion, '16.0.0')) {
    issues.push(`Node.js version is outdated (${process.version}). Please upgrade to v16.0.0 or higher.`);
  }
  
  // Check npm version
  try {
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    if (semver.lt(npmVersion, '8.0.0')) {
      issues.push(`npm version is outdated (${npmVersion}). Please upgrade with: npm install -g npm@latest`);
    }
  } catch (error) {
    issues.push('npm is not installed or not accessible.');
  }
  
  // Check for common permission issues (Unix-like systems)
  if (process.platform !== 'win32') {
    try {
      const homeDir = process.env.HOME;
      const npmPrefix = execSync('npm config get prefix', { encoding: 'utf8' }).trim();
      
      if (npmPrefix.startsWith('/usr') && !npmPrefix.includes(homeDir || '')) {
        issues.push('npm may have permission issues. Consider using a Node version manager like nvm.');
      }
    } catch (error) {
      // Ignore npm config errors
    }
  }
  
  // Check network connectivity
  const hasNetwork = await checkNetworkConnectivity();
  if (!hasNetwork) {
    issues.push('Network connectivity issues detected. Some features may not work properly.');
  }
  
  // Check for Node.js path issues
  const nodePath = process.execPath;
  if (!nodePath.includes('node')) {
    issues.push('Node.js executable path seems unusual. This may cause issues with child processes.');
  }
  
  return issues;
}

/**
 * Run comprehensive system check
 */
export async function runSystemCheck(): Promise<{
  passed: boolean;
  requirements: SystemRequirements;
  issues: string[];
}> {
  logger.info('Running system compatibility check...\n');
  
  const requirements = getSystemInfo();
  const issues = await diagnoseCommonIssues();
  
  displaySystemInfo(requirements);
  
  if (issues.length > 0) {
    logger.section('Potential Issues');
    issues.forEach(issue => {
      logger.warn(`⚠️ ${issue}`);
    });
  }
  
  const criticalIssues = issues.filter(issue => 
    issue.includes('Node.js') || issue.includes('npm')
  );
  
  const passed = requirements.node.satisfied && 
                 requirements.npm.satisfied && 
                 criticalIssues.length === 0;
  
  if (passed) {
    logger.success('\n✅ System check passed! Your system is ready for AI Portfolio development.');
  } else {
    logger.error('\n❌ System check failed. Please fix the issues above before proceeding.');
  }
  
  return {
    passed,
    requirements,
    issues
  };
}

/**
 * Check for updates
 */
export async function checkForUpdates(currentVersion: string): Promise<{
  hasUpdate: boolean;
  latestVersion?: string;
  updateAvailable?: boolean;
}> {
  try {
    const { execSync } = require('child_process');
    
    // Check npm registry for latest version
    const latestVersion = execSync('npm view create-ai-portfolio version', { 
      encoding: 'utf8',
      timeout: 5000 
    }).trim();
    
    const hasUpdate = semver.gt(latestVersion, currentVersion);
    
    if (hasUpdate) {
      logger.info(`📦 Update available: ${chalk.cyan(latestVersion)} (current: ${currentVersion})`);
      logger.info(`Update with: ${chalk.cyan('npm install -g create-ai-portfolio@latest')}`);
    }
    
    return {
      hasUpdate,
      latestVersion,
      updateAvailable: hasUpdate
    };
    
  } catch (error) {
    // Silently fail - update check is not critical
    return {
      hasUpdate: false
    };
  }
}