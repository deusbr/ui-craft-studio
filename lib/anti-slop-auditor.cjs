'use strict';

const { ANTI_SLOP_BAN_LIST } = require('./design-library.cjs');

/**
 * Computes WCAG 2.1 relative luminance and contrast ratio for hex colors.
 */
function parseHexRgb(hex) {
  const clean = String(hex || '').trim().replace(/^#/, '');
  if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(clean)) return null;
  const full = clean.length === 3
    ? clean.split('').map((c) => c + c).join('')
    : clean;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16)
  };
}

function relativeLuminance(rgb) {
  const toLinear = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLinear(rgb.r) + 0.7152 * toLinear(rgb.g) + 0.0722 * toLinear(rgb.b);
}

function computeContrastRatio(hexA, hexB) {
  const rgbA = parseHexRgb(hexA);
  const rgbB = parseHexRgb(hexB);
  if (!rgbA || !rgbB) return null;
  const l1 = relativeLuminance(rgbA);
  const l2 = relativeLuminance(rgbB);
  const bright = Math.max(l1, l2);
  const dark = Math.min(l1, l2);
  return Number(((bright + 0.05) / (dark + 0.05)).toFixed(2));
}

function auditPaletteContrast(palette = {}) {
  const pairs = [
    { id: 'text-on-bg', fg: palette.text, bg: palette.bg, minRatio: 4.5 },
    { id: 'text-on-surface', fg: palette.text, bg: palette.surface, minRatio: 4.5 },
    { id: 'muted-on-surface', fg: palette.muted, bg: palette.surface, minRatio: 4.5 },
    { id: 'accentText-on-accent', fg: palette.accentText, bg: palette.accent, minRatio: 4.5 }
  ];

  const checks = pairs.map((p) => {
    const ratio = computeContrastRatio(p.fg, p.bg);
    return {
      id: p.id,
      fg: p.fg,
      bg: p.bg,
      ratio,
      minRatio: p.minRatio,
      aaPass: ratio !== null && ratio >= p.minRatio,
      aaaPass: ratio !== null && ratio >= 7.0
    };
  });

  const failures = checks.filter((c) => !c.aaPass);
  return {
    passed: failures.length === 0,
    checks,
    failures
  };
}

/**
 * Deterministic Anti-AI-Slop & UX Completeness Auditor (zero external API keys).
 * Evaluates design specs, generated HTML/CSS/code, and DESIGN.md artifacts.
 */
