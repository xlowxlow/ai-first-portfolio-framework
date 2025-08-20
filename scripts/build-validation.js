#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');

/**
 * Build validation script
 * Ensures the built package is properly structured and functional
 */

class BuildValidator {
  constructor() {
    this.projectRoot = path.join(__dirname, '..');
    this.distPath = path.join(this.projectRoot, 'dist');
    this.packageJson = JSON.parse(
      fs.readFileSync(path.join(this.projectRoot, 'package.json'), 'utf8')
    );
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

  async validateFileStructure() {
    this.log('Validating build file structure', 'info');

    const requiredFiles = [
      'dist/cli/index.js',
      'dist/cli/index.d.ts',
      'dist/cli/commands/init.js',
      'dist/cli/commands/generate.js',
      'dist/cli/commands/test.js',
      'dist/cli/commands/deploy.js',
      'dist/cli/commands/crawler-simulate.js',
      'dist/tools/ai-crawler-simulator.js',
      'dist/tools/crawler-report-generator.js',
      'dist/generators/llms-txt-generator.js',
      'dist/generators/structured-data-generator.js'
    ];

    const missingFiles = [];
    
    for (const file of requiredFiles) {
      const fullPath = path.join(this.projectRoot, file);
      if (!fs.existsSync(fullPath)) {
        missingFiles.push(file);
      }
    }

    if (missingFiles.length > 0) {
      this.log(`Missing required files: ${missingFiles.join(', ')}`, 'error');
      return false;
    }

    this.log('All required files present', 'success');
    return true;
  }

  async validateCliExecutable() {
    this.log('Validating CLI executable', 'info');

    const cliPath = path.join(this.distPath, 'cli', 'index.js');
    
    try {
      // Check if file is executable (has shebang)
      const content = fs.readFileSync(cliPath, 'utf8');
      if (!content.startsWith('#!/usr/bin/env node')) {
        this.log('CLI file missing shebang line', 'warning');
      }

      // Test CLI commands
      const commands = [
        'node dist/cli/index.js --version',
        'node dist/cli/index.js --help',
        'node dist/cli/index.js crawler list'
      ];

      for (const command of commands) {
        try {
          execSync(command, { 
            cwd: this.projectRoot,
            stdio: 'pipe'
          });
        } catch (error) {
          this.log(`CLI command failed: ${command}`, 'error');
          return false;
        }
      }

      this.log('CLI executable validation passed', 'success');
      return true;
    } catch (error) {
      this.log(`CLI validation failed: ${error.message}`, 'error');
      return false;
    }
  }

  async validatePackageStructure() {
    this.log('Validating package structure', 'info');

    // Check if package.json bin field matches actual file
    const binPath = this.packageJson.bin['create-ai-portfolio'];
    const fullBinPath = path.join(this.projectRoot, binPath);
    
    if (!fs.existsSync(fullBinPath)) {
      this.log(`Binary file not found: ${binPath}`, 'error');
      return false;
    }

    // Check if main entry point exists
    const mainPath = path.join(this.projectRoot, this.packageJson.main);
    if (!fs.existsSync(mainPath)) {
      this.log(`Main entry point not found: ${this.packageJson.main}`, 'error');
      return false;
    }

    // Check if all files in 'files' array exist
    for (const filePattern of this.packageJson.files) {
      if (filePattern === 'dist') {
        if (!fs.existsSync(path.join(this.projectRoot, 'dist'))) {
          this.log(`Files array references missing directory: ${filePattern}`, 'error');
          return false;
        }
      }
    }

    this.log('Package structure validation passed', 'success');
    return true;
  }

  async validateDependencies() {
    this.log('Validating dependencies in built code', 'info');

    try {
      // Check if built files can resolve their dependencies
      const { createRequire } = require('module');
      const require = createRequire(import.meta.url || __filename);
      
      const cliIndexPath = path.join(this.distPath, 'cli', 'index.js');
      const cliCode = fs.readFileSync(cliIndexPath, 'utf8');
      
      // Extract require/import statements (basic check)
      const requireRegex = /require\(['"]([^'"]+)['"]\)/g;
      const importRegex = /from ['"]([^'"]+)['"]/g;
      
      const dependencies = new Set();
      let match;
      
      while ((match = requireRegex.exec(cliCode)) !== null) {
        dependencies.add(match[1]);
      }
      
      while ((match = importRegex.exec(cliCode)) !== null) {
        dependencies.add(match[1]);
      }

      // Check if dependencies are available
      for (const dep of dependencies) {
        if (!dep.startsWith('.') && !dep.startsWith('/')) {
          try {
            require.resolve(dep);
          } catch (error) {
            this.log(`Dependency resolution failed: ${dep}`, 'error');
            return false;
          }
        }
      }

      this.log('Dependency validation passed', 'success');
      return true;
    } catch (error) {
      this.log(`Dependency validation error: ${error.message}`, 'warning');
      return true; // Non-fatal
    }
  }

  async validatePackageSize() {
    this.log('Validating package size', 'info');

    try {
      // Get total size of dist directory
      const getDirectorySize = (dirPath) => {
        let totalSize = 0;
        const items = fs.readdirSync(dirPath, { withFileTypes: true });
        
        for (const item of items) {
          const itemPath = path.join(dirPath, item.name);
          if (item.isDirectory()) {
            totalSize += getDirectorySize(itemPath);
          } else {
            totalSize += fs.statSync(itemPath).size;
          }
        }
        
        return totalSize;
      };

      const distSize = getDirectorySize(this.distPath);
      const sizeMB = (distSize / 1024 / 1024).toFixed(2);
      
      this.log(`Build size: ${sizeMB} MB`, 'info');
      
      // Warn if package is too large
      if (distSize > 50 * 1024 * 1024) { // 50MB
        this.log('Package size is quite large, consider optimizing', 'warning');
      }

      return true;
    } catch (error) {
      this.log(`Size validation error: ${error.message}`, 'warning');
      return true; // Non-fatal
    }
  }

  async validateTypeDefinitions() {
    this.log('Validating TypeScript definitions', 'info');

    try {
      // Check if .d.ts files exist alongside .js files
      const jsFiles = this.findFiles(this.distPath, '.js');
      const missingTypes = [];

      for (const jsFile of jsFiles) {
        const dtsFile = jsFile.replace('.js', '.d.ts');
        if (!fs.existsSync(dtsFile)) {
          missingTypes.push(dtsFile);
        }
      }

      if (missingTypes.length > 0) {
        this.log(`Missing type definitions for: ${missingTypes.slice(0, 5).join(', ')}${missingTypes.length > 5 ? '...' : ''}`, 'warning');
      } else {
        this.log('All type definitions present', 'success');
      }

      return true;
    } catch (error) {
      this.log(`Type definitions validation error: ${error.message}`, 'warning');
      return true; // Non-fatal
    }
  }

  findFiles(dir, extension) {
    const files = [];
    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      if (item.isDirectory()) {
        files.push(...this.findFiles(fullPath, extension));
      } else if (item.name.endsWith(extension)) {
        files.push(fullPath);
      }
    }

    return files;
  }

  async run() {
    console.log(chalk.bold.cyan('\n🔍 Starting build validation\n'));

    const validations = [
      this.validateFileStructure(),
      this.validateCliExecutable(),
      this.validatePackageStructure(),
      this.validateDependencies(),
      this.validatePackageSize(),
      this.validateTypeDefinitions()
    ];

    const results = await Promise.all(validations);
    const passed = results.every(result => result);

    if (passed) {
      console.log(chalk.bold.green('\n✅ Build validation passed!\n'));
      return 0;
    } else {
      console.log(chalk.bold.red('\n❌ Build validation failed!\n'));
      return 1;
    }
  }
}

// Run validation
const validator = new BuildValidator();
validator.run().then(code => process.exit(code));