#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const {
  DESIGN_DIRECTIONS,
  PLATFORM_GUIDELINES,
  GITHUB_ECOSYSTEM_REFERENCES,
  ANTI_SLOP_BAN_LIST
} = require('../lib/design-library.cjs');
const { DESIGN_CREW } = require('../lib/orchestrator.cjs');
const { scanProjectCodebase } = require('../lib/project-scanner.cjs');
const { listDesignCatalog, researchDesignEcosystem } = require('../lib/craft-research.cjs');
const { auditAntiSlop } = require('../lib/anti-slop-auditor.cjs');
const { DesignStore, defaultStudioHome } = require('../lib/store.cjs');
const { createDesignWebServer } = require('../lib/studio-web.cjs');

const store = new DesignStore(defaultStudioHome());
let webInstance = null;
let webInfo = null;

const DIRECTION_ENUM = DESIGN_DIRECTIONS.map((d) => d.id);

const TOOLS = [
  {
    name: 'design_list_crew',
    description: 'List the 6 UI/UX specialists, aesthetic directions, Mobile/Desktop guidelines, and integrated GitHub ecosystem patterns.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false }
  },
  {
    name: 'design_inspect_project',
    description: 'ALWAYS study the user codebase first: inspect stack, frameworks, UI kits, CSS tokens, existing DESIGN.md, routes, and components.',
    inputSchema: {
      type: 'object',
      required: ['projectPath'],
      properties: {
        projectPath: { type: 'string', description: 'Absolute path to target application repository.' }
      },
      additionalProperties: false
    }
  },
  {
    name: 'design_research_patterns',
    description: 'Research UI/UX patterns, anti-slop techniques, and open-source GitHub skills/design-systems (live GitHub + Wikipedia + curated catalog with 24h cache).',
    inputSchema: {
      type: 'object',
      required: ['query'],
      properties: {
        query: { type: 'string', description: 'Search query (e.g. "fintech dark dashboard", "mobile thumb navigation", "anti slop design system").' },
        category: { type: 'string', enum: ['all', 'directions', 'github', 'platforms', 'states'] },
        liveWeb: { type: 'boolean', description: 'Query live GitHub & Wikipedia APIs (default true).' },
        limit: { type: 'integer' }
      },
      additionalProperties: false
    }
  },
  {
    name: 'design_create_prototype',
    description: 'Study codebase (if projectPath provided), generate DESIGN.md, build an interactive multi-screen & multi-state Mobile+Desktop HTML prototype + framework code, and run Anti-AI-Slop audit.',
    inputSchema: {
      type: 'object',
      required: ['brief'],
      properties: {
        brief: { type: 'string', description: 'App/product goal, audience, and core workflows.' },
        appName: { type: 'string' },
        projectPath: { type: 'string', description: 'Optional local repo path to scan before designing.' },
        platforms: { type: 'array', items: { type: 'string', enum: ['mobile', 'desktop'] } },
        directionId: { type: 'string', enum: DIRECTION_ENUM },
        researchQuery: { type: 'string', description: 'Optional UI/UX research query run before compiling.' },
        customScreens: { type: 'array', items: { type: 'object' }, description: 'Optional bespoke screen specs ({id, title, purpose, primaryAction}).' },
        customMetrics: { type: 'array', items: { type: 'object' } },
        customRecords: { type: 'array', items: { type: 'object' } }
      },
      additionalProperties: false
    }
  },
  {
    name: 'design_regenerate_variant',
    description: 'Generate a fresh, non-repetitive aesthetic/layout variant for an existing design job or inject custom screens.',
    inputSchema: {
      type: 'object',
      required: ['jobId'],
      properties: {
        jobId: { type: 'string' },
        directionId: { type: 'string', enum: DIRECTION_ENUM },
        brief: { type: 'string' },
        platforms: { type: 'array', items: { type: 'string', enum: ['mobile', 'desktop'] } },
        customScreens: { type: 'array', items: { type: 'object' } },
        variantSeed: { type: 'string' }
      },
      additionalProperties: false
    }
  },
  {
    name: 'design_audit_anti_slop',
    description: 'Run deterministic Anti-AI-Slop & WCAG 2.1 contrast audit on a design jobId or raw HTML/CSS/DESIGN.md payload.',
    inputSchema: {
      type: 'object',
      properties: {
        jobId: { type: 'string' },
        codeOrHtml: { type: 'string' },
        designMd: { type: 'string' },
        palette: { type: 'object' },
        typography: { type: 'object' }
      },
      additionalProperties: false
    }
  },
  {
    name: 'design_export_to_project',
    description: 'Write generated DESIGN.md, interactive prototype.html, and tokens.css into a target repository.',
    inputSchema: {
      type: 'object',
      required: ['jobId'],
      properties: {
        jobId: { type: 'string' },
        targetDir: { type: 'string', description: 'Defaults to the scanned projectPath on the job.' }
      },
      additionalProperties: false
    }
  },
  {
    name: 'design_get_job',
    description: 'Retrieve full design job state, DESIGN.md, interactive HTML prototype, framework code bundles, and Anti-Slop audit.',
    inputSchema: {
      type: 'object',
      required: ['jobId'],
      properties: { jobId: { type: 'string' } },
      additionalProperties: false
    }
  },
  {
    name: 'design_list_jobs',
    description: 'List recent UI Craft Studio design jobs.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false }
  },
  {
    name: 'design_start_web',
    description: 'Start (or return URL of) the Local Multi-Viewport Design Workbench on 127.0.0.1.',
    inputSchema: {
      type: 'object',
      properties: { port: { type: 'integer', description: 'Port on 127.0.0.1 (default 4322).' } },
      additionalProperties: false
    }
  }
];

