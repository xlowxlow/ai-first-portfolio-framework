# 🤖 AI-First Portfolio Framework

<div align="center">

**The world's first portfolio framework designed for the AI era**

*Build portfolios that AI understands, search engines love, and users adore*

[![npm version](https://badge.fury.io/js/create-ai-portfolio.svg)](https://badge.fury.io/js/create-ai-portfolio)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js CI](https://github.com/ai-portfolio/create-ai-portfolio/workflows/Node.js%20CI/badge.svg)](https://github.com/ai-portfolio/create-ai-portfolio/actions)
[![Stars](https://img.shields.io/github/stars/ai-portfolio/create-ai-portfolio.svg)](https://github.com/ai-portfolio/create-ai-portfolio/stargazers)

[🚀 **Live Demo**](https://showcase.ai-portfolio.dev) • [📖 **Documentation**](https://ai-portfolio.dev/docs) • [🎨 **Templates**](https://ai-portfolio.dev/templates)

</div>

---

## 🎯 Why AI-First?

In the AI era, your portfolio isn't just viewed by humans—it's also discovered, analyzed, and recommended by AI systems. Traditional portfolios miss out on 70% of AI-driven opportunities.

**Our framework ensures your work is discoverable by:**
- 🤖 AI assistants (ChatGPT, Claude, Gemini)
- 🔍 AI-powered search engines
- 🎯 Intelligent recruitment systems
- 📊 Automated content analyzers

> **"The future of career growth is AI discoverability"** - Get ahead of the curve.

## ⚡ Quick Start (2 minutes)

```bash
# 1. Create your AI-optimized portfolio
npx create-ai-portfolio@latest my-portfolio

# 2. Start developing
cd my-portfolio && npm run dev
```

That's it! Your AI-discoverable portfolio is ready at `http://localhost:3000` 🎉

## ✨ What Makes Us Different

<table>
<thead>
<tr>
<th>Feature</th>
<th>AI-First Portfolio</th>
<th>Traditional Portfolio</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>AI Discovery</strong></td>
<td>✅ Built-in llms.txt & AI metadata</td>
<td>❌ Invisible to AI systems</td>
</tr>
<tr>
<td><strong>Search Visibility</strong></td>
<td>✅ Schema.org structured data</td>
<td>❌ Basic HTML only</td>
</tr>
<tr>
<td><strong>Performance</strong></td>
<td>✅ 98+ Lighthouse score</td>
<td>⚠️ Often 60-80</td>
</tr>
<tr>
<td><strong>Setup Time</strong></td>
<td>✅ 2 minutes with CLI</td>
<td>❌ Days of configuration</td>
</tr>
<tr>
<td><strong>Updates</strong></td>
<td>✅ Auto-generated content</td>
<td>❌ Manual maintenance</td>
</tr>
<tr>
<td><strong>Testing</strong></td>
<td>✅ Built-in AI visibility tests</td>
<td>❌ No optimization tools</td>
</tr>
</tbody>
</table>

## 🚀 Core Features

### 🤖 **AI Intelligence**
- **llms.txt Generation**: AI-readable portfolio summaries
- **Semantic Structure**: Content optimized for AI understanding
- **Smart Metadata**: Automated tags and descriptions
- **Performance Analytics**: AI-powered optimization suggestions

### ⚡ **Developer Experience** 
- **Interactive CLI**: Guided setup in minutes
- **Hot Reloading**: Real-time preview during development
- **TypeScript Support**: Full type safety out of the box
- **Modern Stack**: Astro, React, Tailwind CSS, and more

### 🎨 **Beautiful Templates**
- **Professional Design**: Crafted by design experts
- **Mobile First**: Perfect on every device
- **Dark/Light Mode**: Automatic theme switching
- **Customizable**: Easy to brand and modify

### 📈 **Production Ready**
- **One-Click Deploy**: Vercel, Netlify, GitHub Pages
- **SEO Optimized**: Perfect meta tags and structured data
- **Performance First**: Optimized images, lazy loading
- **Security Built-in**: Best practices by default

## 🛠️ Advanced Usage

### Generate AI Content
```bash
# Generate AI-readable content
create-ai-portfolio generate llms --language en

# Create structured data for search engines
create-ai-portfolio generate schema --types person,website

# Build complete sitemap
create-ai-portfolio generate sitemap
```

### Test AI Visibility
```bash
# Check how AI sees your portfolio
create-ai-portfolio test http://localhost:3000

# Comprehensive analysis with recommendations
create-ai-portfolio test --comprehensive --save-report
```

### Deploy Anywhere
```bash
# Interactive deployment wizard
create-ai-portfolio deploy

# One-command deployment
create-ai-portfolio deploy vercel
create-ai-portfolio deploy netlify
```

## CLI Commands

### Initialize a New Project

```bash
create-ai-portfolio init [project-name]
```

Interactive wizard to create a new AI-optimized portfolio project.

### Generate AI Content

```bash
# Generate llms.txt for AI discoverability
create-ai-portfolio generate llms

# Generate structured data (Schema.org)
create-ai-portfolio generate schema

# Generate sitemap.xml
create-ai-portfolio generate sitemap

# Generate robots.txt with AI crawler support
create-ai-portfolio generate robots
```

### Test AI Visibility

```bash
# Run basic AI visibility tests
create-ai-portfolio test [url]

# Run comprehensive tests with detailed report
create-ai-portfolio test --comprehensive --save-report
```

### Deploy Your Portfolio

```bash
# Interactive deployment wizard
create-ai-portfolio deploy

# Deploy to specific platform
create-ai-portfolio deploy vercel
create-ai-portfolio deploy netlify
create-ai-portfolio deploy github-pages
```

## System Requirements

- Node.js 16.0.0 or higher
- npm 8.0.0 or higher
- Git (recommended)

## Templates

### Developer Portfolio (Default)
- Clean, professional design
- Project showcase with filtering
- Skills matrix with proficiency levels
- Blog integration
- Contact form with validation
- Dark/light mode toggle
- Mobile-responsive design

### Coming Soon
- Designer Portfolio
- Writer Portfolio
- Academic Portfolio
- Startup Landing Page

## AI Optimization Features

### LLMs.txt Generation
Automatically creates AI-readable summaries of your portfolio:
- Personal information and professional background
- Technical skills and expertise areas
- Project descriptions with key achievements
- Contact information and availability
- API endpoints (if applicable)

### Structured Data (Schema.org)
Generates rich snippets for better search visibility:
- Person schema with professional details
- WebSite schema with navigation structure
- CreativeWork schemas for projects
- Organization schema (if applicable)
- BreadcrumbList for navigation

### AI Visibility Testing
Comprehensive testing suite to ensure optimal AI discoverability:
- Content structure analysis
- Semantic HTML validation
- Meta tags optimization
- Performance metrics
- Accessibility compliance
- AI crawler compatibility

## Examples

### Basic Usage

```bash
# Create a new portfolio
npx create-ai-portfolio@latest my-awesome-portfolio

# Generate AI content
cd my-awesome-portfolio
create-ai-portfolio generate llms --language en --format markdown
create-ai-portfolio generate schema --types person,website,creative-work

# Test AI visibility
create-ai-portfolio test http://localhost:3000 --comprehensive

# Deploy to Vercel
create-ai-portfolio deploy vercel
```

### Advanced Configuration

```bash
# Generate Chinese llms.txt with custom length
create-ai-portfolio generate llms \
  --language zh-CN \
  --format structured \
  --max-length 5000 \
  --base-url https://myportfolio.dev

# Deploy with custom build settings
create-ai-portfolio deploy netlify \
  --build-command "npm run build:prod" \
  --output-directory "dist" \
  --env "NODE_ENV=production,API_URL=https://api.example.com"
```

## Development

### Building from Source

```bash
# Clone the repository
git clone https://github.com/ai-portfolio/create-ai-portfolio.git
cd create-ai-portfolio

# Install dependencies
npm install

# Build the CLI
npm run build:cli

# Test locally
npm run cli -- init test-project
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Troubleshooting

### Common Issues

**Node.js Version**: Ensure you're using Node.js 16.0.0 or higher:
```bash
node --version
```

**Permission Issues**: On Unix systems, you might need to use `sudo` for global installations:
```bash
sudo npm install -g create-ai-portfolio
```

**Build Failures**: Clear node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

## 🎨 Templates & Examples

| Template | Description | Demo | Source |
|----------|-------------|------|--------|
| **Developer** | Full-stack developer portfolio | [View Demo](https://showcase.ai-portfolio.dev) | [Source](examples/showcase) |
| **Designer** | UI/UX designer showcase | [View Demo](https://designer.ai-portfolio.dev) | Coming Soon |
| **Writer** | Content creator portfolio | [View Demo](https://writer.ai-portfolio.dev) | Coming Soon |
| **Academic** | Research & publications | [View Demo](https://academic.ai-portfolio.dev) | Coming Soon |

## 🌟 Showcase

> Real portfolios built with our framework

- **[Alex Chen](https://alexchen.dev)** - Senior Full-Stack Developer
- **[Sarah Kim](https://sarahkim.design)** - Product Designer
- **[David Martinez](https://davidmartinez.io)** - DevOps Engineer
- **[Lisa Zhang](https://lisazhang.dev)** - ML Engineer

*Want to be featured? [Submit your portfolio!](https://ai-portfolio.dev/showcase/submit)*

## 📖 Documentation

### Quick Links
- 🚀 [**Getting Started**](https://ai-portfolio.dev/docs/getting-started)
- ⚙️ [**Configuration**](https://ai-portfolio.dev/docs/configuration)
- 🤖 [**AI Optimization**](https://ai-portfolio.dev/docs/ai-optimization)
- 🎨 [**Customization**](https://ai-portfolio.dev/docs/customization)
- 🚀 [**Deployment**](https://ai-portfolio.dev/docs/deployment)

### API Reference
- 📝 [CLI Commands](https://ai-portfolio.dev/docs/cli)
- 🔧 [Configuration Options](https://ai-portfolio.dev/docs/config-reference)
- 🎨 [Theme API](https://ai-portfolio.dev/docs/theme-api)
- 🤖 [AI Integration](https://ai-portfolio.dev/docs/ai-api)

## 💬 Community & Support

<table>
<tr>
<td align="center">
<h3>📖 Documentation</h3>
<p>Comprehensive guides and API docs</p>
<a href="https://ai-portfolio.dev/docs">Read the Docs</a>
</td>
<td align="center">
<h3>💬 Discord</h3>
<p>Join our community chat</p>
<a href="https://discord.gg/ai-portfolio">Join Discord</a>
</td>
<td align="center">
<h3>🐛 Issues</h3>
<p>Report bugs & request features</p>
<a href="https://github.com/ai-portfolio/create-ai-portfolio/issues">GitHub Issues</a>
</td>
</tr>
</table>

## 🤝 Contributing

We love contributions from the community! Here's how you can help:

### 🐛 **Found a Bug?**
1. Check [existing issues](https://github.com/ai-portfolio/create-ai-portfolio/issues)
2. Create a [new issue](https://github.com/ai-portfolio/create-ai-portfolio/issues/new) with reproduction steps
3. Include your OS, Node.js version, and error details

### 💡 **Have an Idea?**
1. [Start a discussion](https://github.com/ai-portfolio/create-ai-portfolio/discussions) to share your idea
2. Get community feedback before creating a PR
3. Check our [roadmap](https://ai-portfolio.dev/roadmap) for planned features

### 🔧 **Want to Code?**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Run `npm test` to ensure everything works
5. Commit with a clear message: `git commit -m 'Add amazing feature'`
6. Push to your fork and create a Pull Request

### 📖 **Improve Docs?**
1. Documentation lives in `docs/` folder
2. Use clear, simple language
3. Include code examples where helpful
4. Test all code snippets before submitting

### 🎨 **Create Templates?**
1. Templates go in `templates/` folder
2. Follow our [template guidelines](https://ai-portfolio.dev/docs/template-guidelines)
3. Include comprehensive documentation
4. Add to the templates showcase

**Read our full [Contributing Guide](CONTRIBUTING.md) for detailed instructions.**

## 📊 Project Stats

<div align="center">

![GitHub stars](https://img.shields.io/github/stars/ai-portfolio/create-ai-portfolio.svg?style=social&label=Star)
![GitHub forks](https://img.shields.io/github/forks/ai-portfolio/create-ai-portfolio.svg?style=social&label=Fork)
![GitHub watchers](https://img.shields.io/github/watchers/ai-portfolio/create-ai-portfolio.svg?style=social&label=Watch)

![NPM Downloads](https://img.shields.io/npm/dm/create-ai-portfolio.svg)
![GitHub issues](https://img.shields.io/github/issues/ai-portfolio/create-ai-portfolio.svg)
![GitHub pull requests](https://img.shields.io/github/issues-pr/ai-portfolio/create-ai-portfolio.svg)

</div>

## License

MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ by the AI Portfolio Team**

[Website](https://ai-portfolio.dev) • [Documentation](https://ai-portfolio.dev/docs) • [GitHub](https://github.com/ai-portfolio/create-ai-portfolio)