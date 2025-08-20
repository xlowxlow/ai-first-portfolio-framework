import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { SimulationReport, CrawlResult, CrawlIssue } from './ai-crawler-simulator';

/**
 * Report Generator for AI Crawler Simulation Results
 * Supports console table, HTML report, and JSON data formats
 */

export class CrawlerReportGenerator {
  /**
   * Generate console table report
   */
  static generateConsoleReport(report: SimulationReport): void {
    console.log('\n' + '='.repeat(80));
    console.log(chalk.bold.cyan('🤖 AI CRAWLER SIMULATION REPORT'));
    console.log('='.repeat(80));
    
    // Basic info
    console.log(chalk.bold('📊 Summary:'));
    console.log(`   URL: ${chalk.cyan(report.url)}`);
    console.log(`   Timestamp: ${chalk.gray(new Date(report.timestamp).toLocaleString())}`);
    console.log(`   Overall Score: ${this.getScoreColor(report.overallScore)}${report.overallScore}%${chalk.reset()}`);
    console.log();
    
    // Crawler results table
    console.log(chalk.bold('🔍 Crawler Results:'));
    console.log('┌─────────────────┬───────┬──────────┬─────────────┬────────┐');
    console.log('│ Crawler         │ Score │ Response │ Content     │ Issues │');
    console.log('│                 │   %   │ Time(ms) │ Size(bytes) │ Count  │');
    console.log('├─────────────────┼───────┼──────────┼─────────────┼────────┤');
    
    report.crawlerResults.forEach(result => {
      const crawler = result.crawlerName.padEnd(15);
      const score = this.getScoreColor(result.aiVisibilityScore) + 
                   result.aiVisibilityScore.toString().padStart(3) + '%' + chalk.reset();
      const responseTime = Math.round(result.responseTime).toString().padStart(8);
      const contentSize = this.formatBytes(result.contentLength).padStart(11);
      const issueCount = result.issues.length.toString().padStart(6);
      
      console.log(`│ ${crawler} │ ${score} │ ${responseTime} │ ${contentSize} │ ${issueCount} │`);
    });
    
    console.log('└─────────────────┴───────┴──────────┴─────────────┴────────┘');
    console.log();
    
    // Category scores
    console.log(chalk.bold('📈 Category Scores:'));
    Object.entries(report.categoryScores).forEach(([category, score]) => {
      const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
      const bar = this.createProgressBar(score);
      const scoreColor = this.getScoreColor(score);
      console.log(`   ${categoryName.padEnd(13)}: ${bar} ${scoreColor}${score}%${chalk.reset()}`);
    });
    console.log();
    
    // Common issues
    if (report.commonIssues.length > 0) {
      console.log(chalk.bold('⚠️  Common Issues:'));
      report.commonIssues.forEach((issue, index) => {
        const icon = this.getIssueIcon(issue);
        const impact = this.getImpactColor(issue.impact) + issue.impact.toUpperCase() + chalk.reset();
        console.log(`   ${index + 1}. ${icon} [${impact}] ${issue.message}`);
      });
      console.log();
    }
    
    // Recommendations
    if (report.recommendations.length > 0) {
      console.log(chalk.bold('💡 Recommendations:'));
      report.recommendations.forEach((rec, index) => {
        console.log(`   ${index + 1}. ${rec}`);
      });
      console.log();
    }
    
    // Summary
    console.log(chalk.bold('📝 Summary:'));
    console.log(`   ${report.summary}`);
    console.log('\n' + '='.repeat(80));
  }

  /**
   * Generate HTML report
   */
  static async generateHTMLReport(report: SimulationReport, outputPath?: string): Promise<string> {
    const htmlContent = this.generateHTMLContent(report);
    
    const filename = outputPath || `crawler-report-${this.sanitizeFilename(report.url)}-${Date.now()}.html`;
    const reportsDir = path.join(process.cwd(), 'crawler-reports');
    await fs.ensureDir(reportsDir);
    
    const filepath = path.join(reportsDir, filename);
    await fs.writeFile(filepath, htmlContent, 'utf8');
    
    return filepath;
  }

  /**
   * Generate JSON report
   */
  static async generateJSONReport(report: SimulationReport, outputPath?: string): Promise<string> {
    const jsonContent = JSON.stringify(report, null, 2);
    
    const filename = outputPath || `crawler-report-${this.sanitizeFilename(report.url)}-${Date.now()}.json`;
    const reportsDir = path.join(process.cwd(), 'crawler-reports');
    await fs.ensureDir(reportsDir);
    
    const filepath = path.join(reportsDir, filename);
    await fs.writeFile(filepath, jsonContent, 'utf8');
    
    return filepath;
  }