const RESOURCES = [
  { uri: 'design://catalog/directions', name: 'Aesthetic Directions', description: 'WCAG-verified anti-slop visual directions and typography pairings.', mimeType: 'application/json' },
  { uri: 'design://catalog/github', name: 'GitHub UI/UX Ecosystem', description: 'Curated open-source UI/UX skills and repos (impeccable, ui-ux-pro-max, stitch-skills, AntiSlopUI).', mimeType: 'application/json' },
  { uri: 'design://catalog/ban-list', name: 'AI Slop Ban List', description: 'Banned cliché gradients, fonts, copy phrases, and structural anti-patterns.', mimeType: 'application/json' },
  { uri: 'design://playbook', name: 'Anti-Slop Design Playbook', description: 'Mandatory codebase-first workflow, mobile HIG/M3, desktop density, and interactive state standards.', mimeType: 'text/markdown' }
];

const PROMPTS = [
  {
    name: 'study-and-design-app',
    description: 'Inspect an application repository first, research UI/UX patterns, and generate an interactive Mobile+Desktop prototype + DESIGN.md.',
    arguments: [
      { name: 'projectPath', description: 'Local path to repository', required: true },
      { name: 'brief', description: 'Feature or redesign goal', required: true }
    ]
  },
  {
    name: 'anti-slop-audit-repo',
    description: 'Run Anti-AI-Slop & WCAG contrast audit on an existing design or HTML/CSS output.',
    arguments: [
      { name: 'jobId', description: 'Design jobId to audit', required: true }
    ]
  }
];

function respond(id, result) {
  process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id, result }) + '\n');
}

function respondError(id, code, message) {
  process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id, error: { code, message } }) + '\n');
}

async function handleToolCall(name, args = {}) {
  switch (name) {
    case 'design_list_crew':
      return {
        crew: DESIGN_CREW,
        ...listDesignCatalog()
      };
    case 'design_inspect_project':
      return { projectScan: scanProjectCodebase(args.projectPath) };
    case 'design_research_patterns':
      return researchDesignEcosystem({
        query: args.query,
        category: args.category || 'all',
        liveWeb: args.liveWeb !== false,
        limit: args.limit || 6,
        studioHome: store.studioHome
      });
    case 'design_create_prototype': {
      const researchInsights = args.researchQuery
        ? await researchDesignEcosystem({ query: args.researchQuery, studioHome: store.studioHome })
        : null;
      const job = store.createDesignJob({
        brief: args.brief,
        appName: args.appName,
        projectPath: args.projectPath,
        platforms: args.platforms,
        directionId: args.directionId,
        customScreens: args.customScreens,
        customMetrics: args.customMetrics,
        customRecords: args.customRecords,
        researchInsights
      });
      return {
        jobId: job.id,
        appName: job.appName,
        directionId: job.directionId,
        platforms: job.platforms,
        audit: job.audit,
        crewBoard: job.crewBoard,
        projectScan: job.projectScan,
        designMd: job.designMd,
        artifactDir: store.jobDir(job.id),
        webUrl: webInfo?.url || null
      };
    }
    case 'design_regenerate_variant': {
      const job = store.regenerateVariant(args.jobId, {
        directionId: args.directionId,
        brief: args.brief,
        platforms: args.platforms,
        customScreens: args.customScreens,
        variantSeed: args.variantSeed
      });
      return { jobId: job.id, directionId: job.directionId, variants: job.variants, audit: job.audit, designMd: job.designMd };
    }
    case 'design_audit_anti_slop': {
      if (args.jobId) {
        const job = store.readJob(args.jobId);
        return { jobId: job.id, audit: job.audit };
      }
      return {
        audit: auditAntiSlop({
          palette: args.palette,
          typography: args.typography,
          codeOrHtml: args.codeOrHtml || '',
          designMd: args.designMd || ''
        })
      };
    }
    case 'design_export_to_project':
      return store.exportToProject(args.jobId, args.targetDir || null);
    case 'design_get_job':
      return { job: store.readJob(args.jobId), webUrl: webInfo?.url || null };
    case 'design_list_jobs':
      return {
        jobs: store.listJobs().map((j) => ({
          id: j.id,
          appName: j.appName,
          directionId: j.directionId,
          platforms: j.platforms,
          overallScore: j.audit?.overallScore,
          verdict: j.audit?.verdict,
          updatedAt: j.updatedAt
        })),
        webUrl: webInfo?.url || null
      };
    case 'design_start_web': {
      if (!webInstance) {
        webInstance = createDesignWebServer({ store, port: args.port || 4322 });
        webInfo = await webInstance.listen();
      }
      return { ok: true, ...webInfo };
    }
    default:
      throw Object.assign(new Error(`Unknown tool: ${name}`), { code: -32601 });
  }
}

