# Launch Checklist — Jolly Panda Studio

A complete, end-to-end deployment roadmap for `jollypanda.ir`, from domain setup through post-launch monitoring.

---

## Phase 1 — Domain Setup

- [ ] Confirm `jollypanda.ir` is registered and auto-renewal is enabled.
- [ ] Confirm registrar account access/recovery details are current (avoid losing the domain to an expired card or old email).
- [ ] Decide the canonical host: `jollypanda.ir` (non-www) — matches the canonical tags and JSON-LD already in the site.

## Phase 2 — DNS Verification

- [ ] Point A/AAAA (or CNAME, if the host requires it) records to the hosting provider.
- [ ] Add a redirect or DNS entry so `www.jollypanda.ir` also resolves and 301-redirects to the root domain.
- [ ] Add the DNS TXT record required for Google Search Console domain verification.
- [ ] Confirm global propagation with [whatsmydns.net](https://www.whatsmydns.net/) before moving on.

## Phase 3 — Hosting Configuration

- [ ] Upload/deploy all files: `index.html`, `about.html`, `services.html`, `css/`, `js/`, `assets/`, `data/`, `lang/`, plus the new root files (`robots.txt`, `sitemap.xml`, `manifest.json`, `humans.txt`, `browserconfig.xml`, `.well-known/security.txt`).
- [ ] Confirm the hosting provider serves `.well-known/security.txt` correctly (some static hosts need an explicit rule for dotfiles/dot-directories).
- [ ] Set correct MIME types for `.json`, `.xml`, `.svg`, `.webmanifest`/`.json` manifest if the host requires explicit configuration.
- [ ] Enable gzip/Brotli compression on the server if configurable.
- [ ] Enable HTTP caching headers for static assets (`css/`, `js/`, `assets/`) with a sensible max-age.

## Phase 4 — HTTPS

- [ ] Issue an SSL/TLS certificate (Let's Encrypt or host-managed).
- [ ] Confirm auto-renewal is configured.
- [ ] Force HTTP → HTTPS redirect at the server/host level.
- [ ] Run [SSL Labs Test](https://www.ssllabs.com/ssltest/) and confirm a grade of A or higher.

## Phase 5 — Search Engine Indexing

- [ ] Verify the domain in Google Search Console (see `SEO-Checklist.en.md` §1.1).
- [ ] Verify the domain in Bing Webmaster Tools (§1.2).
- [ ] Submit `sitemap.xml` to both (§1.3).
- [ ] Confirm `robots.txt` allows crawling and correctly references the sitemap (§1.4).
- [ ] Request indexing for `/`, `/services.html`, and `/about.html` (§1.5).

## Phase 6 — SEO Verification

- [ ] Confirm unique `<title>` and meta description on every page.
- [ ] Confirm canonical URLs match live URLs exactly on every page.
- [ ] Validate all JSON-LD structured data in [Rich Results Test](https://search.google.com/test/rich-results).
- [ ] Confirm heading hierarchy (single `H1` per page, no skipped levels) — already verified in the current markup.
- [ ] Confirm every image has a meaningful `alt` attribute.

## Phase 7 — Social Media Sharing

- [ ] Validate Open Graph previews on Facebook Sharing Debugger and LinkedIn Post Inspector.
- [ ] Validate the Twitter/X card preview via a third-party card tool.
- [ ] Post the launch announcement on the studio's social channels once previews render correctly.
- [ ] Add live social profile URLs to the Organization schema's `sameAs` field in a follow-up deploy.

## Phase 8 — Final Testing

- [ ] Run Lighthouse (mobile + desktop) on all three pages; target SEO 100, Performance/Accessibility 90+.
- [ ] Run a full accessibility pass (axe/Lighthouse + manual keyboard/screen-reader test).
- [ ] Test the language switcher (EN ⇄ FA) and RTL layout on every page.
- [ ] Test mobile nav toggle, all internal links, and all external (LinkedIn, etc.) links for correctness.
- [ ] Test on at least one real Android and one real iOS device, not just DevTools emulation.
- [ ] Confirm favicons render correctly in browser tabs, bookmarks, and home-screen installs.
- [ ] Run a broken-link crawl across the whole site.

## Phase 9 — Post-Launch Monitoring

- [ ] Set a recurring reminder (e.g., monthly) to check Search Console for crawl errors, manual actions, and Core Web Vitals trends.
- [ ] Monitor Google Analytics (if enabled) for traffic sources and behavior in the first 2 weeks.
- [ ] Re-run Lighthouse/PageSpeed Insights after any significant content or asset change.
- [ ] Re-validate structured data after any schema-relevant change (team changes, new pages, founder/role changes).
- [ ] Keep `sitemap.xml` and `robots.txt` in sync as new pages (Portfolio, Contact, Blog, Careers) go live per the README's Future Roadmap.
- [ ] Review this checklist and `SEO-Checklist.en.md` quarterly to catch drift.

---

**Last updated:** 2026-08-04
