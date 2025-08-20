# Publishing Guide

## Pre-Publishing Checklist

### 🔍 Code Quality
- [ ] All tests passing (`npm test`)
- [ ] TypeScript compilation successful (`npm run typecheck`)
- [ ] Linting passes (`npm run lint`)
- [ ] Code formatted (`npm run format`)
- [ ] No security vulnerabilities (`npm audit`)

### 📦 Package Configuration
- [ ] `package.json` version updated
- [ ] `package.json` description accurate
- [ ] Keywords relevant and complete
- [ ] Main entry point correct
- [ ] Bin field pointing to correct executable
- [ ] Files array includes only necessary files
- [ ] Dependencies up to date
- [ ] License file present

### 🏗️ Build Validation
- [ ] Clean build successful (`npm run build`)
- [ ] CLI executable works (`./dist/cli/index.js --version`)
- [ ] All commands functional
- [ ] Type definitions generated
- [ ] Build size reasonable (<50MB)

### 📚 Documentation
- [ ] README.md updated with latest features
- [ ] CHANGELOG.md entries added
- [ ] API documentation current
- [ ] Examples working
- [ ] Installation instructions correct

### 🧪 Testing
- [ ] Unit tests comprehensive
- [ ] Integration tests passing
- [ ] CLI commands tested manually
- [ ] Package installation tested locally
- [ ] Cross-platform compatibility verified

### 🔐 Security & Permissions
- [ ] No secrets in code
- [ ] No hardcoded credentials
- [ ] Proper file permissions
- [ ] Dependencies scanned for vulnerabilities
- [ ] NPM token configured in CI/CD

## Publishing Process

### Method 1: Automated (Recommended)

Using Changesets for automated version management:

```bash
# 1. Create a changeset
npx changeset

# 2. Commit the changeset
git add .changeset/
git commit -m "chore: add changeset"
git push

# 3. GitHub Actions will create a release PR
# 4. Review and merge the PR
# 5. Package will be automatically published
```

### Method 2: Manual Release

```bash
# 1. Run pre-publishing checks
npm run prepublishOnly

# 2. Update version
npm version patch # or minor/major

# 3. Push tags
git push --follow-tags

# 4. Publish to NPM
npm publish

# 5. Create GitHub release
gh release create v$(node -p "require('./package.json').version") --generate-notes
```

### Method 3: Beta Release

```bash
# 1. Build and test
npm run build
npm run test:ci

# 2. Version for beta
npm version prerelease --preid=beta

# 3. Publish with beta tag
npm publish --tag beta
```

## Post-Publishing Tasks

### 📢 Announcements
- [ ] GitHub release created with notes
- [ ] Documentation site updated
- [ ] Social media announcement
- [ ] Community notifications (Discord, Slack)
- [ ] Blog post (for major releases)

### 🔍 Verification
- [ ] Package appears on NPM registry
- [ ] Installation works: `npm install -g create-ai-portfolio`
- [ ] CLI commands work globally
- [ ] Documentation links working
- [ ] Download stats tracking setup

### 📊 Monitoring
- [ ] NPM download statistics
- [ ] Error tracking (Sentry/similar)
- [ ] User feedback monitoring
- [ ] GitHub issues/discussions
- [ ] Performance metrics

## Troubleshooting

### Common Issues

**Build Failures**
```bash
# Clean everything and rebuild
npm run clean
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Permission Errors**
```bash
# Check npm login status
npm whoami

# Login if needed
npm login
```

**Publish Failures**
```bash
# Check package name availability
npm view create-ai-portfolio

# Check version conflicts
npm view create-ai-portfolio versions --json
```

**CLI Not Working**
```bash
# Verify bin field in package.json
node -p "require('./package.json').bin"

# Check file permissions
ls -la dist/cli/index.js

# Test locally
node dist/cli/index.js --version
```

### Emergency Procedures

**Unpublish (within 24 hours)**
```bash
npm unpublish create-ai-portfolio@1.0.0
```

**Deprecate Version**
```bash
npm deprecate create-ai-portfolio@1.0.0 "Please upgrade to latest version"
```

**Fix Critical Issue**
```bash
# Quick patch release
npm version patch
npm run prepublishOnly
npm publish
```

## Version Strategy

### Semantic Versioning
- **MAJOR** (x.0.0): Breaking changes, API changes
- **MINOR** (1.x.0): New features, backwards compatible
- **PATCH** (1.0.x): Bug fixes, security patches

### Pre-release Versions
- **Alpha**: `1.0.0-alpha.1` - Early development
- **Beta**: `1.0.0-beta.1` - Feature complete, testing
- **RC**: `1.0.0-rc.1` - Release candidate

### Release Frequency
- **Patch**: Weekly or as needed for bugs
- **Minor**: Monthly for features
- **Major**: Quarterly or bi-annually

## Rollback Plan

If a release causes issues:

1. **Immediate**: Deprecate problematic version
```bash
npm deprecate create-ai-portfolio@1.0.1 "Critical issue, please upgrade"
```

2. **Quick Fix**: Patch release with fix
3. **Major Issue**: Consider unpublishing (if within 24 hours)
4. **Communication**: Notify users via all channels

## Release Notes Template

```markdown
## [1.0.0] - 2024-01-15

### 🚀 Features
- New AI crawler simulation system
- Enhanced report generation

### 🐛 Bug Fixes
- Fixed TypeScript compilation issues
- Resolved CLI permission problems

### 💥 Breaking Changes
- Changed API structure for generators
- Updated minimum Node.js version to 16

### 📚 Documentation
- Updated installation guide
- Added new examples

### 🔧 Internal
- Improved build system
- Enhanced test coverage
```

## Support Channels

- **Issues**: GitHub Issues for bug reports
- **Discussions**: GitHub Discussions for questions
- **Email**: support@ai-portfolio.dev
- **Discord**: Community Discord server
- **Twitter**: @ai_portfolio for updates