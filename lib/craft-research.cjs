'use strict';

const fs = require('node:fs');
const path = require('node:path');
const {
  DESIGN_DIRECTIONS,
  PLATFORM_GUIDELINES,
  INTERACTIVE_STATES,
  GITHUB_ECOSYSTEM_REFERENCES,
  ANTI_SLOP_BAN_LIST
} = require('./design-library.cjs');

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

const PT_EN_UI_SYNONYMS = [
  ['mobile', 'celular', 'ios', 'android', 'app', 'thumb'],
  ['desktop', 'pc', 'web', 'dashboard', 'workspace', 'sidebar', 'tabela'],
  ['dark', 'escuro', 'noturno', 'obsidian', 'noir'],
  ['light', 'claro', 'editorial', 'swiss', 'nordic'],
  ['fintech', 'finance', 'banco', 'pagamento', 'wallet', 'carteira'],
  ['saude', 'health', 'clinica', 'medico', 'wellness'],
  ['ecommerce', 'commerce', 'loja', 'produto', 'checkout'],
  ['ai', 'ia', 'agent', 'copilot', 'chat', 'studio'],
  ['typography', 'tipografia', 'fonte', 'fontes', 'serif'],
  ['slop', 'antislop', 'contraste', 'wcag', 'acessibilidade']
];

