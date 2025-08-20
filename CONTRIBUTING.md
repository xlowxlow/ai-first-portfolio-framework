# Contributing to AI-First Portfolio

We're thrilled that you're interested in contributing to the AI-First Portfolio Framework! This guide will help you get started and make your first contribution.

## 🌟 Ways to Contribute

### 🐛 **Bug Reports**
Found a bug? Help us fix it!
- Check [existing issues](https://github.com/ai-portfolio/create-ai-portfolio/issues) first
- Use our [bug report template](https://github.com/ai-portfolio/create-ai-portfolio/issues/new?template=bug_report.md)
- Include reproduction steps, OS, Node.js version, and error messages

### 💡 **Feature Requests**
Have an idea for improvement?
- Start a [discussion](https://github.com/ai-portfolio/create-ai-portfolio/discussions) first
- Check our [roadmap](https://ai-portfolio.dev/roadmap) for planned features
- Use our [feature request template](https://github.com/ai-portfolio/create-ai-portfolio/issues/new?template=feature_request.md)

### 🔧 **Code Contributions**
Ready to code? Here's how:
- Pick an issue labeled `good first issue` or `help wanted`
- Fork the repository and create a feature branch
- Follow our coding standards and add tests
- Submit a Pull Request with a clear description

### 📖 **Documentation**
Improve our docs:
- Fix typos and unclear explanations
- Add examples and tutorials
- Translate content to other languages
- Create video walkthroughs

### 🎨 **Templates & Themes**
Create new templates:
- Follow our [template guidelines](docs/guides/template-guidelines.md)
- Ensure AI optimization compliance
- Include comprehensive documentation
- Add to the templates showcase

## 🚀 Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then:
git clone https://github.com/YOUR-USERNAME/create-ai-portfolio.git
cd create-ai-portfolio
```

### 2. Set Up Development Environment

```bash
# Install dependencies
npm install

# Install CLI globally for testing
npm run build:cli
npm link

# Verify installation
create-ai-portfolio --version
```

### 3. Project Structure

```
create-ai-portfolio/
├── packages/
│   ├── cli/                 # CLI source code
│   ├── core/                # Core functionality
│   ├── templates/           # Portfolio templates
│   └── themes/              # Visual themes
├── docs/                    # Documentation
├── examples/                # Example portfolios
├── tests/                   # Test suites
└── tools/                   # Development tools
```

### 4. Development Workflow

```bash
# Create a feature branch
git checkout -b feature/amazing-feature

# Make your changes
# ...

# Run tests
npm test

# Run linter
npm run lint

# Build and test CLI
npm run build:cli
npm run test:cli

# Test with example project
create-ai-portfolio init test-project --template developer
```

## 📝 Coding Standards

### Code Style

We use ESLint and Prettier for consistent formatting:

```bash
# Format code
npm run format

# Check linting
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

### TypeScript Guidelines

- Use strict TypeScript configuration
- Provide explicit types for public APIs
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

```typescript
// Good
interface PortfolioConfig {
  name: string
  email: string
  aiOptimization: boolean
}

/**
 * Generates an AI-optimized llms.txt file
 * @param config Portfolio configuration
 * @param options Generation options
 * @returns Generated content as string
 */
export async function generateLlmsTxt(
  config: PortfolioConfig,
  options: GenerationOptions = {}
): Promise<string> {
  // Implementation
}

// Avoid
function doStuff(data: any): any {
  return data.map(x => x.thing)
}
```

### Testing Requirements

All contributions must include tests:

```bash
# Run all tests
npm test

# Run specific test suite
npm test -- --grep "CLI tests"

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

**Test Categories:**
- **Unit Tests**: Test individual functions and classes
- **Integration Tests**: Test CLI commands end-to-end
- **Template Tests**: Verify template generation works
- **AI Tests**: Validate AI optimization features

## 🏗️ Building Components

### CLI Commands

When adding new CLI commands:

```typescript
// packages/cli/src/commands/my-command.ts
import { Command } from 'commander'
import { createCommand } from '../utils/command'

export const myCommand = createCommand({
  name: 'my-command',
  description: 'Description of what this command does',
  options: [
    {
      flags: '--option <value>',
      description: 'Option description',
      defaultValue: 'default'
    }
  ],
  action: async (options) => {
    // Command implementation
    console.log('Executing my-command with options:', options)
  }
})
```

### Templates

When creating templates:

```typescript
// packages/templates/src/developer/index.ts
import { TemplateConfig } from '../types'

export const developerTemplate: TemplateConfig = {
  name: 'developer',
  displayName: 'Developer Portfolio',
  description: 'Professional portfolio for software developers',
  category: 'professional',
  tags: ['react', 'typescript', 'responsive', 'ai-optimized'],
  preview: 'https://developer-template.ai-portfolio.dev',
  aiOptimization: {
    llmsTxt: true,
    structuredData: true,
    semanticMarkup: true
  },
  files: [
    // Template files configuration
  ]
}
```

### AI Features

When implementing AI optimization features:

```typescript
// packages/core/src/ai/llms-generator.ts
import { AIOptimizationConfig } from '../types'

export class LlmsGenerator {
  constructor(private config: AIOptimizationConfig) {}

  /**
   * Generate llms.txt content optimized for AI understanding
   */
  async generate(): Promise<string> {
    // Validate input
    this.validateConfig()
    
    // Generate structured content
    const sections = await this.generateSections()
    
    // Format for AI consumption
    return this.formatContent(sections)
  }

  private validateConfig(): void {
    // Validation logic
  }
}
```

## 📋 Pull Request Process

### 1. Pre-submission Checklist

- [ ] Code follows style guidelines
- [ ] All tests pass (`npm test`)
- [ ] New features have tests
- [ ] Documentation is updated
- [ ] AI optimization is maintained
- [ ] No breaking changes (or clearly documented)
- [ ] Commit messages follow conventional format

### 2. Commit Message Format

We follow [Conventional Commits](https://conventionalcommits.org/):

```
type(scope): brief description

Detailed explanation of changes (optional)

Closes #123
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(cli): add llms.txt generation command

fix(template): resolve mobile responsive issue in developer template

docs(api): update CLI commands documentation

test(ai): add comprehensive AI visibility tests
```

### 3. Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## AI Optimization
- [ ] Maintains AI discoverability
- [ ] Updates llms.txt generation if needed
- [ ] Preserves structured data

## Documentation
- [ ] Code is documented
- [ ] User documentation updated
- [ ] API documentation updated

## Screenshots (if applicable)
```

## 🎨 Template Guidelines

### Design Principles

1. **AI-First**: All templates must be optimized for AI understanding
2. **Performance**: Fast loading, optimized assets
3. **Accessibility**: WCAG 2.1 AA compliance
4. **Mobile-First**: Responsive design
5. **Semantic**: Proper HTML5 semantic elements

### Required Files

```
template-name/
├── README.md              # Template documentation
├── preview.png            # Template preview image
├── config.json            # Template configuration
├── src/
│   ├── components/        # React components
│   ├── layouts/          # Page layouts
│   ├── pages/            # Page templates
│   └── styles/           # Styling files
└── data/
    ├── profile.template.ts  # Profile data template
    ├── projects.template.ts # Projects template
    └── content.template.ts  # Content templates
```

### AI Optimization Requirements

- **Structured Data**: Schema.org markup for all content
- **Semantic HTML**: Proper heading hierarchy, landmarks
- **Meta Tags**: Complete OpenGraph and Twitter Card tags
- **llms.txt Support**: Template must generate AI-readable content
- **Performance**: Lighthouse score 90+

## 🧪 Testing Guidelines

### Writing Tests

```typescript
// Good test structure
describe('LlmsGenerator', () => {
  let generator: LlmsGenerator
  
  beforeEach(() => {
    generator = new LlmsGenerator(mockConfig)
  })
  
  describe('generate()', () => {
    it('should generate valid llms.txt content', async () => {
      const result = await generator.generate()
      
      expect(result).toContain('# AI-Readable Portfolio Summary')
      expect(result).toMatch(/Name: .+/)
      expect(result).toMatch(/Role: .+/)
    })
    
    it('should throw error for invalid config', async () => {
      generator = new LlmsGenerator(invalidConfig)
      
      await expect(generator.generate()).rejects.toThrow(
        'Invalid configuration: missing required field "name"'
      )
    })
  })
})
```

### Integration Testing

```bash
# Test CLI commands
npm run test:cli

# Test template generation
npm run test:templates

# Test AI optimization
npm run test:ai

# Test full workflow
npm run test:e2e
```

## 📚 Documentation Standards

### Writing Style

- Use clear, concise language
- Include code examples for complex concepts
- Provide both beginner and advanced examples
- Use active voice when possible
- Keep sentences short and focused

### Code Examples

- Always test code examples before publishing
- Include expected output when relevant
- Use realistic examples, not foo/bar
- Add comments for complex logic

```bash
# Good example with context
create-ai-portfolio generate llms --language en --format structured
# Generates a comprehensive llms.txt file in English
# Output: public/llms.txt with structured sections
```

## 🌍 Internationalization

We welcome translations and localization:

### Adding New Languages

1. Create language files:
```
packages/cli/src/locales/
├── en.json     # English (base)
├── zh-CN.json  # Simplified Chinese
├── es.json     # Spanish
└── fr.json     # French
```

2. Follow the existing key structure:
```json
{
  "commands": {
    "init": {
      "description": "Create a new AI-optimized portfolio",
      "prompts": {
        "name": "What's your full name?",
        "email": "What's your email address?"
      }
    }
  }
}
```

3. Test with the new language:
```bash
create-ai-portfolio init --language zh-CN
```

## 🎯 Performance Guidelines

### Bundle Size

- Keep CLI bundle under 10MB
- Lazy load non-essential dependencies
- Use tree shaking for libraries
- Optimize template assets

### Runtime Performance

- CLI commands should complete under 30 seconds
- Template generation under 10 seconds
- AI content generation under 5 seconds
- Use streaming for large operations

### Memory Usage

- Monitor memory usage in tests
- Clean up resources properly
- Use streams for large file operations
- Avoid memory leaks in CLI commands

## 🔒 Security Guidelines

### Input Validation

- Validate all user inputs
- Sanitize file paths
- Check file permissions
- Prevent command injection

```typescript
// Good: Input validation
function validateProjectName(name: string): boolean {
  const validName = /^[a-zA-Z0-9-_]+$/.test(name)
  const validLength = name.length >= 1 && name.length <= 50
  return validName && validLength
}

// Good: Path sanitization
import path from 'path'
const safePath = path.resolve(process.cwd(), userInput)
if (!safePath.startsWith(process.cwd())) {
  throw new Error('Invalid path: directory traversal detected')
}
```

### Dependencies

- Regular security audits (`npm audit`)
- Keep dependencies updated
- Avoid dependencies with known vulnerabilities
- Use minimal dependencies when possible

## 🏆 Recognition

### Contributors Hall of Fame

We recognize our contributors in:
- [Contributors page](https://ai-portfolio.dev/contributors)
- Repository README
- Release notes
- Social media shoutouts

### Contribution Levels

- 🌟 **First-time contributor**: First PR merged
- 🚀 **Regular contributor**: 5+ PRs merged
- 🏅 **Core contributor**: 20+ PRs merged
- 🎯 **Maintainer**: Significant ongoing contributions

## 📞 Getting Help

### Community Support

- 💬 [Discord Community](https://discord.gg/ai-portfolio)
- 🗣️ [GitHub Discussions](https://github.com/ai-portfolio/create-ai-portfolio/discussions)
- 📧 [Email Support](mailto:support@ai-portfolio.dev)

### For Contributors

- 👥 [Contributor Discord](https://discord.gg/ai-portfolio-contributors)
- 📅 [Monthly contributor calls](https://calendar.ai-portfolio.dev)
- 📖 [Development wiki](https://github.com/ai-portfolio/create-ai-portfolio/wiki)

## 📜 Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

### Our Standards

- **Be respectful**: Treat everyone with respect and kindness
- **Be inclusive**: Welcome newcomers and different perspectives
- **Be constructive**: Focus on what's best for the community
- **Be patient**: Help others learn and grow
- **Be collaborative**: Work together towards common goals

## 🎉 Thank You!

Every contribution, no matter how small, makes a difference. Thank you for helping make AI-First Portfolio the best portfolio framework for the AI era!

---

**Questions?** Join our [Discord community](https://discord.gg/ai-portfolio) or start a [discussion](https://github.com/ai-portfolio/create-ai-portfolio/discussions).

**Ready to contribute?** Check out [good first issues](https://github.com/ai-portfolio/create-ai-portfolio/labels/good%20first%20issue) to get started!