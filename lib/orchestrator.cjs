'use strict';

const crypto = require('node:crypto');
const { DESIGN_DIRECTIONS, INTERACTIVE_STATES, PLATFORM_GUIDELINES } = require('./design-library.cjs');
const { scanProjectCodebase } = require('./project-scanner.cjs');
const { auditAntiSlop, auditPaletteContrast } = require('./anti-slop-auditor.cjs');
const { buildDesignMd, buildInteractivePrototypeHtml, buildCodeBundles } = require('./prototype-builder.cjs');
const { deriveCreativeDirection } = require('./creative-direction.cjs');
const { buildProductStoryPrototypeHtml } = require('./product-story-builder.cjs');

const DESIGN_CREW = [
  {
    id: 'codebase-archaeologist',
    order: 1,
    handle: 'Arqueólogo de Código',
    title: 'Codebase & Product Context Analyst',
    mission: 'Inspect target repository first (stack, CSS tokens, DESIGN.md, routes, components) before designing a single pixel.'
  },
  {
    id: 'ux-architect',
    order: 2,
    handle: 'Arquiteto de UX & Fluxos',
    title: 'Multi-Screen Information & Ergonomics Architect',
    mission: 'Map connected user journeys, mobile thumb-zone navigation, desktop command-bar density, and all 4 interactive UI states.'
  },
  {
    id: 'visual-director',
    order: 3,
    handle: 'Diretor Visual Anti-Slop',
    title: 'Intentional Aesthetic & WCAG Color Director',
    mission: 'Select a non-generic aesthetic direction, expressive font pairing, and WCAG 2.1 AA verified palette tailored to the product domain.'
  },
  {
    id: 'motion-prototyper',
    order: 4,
    handle: 'Prototipador Interativo',
    title: 'Interactive Multi-Viewport Prototype Engineer',
    mission: 'Build a live clickable HTML/CSS/JS prototype supporting screen navigation, Cmd+K palette, inline filtering, and state switching.'
  },
  {
    id: 'component-smith',
    order: 5,
    handle: 'Engenheiro de DESIGN.md & Código',
    title: 'Design System & Framework Code Compiler',
    mission: 'Compile machine-readable DESIGN.md, CSS tokens, React/Tailwind, and React Native shells matched to the scanned stack.'
  },
  {
    id: 'slop-auditor',
    order: 6,
    handle: 'Auditor Anti-AI-Slop',
    title: 'Deterministic Slop & Accessibility Gatekeeper',
    mission: 'Audit palette, contrast math, typography craft, copy authenticity, interactive states, and platform ergonomics.'
  }
];

