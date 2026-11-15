# WEBSITE DESIGN SYSTEM & TOKEN SPECIFICATION
## GlyphPad Design Language

### 1. Color Palette

```css
:root {
  /* Surfaces */
  --bg-primary: #08090a;
  --bg-secondary: #0f1113;
  --bg-card: rgba(20, 23, 26, 0.75);
  --bg-card-elevated: rgba(30, 35, 40, 0.85);
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-active: rgba(255, 255, 255, 0.22);

  /* Typography */
  --text-primary: #f5f6f8;
  --text-secondary: #9da3af;
  --text-muted: #5e6573;

  /* Accents */
  --accent-red: #eb0029;
  --accent-red-hover: #ff2a4b;
  --accent-green: #00e575;
  --accent-cyan: #00d2ff;
  --accent-violet: #a855f7;
  --accent-amber: #f59e0b;
}
```

### 2. Typography Hierarchy

1. **Display / LED Dot-Matrix:**
   - Used for key metrics, pairing codes, latency readouts, and signature product titles.
   - Characterized by uppercase letter spacing (`tracking-widest`), mono geometry, and dotted grid styling.
2. **Headings:**
   - Modern geometric sans-serif (Inter / Plus Jakarta Sans / Space Grotesk).
   - Crisp tracking, high contrast, clean weights (`font-semibold`, `font-bold`).
3. **Body & Technical Specs:**
   - Clean, highly legible sans-serif for descriptions, tables, and instructions.

### 3. Glassmorphism & Elevation

- **Card Base:** `backdrop-blur-xl bg-card/75 border border-white/10 rounded-3xl shadow-2xl`
- **Glow Filter:** `shadow-[0_0_30px_-5px_rgba(235,0,41,0.15)]`
- **Hover Transition:** `hover:border-white/20 hover:bg-card/90 transition-all duration-300`

### 4. Breakpoints

- Mobile: `< 640px` (Compact stacked layout, thumb-friendly touch zones)
- Tablet: `640px - 1024px` (2-column bento grids, balanced proportions)
- Desktop: `1024px - 1440px` (Multi-column asymmetrical bento grids, full dual-device mockup)
- Ultra-wide: `> 1440px` (Constrained container `max-w-7xl` with generous atmospheric padding)
