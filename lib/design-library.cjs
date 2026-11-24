'use strict';

// Curated visual directions combining stitch-skills semantic color naming,
// Taste Skill v2.5 domain calibration, Impeccable craft-floor contrast rules,
// and dedicated warm-ivory + charcoal-amber directions.
const DESIGN_DIRECTIONS = [
  {
    id: 'atelier-warm-paper',
    name: 'Ateliê Warm Paper',
    mode: 'light',
    philosophy: 'Tactile warm ivory studio with calm editorial authority, Fraunces warmth, DM Sans clarity, and disciplined signal-orange focus.',
    domains: ['agent-os', 'chat-ai', 'workspace', 'creative', 'editorial', 'productivity'],
    density: 5,
    variance: 7,
    palette: {
      bg: '#F4F0E8',
      surface: '#FFFCF6',
      surfaceAlt: '#ECE7DC',
      border: '#D8D3C8',
      text: '#272821',
      muted: '#5C5D58',
      accent: '#FF7A1A',
      accentText: '#1F211D',
      linkAccent: '#8F3D00',
      success: '#2F6145',
      warning: '#8F3D00',
      danger: '#923C38'
    },
    paletteSemantics: {
      bg: 'Warm Ivory Paper — primary canvas reducing glare in long sessions',
      surface: 'Vellum Cream — reading cards, chat bubbles, and primary workspace sheets',
      surfaceAlt: 'Pressed Linen — recessed drawers, chips, and composer rails',
      border: 'Sandstone Hairline — subtle 1px structural containment without heavy shadows',
      text: 'Deep Olive Charcoal — primary ink with 13.09:1 contrast on ivory',
      muted: 'Muted Graphite Stone — metadata, timestamps, and secondary labels (>6:1)',
      accent: 'Signal Amber Orange — sole brand signature for primary CTAs and active selection',
      linkAccent: 'Burnt Sienna — WCAG-safe interactive text links on light paper (6.52:1)'
    },
    typography: {
      display: '"Fraunces", Georgia, serif',
      displayName: 'Fraunces',
      body: '"DM Sans", "Plus Jakarta Sans", system-ui, sans-serif',
      bodyName: 'DM Sans',
      mono: '"JetBrains Mono", ui-monospace, monospace',
      monoName: 'JetBrains Mono',
      googleFontsQuery: 'Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=DM+Sans:ital,opsz,wght@0,9..40,400..700;1,9..40,400&family=JetBrains+Mono:wght@400;500;600'
    },
    radius: { sm: '8px', md: '12px', lg: '20px', pill: '999px' },
    shadow: {
      sm: '0 1px 2px rgba(39, 40, 33, 0.05)',
      md: '0 14px 36px -14px rgba(39, 40, 33, 0.14)'
    }
  },
  {
    id: 'nucleo-obsidian-amber',
    name: 'Núcleo Warm Charcoal',
    mode: 'dark',
    philosophy: 'Calm obsidian-green charcoal paired with glowing ember-orange clarity and high-legibility parchment ink.',
    domains: ['agent-os', 'chat-ai', 'devtools', 'fintech', 'spatial', 'cockpit'],
    density: 6,
    variance: 7,
    palette: {
      bg: '#171A17',
      surface: '#232823',
      surfaceAlt: '#2D332D',
      border: '#3D443D',
      text: '#F4F0E8',
      muted: '#BBBDB4',
      accent: '#FF7A1A',
      accentText: '#1F211D',
      linkAccent: '#FFB782',
      success: '#A7CFAF',
      warning: '#FFB782',
      danger: '#E9AAA3'
    },
    paletteSemantics: {
      bg: 'Warm Obsidian Charcoal — glare-free nocturnal studio canvas (no pure #000)',
      surface: 'Forest Graphite — elevated containers and conversation cards',
      surfaceAlt: 'Smoked Slate — composer rail, nested panes, and spatial floor base',
      border: 'Moss Hairline — crisp 1px structural containment',
      text: 'Ivory Parchment — primary typography with 15.44:1 contrast',
      muted: 'Ash Stone — secondary metadata and timestamps (7.90:1)',
      accent: 'Signal Amber Orange — focal CTA and active workspace indicator',
      linkAccent: 'Warm Apricot — high-contrast dark-mode links and active pills'
    },
    typography: {
      display: '"Fraunces", Georgia, serif',
      displayName: 'Fraunces',
      body: '"DM Sans", "Plus Jakarta Sans", system-ui, sans-serif',
      bodyName: 'DM Sans',
      mono: '"JetBrains Mono", ui-monospace, monospace',
      monoName: 'JetBrains Mono',
      googleFontsQuery: 'Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=DM+Sans:ital,opsz,wght@0,9..40,400..700;1,9..40,400&family=JetBrains+Mono:wght@400;500;600'
    },
    radius: { sm: '8px', md: '12px', lg: '20px', pill: '999px' },
    shadow: {
      sm: '0 1px 2px rgba(0, 0, 0, 0.35)',
      md: '0 22px 48px -18px rgba(0, 0, 0, 0.58)'
    }
  },
  {
    id: 'swiss-editorial-warm',
    name: 'Swiss Editorial Warm',
    mode: 'light',
    philosophy: 'Architectural off-white canvas with crisp hairline grids, condensed display authority, and terracotta action focus.',
    domains: ['saas', 'enterprise', 'analytics', 'productivity', 'ecommerce', 'editorial'],
    density: 6,
    variance: 6,
    palette: {
      bg: '#F7F5F0',
      surface: '#FFFFFF',
      surfaceAlt: '#EFECE4',
      border: '#D9D4C7',
      text: '#141413',
      muted: '#595853',
      accent: '#B84327',
      accentText: '#FFFFFF',
      linkAccent: '#9A341B',
      success: '#17603D',
      warning: '#92510A',
      danger: '#A62323'
    },
    typography: {
      display: '"Instrument Serif", "Fraunces", Georgia, serif',
      displayName: 'Instrument Serif',
      body: '"Plus Jakarta Sans", system-ui, sans-serif',
      bodyName: 'Plus Jakarta Sans',
      mono: '"JetBrains Mono", ui-monospace, monospace',
      monoName: 'JetBrains Mono',
      googleFontsQuery: 'Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600'
    },
    radius: { sm: '6px', md: '10px', lg: '16px', pill: '999px' },
    shadow: {
      sm: '0 1px 2px rgba(20, 20, 19, 0.05)',
      md: '0 12px 32px -12px rgba(20, 20, 19, 0.12)'
    }
  },
  {
    id: 'obsidian-craft-studio',
    name: 'Obsidian Craft Studio',
    mode: 'dark',
    philosophy: 'Carbon-slate dark interface inspired by Linear and Raycast — zero purple neon, surgical emerald feedback, tabular precision.',
    domains: ['devtools', 'fintech', 'security', 'cockpit', 'music', 'media'],
    density: 7,
    variance: 6,
    palette: {
      bg: '#0E1012',
      surface: '#15181C',
      surfaceAlt: '#1D2127',
      border: '#2B313A',
      text: '#F3F5F7',
      muted: '#A3ABB8',
      accent: '#10B981',
      accentText: '#071A14',
      linkAccent: '#34D399',
      success: '#34D399',
      warning: '#FBBF24',
      danger: '#F87171'
    },
    typography: {
      display: '"Space Grotesk", system-ui, sans-serif',
      displayName: 'Space Grotesk',
      body: '"IBM Plex Sans", system-ui, sans-serif',
      bodyName: 'IBM Plex Sans',
      mono: '"JetBrains Mono", ui-monospace, monospace',
      monoName: 'JetBrains Mono',
      googleFontsQuery: 'Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600'
    },
    radius: { sm: '6px', md: '10px', lg: '14px', pill: '999px' },
    shadow: {
      sm: '0 1px 2px rgba(0, 0, 0, 0.35)',
      md: '0 20px 44px -16px rgba(0, 0, 0, 0.65)'
    }
  },
  {
    id: 'atelier-sage-ledger',
    name: 'Atelier Sage & Graphite',
    mode: 'light',
    philosophy: 'Calm daylight ergonomics engineered for healthcare, clinical intake, finance, and high-trust operational flows.',
    domains: ['healthcare', 'fintech', 'education', 'legal', 'operations'],
    density: 5,
    variance: 5,
    palette: {
      bg: '#F4F6F4',
      surface: '#FFFFFF',
      surfaceAlt: '#E7ECE8',
      border: '#CBD4CE',
      text: '#132019',
      muted: '#4A5D52',
      accent: '#1B5E4A',
      accentText: '#FFFFFF',
      linkAccent: '#144D3C',
      success: '#17603D',
      warning: '#9A5B0A',
      danger: '#B3261E'
    },
    typography: {
      display: '"Plus Jakarta Sans", system-ui, sans-serif',
      displayName: 'Plus Jakarta Sans',
      body: '"DM Sans", system-ui, sans-serif',
      bodyName: 'DM Sans',
      mono: '"JetBrains Mono", ui-monospace, monospace',
      monoName: 'JetBrains Mono',
      googleFontsQuery: 'Plus+Jakarta+Sans:wght@500;600;700&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600'
    },
    radius: { sm: '8px', md: '12px', lg: '18px', pill: '999px' },
    shadow: {
      sm: '0 1px 3px rgba(19, 32, 25, 0.06)',
      md: '0 14px 36px -14px rgba(19, 32, 25, 0.14)'
    }
  },
  {
    id: 'kinetic-crimson-stage',
    name: 'Kinetic Crimson Stage',
    mode: 'dark',
    philosophy: 'High-contrast expressive stage with crisp charcoal blocks, asymmetric editorial hierarchy, and signal-crimson focal triggers.',
    domains: ['social', 'creator', 'sports', 'events', 'marketplace', 'gaming'],
    density: 6,
    variance: 8,
    palette: {
      bg: '#121214',
      surface: '#19191D',
      surfaceAlt: '#232329',
      border: '#32323B',
      text: '#FAF9F6',
      muted: '#B2B0BA',
      accent: '#FF4D4D',
      accentText: '#140808',
      linkAccent: '#FF7575',
      success: '#4ADE80',
      warning: '#FACC15',
      danger: '#FB7185'
    },
    typography: {
      display: '"Syne", system-ui, sans-serif',
      displayName: 'Syne',
      body: '"Manrope", system-ui, sans-serif',
      bodyName: 'Manrope',
      mono: '"JetBrains Mono", ui-monospace, monospace',
      monoName: 'JetBrains Mono',
      googleFontsQuery: 'Syne:wght@600;700;800&family=Manrope:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500'
    },
    radius: { sm: '6px', md: '12px', lg: '18px', pill: '999px' },
    shadow: {
      sm: '0 2px 6px rgba(0, 0, 0, 0.45)',
      md: '0 22px 48px -18px rgba(0, 0, 0, 0.72)'
    }
  },
  {
    id: 'nordic-cerulean-desk',
    name: 'Nordic Cerulean Desk',
    mode: 'light',
    philosophy: 'Crisp studio daylight palette tailored for banking, travel booking, and complex multi-column tables.',
    domains: ['travel', 'banking', 'logistics', 'b2b', 'saas'],
    density: 7,
    variance: 5,
    palette: {
      bg: '#F2F5F9',
      surface: '#FFFFFF',
      surfaceAlt: '#E6ECF3',
      border: '#C9D3DF',
      text: '#0F1B2D',
      muted: '#495A72',
      accent: '#0E5CAD',
      accentText: '#FFFFFF',
      linkAccent: '#0B498A',
      success: '#146C43',
      warning: '#9A5B0A',
      danger: '#B42318'
    },
    typography: {
      display: '"Space Grotesk", system-ui, sans-serif',
      displayName: 'Space Grotesk',
      body: '"Manrope", system-ui, sans-serif',
      bodyName: 'Manrope',
      mono: '"JetBrains Mono", ui-monospace, monospace',
      monoName: 'JetBrains Mono',
      googleFontsQuery: 'Space+Grotesk:wght@500;600;700&family=Manrope:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500'
    },
    radius: { sm: '6px', md: '10px', lg: '16px', pill: '999px' },
    shadow: {
      sm: '0 1px 2px rgba(15, 27, 45, 0.05)',
      md: '0 14px 32px -12px rgba(15, 27, 45, 0.14)'
    }
  },
  {
    id: 'bento-amber-atelier',
    name: 'Amber Night Atelier',
    mode: 'dark',
    philosophy: 'Warm graphite night workspace with zero cold-blue glare, warm amber contrast, and craft-studio typography.',
    domains: ['ai-workspace', 'notes', 'research', 'video', 'audio', 'ecommerce'],
    density: 5,
    variance: 7,
    palette: {
      bg: '#161412',
      surface: '#1F1C19',
      surfaceAlt: '#2B2622',
      border: '#3E3630',
      text: '#FAF6F0',
      muted: '#BEB5AB',
      accent: '#E07A22',
      accentText: '#140D05',
      linkAccent: '#F39A4A',
      success: '#4ADE80',
      warning: '#FBBF24',
      danger: '#F87171'
    },
    typography: {
      display: '"Fraunces", Georgia, serif',
      displayName: 'Fraunces',
      body: '"Plus Jakarta Sans", system-ui, sans-serif',
      bodyName: 'Plus Jakarta Sans',
      mono: '"JetBrains Mono", ui-monospace, monospace',
      monoName: 'JetBrains Mono',
      googleFontsQuery: 'Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500'
    },
    radius: { sm: '8px', md: '14px', lg: '20px', pill: '999px' },
    shadow: {
      sm: '0 2px 6px rgba(0, 0, 0, 0.4)',
      md: '0 20px 44px -16px rgba(0, 0, 0, 0.7)'
    }
  }
];

