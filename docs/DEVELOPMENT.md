# Development Guide

## Getting Started

### Prerequisites
- Node.js 16.0.0 or higher
- npm 8.0.0 or higher
- Git

### Setup
```bash
# Clone the repository
git clone https://github.com/ai-portfolio/create-ai-portfolio.git
cd create-ai-portfolio

# Install dependencies
npm install

# Setup git hooks
npm run prepare

# Build the CLI
npm run build:cli

# Test the CLI
npm run cli -- --version
```

## Development Workflow

### Code Quality
```bash
# Lint code
npm run lint
npm run lint:fix

# Format code
npm run format
npm run format:check

# Type checking
npm run typecheck

# Run tests
npm test
npm run test:watch
npm run test:coverage
```

### Building
```bash
# Clean build
npm run clean
npm run build

# Watch mode for development
npm run build:watch

# Validate build
npm run validate-build
```

### Testing CLI Locally
```bash
# Build and link globally
npm run build:cli
npm link

# Test commands
create-ai-portfolio --version
create-ai-portfolio --help
create-ai-portfolio init test-project

# Unlink when done
npm unlink -g create-ai-portfolio
```

## Project Structure

```
create-ai-portfolio/
├── src/
│   ├── cli/                 # CLI commands and utilities
│   │   ├── commands/        # Individual CLI commands
│   │   └── utils/          # CLI helper utilities
│   ├── tools/              # AI crawler simulator and tools
│   ├── generators/         # Content generators (LLMs.txt, schema)
│   └── config/             # Configuration system
├── templates/              # Portfolio templates
│   └── developer/          # Default developer template
├── scripts/                # Build and release scripts
├── docs/                   # Documentation
├── examples/               # Usage examples
└── .github/workflows/      # CI/CD workflows
```

## Commands Overview

### CLI Commands
- `create-ai-portfolio init` - Initialize new project
- `create-ai-portfolio generate` - Generate AI content
- `create-ai-portfolio test` - Test AI visibility
- `create-ai-portfolio deploy` - Deploy to platforms
- `create-ai-portfolio crawler` - AI crawler simulation

### Development Scripts
- `npm run dev` - Start development server
- `npm run build` - Build everything
- `npm run build:cli` - Build CLI only
- `npm run build:templates` - Build templates only
- `npm run test` - Run tests
- `npm run lint` - Lint code
- `npm run typecheck` - Type check

### Release Scripts
- `npm run prepare-publish` - Pre-publish validation
- `npm run release` - Automated release with changesets
- `npm run release:manual` - Manual release process
- `npm run release:beta` - Beta release

## Testing

### Unit Tests
```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Integration Tests
```bash
# Test CLI installation
npm pack
npm install -g ./create-ai-portfolio-*.tgz
create-ai-portfolio --version
npm uninstall -g create-ai-portfolio
```

### Manual Testing
```bash
# Test project creation
create-ai-portfolio init test-project --template developer
cd test-project
npm run dev

# Test generators
create-ai-portfolio generate llms
create-ai-portfolio generate schema

# Test crawler simulation
create-ai-portfolio crawler simulate http://localhost:3000
```

## Contributing

### Branching Strategy
- `main` - Production releases
- `develop` - Development branch
- `feature/*` - Feature branches
- `fix/*` - Bug fix branches

### Commit Convention
We use [Conventional Commits](https://conventionalcommits.org/):

```
feat: add AI crawler simulation
fix: resolve TypeScript compilation issue
docs: update README with new examples
chore: update dependencies
```

### Pull Request Process
1. Create feature branch from `develop`
2. Make changes with tests
3. Ensure all checks pass
4. Create PR to `develop`
5. Review and merge
6. Delete feature branch

## Release Process

### Automated Release (Recommended)
```bash
# 1. Create changeset
npx changeset

# 2. Commit and push
git add .changeset/
git commit -m "chore: add changeset for feature"
git push

# 3. GitHub Actions will create release PR
# 4. Merge PR to publish
```

### Manual Release
```bash
# 1. Prepare for publish
npm run prepare-publish

# 2. Manual release
npm run release:manual

# 3. Or step by step
npm version patch
npm run build
npm publish
git push --follow-tags
```

### Beta Release
```bash
# Automatic beta from develop branch
git checkout develop
git push origin develop
# GitHub Actions will publish beta version
```

## Debugging

### CLI Debugging
```bash
# Enable debug mode
DEBUG=create-ai-portfolio* npm run cli -- init test

# Verbose output
create-ai-portfolio init test --verbose

# Check built CLI
node dist/cli/index.js --help
```

### Build Issues
```bash
# Clean everything
npm run clean
rm -rf node_modules package-lock.json
npm install
npm run build

# Check TypeScript issues
npm run typecheck

# Validate build
npm run validate-build
```

### Test Debugging
```bash
# Run specific test
npm test -- --testNamePattern="AI Crawler"

# Debug test
node --inspect-brk node_modules/.bin/jest --runInBand
```

## Performance Optimization

### Build Size
- Monitor build output size
- Use tree-shaking where possible
- Lazy load large dependencies
- Optimize bundle with webpack-bundle-analyzer

### CLI Performance
- Minimize startup time
- Use lazy loading for commands
- Cache computation results
- Optimize puppeteer usage

## Security

### Code Security
- No hardcoded secrets
- Validate all inputs
- Sanitize user data
- Use secure dependencies

### Publishing Security
- NPM 2FA enabled
- Signed commits
- Protected main branch
- Security audit in CI

## Documentation

### Code Documentation
- JSDoc comments for public APIs
- README for each major module
- Examples for complex features
- Architecture decision records

### User Documentation
- Installation guide
- Usage examples
- API reference
- Troubleshooting guide

## Support

### Getting Help
- Check existing issues
- Read documentation
- Join Discord community
- Email support team

### Reporting Issues
- Use issue templates
- Provide reproduction steps
- Include system information
- Add relevant logs