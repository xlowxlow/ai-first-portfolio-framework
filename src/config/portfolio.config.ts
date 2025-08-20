export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone?: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  bio: string;
  avatar?: string;
}

export interface Skill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category: 'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'Mobile' | 'AI/ML' | 'Design' | 'Other';
  yearsOfExperience?: number;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
  technologies: string[];
  achievements: string[];
  location?: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance' | 'Internship';
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  gpa?: number;
  achievements?: string[];
  location?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  features: string[];
  demoUrl?: string;
  githubUrl?: string;
  imageUrl?: string;
  status: 'Completed' | 'In Progress' | 'Planned';
  startDate: string;
  endDate?: string;
  category: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
  credentialUrl?: string;
  expirationDate?: string;
}

export interface PortfolioConfig {
  personalInfo: PersonalInfo;
  skills: Skill[];
  experience: Experience[];
  education: Education[];
  projects: Project[];
  certifications: Certification[];
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
    fontFamily: string;
  };
  sections: {
    showAbout: boolean;
    showSkills: boolean;
    showExperience: boolean;
    showEducation: boolean;
    showProjects: boolean;
    showCertifications: boolean;
    showContact: boolean;
  };
}

export const defaultPortfolioConfig: PortfolioConfig = {
  personalInfo: {
    name: '',
    title: '',
    email: '',
    location: '',
    bio: '',
  },
  skills: [],
  experience: [],
  education: [],
  projects: [],
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