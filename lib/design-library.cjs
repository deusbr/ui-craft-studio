'use strict';

/**
 * Curated Anti-AI-Slop UI/UX Design Intelligence Library.
 * Synthesizes patterns from open-source design ecosystems (Impeccable, UI-UX-Pro-Max,
 * Google Stitch DESIGN.md, AntiSlopUI, Apple HIG, Material 3, and Swiss/Editorial grids).
 */

const DESIGN_DIRECTIONS = [
  {
    id: 'obsidian-precision',
    name: 'Obsidian Precision & Warm Amber',
    categories: ['devtools', 'ai', 'fintech', 'desktop', 'analytics', 'dark'],
    atmosphere: 'High-contrast dark workbench inspired by precision audio hardware and Linear/Raycast ergonomics — zero neon purple.',
    density: 'compact-structured',
    surfaceStrategy: 'Layered matte charcoal surfaces separated by 1px hairline borders rather than heavy drop shadows.',
    typography: {
      display: 'Space Grotesk',
      body: 'Plus Jakarta Sans',
      mono: 'JetBrains Mono',
      rationale: 'Geometric technical voice with crisp tabular numerals and zero generic Inter monotony.'
    },
    palette: {
      bg: '#0D0F12',
      surface: '#151921',
      surfaceElevated: '#1C222D',
      border: '#2A313E',
      text: '#F3F5F7',
      muted: '#9CA6B8',
      accent: '#E59A38',
      accentText: '#110D06',
      success: '#2FB380',
      warning: '#E59A38',
      danger: '#E35D5B'
    },
    radius: { sm: '6px', md: '10px', lg: '14px' },
    motion: 'Crisp 150ms cubic-bezier(0.2, 0.8, 0.2, 1) state transitions; zero decorative bounce.'
  },
  {
    id: 'swiss-editorial-warm',
    name: 'Swiss Editorial & Terracotta Ink',
    categories: ['saas', 'publishing', 'commerce', 'productivity', 'light', 'editorial'],
    atmosphere: 'Warm newsprint paper aesthetic with crisp Swiss grid hairlines, strong typographic hierarchy, and tactile terracotta actions.',
    density: 'balanced-airy',
    surfaceStrategy: 'Off-white warm paper canvas with subtle 1px structural rules and zero floating card clutter.',
    typography: {
      display: 'Fraunces',
      body: 'DM Sans',
      mono: 'IBM Plex Mono',
      rationale: 'Expressive optical serif headlines paired with clean humanistic sans body text.'
    },
    palette: {
      bg: '#F6F3EC',
      surface: '#FFFFFF',
      surfaceElevated: '#EFEAE0',
      border: '#D7D0C3',
      text: '#191815',
      muted: '#5E594F',
      accent: '#B84327',
      accentText: '#FFFFFF',
      success: '#1E7E58',
      warning: '#A6631B',
      danger: '#B42E2E'
    },
    radius: { sm: '4px', md: '8px', lg: '12px' },
    motion: 'Calm 180ms ease-out transitions honoring reduced-motion preferences.'
  },
  {
    id: 'nordic-clinical-sage',
    name: 'Nordic Clinical Sage & Slate',
    categories: ['health', 'wellness', 'mobile', 'finance', 'education', 'light'],
    atmosphere: 'Calm daylight-first clarity engineered for thumb-zone mobile ergonomics and zero cognitive overload.',
    density: 'spacious-legible',
    surfaceStrategy: 'Soft mineral background with pure white primary task cards and high-contrast forest-sage focal actions.',
    typography: {
      display: 'Instrument Serif',
      body: 'Manrope',
      mono: 'JetBrains Mono',
      rationale: 'Human warmth in display headings coupled with crisp geometric legibility at small mobile sizes.'
    },
    palette: {
      bg: '#F2F5F3',
      surface: '#FFFFFF',
      surfaceElevated: '#E5ECE7',
      border: '#C8D4CC',
      text: '#132019',
      muted: '#4A5D52',
      accent: '#1F6E50',
      accentText: '#FFFFFF',
      success: '#1D7A56',
      warning: '#A86214',
      danger: '#B83333'
    },
    radius: { sm: '8px', md: '14px', lg: '20px' },
    motion: 'Smooth spring-damped bottom sheets (220ms) and instant tap feedback.'
  },
  {
    id: 'cobalt-atelier',
    name: 'Cobalt Atelier & Brushed Stone',
    categories: ['enterprise', 'b2b', 'crm', 'desktop', 'collaboration', 'light'],
    atmosphere: 'Utilitarian architectural workspace built for dense tables, multi-pane inspection, and keyboard-first speed.',
    density: 'dense-utilitarian',
    surfaceStrategy: 'Cool alabaster canvas with crisp slate typography and decisive international-klein cobalt focal points.',
    typography: {
      display: 'Syne',
      body: 'IBM Plex Sans',
      mono: 'IBM Plex Mono',
      rationale: 'Distinctive contemporary grotesque display headings anchored by industrial-grade IBM Plex legibility.'
    },
    palette: {
      bg: '#F4F6F9',
      surface: '#FFFFFF',
      surfaceElevated: '#E8EDF4',
      border: '#CAD3DF',
      text: '#0F1724',
      muted: '#49566B',
      accent: '#1D4ED8',
      accentText: '#FFFFFF',
      success: '#157A54',
      warning: '#9E5D0E',
      danger: '#BE2B2B'
    },
    radius: { sm: '4px', md: '6px', lg: '10px' },
    motion: 'Zero-lag 120ms hover/focus transitions; keyboard focus ring always crisp.'
  },
  {
    id: 'nocturnal-emerald-studio',
    name: 'Nocturnal Studio & Jade Signal',
    categories: ['media', 'music', 'gaming', 'streaming', 'mobile', 'dark'],
    atmosphere: 'Rich dark cinema/audio control surface avoiding generic purple-pink AI gradients in favor of deep basalt and crisp jade.',
    density: 'balanced-immersive',
    surfaceStrategy: 'Deep basalt canvas with subtle tonal elevation and luminous jade active states.',
    typography: {
      display: 'Outfit',
      body: 'Source Sans 3',
      mono: 'Fira Code',
      rationale: 'Clean modern display proportions with comfortable long-session reading contrast.'
    },
    palette: {
      bg: '#0A0E0D',
      surface: '#121917',
      surfaceElevated: '#1A2421',
      border: '#283833',
      text: '#EEF4F1',
      muted: '#94ABA2',
      accent: '#18B884',
      accentText: '#041A12',
      success: '#25C48D',
      warning: '#E4A035',
      danger: '#E85D5A'
    },
    radius: { sm: '6px', md: '12px', lg: '18px' },
    motion: 'Fluid 180ms spatial transforms preserving audio/media playback context.'
  },
  {
    id: 'warm-ochre-craft',
    name: 'Warm Ochre & Espresso Craft',
    categories: ['food', 'retail', 'hospitality', 'creator', 'mobile', 'dark'],
    atmosphere: 'Tactile dark espresso surface with warm ochre highlights tailored for lifestyle, commerce, and booking apps.',
    density: 'spacious-tactile',
    surfaceStrategy: 'Deep roasted espresso surfaces with warm bone typography and brass/ochre CTAs.',
    typography: {
      display: 'Playfair Display',
      body: 'Plus Jakarta Sans',
      mono: 'JetBrains Mono',
      rationale: 'High-craft editorial contrast evoking physical menus, lookbooks, and luxury packaging.'
    },
    palette: {
      bg: '#13100E',
      surface: '#1D1815',
      surfaceElevated: '#28211C',
      border: '#3C312A',
      text: '#F6F0EA',
      muted: '#B5A69A',
      accent: '#E2A03F',
      accentText: '#1A1105',
      success: '#3EB483',
      warning: '#E2A03F',
      danger: '#E4605E'
    },
    radius: { sm: '6px', md: '12px', lg: '16px' },
    motion: 'Gentle 200ms tactile ease-out transitions.'
  }
];

