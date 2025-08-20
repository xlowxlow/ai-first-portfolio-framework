import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';

/**
 * Package manager utilities
 */

export type PackageManager = 'npm' | 'yarn' | 'pnpm';

export function detectPackageManager(): PackageManager {
  // Check for lock files
  if (fs.existsSync('yarn.lock')) return 'yarn';
  if (fs.existsSync('pnpm-lock.yaml')) return 'pnpm';
  
  // Check for package manager in environment
  const userAgent = process.env.npm_config_user_agent;
  if (userAgent) {
    if (userAgent.startsWith('yarn')) return 'yarn';
    if (userAgent.startsWith('pnpm')) return 'pnpm';
  }
  
  return 'npm';
}

export async function installDependencies(
  projectPath: string, 
  packageManager: PackageManager = 'npm'
): Promise<void> {
  const commands = {
    npm: 'npm install',
    yarn: 'yarn install',
    pnpm: 'pnpm install'
  };

  const command = commands[packageManager];
  
  execSync(command, {
    cwd: projectPath,
    stdio: 'inherit'
  });
}

export function getRunCommand(packageManager: PackageManager, script: string): string {
  const commands = {
    npm: `npm run ${script}`,
    yarn: `yarn ${script}`,
    pnpm: `pnpm ${script}`
  };
  
  return commands[packageManager];
}