function tokenize(query) {
  const norm = String(query || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  const primary = norm.split(/[^a-z0-9.+-]+/).filter((t) => t.length >= 2);
  const expanded = new Set();
  for (const tok of primary) {
    for (const grp of PT_EN_UI_SYNONYMS) {
      if (grp.includes(tok)) {
        for (const w of grp) {
          if (!primary.includes(w)) expanded.add(w);
        }
      }
    }
  }
  return { primary, expanded: Array.from(expanded) };
}

function searchDesignCatalog(query = '', { category = 'all', limit = 6 } = {}) {
  const { primary, expanded } = tokenize(query);
  const items = [];

  const pushItems = (cat, list, textFn) => {
    if (category !== 'all' && category !== cat) return;
    for (const it of list) {
      const hay = textFn(it).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      let score = primary.length ? 0 : 1;
      for (const tok of primary) {
        if (String(it.id || '').toLowerCase().includes(tok)) score += 6;
        else if (String(it.name || it.repo || '').toLowerCase().includes(tok)) score += 4;
        else if (hay.includes(tok)) score += 2;
      }
      for (const tok of expanded) {
        if (hay.includes(tok)) score += 1;
      }
      if (score > 0) items.push({ category: cat, score: Number(score.toFixed(2)), ...it });
    }
  };

  pushItems('directions', DESIGN_DIRECTIONS, (d) => `${d.id} ${d.name} ${d.categories.join(' ')} ${d.atmosphere} ${d.typography.display} ${d.typography.body}`);
  pushItems('github', GITHUB_ECOSYSTEM_REFERENCES, (g) => `${g.id} ${g.repo} ${g.role} ${(g.patternsAdopted || []).join(' ')}`);
  pushItems('platforms', Object.values(PLATFORM_GUIDELINES), (p) => `${p.id} ${p.name} ${p.rules.join(' ')}`);
  pushItems('states', INTERACTIVE_STATES, (s) => `${s.id} ${s.label} ${s.description}`);

  return items.sort((a, b) => b.score - a.score).slice(0, Math.max(1, Math.min(24, Number(limit) || 6)));
}

function listDesignCatalog({ category = 'all' } = {}) {
  const full = {
    directions: DESIGN_DIRECTIONS,
    platforms: Object.values(PLATFORM_GUIDELINES),
    states: INTERACTIVE_STATES,
    githubEcosystem: GITHUB_ECOSYSTEM_REFERENCES,
    antiSlopBanList: ANTI_SLOP_BAN_LIST
  };
  if (category && category !== 'all' && full[category]) {
    return { [category]: full[category] };
  }
  return full;
}

function readCache(cachePath) {
  try {
    if (!cachePath || !fs.existsSync(cachePath)) return {};
    return JSON.parse(fs.readFileSync(cachePath, 'utf8')) || {};
  } catch {
    return {};
  }
}

function writeCache(cachePath, data) {
  if (!cachePath) return;
  try {
    fs.mkdirSync(path.dirname(cachePath), { recursive: true });
    const trimmed = Object.fromEntries(Object.entries(data).slice(-50));
    const tmp = `${cachePath}.${process.pid}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(trimmed, null, 2), { mode: 0o600 });
    fs.renameSync(tmp, cachePath);
  } catch {}
}

async function fetchJsonSafe(url, fetchImpl, timeoutMs = 4500) {
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
  try {
    const res = await fetchImpl(url, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'user-agent': 'ui-craft-studio-mcp/1.0'
      },
      ...(controller ? { signal: controller.signal } : {})
    });
    if (!res || !res.ok) return null;
    return await res.json();
  } catch {
    return null;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

function stripHtml(text) {
  return String(text || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

async function researchDesignEcosystem({
  query,
  category = 'all',
  liveWeb = true,
  limit = 6,
  studioHome = null,
  fetchImpl = globalThis.fetch,
  timeoutMs = 4500
} = {}) {
  const cleanQuery = String(query || '').trim();
  if (!cleanQuery) throw new Error('Provide a non-empty UI/UX research query.');

  const curatedMatches = searchDesignCatalog(cleanQuery, { category, limit });
  const cachePath = studioHome ? path.join(studioHome, 'research-cache.json') : null;
  const cacheKey = `${category}::${cleanQuery.toLowerCase()}`;
  const cache = readCache(cachePath);

  if (!liveWeb) {
    return {
      query: cleanQuery,
      category,
      source: 'curated-offline',
      cached: false,
      curatedMatches,
      githubRepos: [],
      webReferences: []
    };
  }

  const cachedEntry = cache[cacheKey];
  if (cachedEntry && (Date.now() - Number(cachedEntry.cachedAt || 0)) < CACHE_TTL_MS) {
    return {
      query: cleanQuery,
      category,
      source: 'curated+web-cache',
      cached: true,
      curatedMatches,
      githubRepos: cachedEntry.githubRepos || [],
      webReferences: cachedEntry.webReferences || []
    };
  }

  if (typeof fetchImpl !== 'function') {
    return {
      query: cleanQuery,
      category,
      source: 'curated-fallback',
      cached: false,
      curatedMatches,
      githubRepos: [],
      webReferences: []
    };
  }

  const ghQuery = `${cleanQuery} ui ux design system skill mcp`;
  const ghUrl = `https://api.github.com/search/repositories?q=${encodeURIComponent(ghQuery)}&sort=stars&order=desc&per_page=5`;
  const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(`${cleanQuery} user interface design`)}&srlimit=3&format=json&utf8=1`;

  const [ghData, wikiData] = await Promise.all([
    fetchJsonSafe(ghUrl, fetchImpl, timeoutMs),
    fetchJsonSafe(wikiUrl, fetchImpl, timeoutMs)
  ]);

  const githubRepos = Array.isArray(ghData?.items)
    ? ghData.items.slice(0, 5).map((r) => ({
        fullName: r.full_name,
        description: r.description || '',
        stars: r.stargazers_count || 0,
        license: r.license?.spdx_id || null,
        url: r.html_url
      }))
    : [];

  const webReferences = Array.isArray(wikiData?.query?.search)
    ? wikiData.query.search.slice(0, 3).map((hit) => ({
        provider: 'wikipedia',
        title: hit.title,
        summary: stripHtml(hit.snippet),
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(String(hit.title || '').replace(/\s+/g, '_'))}`
      }))
    : [];

  if (cachePath && (githubRepos.length || webReferences.length)) {
    cache[cacheKey] = { cachedAt: Date.now(), githubRepos, webReferences };
    writeCache(cachePath, cache);
  }

  return {
    query: cleanQuery,
    category,
    source: (githubRepos.length || webReferences.length) ? 'curated+live-web' : 'curated-fallback',
    cached: false,
    curatedMatches,
    githubRepos,
    webReferences
  };
}

module.exports = {
  searchDesignCatalog,
  listDesignCatalog,
  researchDesignEcosystem
};