const PLATFORM_GUIDELINES = {
  mobile: {
    id: 'mobile',
    name: 'Mobile (iOS HIG & Material Design 3)',
    viewport: { width: 390, height: 844 },
    rules: [
      'Place primary navigation in a bottom tab bar (3-5 items max) inside the natural thumb-zone.',
      'Enforce minimum 44x44px (iOS) / 48x48dp (Android) touch targets with at least 8px gap.',
      'Respect top status-bar safe area (44-59px) and bottom home-indicator safe area (34px).',
      'Use progressive disclosure (sheets/drawers/detail views) instead of cramped multi-column desktop tables.',
      'Keep minimum body font size >= 15px and primary labels >= 12px for outdoor legibility.'
    ]
  },
  desktop: {
    id: 'desktop',
    name: 'Desktop / PC & Web App',
    viewport: { width: 1440, height: 900 },
    rules: [
      'Provide a persistent collapsible navigation rail/sidebar plus a keyboard-triggered Command Palette (Cmd/Ctrl+K).',
      'Use split-pane master-detail or dense data grids with pinned headers instead of empty decorative hero cards.',
      'Support full keyboard navigation, visible :focus-visible rings, and clear hover/active/selected states.',
      'Target 65-75ch readable line lengths for prose and tabular-nums for financial/metric columns.',
      'Surface contextual inspector panels inline so power users do not lose workspace context.'
    ]
  }
};