async function handleMessage(msg) {
  if (!msg || typeof msg !== 'object') return;
  if (msg.method === 'initialize') {
    return respond(msg.id, {
      protocolVersion: '2024-11-05',
      serverInfo: { name: 'ui-craft-studio', version: require('../package.json').version },
      capabilities: { tools: {}, resources: {}, prompts: {} }
    });
  }
  if (msg.method === 'notifications/initialized') return;
  if (msg.method === 'tools/list') {
    return respond(msg.id, { tools: TOOLS });
  }
  if (msg.method === 'resources/list') {
    return respond(msg.id, { resources: RESOURCES });
  }
  if (msg.method === 'resources/read') {
    const uri = String(msg.params?.uri || '');
    if (uri === 'design://catalog/directions') {
      return respond(msg.id, { contents: [{ uri, mimeType: 'application/json', text: JSON.stringify(DESIGN_DIRECTIONS, null, 2) }] });
    }
    if (uri === 'design://catalog/github') {
      return respond(msg.id, { contents: [{ uri, mimeType: 'application/json', text: JSON.stringify(GITHUB_ECOSYSTEM_REFERENCES, null, 2) }] });
    }
    if (uri === 'design://catalog/ban-list') {
      return respond(msg.id, { contents: [{ uri, mimeType: 'application/json', text: JSON.stringify(ANTI_SLOP_BAN_LIST, null, 2) }] });
    }
    if (uri === 'design://playbook') {
      const p = path.resolve(__dirname, '..', 'skill', 'references', 'anti-slop-playbook.md');
      const text = fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
      return respond(msg.id, { contents: [{ uri, mimeType: 'text/markdown', text }] });
    }
    return respondError(msg.id, -32602, `Unknown resource URI: ${uri}`);
  }
  if (msg.method === 'prompts/list') {
    return respond(msg.id, { prompts: PROMPTS });
  }
  if (msg.method === 'prompts/get') {
    const pName = String(msg.params?.name || '');
    const pArgs = msg.params?.arguments || {};
    const def = PROMPTS.find((p) => p.name === pName);
    if (!def) return respondError(msg.id, -32602, `Unknown prompt: ${pName}`);
    const text = pName === 'study-and-design-app'
      ? `First call design_inspect_project on "${pArgs.projectPath || '.'}", then call design_research_patterns for "${pArgs.brief || 'modern app UI'}", then call design_create_prototype with projectPath and brief.`
      : `Call design_audit_anti_slop with jobId="${pArgs.jobId || '<id>'}" and resolve any high/medium findings.`;
    return respond(msg.id, {
      description: def.description,
      messages: [{ role: 'user', content: { type: 'text', text } }]
    });
  }
  if (msg.method === 'tools/call') {
    const { name, arguments: args = {} } = msg.params || {};
    try {
      const payload = await handleToolCall(name, args);
      return respond(msg.id, { content: [{ type: 'text', text: JSON.stringify(payload, null, 2) }] });
    } catch (err) {
      if (err.code === -32601) return respondError(msg.id, -32601, err.message);
      return respond(msg.id, { isError: true, content: [{ type: 'text', text: err.message }] });
    }
  }
  if (msg.id !== undefined) {
    respondError(msg.id, -32601, `Method not found: ${msg.method}`);
  }
}

if (require.main === module) {
  let buffer = Buffer.alloc(0);
  const processLine = (line) => {
    const trimmed = line.trim();
    if (!trimmed || /^content-length:/i.test(trimmed)) return;
    try {
      const msg = JSON.parse(trimmed);
      handleMessage(msg).catch((err) => {
        if (msg && msg.id !== undefined) respondError(msg.id, -32603, err.message);
      });
    } catch {}
  };

  process.stdin.on('data', (chunk) => {
    buffer = Buffer.concat([buffer, chunk]);
    while (buffer.length > 0) {
      const headerMatch = buffer.toString('utf8', 0, Math.min(buffer.length, 256)).match(/^Content-Length:\s*(\d+)\r?\n\r?\n/i);
      if (headerMatch) {
        const headerBytes = Buffer.byteLength(headerMatch[0], 'utf8');
        const bodyLen = Number(headerMatch[1]);
        if (buffer.length < headerBytes + bodyLen) break;
        const body = buffer.slice(headerBytes, headerBytes + bodyLen).toString('utf8');
        buffer = buffer.slice(headerBytes + bodyLen);
        processLine(body);
        continue;
      }
      const nlIdx = buffer.indexOf(0x0a);
      if (nlIdx === -1) break;
      const line = buffer.slice(0, nlIdx).toString('utf8');
      buffer = buffer.slice(nlIdx + 1);
      processLine(line);
    }
  });
}

module.exports = { TOOLS, RESOURCES, PROMPTS, handleMessage, handleToolCall };
