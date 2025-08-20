import { PortfolioConfig, PersonalInfo, Experience, Project, Education } from '../config/portfolio.config';
import { StructuredDataConfig } from '../config/ai-optimization.config';

export type SchemaType = 'Person' | 'WebSite' | 'CreativeWork' | 'FAQPage' | 'BreadcrumbList' | 'Organization' | 'JobPosting';

export interface BaseSchema {
  '@context': 'https://schema.org';
  '@type': SchemaType;
  '@id'?: string;
}

export interface PersonSchema extends BaseSchema {
  '@type': 'Person';
  name: string;
  jobTitle?: string;
  email?: string;
  telephone?: string;
  url?: string;
  image?: string;
  address?: {
    '@type': 'PostalAddress';
    addressLocality?: string;
    addressRegion?: string;
    addressCountry?: string;
  };
  sameAs?: string[];
  worksFor?: OrganizationSchema[];
  alumniOf?: EducationalOrganizationSchema[];
  knowsAbout?: string[];
  hasOccupation?: OccupationSchema[];
}

export interface WebSiteSchema extends BaseSchema {
  '@type': 'WebSite';
  name: string;
  url: string;
  description?: string;
  author?: PersonSchema;
  inLanguage?: string;
  potentialAction?: SearchAction[];
}

export interface CreativeWorkSchema extends BaseSchema {
  '@type': 'CreativeWork';
  name: string;
  description: string;
  author: PersonSchema;
  dateCreated?: string;
  dateModified?: string;
  keywords?: string[];
  about?: string[];
  genre?: string;
  programmingLanguage?: string[];
  url?: string;
  codeRepository?: string;
}

export interface FAQPageSchema extends BaseSchema {
  '@type': 'FAQPage';
  mainEntity: QuestionSchema[];
}

export interface BreadcrumbListSchema extends BaseSchema {
  '@type': 'BreadcrumbList';
  itemListElement: ListItemSchema[];
}

export interface OrganizationSchema extends BaseSchema {
  '@type': 'Organization';
  name: string;
  url?: string;
  logo?: string;
  address?: {
    '@type': 'PostalAddress';
    addressLocality?: string;
    addressRegion?: string;
    addressCountry?: string;
  };
}

export interface EducationalOrganizationSchema extends BaseSchema {
  '@type': 'EducationalOrganization';
  name: string;
  url?: string;
  address?: {
    '@type': 'PostalAddress';
    addressLocality?: string;
    addressRegion?: string;
    addressCountry?: string;
  };
}

export interface OccupationSchema {
  '@type': 'Occupation';
  name: string;
  occupationLocation?: {
    '@type': 'City';
    name: string;
  };
  estimatedSalary?: {
    '@type': 'MonetaryAmountDistribution';
    name: string;
    currency: string;
  };
}

export interface QuestionSchema {
  '@type': 'Question';
  name: string;
  acceptedAnswer: {
    '@type': 'Answer';
    text: string;
  };
}

export interface ListItemSchema {
  '@type': 'ListItem';
  position: number;
  name: string;
  item: string;
}

export interface SearchAction {
  '@type': 'SearchAction';
  target: string;
  'query-input': string;
}

export interface ValidationError {
  field: string;
  message: string;
  schemaType: SchemaType;
}

export interface StructuredDataOptions {
  baseUrl: string;
  includeOptionalFields?: boolean;
  customExtensions?: Record<string, any>;
  validateOutput?: boolean;
  formatForHTML?: boolean;
}

export class StructuredDataGenerator {
  private config: PortfolioConfig;
  private structuredDataConfig: StructuredDataConfig;
  private options: StructuredDataOptions;

  constructor(
    config: PortfolioConfig,
    structuredDataConfig: StructuredDataConfig,
    options: StructuredDataOptions
  ) {
    this.config = config;
    this.structuredDataConfig = structuredDataConfig;
    this.options = options;
  }

