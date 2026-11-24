'use strict';

const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const crypto = require('node:crypto');
const { runDesignPipeline } = require('./orchestrator.cjs');

const SAFE_ID_RE = /^[A-Za-z0-9_-]{4,64}$/;

function defaultStudioHome(home = os.homedir()) {
  return process.env.UI_CRAFT_STUDIO_HOME || path.join(home, '.ui-craft-studio');
}

function atomicWriteText(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const tmp = path.join(path.dirname(filePath), `.${path.basename(filePath)}.${process.pid}.${Date.now()}.tmp`);
  fs.writeFileSync(tmp, content, { mode: 0o600 });
  fs.renameSync(tmp, filePath);
}

function assertSafeId(jobId) {
  if (!SAFE_ID_RE.test(String(jobId || ''))) {
    throw new Error('Invalid design jobId format.');
  }
}

class DesignStore {
  constructor(studioHome = defaultStudioHome()) {
    this.studioHome = path.resolve(studioHome);
    this.jobsDir = path.join(this.studioHome, 'jobs');
    fs.mkdirSync(this.jobsDir, { recursive: true });
  }

  jobDir(jobId) {
    assertSafeId(jobId);
    return path.join(this.jobsDir, jobId);
  }

  jobJsonPath(jobId) {
    return path.join(this.jobDir(jobId), 'job.json');
  }

  readJob(jobId) {
    const p = this.jobJsonPath(jobId);
    if (!fs.existsSync(p)) {
      throw new Error(`Design job not found: ${jobId}`);
    }
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  }

  writeJobArtifacts(job) {
    const dir = this.jobDir(job.id);
    fs.mkdirSync(dir, { recursive: true });
    atomicWriteText(path.join(dir, 'DESIGN.md'), job.designMd || '');
    atomicWriteText(path.join(dir, 'prototype.html'), job.interactiveHtml || '');
    if (job.codeBundles) {
      atomicWriteText(path.join(dir, 'code', 'tokens.css'), job.codeBundles.cssTokens || '');
      atomicWriteText(path.join(dir, 'code', 'AppShell.tsx'), job.codeBundles.reactTailwind || '');
      if (job.codeBundles.reactNative) {
        atomicWriteText(path.join(dir, 'code', 'MobileAppShell.tsx'), job.codeBundles.reactNative);
      }
    }
    atomicWriteText(this.jobJsonPath(job.id), JSON.stringify(job, null, 2));
    return job;
  }

  listJobs() {
    if (!fs.existsSync(this.jobsDir)) return [];
    const entries = fs.readdirSync(this.jobsDir, { withFileTypes: true });
    const jobs = [];
    for (const e of entries) {
      if (!e.isDirectory() || !SAFE_ID_RE.test(e.name)) continue;
      const p = path.join(this.jobsDir, e.name, 'job.json');
      if (!fs.existsSync(p)) continue;
      try {
        jobs.push(JSON.parse(fs.readFileSync(p, 'utf8')));
      } catch {}
    }
    return jobs.sort((a, b) => String(b.updatedAt || b.createdAt).localeCompare(String(a.updatedAt || a.createdAt)));
  }

  createDesignJob(options = {}) {
    const id = `ui_${Date.now().toString(36)}_${crypto.randomBytes(3).toString('hex')}`;
    const result = runDesignPipeline({
      ...options,
      variantSeed: options.variantSeed || id
    });
    const job = {
      id,
      ...result,
      variants: [
        {
          version: 1,
          directionId: result.directionId,
          directionName: result.direction.name,
          overallScore: result.audit.overallScore,
          verdict: result.audit.verdict,
          createdAt: result.createdAt
        }
      ]
    };
    return this.writeJobArtifacts(job);
  }

  regenerateVariant(jobId, overrides = {}) {
    const prev = this.readJob(jobId);
    const seed = overrides.variantSeed || `${jobId}-${(prev.variants?.length || 1) + 1}-${Date.now()}`;
    const next = runDesignPipeline({
      brief: overrides.brief || prev.brief,
      appName: overrides.appName || prev.appName,
      projectPath: overrides.projectPath !== undefined ? overrides.projectPath : prev.projectScan?.projectPath,
      platforms: overrides.platforms || prev.platforms,
      directionId: overrides.directionId || null,
      variantSeed: seed,
      customScreens: overrides.customScreens || null,
      customMetrics: overrides.customMetrics || null,
      customRecords: overrides.customRecords || null,
      researchInsights: overrides.researchInsights || prev.researchInsights || null
    });

    const variants = [...(prev.variants || []), {
      version: (prev.variants?.length || 0) + 1,
      directionId: next.directionId,
      directionName: next.direction.name,
      overallScore: next.audit.overallScore,
      verdict: next.audit.verdict,
      createdAt: next.updatedAt
    }];

    const updated = {
      id: prev.id,
      createdAt: prev.createdAt,
      ...next,
      variants
    };
    return this.writeJobArtifacts(updated);
  }

  readPrototypeHtml(jobId) {
    const p = path.join(this.jobDir(jobId), 'prototype.html');
    if (fs.existsSync(p)) return fs.readFileSync(p, 'utf8');
    return this.readJob(jobId).interactiveHtml || '';
  }

  exportToProject(jobId, targetDir = null) {
    const job = this.readJob(jobId);
    const dest = path.resolve(targetDir || job.projectScan?.projectPath || '');
    if (!dest || !fs.existsSync(dest)) {
      throw new Error('Provide a valid existing targetDir to export DESIGN.md and tokens.');
    }
    const designDir = path.join(dest, '.ui-craft');
    atomicWriteText(path.join(dest, 'DESIGN.md'), job.designMd);
    atomicWriteText(path.join(designDir, 'prototype.html'), job.interactiveHtml);
    atomicWriteText(path.join(designDir, 'tokens.css'), job.codeBundles.cssTokens);
    return {
      exportedTo: dest,
      files: [
        path.join(dest, 'DESIGN.md'),
        path.join(designDir, 'prototype.html'),
        path.join(designDir, 'tokens.css')
      ]
    };
  }
}

module.exports = {
  defaultStudioHome,
  DesignStore
};
