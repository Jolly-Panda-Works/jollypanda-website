# SEO Checklist — Jolly Panda Studio

A practical, step-by-step checklist to run **after** `jollypanda.ir` is deployed. Work through each section top to bottom and check items off as you complete them.

---

## 1. Search Engine Setup

### - [ ] 1.1 Google Search Console setup
- **Purpose:** Give Google direct visibility into how the site is indexed and performing.
- **Why it matters:** It's the primary channel for indexing status, crawl errors, and manual actions.
- **Steps:**
  1. Go to [search.google.com/search-console](https://search.google.com/search-console).
  2. Add `jollypanda.ir` as a **Domain property** (covers http/https and www/non-www).
  3. Verify ownership via DNS TXT record with your domain registrar.
  4. Confirm the property shows "Ownership verified."
- **Recommended tools:** Google Search Console, domain registrar DNS panel.
- **Expected outcome:** Verified property with crawl and index data flowing in within 24–48 hours.

### - [ ] 1.2 Bing Webmaster Tools
- **Purpose:** Index the site on Bing/Yahoo/DuckDuckGo (which uses Bing's index).
- **Why it matters:** Bing still drives meaningful traffic and DuckDuckGo relies on it.
- **Steps:**
  1. Go to [bing.com/webmasters](https://www.bing.com/webmasters).
  2. Import the site directly from Google Search Console (fastest) or verify manually via DNS/meta tag.
  3. Submit `sitemap.xml` from the Sitemaps section.
- **Recommended tools:** Bing Webmaster Tools.
- **Expected outcome:** Site verified and sitemap accepted with no errors.

### - [ ] 1.3 Sitemap submission
- **Purpose:** Tell search engines exactly which URLs exist and how important they are.
- **Why it matters:** Speeds up discovery of new/updated pages.
- **Steps:**
  1. Confirm `https://jollypanda.ir/sitemap.xml` loads and is valid XML.
  2. Submit it in both Google Search Console and Bing Webmaster Tools.
  3. Re-submit whenever new pages are added.
- **Recommended tools:** Google Search Console, Bing Webmaster Tools, [XML Sitemap Validator](https://www.xml-sitemaps.com/validate-xml-sitemap.html).
- **Expected outcome:** Sitemap status shows "Success" with all 3 URLs discovered.

### - [ ] 1.4 robots.txt verification
- **Purpose:** Ensure crawlers are allowed to access the site and find the sitemap.
- **Why it matters:** A misconfigured robots.txt can accidentally block the entire site from search engines.
- **Steps:**
  1. Visit `https://jollypanda.ir/robots.txt` and confirm it returns `200 OK`.
  2. Confirm it contains `Allow: /` and the correct `Sitemap:` line.
  3. Test it in Search Console's robots.txt report.
- **Recommended tools:** Google Search Console robots.txt tester.
- **Expected outcome:** No pages are unintentionally disallowed.

### - [ ] 1.5 Index request
- **Purpose:** Manually prompt Google to crawl and index key pages immediately.
- **Why it matters:** Without it, initial indexing can take days to weeks.
- **Steps:**
  1. In Search Console, use **URL Inspection** for `/`, `/services.html`, and `/about.html`.
  2. Click **Request Indexing** for each.
  3. Repeat for Bing via "Submit URLs" in Bing Webmaster Tools.
- **Recommended tools:** Google Search Console, Bing Webmaster Tools.
- **Expected outcome:** All three pages show as indexed within a few days.

---

## 2. Social & Metadata Validation

### - [ ] 2.1 Open Graph validation
- **Purpose:** Confirm link previews render correctly on Facebook, LinkedIn, Telegram, WhatsApp, etc.
- **Why it matters:** Broken previews reduce click-through rates when links are shared.
- **Steps:**
  1. Test each page URL in [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) and [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/).
  2. Confirm `og:title`, `og:description`, and `og:image` render correctly.
  3. Use "Scrape Again" to refresh cached previews after any change.
- **Recommended tools:** Facebook Sharing Debugger, LinkedIn Post Inspector.
- **Expected outcome:** Correct title, description, and 1200×630 image preview with no warnings.

### - [ ] 2.2 Twitter Card validation
- **Purpose:** Confirm the `summary_large_image` card renders correctly on X (Twitter).
- **Why it matters:** X strips its own card validator, so preview testing must be done via a third-party tool or by posting a test link.
- **Steps:**
  1. Confirm the meta tags `twitter:card`, `twitter:title`, `twitter:description`, and `twitter:image` are present on every page.
  2. Use a third-party card previewer (e.g. [cards-dev preview tools](https://cardpreview.dev/)) since Twitter's own validator was retired.
  3. Post a real (or unlisted/draft) link to confirm rendering in-app.
- **Recommended tools:** cardpreview.dev, manual test post.
- **Expected outcome:** Large image card renders with correct title/description.

---

## 3. Performance & Core Web Vitals

### - [ ] 3.1 Lighthouse audit
- **Purpose:** Get an objective baseline score for Performance, SEO, Accessibility, and Best Practices.
- **Why it matters:** Lighthouse scores correlate with both rankings and real user experience.
- **Steps:**
  1. Open each page in Chrome DevTools → Lighthouse tab.
  2. Run audits for both Mobile and Desktop.
  3. Fix any SEO/Accessibility items scoring below 90.
- **Recommended tools:** Chrome DevTools Lighthouse, [PageSpeed Insights](https://pagespeed.web.dev/).
- **Expected outcome:** SEO score of 100 and Performance/Accessibility scores of 90+.

### - [ ] 3.2 Core Web Vitals
- **Purpose:** Validate LCP, CLS, and INP meet Google's "Good" thresholds.
- **Why it matters:** Core Web Vitals are a confirmed Google ranking signal.
- **Steps:**
  1. Check field data in Search Console's Core Web Vitals report (needs real traffic first).
  2. Cross-check lab data in PageSpeed Insights.
  3. Target LCP < 2.5s, CLS < 0.1, INP < 200ms.
- **Recommended tools:** Search Console, PageSpeed Insights, Chrome UX Report.
- **Expected outcome:** All three URLs rated "Good" once sufficient traffic accumulates.

### - [ ] 3.3 PageSpeed Insights
- **Purpose:** Get combined lab + field performance data with specific fix suggestions.
- **Why it matters:** Surfaces render-blocking resources, image sizing, and font-loading issues.
- **Steps:**
  1. Run `https://jollypanda.ir/` through [pagespeed.web.dev](https://pagespeed.web.dev/).
  2. Address any "Opportunities" (e.g., unused CSS, image sizing).
  3. Re-test after fixes.
- **Recommended tools:** PageSpeed Insights.
- **Expected outcome:** Green scores (90+) on both mobile and desktop.

---

## 4. Analytics & Compliance

### - [ ] 4.1 Google Analytics setup (optional)
- **Purpose:** Track visitors, traffic sources, and behavior.
- **Why it matters:** Without analytics, there's no visibility into whether SEO work is driving results.
- **Steps:**
  1. Create a GA4 property at [analytics.google.com](https://analytics.google.com/).
  2. Add the GA4 tag (or use Google Tag Manager) to all pages.
  3. Link the GA4 property to Search Console for combined reporting.
- **Recommended tools:** Google Analytics 4, Google Tag Manager.
- **Expected outcome:** Real-time visitor data appears in GA4 within minutes of adding the tag.

### - [ ] 4.2 Cookie banner (if required)
- **Purpose:** Comply with consent requirements if analytics/ads cookies are used and EU/UK visitors are expected.
- **Why it matters:** GDPR/ePrivacy non-compliance carries legal risk if targeting those regions.
- **Steps:**
  1. Determine if GA4/marketing cookies will be used — if not, this may be skippable.
  2. If used, add a consent banner that blocks non-essential cookies until accepted.
  3. Document the lawful basis and retention period in a privacy policy page.
- **Recommended tools:** [Cookiebot](https://www.cookiebot.com/), [Osano](https://www.osano.com/), or a lightweight custom banner.
- **Expected outcome:** No non-essential cookies fire before consent; policy page is linked in the footer.

---

## 5. Domain & Infrastructure

### - [ ] 5.1 Domain configuration
- **Purpose:** Ensure `jollypanda.ir` points correctly to the hosting provider.
- **Why it matters:** Misconfigured DNS blocks the site entirely or causes intermittent downtime.
- **Steps:**
  1. Confirm A/AAAA or CNAME records point to the hosting provider.
  2. Verify propagation with [whatsmydns.net](https://www.whatsmydns.net/).
  3. Set a reasonable TTL (e.g., 3600s) for future flexibility.
- **Recommended tools:** whatsmydns.net, registrar DNS panel.
- **Expected outcome:** Domain resolves globally to the correct server.

### - [ ] 5.2 HTTPS verification
- **Purpose:** Confirm a valid, auto-renewing SSL/TLS certificate is active.
- **Why it matters:** HTTPS is a ranking factor and required for user trust and the Web App Manifest.
- **Steps:**
  1. Confirm `https://jollypanda.ir` loads with a valid padlock and no mixed-content warnings.
  2. Enable HSTS if the host supports it.
  3. Set auto-renewal (Let's Encrypt or host-managed) and confirm expiry date.
- **Recommended tools:** [SSL Labs Test](https://www.ssllabs.com/ssltest/), browser DevTools.
- **Expected outcome:** SSL Labs grade A or higher, no expired/self-signed certificate warnings.

### - [ ] 5.3 WWW / non-WWW redirect
- **Purpose:** Serve the site from a single canonical host to avoid duplicate-content issues.
- **Why it matters:** Search engines can treat `www.` and non-`www` as separate sites, splitting ranking signals.
- **Steps:**
  1. Decide on the canonical host (this project uses non-`www`: `jollypanda.ir`).
  2. Configure a 301 redirect from `www.jollypanda.ir` to `jollypanda.ir`.
  3. Confirm the redirect with `curl -I https://www.jollypanda.ir`.
- **Recommended tools:** curl, hosting provider redirect rules.
- **Expected outcome:** Single 301 redirect, no redirect chains or loops.

### - [ ] 5.4 Canonical URL verification
- **Purpose:** Confirm every page's `<link rel="canonical">` matches its own live URL.
- **Why it matters:** Prevents duplicate-content penalties and consolidates ranking signals.
- **Steps:**
  1. View source on each page and confirm the canonical tag matches the served URL exactly (protocol, host, trailing slash).
  2. Check Search Console's "Page indexing" report for canonical mismatches.
- **Recommended tools:** View Source, Google Search Console.
- **Expected outcome:** No canonical conflicts reported.

---

## 6. Structured Data & Assets

### - [ ] 6.1 Structured Data validation
- **Purpose:** Confirm the Organization, WebSite, Person, WebPage, and BreadcrumbList JSON-LD are error-free.
- **Why it matters:** Valid structured data enables rich results (sitelinks, knowledge panel eligibility).
- **Steps:**
  1. Test each page in [Google Rich Results Test](https://search.google.com/test/rich-results).
  2. Validate the raw JSON-LD in [Schema.org Validator](https://validator.schema.org/).
  3. Fix any errors or warnings before deploy.
- **Recommended tools:** Rich Results Test, Schema.org Validator.
- **Expected outcome:** Zero errors; all schema types detected correctly.

### - [ ] 6.2 Image optimization
- **Purpose:** Ensure images are appropriately sized, compressed, and served in modern formats.
- **Why it matters:** Images are usually the largest contributor to page weight and LCP.
- **Steps:**
  1. Convert photographic assets to WebP where possible; keep PNG only where transparency is required.
  2. Confirm `loading="lazy"` on below-the-fold images (already applied to team photos and secondary mascot images).
  3. Confirm every `<img>` has a meaningful `alt` (decorative images may use `alt=""`).
- **Recommended tools:** [Squoosh](https://squoosh.app/), ImageMagick, browser DevTools Network panel.
- **Expected outcome:** No image exceeds ~200KB; total page image weight is minimized.

### - [ ] 6.3 Favicon verification
- **Purpose:** Confirm favicons render correctly across browsers, tabs, bookmarks, and home-screen installs.
- **Why it matters:** Missing/broken favicons look unprofessional and hurt brand recognition in search results and tabs.
- **Steps:**
  1. Check `favicon.ico`, `favicon.svg`, 16×16, 32×32, apple-touch-icon, and Android Chrome icons all load with `200 OK`.
  2. Test appearance in Chrome, Safari, and on an Android/iOS home screen add.
  3. Validate `manifest.json` icons resolve in Chrome DevTools → Application → Manifest.
- **Recommended tools:** [RealFaviconGenerator checker](https://realfavicongenerator.net/favicon_checker), Chrome DevTools.
- **Expected outcome:** Consistent brand icon across every context.

---

## 7. Quality Assurance

### - [ ] 7.1 Broken link checking
- **Purpose:** Catch dead internal/external links before and after launch.
- **Why it matters:** Broken links hurt UX, crawl efficiency, and can waste crawl budget.
- **Steps:**
  1. Run a full-site crawl with a broken-link checker.
  2. Fix or remove any 404s and update outdated external links (e.g. LinkedIn profiles).
  3. Re-run after any content update.
- **Recommended tools:** [W3C Link Checker](https://validator.w3.org/checklink), Screaming Frog SEO Spider.
- **Expected outcome:** Zero broken links reported.

### - [ ] 7.2 Accessibility testing
- **Purpose:** Confirm the site is usable with screen readers, keyboard-only navigation, and meets WCAG 2.1 AA.
- **Why it matters:** Accessibility is both a legal consideration and a Lighthouse/SEO signal.
- **Steps:**
  1. Run an automated audit (axe or Lighthouse Accessibility).
  2. Manually tab through every page to confirm focus order and visible focus states.
  3. Test with a screen reader (VoiceOver/NVDA) on the language switcher and nav.
- **Recommended tools:** [axe DevTools](https://www.deque.com/axe/devtools/), Lighthouse, NVDA/VoiceOver.
- **Expected outcome:** No critical/serious axe violations.

### - [ ] 7.3 Mobile usability
- **Purpose:** Confirm the site works well on small screens and touch devices.
- **Why it matters:** Google uses mobile-first indexing — the mobile experience is what gets ranked.
- **Steps:**
  1. Run Search Console's Mobile Usability report after indexing.
  2. Manually test tap targets, the language switcher, and the mobile nav toggle on a real device.
  3. Confirm no horizontal scrolling or overlapping text at common breakpoints (360px–768px).
- **Recommended tools:** Google Search Console, Chrome DevTools device toolbar, a physical phone.
- **Expected outcome:** Zero mobile usability issues reported.

---

## 8. Brand & Off-Site Presence

### - [ ] 8.1 Social media profile completion
- **Purpose:** Keep brand presence consistent everywhere the studio is discoverable.
- **Why it matters:** Consistent NAP (Name/URL/description) across profiles reinforces entity recognition for search engines.
- **Steps:**
  1. Ensure each active social profile links back to `https://jollypanda.ir/`.
  2. Use the same logo, description, and keyword set (Game Development Studio, HTML5 Games, Playable Ads, etc.) across profiles.
  3. Add profile URLs to the Organization schema's `sameAs` array as they go live.
- **Recommended tools:** Manual profile review.
- **Expected outcome:** Consistent branding and working links on every active profile.

### - [ ] 8.2 LinkedIn company page optimization
- **Purpose:** LinkedIn is a strong channel for B2B trust and hiring.
- **Why it matters:** A complete company page improves discoverability and credibility for potential clients/partners.
- **Steps:**
  1. Set the company page URL, logo, cover image, and description using the studio's keyword set.
  2. Link every team member's personal profile as an employee of the page.
  3. Post the site launch as a company update.
- **Recommended tools:** LinkedIn Company Pages.
- **Expected outcome:** Fully completed page with team members listed as employees.

### - [ ] 8.3 GitHub repository optimization
- **Purpose:** If the source is public, make the repo itself discoverable and professional.
- **Why it matters:** A well-kept public repo doubles as a portfolio piece and technical credibility signal.
- **Steps:**
  1. Add a repository description, website link, and relevant topics/tags (e.g. `html5-games`, `game-studio`, `seo`).
  2. Add a social preview image (Settings → Social Preview).
  3. Confirm the LICENSE reflects the "All rights reserved" copyright already stated in the README.
- **Recommended tools:** GitHub repository settings.
- **Expected outcome:** Repository shows a proper description, topics, and social preview card.

### - [ ] 8.4 README improvements
- **Purpose:** Keep the README accurate as the SEO/asset structure evolves.
- **Why it matters:** An outdated README misleads contributors and looks unmaintained to visitors.
- **Steps:**
  1. Update the project structure section to include `/docs`, `manifest.json`, `robots.txt`, `sitemap.xml`, and `/assets/social`.
  2. Add a short "SEO & Assets" section linking to this checklist.
  3. Re-review after each structural change to the repo.
- **Recommended tools:** Manual edit, Markdown preview.
- **Expected outcome:** README accurately reflects the live repository structure.

---

## 9. Operations

### - [ ] 9.1 Backup strategy
- **Purpose:** Ensure the site (and its Git history) can be restored quickly if something breaks.
- **Why it matters:** Prevents permanent data loss and reduces downtime risk.
- **Steps:**
  1. Confirm the GitHub repository is the source of truth and protected (branch protection on `main`).
  2. If using a host with a database or CMS in the future, schedule automated backups.
  3. Periodically test restoring from a backup/clone in a clean environment.
- **Recommended tools:** GitHub branch protection, hosting provider backup features.
- **Expected outcome:** A documented, tested recovery process.

### - [ ] 9.2 Future content planning
- **Purpose:** Keep a pipeline of new pages/content that support the target keywords over time.
- **Why it matters:** Fresh, relevant content is one of the strongest long-term ranking signals.
- **Steps:**
  1. Reference the README's "Future Roadmap" (Portfolio, Contact, Blog, Careers) as the next SEO-relevant pages to build.
  2. Prioritize a Portfolio/Case Studies page — it directly supports "Game Development Studio" and "Playable Ads" keywords.
  3. Plan blog topics around HTML5 game development and playable ad production to build topical authority.
- **Recommended tools:** Simple content calendar (spreadsheet or project board).
- **Expected outcome:** A prioritized backlog of upcoming pages tied to target keywords.

---

**Last updated:** 2026-08-04
