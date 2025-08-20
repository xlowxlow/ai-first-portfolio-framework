#!/usr/bin/env node

/**
 * Basic functionality test for the AI Portfolio CLI
 */

import { AICrawlerSimulator } from '../tools/ai-crawler-simulator';
import { LLMSTxtGenerator } from '../generators/llms-txt-generator';
import { StructuredDataGenerator } from '../generators/structured-data-generator';

async function testBasicFunctionality() {
  console.log('🧪 Testing AI Portfolio CLI Basic Functionality\n');

  // Test 1: LLMs.txt Generator
  console.log('1. Testing LLMs.txt Generator...');
  try {
    const config = {
      personalInfo: {
        name: 'John Doe',
        title: 'Full Stack Developer',
        bio: 'Experienced developer with expertise in modern web technologies',
        email: 'john@example.com',
        website: 'https://johndoe.dev',
        location: 'San Francisco, CA',
        github: 'johndoe',
        linkedin: 'johndoe',
        twitter: 'johndoe'
      },
      skills: [
        { name: 'JavaScript', level: 'Expert', category: 'Frontend' },
        { name: 'React', level: 'Advanced', category: 'Frontend' },
        { name: 'Node.js', level: 'Advanced', category: 'Backend' }
      ],
      experience: [
        {
          company: 'Tech Corp',
          position: 'Senior Developer',
          startDate: '2020-01-01',
          endDate: '2024-01-01',
          description: 'Led development of multiple web applications'
        }
      ],
      projects: [
        {
          id: 'project-1',
          title: 'E-commerce Platform',
          description: 'Built a scalable e-commerce platform using React and Node.js',
          technologies: ['React', 'Node.js', 'MongoDB'],
          status: 'completed',
          featured: true
        }
      ],
      education: [
        {
          institution: 'University of Tech',
          degree: 'Computer Science',
          startDate: '2016-01-01',
          endDate: '2020-01-01'
        }
      ],
      siteUrl: 'https://johndoe.dev'
    };

    const llmsConfig = {
      enabled: true,
      sections: {
        includePersonalInfo: true,
        includeSkills: true,
        includeExperience: true,
        includeProjects: true,
        includeEducation: true
      },
      format: 'markdown' as const,
      maxLength: 5000,
      includeTechnicalDetails: true,
      includeAchievements: true
    };

    const options = {
      language: 'en' as const,
      includeApiEndpoints: true,
      format: 'markdown' as const,
      includeMetadata: true,
      siteUrl: 'https://johndoe.dev'
    };

    const generator = new LLMSTxtGenerator(config, llmsConfig, options);
    const llmsContent = generator.generate();
    
    console.log('✅ LLMs.txt generated successfully');
    console.log(`📄 Content length: ${llmsContent.length} characters`);
    console.log('📝 Sample content:');
    console.log(llmsContent.substring(0, 200) + '...\n');

  } catch (error) {
    console.log('❌ LLMs.txt Generator failed:', error);
  }

  // Test 2: Structured Data Generator
  console.log('2. Testing Structured Data Generator...');
  try {
    const config = {
      personalInfo: {
        name: 'John Doe',
        title: 'Full Stack Developer',
        bio: 'Experienced developer',
        email: 'john@example.com',
        website: 'https://johndoe.dev',
        location: 'San Francisco, CA'
      },
      skills: [],
      experience: [],
      projects: [],
      education: [],
      siteUrl: 'https://johndoe.dev'
    };

    const structuredDataConfig = {
      enabled: true,
      schemas: {
        person: true,
        organization: false,
        webSite: true,
        breadcrumbList: false
      },
      includeJobPostings: false,
      includeProjects: true
    };

    const options = {
      baseUrl: 'https://johndoe.dev',
      includeOptionalFields: true,
      validateOutput: false,
      formatForHTML: false
    };

    const structuredGenerator = new StructuredDataGenerator(
      config,
      structuredDataConfig,
      options
    );

    const personSchema = structuredGenerator.generatePersonSchema();
    console.log('✅ Person Schema generated successfully');
    console.log('📊 Schema type:', personSchema['@type']);

    const websiteSchema = structuredGenerator.generateWebSiteSchema();
    console.log('✅ Website Schema generated successfully');
    console.log('📊 Schema type:', websiteSchema['@type']);

  } catch (error) {
    console.log('❌ Structured Data Generator failed:', error);
  }

  // Test 3: AI Crawler Simulator (without Puppeteer for now)
  console.log('3. Testing AI Crawler Simulator initialization...');
  try {
    const simulator = new AICrawlerSimulator();
    console.log('✅ AI Crawler Simulator initialized successfully');
    
    // Test configuration access
    const configs = (simulator as any).crawlerConfigs;
    console.log('📊 Available crawlers:', Object.keys(configs).join(', '));

  } catch (error) {
    console.log('❌ AI Crawler Simulator failed:', error);
  }

  console.log('\n🎉 Basic functionality testing completed!');
}

// Run the test
testBasicFunctionality().catch(console.error);