const INTERACTIVE_STATES = [
  { id: 'populated', label: 'Populated (Live Data)', description: 'Realistic domain data, active filters, interactive controls, and real metrics.' },
  { id: 'loading', label: 'Loading (Skeleton)', description: 'Layout-matched shimmer skeletons avoiding jarring layout shift.' },
  { id: 'empty', label: 'Empty State (Zero Data)', description: 'Clear explanation + single primary CTA to create or import first item.' },
  { id: 'error', label: 'Error & Recovery', description: 'Non-destructive inline alert explaining cause and one-click retry action.' }
];

const GITHUB_ECOSYSTEM_REFERENCES = [
  {
    id: 'pbakaus/impeccable',
    repo: 'pbakaus/impeccable',
    role: 'Anti-AI-Slop Rules & Design Vocabulary',
    url: 'https://github.com/pbakaus/impeccable',
    patternsAdopted: [
      'Deterministic slop detector checking cliché fonts, purple gradients, nested cards, and contrast failures',
      'Project context initialization (DESIGN.md / PRODUCT.md) before UI generation',
      'Structured critique & polish vocabulary instead of vague aesthetic prompts'
    ]
  },
  {
    id: 'nextlevelbuilder/ui-ux-pro-max-skill',
    repo: 'nextlevelbuilder/ui-ux-pro-max-skill',
    license: 'MIT',
    role: 'Searchable Design Intelligence Database',
    url: 'https://github.com/nextlevelbuilder/ui-ux-pro-max-skill',
    patternsAdopted: [
      'Platform-aware specs for iOS HIG, Material 3, React/Next.js, Tailwind, React Native, and Flutter',
      'Curated font pairings and domain-matched color systems',
      'UX ergonomics checklists across mobile and desktop viewports'
    ]
  },
  {
    id: 'google-labs-code/stitch-skills',
    repo: 'google-labs-code/stitch-skills',
    license: 'Apache-2.0',
    role: 'DESIGN.md Specification & Modular Code Architecture',
    url: 'https://github.com/google-labs-code/stitch-skills',
    patternsAdopted: [
      'Persistent DESIGN.md single source of truth (Atmosphere, Semantic Colors, Typography, Anti-Patterns)',
      'Modular component/hook/mock-data architecture',
      'Automated token & WCAG contrast verification'
    ]
  },
  {
    id: 'google-labs-code/design.md',
    repo: 'google-labs-code/design.md',
    license: 'Apache-2.0',
    role: 'Machine-Readable DESIGN.md Standard',
    url: 'https://github.com/google-labs-code/design.md',
    patternsAdopted: [
      'Declarative color roles with hex codes and contrast guarantees',
      'Explicit density, radius, and anti-pattern rules'
    ]
  },
  {
    id: 'anthropics/skills',
    repo: 'anthropics/skills (frontend-design)',
    role: 'Intentional Aesthetic Direction',
    url: 'https://github.com/anthropics/skills',
    patternsAdopted: [
      'Commit to one bold, cohesive aesthetic direction per project rather than blended averages',
      'Distinctive typography and spatial asymmetry'
    ]
  },
  {
    id: 'Vanszs/AntiSlopUI',
    repo: 'Vanszs/AntiSlopUI',
    role: 'Hard Negative Filter & State Coverage',
    url: 'https://github.com/Vanszs/AntiSlopUI',
    patternsAdopted: [
      'Ban list for cliché AI marketing copy ("Unlock the power", "Seamlessly", "Supercharge")',
      'Mandatory coverage of loading, empty, and error states alongside happy paths'
    ]
  },
  {
    id: '21st-dev/magic-mcp',
    repo: '21st-dev/magic-mcp',
    role: 'Composable Component Registry Inspiration',
    url: 'https://github.com/21st-dev/magic-mcp',
    patternsAdopted: [
      'Search-before-render component lookup and token-aligned adaptation'
    ]
  }
];

const ANTI_SLOP_BAN_LIST = {
  clicheColors: ['#6366f1', '#8b5cf6', '#a855f7', '#7c3aed', '#4f46e5', '#ec4899'],
  clicheFonts: ['inter', 'roboto', 'arial', 'system default only'],
  clicheCopyPhrases: [
    'unlock the power',
    'seamlessly integrate',
    'supercharge your workflow',
    'next-gen ai platform',
    'revolutionize your',
    'all-in-one solution',
    'elevate your experience',
    'lorem ipsum'
  ],
  structuralAntiPatterns: [
    'Three identical rounded-2xl feature cards with floating gradient icons and zero functional interaction',
    'Purple-to-pink or indigo-to-cyan decorative gradients behind body text',
    'Low-contrast grey text on translucent glassmorphism panels failing WCAG 4.5:1',
    'Cards nested inside cards inside cards with heavy drop shadows',
    'Static-only mockups missing loading, empty, and error states'
  ]
};

module.exports = {
  DESIGN_DIRECTIONS,
  PLATFORM_GUIDELINES,
  INTERACTIVE_STATES,
  GITHUB_ECOSYSTEM_REFERENCES,
  ANTI_SLOP_BAN_LIST
};