  public generatePersonSchema(): PersonSchema {
    const { personalInfo, skills, experience, education } = this.config;
    
    const personSchema: PersonSchema = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      '@id': `${this.options.baseUrl}/#person`,
      name: personalInfo.name,
    };

    if (personalInfo.title) {
      personSchema.jobTitle = personalInfo.title;
    }

    if (personalInfo.email) {
      personSchema.email = personalInfo.email;
    }

    if (personalInfo.phone) {
      personSchema.telephone = personalInfo.phone;
    }

    if (personalInfo.website || this.options.baseUrl) {
      personSchema.url = personalInfo.website || this.options.baseUrl;
    }

    if (personalInfo.avatar) {
      personSchema.image = personalInfo.avatar;
    }

    if (personalInfo.location) {
      const locationParts = personalInfo.location.split(',').map(part => part.trim());
      personSchema.address = {
        '@type': 'PostalAddress',
        addressLocality: locationParts[0],
        addressRegion: locationParts[1],
        addressCountry: locationParts[2] || locationParts[1],
      };
    }

    const sameAs: string[] = [];
    if (personalInfo.linkedin) sameAs.push(personalInfo.linkedin);
    if (personalInfo.github) sameAs.push(personalInfo.github);
    if (personalInfo.twitter) sameAs.push(personalInfo.twitter);
    if (sameAs.length > 0) {
      personSchema.sameAs = sameAs;
    }

    if (experience.length > 0) {
      personSchema.worksFor = experience.map(exp => ({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: exp.company,
      }));
    }

    if (education.length > 0) {
      personSchema.alumniOf = education.map(edu => ({
        '@context': 'https://schema.org',
        '@type': 'EducationalOrganization',
        name: edu.institution,
      }));
    }

    if (skills.length > 0) {
      personSchema.knowsAbout = skills.map(skill => skill.name);
    }

    if (experience.length > 0) {
      personSchema.hasOccupation = experience
        .filter(exp => !exp.endDate)
        .map(exp => ({
          '@type': 'Occupation',
          name: exp.position,
          occupationLocation: exp.location ? {
            '@type': 'City',
            name: exp.location,
          } : undefined,
        }))
        .filter(occ => occ.occupationLocation !== undefined);
    }

