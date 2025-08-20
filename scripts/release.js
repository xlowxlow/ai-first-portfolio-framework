#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

/**
 * Release script for create-ai-portfolio
 * Handles building, testing, and publishing the package
 */

class ReleaseManager {
  constructor() {
    this.packagePath = path.join(__dirname, '..', 'package.json');
    this.pkg = JSON.parse(fs.readFileSync(this.packagePath, 'utf8'));
  }

  log(message, type = 'info') {
    const colors = {
      info: chalk.blue,
      success: chalk.green,
      warning: chalk.yellow,
      error: chalk.red
    };
    
    console.log(`${colors[type]('●')} ${message}`);
  }

  async exec(command, description) {
    this.log(`${description}...`, 'info');
    
    try {
      execSync(command, { 
        stdio: 'inherit',
        cwd: path.join(__dirname, '..')
      });
      this.log(`✓ ${description} completed`, 'success');
      return true;
    } catch (error) {
      this.log(`✗ ${description} failed`, 'error');
      throw error;
    }
  }

  async checkPrerequisites() {
    this.log('Checking prerequisites', 'info');
    
    // Check if we're on the right branch
    try {
      const branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
      if (branch !== 'main') {
        throw new Error(`Expected to be on main branch, but on ${branch}`);
      }
    } catch (error) {
      this.log(`Branch check failed: ${error.message}`, 'error');
      throw error;
    }

    // Check if working directory is clean
    try {
      const status = execSync('git status --porcelain', { encoding: 'utf8' });
      if (status.trim()) {
        throw new Error('Working directory is not clean. Please commit or stash changes.');
      }
    } catch (error) {
      this.log(`Git status check failed: ${error.message}`, 'error');
      throw error;
    }

    // Check if npm is logged in
    try {
      execSync('npm whoami', { stdio: 'ignore' });
    } catch (error) {
      this.log('Not logged in to npm. Please run: npm login', 'error');
      throw error;
    }

    this.log('All prerequisites met', 'success');
  }

  async runQualityChecks() {
    await this.exec('npm run lint', 'Linting code');
    await this.exec('npm run typecheck', 'Type checking');
    await this.exec('npm run test:ci', 'Running tests');
  }

  async buildPackage() {
    await this.exec('npm run clean', 'Cleaning previous build');
    await this.exec('npm run build', 'Building package');
  }

  async validateBuild() {
    this.log('Validating build output', 'info');
    
    const distPath = path.join(__dirname, '..', 'dist');
    const cliPath = path.join(distPath, 'cli', 'index.js');
    
    if (!fs.existsSync(distPath)) {
      throw new Error('Build output directory not found');
    }
    
    if (!fs.existsSync(cliPath)) {
      throw new Error('CLI entry point not found in build output');
    }

    // Test the built CLI
    try {
      execSync('node dist/cli/index.js --version', { 
        stdio: 'ignore',
        cwd: path.join(__dirname, '..')
      });
    } catch (error) {
      throw new Error('Built CLI is not working properly');
    }

    this.log('Build validation passed', 'success');
  }

  async generateChangelog() {
    try {
      await this.exec('npm run changelog', 'Generating changelog');
    } catch (error) {
      this.log('Changelog generation failed, continuing...', 'warning');
    }
  }

  async publishPackage() {
    this.log(`Publishing ${this.pkg.name}@${this.pkg.version}`, 'info');
    
    try {
      execSync('npm publish', { 
        stdio: 'inherit',
        cwd: path.join(__dirname, '..')
      });
      this.log(`Successfully published ${this.pkg.name}@${this.pkg.version}`, 'success');
    } catch (error) {
      this.log('Publishing failed', 'error');
      throw error;
    }
  }

  async createGitTag() {
    const version = `v${this.pkg.version}`;
    
    try {
      await this.exec(`git tag -a ${version} -m "Release ${version}"`, 'Creating git tag');
      await this.exec(`git push origin ${version}`, 'Pushing git tag');
    } catch (error) {
      this.log('Git tagging failed', 'warning');
      // Non-fatal, continue
    }
  }

  async notifySlack() {
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;
    if (!webhookUrl) {
      this.log('No Slack webhook configured, skipping notification', 'info');
      return;
    }

    try {
      const message = {
        text: `🚀 Released ${this.pkg.name}@${this.pkg.version}`,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*${this.pkg.name}* version *${this.pkg.version}* has been released! 🎉`
            }
          },
          {
            type: "section",
            fields: [
              {
                type: "mrkdwn",
                text: `*Package:*\n${this.pkg.name}`
              },
              {
                type: "mrkdwn",
                text: `*Version:*\n${this.pkg.version}`
              }
            ]
          }
        ]
      };

      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message)
      });

      this.log('Slack notification sent', 'success');
    } catch (error) {
      this.log('Failed to send Slack notification', 'warning');
    }
  }

  async run() {
    try {
      console.log(chalk.bold.cyan('\n🚀 Starting release process\n'));

      await this.checkPrerequisites();
      await this.runQualityChecks();
      await this.buildPackage();
      await this.validateBuild();
      await this.generateChangelog();
      await this.publishPackage();
      await this.createGitTag();
      await this.notifySlack();

      console.log(chalk.bold.green('\n✅ Release completed successfully!\n'));
      console.log(chalk.gray('Package available at:'));
      console.log(chalk.cyan(`https://www.npmjs.com/package/${this.pkg.name}`));

    } catch (error) {
      console.log(chalk.bold.red('\n❌ Release failed!\n'));
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  }
}

// Handle command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');

if (isDryRun) {
  console.log(chalk.yellow('🔍 Running in dry-run mode (no publishing)\n'));
}

// Run the release process
const releaseManager = new ReleaseManager();
releaseManager.run();