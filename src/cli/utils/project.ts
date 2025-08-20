import fs from 'fs-extra';
import path from 'path';
import { PortfolioConfig } from '../../config/portfolio.config';

/**
 * Project utilities for finding and loading project configurations
 */

export async function findProjectRoot(): Promise<string | null> {
  let currentDir = process.cwd();
  
  while (currentDir !== path.dirname(currentDir)) {
    const packageJsonPath = path.join(currentDir, 'package.json');
    const configPath = path.join(currentDir, 'portfolio.config.js');
    
    if (await fs.pathExists(packageJsonPath) || await fs.pathExists(configPath)) {
      return currentDir;
    }
    
    currentDir = path.dirname(currentDir);
  }
  
  return null;
}

export async function loadProjectConfig(projectRoot: string): Promise<PortfolioConfig> {
  const configPath = path.join(projectRoot, 'portfolio.config.js');
  
  if (await fs.pathExists(configPath)) {
    try {
      const config = require(configPath);
      return config.default || config;
    } catch (error) {
      throw new Error(`Failed to load portfolio config: ${error}`);
    }
  }
  
  // Return default config if no config file exists
  return {
    personalInfo: {
      name: 'Your Name',
      title: 'Professional Title',
      bio: 'Your professional bio',
      email: 'your@email.com',
      website: 'https://yourwebsite.com',
      location: 'Your Location'
    },
    skills: [],
    experience: [],
    projects: [],
    education: [],
    siteUrl: 'https://yoursite.com'
  };
}