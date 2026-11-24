'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { spawn } = require('node:child_process');

const {
  DESIGN_DIRECTIONS,
  GITHUB_ECOSYSTEM_REFERENCES,
  scanProjectCodebase,
  searchDesignCatalog,
  researchDesignEcosystem,
  computeContrastRatio,
  auditPaletteContrast,
  auditAntiSlop,
  DesignStore,
  createDesignWebServer,
  getClientTargets,
  installStudioClients,
  checkStudioStatus
} = require('../index.cjs');

function makeTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'ui-craft-studio-test-'));
}

test('project-scanner studies repository stack, CSS tokens, routes, and existing DESIGN.md', () => {
  const dir = makeTempDir();
  try {
    fs.mkdirSync(path.join(dir, 'src', 'app', 'dashboard'), { recursive: true });
    fs.mkdirSync(path.join(dir, 'src', 'components', 'ui'), { recursive: true });
    fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({
      name: 'acme-treasury',
      description: 'Cashflow & treasury app for founders',
      dependencies: { next: '15.0.0', react: '19.0.0', tailwindcss: '4.0.0', 'lucide-react': '0.400.0' }
    }));
    fs.writeFileSync(path.join(dir, 'src', 'app', 'globals.css'), ':root { --brand-ink: #111827; font-family: "Space Grotesk", sans-serif; }');
    fs.writeFileSync(path.join(dir, 'src', 'app', 'dashboard', 'page.tsx'), 'export default function Page() { return null; }');
    fs.writeFileSync(path.join(dir, 'src', 'components', 'ui', 'Button.tsx'), 'export const Button = () => null;');
    fs.writeFileSync(path.join(dir, 'DESIGN.md'), '# Existing Design\n');

    const scan = scanProjectCodebase(dir);
    assert.equal(scan.detected, true);
    assert.equal(scan.projectName, 'acme-treasury');
    assert.ok(scan.frameworks.includes('Next.js'));
    assert.ok(scan.uiLibraries.includes('Tailwind CSS'));
    assert.ok(scan.uiLibraries.includes('shadcn/ui / Radix'));
    assert.equal(scan.hasDesignMd, true);
    assert.equal(scan.designTokens.variables['--brand-ink'], '#111827');
    assert.ok(scan.routesOrScreens.some((r) => r.includes('dashboard/page.tsx')));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('Anti-AI-Slop auditor verifies WCAG contrast math and catches purple slop, Inter default, and cliché copy', () => {
  assert.equal(computeContrastRatio('#FFFFFF', '#000000'), 21);

  for (const dir of DESIGN_DIRECTIONS) {
    const contrast = auditPaletteContrast(dir.palette);
    assert.equal(contrast.passed, true, `Direction ${dir.id} failed WCAG AA contrast: ${JSON.stringify(contrast.failures)}`);
  }

  const badAudit = auditAntiSlop({
    palette: { bg: '#ffffff', surface: '#ffffff', text: '#cccccc', muted: '#dddddd', accent: '#6366f1', accentText: '#ffffff' },
    typography: { display: 'Inter', body: 'Inter' },
    screens: [{ id: 'only-one' }],
    interactiveStates: ['populated'],
    codeOrHtml: '<div style="background: linear-gradient(#6366f1, #8b5cf6)">Unlock the power of our all-in-one solution</div>',
    designMd: ''
  });
  assert.equal(badAudit.verdict, 'revise');
  assert.ok(badAudit.findings.some((f) => f.code === 'SLOP_CLICHE_PALETTE'));
  assert.ok(badAudit.findings.some((f) => f.code === 'SLOP_GENERIC_TYPOGRAPHY'));
  assert.ok(badAudit.findings.some((f) => f.code === 'SLOP_CLICHE_COPY'));
  assert.ok(badAudit.findings.some((f) => f.code === 'WCAG_CONTRAST_FAILURE'));
  assert.ok(badAudit.findings.some((f) => f.code === 'INCOMPLETE_INTERACTIVE_STATES'));
  assert.ok(badAudit.findings.some((f) => f.code === 'SINGLE_STATIC_SCREEN'));
});

test('Hybrid research queries curated catalog, GitHub repos, Wikipedia, and caches results for 24h', async () => {
  const dir = makeTempDir();
  try {
    assert.ok(GITHUB_ECOSYSTEM_REFERENCES.some((r) => r.repo.includes('impeccable')));
    const hits = searchDesignCatalog('fintech dark mobile', { category: 'all' });
    assert.ok(hits.length >= 1);

    let fetchCount = 0;
    const mockFetch = async (url) => {
      fetchCount += 1;
      if (url.includes('api.github.com')) {
        return {
          ok: true,
          json: async () => ({
            items: [{ full_name: 'pbakaus/impeccable', description: 'Anti-AI-slop design skill', stargazers_count: 5000, license: { spdx_id: 'MIT' }, html_url: 'https://github.com/pbakaus/impeccable' }]
          })
        };
      }
      return {
        ok: true,
        json: async () => ({
          query: { search: [{ title: 'Design system', snippet: '<span>Tokens</span> and component guidelines.' }] }
        })
      };
    };

    const r1 = await researchDesignEcosystem({ query: 'anti slop design system', studioHome: dir, fetchImpl: mockFetch });
    assert.equal(r1.source, 'curated+live-web');
    assert.equal(r1.cached, false);
    assert.equal(r1.githubRepos[0].fullName, 'pbakaus/impeccable');
    assert.equal(fetchCount, 2);

    const r2 = await researchDesignEcosystem({ query: 'anti slop design system', studioHome: dir, fetchImpl: mockFetch });
    assert.equal(r2.source, 'curated+web-cache');
    assert.equal(r2.cached, true);
    assert.equal(fetchCount, 2);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('DesignStore studies codebase, creates interactive multi-state Mobile+Desktop prototype, regenerates variants, and exports to project', async () => {
  const dir = makeTempDir();
  try {
    const repoDir = path.join(dir, 'my-wallet');
    fs.mkdirSync(path.join(repoDir, 'src'), { recursive: true });
    fs.writeFileSync(path.join(repoDir, 'package.json'), JSON.stringify({
      name: 'nova-wallet',
      dependencies: { react: '19.0.0', expo: '52.0.0', tailwindcss: '4.0.0' }
    }));

    const store = new DesignStore(path.join(dir, 'studio-home'));
    const job = store.createDesignJob({
      brief: 'Personal fintech treasury & card control app for mobile and desktop',
      projectPath: repoDir,
      platforms: ['mobile', 'desktop']
    });

    assert.equal(job.appName, 'nova-wallet');
    assert.equal(job.domain, 'fintech');
    assert.equal(job.audit.verdict, 'pass');
    assert.ok(job.audit.overallScore >= 9);
    assert.match(job.designMd, /# DESIGN\.md — nova-wallet/);
    assert.match(job.interactiveHtml, /mobile-tabbar/);
    assert.match(job.interactiveHtml, /cmdModal/);
    assert.match(job.interactiveHtml, /'populated', 'loading', 'empty', 'error'/);
    assert.ok(job.codeBundles.reactNative);

    const variant = store.regenerateVariant(job.id, { directionId: 'swiss-editorial-warm' });
    assert.equal(variant.variants.length, 2);
    assert.equal(variant.directionId, 'swiss-editorial-warm');
    assert.equal(variant.audit.verdict, 'pass');

    const exported = store.exportToProject(job.id, repoDir);
    assert.ok(fs.existsSync(path.join(repoDir, 'DESIGN.md')));
    assert.ok(fs.existsSync(path.join(repoDir, '.ui-craft', 'prototype.html')));
    assert.equal(exported.files.length, 3);

    const web = createDesignWebServer({ store, port: 0 });
    const info = await web.listen();
    try {
      const uiHtml = await (await fetch(info.url)).text();
      assert.match(uiHtml, /UI CRAFT STUDIO/);
      const protoRes = await fetch(`${info.url}/api/jobs/${job.id}/prototype`);
      assert.equal(protoRes.status, 200);
      assert.match(await protoRes.text(), /Treasury Overview/);
    } finally {
      await web.close();
    }
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('installStudioClients and stdio MCP server (Content-Length + NDJSON, 10 tools, resources, prompts) work cleanly', async () => {
  const dir = makeTempDir();
  try {
    const home = path.join(dir, 'home');
    const appdata = path.join(dir, 'appdata');
    fs.mkdirSync(path.join(home, '.codex'), { recursive: true });
    fs.writeFileSync(path.join(home, '.codex', 'config.toml'), 'model = "gpt-5"\n');

    const targets = getClientTargets({ home, appdata, platform: 'win32' });
    const installed = installStudioClients({ targets });
    assert.equal(installed.length, 4);
    assert.ok(installed.every((r) => r.mcpInstalled));
    const status = checkStudioStatus(targets);
    assert.ok(status.every((s) => s.mcpConfigured));
    assert.equal(status.find((s) => s.id === 'codex').skillInstalled, true);

    const child = spawn(process.execPath, [path.resolve(__dirname, '../bin/mcp-server.cjs')], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, UI_CRAFT_STUDIO_HOME: path.join(dir, 'studio-home') }
    });

    const frame = (obj) => {
      const json = JSON.stringify(obj);
      return `Content-Length: ${Buffer.byteLength(json, 'utf8')}\r\n\r\n${json}`;
    };

    const responses = [];
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('MCP server test timeout')), 5000);
      let buf = '';
      child.stdout.on('data', (chunk) => {
        buf += chunk.toString('utf8');
        const lines = buf.split(/\r?\n/);
        buf = lines.pop() || '';
        for (const l of lines) {
          if (!l.trim()) continue;
          responses.push(JSON.parse(l));
          if (responses.length === 5) {
            clearTimeout(timer);
            resolve();
          }
        }
      });

      child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'initialize', params: {} }) + '\n');
      child.stdin.write(frame({ jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} }));
      child.stdin.write(frame({ jsonrpc: '2.0', id: 3, method: 'resources/list', params: {} }));
      child.stdin.write(frame({ jsonrpc: '2.0', id: 4, method: 'prompts/list', params: {} }));
      child.stdin.write(frame({
        jsonrpc: '2.0',
        id: 5,
        method: 'tools/call',
        params: {
          name: 'design_create_prototype',
          arguments: { brief: 'Clinic patient schedule for mobile and desktop', platforms: ['mobile', 'desktop'] }
        }
      }));
    });

    child.kill();
    const byId = (id) => responses.find((r) => r.id === id);
    assert.equal(byId(1).result.serverInfo.name, 'ui-craft-studio');
    assert.equal(byId(2).result.tools.length, 10);
    assert.equal(byId(3).result.resources.length, 4);
    assert.equal(byId(4).result.prompts.length, 2);
    const created = JSON.parse(byId(5).result.content[0].text);
    assert.equal(created.audit.verdict, 'pass');
    assert.match(created.designMd, /# DESIGN\.md/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
