import fs from 'fs-extra';
import path from 'path';

/**
 * Template management utilities
 */

export interface TemplateInfo {
  name: string;
  displayName: string;
  description: string;
  path: string;
  framework: string;
}

export const AVAILABLE_TEMPLATES: TemplateInfo[] = [
  {
    name: 'developer',
    displayName: 'Developer Portfolio',
    description: 'Clean, professional portfolio for developers',
    path: 'templates/developer',
    framework: 'Astro + Tailwind CSS'
  },
  {
    name: 'designer',
    displayName: 'Designer Portfolio',
    description: 'Visual portfolio for designers and creatives',
    path: 'templates/designer',
    framework: 'Astro + Tailwind CSS'
  },
  {
    name: 'academic',
    displayName: 'Academic Portfolio',
    description: 'Professional portfolio for academics and researchers',
    path: 'templates/academic',
    framework: 'Astro + Tailwind CSS'
  }
];

export function getTemplate(name: string): TemplateInfo | null {
  return AVAILABLE_TEMPLATES.find(template => template.name === name) || null;
}

export async function copyTemplate(templateName: string, targetPath: string): Promise<void> {
  const template = getTemplate(templateName);
  if (!template) {
    throw new Error(`Template "${templateName}" not found`);
  }

  const templatePath = path.join(__dirname, '..', '..', '..', template.path);
  
  if (!await fs.pathExists(templatePath)) {
    throw new Error(`Template directory not found: ${templatePath}`);
  }

  await fs.copy(templatePath, targetPath);
}