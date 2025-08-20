# AI Crawler Behavior Simulator 🤖

## 概述 / Overview

AI爬虫行为模拟器是一个强大的工具，用于模拟主流AI系统如何爬取和理解网站内容。它可以帮助开发者优化网站，使其更容易被AI系统发现和理解。

The AI Crawler Behavior Simulator is a powerful tool that simulates how major AI systems crawl and understand website content. It helps developers optimize their websites for better AI discoverability and understanding.

## 🌟 核心功能 / Key Features

### 支持的AI爬虫 / Supported AI Crawlers

1. **OpenAI GPT爬虫**
   - 用户代理: `ChatGPT-User/1.0`
   - JavaScript执行: 启用
   - 超时时间: 30秒
   - 深度分析内容结构和上下文

2. **Google Gemini爬虫**
   - 用户代理: `Gemini-Bot/1.0`
   - JavaScript执行: 启用
   - 超时时间: 25秒
   - 注重结构化数据和语义分析

3. **Claude爬虫**
   - 用户代理: `Claude-Web/1.0`
   - JavaScript执行: 禁用（保守方式）
   - 超时时间: 20秒
   - 关注内容质量和可读性

### 分析维度 / Analysis Dimensions

- **内容分析 (Content)**: 标题、描述、段落、可读性
- **结构分析 (Structure)**: HTML语义化、标题层级、导航结构
- **SEO优化 (SEO)**: 元标签、结构化数据、搜索引擎友好性
- **性能分析 (Performance)**: 加载速度、资源优化
- **可访问性 (Accessibility)**: 图片Alt文本、语义化标签

## 🚀 使用方法 / Usage

### CLI命令 / CLI Commands

```bash
# 基本模拟
create-ai-portfolio crawler simulate https://example.com

# 指定输出格式
create-ai-portfolio crawler simulate https://example.com --format html

# 包含截图分析
create-ai-portfolio crawler simulate https://example.com --screenshots

# 全面分析
create-ai-portfolio crawler simulate https://example.com --comprehensive

# 生成所有格式报告
create-ai-portfolio crawler simulate https://example.com --format all

# 列出可用爬虫
create-ai-portfolio crawler list

# 查看历史统计
create-ai-portfolio crawler stats
```

### 编程接口 / Programmatic API

```typescript
import { AICrawlerSimulator } from './ai-crawler-simulator';
import { CrawlerReportGenerator } from './crawler-report-generator';

async function analyzeSite() {
  const simulator = new AICrawlerSimulator();
  
  try {
    await simulator.initialize();
    
    // 运行所有爬虫模拟
    const report = await simulator.simulateAllCrawlers('https://example.com', {
      includeSubpages: true,
      saveScreenshots: true
    });
    
    // 生成报告
    CrawlerReportGenerator.generateConsoleReport(report);
    const htmlPath = await CrawlerReportGenerator.generateHTMLReport(report);
    const jsonPath = await CrawlerReportGenerator.generateJSONReport(report);
    
    console.log(`Overall Score: ${report.overallScore}%`);
    
  } finally {
    await simulator.close();
  }
}
```

## 📊 报告格式 / Report Formats

### 1. 控制台表格 / Console Table
实时显示的彩色表格，包含：
- 爬虫对比结果
- 分类得分
- 常见问题
- 优化建议

### 2. HTML报告 / HTML Report
完整的可视化报告，包含：
- 交互式图表
- 详细分析结果
- 视觉截图对比
- 可打印友好格式

### 3. JSON数据 / JSON Data
机器可读的数据格式，便于：
- 数据分析和处理
- 自动化集成
- 历史趋势分析
- API集成

### 4. CSV数据 / CSV Data
表格数据格式，支持：
- 电子表格分析
- 数据可视化
- 批量处理
- 统计分析

## 🎯 评分系统 / Scoring System

### 总体得分 / Overall Score
- **90-100分**: 优秀 (Excellent) - AI友好性极佳
- **70-89分**: 良好 (Good) - 有优化空间
- **50-69分**: 一般 (Fair) - 需要改进
- **0-49分**: 差 (Poor) - 急需优化

### 分类得分 / Category Scores

每个维度都有独立评分：