function inferDomainProfile(brief = '', projectScan = {}) {
  const q = `${brief} ${projectScan.projectName || ''} ${projectScan.description || ''} ${projectScan.existingReadmeSummary || ''}`.toLowerCase();

  if (/(finance|fintech|bank|banco|wallet|carteira|pagamento|pix|invoice|fatura|crypto|invest)/i.test(q)) {
    return {
      domain: 'fintech',
      primaryEntity: 'transaction',
      preferredDirections: ['obsidian-precision', 'cobalt-atelier', 'nordic-clinical-sage'],
      metrics: [
        { label: 'Available Balance', value: '$48,920.40', delta: '+4.2% vs last month' },
        { label: 'Monthly Cashflow', value: '+$12,410', delta: '98.4% reconciled' },
        { label: 'Pending Clearances', value: '3 items', delta: 'Settling today' }
      ],
      records: [
        { title: 'Treasury Sweep #409', meta: '+$14,500.00 · 09:42', status: 'Cleared', tone: '', detail: 'Automated liquidity transfer from operating checking to yield reserve.' },
        { title: 'Cloud Infrastructure Invoice', meta: '-$1,240.00 · 08:15', status: 'Pending', tone: 'warn', detail: 'Scheduled vendor settlement awaiting secondary treasury approval.' },
        { title: 'Card Dispute #882', meta: '$320.00 · Yesterday', status: 'Review', tone: 'danger', detail: 'Merchant mismatch flagged for immediate cardholder verification.' }
      ],
      screens: [
        { id: 'overview', shortCode: '01', shortLabel: 'Balance', title: 'Treasury Overview', purpose: 'Immediate cash position, pending clearances, and primary transfer controls.', primaryAction: 'New Transfer', listTitle: 'Recent Ledger Activity' },
        { id: 'cards', shortCode: '02', shortLabel: 'Cards', title: 'Virtual Cards & Limits', purpose: 'Issue role-scoped cards, freeze spend instantly, and audit merchant rules.', primaryAction: 'Issue Virtual Card', listTitle: 'Active Cards' },
        { id: 'analytics', shortCode: '03', shortLabel: 'Runway', title: 'Burn & Cashflow Forecast', purpose: 'Compare inflow velocity against committed recurring liabilities.', primaryAction: 'Export Statement', listTitle: 'Forecast Scenarios' },
        { id: 'settings', shortCode: '04', shortLabel: 'Rules', title: 'Approval Policies', purpose: 'Configure dual-sign thresholds, alerts, and webhook notifications.', primaryAction: 'Add Policy Rule', listTitle: 'Active Guardrails' }
      ]
    };
  }

  if (/(health|clinic|medic|sa[uú]de|paciente|patient|fitness|workout|treino|wellness|telemed)/i.test(q)) {
    return {
      domain: 'health',
      primaryEntity: 'session',
      preferredDirections: ['nordic-clinical-sage', 'swiss-editorial-warm'],
      metrics: [
        { label: 'Active Patients', value: '142', delta: '12 scheduled today' },
        { label: 'Adherence Rate', value: '91.4%', delta: '+6.1% 30-day trend' },
        { label: 'Open Triage Alerts', value: '2', delta: 'Response < 15 min' }
      ],
      records: [
        { title: 'Morning Vitals Check-In', meta: '09:00 · Follow-up', status: 'On Track', tone: '', detail: 'Resting heart rate and recovery biomarkers within target baseline.' },
        { title: 'Prescription Renewal #19', meta: '10:30 · Clinician', status: 'Needs Review', tone: 'warn', detail: 'Dosage verification pending physician digital signature.' },
        { title: 'Lab Panel Sync Delay', meta: 'External API', status: 'Attention', tone: 'danger', detail: 'Partner diagnostic feed timed out; retry sync to import PDF results.' }
      ],
      screens: [
        { id: 'today', shortCode: '01', shortLabel: 'Today', title: 'Care Schedule & Triage', purpose: 'Prioritize urgent patient check-ins and daily clinical actions.', primaryAction: 'Log Check-In', listTitle: 'Today Queue' },
        { id: 'records', shortCode: '02', shortLabel: 'Records', title: 'Patient Timeline', purpose: 'Unified longitudinal vitals, notes, and medication history.', primaryAction: 'Add Clinical Note', listTitle: 'Recent Entries' },
        { id: 'programs', shortCode: '03', shortLabel: 'Plans', title: 'Care Plans & Milestones', purpose: 'Track weekly recovery goals with thumb-friendly mobile reminders.', primaryAction: 'Assign Plan', listTitle: 'Active Plans' },
        { id: 'settings', shortCode: '04', shortLabel: 'Prefs', title: 'Clinic & Privacy Controls', purpose: 'Manage consent scopes, notification quiet hours, and audit logs.', primaryAction: 'Update Consent', listTitle: 'Security Policies' }
      ]
    };
  }

  if (/(food|bar|restaurante|delivery|loja|store|shop|commerce|ecommerce|pedido|order|menu|card[aá]pio)/i.test(q)) {
    return {
      domain: 'commerce',
      primaryEntity: 'order',
      preferredDirections: ['warm-ochre-craft', 'swiss-editorial-warm'],
      metrics: [
        { label: 'Live Orders', value: '38', delta: 'Avg prep 14 min' },
        { label: 'Daily Revenue', value: '$4,280', delta: '+18% vs Tue' },
        { label: 'Low Stock SKUs', value: '4', delta: 'Reorder ready' }
      ],
      records: [
        { title: 'Table 12 — Tasting Menu x2', meta: '$148.00 · Kitchen', status: 'Preparing', tone: '', detail: 'Fired course 2 with allergy note verified at POS.' },
        { title: 'Pickup #884 — Artisan Roast', meta: '$42.50 · Ready', status: 'Awaiting Pickup', tone: 'warn', detail: 'Customer notified via SMS; shelf B2.' },
        { title: 'Supplier Delivery #104', meta: 'Cold Chain', status: 'Delayed', tone: 'danger', detail: 'Courier ETA shifted by 25 minutes; adjust prep batch.' }
      ],
      screens: [
        { id: 'catalog', shortCode: '01', shortLabel: 'Catalog', title: 'Curated Catalog & Live Orders', purpose: 'Fast visual browsing on mobile and live order queue management on desktop.', primaryAction: 'New Order', listTitle: 'Live Order Queue' },
        { id: 'item', shortCode: '02', shortLabel: 'Detail', title: 'Product & Modifier Studio', purpose: 'Inspect SKU pricing, allergen tags, margins, and stock levels.', primaryAction: 'Save SKU', listTitle: 'Variant Breakdown' },
        { id: 'fulfillment', shortCode: '03', shortLabel: 'Dispatch', title: 'Kitchen & Dispatch Board', purpose: 'Real-time preparation stages with zero visual clutter.', primaryAction: 'Mark Ready', listTitle: 'Active Batches' },
        { id: 'settings', shortCode: '04', shortLabel: 'Store', title: 'Hours & Payment Gateways', purpose: 'Configure pickup windows, tax rules, and receipt templates.', primaryAction: 'Save Schedule', listTitle: 'Store Channels' }
      ]
    };
  }

  if (/(music|audio|video|stream|podcast|media|game|gaming|cinema)/i.test(q)) {
    return {
      domain: 'media',
      primaryEntity: 'session',
      preferredDirections: ['nocturnal-emerald-studio', 'obsidian-precision'],
      metrics: [
        { label: 'Active Streams', value: '1,284', delta: '0.2% buffer rate' },
        { label: 'Watch Completion', value: '74.8%', delta: '+5.4% this week' },
        { label: 'Encoding Queue', value: '6 jobs', delta: '4K HDR ready' }
      ],
      records: [
        { title: 'Master Bus — Late Night Cut', meta: '24-bit · 03:42', status: 'Published', tone: '', detail: 'Lossless spatial mix verified at -14 LUFS loudness target.' },
        { title: 'Episode 42 Rough Cut', meta: '4K ProRes · 48:10', status: 'Transcoding', tone: 'warn', detail: 'Adaptive HLS bitrate ladder rendering on worker node 2.' },
        { title: 'Subtitle Sync Track (PT-BR)', meta: 'Timecode', status: 'Mismatch', tone: 'danger', detail: 'Offset drift detected at 18:40; open timeline inspector.' }
      ],
      screens: [
        { id: 'discover', shortCode: '01', shortLabel: 'Stage', title: 'Editorial Stage & Queue', purpose: 'Curated releases with immediate playback controls and zero distracting noise.', primaryAction: 'Start Playback', listTitle: 'Up Next' },
        { id: 'studio', shortCode: '02', shortLabel: 'Editor', title: 'Media Inspector & Chapters', purpose: 'Frame-accurate markers, audio levels, and metadata tagging.', primaryAction: 'Export Master', listTitle: 'Track Stems' },
        { id: 'library', shortCode: '03', shortLabel: 'Library', title: 'Collections & Offline Cache', purpose: 'Fast keyboard or thumb filtering across saved projects.', primaryAction: 'New Collection', listTitle: 'Saved Collections' },
        { id: 'settings', shortCode: '04', shortLabel: 'Audio', title: 'Playback & Codec Preferences', purpose: 'Spatial output routing, bandwidth cap, and caption styling.', primaryAction: 'Apply Audio Profile', listTitle: 'Output Devices' }
      ]
    };
  }

  return {
    domain: 'productivity-workspace',
    primaryEntity: 'workspace item',
    preferredDirections: ['obsidian-precision', 'cobalt-atelier', 'swiss-editorial-warm'],
    metrics: [
      { label: 'Active Initiatives', value: '24', delta: '6 shipping this week' },
      { label: 'Cycle Velocity', value: '94%', delta: '+8% vs prior sprint' },
      { label: 'Blocked Reviews', value: '2', delta: 'Owner assigned' }
    ],
    records: [
      { title: 'Design System Token Sync', meta: 'Core · Updated 12m ago', status: 'Active', tone: '', detail: 'Unified semantic palette and responsive breakpoints verified across mobile and desktop.' },
      { title: 'Interactive Checkout Flow', meta: 'Mobile + Web · Review', status: 'In Review', tone: 'warn', detail: 'Thumb-zone CTA placement and keyboard shortcut parity awaiting final QA.' },
      { title: 'Legacy Webhook Migration', meta: 'Infra · Escalated', status: 'Blocked', tone: 'danger', detail: 'Upstream sandbox endpoint returning 503; retry queued.' }
    ],
    screens: [
      { id: 'workspace', shortCode: '01', shortLabel: 'Home', title: 'Command Workspace', purpose: 'High-signal overview prioritizing active items, keyboard jump (Ctrl+K), and zero clutter.', primaryAction: 'Create Item', listTitle: 'Priority Queue' },
      { id: 'inspector', shortCode: '02', shortLabel: 'Detail', title: 'Deep Item Inspector', purpose: 'Split-pane detail view with inline edits, history timeline, and contextual actions.', primaryAction: 'Approve & Ship', listTitle: 'Linked Dependencies' },
      { id: 'flows', shortCode: '03', shortLabel: 'Flows', title: 'Automation & Rules', purpose: 'Visual state transitions with explicit validation and error recovery paths.', primaryAction: 'Run Validation', listTitle: 'Active Automations' },
      { id: 'settings', shortCode: '04', shortLabel: 'System', title: 'Tokens & Access Controls', purpose: 'Workspace roles, theme tokens, and integration health.', primaryAction: 'Save Config', listTitle: 'Connected Providers' }
    ]
  };
}

