# LLMs.txt Template for AI-First Portfolio

This template provides a standardized format for generating `llms.txt` files that are optimized for Large Language Models to understand and process portfolio information.

## English Template

```markdown
# Portfolio Information for Large Language Models

## Personal Information

**{{name}}** - {{title}}

{{bio}}

**Location:** {{location}}

## Professional Skills

{{#each skillsByCategory}}
### {{@key}}
{{#each this}}
- **{{name}}** (Level: {{level}}{{#if yearsOfExperience}}, {{yearsOfExperience}} years experience{{/if}})
{{/each}}

{{/each}}

## Work Experience

{{#each experience}}
### {{position}} at {{company}}
**Duration:** {{formatDate startDate}} - {{#if endDate}}{{formatDate endDate}}{{else}}Present{{/if}}

{{description}}

{{#if technologies.length}}
**Technologies:** {{join technologies ', '}}
{{/if}}

{{#if achievements.length}}
**Key Achievements:**
{{#each achievements}}
- {{this}}
{{/each}}
{{/if}}

{{/each}}

## Projects

{{#each projects}}
### {{title}}
**Status:** {{status}}

{{description}}

{{#if features.length}}
**Features:**
{{#each features}}
- {{this}}
{{/each}}
{{/if}}

{{#if technologies.length}}
**Technologies:** {{join technologies ', '}}
{{/if}}

{{#if demoUrl or githubUrl}}
**Links:**
{{#if demoUrl}}
- Demo: {{demoUrl}}
{{/if}}
{{#if githubUrl}}
- GitHub: {{githubUrl}}
{{/if}}
{{/if}}

{{/each}}

## Contact Information

{{#if email}}
**Email:** {{email}}
{{/if}}
{{#if phone}}
**Phone:** {{phone}}
{{/if}}
{{#if website}}
**Website:** {{website}}
{{/if}}
{{#if linkedin}}
**LinkedIn:** {{linkedin}}
{{/if}}
{{#if github}}
**GitHub:** {{github}}
{{/if}}
{{#if twitter}}
**Twitter:** {{twitter}}
{{/if}}

## API Endpoints

This portfolio provides the following API endpoints for programmatic access:

- `GET {{siteUrl}}/api/profile` - Get basic profile information
- `GET {{siteUrl}}/api/skills` - Get skills and expertise data
- `GET {{siteUrl}}/api/experience` - Get work experience data
- `GET {{siteUrl}}/api/projects` - Get projects portfolio
- `GET {{siteUrl}}/llms.txt` - Get this LLM-optimized summary

## Metadata

- **Generated at:** {{timestamp}}
- **Version:** {{version}}
- **Source:** AI-First Portfolio Generator
```

## Chinese Template

```markdown
# 大语言模型作品集信息

## 个人信息

**{{name}}** - {{title}}

{{bio}}

**地址:** {{location}}

## 专业技能

{{#each skillsByCategory}}
### {{@key}}
{{#each this}}
- **{{name}}** (技能等级: {{level}}{{#if yearsOfExperience}}, {{yearsOfExperience}}年经验{{/if}})
{{/each}}

{{/each}}

## 工作经历

{{#each experience}}
### {{company}}的{{position}}
**时间:** {{formatDate startDate}} - {{#if endDate}}{{formatDate endDate}}{{else}}至今{{/if}}

{{description}}

{{#if technologies.length}}
**使用技术:** {{join technologies '、'}}
{{/if}}

{{#if achievements.length}}
**主要成就:**
{{#each achievements}}
- {{this}}
{{/each}}
{{/if}}

{{/each}}

## 项目经验

{{#each projects}}
### {{title}}
**状态:** {{status}}

{{description}}

{{#if features.length}}
**功能特性:**
{{#each features}}
- {{this}}
{{/each}}
{{/if}}

{{#if technologies.length}}
**使用技术:** {{join technologies '、'}}
{{/if}}

{{#if demoUrl or githubUrl}}
**相关链接:**
{{#if demoUrl}}
- 演示: {{demoUrl}}
{{/if}}
{{#if githubUrl}}
- GitHub: {{githubUrl}}
{{/if}}
{{/if}}

{{/each}}

## 联系方式

{{#if email}}
**邮箱:** {{email}}
{{/if}}
{{#if phone}}
**电话:** {{phone}}
{{/if}}
{{#if website}}
**网站:** {{website}}
{{/if}}
{{#if linkedin}}
**LinkedIn:** {{linkedin}}
{{/if}}
{{#if github}}
**GitHub:** {{github}}
{{/if}}
{{#if twitter}}
**Twitter:** {{twitter}}
{{/if}}

## API端点

本作品集提供以下API端点用于程序化访问:

- `GET {{siteUrl}}/api/profile` - 获取基本个人信息
- `GET {{siteUrl}}/api/skills` - 获取技能和专长数据
- `GET {{siteUrl}}/api/experience` - 获取工作经历数据
- `GET {{siteUrl}}/api/projects` - 获取项目作品集
- `GET {{siteUrl}}/llms.txt` - 获取LLM优化的摘要

## 元数据

- **生成时间:** {{timestamp}}
- **版本:** {{version}}
- **来源:** AI驱动作品集生成器
```

