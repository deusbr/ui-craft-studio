# Anti-AI-Slop Design Playbook (`ui-craft-studio`)

## 1. Banned "AI Slop" Fingerprints
- **Cliché Colors:** Never default to `#6366f1`, `#8b5cf6`, `#a855f7`, or purple-to-pink gradients behind body text.
- **Generic Fonts:** Avoid Inter-only or Roboto-only displays. Pair expressive display faces (`Space Grotesk`, `Fraunces`, `Instrument Serif`, `Syne`, `Outfit`, `Playfair Display`) with readable body and monospace numerals.
- **Cliché Copy:** Ban *"Unlock the power"*, *"Seamlessly integrate"*, *"Supercharge your workflow"*, and *"Lorem ipsum"*.
- **Static-Only Mockups:** Every generated design must provide linked multi-screen flows plus `populated`, `loading`, `empty`, and `error` states.

## 2. WCAG 2.1 Contrast Math
- Normal text (`--text` on `--bg`, `--text` on `--surface`, `--muted` on `--surface`, `--accent-text` on `--accent`) must achieve `>= 4.5:1` AA contrast ratio.

## 3. Mobile vs. Desktop Ergonomics
- **Mobile (`390x844`):** Bottom tab bar in thumb-zone, `>= 44x44px` touch targets, safe-area inset padding, progressive disclosure sheets.
- **Desktop (`1440x900`):** Persistent collapsible sidebar/rail, `Ctrl/Cmd+K` command palette, inline split-pane master-detail, crisp `:focus-visible` keyboard rings.

## 4. Product Grounding Before Visual Style
- Start with the user's primary job, key workflows, domain objects, constraints, and existing terminology. Cite the repository screen/component or brief that supports each design decision; label assumptions.
- Choose a screen archetype per workflow. Chat, orchestration, spatial office, sandbox/review, calendar, and data cockpit need different hierarchy and interaction models. Do not turn every product into a dashboard of equal-weight cards.
- Make interface critique actionable: identify the first task the eye sees, the next action, recovery paths, and which decoration can be removed without loss.
- Every visible control needs a coherent response. Validate populated/loading/empty/error states, keyboard and focus behavior, reduced-motion preference, and mobile safe areas/touch targets.
- Anti-slop heuristics should flag patterns for review, not automatically dictate a visual style. A serif font, card, gradient, or badge can be appropriate when tied to product evidence.

## 5. Research Inputs and Evidence Quality
- Google Stitch's official overview describes a design canvas that supports iteration, collaboration, and portable `DESIGN.md` rules: https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-ai-ui-design/. Use this as workflow inspiration, not as proof that generated output is production-ready.
- Reusable agent workflows worth evaluating: `taylorwinfield/ux-ui-skills` (context grounding and state/hierarchy skills), `arham777/ui-ux-kit` (surface-specific design routing), `thakur698/universal-ui-skills` (responsive/accessibility/visual QA), and `pbakaus/impeccable` (critique and polish heuristics). Check current license and repository maintenance before adopting code.
- Community feedback on Reddit repeatedly criticizes uniform card grids, generic typography, arbitrary badges, and polished screens lacking clear user jobs. Treat this as qualitative warning evidence, never as usability research or a substitute for testing with users.
- Apple HIG emphasizes hierarchy, progressive disclosure, adaptable layouts, safe areas, and testing small/large layouts: https://developer.apple.com/design/human-interface-guidelines/layout. Its design principles also call for feedback and accessibility from the start: https://developer.apple.com/design/human-interface-guidelines/design-principles/.
- For browser-rendered work, explore screenshot-based QA such as `ytvee-dev/webdev-agent-kit` and `linkxzhou/design-taste`. Prefer checks that reveal overflow, clipping, keyboard/focus issues, and state behavior over a single subjective “taste score.”
- Designers in Reddit discussions describe AI as more useful for grounded prototyping and iteration than for replacing user research or design judgment. Make prototypes interactive so reviewers can assess behavior; a flattened mockup is insufficient for interaction critique.

## 6. Rich Front-End Capabilities (Use When the Product Benefits)
- **3D product viewing/configuration:** For products whose shape, finish, scale, or assembly affects purchase decisions, offer an interactive 3D viewer or configurator. Three.js `GLTFLoader` supports glTF assets; `OrbitControls` provides constrained orbit/zoom/pan. Keep controls discoverable and provide a static poster/fallback for reduced capability or failed WebGL. Sources: https://threejs.org/docs/pages/GLTFLoader.html and https://threejs.org/docs/pages/OrbitControls.html.
- **Product-specific precedent:** `malzinger/nimbus-configurator` demonstrates procedural headphone geometry, finish changes, shareable configuration state, and a glTF/procedural fallback. `ahmettasdemirusa/threejs-product-skills` packages viewer/configurator/optimization workflows. Study and adapt patterns; do not imply an app has a production 3D asset when none was supplied.
- **Motion:** Use motion to communicate cause and effect, state transitions, depth, and product material. Avoid perpetual animation when idle. Respect `prefers-reduced-motion`; Motion for React documents a dedicated reduced-motion hook and adaptation: https://motion.dev/docs/react-use-reduced-motion.
- **Charts:** Add charts only when the product domain includes meaningful quantitative data. Use labeled axes, units, readable comparison baselines, responsive layouts, and explicit sample/demo data labels. Never fabricate business KPIs to make a screen look populated.
- **Performance and progressive enhancement:** Keep 3D as a justified feature, not a default decoration. Consider model weight, mobile GPU cost, keyboard/touch interaction, load state, and poster fallback before accepting it into a design.

## 7. Award-Level Art Direction Without Award-Site Cloning
- Case studies of Awwwards work point to a recurring principle more reliably than any single visual trend: one concept carried through the whole experience, a technique chosen because it fits the subject, and deliberate restraint. 3D and scroll effects are optional; successful work can win through typography or layout alone. Reference: https://exhibita.design/casefiles.html.
- The 2025 Lando Norris Site of the Year case study describes an energy-led full-screen opening, camera movement tied to the story, bold type, and a 3D helmet that fits the subject. It also notes performance and mobile adaptation as core parts of the work, not polish added later: https://github.com/INSANE0777/awwwards-website-skill/blob/main/references/case-studies.md.
- Product pages should use rich media as controlled inspection tools. Baymard's product-page research covers multiple product image types, gallery thumbnails/zoom, and controllable video/360 views: https://baymard.com/research/product-page. For the headphone concept, improve the existing viewer with purposeful camera angles, pause/resume, finish transitions, material close-ups, and a mobile poster fallback.
- A useful production precedent for headphone geometry describes a swept superellipse headband, lathed ear cups, tube yokes, named components, and realism from studio lighting/materials rather than polygon count: https://github.com/igrehanali/sona-one. This is a technique reference, not independent award verification.
- Translate the research into a short creative thesis before layout: (1) the product truth, (2) the visual metaphor, (3) the signature interaction, (4) the typography/material palette, (5) how mobile gets an equivalent experience, and (6) performance/reduced-motion fallback. Reject a direction when removing its effects leaves a generic template.
- Avoid score-chasing. A case-study skill reports claimed judge weights, but those numbers are not a universal standard. Review concepts qualitatively for originality, coherence, usability, content, accessibility, and implementation quality; label claims as attributed when sourced from a studio or secondary case study.