    return this.applyCustomExtensions(personSchema) as PersonSchema;
  }

  public generateWebSiteSchema(): WebSiteSchema {
    const { personalInfo } = this.config;
    
    const webSiteSchema: WebSiteSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${this.options.baseUrl}/#website`,
      name: `${personalInfo.name} - Portfolio`,
      url: this.options.baseUrl,
    };

    if (personalInfo.bio) {
      webSiteSchema.description = personalInfo.bio;
    }

    webSiteSchema.author = this.generatePersonSchema();

    webSiteSchema.inLanguage = 'en-US';

    if (this.options.includeOptionalFields) {
      webSiteSchema.potentialAction = [{
        '@type': 'SearchAction',
        target: `${this.options.baseUrl}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      }];
    }

    return this.applyCustomExtensions(webSiteSchema) as WebSiteSchema;
  }

  public generateCreativeWorkSchemas(): CreativeWorkSchema[] {
    const { projects, personalInfo } = this.config;
    const personSchema = this.generatePersonSchema();
    
    return projects.map(project => {
      const creativeWorkSchema: CreativeWorkSchema = {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        '@id': `${this.options.baseUrl}/projects/${project.id}`,
        name: project.title,
        description: project.description,
        author: personSchema,
      };

      if (project.startDate) {
        creativeWorkSchema.dateCreated = project.startDate;
      }

      if (project.endDate) {
        creativeWorkSchema.dateModified = project.endDate;
      }

      if (project.technologies.length > 0) {
        creativeWorkSchema.keywords = project.technologies;
        creativeWorkSchema.programmingLanguage = project.technologies.filter(tech => 
          this.isProgrammingLanguage(tech)
        );
      }

      if (project.features.length > 0) {
        creativeWorkSchema.about = project.features;
      }

      if (project.category) {
        creativeWorkSchema.genre = project.category;
      }

      if (project.demoUrl) {
        creativeWorkSchema.url = project.demoUrl;
      }

      if (project.githubUrl) {
        creativeWorkSchema.codeRepository = project.githubUrl;
      }

      return this.applyCustomExtensions(creativeWorkSchema) as CreativeWorkSchema;
    });
  }

  public generateFAQPageSchema(faqs: Array<{ question: string; answer: string }>): FAQPageSchema {
    const faqSchema: FAQPageSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': `${this.options.baseUrl}/#faq`,
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    };

    return this.applyCustomExtensions(faqSchema) as FAQPageSchema;
  }

  public generateBreadcrumbListSchema(breadcrumbs: Array<{ name: string; url: string }>): BreadcrumbListSchema {
    const breadcrumbSchema: BreadcrumbListSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      '@id': `${this.options.baseUrl}/#breadcrumb`,
      itemListElement: breadcrumbs.map((breadcrumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: breadcrumb.name,
        item: breadcrumb.url,
      })),
    };

    return this.applyCustomExtensions(breadcrumbSchema) as BreadcrumbListSchema;
  }

  public generateJobPostingSchemas(): any[] {
    const { experience, personalInfo } = this.config;
    
    if (!this.structuredDataConfig.includeJobPostings) {
      return [];
    }

    return experience
      .filter(exp => !exp.endDate)
      .map(exp => ({
        '@context': 'https://schema.org',
        '@type': 'JobPosting',
        '@id': `${this.options.baseUrl}/experience/${exp.id}`,
        title: exp.position,
        description: exp.description,
        hiringOrganization: {
          '@type': 'Organization',
          name: exp.company,
        },
        jobLocation: exp.location ? {
          '@type': 'Place',
          address: {
            '@type': 'PostalAddress',
            addressLocality: exp.location,
          },
        } : undefined,
        employmentType: exp.type?.toUpperCase(),
        datePosted: exp.startDate,
        skills: exp.technologies.join(', '),
      }))
      .filter(job => job.jobLocation !== undefined);
  }

  public generateAllSchemas(): Record<string, any> {
    const schemas: Record<string, any> = {};

    if (this.structuredDataConfig.schemas.person) {
      schemas.person = this.generatePersonSchema();
    }

    if (this.structuredDataConfig.schemas.webSite) {
      schemas.website = this.generateWebSiteSchema();
    }

    if (this.structuredDataConfig.includeProjects) {
      schemas.creativeWorks = this.generateCreativeWorkSchemas();
    }

    if (this.structuredDataConfig.schemas.breadcrumbList) {
      const defaultBreadcrumbs = [
        { name: 'Home', url: this.options.baseUrl },
        { name: 'Portfolio', url: `${this.options.baseUrl}/portfolio` },
      ];
      schemas.breadcrumb = this.generateBreadcrumbListSchema(defaultBreadcrumbs);
    }

    if (this.structuredDataConfig.includeJobPostings) {
      const jobPostings = this.generateJobPostingSchemas();
      if (jobPostings.length > 0) {
        schemas.jobPostings = jobPostings;
      }
    }

    return schemas;
  }

  public generateHTMLScriptTag(schema: any): string {
    const jsonLD = JSON.stringify(schema, null, this.options.formatForHTML ? 2 : 0);
    return `<script type="application/ld+json">\n${jsonLD}\n</script>`;
  }

  public generateAllHTMLScriptTags(): string {
    const schemas = this.generateAllSchemas();
    const scriptTags: string[] = [];

    Object.entries(schemas).forEach(([key, schema]) => {
      if (Array.isArray(schema)) {
        schema.forEach(item => {
          scriptTags.push(this.generateHTMLScriptTag(item));
        });
      } else {
        scriptTags.push(this.generateHTMLScriptTag(schema));
      }
    });

    return scriptTags.join('\n\n');
  }

  public validateSchema(schema: any): ValidationError[] {
    const errors: ValidationError[] = [];
    
    if (!schema['@context']) {
      errors.push({
        field: '@context',
        message: '@context is required',
        schemaType: schema['@type'],
      });
    }

    if (!schema['@type']) {
      errors.push({
        field: '@type',
        message: '@type is required',
        schemaType: 'Unknown',
      });
    }

    switch (schema['@type']) {
      case 'Person':
        if (!schema.name) {
          errors.push({
            field: 'name',
            message: 'name is required for Person schema',
            schemaType: 'Person',
          });
        }
        break;

      case 'WebSite':
        if (!schema.name) {
          errors.push({
            field: 'name',
            message: 'name is required for WebSite schema',
            schemaType: 'WebSite',
          });
        }
        if (!schema.url) {
          errors.push({
            field: 'url',
            message: 'url is required for WebSite schema',
            schemaType: 'WebSite',
          });
        }
        break;

      case 'CreativeWork':
        if (!schema.name) {
          errors.push({
            field: 'name',
            message: 'name is required for CreativeWork schema',
            schemaType: 'CreativeWork',
          });
        }
        if (!schema.author) {
          errors.push({
            field: 'author',
            message: 'author is required for CreativeWork schema',
            schemaType: 'CreativeWork',
          });
        }
        break;

      case 'FAQPage':
        if (!schema.mainEntity || !Array.isArray(schema.mainEntity)) {
          errors.push({
            field: 'mainEntity',
            message: 'mainEntity array is required for FAQPage schema',
            schemaType: 'FAQPage',
          });
        }
        break;

      case 'BreadcrumbList':
        if (!schema.itemListElement || !Array.isArray(schema.itemListElement)) {
          errors.push({
            field: 'itemListElement',
            message: 'itemListElement array is required for BreadcrumbList schema',
            schemaType: 'BreadcrumbList',
          });
        }
        break;
    }

    return errors;
  }

  public validateAllSchemas(): Record<string, ValidationError[]> {
    const schemas = this.generateAllSchemas();
    const validationResults: Record<string, ValidationError[]> = {};

    Object.entries(schemas).forEach(([key, schema]) => {
      if (Array.isArray(schema)) {
        validationResults[key] = schema.flatMap((item, index) => 
          this.validateSchema(item).map(error => ({
            ...error,
            field: `[${index}].${error.field}`,
          }))
        );
      } else {
        validationResults[key] = this.validateSchema(schema);
      }
    });

    return validationResults;
  }

  private isProgrammingLanguage(tech: string): boolean {
    const programmingLanguages = [
      'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust',
      'PHP', 'Ruby', 'Swift', 'Kotlin', 'Dart', 'Scala', 'R', 'MATLAB',
      'HTML', 'CSS', 'SQL', 'GraphQL', 'Shell', 'Bash', 'PowerShell',
    ];
    
    return programmingLanguages.some(lang => 
      tech.toLowerCase().includes(lang.toLowerCase())
    );
  }

  private applyCustomExtensions(schema: any): any {
    if (!this.options.customExtensions) {
      return schema;
    }

    return {
      ...schema,
      ...this.options.customExtensions,
    };
  }

  public static generateDefault(
    config: PortfolioConfig,
    baseUrl: string,
    customOptions: Partial<StructuredDataOptions> = {}
  ): string {
    const defaultStructuredDataConfig: StructuredDataConfig = {
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

    const defaultOptions: StructuredDataOptions = {
      baseUrl,
      includeOptionalFields: true,
      validateOutput: true,
      formatForHTML: true,
      ...customOptions,
    };

    const generator = new StructuredDataGenerator(
      config,
      defaultStructuredDataConfig,
      defaultOptions
    );

    return generator.generateAllHTMLScriptTags();
  }
}