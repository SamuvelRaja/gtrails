import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import util from 'util';

const execAsync = util.promisify(exec);

const REQUIRED_TEMPLATE_IDS = ['template1', 'template2', 'template3', 'template4'] as const;

type BuildDeployResult =
  | { ok: true }
  | { ok: false; message: string };

export async function hasGeneratedWebsiteOutput(slug: string): Promise<boolean> {
  const websiteRoot = path.join(process.cwd(), 'data', slug, 'website');

  for (const templateId of REQUIRED_TEMPLATE_IDS) {
    const templateIndexPath = path.join(websiteRoot, templateId, 'index.html');
    try {
      await fs.access(templateIndexPath);
    } catch {
      return false;
    }
  }

  return true;
}

export async function runBuildDeploy(trigger: string): Promise<BuildDeployResult> {
  const env = {
    ...process.env,
    NODE_ENV: 'production',
  } as NodeJS.ProcessEnv;

  try {
    const { stdout, stderr } = await execAsync('npm run build:deploy', {
      env,
      shell: '/bin/bash',
      maxBuffer: 20 * 1024 * 1024,
    });

    console.log(`[build:deploy] Trigger: ${trigger}`);
    console.log(stdout);
    if (stderr?.trim()) {
      console.warn(stderr);
    }

    return { ok: true };
  } catch (error) {
    const err = error as Error & { stdout?: string; stderr?: string };
    if (err.stdout?.trim()) {
      console.error(err.stdout);
    }
    if (err.stderr?.trim()) {
      console.error(err.stderr);
    }

    return {
      ok: false,
      message: err.message || 'Unknown error while running build:deploy',
    };
  }
}