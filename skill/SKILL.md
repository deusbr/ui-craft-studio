---
name: ui-craft-studio
description: 6-specialist Anti-AI-Slop UI/UX & Interactive App Design Studio MCP for Mobile and Desktop/Web. Always inspects the target codebase first, researches open-source GitHub design skills & patterns, compiles DESIGN.md + clickable multi-screen/multi-state HTML prototypes + React/React Native code, and enforces WCAG AA & Anti-Slop audits.
---

# UI Craft Studio — Codebase-First Anti-AI-Slop App Design Workflow

Operate as a coordinated **6-specialist UI/UX & product engineering studio**. Never produce generic purple-gradient "AI slop" or static dead mockups.

## Mandatory 4-Step Workflow

1. **Study the Project First (`design_inspect_project`):**
   - Always scan `projectPath` before designing anything to detect real frameworks (`Next.js`, `React`, `Expo / React Native`, `Flutter`, `Electron`, `Tauri`), CSS tokens, existing `DESIGN.md`, routes, and components.
   - Build a product evidence brief before choosing a visual direction: users, primary job, top workflows, domain objects, existing terminology, constraints, and the evidence for each inference. Mark unknowns; never invent analytics or user behavior.
   - If the repository has meaningful UI, inspect actual screens and components. A filename/framework scan alone is not enough; read implementation details and existing screenshots when available.
2. **Research Open-Source Patterns (`design_research_patterns`):**
   - Query domain patterns, mobile/desktop ergonomics, and GitHub design ecosystems (`pbakaus/impeccable`, `nextlevelbuilder/ui-ux-pro-max-skill`, `google-labs-code/stitch-skills`, `Vanszs/AntiSlopUI`).
   - Research patterns for the product's key workflow, not just visual inspiration. Record source URLs and what was adopted or rejected. Prefer official platform guidance and maintained repositories; social posts are qualitative signals, not proof of usability.
3. **Synthesize Unique Interactive Design (`design_create_prototype` / `design_regenerate_variant`):**
   - Pass bespoke `customScreens`, `customMetrics`, and `customRecords` derived from the user's real product domain so every generation is distinct.
   - Deliver **all 4 mandatory interactive states** (`populated`, `loading`, `empty`, `error`), multi-screen navigation, `Ctrl+K` command palette, and responsive Mobile (`390px` thumb-zone) + Desktop (`1440px` sidebar/workspace) layouts.
   - Start with the primary task and information hierarchy. Use distinct screen archetypes when workflows call for them; do not force every product into metric-card dashboards, repeated rounded panels, arbitrary badges, or marketing heroes.
   - Make every visible control perform a coherent action. Use domain vocabulary and realistic records. Use charts, timelines, maps, or spatial views when they clarify the task; do not use decorative placeholders in their place.
   - Tie the visual concept to product evidence, brand assets, or domain-specific references. Choose a deliberate type scale, spacing rhythm, surface count, and communicative motion. Anti-slop rules are guardrails, not a mandate for serif fonts or a ban on cards.
   - Before rendering, state one creative thesis in the design spec: a memorable concept, why it belongs to this product, its signature interaction, and the restraint rules that keep it usable. Do not mix unrelated aesthetics or copy a single award-winning site wholesale.
   - Consume the pipeline's `creativeDirection` object and translate its concept, chapter sequence, signature visual, interaction contract, asset policy, and performance contract into the actual first viewport and page structure. A thesis that appears only in `DESIGN.md` is not implemented.
   - For product sites, use the product-specific story mode (`product-story` for audio, `brand-story` for other product launches) instead of an app dashboard shell. If the required real model or imagery is missing, expose a clearly labeled concept-asset state and request/source the proper asset; do not silently treat generic procedural geometry as a finished product model.
   - Treat award-winning case studies as evidence of craft principles (recognizable visual thesis, purposeful interaction, narrative progression, responsive/performance fallbacks), not as layouts to copy. Record which principle each reference informed.
   - For an object-led commerce experience, make the object the art direction: model/asset quality, studio lighting, materials, scale, and camera framing matter more than decorative UI. If no source model exists, label procedural geometry as a concept model and design a compelling fallback image state.
4. **Audit & Export (`design_audit_anti_slop`, `design_export_to_project`):**
   - Verify `verdict: "pass"` (`overallScore >= 8`, WCAG 2.1 AA >= `4.5:1`, zero cliché purple hexes or hype copy) before delivering or exporting `DESIGN.md` and tokens.

   - Critique each screen against its stated user job. Check glance hierarchy, safe areas and tap targets, keyboard/focus behavior, reduced motion, empty/error recovery, and whether screens feel meaningfully distinct.
   - A numeric audit is not proof of good design. Include rationale and assumptions; never claim user validation unless real users tested it.
   - Evaluate the creative thesis at desktop and mobile. Prefer one signature interaction over many unrelated effects; offer pause/stop for non-essential continuous motion and keep reduced-motion and low-GPU fallbacks.

See [`references/anti-slop-playbook.md`](references/anti-slop-playbook.md) for contrast math, mobile HIG/M3 rules, desktop density, and banned AI-slop patterns.
