export interface LayoutConfig {
  type: 'single-page' | 'multi-page' | 'hybrid';
  navigation: 'top' | 'side' | 'bottom' | 'sticky';
  header: {
    style: 'minimal' | 'hero' | 'centered' | 'split';
    showAvatar: boolean;
    showSocialLinks: boolean;
    backgroundType: 'solid' | 'gradient' | 'image' | 'video';
    backgroundValue?: string;
  };
  footer: {
    enabled: boolean;
    style: 'minimal' | 'detailed' | 'social-focused';
    showCopyright: boolean;
    customContent?: string;
  };
}

export interface ComponentConfig {
  about: {
    style: 'card' | 'inline' | 'sidebar';
    showDownloadCV: boolean;
    showSocialLinks: boolean;
  };
  skills: {
    displayType: 'bars' | 'circles' | 'tags' | 'grid';
    groupByCategory: boolean;
    showProficiencyLevel: boolean;
    showYearsOfExperience: boolean;
  };
  experience: {
    layout: 'timeline' | 'cards' | 'list';
    showCompanyLogos: boolean;
    showDuration: boolean;
    expandableDescriptions: boolean;
  };
  projects: {
    layout: 'grid' | 'masonry' | 'carousel' | 'list';
    itemsPerRow: number;
    showTechnologies: boolean;
    showLiveDemo: boolean;
    showSourceCode: boolean;
    filterByCategory: boolean;
  };
  contact: {
    style: 'form' | 'info' | 'combined';
    showMap: boolean;
    enableContactForm: boolean;
    formFields: string[];
  };
}

export interface AnimationConfig {
  enabled: boolean;
  entranceAnimations: boolean;
  scrollAnimations: boolean;
  hoverEffects: boolean;
  transitionDuration: number;
  easing: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
}

export interface ResponsiveConfig {
  breakpoints: {
    mobile: number;
    tablet: number;
    desktop: number;
    widescreen: number;
  };
  mobileFirst: boolean;
  adaptiveImages: boolean;
  touchOptimized: boolean;
}

export interface CustomizationConfig {
  customCSS?: string;
  customJS?: string;
  additionalFonts: string[];
  iconLibrary: 'lucide' | 'heroicons' | 'feather' | 'fontawesome' | 'custom';
  customComponents: Record<string, any>;
}

export interface TemplateConfig {
  name: string;
  version: string;
  description: string;
  layout: LayoutConfig;
  components: ComponentConfig;
  animations: AnimationConfig;
  responsive: ResponsiveConfig;
  customization: CustomizationConfig;
  previewImage?: string;
  tags: string[];
}

export const availableTemplates = {
  modern: 'Modern Professional',
  creative: 'Creative Portfolio',
  minimal: 'Minimal Clean',
  corporate: 'Corporate Business',
  developer: 'Developer Focused',
  designer: 'Designer Showcase',
  academic: 'Academic Resume',
  startup: 'Startup Founder',
} as const;

export type TemplateType = keyof typeof availableTemplates;

export const defaultTemplateConfig: TemplateConfig = {
  name: 'modern',
  version: '1.0.0',
  description: 'A modern, clean professional portfolio template',
  layout: {
    type: 'single-page',
    navigation: 'sticky',
    header: {
      style: 'hero',
      showAvatar: true,
      showSocialLinks: true,
      backgroundType: 'gradient',
      backgroundValue: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    footer: {
      enabled: true,
      style: 'minimal',
      showCopyright: true,
    },
  },
  components: {
    about: {
      style: 'card',
      showDownloadCV: true,
      showSocialLinks: true,
    },
    skills: {
      displayType: 'bars',
      groupByCategory: true,
      showProficiencyLevel: true,
      showYearsOfExperience: false,
    },
    experience: {
      layout: 'timeline',
      showCompanyLogos: false,
      showDuration: true,
      expandableDescriptions: true,
    },
    projects: {
      layout: 'grid',
      itemsPerRow: 3,
      showTechnologies: true,
      showLiveDemo: true,
      showSourceCode: true,
      filterByCategory: true,
    },
    contact: {
      style: 'combined',
      showMap: false,
      enableContactForm: true,
      formFields: ['name', 'email', 'subject', 'message'],
    },
  },
  animations: {
    enabled: true,
    entranceAnimations: true,
    scrollAnimations: true,
    hoverEffects: true,
    transitionDuration: 300,
    easing: 'ease-out',
  },
  responsive: {
    breakpoints: {
      mobile: 640,
      tablet: 768,
      desktop: 1024,
      widescreen: 1280,
    },
    mobileFirst: true,
    adaptiveImages: true,
    touchOptimized: true,
  },
  customization: {
    additionalFonts: [],
    iconLibrary: 'lucide',
    customComponents: {},
  },
  tags: ['modern', 'professional', 'clean'],
};