function auditAntiSlop({
  palette = null,
  typography = null,
  screens = [],
  interactiveStates = [],
  codeOrHtml = '',
  designMd = '',
  platforms = ['mobile', 'desktop'],
  projectScan = null
} = {}) {
  const findings = [];
  const sanitizedDesignMd = String(designMd || '').replace(/## 7\. Anti-AI-Slop Guardrails[\s\S]*$/i, '');
  const rawText = `${codeOrHtml}\n${sanitizedDesignMd}`.toLowerCase();

  // 1. Cliché purple/indigo gradient check
  const matchedColors = [];
  const paletteBlob = palette ? JSON.stringify(palette).toLowerCase() : '';
  for (const hex of ANTI_SLOP_BAN_LIST.clicheColors) {
    if (paletteBlob.includes(hex) || rawText.includes(hex)) {
      matchedColors.push(hex);
    }
  }
  if (/linear-gradient\([^)]*(#6366f1|#8b5cf6|#a855f7|purple|violet)[^)]*\)/i.test(rawText)) {
    matchedColors.push('purple-gradient');
  }
  if (matchedColors.length) {
    findings.push({
      code: 'SLOP_CLICHE_PALETTE',
      severity: 'high',
      message: `Detected overused AI-slop indigo/purple palette markers: ${matchedColors.join(', ')}.`,
      fix: 'Replace generic purple gradients with domain-anchored palette tokens.'
    });
  }

  // 2. Cliché default Inter-only typography check
  const displayFont = String(typography?.display || '').toLowerCase();
  if (!displayFont || displayFont === 'inter' || displayFont === 'roboto' || displayFont === 'arial') {
    findings.push({
      code: 'SLOP_GENERIC_TYPOGRAPHY',
      severity: 'medium',
      message: `Display typography "${typography?.display || 'unset'}" lacks distinctive brand character.`,
      fix: 'Pair an expressive display face (e.g., Fraunces, Space Grotesk, Syne, Instrument Serif) with a readable body face.'
    });
  }

  // 3. Cliché AI marketing copy detector
  const matchedPhrases = ANTI_SLOP_BAN_LIST.clicheCopyPhrases.filter((phrase) => rawText.includes(phrase));
  if (matchedPhrases.length) {
    findings.push({
      code: 'SLOP_CLICHE_COPY',
      severity: 'high',
      message: `Detected generic AI placeholder/marketing copy: ${matchedPhrases.join(', ')}.`,
      fix: 'Replace hype buzzwords with concrete domain labels, actions, and real data metrics.'
    });
  }

  // 4. WCAG 2.1 Contrast math verification
  const contrastAudit = palette ? auditPaletteContrast(palette) : { passed: true, checks: [], failures: [] };
  if (!contrastAudit.passed) {
    for (const fail of contrastAudit.failures) {
      findings.push({
        code: 'WCAG_CONTRAST_FAILURE',
        severity: 'high',
        message: `Contrast failure on ${fail.id} (${fail.fg} on ${fail.bg} = ${fail.ratio}:1 < ${fail.minRatio}:1).`,
        fix: `Adjust ${fail.id} colors to reach >= 4.5:1 WCAG AA contrast.`
      });
    }
  }

  // 5. Interactive & multi-state completeness check (no static-only mockups)
  const requiredStates = ['populated', 'loading', 'empty', 'error'];
  const presentStates = new Set(interactiveStates.map((s) => String(s).toLowerCase()));
  const missingStates = requiredStates.filter((st) => !presentStates.has(st));
  if (missingStates.length) {
    findings.push({
      code: 'INCOMPLETE_INTERACTIVE_STATES',
      severity: 'medium',
      message: `Prototype is missing interactive UI states: ${missingStates.join(', ')}.`,
      fix: 'Provide interactive toggles/views for populated, loading, empty, and error states.'
    });
  }

  if (Array.isArray(screens) && screens.length < 2) {
    findings.push({
      code: 'SINGLE_STATIC_SCREEN',
      severity: 'medium',
      message: 'Design defines fewer than 2 linked screens; multi-screen navigation is required for coherent app UX.',
      fix: 'Design at least 3 interconnected screens (e.g., Home/Overview, Detail/Action, Settings/Flow).'
    });
  }

  // 6. Multi-platform Mobile + Desktop responsiveness check
  if (codeOrHtml) {
    if (platforms.includes('mobile') && !/(44px|48px|bottom|tab-bar|mobile|max-width)/i.test(codeOrHtml)) {
      findings.push({
        code: 'MOBILE_ERGONOMICS_GAP',
        severity: 'medium',
        message: 'Generated code lacks explicit mobile viewport/thumb-zone ergonomics markers.',
        fix: 'Ensure >= 44px touch targets and mobile bottom navigation rules.'
      });
    }
    if (platforms.includes('desktop') && !/(sidebar|rail|1440|grid|cmd|shortcut|desktop)/i.test(codeOrHtml)) {
      findings.push({
        code: 'DESKTOP_DENSITY_GAP',
        severity: 'low',
        message: 'Generated code lacks desktop workspace navigation or command-bar ergonomics.',
        fix: 'Include persistent desktop rail/sidebar and keyboard-first workspace structure.'
      });
    }
  }

  // 7. Codebase coherence check
  if (projectScan && projectScan.detected && projectScan.designTokens?.colors?.length && designMd) {
    const mentionsProject = rawText.includes(String(projectScan.projectName || '').toLowerCase());
    if (!mentionsProject) {
      findings.push({
        code: 'PROJECT_CONTEXT_DRIFT',
        severity: 'low',
        message: 'Generated DESIGN.md does not reference the scanned project identity.',
        fix: 'Anchor design tokens and naming directly to the scanned codebase.'
      });
    }
  }

  const highPenalty = findings.filter((f) => f.severity === 'high').length * 2.0;
  const medPenalty = findings.filter((f) => f.severity === 'medium').length * 1.0;
  const lowPenalty = findings.filter((f) => f.severity === 'low').length * 0.4;
  const overallScore = Number(Math.max(0, Math.min(10, 10 - highPenalty - medPenalty - lowPenalty)).toFixed(2));
  const verdict = findings.some((f) => f.severity === 'high') || overallScore < 8.0 ? 'revise' : 'pass';

  return {
    verdict,
    overallScore,
    contrastAudit,
    findingsCount: findings.length,
    findings,
    checkedAxes: [
      'antiSlopPalette',
      'typographyCraft',
      'domainCopyAuthenticity',
      'wcagContrastMath',
      'interactiveStateCoverage',
      'multiScreenFlow',
      'mobileThumbErgonomics',
      'desktopWorkspaceDensity'
    ]
  };
}

module.exports = {
  parseHexRgb,
  computeContrastRatio,
  auditPaletteContrast,
  auditAntiSlop
};
