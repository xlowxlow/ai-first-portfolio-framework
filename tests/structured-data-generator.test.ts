import { describe, it, expect, beforeEach } from 'vitest';
import { StructuredDataGenerator, StructuredDataOptions } from '../src/generators/structured-data-generator';
import { PortfolioConfig } from '../src/config/portfolio.config';
import { StructuredDataConfig } from '../src/config/ai-optimization.config';

describe('StructuredDataGenerator', () => {
  let mockPortfolioConfig: PortfolioConfig;
  let mockStructuredDataConfig: StructuredDataConfig;
  let defaultOptions: StructuredDataOptions;

  beforeEach(() => {
    mockPortfolioConfig = {
      personalInfo: {
        name: 'John Doe',
        title: 'Full Stack Developer',
        email: 'john.doe@example.com',
        phone: '+1-555-0123',
        location: 'San Francisco, CA, USA',
        website: 'https://johndoe.dev',
        linkedin: 'https://linkedin.com/in/johndoe',
        github: 'https://github.com/johndoe',
        twitter: 'https://twitter.com/johndoe',
        bio: 'Passionate full-stack developer with 5+ years of experience.',
        avatar: 'https://johndoe.dev/avatar.jpg',
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
      ],
      experience: [
        {
          id: '1',
          company: 'Tech Corp',
          position: 'Senior Full Stack Developer',
          startDate: '2022-01-01',
          endDate: undefined,
          description: 'Lead development of core product features.',
          technologies: ['React', 'Node.js', 'PostgreSQL'],
          achievements: ['Improved performance by 40%'],
          location: 'San Francisco, CA',
          type: 'Full-time',
        },
        {
          id: '2',
          company: 'StartupXYZ',
          position: 'Frontend Developer',
          startDate: '2020-06-01',
          endDate: '2021-12-31',
          description: 'Developed user-facing features.',
          technologies: ['React', 'TypeScript'],
          achievements: ['Increased engagement by 25%'],
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
        },
      ],
      projects: [
        {
          id: '1',
          title: 'E-commerce Platform',
          description: 'Full-stack e-commerce solution with payment integration.',
          technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
          features: ['User authentication', 'Payment processing'],
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
          description: 'Collaborative task management tool.',
          technologies: ['Vue.js', 'Express', 'MySQL'],
          features: ['Real-time collaboration'],
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
    };

    mockStructuredDataConfig = {
      enabled: true,
      schemas: {
        person: true,
        organization: false,
        webSite: true,
        breadcrumbList: true,
      },
      includeJobPostings: false,
      includeProjects: true,
    };

    defaultOptions = {
      baseUrl: 'https://johndoe.dev',
      includeOptionalFields: true,
      validateOutput: true,
      formatForHTML: true,
    };
  });

  describe('constructor', () => {
    it('should create an instance with provided configuration', () => {
      const generator = new StructuredDataGenerator(
        mockPortfolioConfig,
        mockStructuredDataConfig,
        defaultOptions
      );
      expect(generator).toBeInstanceOf(StructuredDataGenerator);
    });
  });

  describe('generatePersonSchema', () => {
    it('should generate a valid Person schema', () => {
      const generator = new StructuredDataGenerator(
        mockPortfolioConfig,
        mockStructuredDataConfig,
        defaultOptions
      );
      const personSchema = generator.generatePersonSchema();

      expect(personSchema['@context']).toBe('https://schema.org');
      expect(personSchema['@type']).toBe('Person');
      expect(personSchema['@id']).toBe('https://johndoe.dev/#person');
      expect(personSchema.name).toBe('John Doe');
      expect(personSchema.jobTitle).toBe('Full Stack Developer');
      expect(personSchema.email).toBe('john.doe@example.com');
      expect(personSchema.telephone).toBe('+1-555-0123');
      expect(personSchema.url).toBe('https://johndoe.dev');
      expect(personSchema.image).toBe('https://johndoe.dev/avatar.jpg');
    });

    it('should include address information when location is provided', () => {
      const generator = new StructuredDataGenerator(
        mockPortfolioConfig,
        mockStructuredDataConfig,
        defaultOptions
      );
      const personSchema = generator.generatePersonSchema();

      expect(personSchema.address).toBeDefined();
      expect(personSchema.address?.addressLocality).toBe('San Francisco');
      expect(personSchema.address?.addressRegion).toBe('CA');
      expect(personSchema.address?.addressCountry).toBe('USA');
    });

    it('should include sameAs links for social profiles', () => {
      const generator = new StructuredDataGenerator(
        mockPortfolioConfig,
        mockStructuredDataConfig,
        defaultOptions
      );
      const personSchema = generator.generatePersonSchema();

      expect(personSchema.sameAs).toContain('https://linkedin.com/in/johndoe');
      expect(personSchema.sameAs).toContain('https://github.com/johndoe');
      expect(personSchema.sameAs).toContain('https://twitter.com/johndoe');
    });

    it('should include knowsAbout skills', () => {
      const generator = new StructuredDataGenerator(
        mockPortfolioConfig,
        mockStructuredDataConfig,
        defaultOptions
      );
      const personSchema = generator.generatePersonSchema();

      expect(personSchema.knowsAbout).toContain('JavaScript');
      expect(personSchema.knowsAbout).toContain('React');
      expect(personSchema.knowsAbout).toContain('Node.js');
    });

    it('should include worksFor organizations', () => {
      const generator = new StructuredDataGenerator(
        mockPortfolioConfig,
        mockStructuredDataConfig,
        defaultOptions
      );
      const personSchema = generator.generatePersonSchema();

      expect(personSchema.worksFor).toBeDefined();
      expect(personSchema.worksFor?.length).toBe(2);
      expect(personSchema.worksFor?.[0].name).toBe('Tech Corp');
      expect(personSchema.worksFor?.[1].name).toBe('StartupXYZ');
    });

    it('should include alumniOf educational institutions', () => {
      const generator = new StructuredDataGenerator(
        mockPortfolioConfig,
        mockStructuredDataConfig,
        defaultOptions
      );
      const personSchema = generator.generatePersonSchema();

      expect(personSchema.alumniOf).toBeDefined();
      expect(personSchema.alumniOf?.length).toBe(1);
      expect(personSchema.alumniOf?.[0].name).toBe('University of Technology');
    });
  });

  describe('generateWebSiteSchema', () => {
    it('should generate a valid WebSite schema', () => {
      const generator = new StructuredDataGenerator(
        mockPortfolioConfig,
        mockStructuredDataConfig,
        defaultOptions
      );
      const websiteSchema = generator.generateWebSiteSchema();

      expect(websiteSchema['@context']).toBe('https://schema.org');
      expect(websiteSchema['@type']).toBe('WebSite');
      expect(websiteSchema['@id']).toBe('https://johndoe.dev/#website');
      expect(websiteSchema.name).toBe('John Doe - Portfolio');
      expect(websiteSchema.url).toBe('https://johndoe.dev');
      expect(websiteSchema.description).toBe('Passionate full-stack developer with 5+ years of experience.');
      expect(websiteSchema.inLanguage).toBe('en-US');
    });

    it('should include search action when includeOptionalFields is true', () => {
      const generator = new StructuredDataGenerator(
        mockPortfolioConfig,
        mockStructuredDataConfig,
        defaultOptions
      );
      const websiteSchema = generator.generateWebSiteSchema();

      expect(websiteSchema.potentialAction).toBeDefined();
      expect(websiteSchema.potentialAction?.[0]['@type']).toBe('SearchAction');
      expect(websiteSchema.potentialAction?.[0].target).toBe('https://johndoe.dev/search?q={search_term_string}');
    });
  });

  describe('generateCreativeWorkSchemas', () => {
    it('should generate CreativeWork schemas for all projects', () => {
      const generator = new StructuredDataGenerator(
        mockPortfolioConfig,
        mockStructuredDataConfig,
        defaultOptions
      );
      const creativeWorks = generator.generateCreativeWorkSchemas();

      expect(creativeWorks).toHaveLength(2);
      
      const ecommerceProject = creativeWorks[0];
      expect(ecommerceProject['@type']).toBe('CreativeWork');
      expect(ecommerceProject.name).toBe('E-commerce Platform');
      expect(ecommerceProject.description).toBe('Full-stack e-commerce solution with payment integration.');
      expect(ecommerceProject.genre).toBe('Web Application');
      expect(ecommerceProject.url).toBe('https://demo.ecommerce.com');
      expect(ecommerceProject.codeRepository).toBe('https://github.com/johndoe/ecommerce');
    });

    it('should include programming languages from technologies', () => {
      const generator = new StructuredDataGenerator(
        mockPortfolioConfig,
        mockStructuredDataConfig,
        defaultOptions
      );
      const creativeWorks = generator.generateCreativeWorkSchemas();

      const project = creativeWorks[0];
      expect(project.keywords).toContain('React');
      expect(project.keywords).toContain('Node.js');
      expect(project.programmingLanguage).toContain('React');
      expect(project.programmingLanguage).toContain('Node.js');
    });

    it('should include features as about property', () => {
      const generator = new StructuredDataGenerator(
        mockPortfolioConfig,
        mockStructuredDataConfig,
        defaultOptions
      );
      const creativeWorks = generator.generateCreativeWorkSchemas();

      const project = creativeWorks[0];
      expect(project.about).toContain('User authentication');
      expect(project.about).toContain('Payment processing');
    });
  });

  describe('generateFAQPageSchema', () => {
    it('should generate a valid FAQPage schema', () => {
      const faqs = [
        {
          question: 'What technologies do you use?',
          answer: 'I primarily work with React, Node.js, and PostgreSQL.',
        },
        {
          question: 'How can I contact you?',
          answer: 'You can reach me via email at john.doe@example.com.',
        },
      ];

      const generator = new StructuredDataGenerator(
        mockPortfolioConfig,
        mockStructuredDataConfig,
        defaultOptions
      );
      const faqSchema = generator.generateFAQPageSchema(faqs);

      expect(faqSchema['@context']).toBe('https://schema.org');
      expect(faqSchema['@type']).toBe('FAQPage');
      expect(faqSchema['@id']).toBe('https://johndoe.dev/#faq');
      expect(faqSchema.mainEntity).toHaveLength(2);

      const firstQuestion = faqSchema.mainEntity[0];
      expect(firstQuestion['@type']).toBe('Question');
      expect(firstQuestion.name).toBe('What technologies do you use?');
      expect(firstQuestion.acceptedAnswer['@type']).toBe('Answer');
      expect(firstQuestion.acceptedAnswer.text).toBe('I primarily work with React, Node.js, and PostgreSQL.');
    });
  });

  describe('generateBreadcrumbListSchema', () => {
    it('should generate a valid BreadcrumbList schema', () => {
      const breadcrumbs = [
        { name: 'Home', url: 'https://johndoe.dev' },
        { name: 'Projects', url: 'https://johndoe.dev/projects' },
        { name: 'E-commerce Platform', url: 'https://johndoe.dev/projects/ecommerce' },
      ];

      const generator = new StructuredDataGenerator(
        mockPortfolioConfig,
        mockStructuredDataConfig,
        defaultOptions
      );
      const breadcrumbSchema = generator.generateBreadcrumbListSchema(breadcrumbs);

      expect(breadcrumbSchema['@context']).toBe('https://schema.org');
      expect(breadcrumbSchema['@type']).toBe('BreadcrumbList');
      expect(breadcrumbSchema['@id']).toBe('https://johndoe.dev/#breadcrumb');
      expect(breadcrumbSchema.itemListElement).toHaveLength(3);

      const firstItem = breadcrumbSchema.itemListElement[0];
      expect(firstItem['@type']).toBe('ListItem');
      expect(firstItem.position).toBe(1);
      expect(firstItem.name).toBe('Home');
      expect(firstItem.item).toBe('https://johndoe.dev');
    });
  });

  describe('generateJobPostingSchemas', () => {
    it('should generate JobPosting schemas for current positions when enabled', () => {
      const configWithJobPostings = {
        ...mockStructuredDataConfig,
        includeJobPostings: true,
      };

      const generator = new StructuredDataGenerator(
        mockPortfolioConfig,
        configWithJobPostings,
        defaultOptions
      );
      const jobPostings = generator.generateJobPostingSchemas();

      expect(jobPostings).toHaveLength(1);
      
      const currentJob = jobPostings[0];
      expect(currentJob['@type']).toBe('JobPosting');
      expect(currentJob.title).toBe('Senior Full Stack Developer');
      expect(currentJob.hiringOrganization.name).toBe('Tech Corp');
      expect(currentJob.employmentType).toBe('FULL-TIME');
    });

    it('should return empty array when includeJobPostings is false', () => {
      const generator = new StructuredDataGenerator(
        mockPortfolioConfig,
        mockStructuredDataConfig,
        defaultOptions
      );
      const jobPostings = generator.generateJobPostingSchemas();

      expect(jobPostings).toHaveLength(0);
    });
  });

  describe('generateAllSchemas', () => {
    it('should generate all enabled schemas', () => {
      const generator = new StructuredDataGenerator(
        mockPortfolioConfig,
        mockStructuredDataConfig,
        defaultOptions
      );
      const allSchemas = generator.generateAllSchemas();

      expect(allSchemas.person).toBeDefined();
      expect(allSchemas.website).toBeDefined();
      expect(allSchemas.creativeWorks).toBeDefined();
      expect(allSchemas.breadcrumb).toBeDefined();
      expect(allSchemas.jobPostings).toBeUndefined(); // disabled in config
    });

    it('should respect schema configuration settings', () => {
      const limitedConfig = {
        ...mockStructuredDataConfig,
        schemas: {
          person: true,
          organization: false,
          webSite: false,
          breadcrumbList: false,
        },
        includeProjects: false,
      };

      const generator = new StructuredDataGenerator(
        mockPortfolioConfig,
        limitedConfig,
        defaultOptions
      );
      const allSchemas = generator.generateAllSchemas();

      expect(allSchemas.person).toBeDefined();
      expect(allSchemas.website).toBeUndefined();
      expect(allSchemas.creativeWorks).toBeUndefined();
      expect(allSchemas.breadcrumb).toBeUndefined();
    });
  });

  describe('generateHTMLScriptTag', () => {
    it('should generate a valid HTML script tag', () => {
      const generator = new StructuredDataGenerator(
        mockPortfolioConfig,
        mockStructuredDataConfig,
        defaultOptions
      );
      const personSchema = generator.generatePersonSchema();
      const scriptTag = generator.generateHTMLScriptTag(personSchema);

      expect(scriptTag).toContain('<script type="application/ld+json">');
      expect(scriptTag).toContain('</script>');
      expect(scriptTag).toContain('"@context": "https://schema.org"');
      expect(scriptTag).toContain('"@type": "Person"');
      expect(scriptTag).toContain('"name": "John Doe"');
    });

    it('should format JSON properly when formatForHTML is true', () => {
      const generator = new StructuredDataGenerator(
        mockPortfolioConfig,
        mockStructuredDataConfig,
        defaultOptions
      );
      const personSchema = generator.generatePersonSchema();
      const scriptTag = generator.generateHTMLScriptTag(personSchema);

      expect(scriptTag).toMatch(/{\n\s+"/);
    });
  });

  describe('generateAllHTMLScriptTags', () => {
    it('should generate HTML script tags for all schemas', () => {
      const generator = new StructuredDataGenerator(
        mockPortfolioConfig,
        mockStructuredDataConfig,
        defaultOptions
      );
      const allScriptTags = generator.generateAllHTMLScriptTags();

      expect(allScriptTags).toContain('<script type="application/ld+json">');
      expect(allScriptTags).toContain('"@type": "Person"');
      expect(allScriptTags).toContain('"@type": "WebSite"');
      expect(allScriptTags).toContain('"@type": "CreativeWork"');
      expect(allScriptTags).toContain('"@type": "BreadcrumbList"');
    });
  });

  describe('validation', () => {
    it('should validate Person schema correctly', () => {
      const generator = new StructuredDataGenerator(
        mockPortfolioConfig,
        mockStructuredDataConfig,
        defaultOptions
      );
      const personSchema = generator.generatePersonSchema();
      const errors = generator.validateSchema(personSchema);

      expect(errors).toHaveLength(0);
    });

    it('should detect missing required fields', () => {
      const generator = new StructuredDataGenerator(
        mockPortfolioConfig,
        mockStructuredDataConfig,
        defaultOptions
      );
      const invalidSchema = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        // missing name
      };
      const errors = generator.validateSchema(invalidSchema);

      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe('name');
      expect(errors[0].message).toBe('name is required for Person schema');
    });

    it('should detect missing @context and @type', () => {
      const generator = new StructuredDataGenerator(
        mockPortfolioConfig,
        mockStructuredDataConfig,
        defaultOptions
      );
      const invalidSchema = {
        name: 'John Doe',
      };
      const errors = generator.validateSchema(invalidSchema);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.field === '@context')).toBe(true);
      expect(errors.some(e => e.field === '@type')).toBe(true);
    });

    it('should validate all schemas at once', () => {
      const generator = new StructuredDataGenerator(
        mockPortfolioConfig,
        mockStructuredDataConfig,
        defaultOptions
      );
      const validationResults = generator.validateAllSchemas();

      expect(validationResults.person).toHaveLength(0);
      expect(validationResults.website).toHaveLength(0);
      expect(validationResults.creativeWorks).toHaveLength(0);
      expect(validationResults.breadcrumb).toHaveLength(0);
    });
  });

  describe('generateDefault', () => {
    it('should generate default structured data with minimal configuration', () => {
      const result = StructuredDataGenerator.generateDefault(
        mockPortfolioConfig,
        'https://johndoe.dev'
      );

      expect(result).toContain('<script type="application/ld+json">');
      expect(result).toContain('"@type": "Person"');
      expect(result).toContain('"@type": "WebSite"');
      expect(result).toContain('John Doe');
    });

    it('should accept custom options', () => {
      const result = StructuredDataGenerator.generateDefault(
        mockPortfolioConfig,
        'https://johndoe.dev',
        { formatForHTML: false }
      );

      expect(result).toContain('<script type="application/ld+json">');
      expect(result).not.toMatch(/{\n\s+"/);
    });
  });

  describe('custom extensions', () => {
    it('should apply custom extensions to schemas', () => {
      const optionsWithExtensions = {
        ...defaultOptions,
        customExtensions: {
          customProperty: 'customValue',
          additionalType: 'https://schema.org/SoftwareDeveloper',
        },
      };

      const generator = new StructuredDataGenerator(
        mockPortfolioConfig,
        mockStructuredDataConfig,
        optionsWithExtensions
      );
      const personSchema = generator.generatePersonSchema();

      expect(personSchema.customProperty).toBe('customValue');
      expect(personSchema.additionalType).toBe('https://schema.org/SoftwareDeveloper');
    });
  });

  describe('edge cases', () => {
    it('should handle missing optional personal info fields', () => {
      const minimalConfig = {
        ...mockPortfolioConfig,
        personalInfo: {
          name: 'John Doe',
          title: 'Developer',
          email: 'john@example.com',
          location: '',
          bio: '',
        },
      };

      const generator = new StructuredDataGenerator(
        minimalConfig,
        mockStructuredDataConfig,
        defaultOptions
      );
      const personSchema = generator.generatePersonSchema();

      expect(personSchema.name).toBe('John Doe');
      expect(personSchema.address).toBeUndefined();
      expect(personSchema.sameAs).toBeUndefined();
    });

    it('should handle empty projects array', () => {
      const configWithoutProjects = {
        ...mockPortfolioConfig,
        projects: [],
      };

      const generator = new StructuredDataGenerator(
        configWithoutProjects,
        mockStructuredDataConfig,
        defaultOptions
      );
      const creativeWorks = generator.generateCreativeWorkSchemas();

      expect(creativeWorks).toHaveLength(0);
    });

    it('should handle projects without optional fields', () => {
      const configWithMinimalProject = {
        ...mockPortfolioConfig,
        projects: [{
          id: '1',
          title: 'Simple Project',
          description: 'A basic project',
          technologies: [],
          features: [],
          status: 'Completed',
          startDate: '2023-01-01',
          category: 'Web',
        }],
      };

      const generator = new StructuredDataGenerator(
        configWithMinimalProject,
        mockStructuredDataConfig,
        defaultOptions
      );
      const creativeWorks = generator.generateCreativeWorkSchemas();

      expect(creativeWorks).toHaveLength(1);
      expect(creativeWorks[0].name).toBe('Simple Project');
      expect(creativeWorks[0].keywords).toHaveLength(0);
      expect(creativeWorks[0].about).toHaveLength(0);
    });
  });
});