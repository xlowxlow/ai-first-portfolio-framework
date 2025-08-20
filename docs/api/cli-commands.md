# CLI Commands Reference

Complete reference for all AI-First Portfolio CLI commands.

## Global Options

These options work with all commands:

```bash
--help, -h        Show help information
--version, -v     Show version number
--verbose         Enable verbose output
--quiet, -q       Suppress non-essential output
--config          Specify config file path
--no-color        Disable colored output
```

## Core Commands

### `init` - Initialize New Portfolio

Create a new AI-optimized portfolio project.

```bash
create-ai-portfolio init [project-name] [options]

# Examples
create-ai-portfolio init my-portfolio
create-ai-portfolio init my-site --template developer
create-ai-portfolio init . --force  # Initialize in current directory
```

**Options:**
- `--template, -t <name>` - Choose template (developer, designer, writer, academic)
- `--force, -f` - Overwrite existing files
- `--no-install` - Skip dependency installation
- `--package-manager <pm>` - Use specific package manager (npm, yarn, pnpm)
- `--git` - Initialize git repository
- `--no-git` - Skip git initialization

**Interactive Prompts:**
- Project name
- Your full name
- Email address
- Job title/role
- Location
- Social profiles
- Template selection
- AI optimization level

---

### `generate` - Generate AI Content

Generate various AI-optimized files and content.

#### `generate llms`

Generate llms.txt file for AI discoverability.

```bash
create-ai-portfolio generate llms [options]

# Examples
create-ai-portfolio generate llms
create-ai-portfolio generate llms --language en
create-ai-portfolio generate llms --format structured --max-length 10000
```

**Options:**
- `--language, -l <code>` - Language code (en, zh-CN, es, fr, de, ja)
- `--format, -f <type>` - Output format (simple, structured, detailed)
- `--max-length <number>` - Maximum content length
- `--base-url <url>` - Base URL for links
- `--output, -o <path>` - Output file path
- `--template <name>` - Use specific template

#### `generate schema`

Generate Schema.org structured data.

```bash
create-ai-portfolio generate schema [options]

# Examples
create-ai-portfolio generate schema
create-ai-portfolio generate schema --types person,website
create-ai-portfolio generate schema --validate
```

**Options:**
- `--types <list>` - Schema types (person, website, creative-work, organization, all)
- `--validate` - Validate generated schema
- `--output, -o <path>` - Output directory
- `--inline` - Generate inline JSON-LD
- `--external` - Generate external JSON files

#### `generate sitemap`

Generate XML sitemap.

```bash
create-ai-portfolio generate sitemap [options]

# Examples
create-ai-portfolio generate sitemap
create-ai-portfolio generate sitemap --base-url https://example.com
```

**Options:**
- `--base-url <url>` - Base URL for sitemap
- `--output, -o <path>` - Output file path
- `--include <patterns>` - Include patterns
- `--exclude <patterns>` - Exclude patterns
- `--priority <default>` - Default priority (0.0-1.0)

#### `generate robots`

Generate robots.txt with AI crawler support.

```bash
create-ai-portfolio generate robots [options]

# Examples
create-ai-portfolio generate robots
create-ai-portfolio generate robots --sitemap-url https://example.com/sitemap.xml
```

**Options:**
- `--sitemap-url <url>` - Sitemap URL
- `--allow-ai-crawlers` - Allow AI-specific crawlers
- `--output, -o <path>` - Output file path
- `--custom <rules>` - Add custom rules

#### `generate all`

Generate all AI-optimized content.

```bash
create-ai-portfolio generate all [options]

# Examples
create-ai-portfolio generate all
create-ai-portfolio generate all --language en --base-url https://example.com
```

---

### `test` - AI Visibility Testing

Test how well AI systems can understand your portfolio.

```bash
create-ai-portfolio test [url] [options]

# Examples
create-ai-portfolio test http://localhost:3000
create-ai-portfolio test https://example.com --comprehensive
create-ai-portfolio test . --local --save-report
```