**内容质量 (Content Quality)**
- 文本长度和深度
- 标题结构合理性
- 内容可读性
- 关键信息完整性

**结构优化 (Structure)**
- HTML语义化标签使用
- 标题层级规范性
- 导航结构清晰度
- 页面组织逻辑

**SEO友好性 (SEO)**
- 元标签完整性
- 结构化数据丰富度
- URL结构优化
- 内外链策略

**性能表现 (Performance)**
- 页面加载速度
- 资源优化程度
- 缓存策略
- 移动端友好性

**可访问性 (Accessibility)**
- 屏幕阅读器友好
- 键盘导航支持
- 色彩对比度
- 多媒体替代文本

## 🔍 问题检测 / Issue Detection

### 错误级别 / Error Levels

**高影响 (High Impact)**
- 缺少H1标题
- 元描述为空
- 页面加载失败
- 严重的HTML语法错误

**中等影响 (Medium Impact)**
- 图片缺少Alt文本
- 结构化数据不完整
- 加载速度较慢
- 内容长度不足

**低影响 (Low Impact)**
- 次要标签缺失
- 非关键资源优化
- 可选元数据缺失

## 💡 优化建议 / Optimization Recommendations

### 针对OpenAI GPT优化
- 确保内容结构清晰，使用适当的标题层级
- 增加详细的自然语言描述
- 提供充足的上下文信息
- 优化JavaScript执行效率

### 针对Google Gemini优化
- 丰富结构化数据标记
- 确保语义HTML的正确使用
- 优化移动端体验
- 建立清晰的信息架构

### 针对Claude优化
- 重点优化内容可读性
- 使用语义化HTML元素
- 确保在禁用JavaScript时的可访问性
- 建立清晰的文档层次结构

## 📈 报告示例 / Report Examples

### 控制台输出示例 / Console Output Example

```
================================================================================
🤖 AI CRAWLER SIMULATION REPORT
================================================================================
📊 Summary:
   URL: https://example.com
   Timestamp: 2024-01-15, 10:30:00
   Overall Score: 78%

🔍 Crawler Results:
┌─────────────────┬───────┬──────────┬─────────────┬────────┐
│ Crawler         │ Score │ Response │ Content     │ Issues │
│                 │   %   │ Time(ms) │ Size(bytes) │ Count  │
├─────────────────┼───────┼──────────┼─────────────┼────────┤
│ OpenAI-GPT      │  82%  │     1250 │        2048 │      2 │
│ Google-Gemini   │  75%  │     1100 │        2048 │      3 │
│ Claude          │  77%  │      950 │        2048 │      2 │
└─────────────────┴───────┴──────────┴─────────────┴────────┘

📈 Category Scores:
   Content      : ████████████████░░░░ 80%
   Structure    : ██████████████░░░░░░ 70%
   Performance  : ████████████████████ 100%
   SEO          : ████████████░░░░░░░░ 65%
   Accessibility: ███████████████░░░░░ 75%

💡 Recommendations:
   1. ✅ Excellent! Your website is well-optimized for AI crawlers
   2. 🔍 Optimize structured data for better search integration
   3. 📝 Ensure clear content structure with proper headings
```

## 🛠️ 高级配置 / Advanced Configuration

### 自定义爬虫配置 / Custom Crawler Configuration

```typescript
// 修改超时时间
const simulator = new AICrawlerSimulator();
simulator.crawlerConfigs['OpenAI-GPT'].timeout = 60000; // 60秒

// 自定义提取模式
simulator.crawlerConfigs['Claude'].extractionPatterns = [
  'article', 'section', '.main-content', '[role="main"]'
];

// 调整优先级选择器
simulator.crawlerConfigs['Google-Gemini'].prioritySelectors = [
  'title', 'meta', '[itemscope]', '[data-schema]'
];
```

### 批量分析 / Batch Analysis

```typescript
const urls = [
  'https://site1.com',
  'https://site2.com',
  'https://site3.com'
];

const batchResults = [];
for (const url of urls) {
  const report = await simulator.simulateAllCrawlers(url);
  batchResults.push(report);
}

// 生成对比报告
const comparison = generateComparisonReport(batchResults);
```

## 📋 最佳实践 / Best Practices

