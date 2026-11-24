#!/usr/bin/env node
'use strict';

const { scanProjectCodebase } = require('../lib/project-scanner.cjs');
const { listDesignCatalog, researchDesignEcosystem } = require('../lib/craft-research.cjs');
const { DesignStore, defaultStudioHome } = require('../lib/store.cjs');
const { createDesignWebServer } = require('../lib/studio-web.cjs');
const { installStudioClients, checkStudioStatus } = require('../lib/installers.cjs');

function parseArgs(argv) {
  const [cmd = 'help', ...rest] = argv;
  const opts = {
    cmd,
    positional: [],
    projectPath: null,
    appName: '',
    platforms: null,
    direction: null,
    research: null,
    targetDir: null,
    port: 4322,
    clients: null,
    offline: false,
    json: false
  };
  for (let i = 0; i < rest.length; i += 1) {
    const a = rest[i];
    if (a === '--project' && rest[i + 1]) opts.projectPath = rest[++i];
    else if (a === '--name' && rest[i + 1]) opts.appName = rest[++i];
    else if (a === '--platforms' && rest[i + 1]) opts.platforms = rest[++i].split(',').map((s) => s.trim()).filter(Boolean);
    else if (a === '--direction' && rest[i + 1]) opts.direction = rest[++i];
    else if (a === '--research' && rest[i + 1]) opts.research = rest[++i];
    else if (a === '--out' && rest[i + 1]) opts.targetDir = rest[++i];
    else if (a === '--port' && rest[i + 1]) opts.port = Number(rest[++i]) || 4322;
    else if (a === '--clients' && rest[i + 1]) opts.clients = rest[++i].split(',').map((s) => s.trim()).filter(Boolean);
    else if (a === '--offline') opts.offline = true;
    else if (a === '--json') opts.json = true;
    else if (!a.startsWith('-')) opts.positional.push(a);
  }
  return opts;
}

function printUsage() {
  console.log([
    'Usage: ui-craft-studio <command> [options]',
    '',
    'Commands:',
    '  analyze <projectDir>     Inspect codebase stack, tokens, DESIGN.md, routes, and components',
    '  research <query>         Research UI/UX patterns, anti-slop rules, and GitHub skills/repos',
    '  design "<brief>"         Study project (--project), compile DESIGN.md + interactive prototype + code',
    '  variant <jobId>          Generate a fresh aesthetic/layout variant for an existing job',
    '  audit <jobId>            Inspect Anti-AI-Slop & WCAG contrast scorecard for a job',
    '  export <jobId>           Write DESIGN.md, prototype.html, and tokens.css to --out or project dir',
    '  catalog [category]       Browse directions | platforms | states | githubEcosystem | antiSlopBanList',
    '  web                      Launch Local Multi-Viewport Interactive Workbench (port 4322)',
    '  mcp                      Start stdio MCP Server',
    '  install                  Install MCP + SKILL.md across Codex, Gemini CLI, Claude Code, Claude Desktop',
    '  status                   Check MCP + Skill installation status'
  ].join('\n'));
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.cmd === 'help' || opts.cmd === '--help' || opts.cmd === '-h') {
    printUsage();
    return;
  }
  if (opts.cmd === 'mcp') {
    require('./mcp-server.cjs');
    return;
  }
  if (opts.cmd === 'status') {
    console.log(JSON.stringify(checkStudioStatus(), null, 2));
    return;
  }
  if (opts.cmd === 'install') {
    console.log(JSON.stringify(installStudioClients({ clientIds: opts.clients }), null, 2));
    return;
  }
  if (opts.cmd === 'catalog') {
    const cat = opts.positional[0] || 'all';
    console.log(JSON.stringify(listDesignCatalog({ category: cat }), null, 2));
    return;
  }
  if (opts.cmd === 'analyze') {
    const target = opts.positional[0] || opts.projectPath || '.';
    console.log(JSON.stringify(scanProjectCodebase(target), null, 2));
    return;
  }
  if (opts.cmd === 'research') {
    const query = opts.positional.join(' ').trim() || opts.research;
    const store = new DesignStore(defaultStudioHome());
    const res = await researchDesignEcosystem({ query, liveWeb: !opts.offline, studioHome: store.studioHome });
    console.log(JSON.stringify(res, null, 2));
    return;
  }
  if (opts.cmd === 'design') {
    const brief = opts.positional.join(' ').trim();
    if (!brief) throw new Error('Missing "<brief>". Usage: ui-craft-studio design "<brief>" [--project <dir>]');
    const store = new DesignStore(defaultStudioHome());
    const researchInsights = opts.research
      ? await researchDesignEcosystem({ query: opts.research, liveWeb: !opts.offline, studioHome: store.studioHome })
      : null;
    const job = store.createDesignJob({
      brief,
      appName: opts.appName,
      projectPath: opts.projectPath,
      platforms: opts.platforms,
      directionId: opts.direction,
      researchInsights
    });
    if (opts.json) {
      console.log(JSON.stringify(job, null, 2));
      return;
    }
    console.log(`Design Job ${job.id} | App: ${job.appName} | Direction: ${job.direction.name}`);
    console.log(`Anti-Slop Audit: ${job.audit.overallScore}/10 (${job.audit.verdict})`);
    console.log(`Artifacts: ${store.jobDir(job.id)}`);
    return;
  }
  if (opts.cmd === 'variant') {
    const jobId = opts.positional[0];
    if (!jobId) throw new Error('Missing <jobId>.');
    const store = new DesignStore(defaultStudioHome());
    const job = store.regenerateVariant(jobId, { directionId: opts.direction, platforms: opts.platforms });
    console.log(JSON.stringify({ jobId: job.id, directionId: job.directionId, audit: job.audit }, null, 2));
    return;
  }
  if (opts.cmd === 'audit') {
    const jobId = opts.positional[0];
    if (!jobId) throw new Error('Missing <jobId>.');
    const store = new DesignStore(defaultStudioHome());
    console.log(JSON.stringify(store.readJob(jobId).audit, null, 2));
    return;
  }
  if (opts.cmd === 'export') {
    const jobId = opts.positional[0];
    if (!jobId) throw new Error('Missing <jobId>.');
    const store = new DesignStore(defaultStudioHome());
    console.log(JSON.stringify(store.exportToProject(jobId, opts.targetDir), null, 2));
    return;
  }
  if (opts.cmd === 'web') {
    const store = new DesignStore(defaultStudioHome());
    const web = createDesignWebServer({ store, port: opts.port });
    const info = await web.listen();
    console.log(`UI Craft Studio Workbench running at ${info.url} (home: ${store.studioHome})`);
    return;
  }
  throw new Error(`Unknown command: ${opts.cmd}`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
