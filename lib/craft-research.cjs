'use strict';

const fs = require('node:fs');
const path = require('node:path');
const {
  DESIGN_DIRECTIONS,
  PLATFORM_GUIDELINES,
  GITHUB_ECOSYSTEM_REFERENCES,
  ANTI_SLOP_BAN_LIST
} = require('./design-library.cjs');

const COMMUNITY_CRAFT_PATTERNS = [
  {
    id: 'reddit-claudecode-design-md',
    source: 'Reddit r/ClaudeCode + Google Stitch',
    title: 'Anchor Every Project with DESIGN.md Before Generating UI',
    summary: 'Prevents session amnesia across Claude Code/Codex by binding named colors, hex codes, functional roles, font stacks, radii, and explicit anti-patterns.',
    tags: ['design-md', 'stitch', 'claude-code', 'tokens', 'anti-slop']
  },
  {
    id: 'impeccable-craft-floor',
    source: 'pbakaus/impeccable (YouTube / X)',
    title: 'Craft Floor & Theme Browser Surfaces',
    summary: 'Never use 3-card-with-icon SaaS clones or kicker labels everywhere; theme custom scrollbars, selection highlights, carets, and tabular numerals; enforce unified SVG stroke icons.',
    tags: ['impeccable', 'craft-floor', 'svg', 'accessibility', 'contrast']
  },
  {
    id: 'taste-skill-real-product-ui',
    source: 'Leonxlnx/taste-skill v2.5.1 (GitHub)',
    title: 'Show Real Subject UI & Multi-Viewport Chrome Verification',
    summary: 'Every screen shows the actual thing users operate (chat thread + tool execution, spatial office map, cashflow chart, artifact sandbox) instead of placeholder metrics, audited in headless Chrome at 1440px and 390px.',
    tags: ['taste-skill', 'spatial', 'chat-ai', 'mobile', 'desktop', 'verification']
  },
  {
    id: 'linear-raycast-manus-dna',
    source: 'Linear / Raycast / Manus / Arc / Perplexity Patterns',
    title: 'Hairline Containment, Warm/Obsidian Surface Ladders, & Split Artifact View',
    summary: 'Replace heavy blurred boxes with 1px hairline borders, stepped surface contrast, tactile Cmd+K command menus, collapsible rails, and Manus-style Computer/Artifact split inspection.',
    tags: ['linear', 'raycast', 'manus', 'agent-os', 'fintech', 'dark-mode']
  },
  {
    id: 'mobile-bottom-sheet-thumb-zone',
    source: 'Mobbin 2025/2026 & UI UX Pro Max',
    title: 'Thumb-Zone Bottom Navigation & Multi-Detent Action Sheets',
    summary: 'Mobile apps place primary navigation, chat composers, and quick approvals within natural lower-third thumb reach with >=44px tap targets and bottom sheets instead of tiny corner dialogs.',
    tags: ['mobile', 'ios', 'android', 'fintech', 'agent-os', 'bottom-sheet']
  }
];

function scoreTextMatch(haystack, terms) {
  const text = String(haystack || '').toLowerCase();
  let score = 0;
  for (const term of terms) {
    if (text.includes(term)) score += 2;
  }
  return score;
}

function searchDesignCatalog(query, options = {}) {
  const category = options.category || 'all';
  const terms = String(query || '')
    .toLowerCase()
    .split(/[^a-z0-9-]+/)
    .filter((w) => w.length >= 2);

  const results = [];

  if (category === 'all' || category === 'directions' || category === 'palettes') {
    for (const dir of DESIGN_DIRECTIONS) {
      const hay = `${dir.id} ${dir.name} ${dir.mode} ${dir.philosophy} ${dir.domains.join(' ')}`;
      const score = terms.length ? scoreTextMatch(hay, terms) : 1;
      if (score > 0) {
        results.push({ type: 'direction', score, id: dir.id, title: dir.name, data: dir });
      }
    }
  }

  if (category === 'all' || category === 'github' || category === 'skills') {
    for (const ref of GITHUB_ECOSYSTEM_REFERENCES) {
      const hay = `${ref.name} ${ref.repo} ${ref.category} ${ref.platforms.join(' ')} ${ref.strengths.join(' ')}`;
      const score = terms.length ? scoreTextMatch(hay, terms) : 1;
      if (score > 0) {
        results.push({ type: 'github_reference', score, id: ref.repo, title: ref.name, data: ref });
      }
    }
  }

  if (category === 'all' || category === 'community' || category === 'patterns') {
    for (const pat of COMMUNITY_CRAFT_PATTERNS) {
      const hay = `${pat.source} ${pat.title} ${pat.summary} ${pat.tags.join(' ')}`;
      const score = terms.length ? scoreTextMatch(hay, terms) : 1;
      if (score > 0) {
        results.push({ type: 'community_pattern', score, id: pat.id, title: pat.title, data: pat });
      }
    }
  }

  if (category === 'all' || category === 'platforms') {
    for (const key of Object.keys(PLATFORM_GUIDELINES)) {
      const plat = PLATFORM_GUIDELINES[key];
      const hay = `${plat.id} ${plat.label} ${plat.navigationPattern} ${plat.ergonomics.join(' ')}`;
      const score = terms.length ? scoreTextMatch(hay, terms) : 1;
      if (score > 0) {
        results.push({ type: 'platform', score, id: plat.id, title: plat.label, data: plat });
      }
    }
  }

  return results.sort((a, b) => b.score - a.score);
}

