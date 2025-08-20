/**
 * Example: How to use the AI Crawler Simulator programmatically
 */

import { AICrawlerSimulator } from '../src/tools/ai-crawler-simulator';
import { CrawlerReportGenerator } from '../src/tools/crawler-report-generator';

async function runCrawlerSimulationExample() {
  const simulator = new AICrawlerSimulator();
  
  try {
    // Initialize the simulator
    console.log('🤖 Initializing AI Crawler Simulator...');
    await simulator.initialize();
    
    // Target URL to analyze
    const targetUrl = 'https://example.com';
    
    // Run simulation for all crawlers
    console.log(`🔍 Analyzing ${targetUrl}...`);
    const report = await simulator.simulateAllCrawlers(targetUrl, {
      includeSubpages: false,
      saveScreenshots: true
    });
    
    // Generate console report
    console.log('\n📊 Simulation Results:');
    CrawlerReportGenerator.generateConsoleReport(report);
    
    // Generate HTML report
    const htmlPath = await CrawlerReportGenerator.generateHTMLReport(report);
    console.log(`📄 HTML Report saved: ${htmlPath}`);
    
    // Generate JSON report for further analysis
    const jsonPath = await CrawlerReportGenerator.generateJSONReport(report);
    console.log(`📄 JSON Report saved: ${jsonPath}`);
    
    // Example: Analyze specific crawler results
    console.log('\n🔍 Detailed Analysis:');
    report.crawlerResults.forEach(result => {
      console.log(`\n${result.crawlerName}:`);
      console.log(`  - Score: ${result.aiVisibilityScore}%`);
      console.log(`  - Response Time: ${Math.round(result.responseTime)}ms`);
      console.log(`  - Content Length: ${result.contentLength} bytes`);
      console.log(`  - Issues Found: ${result.issues.length}`);
      
      if (result.extractedContent.structuredData.length > 0) {
        console.log(`  - Structured Data: ${result.extractedContent.structuredData.length} schemas found`);
        result.extractedContent.structuredData.forEach((schema, index) => {
          console.log(`    ${index + 1}. ${schema['@type'] || 'Unknown Schema'}`);
        });
      }
      
      if (result.issues.length > 0) {
        console.log(`  - Top Issues:`);
        result.issues.slice(0, 3).forEach((issue, index) => {
          console.log(`    ${index + 1}. [${issue.impact.toUpperCase()}] ${issue.message}`);
        });
      }
    });
    
    // Example: Check for specific optimization opportunities
    console.log('\n💡 Optimization Opportunities:');
    
    const allIssues = report.crawlerResults.flatMap(r => r.issues);
    const highImpactIssues = allIssues.filter(i => i.impact === 'high');
    
    if (highImpactIssues.length > 0) {
      console.log('🚨 Critical Issues to Fix:');
      highImpactIssues.forEach((issue, index) => {
        console.log(`  ${index + 1}. ${issue.message} (${issue.category})`);
      });
    }
    
    const seoIssues = allIssues.filter(i => i.category === 'seo');
    if (seoIssues.length > 0) {
      console.log('\n🔍 SEO Improvements Needed:');
      seoIssues.forEach((issue, index) => {
        console.log(`  ${index + 1}. ${issue.message}`);
      });
    }
    
    // Example: Compare crawler performance
    console.log('\n📈 Crawler Performance Comparison:');
    const sortedResults = report.crawlerResults
      .sort((a, b) => b.aiVisibilityScore - a.aiVisibilityScore);
    
    sortedResults.forEach((result, index) => {
      const ranking = index + 1;
      const medal = ranking === 1 ? '🥇' : ranking === 2 ? '🥈' : ranking === 3 ? '🥉' : '📊';
      console.log(`  ${medal} ${result.crawlerName}: ${result.aiVisibilityScore}% (${Math.round(result.responseTime)}ms)`);
    });
    
  } catch (error) {
    console.error('❌ Simulation failed:', error);
  } finally {
    // Always clean up
    await simulator.close();
  }
}

// Run the example if this file is executed directly
if (require.main === module) {
  runCrawlerSimulationExample().catch(console.error);
}