  /**
   * Generate CSV report for data analysis
   */
  static async generateCSVReport(report: SimulationReport, outputPath?: string): Promise<string> {
    const csvRows = [
      // Header
      'Crawler,Score,ResponseTime(ms),ContentSize(bytes),ErrorCount,WarningCount,InfoCount'
    ];
    
    // Data rows
    report.crawlerResults.forEach(result => {
      const errorCount = result.issues.filter(i => i.type === 'error').length;
      const warningCount = result.issues.filter(i => i.type === 'warning').length;
      const infoCount = result.issues.filter(i => i.type === 'info').length;
      
      csvRows.push([
        result.crawlerName,
        result.aiVisibilityScore,
        Math.round(result.responseTime),
        result.contentLength,
        errorCount,
        warningCount,
        infoCount
      ].join(','));
    });
    
    const csvContent = csvRows.join('\n');
    
    const filename = outputPath || `crawler-report-${this.sanitizeFilename(report.url)}-${Date.now()}.csv`;
    const reportsDir = path.join(process.cwd(), 'crawler-reports');
    await fs.ensureDir(reportsDir);
    
    const filepath = path.join(reportsDir, filename);
    await fs.writeFile(filepath, csvContent, 'utf8');
    
    return filepath;
  }

  /**
   * Generate HTML content for the report
   */
  private static generateHTMLContent(report: SimulationReport): string {
    const timestamp = new Date(report.timestamp).toLocaleString();
    const overallScoreClass = report.overallScore >= 80 ? 'excellent' : 
                             report.overallScore >= 60 ? 'good' : 'poor';
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Crawler Simulation Report - ${report.url}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem;
            border-radius: 10px;
            margin-bottom: 2rem;
            text-align: center;
        }
        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
        }
        .header p {
            font-size: 1.1rem;
            opacity: 0.9;
        }
        .summary {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 2rem;
        }
        .score-badge {
            display: inline-block;
            padding: 0.5rem 1rem;
            border-radius: 50px;
            font-weight: bold;
            font-size: 1.2rem;
        }
        .score-badge.excellent { background: #4CAF50; color: white; }
        .score-badge.good { background: #FF9800; color: white; }
        .score-badge.poor { background: #F44336; color: white; }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-bottom: 2rem;
        }
        .card {
            background: white;
            padding: 1.5rem;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .card h3 {
            margin-bottom: 1rem;
            color: #667eea;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1rem;
        }
        th, td {
            padding: 0.75rem;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background: #f8f9fa;
            font-weight: 600;
        }
        .progress-bar {
            width: 100%;
            height: 20px;
            background: #e0e0e0;
            border-radius: 10px;
            overflow: hidden;
            margin: 0.5rem 0;
        }
        .progress-fill {
            height: 100%;
            border-radius: 10px;
            transition: width 0.3s ease;
        }
        .progress-fill.excellent { background: #4CAF50; }
        .progress-fill.good { background: #FF9800; }
        .progress-fill.poor { background: #F44336; }
        .issue {
            padding: 0.75rem;
            margin: 0.5rem 0;
            border-radius: 5px;
            border-left: 4px solid;
        }
        .issue.error {
            background: #ffebee;
            border-color: #f44336;
        }
        .issue.warning {
            background: #fff8e1;
            border-color: #ff9800;
        }
        .issue.info {
            background: #e3f2fd;
            border-color: #2196f3;
        }
        .recommendation {
            background: #e8f5e8;
            border: 1px solid #4caf50;
            padding: 0.75rem;
            margin: 0.5rem 0;
            border-radius: 5px;
        }
        .crawler-result {
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 1rem;
            margin: 1rem 0;
        }
        .crawler-result h4 {
            color: #667eea;
            margin-bottom: 0.5rem;
        }
        .metric {
            display: inline-block;
            background: #f8f9fa;
            padding: 0.25rem 0.5rem;
            margin: 0.25rem;
            border-radius: 3px;
            font-size: 0.9rem;
        }
        .footer {
            text-align: center;
            margin-top: 2rem;
            padding: 1rem;
            color: #666;
            font-size: 0.9rem;
        }
        @media (max-width: 768px) {
            .container { padding: 10px; }
            .header h1 { font-size: 2rem; }
            .grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🤖 AI Crawler Simulation Report</h1>
            <p>Generated on ${timestamp}</p>
        </div>

        <div class="summary">
            <h2>📊 Summary</h2>
            <p><strong>Target URL:</strong> <a href="${report.url}" target="_blank">${report.url}</a></p>
            <p><strong>Overall Score:</strong> <span class="score-badge ${overallScoreClass}">${report.overallScore}%</span></p>
            <p><strong>Summary:</strong> ${report.summary}</p>
        </div>

        <div class="grid">
            <div class="card">
                <h3>🔍 Crawler Results</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Crawler</th>
                            <th>Score</th>
                            <th>Response Time</th>
                            <th>Issues</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${report.crawlerResults.map(result => `
                        <tr>
                            <td>${result.crawlerName}</td>
                            <td><span class="score-badge ${result.aiVisibilityScore >= 80 ? 'excellent' : result.aiVisibilityScore >= 60 ? 'good' : 'poor'}">${result.aiVisibilityScore}%</span></td>
                            <td>${Math.round(result.responseTime)}ms</td>
                            <td>${result.issues.length}</td>
                        </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <div class="card">
                <h3>📈 Category Scores</h3>
                ${Object.entries(report.categoryScores).map(([category, score]) => `
                <div>
                    <strong>${category.charAt(0).toUpperCase() + category.slice(1)}:</strong>
                    <div class="progress-bar">
                        <div class="progress-fill ${score >= 80 ? 'excellent' : score >= 60 ? 'good' : 'poor'}" style="width: ${score}%"></div>
                    </div>
                    <span>${score}%</span>
                </div>
                `).join('')}
            </div>
        </div>

        ${report.commonIssues.length > 0 ? `
        <div class="card">
            <h3>⚠️ Common Issues</h3>
            ${report.commonIssues.map(issue => `
            <div class="issue ${issue.type}">
                <strong>${issue.category.toUpperCase()}:</strong> ${issue.message}
                <br><small>Impact: ${issue.impact.toUpperCase()}</small>
            </div>
            `).join('')}
        </div>
        ` : ''}

        ${report.recommendations.length > 0 ? `
        <div class="card">
            <h3>💡 Recommendations</h3>
            ${report.recommendations.map(rec => `
            <div class="recommendation">
                ${rec}
            </div>
            `).join('')}
        </div>
        ` : ''}

        <div class="card">
            <h3>🔍 Detailed Crawler Results</h3>
            ${report.crawlerResults.map(result => `
            <div class="crawler-result">
                <h4>${result.crawlerName}</h4>
                <div class="metric">Score: ${result.aiVisibilityScore}%</div>
                <div class="metric">Response: ${Math.round(result.responseTime)}ms</div>
                <div class="metric">Content: ${this.formatBytes(result.contentLength)}</div>
                <div class="metric">Issues: ${result.issues.length}</div>
                
                <h5>Extracted Content:</h5>
                <ul>
                    <li>Title: "${result.extractedContent.title}"</li>
                    <li>Meta Description: "${result.extractedContent.metaDescription}"</li>
                    <li>Headings: ${result.extractedContent.headings.length}</li>
                    <li>Paragraphs: ${result.extractedContent.paragraphs.length}</li>
                    <li>Links: ${result.extractedContent.links.length}</li>
                    <li>Images: ${result.extractedContent.images.length}</li>
                    <li>Structured Data: ${result.extractedContent.structuredData.length} schemas</li>
                </ul>
                
                ${result.issues.length > 0 ? `
                <h5>Issues Found:</h5>
                ${result.issues.map(issue => `
                <div class="issue ${issue.type}">
                    <strong>${issue.category.toUpperCase()}:</strong> ${issue.message}
                    <br><small>Impact: ${issue.impact.toUpperCase()}</small>
                </div>
                `).join('')}
                ` : '<p>✅ No issues found!</p>'}
                
                ${result.recommendations.length > 0 ? `
                <h5>Recommendations:</h5>
                ${result.recommendations.map(rec => `
                <div class="recommendation">
                    ${rec}
                </div>
                `).join('')}
                ` : ''}
            </div>
            `).join('')}
        </div>

        <div class="footer">
            <p>Generated by AI Portfolio Crawler Simulator • ${timestamp}</p>
            <p>This report analyzes how different AI systems would crawl and understand your website.</p>
        </div>
    </div>
</body>
</html>
    `.trim();
  }

  /**
   * Helper methods for formatting and styling
   */
  private static getScoreColor(score: number): string {
    if (score >= 80) return chalk.green;
    if (score >= 60) return chalk.yellow;
    return chalk.red;
  }

  private static getIssueIcon(issue: CrawlIssue): string {
    switch (issue.type) {
      case 'error': return chalk.red('❌');
      case 'warning': return chalk.yellow('⚠️');
      case 'info': return chalk.blue('ℹ️');
    }
  }

  private static getImpactColor(impact: string): any {
    switch (impact) {
      case 'high': return chalk.red;
      case 'medium': return chalk.yellow;
      case 'low': return chalk.blue;
      default: return chalk.gray;
    }
  }

  private static createProgressBar(score: number, width = 20): string {
    const filled = Math.round((score / 100) * width);
    const empty = width - filled;
    const color = score >= 80 ? chalk.green : score >= 60 ? chalk.yellow : chalk.red;
    
    return color('█'.repeat(filled)) + chalk.gray('░'.repeat(empty));
  }

  private static formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  }

  private static sanitizeFilename(url: string): string {
    return url
      .replace(/https?:\/\//, '')
      .replace(/[^a-zA-Z0-9-_.]/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 50);
  }
}