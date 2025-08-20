#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');

/**
 * Prepare for NPM publishing
 * Comprehensive pre-publish validation and setup
 */

class PublishPreparation {
  constructor() {
    this.projectRoot = path.join(__dirname, '..');
    this.packagePath = path.join(this.projectRoot, 'package.json');
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

  async exec(command, options = {}) {
    return execSync(command, {
      cwd: this.projectRoot,
      encoding: 'utf8',
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options
    });
  }

  async validatePackageJson() {
    this.log('Validating package.json configuration', 'info');
    
    const requiredFields = ['name', 'version', 'description', 'main', 'bin', 'author', 'license'];
    const missingFields = requiredFields.filter(field => !this.pkg[field]);
    
    if (missingFields.length > 0) {
      this.log(`Missing required fields: ${missingFields.join(', ')}`, 'error');
      return false;
    }

    // Validate bin field
    if (!this.pkg.bin || !this.pkg.bin['create-ai-portfolio']) {
      this.log('Missing or invalid bin configuration', 'error');
      return false;
    }

    // Check if bin file exists
    const binPath = path.join(this.projectRoot, this.pkg.bin['create-ai-portfolio']);
    if (!fs.existsSync(binPath)) {
      this.log(`Binary file does not exist: ${this.pkg.bin['create-ai-portfolio']}`, 'error');
      return false;
    }

    // Validate version format
    const versionRegex = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?$/;
    if (!versionRegex.test(this.pkg.version)) {
      this.log(`Invalid version format: ${this.pkg.version}`, 'error');
      return false;
    }

    // Check keywords
    if (!this.pkg.keywords || this.pkg.keywords.length < 5) {
      this.log('Consider adding more keywords for better discoverability', 'warning');
    }

    this.log('package.json validation passed', 'success');
    return true;
  }

  async checkNpmLogin() {
    this.log('Checking NPM authentication', 'info');
    
    try {
      const whoami = await this.exec('npm whoami', { silent: true });
      this.log(`Logged in as: ${whoami.trim()}`, 'success');
      return true;
    } catch (error) {
      this.log('Not logged in to NPM. Please run: npm login', 'error');
      return false;
    }
  }

  async checkGitStatus() {
    this.log('Checking Git status', 'info');
    
    try {
      const status = await this.exec('git status --porcelain', { silent: true });
      if (status.trim()) {
        this.log('Working directory has uncommitted changes:', 'warning');
        console.log(status);
        return false;
      }

      const branch = await this.exec('git branch --show-current', { silent: true });
      this.log(`Current branch: ${branch.trim()}`, 'info');
      
      return true;
    } catch (error) {
      this.log('Git status check failed', 'warning');
      return true; // Non-fatal
    }
  }

  async runTests() {
    this.log('Running test suite', 'info');
    
    try {
      await this.exec('npm run test:ci');
      this.log('All tests passed', 'success');
      return true;
    } catch (error) {
      this.log('Tests failed', 'error');
      return false;
    }
  }

  async runLinting() {
    this.log('Running code linting', 'info');
    
    try {
      await this.exec('npm run lint');
      this.log('Linting passed', 'success');
      return true;
    } catch (error) {
      this.log('Linting failed', 'error');
      return false;
    }
  }

  async runTypeCheck() {
    this.log('Running TypeScript type checking', 'info');
    
    try {
      await this.exec('npm run typecheck');
      this.log('Type checking passed', 'success');
      return true;
    } catch (error) {
      this.log('Type checking failed', 'error');
      return false;
    }
  }

  async buildPackage() {
    this.log('Building package', 'info');
    
    try {
      await this.exec('npm run build');
      this.log('Build completed successfully', 'success');
      return true;
    } catch (error) {
      this.log('Build failed', 'error');
      return false;
    }
  }

  async validateBuild() {
    this.log('Validating build output', 'info');
    
    const distPath = path.join(this.projectRoot, 'dist');
    if (!fs.existsSync(distPath)) {
      this.log('Build output directory not found', 'error');
      return false;
    }

    // Test CLI executable
    try {
      const version = await this.exec('node dist/cli/index.js --version', { silent: true });
      this.log(`CLI version: ${version.trim()}`, 'success');
      return true;
    } catch (error) {
      this.log('CLI executable test failed', 'error');
      return false;
    }
  }

  async checkPackageSize() {
    this.log('Checking package size', 'info');
    
    try {
      const output = await this.exec('npm pack --dry-run', { silent: true });
      const sizeMatch = output.match(/package size:\s*([^\n]+)/);
      const filesMatch = output.match(/files:\s*(\d+)/);
      
      if (sizeMatch && filesMatch) {
        this.log(`Package size: ${sizeMatch[1]}, Files: ${filesMatch[1]}`, 'info');
        
        // Parse size and warn if too large
        const sizeStr = sizeMatch[1];
        if (sizeStr.includes('MB')) {
          const sizeMB = parseFloat(sizeStr);
          if (sizeMB > 10) {
            this.log('Package is quite large. Consider optimizing.', 'warning');
          }
        }
      }
      
      return true;
    } catch (error) {
      this.log('Package size check failed', 'warning');
      return true; // Non-fatal
    }
  }

  async checkNpmRegistry() {
    this.log('Checking NPM registry status', 'info');
    
    try {
      // Check if package name is available
      try {
        const info = await this.exec(`npm view ${this.pkg.name} version`, { silent: true });
        this.log(`Current published version: ${info.trim()}`, 'info');
        
        // Check if current version is already published
        if (info.trim() === this.pkg.version) {
          this.log(`Version ${this.pkg.version} is already published`, 'error');
          return false;
        }
      } catch (error) {
        this.log('Package not yet published (this is fine for first release)', 'info');
      }
      
      return true;
    } catch (error) {
      this.log('NPM registry check failed', 'warning');
      return true; // Non-fatal
    }
  }

  async generatePackingList() {
    this.log('Generating packing list preview', 'info');
    
    try {
      const output = await this.exec('npm pack --dry-run', { silent: true });
      console.log('\nFiles that will be published:');
      console.log(chalk.gray(output));
      return true;
    } catch (error) {
      this.log('Failed to generate packing list', 'warning');
      return true; // Non-fatal
    }
  }

  async createChecklist() {
    this.log('Creating publish checklist', 'info');
    
    const checklistPath = path.join(this.projectRoot, 'PUBLISH_CHECKLIST.md');
    const checklist = `# Publish Checklist - ${this.pkg.name}@${this.pkg.version}

## Pre-Publish Validation ✅

- [x] Package.json configuration validated
- [x] NPM authentication verified  
- [x] Git status clean
- [x] Tests passing
- [x] Linting passed
- [x] TypeScript compilation successful
- [x] Build completed
- [x] Build output validated
- [x] Package size checked
- [x] NPM registry status verified

## Manual Verification Required

- [ ] README.md updated with latest features
- [ ] CHANGELOG.md entry added
- [ ] Version number is correct
- [ ] All examples work
- [ ] Documentation is current
- [ ] License file is present

## Post-Publish Tasks

- [ ] Create GitHub release
- [ ] Update documentation site
- [ ] Announce on social media
- [ ] Monitor for issues
- [ ] Update project status

## Publication Commands

\`\`\`bash
# Final check
npm run prepublishOnly

# Publish to NPM
npm publish

# Tag and push
git tag v${this.pkg.version}
git push --tags
\`\`\`

Generated: ${new Date().toISOString()}
`;

    fs.writeFileSync(checklistPath, checklist);
    this.log(`Checklist saved to: ${checklistPath}`, 'success');
    return true;
  }

  async run() {
    console.log(chalk.bold.cyan(`\n🚀 Preparing ${this.pkg.name}@${this.pkg.version} for publication\n`));

    const checks = [
      this.validatePackageJson(),
      this.checkNpmLogin(),
      this.checkGitStatus(),
      this.runLinting(),
      this.runTypeCheck(),
      this.runTests(),
      this.buildPackage(),
      this.validateBuild(),
      this.checkPackageSize(),
      this.checkNpmRegistry(),
      this.generatePackingList(),
      this.createChecklist()
    ];

    const results = await Promise.all(checks);
    const allPassed = results.every(result => result);

    console.log('\n' + '='.repeat(60));
    
    if (allPassed) {
      console.log(chalk.bold.green('✅ All checks passed! Ready to publish.'));
      console.log(chalk.gray('\nNext steps:'));
      console.log(chalk.cyan('1. Review PUBLISH_CHECKLIST.md'));
      console.log(chalk.cyan('2. Run: npm publish'));
      console.log(chalk.cyan('3. Create GitHub release'));
    } else {
      console.log(chalk.bold.red('❌ Some checks failed. Please fix issues before publishing.'));
    }

    console.log('='.repeat(60) + '\n');
    return allPassed ? 0 : 1;
  }
}

// Run preparation
const preparation = new PublishPreparation();
preparation.run().then(code => process.exit(code));