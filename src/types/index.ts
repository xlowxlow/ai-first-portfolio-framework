export interface PersonSchema {
  '@context': string;
  '@type': 'Person';
  name: string;
  jobTitle?: string;
  description?: string;
  url?: string;
  image?: string;
  email?: string;
  telephone?: string;
  address?: {
    '@type': 'PostalAddress';
    addressLocality?: string;
    addressRegion?: string;
    addressCountry?: string;
  };
  sameAs?: string[];
  knowsAbout?: string[];
}

export interface TemplateConfig {
  type: 'developer' | 'designer' | 'writer';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  features: string[];
  sections: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies?: string[];
  url?: string;
  github?: string;
  image?: string;
  featured?: boolean;
}

export interface BlogPost {
  title: string;
  slug: string;
  description: string;
  publishDate: Date;
  tags?: string[];
  featured?: boolean;
}

export interface SiteConfig {
  title: string;
  description: string;
  author: string;
  url: string;
  template: TemplateConfig['type'];
  social: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    email?: string;
  };
  person: PersonSchema;
}