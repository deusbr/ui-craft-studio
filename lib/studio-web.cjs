'use strict';

const http = require('node:http');
const { DESIGN_DIRECTIONS, GITHUB_ECOSYSTEM_REFERENCES, PLATFORM_GUIDELINES } = require('./design-library.cjs');
const { DESIGN_CREW } = require('./orchestrator.cjs');
const { scanProjectCodebase } = require('./project-scanner.cjs');
const { listDesignCatalog, researchDesignEcosystem } = require('./craft-research.cjs');
const { auditAntiSlop } = require('./anti-slop-auditor.cjs');

const MAX_BODY_BYTES = 8 * 1024 * 1024;

function escapeHtml(text) {
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function sendJson(res, status, data) {
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store'
  });
  res.end(JSON.stringify(data));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;
    req.on('data', (chunk) => {
      total += chunk.length;
      if (total > MAX_BODY_BYTES) {
        reject(new Error('Request body exceeds limit (8 MB).'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      try {
        resolve(raw.trim() ? JSON.parse(raw) : {});
      } catch {
        reject(new Error('Invalid JSON request body.'));
      }
    });
    req.on('error', reject);
  });
}

function renderWorkbenchHtml() {
  const dirOptions = DESIGN_DIRECTIONS
    .map((d) => `<option value="${escapeHtml(d.id)}">${escapeHtml(d.name)}</option>`)
    .join('');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>UI Craft Studio — Anti-Slop App Design Workbench (Mobile &amp; Desktop)</title>
<style>
  :root {
    --bg: #0c0e12; --panel: #141820; --panel-2: #1c222d; --border: #2a3342;
    --text: #f2f4f8; --muted: #9aa5b8; --accent: #e59a38; --accent-text: #140e04; --ok: #2fb380; --warn: #e35d5b;
  }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: "Plus Jakarta Sans", system-ui, sans-serif; background: var(--bg); color: var(--text); }
  header { padding: 12px 20px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; background: #10131a; gap: 12px; flex-wrap: wrap; }
  header h1 { margin: 0; font-size: 16px; letter-spacing: 0.3px; display: flex; align-items: center; gap: 8px; }
  .layout { display: grid; grid-template-columns: 330px 1fr; min-height: calc(100vh - 52px); }
  @media (max-width: 960px) { .layout { grid-template-columns: 1fr; } }
  aside { border-right: 1px solid var(--border); padding: 14px; background: var(--panel); display: flex; flex-direction: column; gap: 12px; }
  main { padding: 18px; display: flex; flex-direction: column; gap: 14px; overflow-y: auto; }
  .card { background: var(--panel); border: 1px solid var(--border); border-radius: 10px; padding: 14px; }
  .card h2, .card h3 { margin: 0 0 10px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.7px; color: var(--muted); }
  label { display: block; font-size: 12px; color: var(--muted); margin-bottom: 4px; }
  input, select, textarea { width: 100%; background: var(--panel-2); color: var(--text); border: 1px solid var(--border); border-radius: 6px; padding: 8px; font-size: 13px; margin-bottom: 10px; }
  button { background: var(--accent); color: var(--accent-text); border: none; border-radius: 6px; padding: 8px 12px; font-weight: 700; font-size: 12px; cursor: pointer; }
  button.secondary { background: var(--panel-2); color: var(--text); border: 1px solid var(--border); font-weight: 600; }
  button.active-tab { background: var(--accent); color: var(--accent-text); }
  .row { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 99px; font-size: 11px; background: var(--panel-2); border: 1px solid var(--border); color: var(--text); }
  .badge.ok { border-color: var(--ok); color: var(--ok); }
  .badge.warn { border-color: var(--warn); color: var(--warn); }
  .job-item { padding: 10px; border: 1px solid var(--border); border-radius: 8px; margin-bottom: 8px; cursor: pointer; background: var(--panel-2); }
  .job-item.active { border-color: var(--accent); }
  .preview-split { display: grid; grid-template-columns: 390px 1fr; gap: 14px; align-items: start; }
  @media (max-width: 1240px) { .preview-split { grid-template-columns: 1fr; } }
  .device-frame { border: 1px solid var(--border); border-radius: 14px; overflow: hidden; background: #000; }
  .device-bar { background: #181c24; padding: 6px 12px; font-size: 11px; color: var(--muted); display: flex; justify-content: space-between; border-bottom: 1px solid var(--border); }
  iframe { width: 100%; border: 0; background: #fff; display: block; }
  pre { white-space: pre-wrap; word-break: break-word; background: #0a0c10; padding: 12px; border-radius: 8px; border: 1px solid var(--border); font-size: 12px; max-height: 280px; overflow-y: auto; margin: 8px 0 0; }
  .crew-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 10px; }
  .crew-card { background: var(--panel-2); border: 1px solid var(--border); border-radius: 8px; padding: 10px; font-size: 12px; }
</style>
</head>
<body>
<header>
  <h1>UI CRAFT STUDIO <span class="badge">v1.0 · Anti-Slop Mobile &amp; Desktop MCP</span></h1>
  <span id="statusText" style="font-size:12px;color:var(--muted);">Ready</span>
</header>
<div class="layout">
  <aside>
    <div class="card">
      <h3>New App Design</h3>
      <label>Product / App Brief</label>
      <textarea id="briefInput" rows="3" placeholder="e.g. Personal treasury & invoice workspace for freelancers across iOS and Desktop..."></textarea>
      <label>Local Project Folder (Optional — Scans Stack &amp; Tokens First)</label>
      <input id="projectPathInput" type="text" placeholder="C:\\path\\to\\your\\app (optional)" />
      <label>Target Platforms</label>
      <select id="platformSelect">
        <option value="both">Mobile + Desktop / PC (Adaptive)</option>
        <option value="mobile">Mobile First (iOS HIG + Material 3)</option>
        <option value="desktop">Desktop / PC Workspace</option>
      </select>
      <label>Aesthetic Direction</label>
      <select id="directionSelect"><option value="">Auto-Match Domain (Unique Seed)</option>${dirOptions}</select>
      <button id="createBtn" type="button" style="width:100%;">Study &amp; Generate Interactive Prototype</button>
    </div>
    <div class="card" style="flex:1;overflow-y:auto;">
      <h3>Design Projects</h3>
      <div id="jobsList">No designs yet.</div>
    </div>
  </aside>
  <main id="mainStage">
    <div class="card">
      <h2>Anti-AI-Slop UI/UX Studio</h2>
      <p style="color:var(--muted);font-size:13px;">Studies your existing codebase first, researches GitHub skills &amp; UI patterns, compiles <code>DESIGN.md</code>, builds a live clickable multi-screen &amp; multi-state prototype (<code>populated / loading / empty / error</code>), and audits WCAG AA contrast deterministically.</p>
    </div>
  </main>
</div>
<script>
const state = { jobs: [], activeId: null, viewport: 'split', artifactTab: 'designMd' };

async function api(url, opts) {
  const res = await fetch(url, opts);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}
function esc(s) { return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

async function refresh() {
  const data = await api('/api/jobs');
  state.jobs = data.jobs || [];
  if (!state.activeId && state.jobs.length) state.activeId = state.jobs[0].id;
  renderSidebar();
  renderMain();
}

function renderSidebar() {
  const el = document.getElementById('jobsList');
  if (!state.jobs.length) { el.innerHTML = '<div style="font-size:12px;color:var(--muted);">No designs yet.</div>'; return; }
  el.innerHTML = state.jobs.map((j) =>
    '<div class="job-item ' + (j.id === state.activeId ? 'active' : '') + '" data-id="' + esc(j.id) + '">' +
      '<div style="font-weight:700;font-size:13px;">' + esc(j.appName) + '</div>' +
      '<div class="row" style="margin-top:6px;">' +
        '<span class="badge">' + esc(j.directionId) + '</span>' +
        '<span class="badge ' + (j.audit?.verdict === 'pass' ? 'ok' : 'warn') + '">' + esc(j.audit?.overallScore) + '/10</span>' +
      '</div>' +
    '</div>'
  ).join('');
  el.querySelectorAll('.job-item').forEach((n) => n.addEventListener('click', () => { state.activeId = n.dataset.id; renderSidebar(); renderMain(); }));
}

function renderMain() {
  const main = document.getElementById('mainStage');
  const job = state.jobs.find((j) => j.id === state.activeId);
  if (!job) return;
  const protoUrl = '/api/jobs/' + encodeURIComponent(job.id) + '/prototype';

  const previewHtml = state.viewport === 'mobile'
    ? '<div class="device-frame" style="max-width:390px;"><div class="device-bar"><span>Mobile 390x844 (Interactive)</span><span>Touch + Safe Areas</span></div><iframe src="' + protoUrl + '" style="height:700px;"></iframe></div>'
    : state.viewport === 'desktop'
      ? '<div class="device-frame"><div class="device-bar"><span>Desktop / PC (Interactive)</span><span>Sidebar + Ctrl+K</span></div><iframe src="' + protoUrl + '" style="height:660px;"></iframe></div>'
      : '<div class="preview-split">' +
          '<div class="device-frame"><div class="device-bar"><span>Mobile 390px</span><span>Thumb-Zone</span></div><iframe src="' + protoUrl + '" style="height:640px;"></iframe></div>' +
          '<div class="device-frame"><div class="device-bar"><span>Desktop / PC</span><span>Workspace</span></div><iframe src="' + protoUrl + '" style="height:640px;"></iframe></div>' +
        '</div>';

  const artifactText = state.artifactTab === 'css'
    ? (job.codeBundles?.cssTokens || '')
    : state.artifactTab === 'react'
      ? (job.codeBundles?.reactTailwind || '')
      : state.artifactTab === 'rn'
        ? (job.codeBundles?.reactNative || 'Mobile platform not selected.')
        : (job.designMd || '');

  const auditFindings = (job.audit?.findings || []).map((f) => '<li><strong>' + esc(f.code) + ':</strong> ' + esc(f.message) + '</li>').join('');

  main.innerHTML =
    '<div class="card">' +
      '<div class="row" style="justify-content:space-between;">' +
        '<div><strong style="font-size:16px;">' + esc(job.appName) + '</strong> · <span class="badge">' + esc(job.direction?.name) + '</span> <span class="badge ' + (job.audit?.verdict === 'pass' ? 'ok' : 'warn') + '">Anti-Slop ' + esc(job.audit?.overallScore) + '/10 (' + esc(job.audit?.verdict) + ')</span></div>' +
        '<div class="row">' +
          '<button type="button" class="' + (state.viewport === 'split' ? 'active-tab' : 'secondary') + '" data-vp="split">Split Mobile+PC</button>' +
          '<button type="button" class="' + (state.viewport === 'mobile' ? 'active-tab' : 'secondary') + '" data-vp="mobile">Mobile 390px</button>' +
          '<button type="button" class="' + (state.viewport === 'desktop' ? 'active-tab' : 'secondary') + '" data-vp="desktop">Desktop / PC</button>' +
          '<button type="button" id="variantBtn">Generate Unique Variant</button>' +
        '</div>' +
      '</div>' +
      (auditFindings ? '<ul style="margin:8px 0 0;color:var(--warn);font-size:12px;">' + auditFindings + '</ul>' : '') +
    '</div>' +
    previewHtml +
    '<div class="card">' +
      '<div class="row" style="justify-content:space-between;">' +
        '<div class="row">' +
          '<button type="button" class="' + (state.artifactTab === 'designMd' ? 'active-tab' : 'secondary') + '" data-atab="designMd">DESIGN.md</button>' +
          '<button type="button" class="' + (state.artifactTab === 'css' ? 'active-tab' : 'secondary') + '" data-atab="css">CSS Tokens</button>' +
          '<button type="button" class="' + (state.artifactTab === 'react' ? 'active-tab' : 'secondary') + '" data-atab="react">React + Tailwind</button>' +
          '<button type="button" class="' + (state.artifactTab === 'rn' ? 'active-tab' : 'secondary') + '" data-atab="rn">React Native</button>' +
        '</div>' +
        '<button type="button" class="secondary" id="copyArtifactBtn">Copy Artifact</button>' +
      '</div>' +
      '<pre id="artifactPre">' + esc(artifactText) + '</pre>' +
    '</div>' +
    '<div class="card"><h2>6-Specialist Design Crew Log</h2><div class="crew-grid">' +
      (job.crewBoard || []).map((c) => '<div class="crew-card"><strong>' + c.step + '. ' + esc(c.handle) + '</strong><div style="color:var(--muted);margin-top:4px;">' + esc(c.summary) + '</div></div>').join('') +
    '</div></div>';

  main.querySelectorAll('[data-vp]').forEach((b) => b.addEventListener('click', () => { state.viewport = b.dataset.vp; renderMain(); }));
  main.querySelectorAll('[data-atab]').forEach((b) => b.addEventListener('click', () => { state.artifactTab = b.dataset.atab; renderMain(); }));
  document.getElementById('copyArtifactBtn').addEventListener('click', () => {
    navigator.clipboard?.writeText(document.getElementById('artifactPre').textContent);
  });
  document.getElementById('variantBtn').addEventListener('click', async () => {
    const res = await api('/api/jobs/' + encodeURIComponent(job.id) + '/variant', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({}) });
    state.activeId = res.job.id;
    await refresh();
  });
}

document.getElementById('createBtn').addEventListener('click', async () => {
  const brief = document.getElementById('briefInput').value.trim();
  if (!brief) return alert('Enter a product/app brief.');
  const platVal = document.getElementById('platformSelect').value;
  const platforms = platVal === 'both' ? ['mobile', 'desktop'] : [platVal];
  const res = await api('/api/jobs', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      brief,
      projectPath: document.getElementById('projectPathInput').value.trim() || undefined,
      platforms,
      directionId: document.getElementById('directionSelect').value || undefined
    })
  });
  state.activeId = res.job.id;
  await refresh();
});
refresh().catch((e) => { document.getElementById('statusText').textContent = e.message; });
</script>
</body>
</html>`;
}

function createDesignWebServer({ store, port = 4322 } = {}) {
  const server = http.createServer(async (req, res) => {
    const parsedUrl = new URL(req.url || '/', 'http://127.0.0.1');
    const pathname = parsedUrl.pathname;

    try {
      if (req.method === 'GET' && pathname === '/') {
        res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
        res.end(renderWorkbenchHtml());
        return;
      }

      if (req.method === 'GET' && pathname === '/api/health') {
        sendJson(res, 200, { ok: true, studioHome: store.studioHome, jobCount: store.listJobs().length });
        return;
      }

      if (req.method === 'GET' && pathname === '/api/catalog') {
        sendJson(res, 200, {
          crew: DESIGN_CREW,
          platforms: PLATFORM_GUIDELINES,
          githubEcosystem: GITHUB_ECOSYSTEM_REFERENCES,
          ...listDesignCatalog()
        });
        return;
      }

      if (req.method === 'POST' && pathname === '/api/research') {
        const body = await readJsonBody(req);
        const result = await researchDesignEcosystem({
          query: body.query,
          category: body.category || 'all',
          liveWeb: body.liveWeb !== false,
          studioHome: store.studioHome
        });
        sendJson(res, 200, result);
        return;
      }

      if (req.method === 'POST' && pathname === '/api/inspect') {
        const body = await readJsonBody(req);
        sendJson(res, 200, { projectScan: scanProjectCodebase(body.projectPath) });
        return;
      }

      if (req.method === 'POST' && pathname === '/api/audit') {
        const body = await readJsonBody(req);
        sendJson(res, 200, { audit: auditAntiSlop(body) });
        return;
      }

      if (req.method === 'GET' && pathname === '/api/jobs') {
        sendJson(res, 200, { jobs: store.listJobs() });
        return;
      }

      if (req.method === 'POST' && pathname === '/api/jobs') {
        const body = await readJsonBody(req);
        const job = store.createDesignJob(body);
        sendJson(res, 201, { job });
        return;
      }

      const jobMatch = pathname.match(/^\/api\/jobs\/([A-Za-z0-9_-]{4,64})(?:\/(.*))?$/);
      if (jobMatch) {
        const jobId = jobMatch[1];
        const sub = jobMatch[2] || '';
        if (req.method === 'GET' && !sub) {
          sendJson(res, 200, { job: store.readJob(jobId) });
          return;
        }
        if (req.method === 'GET' && sub === 'prototype') {
          res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' });
          res.end(store.readPrototypeHtml(jobId));
          return;
        }
        if (req.method === 'POST' && sub === 'variant') {
          const body = await readJsonBody(req);
          const job = store.regenerateVariant(jobId, body);
          sendJson(res, 200, { job });
          return;
        }
      }

      sendJson(res, 404, { error: 'Not found' });
    } catch (err) {
      const status = /not found/i.test(err.message) ? 404 : /invalid|provide|exceeds/i.test(err.message) ? 400 : 500;
      sendJson(res, status, { error: err.message });
    }
  });

  return {
    server,
    listen: () =>
      new Promise((resolve, reject) => {
        server.once('error', reject);
        server.listen(port, '127.0.0.1', () => {
          const addr = server.address();
          resolve({ port: addr.port, url: `http://127.0.0.1:${addr.port}` });
        });
      }),
    close: () => new Promise((resolve) => server.close(resolve))
  };
}

module.exports = {
  createDesignWebServer
};