function buildGoogleFontsLinks(typography) {
  const query = typography && typography.googleFontsQuery
    ? typography.googleFontsQuery
    : 'Fraunces:opsz,wght@9..144,500;9..144,600&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500';
  return [
    '<link rel="preconnect" href="https://fonts.googleapis.com" />',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />',
    `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=${query}&display=swap" />`
  ].join('\n  ');
}

const PLATFORM_GUIDELINES = {
  mobile: {
    id: 'mobile',
    label: 'Mobile (iOS + Android)',
    viewport: '390x844',
    touchTargetMinPx: 44,
    navigationPattern: 'Fixed 3-5 item thumb-zone bottom bar + multi-detent slide-up sheets for details and approvals',
    typographyScale: { h1: '26px', h2: '19px', body: '15px', caption: '12px' },
    ergonomics: [
      'Bottom-anchored primary actions & chat composers inside natural thumb reach',
      'Zero horizontal overflow at 390px; multi-column desktop grids fold into clean vertical flows',
      'Swipe/dismissable bottom sheets replace centered blocking dialogs',
      'At least 44x44px hit targets with 8px+ separation between adjacent controls'
    ]
  },
  desktop: {
    id: 'desktop',
    label: 'Desktop / Web App',
    viewport: '1440x900',
    touchTargetMinPx: 32,
    navigationPattern: 'Collapsible 236px spatial left rail + Cmd/Ctrl+K command palette + 1-click primary workspace toggle',
    typographyScale: { h1: '32px', h2: '20px', body: '15px', caption: '12px' },
    ergonomics: [
      'Intentional spatial hierarchy: conversation / 2.5D spatial map / split artifact studio match the real task',
      'Keyboard-first accelerators (Ctrl/Cmd+K, Esc, Enter-to-send) with tactile keycap styling',
      'Hairline 1px containment over heavy blurred shadows; tabular-nums on metrics and logs',
      'Browser surfaces themed cleanly (custom scrollbars, selection tint, visible focus rings)'
    ]
  }
};

