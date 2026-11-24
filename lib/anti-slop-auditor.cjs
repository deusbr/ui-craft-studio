'use strict';

function parseHexRgb(hex) {
  if (typeof hex !== 'string') return null;
  const cleaned = hex.trim().replace(/^#/, '');
  if (/^[0-9a-fA-F]{3}$/.test(cleaned)) {
    return {
      r: parseInt(cleaned[0] + cleaned[0], 16),
      g: parseInt(cleaned[1] + cleaned[1], 16),
      b: parseInt(cleaned[2] + cleaned[2], 16)
    };
  }
  if (/^[0-9a-fA-F]{6}$/.test(cleaned)) {
    return {
      r: parseInt(cleaned.slice(0, 2), 16),
      g: parseInt(cleaned.slice(2, 4), 16),
      b: parseInt(cleaned.slice(4, 6), 16)
    };
  }
  return null;
}

function relativeLuminance(rgb) {
  const channel = (v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(rgb.r) + 0.7152 * channel(rgb.g) + 0.0722 * channel(rgb.b);
}

function computeContrastRatio(fgHex, bgHex) {
  const fg = parseHexRgb(fgHex);
  const bg = parseHexRgb(bgHex);
  if (!fg || !bg) return null;
  const l1 = relativeLuminance(fg);
  const l2 = relativeLuminance(bg);
  const bright = Math.max(l1, l2);
  const dark = Math.min(l1, l2);
  return Number(((bright + 0.05) / (dark + 0.05)).toFixed(2));
}

function auditPaletteContrast(palette) {
  if (!palette) {
    return { passed: false, checks: [], failures: [{ pair: 'palette', reason: 'Missing palette object' }] };
  }
  const pairs = [
    { name: 'text_on_bg', fg: palette.text, bg: palette.bg, min: 4.5 },
    { name: 'text_on_surface', fg: palette.text, bg: palette.surface, min: 4.5 },
    { name: 'muted_on_surface', fg: palette.muted, bg: palette.surface, min: 4.5 },
    { name: 'accentText_on_accent', fg: palette.accentText || '#FFFFFF', bg: palette.accent, min: 4.5 }
  ];
  const checks = [];
  const failures = [];
  for (const p of pairs) {
    const ratio = computeContrastRatio(p.fg, p.bg);
    const passed = ratio !== null && ratio >= p.min;
    checks.push({ pair: p.name, ratio, required: p.min, passed });
    if (!passed) {
      failures.push({ pair: p.name, fg: p.fg, bg: p.bg, ratio, required: p.min });
    }
  }
  return { passed: failures.length === 0, checks, failures };
}

const CLICHE_COPY_PATTERNS = [
  /unlock the power/i,
  /all-in-one solution/i,
  /revolutionize your workflow/i,
  /seamless experience/i,
  /next-gen ai platform/i,
  /lorem ipsum/i,
  /supercharge your productivity/i
];

function auditAntiSlop({
  palette,
  typography,
  screens = [],
  interactiveStates = [],
  codeOrHtml = '',
  designMd = '',
  platforms = ['mobile', 'desktop'],
  projectScan = null,
  experienceMode = 'application'
}) {
  const findings = [];
  let score = 10;

  const addFinding = (severity, code, message, penalty) => {
    findings.push({ severity, code, message });
    score = Math.max(0, Number((score - penalty).toFixed(2)));
  };

  // 1. Slop purple/neon gradient cliché
  const hexBlob = `${palette ? JSON.stringify(palette) : ''} ${codeOrHtml}`;
  if (/#6366f1|#8b5cf6|#a855f7|linear-gradient\([^)]*(#6366f1|#8b5cf6|#7c3aed|indigo|violet)/i.test(hexBlob)) {
    addFinding('high', 'SLOP_CLICHE_PALETTE', 'Detected default AI purple/indigo gradient cliché. Replace with calibrated domain tokens.', 2.5);
  }

  // 2. Typography character & loaded font check
  const displayFont = String((typography && (typography.displayName || typography.display)) || '');
  const bodyFont = String((typography && (typography.bodyName || typography.body)) || '');
  if (!displayFont || /^(inter|roboto|arial|system-ui|sans-serif)$/i.test(displayFont.trim())) {
    addFinding('medium', 'SLOP_GENERIC_TYPOGRAPHY', 'Display typography defaults to generic Inter/Roboto/system font instead of an intentional character font.', 1.5);
  } else if (displayFont.toLowerCase() === bodyFont.toLowerCase() && displayFont.toLowerCase() === 'inter') {
    addFinding('medium', 'SLOP_GENERIC_TYPOGRAPHY', 'Inter used across both display and body without typographic contrast.', 1.2);
  }

  if (codeOrHtml && /<!doctype html/i.test(codeOrHtml)) {
    if (!/fonts\.googleapis\.com|@font-face/i.test(codeOrHtml)) {
      addFinding('medium', 'MISSING_WEB_FONT_IMPORT', 'Full HTML prototype lacks web font stylesheet/import (<link> fonts.googleapis.com or @font-face); browser will fall back to generic system fonts.', 1.0);
    }
    if (!/<svg\b/i.test(codeOrHtml)) {
      addFinding('medium', 'MISSING_VECTOR_ICONS', 'HTML prototype contains no SVG vector icons or bespoke illustrations.', 1.0);
    }
    if (/class="[^"]*state-toggle[^"]*"/i.test(codeOrHtml) && /populated/i.test(codeOrHtml) && /<header[\s\S]*data-state="loading"/i.test(codeOrHtml)) {
      addFinding('medium', 'DEBUG_CHROME_IN_APP', 'Developer QA state toggle pills leaked inside rendered app topbar instead of Studio Workbench postMessage controls.', 1.5);
    }
  }

  // 3. WCAG AA contrast math
  const contrastAudit = auditPaletteContrast(palette);
  if (!contrastAudit.passed) {
    addFinding('high', 'WCAG_CONTRAST_FAILURE', `WCAG AA contrast failed on: ${contrastAudit.failures.map((f) => `${f.pair}(${f.ratio}:1)`).join(', ')}`, 2.5);
  }

  // 4. Multi-state completeness & Multi-screen architecture
  const requiredStates = ['populated', 'loading', 'empty', 'error'];
  const stateSet = new Set((interactiveStates || []).map((s) => String(s).toLowerCase()));
  const missingStates = requiredStates.filter((s) => !stateSet.has(s));
  const isNarrativeSite = experienceMode === 'product-story' || experienceMode === 'brand-story';
  if (isNarrativeSite) {
    if (!Array.isArray(screens) || screens.length < 3) {
      addFinding('high', 'INCOMPLETE_PRODUCT_STORY', 'Product launch pages need at least three connected narrative chapters.', 1.8);
    }
    if (!/prefers-reduced-motion/i.test(codeOrHtml)) {
      addFinding('high', 'PRODUCT_MOTION_FALLBACK_MISSING', 'Product story motion must honor prefers-reduced-motion.', 1.4);
    }
    if (!/model-viewer|asset-placeholder/i.test(codeOrHtml)) {
      addFinding('medium', 'PRODUCT_ASSET_STATE_MISSING', 'Product pages must show a real model or an explicit placeholder state.', 1.0);
    }
  } else if (missingStates.length > 0) {
    addFinding('high', 'INCOMPLETE_INTERACTIVE_STATES', `Missing interactive UI states: ${missingStates.join(', ')}`, 1.8);
  }

  if (!isNarrativeSite && (!Array.isArray(screens) || screens.length < 2)) {
    addFinding('high', 'SINGLE_STATIC_SCREEN', 'Design includes fewer than 2 connected screens; clickable prototypes require real multi-screen flows.', 2.0);
  } else {
    const archetypes = new Set(screens.map((s) => s.type || 'default'));
    if (!isNarrativeSite && screens.length >= 3 && archetypes.size === 1 && !codeOrHtml.includes('data-archetype')) {
      addFinding('medium', 'UNIFORM_CARD_SLOP', 'Multiple screens reuse an identical template without subject-matched archetypes.', 1.0);
    }
  }

  // 4b. Structural quality: countable checks for the repeated-card dashboard
  // pattern that commonly makes generated product UIs feel interchangeable.
  if (codeOrHtml) {
    const repeatedCardSelectors = (codeOrHtml.match(/class=["'][^"']*(?:metric-card|stat-card|feature-card|dashboard-card)[^"']*["']/gi) || []).length;
    const bespokeArchetypeCount = (codeOrHtml.match(/data-archetype=["'][^"']+["']/gi) || []).length;
    if (repeatedCardSelectors >= 4 && bespokeArchetypeCount < 2) {
      addFinding('high', 'REPETITIVE_CARD_COMPOSITION', 'Four or more metric/feature cards appear without multiple distinct screen archetypes. Replace the card grid with a hierarchy built around the product’s core task.', 2.0);
    }

    const genericDashboardCopy = /\b(?:total users|active users|revenue|conversion rate|recent activity|quick actions)\b/gi;
    const genericMatches = codeOrHtml.match(genericDashboardCopy) || [];
    if (genericMatches.length >= 3 && !projectScan?.detected) {
      addFinding('medium', 'GENERIC_DASHBOARD_CONTENT', 'Several generic SaaS dashboard labels remain in a project without repository evidence. Ground labels, data and actions in the brief or codebase.', 1.2);
    }

    const deadControlHints = (codeOrHtml.match(/<button\b(?![^>]*(?:data-|type=|aria-label|onclick))[^>]*>/gi) || []).length;
    if (deadControlHints >= 3) {
      addFinding('medium', 'UNWIRED_PRIMARY_CONTROLS', 'Several buttons have no visible interaction hook. Give each control a meaningful action or render it as non-interactive content.', 1.0);
    }
  }

  // 5. Cliché copywriting check
  const copyMatches = CLICHE_COPY_PATTERNS.filter((re) => re.test(codeOrHtml));
  if (copyMatches.length > 0) {
    addFinding('medium', 'SLOP_CLICHE_COPY', 'Detected generic AI placeholder copywriting clichés instead of domain-specific UX writing.', 1.2);
  }

  // 6. DESIGN.md consistency check
  if (!designMd || designMd.trim().length < 200) {
    addFinding('medium', 'MISSING_DESIGN_MD', 'DESIGN.md artifact is missing or too thin to anchor agent sessions.', 1.0);
  }

  // 7. Mobile + Desktop parity
  if (platforms.includes('mobile') && platforms.includes('desktop') && codeOrHtml && !/@media|mobile-frame|mobile-tabbar|max-width:/i.test(codeOrHtml)) {
    addFinding('medium', 'MISSING_PLATFORM_PARITY', 'Interactive prototype does not include responsive mobile navigation / breakpoint structure.', 1.2);
  }

  if (projectScan && projectScan.detected && projectScan.uiLibraries.length > 0 && designMd) {
    const matched = projectScan.uiLibraries.some((lib) => designMd.toLowerCase().includes(lib.toLowerCase().split(' ')[0]));
    if (!matched) {
      addFinding('low', 'STACK_ALIGNMENT_NOTE', 'Mention detected repository UI stack inside DESIGN.md for tighter developer alignment.', 0.4);
    }
  }

  return {
    overallScore: score,
    verdict: score >= 8.0 && !findings.some((f) => f.severity === 'high') ? 'pass' : 'revise',
    contrastAudit,
    findings
  };
}

module.exports = {
  parseHexRgb,
  computeContrastRatio,
  auditPaletteContrast,
  auditAntiSlop
};
