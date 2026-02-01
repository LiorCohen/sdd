/**
 * Configuration loading utilities for the CLI.
 */

import * as path from 'node:path';
import { readJson, exists } from './fs';

/**
 * SDD project configuration from .sdd/sdd-settings.yaml or package.json.
 */
export interface SddConfig {
  readonly projectName: string;
  readonly specsDir: string;
  readonly componentsDir: string;
}

/**
 * Get the plugin root directory from environment or derive from current file.
 */
export const getPluginRoot = (): string => {
  // First check environment variable
  const envRoot = process.env['CLAUDE_PLUGIN_ROOT'];
  if (envRoot) {
    return envRoot;
  }

  // Derive from this file's location: plugin/system/src/lib/config.ts -> plugin/
  // In dist: plugin/system/dist/lib/config.js -> plugin/
  const currentDir = path.dirname(new URL(import.meta.url).pathname);

  // Go up from src/lib or dist/lib to plugin/
  return path.resolve(currentDir, '..', '..', '..');
};

/**
 * Get the skills directory.
 */
export const getSkillsDir = (): string => {
  return path.join(getPluginRoot(), 'skills');
};

/**
 * Load project configuration from the target directory.
 */
export const loadProjectConfig = async (targetDir: string): Promise<SddConfig | null> => {
  const packageJsonPath = path.join(targetDir, 'package.json');

  if (!(await exists(packageJsonPath))) {
    return null;
  }

  try {
    const pkg = await readJson<{ name?: string }>(packageJsonPath);
    return {
      projectName: pkg.name ?? path.basename(targetDir),
      specsDir: path.join(targetDir, 'specs'),
      componentsDir: path.join(targetDir, 'components'),
    };
  } catch {
    return null;
  }
};

/**
 * Find the project root by looking for package.json or .sdd/sdd-settings.yaml.
 * Checks .sdd/sdd-settings.yaml first (new location), then falls back to legacy root location.
 */
export const findProjectRoot = async (startDir: string = process.cwd()): Promise<string | null> => {
  let currentDir = startDir;
  const root = path.parse(currentDir).root;

  while (currentDir !== root) {
    const packageJsonPath = path.join(currentDir, 'package.json');
    const sddSettingsPath = path.join(currentDir, '.sdd', 'sdd-settings.yaml');
    const legacySettingsPath = path.join(currentDir, 'sdd-settings.yaml');

    // Check package.json or new .sdd/ location
    if ((await exists(packageJsonPath)) || (await exists(sddSettingsPath))) {
      return currentDir;
    }

    // Legacy fallback: sdd-settings.yaml at project root
    if (await exists(legacySettingsPath)) {
      console.warn(
        '[SDD] Deprecation warning: sdd-settings.yaml at project root is deprecated. ' +
          'Move it to .sdd/sdd-settings.yaml: mkdir -p .sdd && mv sdd-settings.yaml .sdd/'
      );
      return currentDir;
    }

    currentDir = path.dirname(currentDir);
  }

  return null;
};