**Options:**
- `--comprehensive, -c` - Run comprehensive tests
- `--check <aspects>` - Test specific aspects (llms, schema, meta, content, performance)
- `--save-report, -s` - Save detailed report
- `--output, -o <path>` - Report output path
- `--format <type>` - Report format (json, html, markdown)
- `--local, -l` - Test local files
- `--threshold <score>` - Minimum score threshold
- `--fix` - Auto-fix simple issues

**Test Categories:**
- **llms.txt** - AI-readable content file
- **schema** - Structured data validation
- **meta** - Meta tags and SEO
- **content** - Content structure and semantics
- **performance** - Page speed and optimization
- **accessibility** - A11y compliance
- **mobile** - Mobile-friendliness

---

### `deploy` - Deployment

Deploy your portfolio to various platforms.

```bash
create-ai-portfolio deploy [platform] [options]

# Examples
create-ai-portfolio deploy              # Interactive platform selection
create-ai-portfolio deploy vercel
create-ai-portfolio deploy netlify --build-command "npm run build"
create-ai-portfolio deploy github-pages --branch gh-pages
```

**Platforms:**
- `vercel` - Deploy to Vercel
- `netlify` - Deploy to Netlify
- `github-pages` - Deploy to GitHub Pages
- `aws-amplify` - Deploy to AWS Amplify
- `cloudflare-pages` - Deploy to Cloudflare Pages

**Options:**
- `--build-command <cmd>` - Custom build command
- `--output-directory <dir>` - Build output directory
- `--env <vars>` - Environment variables
- `--domain <name>` - Custom domain
- `--branch <name>` - Target branch (GitHub Pages)
- `--force` - Force deployment

#### Platform-Specific Options

**Vercel:**
```bash
--project-name <name>    # Vercel project name
--team <slug>           # Team slug
--regions <list>        # Deployment regions
```

**Netlify:**
```bash
--site-name <name>      # Site name
--functions-dir <dir>   # Functions directory
--headers-file <path>   # Custom headers file
```

**GitHub Pages:**
```bash
--repository <repo>     # Repository name
--username <user>       # GitHub username
--token <token>         # GitHub token
```

---

### `dev` - Development Server

Start development server with AI-specific features.

```bash
create-ai-portfolio dev [options]

# Examples
create-ai-portfolio dev
create-ai-portfolio dev --port 4000
create-ai-portfolio dev --host 0.0.0.0 --ai-preview
```

**Options:**
- `--port, -p <number>` - Port number (default: 3000)
- `--host <address>` - Host address (default: localhost)
- `--open, -o` - Open browser automatically
- `--ai-preview` - Enable AI preview features
- `--live-reload` - Enable live reloading
- `--https` - Use HTTPS

---

### `build` - Build Production

Build optimized production version.

```bash
create-ai-portfolio build [options]

# Examples
create-ai-portfolio build
create-ai-portfolio build --output dist --optimize
```

**Options:**
- `--output, -o <dir>` - Output directory
- `--optimize` - Enable advanced optimizations
- `--analyze` - Analyze bundle size
- `--compress` - Enable compression
- `--source-maps` - Generate source maps

---

## Utility Commands

### `status` - Project Status

Check project health and AI optimization status.

```bash
create-ai-portfolio status [options]

# Examples
create-ai-portfolio status
create-ai-portfolio status --check-ai --check-deps
```

**Options:**
- `--check-ai` - Check AI optimization status
- `--check-deps` - Check dependency updates
- `--check-config` - Validate configuration
- `--check-files` - Check required files
- `--verbose` - Show detailed information

### `update` - Update Framework

Update AI-First Portfolio framework and dependencies.

```bash
create-ai-portfolio update [options]

# Examples
create-ai-portfolio update
create-ai-portfolio update --check-only
create-ai-portfolio update --force
```

**Options:**
- `--check-only` - Check for updates without installing
- `--force` - Force update even if breaking changes
- `--backup` - Create backup before updating
- `--dev` - Include dev dependencies

### `doctor` - Diagnose Issues

Diagnose common problems and suggest fixes.

