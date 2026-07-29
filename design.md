# MoiHub Design System — "Market Stall" Brutalism

Attach this file to any prompt asking for a new page, component, or redesign.
It locks in the visual language so results stay consistent across the app.

## Concept

The design language is grounded in physical market-stall signage: price tags,
receipt paper, punched holes, perforated edges, hand-stamped verification.
Every UI element should feel like it could exist as a physical object at a
Kenyan campus market stall — nothing generic-SaaS, nothing soft or rounded
without reason.

## Tokens

### Color
```css
--ink: #173b2a;        /* headings, borders, dark sections */
--paper: #FBF6EC;       /* page background */
--paper-line: #E4DACB;  /* hairlines, dashed dividers */
--marigold: #F5B324;    /* accent — tags, highlights */
--chili: #D8482E;       /* primary CTA, urgency */
--leaf: #2F7D4F;        /* secondary accent — "food"/success */
--charcoal: #23262B;    /* body text */
--charcoal-soft: #5B5A54; /* muted body text */
--white: #FFFDF8;       /* card backgrounds */
```
Never substitute a cream-and-terracotta or near-black-and-neon default palette —
this system uses paper cream + ink navy + chili red as its three anchors.

### Type
- **Display / headings:** `Anton` — uppercase, tight leading (0.98–1.05), no
  font-weight variation (it only ships as 400). Feels like a painted signboard.
- **Body:** `Work Sans`, weights 400–800, sentence case, `text-transform: none`.
- **Data / prices / stats / mono labels:** `Space Mono`, used for anything
  numeric or receipt-like (prices, stats, eyebrows, mockup UI).

Import:
```css
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Work+Sans:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');
```

## Signature motifs (reuse these, don't reinvent per page)

1. **Tag badge** — pill-shaped label with a punched circle on the left edge,
   rotated -2deg, mono font, uppercase. Used for eyebrows and category chips.
2. **Icon frame** — 56×56px square with one sharp corner and one rounded
   corner (`border-radius: 4px 16px 4px 4px`), 2px ink border, small punched
   hole in the top-left corner, rotated -4deg. Used anywhere an icon needs a
   container.
3. **Receipt card** — white card with a perforated top/bottom edge (radial
   gradient dots), dashed internal dividers, mono line items, slight rotation
   (-3deg), hard offset shadow (`10px 10px 0 rgba(ink, 0.12)`) instead of a
   soft blur shadow.
4. **Hard offset shadows on buttons** — `box-shadow: 4px 4px 0 var(--ink)`,
   2px solid border matching the fill color, shifts to `6px 6px 0` and
   translates -2px/-2px on hover. No soft drop shadows anywhere in this system.
5. **Dashed section dividers** — `border-top: 1px dashed var(--paper-line)`
   between sections instead of solid rules or plain whitespace.

## Layout rules

- Numbered steps/badges (1, 2, 3…) are earned only by genuine sequences
  (an onboarding flow, a real process). Don't use them as decoration.
- Cards get sharp-ish corners (4–8px radius max) and visible 1.5–2px borders,
  never borderless soft-shadow cards.
- Comparison content (e.g. two user types, two plans) goes in side-by-side
  bordered panels with a 6px color-coded top bar, not generic feature grids.
- Stats/dashboards sit on a dark ink background with mono numbers in marigold.

## Motion

- Scroll-reveal: fade + translateY(18px→0), 0.6s ease, triggered once via
  `IntersectionObserver` at 15% visibility. Always gate with
  `@media (prefers-reduced-motion: reduce)` to disable.
- Hover states: hard-shadow buttons shift position (-2px/-2px), not scale
  or soft glow.

## Accessibility floor (non-negotiable)

- Visible `focus-visible` outline (`3px solid var(--leaf)`, offset 3px) on
  every interactive element.
- Responsive down to ~360px width.
- Accordions/toggles use real `<button>` + `aria-expanded`, not divs.

## Tech defaults

- Icons: `lucide-react` — real icons, never text placeholders like `"Users"`.
- Interactive state (accordions, toggles): local `useState`, no external libs.
- One CSS file per page/component, scoped under a single root class
  (e.g. `.vendors-page`) to avoid leaking styles.