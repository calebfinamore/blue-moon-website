<!-- Copilot / AI agent instructions for the Blue Moon website (static site) -->
# Repo intent

This is a small, static promotional website for "Blue Moon on Butler" (plain HTML, CSS, vanilla JS). There is no build system, package manager, or test harness — the site runs by opening `index.html` in a browser. Keep changes minimal and focused; prefer small, clearly-tested edits.

# Big-picture architecture

- Files: content and behavior are co-located in `index.html`, styles in `css/style.css`, and logic in `js/script.js`.
- No server-side code. External integrations are embedded iframes (Google Calendar) and links (Instagram, `tel:`). Fonts and images live under `fonts/` and `images/`.

# Key patterns & where to change things

- Hours / open/closed logic: edit the `barHours` array in `js/script.js` (top of the file). This array uses 24-hour integers and encodes cross-midnight closes (e.g., `open:17, close:2`). Preserve the existing cross-midnight handling when changing values.

Example:
```js
// in js/script.js
const barHours = [ { day:0, open:17, close:2 }, { day:1, open:null, close:null }, ... ];
```

- Accessibility toggle: the button in `index.html` toggles the CSS class `access-mode` on `<body>`. `css/style.css` defines variable overrides under `body.access-mode`. Use this pattern rather than adding inline styles.

- Visual theme and typography are driven by CSS variables in `css/style.css` (`:root`). To change the site's look, update variables like `--bg-color`, `--content-bg`, and `--h1-font` rather than many individual rules.

- Embedded content: the calendar iframe is in `index.html`. Do not hard-remove these embeds; if modifying, keep responsive container `.iframe-wrapper` in `css/style.css` so iframes remain responsive.

# Conventions and constraints for edits

- Keep the site static — do not introduce build tooling or node dependencies without discussing the change first.
- Prefer edits that are reversible and small. Because there are no automated tests, verify changes by opening `index.html` locally in a browser and using DevTools.
- When updating the business hours logic, ensure you retain the "previous day late-night" logic (the code that treats e.g. 1AM as previous day's shift).

# Debugging and manual test steps

- Quick run: open `index.html` in a modern browser (Chrome/Edge/Firefox). Use DevTools Console to inspect `updateStatus()` output and to simulate times by temporarily setting `const now = new Date(/* custom timestamp */)` near the top of `updateStatus()`.
- To test the access-mode styles, click the top-right toggle button or manually add `class="access-mode"` to `<body>`.

# External integration notes

- Google Calendar iframe: embedded `src` in `index.html` — updating the calendar URL is allowed but keep the iframe inside `.iframe-wrapper`.
- Fonts are local: `fonts/Bitmgothic/Bitmgothic.woff`. If substituting fonts, update `@font-face` and ensure path correctness.

# Guidance for AI edits

- Be explicit in commit messages about intent (e.g., "Update business hours to open Tues-Sun 17-02").
- Avoid changing layout semantics (e.g., removing the `.container` wrapper) unless implementing a layout refactor with explicit QA steps.
- If you refactor `js/script.js`, preserve `updateStatus()` behavior and keep the `barHours` shape; include unit-like comments or a small test harness (temporary code that logs status for sample timestamps) and remove it before final commit.

# Files to reference

- `index.html` — main markup, embeds, and entry script include.
- `js/script.js` — business hours logic, accessibility toggle behavior.
- `css/style.css` — variables, access-mode overrides, responsive iframe wrapper.
- `fonts/Bitmgothic/Bitmgothic.woff` and `images/` — static assets.

---
If any section is unclear or you'd like me to add quick test snippets (for example, a small snippet to simulate times for `updateStatus()`), tell me which area to expand and I'll iterate. 