## Template Variables

The following variables are available in the templates:

### Personal Information
- `{{name}}` - Full name
- `{{title}}` - Professional title
- `{{bio}}` - Biography/summary
- `{{location}}` - Current location
- `{{email}}` - Email address
- `{{phone}}` - Phone number
- `{{website}}` - Personal website
- `{{linkedin}}` - LinkedIn profile
- `{{github}}` - GitHub profile
- `{{twitter}}` - Twitter handle

### Skills
- `{{skillsByCategory}}` - Skills grouped by category
- `{{name}}` - Skill name
- `{{level}}` - Proficiency level
- `{{yearsOfExperience}}` - Years of experience with the skill
- `{{category}}` - Skill category

### Experience
- `{{experience}}` - Array of work experience
- `{{position}}` - Job position/title
- `{{company}}` - Company name
- `{{startDate}}` - Start date
- `{{endDate}}` - End date (optional)
- `{{description}}` - Job description
- `{{technologies}}` - Array of technologies used
- `{{achievements}}` - Array of key achievements

### Projects
- `{{projects}}` - Array of projects
- `{{title}}` - Project title
- `{{description}}` - Project description
- `{{status}}` - Project status
- `{{technologies}}` - Array of technologies used
- `{{features}}` - Array of project features
- `{{demoUrl}}` - Demo URL (optional)
- `{{githubUrl}}` - GitHub repository URL (optional)

### Metadata
- `{{timestamp}}` - Generation timestamp
- `{{version}}` - Portfolio version
- `{{siteUrl}}` - Portfolio website URL

## Template Helpers

The following helper functions are available:

- `{{formatDate date}}` - Formats a date string according to locale
- `{{join array separator}}` - Joins an array with a separator
- `{{#if condition}}...{{/if}}` - Conditional rendering
- `{{#each array}}...{{/each}}` - Iterate over arrays
- `{{#unless condition}}...{{/unless}}` - Inverse conditional

## Usage Examples

### Basic Usage
```typescript
import { LLMSTxtGenerator } from './generators/llms-txt-generator';
import { portfolioConfig } from './config';

const generator = new LLMSTxtGenerator(
  portfolioConfig,
  llmsConfig,
  {
    language: 'en',
    format: 'markdown',
    includeApiEndpoints: true
  }
);

const llmsTxt = generator.generate();
```

### Multi-language Generation
```typescript
// Generate English version
const englishLLMS = LLMSTxtGenerator.generateDefault(config, {
  language: 'en',
  siteUrl: 'https://myportfolio.com'
});

// Generate Chinese version
const chineseLLMS = LLMSTxtGenerator.generateDefault(config, {
  language: 'zh',
  siteUrl: 'https://myportfolio.com'
});
```

### Custom Sections
```typescript
const customLLMS = generator.generate({
  language: 'en',
  customSections: {
    'Awards & Recognition': 'List of awards and recognitions...',
    'Publications': 'List of publications and articles...'
  }
});
```