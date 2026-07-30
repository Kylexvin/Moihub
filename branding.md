# MoiHub Brand Guidelines

This is the single reference for anything outward-facing: website, email,
posters, banners, social campaigns, merch. Attach it to any prompt —
design, copy, or code — that needs to look and sound like MoiHub.

## Brand architecture — two tiers, on purpose

**The app (product)** — dark, emerald-dominant, ivory text/accents. This is
the "in-hand" daily-use experience and stays as-is; it is not covered by
this document.

**Everything else — web, email, posters, banners, social, campaigns** —
runs on the system below: a *neubrutalist* skin (thick borders, flat
colors, hard offset shadows, no gradients, no glassmorphism) wrapped
around a **market-stall** motif (price tags, receipts, punched holes,
perforated edges). Loud, tactile, campus-market energy — not a generic
SaaS look, and not the same as the app's darker in-product feel.

If you only remember one rule: **ink + ivory is the base everywhere;
marigold and chili are what make it feel alive.**

## Color

| Name | Hex | Role |
|---|---|---|
| Ink Emerald | `#093028` | Primary dark — headlines, borders, dark backgrounds. The brand's anchor color. |
| Ivory Paper | `#FBF6EC` | Primary light — page/poster background. Never pure white as the main canvas. |
| Marigold | `#F5B324` | Energy accent — tags, highlights, secondary shadows. The "pop" color. |
| Chili | `#D8482E` | Action accent — CTAs, buttons, urgency. Used sparingly so it keeps its punch. |
| Leaf | `#2F7D4F` | Supporting accent — success states, "food" category, approval. |
| Paper Line | `#E4DACB` | Hairlines, dashed dividers — never a heavy border color. |
| Off-white | `#FFFDF8` | Card/surface fills that sit on top of Ivory Paper. |

**Rules:**
- Ink and Ivory carry the composition. Marigold, Chili, and Leaf are
  accents — if more than ~15–20% of a layout is in an accent color, pull back.
- Chili is for things you can click or that are urgent. Don't use it for
  decorative color-blocking.
- Shadows are never gray or black-blur. Use a flat offset in Ink at low
  opacity (`rgba(9,48,40,0.12)`) or a solid accent color (marigold shadow
  under a chili button) — see Motifs below.
- On dark (Ink) backgrounds, body text runs in a muted ivory/gray
  (`#B9C0D4` or similar), never full-white — full white reads harsh against emerald.

## Typography

Three fonts, three jobs. Never introduce a fourth.

- **Anton** — display/headlines only. Always uppercase, tight line-height
  (0.98–1.1). This is the "painted signboard" voice.
- **Work Sans** — all body copy, sentence case, weights 400–800.
- **Space Mono** — anything numeric or label-like: prices, stats, eyebrow
  tags, receipt lines, dates. Uppercase with slight letter-spacing when
  used as a label.

**Print/email fallback stack** (Anton and Space Mono won't load in most
email clients or on-press without embedding):
- Display fallback: `Arial Black, Impact, sans-serif` (bold, condensed feel)
- Body: `Arial, Helvetica, sans-serif`
- Mono: `'Courier New', Courier, monospace`

## Signature motifs

These are what make something *look like MoiHub* rather than a generic
brutalist template. Reuse them; don't invent new ones per project.

1. **Tag badge** — small rotated label (-2deg) with a punched circle on
   the left edge, mono font, uppercase. Use for eyebrows, category labels,
   "NEW" flags on a poster.
2. **Icon frame** — square with one sharp corner and one rounded corner,
   thick border, tiny punched hole top-left. Any icon or logomark gets one
   of these instead of floating bare.
3. **Receipt card** — perforated top/bottom edge (a row of small circles),
   dashed internal dividers, mono line items. Great for pricing, stats, or
   a poster's "details" block (event date/time/location as receipt lines).
