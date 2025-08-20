# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- AI Crawler Behavior Simulator for analyzing website AI visibility
- Multi-format report generation (Console, HTML, JSON, CSV)
- Comprehensive CLI commands for portfolio management
- LLMs.txt generator with multi-language support
- Schema.org structured data generator
- Automated deployment to Vercel, Netlify, and GitHub Pages
- AI visibility testing suite with scoring system
- TypeScript templates for developer portfolios
- Interactive CLI wizards with progress indicators

### Changed
- Enhanced package configuration for npm publishing
- Improved build system with separate CLI and template builds
- Updated TypeScript configuration for better module resolution

### Fixed
- TypeScript dependency issues and import resolution
- CLI executable permissions and shebang configuration

## [1.0.0] - 2024-01-15

### Added
- Initial release of create-ai-portfolio
- Core CLI functionality with init, generate, test, and deploy commands
- Developer portfolio template with Astro and Tailwind CSS
- AI optimization features including llms.txt and structured data
- Comprehensive testing suite
- Documentation and examples

### Features
- **Project Initialization**: Interactive setup with template selection
- **AI Content Generation**: 
  - LLMs.txt files for AI discoverability
  - Schema.org structured data for SEO
  - Sitemap.xml generation
  - Robots.txt with AI crawler support
- **Testing & Analysis**:
  - AI visibility testing
  - Performance analysis
  - SEO optimization checks
- **Deployment**:
  - One-command deployment to multiple platforms
  - Custom domain configuration
  - Environment variable management
- **AI Crawler Simulation**:
  - OpenAI GPT crawler behavior
  - Google Gemini crawler simulation
  - Claude AI assistant crawler
  - Comprehensive analysis reports

### Supported Platforms
- Vercel
- Netlify
- GitHub Pages
- Manual deployment with instructions

### Languages
- English
- Chinese (Simplified and Traditional)

---

## Release Process

This project uses [Changesets](https://github.com/changesets/changesets) for version management.

### Creating a Release

1. Create changes and commit them
2. Run `npx changeset` to create a changeset
3. Commit the changeset
4. Push to main branch
5. GitHub Actions will create a release PR
6. Merge the release PR to publish

### Release Types

- **Patch**: Bug fixes and small improvements
- **Minor**: New features and enhancements
- **Major**: Breaking changes

### Beta Releases

Beta versions are automatically published from the `develop` branch with the format: `1.0.0-beta.abc123`

### Links

- [NPM Package](https://www.npmjs.com/package/create-ai-portfolio)
- [GitHub Repository](https://github.com/ai-portfolio/create-ai-portfolio)
- [Documentation](https://ai-portfolio.dev/docs)
- [Bug Reports](https://github.com/ai-portfolio/create-ai-portfolio/issues)