### 1. 定期监控 / Regular Monitoring
- 每月运行一次完整分析
- 监控得分变化趋势
- 跟踪优化效果

### 2. 渐进式优化 / Progressive Optimization
- 优先修复高影响问题
- 分类别逐步改进
- 测试单一变更的效果

### 3. 多维度分析 / Multi-dimensional Analysis
- 不要仅关注总分
- 分析各爬虫的差异
- 理解问题的根本原因

### 4. 持续改进 / Continuous Improvement
- 建立基准数据
- 设定改进目标
- 记录优化历程

## 🔧 故障排除 / Troubleshooting

### 常见问题 / Common Issues

**1. 爬虫超时**
```
解决方案：增加超时时间或优化页面加载速度
create-ai-portfolio crawler simulate https://example.com --timeout 60000
```

**2. JavaScript错误**
```
解决方案：检查JavaScript代码或禁用JavaScript执行
```

**3. 内存不足**
```
解决方案：减少并发爬虫数量或增加系统内存
```

**4. 网络连接问题**
```
解决方案：检查网络连接或使用代理服务器
```

## 📚 API参考 / API Reference

### 主要类 / Main Classes

#### `AICrawlerSimulator`
```typescript
class AICrawlerSimulator {
  async initialize(headless?: boolean): Promise<void>
  async close(): Promise<void>
  async simulateCrawler(crawlerName: string, url: string, options?: SimulateOptions): Promise<CrawlResult>
  async simulateAllCrawlers(url: string, options?: SimulateOptions): Promise<SimulationReport>
}
```

#### `CrawlerReportGenerator`
```typescript
class CrawlerReportGenerator {
  static generateConsoleReport(report: SimulationReport): void
  static async generateHTMLReport(report: SimulationReport, outputPath?: string): Promise<string>
  static async generateJSONReport(report: SimulationReport, outputPath?: string): Promise<string>
  static async generateCSVReport(report: SimulationReport, outputPath?: string): Promise<string>
}
```

### 接口定义 / Interface Definitions

```typescript
interface CrawlResult {
  crawlerName: string;
  url: string;
  timestamp: string;
  responseTime: number;
  statusCode: number;
  contentLength: number;
  extractedContent: ExtractedContent;
  aiVisibilityScore: number;
  issues: CrawlIssue[];
  recommendations: string[];
}

interface SimulationReport {
  url: string;
  timestamp: string;
  crawlerResults: CrawlResult[];
  overallScore: number;
  categoryScores: Record<string, number>;
  commonIssues: CrawlIssue[];
  recommendations: string[];
  summary: string;
}
```

## 🎨 集成示例 / Integration Examples

### 与CI/CD集成 / CI/CD Integration

```yaml
# GitHub Actions示例
name: AI Visibility Check
on: [push, pull_request]

jobs:
  ai-visibility:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install -g create-ai-portfolio
      - run: |
          create-ai-portfolio crawler simulate https://${{ github.event.repository.name }}.github.io \
            --format json --output ai-report.json
      - run: |
          score=$(jq '.overallScore' ai-report.json)
          if [ $score -lt 70 ]; then
            echo "AI visibility score too low: $score%"
            exit 1
          fi
```

### 与监控系统集成 / Monitoring Integration

```typescript
// 定期检查和告警
import { AICrawlerSimulator } from 'create-ai-portfolio/tools';

async function scheduleCheck() {
  const simulator = new AICrawlerSimulator();
  const report = await simulator.simulateAllCrawlers('https://mysite.com');
  
  if (report.overallScore < 70) {
    // 发送告警
    await sendAlert(`AI visibility score dropped to ${report.overallScore}%`);
  }
  
  // 存储历史数据
  await saveToDatabase(report);
}

// 每天运行一次
setInterval(scheduleCheck, 24 * 60 * 60 * 1000);
```

## 📞 支持与反馈 / Support & Feedback

如有问题或建议，请通过以下方式联系：
- GitHub Issues: [项目issues页面]
- 邮箱: support@ai-portfolio.dev
- 文档: https://ai-portfolio.dev/docs

For questions or suggestions, please contact:
- GitHub Issues: [Project issues page]
- Email: support@ai-portfolio.dev  
- Documentation: https://ai-portfolio.dev/docs