const INTERACTIVE_STATES = ['populated', 'loading', 'empty', 'error'];

const GITHUB_ECOSYSTEM_REFERENCES = [
  {
    name: 'Impeccable',
    repo: 'pbakaus/impeccable',
    license: 'Apache-2.0',
    category: 'anti-slop-skill',
    platforms: ['web', 'ios', 'android'],
    strengths: [
      '62 deterministic anti-slop rules + 24 UX steering commands (bolder, quieter, distill, polish, harden)',
      'Craft floor: verify contrast >=4.5:1, browser surface theming, unified SVG icons, non-generic page scaffolds',
      'Nielsen 10 usability heuristics & Miller working-memory limits (<=4 simultaneous items per decision group)'
    ],
    url: 'https://github.com/pbakaus/impeccable',
    rawPaths: ['.agent/skills/impeccable/SKILL.md', '.agent/skills/impeccable/reference/craft-floor.md', '.agent/skills/impeccable/reference/critique-rubric.md']
  },
  {
    name: 'UX/UI Skills',
    repo: 'taylorwinfield/ux-ui-skills',
    license: 'MIT',
    category: 'workflow-grounding',
    platforms: ['web', 'mobile'],
    strengths: [
      'Bootstraps design context before generating screens when repository tokens and interaction rules are missing',
      'Separates grounding, state design, hierarchy, interaction craft, copy precision, and audit into reusable agent skills'
    ],
    url: 'https://github.com/taylorwinfield/ux-ui-skills'
  },
  {
    name: 'UI UX Kit',
    repo: 'arham777/ui-ux-kit',
    license: 'MIT',
    category: 'taste-routing',
    platforms: ['web', 'mobile'],
    strengths: [
      'Routes different product surfaces to distinct design rules instead of one universal page template',
      'Turns vague anti-slop feedback into explicit design-system constraints and review checks'
    ],
    url: 'https://github.com/arham777/ui-ux-kit'
  },
  {
    name: 'Universal UI Skills',
    repo: 'thakur698/universal-ui-skills',
    license: 'MIT',
    category: 'visual-qa',
    platforms: ['web', 'mobile'],
    strengths: [
      'Combines direction, design systems, motion, responsive behavior, accessibility, assets, and visual QA',
      'Publishes comparative benchmark methodology; treat author-reported scores as claims, not independent validation'
    ],
    url: 'https://github.com/thakur698/universal-ui-skills'
  },
  {
    name: 'Frontend Visual QA',
    repo: 'ytvee-dev/webdev-agent-kit',
    license: 'MIT',
    category: 'rendered-visual-qa',
    platforms: ['web', 'mobile'],
    strengths: [
      'Checks rendered screenshots, responsive overflow, clipping, and visible interaction states against a design spec',
      'Uses bounded repair loops and requires browser evidence when visual acceptance matters'
    ],
    url: 'https://github.com/ytvee-dev/webdev-agent-kit/tree/main/skills/frontend-visual-qa'
  },
  {
    name: 'Design Taste',
    repo: 'linkxzhou/design-taste',
    license: 'MIT',
    category: 'visual-audit',
    platforms: ['web', 'mobile'],
    strengths: [
      'Pairs screenshot-based desktop/mobile review with explicit visual metrics and a report scaffold',
      'Treats benchmark scores as comparative heuristics; visual taste still needs human review'
    ],
    url: 'https://github.com/linkxzhou/design-taste'
  },
  {
    name: 'Three.js Product Skills',
    repo: 'ahmettasdemirusa/threejs-product-skills',
    license: 'MIT',
    category: '3d-product-experience',
    platforms: ['web', 'mobile'],
    strengths: [
      'Reusable skills and templates for product viewers, configurators, glTF optimization, AR, and turntables',
      'Use progressive enhancement and a non-WebGL fallback when 3D is not essential or the device cannot render it'
    ],
    url: 'https://github.com/ahmettasdemirusa/threejs-product-skills'
  },
  {
    name: 'Nimbus Configurator',
    repo: 'malzinger/nimbus-configurator',
    license: 'MIT',
    category: '3d-product-configurator',
    platforms: ['web', 'mobile'],
    strengths: [
      'Procedural headphone model, live finish changes, shareable configuration state, and generated product imagery',
      'Useful example of pairing an authored glTF model with a procedural fallback'
    ],
    url: 'https://github.com/malzinger/nimbus-configurator'
  },
  {
    name: 'Sona One Headphone Experience',
    repo: 'igrehanali/sona-one',
    license: 'MIT',
    category: '3d-storytelling-reference',
    platforms: ['web', 'mobile'],
    strengths: [
      'Product-specific geometry and material craft, scroll-linked scenes, and a real-time configurator',
      'Explains mobile/GPU tiers and reduced-motion behavior; use as a technical reference, not a guaranteed visual recipe'
    ],
    url: 'https://github.com/igrehanali/sona-one'
  },
  {
    name: 'Taste Skill',
    repo: 'Leonxlnx/taste-skill',
    license: 'MIT',
    category: 'design-skill',
    platforms: ['web', 'mobile'],
    strengths: [
      'Shows the product real UI & spatial diagrams inline instead of fake KPI cards',
      'Strict copy linting + 11 non-cliché layout archetypes + single-screen vertical discipline',
      'Real headless browser consistency audit across 1440/1024/768/390px viewports'
    ],
    url: 'https://github.com/Leonxlnx/taste-skill',
    rawPaths: ['skills/taste-skill/SKILL.md', 'skills/taste-skill/library/palettes.json', 'skills/taste-skill/references/diagrams.md']
  },
  {
    name: 'Google Stitch Skills',
    repo: 'google-labs-code/stitch-skills',
    license: 'Apache-2.0',
    category: 'design-md-workflow',
    platforms: ['web', 'mobile', 'react', 'react-native'],
    strengths: [
      'DESIGN.md semantic contract naming colors by character + hex + functional role',
      'Taste-design constraints banning AI purple/neon gradients, Inter defaults, and symmetrical SaaS clones',
      'Screen-to-React & React Native component conversion with visual validation'
    ],
    url: 'https://github.com/google-labs-code/stitch-skills',
    rawPaths: ['plugins/stitch-utilities/skills/design-md/SKILL.md', 'plugins/stitch-utilities/skills/taste-design/SKILL.md']
  },
  {
    name: 'UI UX Pro Max Skill',
    repo: 'nextlevelbuilder/ui-ux-pro-max-skill',
    license: 'MIT',
    category: 'design-intelligence',
    platforms: ['web', 'ios', 'android', 'react-native', 'flutter'],
    strengths: [
      '194 industry reasoning rules pairing product domain -> style -> palette -> anti-patterns',
      'Vector-only 24px 1.75px icon discipline (never emojis as navigation icons) & 44pt/48dp mobile hit targets',
      'Stable interaction transitions (no layout-shifting hover jitter)'
    ],
    url: 'https://github.com/nextlevelbuilder/ui-ux-pro-max-skill',
    rawPaths: ['.claude/skills/ui-ux-pro-max/SKILL.md', '.claude/skills/ui-ux-pro-max/references/pro-rules.md']
  },
  {
    name: '21st.dev Magic MCP',
    repo: '21st-dev/magic-mcp',
    license: 'MIT',
    category: 'component-mcp',
    platforms: ['react', 'tailwind', 'web'],
    strengths: [
      'Curated registry of high-craft interactive React/Tailwind blocks, command palettes, and motion components',
      'Logo search & live component inspiration lookup for coding agents'
    ],
    url: 'https://github.com/21st-dev/magic-mcp',
    rawPaths: ['README.md']
  },
  {
    name: 'shadcn/ui',
    repo: 'shadcn-ui/ui',
    license: 'MIT',
    category: 'design-system',
    platforms: ['web', 'react'],
    strengths: ['Accessible Radix primitives with copy-owned Tailwind CSS variable tokens'],
    url: 'https://github.com/shadcn-ui/ui'
  },
  {
    name: 'Magic UI',
    repo: 'magicuidesign/magicui',
    license: 'MIT',
    category: 'micro-interactions',
    platforms: ['web', 'react'],
    strengths: ['Restrained hardware-accelerated micro-interactions, bento surfaces, and subtle beam accents'],
    url: 'https://github.com/magicuidesign/magicui'
  },
  {
    name: 'React Native Paper & Tamagui',
    repo: 'tamagui/tamagui',
    license: 'MIT',
    category: 'mobile-ui-kit',
    platforms: ['ios', 'android', 'web', 'react-native'],
    strengths: ['Universal compiler and adaptive token engine bridging mobile native + desktop web'],
    url: 'https://github.com/tamagui/tamagui'
  }
];

