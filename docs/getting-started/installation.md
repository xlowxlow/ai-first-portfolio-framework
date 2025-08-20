# Installation Guide

Get started with AI-First Portfolio Framework in minutes.

## System Requirements

Before installing, ensure your system meets these requirements:

- **Node.js** 18.0.0 or higher
- **npm** 8.0.0 or higher (or **yarn** 1.22.0+)
- **Git** (recommended for version control)
- **Modern terminal** (Command Prompt, PowerShell, Terminal, etc.)

### Check Your Setup

```bash
# Check Node.js version
node --version
# Should output: v18.0.0 or higher

# Check npm version  
npm --version
# Should output: 8.0.0 or higher

# Check Git version
git --version
# Should output: git version 2.0.0 or higher
```

## Installation Methods

### Method 1: NPX (Recommended)

The fastest way to get started - no global installation required:

```bash
npx create-ai-portfolio@latest my-portfolio
```

### Method 2: Global Installation

Install globally for repeated use:

```bash
# Install globally
npm install -g create-ai-portfolio

# Create new project
create-ai-portfolio init my-portfolio
```

### Method 3: Yarn

If you prefer Yarn:

```bash
# Using Yarn
yarn create ai-portfolio my-portfolio

# Or with global installation
yarn global add create-ai-portfolio
create-ai-portfolio init my-portfolio
```

## Platform-Specific Instructions

### 🍎 macOS

1. **Install Node.js:**
   ```bash
   # Using Homebrew (recommended)
   brew install node
   
   # Or download from https://nodejs.org
   ```

2. **Create your portfolio:**
   ```bash
   npx create-ai-portfolio@latest my-portfolio
   ```

### 🐧 Linux (Ubuntu/Debian)

1. **Install Node.js:**
   ```bash
   # Using NodeSource repository
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Or using snap
   sudo snap install node --classic
   ```

2. **Create your portfolio:**
   ```bash
   npx create-ai-portfolio@latest my-portfolio
   ```

### 💻 Windows

1. **Install Node.js:**
   - Download from [nodejs.org](https://nodejs.org)
   - Run the installer and follow the wizard
   - Or use [Chocolatey](https://chocolatey.org):
     ```powershell
     choco install nodejs
     ```

2. **Open PowerShell or Command Prompt:**
   ```cmd
   npx create-ai-portfolio@latest my-portfolio
   ```

## Development Environment Setup

### Recommended VS Code Extensions

For the best development experience, install these VS Code extensions:

- **Astro** - Official Astro support
- **TypeScript and JavaScript Language Features** - Built-in TS support
- **Tailwind CSS IntelliSense** - Tailwind autocomplete
- **Prettier** - Code formatting
- **ESLint** - Code linting
- **GitLens** - Git integration

### Terminal Setup

For Windows users, we recommend:
- **Windows Terminal** (modern terminal)
- **Git Bash** (Unix-like commands)
- **PowerShell 7+** (cross-platform shell)

## Verification

After installation, verify everything works:

```bash
# Navigate to your project
cd my-portfolio

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:3000
```

You should see your new AI-optimized portfolio running locally! 🎉

## Next Steps

- 🚀 [Quick Start Guide](quick-start.md) - Build your first portfolio
- 🎨 [Customization](../guides/customization.md) - Make it your own
- 🤖 [AI Optimization](../guides/ai-optimization.md) - Maximize AI discoverability

## Troubleshooting Installation

### Common Issues

**Node.js version too old:**
```bash
# Update Node.js to latest LTS
nvm install --lts  # If using nvm
# Or download from nodejs.org
```

**Permission errors (macOS/Linux):**
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm

# Or use npx instead of global install
npx create-ai-portfolio@latest my-portfolio
```

**Network issues:**
```bash
# Use different registry
npm install --registry https://registry.npmmirror.com

# Or clear npm cache
npm cache clean --force
```

**Windows PowerShell execution policy:**
```powershell
# Enable script execution
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

If you're still having issues, check our [Troubleshooting Guide](../troubleshooting/common-issues.md) or [ask for help](https://discord.gg/ai-portfolio).

---

**Next:** [Quick Start Guide →](quick-start.md)