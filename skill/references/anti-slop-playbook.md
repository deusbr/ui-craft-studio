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
