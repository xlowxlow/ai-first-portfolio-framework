import { describe, it, expect, beforeEach } from 'vitest';
import { LLMSTxtGenerator, LLMSTxtOptions } from '../src/generators/llms-txt-generator';
import { PortfolioConfig } from '../src/config/portfolio.config';
import { LLMSTxtConfig } from '../src/config/ai-optimization.config';

describe('LLMSTxtGenerator', () => {
  let mockPortfolioConfig: PortfolioConfig;
  let mockLLMSConfig: LLMSTxtConfig;
  let defaultOptions: LLMSTxtOptions;

  beforeEach(() => {
    mockPortfolioConfig = {
      personalInfo: {
        name: 'John Doe',
        title: 'Full Stack Developer',
        email: 'john.doe@example.com',
        phone: '+1-555-0123',
        location: 'San Francisco, CA',
        website: 'https://johndoe.dev',
        linkedin: 'https://linkedin.com/in/johndoe',
        github: 'https://github.com/johndoe',
        bio: 'Passionate full-stack developer with 5+ years of experience building scalable web applications.',
      },
      skills: [
        {
          name: 'JavaScript',
          level: 'Expert',
          category: 'Frontend',
          yearsOfExperience: 5,
        },
        {
          name: 'React',
          level: 'Advanced',
          category: 'Frontend',
          yearsOfExperience: 3,
        },
        {
          name: 'Node.js',
          level: 'Advanced',
          category: 'Backend',
          yearsOfExperience: 4,
        },
        {
          name: 'PostgreSQL',
          level: 'Intermediate',
          category: 'Database',
          yearsOfExperience: 2,
        },
      ],
      experience: [
        {
          id: '1',
          company: 'Tech Corp',
          position: 'Senior Full Stack Developer',
          startDate: '2022-01-01',
          endDate: undefined,
          description: 'Lead development of core product features and mentor junior developers.',
          technologies: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
          achievements: [
            'Improved application performance by 40%',
            'Led team of 4 developers',
            'Implemented CI/CD pipeline',
          ],
          type: 'Full-time',
        },
        {
          id: '2',
          company: 'StartupXYZ',
          position: 'Frontend Developer',
          startDate: '2020-06-01',
          endDate: '2021-12-31',
          description: 'Developed user-facing features for e-commerce platform.',
          technologies: ['React', 'TypeScript', 'Redux'],
          achievements: [
            'Built responsive UI components',
            'Increased user engagement by 25%',
          ],
          type: 'Full-time',
        },
      ],
      education: [
        {
          id: '1',
          institution: 'University of Technology',
          degree: 'Bachelor of Science',
          field: 'Computer Science',
          startDate: '2016-09-01',
          endDate: '2020-05-31',
          gpa: 3.8,
        },
      ],
      projects: [
        {
          id: '1',
          title: 'E-commerce Platform',
          description: 'Full-stack e-commerce solution with payment integration.',
          technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
          features: [
            'User authentication',
            'Product catalog',
            'Shopping cart',
            'Payment processing',
          ],
          demoUrl: 'https://demo.ecommerce.com',
          githubUrl: 'https://github.com/johndoe/ecommerce',
          status: 'Completed',
          startDate: '2023-01-01',
          endDate: '2023-06-30',
          category: 'Web Application',
        },
        {
          id: '2',
          title: 'Task Management App',
          description: 'Collaborative task management tool with real-time updates.',
          technologies: ['Vue.js', 'Express', 'Socket.io', 'MySQL'],
          features: [
            'Real-time collaboration',
            'Project management',
            'Team chat',
          ],
          githubUrl: 'https://github.com/johndoe/taskapp',
          status: 'In Progress',
          startDate: '2023-07-01',
          category: 'Web Application',
        },
      ],
      certifications: [],
      theme: {
        primaryColor: '#3b82f6',
        secondaryColor: '#64748b',
        accentColor: '#f59e0b',
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        fontFamily: 'Inter, sans-serif',
      },
      sections: {
        showAbout: true,
        showSkills: true,
        showExperience: true,
        showEducation: true,
        showProjects: true,
        showCertifications: false,
        showContact: true,
      },
      metadata: {
        version: '1.0.0',
        lastModified: '2023-01-01T00:00:00.000Z',
        createdAt: '2023-01-01T00:00:00.000Z',
      },
    };

    mockLLMSConfig = {
      enabled: true,
      sections: {
        includePersonalInfo: true,
        includeSkills: true,
        includeExperience: true,
        includeProjects: true,
        includeEducation: true,
      },
      format: 'markdown',
      maxLength: 8000,
      includeTechnicalDetails: true,
      includeAchievements: true,
    };

    defaultOptions = {
      language: 'en',
      includeApiEndpoints: true,
      format: 'markdown',
      includeMetadata: true,
      siteUrl: 'https://johndoe.dev',
    };
  });

  describe('constructor', () => {
    it('should create an instance with provided configuration', () => {
      const generator = new LLMSTxtGenerator(mockPortfolioConfig, mockLLMSConfig, defaultOptions);
      expect(generator).toBeInstanceOf(LLMSTxtGenerator);
    });
  });

  describe('generate', () => {
    it('should generate English markdown content', () => {
      const generator = new LLMSTxtGenerator(mockPortfolioConfig, mockLLMSConfig, defaultOptions);
      const result = generator.generate();
      
      expect(result).toContain('Portfolio Information for Large Language Models');
      expect(result).toContain('John Doe');
      expect(result).toContain('Full Stack Developer');
      expect(result).toContain('## Personal Information');
      expect(result).toContain('## Professional Skills');
      expect(result).toContain('## Work Experience');
      expect(result).toContain('## Projects');
      expect(result).toContain('## Contact Information');
    });

    it('should generate Chinese content when language is set to zh', () => {
      const options = { ...defaultOptions, language: 'zh' as const };
      const generator = new LLMSTxtGenerator(mockPortfolioConfig, mockLLMSConfig, options);
      const result = generator.generate();
      
      expect(result).toContain('大语言模型作品集信息');
      expect(result).toContain('## 个人信息');
      expect(result).toContain('## 专业技能');
      expect(result).toContain('## 工作经历');
      expect(result).toContain('## 项目经验');
      expect(result).toContain('## 联系方式');
    });

    it('should generate plain text format when format is set to plain', () => {
      const options = { ...defaultOptions, format: 'plain' as const };
      const generator = new LLMSTxtGenerator(mockPortfolioConfig, mockLLMSConfig, options);
      const result = generator.generate();
      
      expect(result).not.toContain('##');
      expect(result).not.toContain('**');
      expect(result).toContain('Portfolio Information for Large Language Models');
      expect(result).toContain('Personal Information');
      expect(result).toContain('John Doe - Full Stack Developer');
    });

    it('should generate structured format when format is set to structured', () => {
      const options = { ...defaultOptions, format: 'structured' as const };
      const generator = new LLMSTxtGenerator(mockPortfolioConfig, mockLLMSConfig, options);
      const result = generator.generate();
      
      expect(result).toContain('Personal Information:');
      expect(result).toContain('  Name: John Doe');
      expect(result).toContain('  Title: Full Stack Developer');
      expect(result).toContain('Professional Skills:');
      expect(result).toContain('  - JavaScript: Expert');
    });

    it('should include API endpoints when includeApiEndpoints is true', () => {
      const generator = new LLMSTxtGenerator(mockPortfolioConfig, mockLLMSConfig, defaultOptions);
      const result = generator.generate();
      
      expect(result).toContain('API Endpoints');
      expect(result).toContain('GET https://johndoe.dev/api/profile');
      expect(result).toContain('GET https://johndoe.dev/llms.txt');
    });

    it('should not include API endpoints when includeApiEndpoints is false', () => {
      const options = { ...defaultOptions, includeApiEndpoints: false };
      const generator = new LLMSTxtGenerator(mockPortfolioConfig, mockLLMSConfig, options);
      const result = generator.generate();
      
      expect(result).not.toContain('API Endpoints');
    });

    it('should include metadata when includeMetadata is true', () => {
      const generator = new LLMSTxtGenerator(mockPortfolioConfig, mockLLMSConfig, defaultOptions);
      const result = generator.generate();
      
      expect(result).toContain('Metadata');
      expect(result).toContain('Generated at:');
      expect(result).toContain('Version: 1.0.0');
      expect(result).toContain('Source: AI-First Portfolio Generator');
    });

    it('should include custom sections', () => {
      const options = {
        ...defaultOptions,
        customSections: {
          'Awards': 'Winner of Developer Excellence Award 2023',
          'Publications': 'Published article on React performance optimization',
        },
      };
      const generator = new LLMSTxtGenerator(mockPortfolioConfig, mockLLMSConfig, options);
      const result = generator.generate();
      
      expect(result).toContain('Awards');
      expect(result).toContain('Winner of Developer Excellence Award 2023');
      expect(result).toContain('Publications');
      expect(result).toContain('Published article on React performance optimization');
    });

    it('should truncate content when maxLength is exceeded', () => {
      const options = { ...defaultOptions, maxLength: 500 };
      const generator = new LLMSTxtGenerator(mockPortfolioConfig, mockLLMSConfig, options);
      const result = generator.generate();
      
      expect(result.length).toBeLessThanOrEqual(500);
      expect(result).toContain('...');
    });

    it('should respect section inclusion settings', () => {
      const limitedLLMSConfig = {
        ...mockLLMSConfig,
        sections: {
          includePersonalInfo: true,
          includeSkills: false,
          includeExperience: false,
          includeProjects: true,
          includeEducation: false,
        },
      };
      
      const generator = new LLMSTxtGenerator(mockPortfolioConfig, limitedLLMSConfig, defaultOptions);
      const result = generator.generate();
      
      expect(result).toContain('Personal Information');
      expect(result).toContain('Projects');
      expect(result).not.toContain('Professional Skills');
      expect(result).not.toContain('Work Experience');
    });

    it('should format dates correctly for different languages', () => {
      const englishGenerator = new LLMSTxtGenerator(mockPortfolioConfig, mockLLMSConfig, defaultOptions);
      const englishResult = englishGenerator.generate();
      
      const chineseOptions = { ...defaultOptions, language: 'zh' as const };
      const chineseGenerator = new LLMSTxtGenerator(mockPortfolioConfig, mockLLMSConfig, chineseOptions);
      const chineseResult = chineseGenerator.generate();
      
      expect(englishResult).toContain('January 2022');
      expect(chineseResult).toContain('2022年1月');
    });

    it('should include technical details when includeTechnicalDetails is true', () => {
      const generator = new LLMSTxtGenerator(mockPortfolioConfig, mockLLMSConfig, defaultOptions);
      const result = generator.generate();
      
      expect(result).toContain('Technologies:');
      expect(result).toContain('React, Node.js, PostgreSQL, AWS');
    });

    it('should include achievements when includeAchievements is true', () => {
      const generator = new LLMSTxtGenerator(mockPortfolioConfig, mockLLMSConfig, defaultOptions);
      const result = generator.generate();
      
      expect(result).toContain('Key Achievements:');
      expect(result).toContain('Improved application performance by 40%');
      expect(result).toContain('Led team of 4 developers');
    });

    it('should group skills by category in markdown format', () => {
      const generator = new LLMSTxtGenerator(mockPortfolioConfig, mockLLMSConfig, defaultOptions);
      const result = generator.generate();
      
      expect(result).toContain('### Frontend');
      expect(result).toContain('### Backend');
      expect(result).toContain('### Database');
      expect(result).toContain('**JavaScript** (Level: Expert, 5 years experience)');
      expect(result).toContain('**React** (Level: Advanced, 3 years experience)');
    });
  });

  describe('generateDefault', () => {
    it('should generate content with default settings', () => {
      const result = LLMSTxtGenerator.generateDefault(mockPortfolioConfig);
      
      expect(result).toContain('Portfolio Information for Large Language Models');
      expect(result).toContain('John Doe');
      expect(result).toContain('Personal Information');
      expect(result).toContain('Professional Skills');
    });

    it('should accept custom options', () => {
      const result = LLMSTxtGenerator.generateDefault(mockPortfolioConfig, {
        language: 'zh',
        format: 'plain',
      });
      
      expect(result).toContain('大语言模型作品集信息');
      expect(result).not.toContain('##');
    });
  });

  describe('edge cases', () => {
    it('should handle empty skills array', () => {
      const configWithoutSkills = {
        ...mockPortfolioConfig,
        skills: [],
      };
      
      const generator = new LLMSTxtGenerator(configWithoutSkills, mockLLMSConfig, defaultOptions);
      const result = generator.generate();
      
      expect(result).toContain('Professional Skills');
      expect(result).not.toContain('###');
    });

    it('should handle missing optional fields', () => {
      const minimalConfig = {
        ...mockPortfolioConfig,
        personalInfo: {
          ...mockPortfolioConfig.personalInfo,
          phone: undefined,
          website: undefined,
          linkedin: undefined,
          github: undefined,
          twitter: undefined,
        },
      };
      
      const generator = new LLMSTxtGenerator(minimalConfig, mockLLMSConfig, defaultOptions);
      const result = generator.generate();
      
      expect(result).toContain('Contact Information');
      expect(result).toContain('Email: john.doe@example.com');
      expect(result).not.toContain('Phone:');
      expect(result).not.toContain('Website:');
    });

    it('should handle projects without demo URLs', () => {
      const configWithoutDemo = {
        ...mockPortfolioConfig,
        projects: mockPortfolioConfig.projects.map(project => ({
          ...project,
          demoUrl: undefined,
        })),
      };
      
      const generator = new LLMSTxtGenerator(configWithoutDemo, mockLLMSConfig, defaultOptions);
      const result = generator.generate();
      
      expect(result).toContain('Projects');
      expect(result).toContain('GitHub: https://github.com/johndoe');
      expect(result).not.toContain('Demo:');
    });

    it('should handle very long content with proper truncation', () => {
      const longBio = 'A'.repeat(5000);
      const configWithLongBio = {
        ...mockPortfolioConfig,
        personalInfo: {
          ...mockPortfolioConfig.personalInfo,
          bio: longBio,
        },
      };
      
      const options = { ...defaultOptions, maxLength: 1000 };
      const generator = new LLMSTxtGenerator(configWithLongBio, mockLLMSConfig, options);
      const result = generator.generate();
      
      expect(result.length).toBeLessThanOrEqual(1000);
      expect(result).toMatch(/\.\.\.$/);
    });
  });
});