function selectDirection({ brief = '', directionId = null, preferredDirections = [], variantSeed = null, platforms = ['mobile', 'desktop'] }) {
  if (directionId) {
    const exact = DESIGN_DIRECTIONS.find((d) => d.id === directionId);
    if (exact) return exact;
  }

  const q = String(brief || '').toLowerCase();
  if (/(dark|escuro|noturno|night|obsidian)/i.test(q)) {
    const darkCandidates = DESIGN_DIRECTIONS.filter((d) => d.categories.includes('dark'));
    if (darkCandidates.length) return pickWithSeed(darkCandidates, variantSeed || brief);
  }
  if (/(light|claro|editorial|paper|swiss|clean|daylight)/i.test(q)) {
    const lightCandidates = DESIGN_DIRECTIONS.filter((d) => d.categories.includes('light'));
    if (lightCandidates.length) return pickWithSeed(lightCandidates, variantSeed || brief);
  }

  const pool = preferredDirections
    .map((id) => DESIGN_DIRECTIONS.find((d) => d.id === id))
    .filter(Boolean);

  if (pool.length) {
    return pickWithSeed(pool, variantSeed || brief || platforms.join(','));
  }
  return pickWithSeed(DESIGN_DIRECTIONS, variantSeed || brief);
}

function pickWithSeed(list, seedInput) {
  if (!seedInput) return list[0];
  const digest = crypto.createHash('sha256').update(String(seedInput)).digest();
  const idx = digest[0] % list.length;
  return list[idx];
}