function listDesignCatalog() {
  return {
    directions: DESIGN_DIRECTIONS.map((d) => ({
      id: d.id,
      name: d.name,
      mode: d.mode,
      domains: d.domains,
      accent: d.palette.accent,
      fonts: `${d.typography.displayName} + ${d.typography.bodyName}`
    })),
    githubReferences: GITHUB_ECOSYSTEM_REFERENCES,
    communityPatterns: COMMUNITY_CRAFT_PATTERNS,
    antiSlopBanList: ANTI_SLOP_BAN_LIST
  };
}

function readCache(cacheFile) {
  try {
    if (!fs.existsSync(cacheFile)) return null;
    const raw = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
    if (!raw || !raw.savedAt) return null;
    const ageMs = Date.now() - Number(raw.savedAt);
    if (ageMs > 24 * 60 * 60 * 1000) return null;
    return raw.payload;
  } catch {
    return null;
  }
}

function writeCache(cacheFile, payload) {
  try {
    fs.mkdirSync(path.dirname(cacheFile), { recursive: true });
    fs.writeFileSync(cacheFile, JSON.stringify({ savedAt: Date.now(), payload }, null, 2));
  } catch {
    // Non-fatal cache write error
  }
}

async function researchDesignEcosystem({ query, studioHome, fetchImpl = globalThis.fetch, live = true } = {}) {
  const cleanQuery = String(query || 'ui ux design system').trim();
  const curated = searchDesignCatalog(cleanQuery, { category: 'all' }).slice(0, 10);
  const slug = cleanQuery.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 60) || 'default';
  const cacheFile = studioHome ? path.join(studioHome, 'research-cache', `${slug}.json`) : null;

  if (cacheFile) {
    const cached = readCache(cacheFile);
    if (cached) {
      return {
        ...cached,
        source: 'curated+web-cache',
        cached: true
      };
    }
  }

  let githubRepos = [];
  let webNotes = [];
  let usedLive = false;

  if (live && typeof fetchImpl === 'function') {
    try {
      const ghUrl = `https://api.github.com/search/repositories?q=${encodeURIComponent(cleanQuery + ' ui design system')}&sort=stars&order=desc&per_page=5`;
      const ghRes = await fetchImpl(ghUrl, {
        headers: { 'User-Agent': 'ui-craft-studio-mcp', Accept: 'application/vnd.github+json' }
      });
      if (ghRes && ghRes.ok) {
        const ghJson = await ghRes.json();
        githubRepos = (ghJson.items || []).slice(0, 5).map((r) => ({
          fullName: r.full_name,
          description: r.description || '',
          stars: r.stargazers_count || 0,
          license: r.license ? r.license.spdx_id : 'Unknown',
          url: r.html_url
        }));
        usedLive = true;
      }
    } catch {
      // Offline / rate-limit fallback keeps curated catalog available
    }

    try {
      const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(cleanQuery + ' user interface design')}&format=json&srlimit=3`;
      const wikiRes = await fetchImpl(wikiUrl, { headers: { 'User-Agent': 'ui-craft-studio-mcp' } });
      if (wikiRes && wikiRes.ok) {
        const wikiJson = await wikiRes.json();
        const searchList = (wikiJson.query && wikiJson.query.search) || [];
        webNotes = searchList.map((s) => ({
          title: s.title,
          snippet: String(s.snippet || '').replace(/<[^>]+>/g, '')
        }));
        usedLive = true;
      }
    } catch {
      // Graceful fallback
    }
  }

  const payload = {
    query: cleanQuery,
    source: usedLive ? 'curated+live-web' : 'curated-only',
    cached: false,
    curatedHits: curated,
    communityPatterns: COMMUNITY_CRAFT_PATTERNS,
    githubRepos,
    webNotes,
    antiSlopBanList: ANTI_SLOP_BAN_LIST
  };

  if (cacheFile && usedLive) {
    writeCache(cacheFile, payload);
  }

  return payload;
}

async function fetchGitHubSkillReference({ repo, filePath, branch = 'main', fetchImpl = globalThis.fetch } = {}) {
  const cleanRepo = String(repo || 'pbakaus/impeccable').replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '');
  const refInfo = GITHUB_ECOSYSTEM_REFERENCES.find((r) => r.repo.toLowerCase() === cleanRepo.toLowerCase());
  const targetPath = filePath || (refInfo && refInfo.rawPaths && refInfo.rawPaths[0]) || 'README.md';
  const rawUrl = `https://raw.githubusercontent.com/${cleanRepo}/${branch}/${targetPath}`;

  if (typeof fetchImpl !== 'function') {
    return { ok: false, repo: cleanRepo, path: targetPath, error: 'fetch unavailable', fallbackStrengths: refInfo ? refInfo.strengths : [] };
  }

  try {
    const res = await fetchImpl(rawUrl, { headers: { 'User-Agent': 'ui-craft-studio-mcp' } });
    if (!res || !res.ok) {
      return {
        ok: false,
        repo: cleanRepo,
        path: targetPath,
        status: res ? res.status : 0,
        fallbackStrengths: refInfo ? refInfo.strengths : []
      };
    }
    const markdown = await res.text();
    return {
      ok: true,
      repo: cleanRepo,
      path: targetPath,
      url: rawUrl,
      bytes: markdown.length,
      excerpt: markdown.slice(0, 6000)
    };
  } catch (err) {
    return {
      ok: false,
      repo: cleanRepo,
      path: targetPath,
      error: err.message,
      fallbackStrengths: refInfo ? refInfo.strengths : []
    };
  }
}

module.exports = {
  COMMUNITY_CRAFT_PATTERNS,
  searchDesignCatalog,
  listDesignCatalog,
  researchDesignEcosystem,
  fetchGitHubSkillReference
};
