import { PortfolioConfig, PersonalInfo, Skill, Experience, Project } from '../config/portfolio.config';
import { LLMSTxtConfig } from '../config/ai-optimization.config';

export type SupportedLanguage = 'en' | 'zh' | 'zh-CN' | 'zh-TW';

export interface LLMSTxtOptions {
  language: SupportedLanguage;
  includeApiEndpoints?: boolean;
  customSections?: Record<string, string>;
  maxLength?: number;
  format: 'markdown' | 'plain' | 'structured';
  includeMetadata?: boolean;
  siteUrl?: string;
}

export interface LLMSTxtSection {
  title: string;
  content: string;
  order: number;
}

export class LLMSTxtGenerator {
  private config: PortfolioConfig;
  private llmsConfig: LLMSTxtConfig;
  private options: LLMSTxtOptions;

  constructor(config: PortfolioConfig, llmsConfig: LLMSTxtConfig, options: LLMSTxtOptions) {
    this.config = config;
    this.llmsConfig = llmsConfig;
    this.options = options;
  }

  private getTranslations(language: SupportedLanguage) {
    const translations = {
      en: {
        title: 'Portfolio Information for Large Language Models',
        personalInfo: 'Personal Information',
        skills: 'Professional Skills',
        experience: 'Work Experience',
        projects: 'Projects',
        contact: 'Contact Information',
        apiEndpoints: 'API Endpoints',
        metadata: 'Metadata',
        skillLevel: 'Level',
        technologies: 'Technologies',
        achievements: 'Key Achievements',
        duration: 'Duration',
        status: 'Status',
        links: 'Links',
        generatedAt: 'Generated at',
        version: 'Version',
        source: 'Source',
        yearsExp: 'years experience',
        present: 'Present',
        website: 'Website',
        email: 'Email',
        phone: 'Phone',
        location: 'Location',
        github: 'GitHub',
        linkedin: 'LinkedIn',
        twitter: 'Twitter',
      },
      zh: {
        title: '大语言模型作品集信息',
        personalInfo: '个人信息',
        skills: '专业技能',
        experience: '工作经历',
        projects: '项目经验',
        contact: '联系方式',
        apiEndpoints: 'API端点',
        metadata: '元数据',
        skillLevel: '技能等级',
        technologies: '使用技术',
        achievements: '主要成就',
        duration: '时间',
        status: '状态',
        links: '链接',
        generatedAt: '生成时间',
        version: '版本',
        source: '来源',
        yearsExp: '年经验',
        present: '至今',
        website: '网站',
        email: '邮箱',
        phone: '电话',
        location: '地址',
        github: 'GitHub',
        linkedin: 'LinkedIn',
        twitter: 'Twitter',
      },
      'zh-CN': {
        title: '大语言模型作品集信息',
        personalInfo: '个人信息',
        skills: '专业技能',
        experience: '工作经历',
        projects: '项目经验',
        contact: '联系方式',
        apiEndpoints: 'API端点',
        metadata: '元数据',
        skillLevel: '技能等级',
        technologies: '使用技术',
        achievements: '主要成就',
        duration: '时间',
        status: '状态',
        links: '链接',
        generatedAt: '生成时间',
        version: '版本',
        source: '来源',
        yearsExp: '年经验',
        present: '至今',
        website: '网站',
        email: '邮箱',
        phone: '电话',
        location: '地址',
        github: 'GitHub',
        linkedin: 'LinkedIn',
        twitter: 'Twitter',
      },
      'zh-TW': {
        title: '大語言模型作品集資訊',
        personalInfo: '個人資訊',
        skills: '專業技能',
        experience: '工作經歷',
        projects: '專案經驗',
        contact: '聯絡方式',
        apiEndpoints: 'API端點',
        metadata: '元資料',
        skillLevel: '技能等級',
        technologies: '使用技術',
        achievements: '主要成就',
        duration: '時間',
        status: '狀態',
        links: '連結',
        generatedAt: '產生時間',
        version: '版本',
        source: '來源',
        yearsExp: '年經驗',
        present: '至今',
        website: '網站',
        email: '信箱',
        phone: '電話',
        location: '地址',
        github: 'GitHub',
        linkedin: 'LinkedIn',
        twitter: 'Twitter',
      },
    };
    return translations[language] || translations.en;
  }