const ANTI_SLOP_BAN_LIST = [
  'Do NOT default to purple/indigo gradient blobs (#6366f1 / #8b5cf6 / #a855f7) on white or black.',
  'Do NOT use generic fallback typography (Inter / Arial / system-ui) for brand/display headings — always load curated Google Fonts.',
  'Do NOT force every screen into a generic 3-KPI-card + list CRUD template — match screen archetypes (chat, spatial 2.5D/3D, split sandbox, routines, fintech cockpit, editorial commerce) to what the product actually does.',
  'Do NOT render developer QA toggles (populated/loading/empty/error pills) inside the app chrome — keep QA controls strictly in the Studio Workbench / postMessage harness.',
  'Do NOT use emojis as structural navigation/action icons — use a unified 24px SVG stroke family.',
  'Do NOT output generic AI copywriting clichés ("Elevate", "Seamless", "Unleash", "Next-Gen", "All-in-one solution").',
  'Do NOT leave any control dead: buttons, composers, tabs, toggles, drawers, and inspectors must react immediately.'
];

module.exports = {
  DESIGN_DIRECTIONS,
  PLATFORM_GUIDELINES,
  INTERACTIVE_STATES,
  GITHUB_ECOSYSTEM_REFERENCES,
  ANTI_SLOP_BAN_LIST,
  buildGoogleFontsLinks
};