```bash
create-ai-portfolio doctor [options]

# Examples
create-ai-portfolio doctor
create-ai-portfolio doctor --fix
create-ai-portfolio doctor --ai-check
```

**Options:**
- `--fix` - Auto-fix detected issues
- `--ai-check` - Focus on AI-related issues
- `--verbose` - Show detailed diagnosis
- `--skip <checks>` - Skip specific checks

### `clean` - Clean Project

Clean build artifacts and temporary files.

```bash
create-ai-portfolio clean [options]

# Examples
create-ai-portfolio clean
create-ai-portfolio clean --deep
create-ai-portfolio clean --cache
```

**Options:**
- `--deep` - Deep clean including node_modules
- `--cache` - Clean cache only
- `--build` - Clean build output only
- `--all` - Clean everything

---

## Configuration Commands

### `config` - Manage Configuration

Manage project configuration.

```bash
create-ai-portfolio config <action> [key] [value] [options]

# Examples
create-ai-portfolio config get
create-ai-portfolio config set ai.llms.enabled true
create-ai-portfolio config delete deployment.vercel
create-ai-portfolio config validate
```

**Actions:**
- `get [key]` - Get configuration value(s)
- `set <key> <value>` - Set configuration value
- `delete <key>` - Delete configuration key
- `list` - List all configuration
- `validate` - Validate configuration
- `reset` - Reset to defaults

---

## Advanced Commands

### `plugin` - Plugin Management

Manage plugins and extensions.

```bash
create-ai-portfolio plugin <action> [name] [options]

# Examples
create-ai-portfolio plugin list
create-ai-portfolio plugin install @ai-portfolio/analytics
create-ai-portfolio plugin remove theme-dark
```

**Actions:**
- `list` - List installed plugins
- `search <query>` - Search available plugins
- `install <name>` - Install plugin
- `remove <name>` - Remove plugin
- `update [name]` - Update plugin(s)

### `theme` - Theme Management

Manage themes and templates.

```bash
create-ai-portfolio theme <action> [name] [options]

# Examples
create-ai-portfolio theme list
create-ai-portfolio theme install modern-dark
create-ai-portfolio theme switch minimal
```

**Actions:**
- `list` - List available themes
- `install <name>` - Install theme
- `switch <name>` - Switch to theme
- `customize <name>` - Customize theme
- `create <name>` - Create new theme

---

## Exit Codes

- `0` - Success
- `1` - General error
- `2` - Invalid arguments
- `3` - File not found
- `4` - Network error
- `5` - Build failed
- `6` - Test failed
- `7` - Deployment failed

## Environment Variables

```bash
AI_PORTFOLIO_CONFIG      # Config file path
AI_PORTFOLIO_CACHE_DIR   # Cache directory
AI_PORTFOLIO_LOG_LEVEL   # Log level (debug, info, warn, error)
AI_PORTFOLIO_NO_UPDATE   # Disable update checks
AI_PORTFOLIO_API_KEY     # API key for premium features
```

## Examples

### Complete Workflow

```bash
# 1. Create new portfolio
create-ai-portfolio init my-portfolio --template developer
cd my-portfolio

# 2. Generate AI content
create-ai-portfolio generate all --language en

# 3. Test AI visibility
create-ai-portfolio test --comprehensive --save-report

# 4. Start development
create-ai-portfolio dev --ai-preview

# 5. Build and deploy
create-ai-portfolio build --optimize
create-ai-portfolio deploy vercel
```

### Maintenance Routine

```bash
# Weekly maintenance
create-ai-portfolio status --check-ai
create-ai-portfolio update --check-only
create-ai-portfolio generate llms  # Update AI content
create-ai-portfolio test --threshold 90

# Monthly deep check
create-ai-portfolio doctor --ai-check
create-ai-portfolio clean --cache
```

---

**Need help with a specific command?**
```bash
create-ai-portfolio <command> --help
```

**Report issues or request features:**
- [GitHub Issues](https://github.com/ai-portfolio/create-ai-portfolio/issues)
- [Discord Community](https://discord.gg/ai-portfolio)