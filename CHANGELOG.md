# Changelog

All notable changes to `ui-craft-studio` are documented in this file.

## [1.0.0] - 2026-11-23

### Added
- **Codebase-First Scanner (`lib/project-scanner.cjs`):** Inspects target repositories (`Next.js`, `React`, `Vite`, `Expo / React Native`, `Flutter`, `Electron`, `Tauri`, `Tailwind CSS`, `shadcn/ui`) for frameworks, CSS tokens, fonts, existing `DESIGN.md`, routes, and components prior to designing.
- **Anti-AI-Slop Design Intelligence (`lib/design-library.cjs`):** 6 WCAG-verified visual directions (*Obsidian Precision*, *Swiss Editorial*, *Nordic Clinical Sage*, *Cobalt Atelier*, *Nocturnal Studio*, *Warm Ochre Craft*), expressive font pairings, iOS HIG / Material 3 & Desktop guidelines, and integrated open-source GitHub patterns (`pbakaus/impeccable`, `nextlevelbuilder/ui-ux-pro-max-skill`, `google-labs-code/stitch-skills`, `Vanszs/AntiSlopUI`).
- **Hybrid Pattern Research (`lib/craft-research.cjs`):** Combines curated design library search with live GitHub repository search and Wikipedia lookup (with 24h local cache).
- **Interactive Multi-Screen & Multi-State Prototype Builder (`lib/prototype-builder.cjs`):** Generates `DESIGN.md`, clickable HTML/CSS/JS prototypes (`populated`, `loading`, `empty`, `error` states, `Ctrl+K` command palette, inline search/filtering, Mobile `390px` thumb-zone & Desktop `1440px` sidebar layouts), plus `tokens.css`, `React + Tailwind`, and `React Native` shells.
- **Deterministic Slop & WCAG AA Auditor (`lib/anti-slop-auditor.cjs`):** Computes exact WCAG 2.1 contrast ratios and flags cliché indigo/purple gradients, Inter-only displays, AI marketing buzzwords, and incomplete interactive states.
- **MCP Server, CLI, Multi-Viewport Web Workbench & Skill:** 10 MCP tools (`NDJSON` + `Content-Length`), 4 Resources, 2 Prompts, Split Mobile+PC live preview workbench on port `4322`, and automated installers for Codex, Gemini CLI, Claude Code, and Claude Desktop.
