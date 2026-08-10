# Image Optimization Guide — Jolly Panda Studio

Guidelines for adding, formatting, and optimizing images across the website.

---

## 1. Preferred Formats

| Content type | Format | Notes |
|---|---|---|
| Logos, icons, brand marks | **SVG** | Preferred whenever a vector source exists — scales infinitely, tiny file size. |
| Photos, mascot illustrations, hero art | **WebP** | ~25–35% smaller than JPEG at equal visual quality. |
| Images requiring transparency without a vector source | **PNG** | Only when WebP transparency isn't practical for the workflow, or for favicons/app icons. |
| Avoid | **JPG** | Only use if a source asset is JPG and re-encoding to WebP isn't yet possible; convert when you can. |

**Rule of thumb:** SVG > WebP > PNG (transparency only) > JPG (avoid).

---

## 2. Recommended Dimensions

| Asset | Dimensions | Format |
|---|---|---|
| Favicon (ICO) | 16×16, 32×32, 48×48 combined | .ico |
| Favicon (SVG) | vector, any size | .svg |
| Apple touch icon | 180×180 | PNG |
| Android Chrome icon (small) | 192×192 | PNG |
| Android Chrome icon (large) | 512×512 | PNG |
| Nav logo | 96×96 (displayed ~42×42) | PNG/WebP |
| Open Graph image | 1200×630 | PNG/WebP/JPG |
| Twitter Card image | 1200×630 | PNG/WebP/JPG |
| Hero mascot | 760×760 (as currently used) | JPEG/WebP |
| Team member photo | 200×200 (displayed), export at 2x = 400×400 for retina | JPEG/WebP |

---

## 3. Compression Best Practices

- Export web images at **quality 75–85** for WebP/JPEG — visually lossless for most photographic content at a fraction of the file size.
- Target under **200KB** per image; hero/OG images can go slightly higher (up to ~300KB) since they're loaded once per session.
- Strip EXIF metadata on export (camera info, GPS data) — it adds weight and can leak information you don't want public.
- Use tools like [Squoosh](https://squoosh.app/) or ImageMagick (`convert input.jpg -quality 82 output.webp`) to batch-optimize before committing images to the repo.
- Always provide explicit `width` and `height` attributes on `<img>` tags (already done across the site) to prevent layout shift (CLS).

---

## 4. Logo Usage

- Always use `logo.svg` when the context supports vector rendering (nav bar, footer, print materials).
- Use `logo.webp` for contexts where SVG isn't supported (older email clients, some social platforms).
- Use `logo.png` only as a last-resort fallback.
- Maintain clear space around the logo equal to at least the height of the panda-paw mark.
- Do not stretch, recolor, or rotate the logo outside of approved brand variants.

---

## 5. Favicon Requirements

A complete favicon set includes:

- `favicon.ico` — multi-resolution (16/32/48px), universal legacy support.
- `favicon.svg` — scalable, modern browsers (Chrome, Firefox, Edge, Safari 16+).
- `favicon-16x16.png`, `favicon-32x32.png` — explicit PNG fallbacks.
- `apple-touch-icon.png` (180×180) — iOS home screen bookmarks.
- `android-chrome-192x192.png`, `android-chrome-512x512.png` — Android home screen and PWA install prompts, referenced from `manifest.json`.

All of the above are already generated and linked from every page's `<head>`.

---

## 6. Social Sharing Image Sizes

- **Open Graph (`og-image.png`):** 1200×630px, under 300KB, safe text zone within the center ~1200×600 area (some platforms crop edges).
- **Twitter Card (`twitter-card.png`):** 1200×630px for `summary_large_image` cards — same safe-zone rule applies.
- Keep the logo/mascot large and legible even at thumbnail size — most previews render at 300–500px wide.
- Avoid small body text in social images; it becomes unreadable at preview scale.

---

## 7. Hero Image Sizes

- Desktop hero mascot: 760×760px source, displayed responsively.
- Mobile: the same asset scales down via CSS — no separate mobile crop is currently needed given the square aspect ratio.
- Use `loading="eager"` and `fetchpriority="high"` only for the above-the-fold hero image (already applied); every other image should use `loading="lazy"`.

---

## 8. Team Photo Sizes

- Source at minimum 400×400px (2x for retina at 200×200 display size).
- Square aspect ratio, subject centered, consistent lighting/background style across the team for visual cohesion.
- Use `assets/team/no picture.png` as the placeholder for team members without a photo yet (already implemented in `team.json`/`team.js`).

---

## 9. Responsive Image Guidelines

- All images should be served at the smallest dimension that still looks sharp at the largest display size in the layout (avoid shipping a 2000px image for a 200px avatar).
- Prefer relative/responsive CSS sizing (`max-width: 100%; height: auto;`) over fixed pixel dimensions in stylesheets, while keeping `width`/`height` HTML attributes for aspect-ratio reservation.
- For any future high-density hero or gallery images, consider `srcset`/`sizes` to serve 1x/2x variants.
- Always pair every `<img>` with a descriptive `alt` attribute; use `alt=""` only for purely decorative images that are adjacent to equivalent text (as done for the nav/footer logo mark).

---

**Last updated:** 2026-08-04
