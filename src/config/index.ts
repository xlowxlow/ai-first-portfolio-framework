export * from './portfolio.config';
export * from './ai-optimization.config';
export * from './template.config';

import { PortfolioConfig, defaultPortfolioConfig } from './portfolio.config';
import { AIOptimizationConfig, defaultAIOptimizationConfig } from './ai-optimization.config';
import { TemplateConfig, defaultTemplateConfig, TemplateType, availableTemplates } from './template.config';

export interface AppConfig {
  portfolio: PortfolioConfig;
  aiOptimization: AIOptimizationConfig;
  template: TemplateConfig;
  metadata: {
    version: string;
    lastModified: string;
    createdAt: string;
  };
}

export const defaultAppConfig: AppConfig = {
  portfolio: defaultPortfolioConfig,
  aiOptimization: defaultAIOptimizationConfig,
  template: defaultTemplateConfig,
  metadata: {
    version: '1.0.0',
    lastModified: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
};

export interface ConfigValidationError {
  field: string;
  message: string;
  value?: any;
}

export class ConfigValidator {
  static validatePortfolioConfig(config: Partial<PortfolioConfig>): ConfigValidationError[] {
    const errors: ConfigValidationError[] = [];

    if (!config.personalInfo?.name) {
      errors.push({
        field: 'personalInfo.name',
        message: 'Name is required',
        value: config.personalInfo?.name,
      });
    }

    if (!config.personalInfo?.title) {
      errors.push({
        field: 'personalInfo.title',
        message: 'Title is required',
        value: config.personalInfo?.title,
      });
    }

    if (!config.personalInfo?.email) {
      errors.push({
        field: 'personalInfo.email',
        message: 'Email is required',
        value: config.personalInfo?.email,
      });
    } else if (!/\S+@\S+\.\S+/.test(config.personalInfo.email)) {
      errors.push({
        field: 'personalInfo.email',
        message: 'Invalid email format',
        value: config.personalInfo.email,
      });
    }

    return errors;
  }

  static validateAIOptimizationConfig(config: Partial<AIOptimizationConfig>): ConfigValidationError[] {
    const errors: ConfigValidationError[] = [];

    if (config.llmsTxt?.maxLength && config.llmsTxt.maxLength < 100) {
      errors.push({
        field: 'llmsTxt.maxLength',
        message: 'Maximum length should be at least 100 characters',
        value: config.llmsTxt.maxLength,
      });
    }

    if (config.caching?.ttl && config.caching.ttl < 60) {
      errors.push({
        field: 'caching.ttl',
        message: 'Cache TTL should be at least 60 seconds',
        value: config.caching.ttl,
      });
    }

    return errors;
  }

  static validateTemplateConfig(config: Partial<TemplateConfig>): ConfigValidationError[] {
    const errors: ConfigValidationError[] = [];

    if (config.responsive?.breakpoints) {
      const breakpoints = config.responsive.breakpoints;
      if (breakpoints.mobile >= breakpoints.tablet) {
        errors.push({
          field: 'responsive.breakpoints',
          message: 'Mobile breakpoint must be less than tablet breakpoint',
          value: breakpoints,
        });
      }
      if (breakpoints.tablet >= breakpoints.desktop) {
        errors.push({
          field: 'responsive.breakpoints',
          message: 'Tablet breakpoint must be less than desktop breakpoint',
          value: breakpoints,
        });
      }
    }

    if (config.animations?.transitionDuration && config.animations.transitionDuration < 50) {
      errors.push({
        field: 'animations.transitionDuration',
        message: 'Transition duration should be at least 50ms',
        value: config.animations.transitionDuration,
      });
    }

    return errors;
  }

  static validateAppConfig(config: Partial<AppConfig>): ConfigValidationError[] {
    const errors: ConfigValidationError[] = [];

    if (config.portfolio) {
      errors.push(...this.validatePortfolioConfig(config.portfolio));
    }

    if (config.aiOptimization) {
      errors.push(...this.validateAIOptimizationConfig(config.aiOptimization));
    }

    if (config.template) {
      errors.push(...this.validateTemplateConfig(config.template));
    }

    return errors;
  }
}

export { TemplateType, availableTemplates };