function runDesignPipeline({
  brief,
  appName = '',
  projectPath = null,
  platforms = null,
  directionId = null,
  variantSeed = null,
  customScreens = null,
  customMetrics = null,
  customRecords = null,
  researchInsights = null,
  productModelUrl = ''
} = {}) {
  const cleanBrief = String(brief || '').trim();
  if (!cleanBrief) {
    throw new Error('Provide a non-empty product/design brief.');
  }

  const projectScan = scanProjectCodebase(projectPath);
  const resolvedPlatforms = Array.isArray(platforms) && platforms.length
    ? platforms.filter((p) => p === 'mobile' || p === 'desktop')
    : (projectScan.detected ? projectScan.platforms : ['mobile', 'desktop']);
  if (!resolvedPlatforms.length) resolvedPlatforms.push('mobile', 'desktop');

  const resolvedAppName = String(appName || (projectScan.detected ? projectScan.projectName : '') || cleanBrief.split(/\s+/).slice(0, 3).join(' ')).trim();
  const domainProfile = inferDomainProfile(cleanBrief, projectScan);
  const direction = selectDirection({
    brief: cleanBrief,
    directionId,
    preferredDirections: domainProfile.preferredDirections,
    variantSeed,
    platforms: resolvedPlatforms
  });

  const screens = Array.isArray(customScreens) && customScreens.length >= 2
    ? customScreens.map((s, idx) => ({
        id: s.id || `screen-${idx + 1}`,
        shortCode: s.shortCode || `0${idx + 1}`,
        shortLabel: s.shortLabel || String(s.title || `Tab ${idx + 1}`).split(' ')[0],
        title: s.title || `Screen ${idx + 1}`,
        purpose: s.purpose || cleanBrief,
        primaryAction: s.primaryAction || 'Continue',
        listTitle: s.listTitle || 'Items'
      }))
    : domainProfile.screens;

  const metrics = Array.isArray(customMetrics) && customMetrics.length ? customMetrics : domainProfile.metrics;
  const records = Array.isArray(customRecords) && customRecords.length ? customRecords : domainProfile.records;
  const contrastAudit = auditPaletteContrast(direction.palette);
  const creativeDirection = deriveCreativeDirection({
    brief: cleanBrief,
    appName: resolvedAppName,
    domain: domainProfile.domain,
    projectScan
  });

  const spec = {
    appName: resolvedAppName,
    brief: cleanBrief,
    domain: domainProfile.domain,
    primaryEntity: domainProfile.primaryEntity,
    direction,
    platforms: resolvedPlatforms,
    screens,
    metrics,
    records,
    creativeDirection,
    interactiveStates: INTERACTIVE_STATES,
    projectScan,
    contrastAudit,
    researchInsights: researchInsights || null
  };

  const designMd = buildDesignMd(spec);
  const isNarrativeSite = creativeDirection.mode !== 'application';
  const interactiveHtml = isNarrativeSite
    ? buildProductStoryPrototypeHtml({ ...spec, creativeDirection, modelUrl: productModelUrl })
    : buildInteractivePrototypeHtml(spec);
  const codeBundles = buildCodeBundles(spec);
  const auditScreens = isNarrativeSite
    ? creativeDirection.chapters.map((title, index) => ({ id: `chapter-${index + 1}`, type: 'product-story', title }))
    : screens;

  const audit = auditAntiSlop({
    palette: direction.palette,
    typography: direction.typography,
    screens: auditScreens,
    interactiveStates: isNarrativeSite ? [] : spec.interactiveStates,
    experienceMode: creativeDirection.mode,
    codeOrHtml: isNarrativeSite ? interactiveHtml : `${interactiveHtml}\n${codeBundles.reactTailwind}`,
    designMd,
    platforms: resolvedPlatforms,
    projectScan
  });

  const now = new Date().toISOString();
  const crewBoard = [
    {
      step: 1,
      agentId: 'codebase-archaeologist',
      handle: 'Arqueólogo de Código',
      summary: projectScan.detected
        ? `Projeto "${projectScan.projectName}" analisado (${projectScan.frameworks.join(', ') || 'stack genérica'}; ${projectScan.fileCountSampled} arquivos, ${projectScan.designTokens.colors.length} tokens hex).`
        : 'Projeto greenfield (nenhum diretório local informado); perfil inferido pelo brief.'
    },
    {
      step: 2,
      agentId: 'ux-architect',
      handle: 'Arquiteto de UX & Fluxos',
      summary: `${screens.length} telas interligadas (${screens.map((s) => s.title).join(' -> ')}) com 4 estados (${spec.interactiveStates.join(', ')}) para ${resolvedPlatforms.join(' + ')}.`
    },
    {
      step: 3,
      agentId: 'visual-director',
      handle: 'Diretor Visual Anti-Slop',
      summary: `Direção "${direction.name}" (${direction.typography.display} + ${direction.typography.body}); contraste WCAG AA ${contrastAudit.passed ? 'aprovado' : 'com alertas'}.`
    },
    {
      step: 4,
      agentId: 'motion-prototyper',
      handle: 'Prototipador Interativo',
      summary: 'Protótipo clicável compilado com navegação multi-tela, Ctrl+K Command Palette, filtro inline e alternância Mobile/Desktop.'
    },
    {
      step: 5,
      agentId: 'component-smith',
      handle: 'Engenheiro de DESIGN.md & Código',
      summary: `DESIGN.md, CSS Tokens, React/Tailwind${codeBundles.reactNative ? ' e React Native' : ''} compilados.`
    },
    {
      step: 6,
      agentId: 'slop-auditor',
      handle: 'Auditor Anti-AI-Slop',
      summary: `Score Anti-Slop: ${audit.overallScore}/10 (${audit.verdict.toUpperCase()}, ${audit.findingsCount} achados).`
    }
  ];

  return {
    createdAt: now,
    updatedAt: now,
    appName: resolvedAppName,
    brief: cleanBrief,
    domain: domainProfile.domain,
    platforms: resolvedPlatforms,
    directionId: direction.id,
    direction,
    screens,
    metrics,
    records,
    creativeDirection,
    interactiveStates: INTERACTIVE_STATES,
    projectScan,
    researchInsights: researchInsights || null,
    designMd,
    interactiveHtml,
    codeBundles,
    audit,
    crewBoard,
    platformGuidelines: resolvedPlatforms.map((pid) => PLATFORM_GUIDELINES[pid]).filter(Boolean)
  };
}

module.exports = {
  DESIGN_CREW,
  inferDomainProfile,
  selectDirection,
  deriveCreativeDirection,
  runDesignPipeline
};