  private formatDate(dateString: string, language: SupportedLanguage): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long' 
    };
    
    const locale = language.startsWith('zh') ? 'zh-CN' : 'en-US';
    return date.toLocaleDateString(locale, options);
  }

  private generatePersonalInfoSection(): LLMSTxtSection {
    const t = this.getTranslations(this.options.language);
    const { personalInfo } = this.config;
    
    let content = '';
    
    if (this.options.format === 'markdown') {
      content += `## ${t.personalInfo}\n\n`;
      content += `**${personalInfo.name}** - ${personalInfo.title}\n\n`;
      content += `${personalInfo.bio}\n\n`;
      
      if (personalInfo.location) {
        content += `**${t.location}:** ${personalInfo.location}\n`;
      }
    } else if (this.options.format === 'structured') {
      content += `${t.personalInfo}:\n`;
      content += `  Name: ${personalInfo.name}\n`;
      content += `  Title: ${personalInfo.title}\n`;
      content += `  Bio: ${personalInfo.bio}\n`;
      if (personalInfo.location) {
        content += `  Location: ${personalInfo.location}\n`;
      }
    } else {
      content += `${t.personalInfo}\n`;
      content += `${personalInfo.name} - ${personalInfo.title}\n`;
      content += `${personalInfo.bio}\n`;
      if (personalInfo.location) {
        content += `${t.location}: ${personalInfo.location}\n`;
      }
    }
    
    return {
      title: t.personalInfo,
      content,
      order: 1,
    };
  }

  private generateSkillsSection(): LLMSTxtSection {
    const t = this.getTranslations(this.options.language);
    const { skills } = this.config;
    
    let content = '';
    
    if (this.options.format === 'markdown') {
      content += `## ${t.skills}\n\n`;
      
      const skillsByCategory = skills.reduce((acc, skill) => {
        if (!acc[skill.category]) {
          acc[skill.category] = [];
        }
        acc[skill.category].push(skill);
        return acc;
      }, {} as Record<string, Skill[]>);

      Object.entries(skillsByCategory).forEach(([category, categorySkills]) => {
        content += `### ${category}\n`;
        categorySkills.forEach(skill => {
          content += `- **${skill.name}** (${t.skillLevel}: ${skill.level}`;
          if (skill.yearsOfExperience && this.llmsConfig.includeAchievements) {
            content += `, ${skill.yearsOfExperience} ${t.yearsExp}`;
          }
          content += `)\n`;
        });
        content += '\n';
      });
    } else if (this.options.format === 'structured') {
      content += `${t.skills}:\n`;
      skills.forEach(skill => {
        content += `  - ${skill.name}: ${skill.level}`;
        if (skill.yearsOfExperience) {
          content += ` (${skill.yearsOfExperience} ${t.yearsExp})`;
        }
        content += ` [${skill.category}]\n`;
      });
    } else {
      content += `${t.skills}\n`;
      skills.forEach(skill => {
        content += `${skill.name} - ${skill.level}`;
        if (skill.yearsOfExperience) {
          content += ` (${skill.yearsOfExperience} ${t.yearsExp})`;
        }
        content += `\n`;
      });
    }
    
    return {
      title: t.skills,
      content,
      order: 2,
    };
  }

  private generateExperienceSection(): LLMSTxtSection {
    const t = this.getTranslations(this.options.language);
    const { experience } = this.config;
    
    let content = '';
    
    if (this.options.format === 'markdown') {
      content += `## ${t.experience}\n\n`;
      
      experience.forEach(exp => {
        const startDate = this.formatDate(exp.startDate, this.options.language);
        const endDate = exp.endDate ? this.formatDate(exp.endDate, this.options.language) : t.present;
        
        content += `### ${exp.position} at ${exp.company}\n`;
        content += `**${t.duration}:** ${startDate} - ${endDate}\n\n`;
        content += `${exp.description}\n\n`;
        
        if (exp.technologies.length > 0 && this.llmsConfig.includeTechnicalDetails) {
          content += `**${t.technologies}:** ${exp.technologies.join(', ')}\n\n`;
        }
        
        if (exp.achievements.length > 0 && this.llmsConfig.includeAchievements) {
          content += `**${t.achievements}:**\n`;
          exp.achievements.forEach(achievement => {
            content += `- ${achievement}\n`;
          });
          content += '\n';
        }
      });
    } else if (this.options.format === 'structured') {
      content += `${t.experience}:\n`;
      experience.forEach(exp => {
        const startDate = this.formatDate(exp.startDate, this.options.language);
        const endDate = exp.endDate ? this.formatDate(exp.endDate, this.options.language) : t.present;
        
        content += `  - Position: ${exp.position}\n`;
        content += `    Company: ${exp.company}\n`;
        content += `    Duration: ${startDate} - ${endDate}\n`;
        content += `    Description: ${exp.description}\n`;
        
        if (exp.technologies.length > 0) {
          content += `    Technologies: ${exp.technologies.join(', ')}\n`;
        }
      });
    } else {
      content += `${t.experience}\n`;
      experience.forEach(exp => {
        const startDate = this.formatDate(exp.startDate, this.options.language);
        const endDate = exp.endDate ? this.formatDate(exp.endDate, this.options.language) : t.present;
        
        content += `${exp.position} at ${exp.company} (${startDate} - ${endDate})\n`;
        content += `${exp.description}\n`;
        if (exp.technologies.length > 0) {
          content += `${t.technologies}: ${exp.technologies.join(', ')}\n`;
        }
        content += '\n';
      });
    }
    
    return {
      title: t.experience,
      content,
      order: 3,
    };
  }

  private generateProjectsSection(): LLMSTxtSection {
    const t = this.getTranslations(this.options.language);
    const { projects } = this.config;
    
    let content = '';
    
    if (this.options.format === 'markdown') {
      content += `## ${t.projects}\n\n`;
      
      projects.forEach(project => {
        content += `### ${project.title}\n`;
        content += `**${t.status}:** ${project.status}\n\n`;
        content += `${project.description}\n\n`;
        
        if (project.features.length > 0) {
          content += `**Features:**\n`;
          project.features.forEach(feature => {
            content += `- ${feature}\n`;
          });
          content += '\n';
        }
        
        if (project.technologies.length > 0 && this.llmsConfig.includeTechnicalDetails) {
          content += `**${t.technologies}:** ${project.technologies.join(', ')}\n\n`;
        }
        
        if (project.demoUrl || project.githubUrl) {
          content += `**${t.links}:**\n`;
          if (project.demoUrl) {
            content += `- Demo: ${project.demoUrl}\n`;
          }
          if (project.githubUrl) {
            content += `- GitHub: ${project.githubUrl}\n`;
          }
          content += '\n';
        }
      });
    } else if (this.options.format === 'structured') {
      content += `${t.projects}:\n`;
      projects.forEach(project => {
        content += `  - Title: ${project.title}\n`;
        content += `    Status: ${project.status}\n`;
        content += `    Description: ${project.description}\n`;
        
        if (project.technologies.length > 0) {
          content += `    Technologies: ${project.technologies.join(', ')}\n`;
        }
        
        if (project.demoUrl) {
          content += `    Demo: ${project.demoUrl}\n`;
        }
        if (project.githubUrl) {
          content += `    GitHub: ${project.githubUrl}\n`;
        }
      });
    } else {
      content += `${t.projects}\n`;
      projects.forEach(project => {
        content += `${project.title} - ${project.status}\n`;
        content += `${project.description}\n`;
        if (project.technologies.length > 0) {
          content += `${t.technologies}: ${project.technologies.join(', ')}\n`;
        }
        if (project.demoUrl) {
          content += `Demo: ${project.demoUrl}\n`;
        }
        if (project.githubUrl) {
          content += `GitHub: ${project.githubUrl}\n`;
        }
        content += '\n';
      });
    }
    
    return {
      title: t.projects,
      content,
      order: 4,
    };
  }

  private generateContactSection(): LLMSTxtSection {
    const t = this.getTranslations(this.options.language);
    const { personalInfo } = this.config;
    
    let content = '';
    
    if (this.options.format === 'markdown') {
      content += `## ${t.contact}\n\n`;
      
      if (personalInfo.email) {
        content += `**${t.email}:** ${personalInfo.email}\n`;
      }
      if (personalInfo.phone) {
        content += `**${t.phone}:** ${personalInfo.phone}\n`;
      }
      if (personalInfo.website) {
        content += `**${t.website}:** ${personalInfo.website}\n`;
      }
      if (personalInfo.linkedin) {
        content += `**LinkedIn:** ${personalInfo.linkedin}\n`;
      }
      if (personalInfo.github) {
        content += `**GitHub:** ${personalInfo.github}\n`;
      }
      if (personalInfo.twitter) {
        content += `**Twitter:** ${personalInfo.twitter}\n`;
      }
    } else if (this.options.format === 'structured') {
      content += `${t.contact}:\n`;
      if (personalInfo.email) {
        content += `  Email: ${personalInfo.email}\n`;
      }
      if (personalInfo.phone) {
        content += `  Phone: ${personalInfo.phone}\n`;
      }
      if (personalInfo.website) {
        content += `  Website: ${personalInfo.website}\n`;
      }
      if (personalInfo.linkedin) {
        content += `  LinkedIn: ${personalInfo.linkedin}\n`;
      }
      if (personalInfo.github) {
        content += `  GitHub: ${personalInfo.github}\n`;
      }
      if (personalInfo.twitter) {
        content += `  Twitter: ${personalInfo.twitter}\n`;
      }
    } else {
      content += `${t.contact}\n`;
      if (personalInfo.email) {
        content += `${t.email}: ${personalInfo.email}\n`;
      }
      if (personalInfo.phone) {
        content += `${t.phone}: ${personalInfo.phone}\n`;
      }
      if (personalInfo.website) {
        content += `${t.website}: ${personalInfo.website}\n`;
      }
      if (personalInfo.linkedin) {
        content += `LinkedIn: ${personalInfo.linkedin}\n`;
      }
      if (personalInfo.github) {
        content += `GitHub: ${personalInfo.github}\n`;
      }
      if (personalInfo.twitter) {
        content += `Twitter: ${personalInfo.twitter}\n`;
      }
    }
    
    return {
      title: t.contact,
      content,
      order: 5,
    };
  }

  private generateApiEndpointsSection(): LLMSTxtSection {
    const t = this.getTranslations(this.options.language);
    const baseUrl = this.options.siteUrl || 'https://your-portfolio.com';
    
    let content = '';
    
    if (this.options.format === 'markdown') {
      content += `## ${t.apiEndpoints}\n\n`;
      content += `This portfolio provides the following API endpoints for programmatic access:\n\n`;
      content += `- \`GET ${baseUrl}/api/profile\` - Get basic profile information\n`;
      content += `- \`GET ${baseUrl}/api/skills\` - Get skills and expertise data\n`;
      content += `- \`GET ${baseUrl}/api/experience\` - Get work experience data\n`;
      content += `- \`GET ${baseUrl}/api/projects\` - Get projects portfolio\n`;
      content += `- \`GET ${baseUrl}/llms.txt\` - Get this LLM-optimized summary\n\n`;
    } else if (this.options.format === 'structured') {
      content += `${t.apiEndpoints}:\n`;
      content += `  Profile: GET ${baseUrl}/api/profile\n`;
      content += `  Skills: GET ${baseUrl}/api/skills\n`;
      content += `  Experience: GET ${baseUrl}/api/experience\n`;
      content += `  Projects: GET ${baseUrl}/api/projects\n`;
      content += `  LLMs.txt: GET ${baseUrl}/llms.txt\n`;
    } else {
      content += `${t.apiEndpoints}\n`;
      content += `Profile: GET ${baseUrl}/api/profile\n`;
      content += `Skills: GET ${baseUrl}/api/skills\n`;
      content += `Experience: GET ${baseUrl}/api/experience\n`;
      content += `Projects: GET ${baseUrl}/api/projects\n`;
      content += `LLMs.txt: GET ${baseUrl}/llms.txt\n`;
    }
    
    return {
      title: t.apiEndpoints,
      content,
      order: 6,
    };
  }

  private generateMetadataSection(): LLMSTxtSection {
    const t = this.getTranslations(this.options.language);
    
    let content = '';
    const now = new Date().toISOString();
    
    if (this.options.format === 'markdown') {
      content += `## ${t.metadata}\n\n`;
      content += `- **${t.generatedAt}:** ${now}\n`;
      content += `- **${t.version}:** ${this.config.metadata?.version || '1.0.0'}\n`;
      content += `- **${t.source}:** AI-First Portfolio Generator\n`;
    } else if (this.options.format === 'structured') {
      content += `${t.metadata}:\n`;
      content += `  Generated: ${now}\n`;
      content += `  Version: ${this.config.metadata?.version || '1.0.0'}\n`;
      content += `  Source: AI-First Portfolio Generator\n`;
    } else {
      content += `${t.metadata}\n`;
      content += `${t.generatedAt}: ${now}\n`;
      content += `${t.version}: ${this.config.metadata?.version || '1.0.0'}\n`;
      content += `${t.source}: AI-First Portfolio Generator\n`;
    }
    
    return {
      title: t.metadata,
      content,
      order: 7,
    };
  }

  private truncateContent(content: string, maxLength: number): string {
    if (content.length <= maxLength) {
      return content;
    }
    
    const truncated = content.substring(0, maxLength - 3);
    const lastNewline = truncated.lastIndexOf('\n');
    
    if (lastNewline > 0 && lastNewline > maxLength * 0.8) {
      return truncated.substring(0, lastNewline) + '\n\n...';
    }
    
    return truncated + '...';
  }

  public generate(): string {
    const t = this.getTranslations(this.options.language);
    const sections: LLMSTxtSection[] = [];

    if (this.llmsConfig.sections.includePersonalInfo) {
      sections.push(this.generatePersonalInfoSection());
    }

    if (this.llmsConfig.sections.includeSkills) {
      sections.push(this.generateSkillsSection());
    }

    if (this.llmsConfig.sections.includeExperience) {
      sections.push(this.generateExperienceSection());
    }

    if (this.llmsConfig.sections.includeProjects) {
      sections.push(this.generateProjectsSection());
    }

    sections.push(this.generateContactSection());

    if (this.options.includeApiEndpoints) {
      sections.push(this.generateApiEndpointsSection());
    }

    if (this.options.customSections) {
      Object.entries(this.options.customSections).forEach(([title, content], index) => {
        sections.push({
          title,
          content,
          order: 100 + index,
        });
      });
    }

    if (this.options.includeMetadata) {
      sections.push(this.generateMetadataSection());
    }

    sections.sort((a, b) => a.order - b.order);

    let result = '';
    
    if (this.options.format === 'markdown') {
      result += `# ${t.title}\n\n`;
    } else {
      result += `${t.title}\n${'='.repeat(t.title.length)}\n\n`;
    }

    result += sections.map(section => section.content).join('\n');

    if (this.options.maxLength && result.length > this.options.maxLength) {
      result = this.truncateContent(result, this.options.maxLength);
    }

    return result;
  }

  public static generateDefault(config: PortfolioConfig, options: Partial<LLMSTxtOptions> = {}): string {
    const defaultLLMSConfig: LLMSTxtConfig = {
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

    const defaultOptions: LLMSTxtOptions = {
      language: 'en',
      includeApiEndpoints: true,
      format: 'markdown',
      includeMetadata: true,
      ...options,
    };

    const generator = new LLMSTxtGenerator(config, defaultLLMSConfig, defaultOptions);
    return generator.generate();
  }
}