4. **Hard offset shadow** — flat directional shadow (`4–10px` offset, zero
   blur), not a soft drop shadow. On buttons: border color matches fill,
   shadow is the *other* accent color (chili button → marigold shadow).
5. **Dashed dividers** — thin dashed rule instead of a solid line, used
   between sections or list items.

**Scaling these up for posters/large format:** the perforated edge works
well as a full poster border (repeat the punched-circle pattern along all
four sides), and the tag badge becomes a large rotated corner sticker
("SAVE THE DATE", "LIMITED SPOTS"). Keep the hard-shadow logic even at
huge sizes — a 40px offset shadow on a poster headline reads as
intentional; a soft blurred one just looks like a mistake.

## Logo usage

- Minimum clear space around the logo: the height of the "M" on all sides.
- Minimum size: 24px tall digitally, 15mm in print — below that, drop the
  wordmark and use the mark alone if one exists.
- Use the on-Ivory version on light backgrounds, on-Ink version on dark.
  Never place the logo directly on Marigold or Chili — insufficient contrast.
- Don't add drop shadows, outlines, gradients, or recolor it outside the
  two approved variants.

## Voice & tone

- Sentence case in real sentences; uppercase is a *type treatment*
  (Anton headlines), not a grammar rule — don't write body copy in caps.
- Direct and plainspoken — write like you're talking to a specific
  student or vendor, not "our valued users."
- Campus-specific vocabulary grounds it locally: "stall" not "store",
  "term time" not "quarter", "the gate" as a real landmark reference.
  Use real campus texture where it fits naturally — don't force it.
- CTAs are short verbs: "Become a vendor," "Open in MoiHub app," "Reset my
  password" — not "Click here to learn more about..."
- No emoji in headlines or as a substitute for real hierarchy. (They were
  in the old email templates — deliberately removed.)

## Applying this to posters, banners, and campaigns

**Common sizes to design for:**
- Instagram post: 1080×1080 — keep text inside a ~85% safe zone (crops happen)
- Instagram/WhatsApp story: 1080×1920
- A4/A3 print poster — design in RGB for digital/campus printers; if it's
  going through a professional offset press, get a CMYK proof first —
  Chili and Marigold both shift noticeably in CMYK conversion.

**A reliable poster formula**, built from the motifs above:
1. Tag badge top-left or top-center — the "what is this" one-liner
2. One big Anton headline, 2–4 words max, Ink or Ivory depending on background
3. One line of Work Sans supporting copy — the actual details
4. A receipt-style block for hard facts: date, time, location, price
5. A chili CTA button or a QR code in a punched-hole icon frame
6. Perforated edge as the poster border, or just along the bottom like a
   torn receipt

**High-contrast rule for anything viewed at a distance** (posters, banners):
stick to Ink-on-Ivory or Ivory-on-Ink for the headline. Marigold-on-Ivory
or Chili-on-Ivory both fail legibility tests from more than a few feet away
— reserve those pairings for close-up digital contexts (a phone screen,
not a wall).

## Do / Don't

**Do:**
- Keep shadows flat and directional, never blurred
- Let Ink + Ivory dominate; accents stay accents
- Reuse the same 5 motifs across every medium
- Write CTAs as short verbs

**Don't:**
- Introduce gradients, soft glows, or glassmorphism anywhere
- Use more than 3 fonts
- Put body text in ALL CAPS
- Use Chili as a background color for large areas — it's for action, not decoration
- Design a poster/banner without checking the high-contrast rule at actual viewing distance

## Quick reference

```
Ink Emerald   #093028   primary dark
Ivory Paper   #FBF6EC   primary light
Off-white     #FFFDF8   surface fill
Marigold      #F5B324   accent / energy
Chili         #D8482E   accent / action
Leaf          #2F7D4F   accent / success
Paper Line    #E4DACB   hairlines only

Display:  Anton — uppercase, headlines only
Body:     Work Sans — sentence case
Data:     Space Mono — labels, prices, stats
```