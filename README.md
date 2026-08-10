# 🐼 Jolly Panda Studio Website

Official website of **Jolly Panda Studio**, an independent software studio focused on creating engaging digital experiences.

🌐 **Website:** https://jollypanda.ir

---

## About

Jolly Panda Studio specializes in building high-quality digital products with a strong focus on entertainment.

Our primary services include:

* 🌐 Website Development
* 🎮 Game Development
* 💻 Software Development

The website is designed to be lightweight, responsive, bilingual, and easy to maintain.

---

## Features

* 🌍 Persian (RTL) & English (LTR)
* 📱 Fully Responsive Design
* ⚡ Built with Vanilla HTML, CSS & JavaScript
* 🎨 Modern UI inspired by our brand identity
* 📂 JSON-driven content architecture
* 👥 Dynamic Team Members section
* 🛠️ Easily extensible structure for future pages
* ♿ Accessibility-friendly
* 🚀 Performance-focused

---

## Project Structure

```text
/
├── index.html
├── about.html
├── services.html
│
├── manifest.json
├── robots.txt
├── sitemap.xml
├── humans.txt
├── browserconfig.xml
├── security.txt
├── .well-known/
│   └── security.txt
│
├── assets/
│   ├── logo/          (favicons, app icons, favicon.svg, favicon.ico)
│   ├── social/         (og-image.png, twitter-card.png)
│   ├── mascot/
│   ├── team/
│   └── icons/
│
├── css/
│   ├── variables.css
│   ├── style.css
│   └── responsive.css
│
├── js/
│   ├── app.js
│   ├── language.js
│   ├── animations.js
│   ├── team.js
│   └── components/
│
├── data/
│   └── team.json
│
├── lang/
│   ├── en.json
│   └── fa.json
│
└── docs/
    ├── SEO-Checklist.en.md / .fa.md
    ├── Image-Guide.en.md / .fa.md
    └── Launch-Checklist.en.md / .fa.md
```

---

## Technologies

* HTML5
* CSS3
* Vanilla JavaScript (ES6)
* JSON
* SVG Icons

No frameworks or external UI libraries are used.

---

## Localization

The website supports two languages:

* 🇺🇸 English
* 🇮🇷 فارسی

Features include:

* Automatic language detection based on the visitor's browser.
* Manual language switching.
* RTL/LTR layout support.
* Language preference stored in Local Storage.

---

## Content Management

All editable content is stored in JSON files.

This includes:

* Navigation
* Hero section
* About page
* Services
* Team Members
* Footer
* Social Links
* Buttons
* Company Information

Updating website content requires editing only the corresponding JSON files.

---

## SEO & Assets

The site is fully optimized for search engines: semantic HTML5, a clean heading hierarchy, unique per-page titles/meta descriptions, canonical URLs, Open Graph + Twitter Card metadata, a Web App Manifest, a complete favicon set, and JSON-LD structured data (Organization, WebSite, Person, WebPage, BreadcrumbList) on every page.

See `/docs` for detailed, bilingual (Persian & English) guides:

* [`SEO-Checklist.en.md`](docs/SEO-Checklist.en.md) / [`.fa.md`](docs/SEO-Checklist.fa.md) — post-deployment SEO checklist.
* [`Image-Guide.en.md`](docs/Image-Guide.en.md) / [`.fa.md`](docs/Image-Guide.fa.md) — image formats, sizes, and compression guidelines.
* [`Launch-Checklist.en.md`](docs/Launch-Checklist.en.md) / [`.fa.md`](docs/Launch-Checklist.fa.md) — full deployment roadmap.

---

## Development

Clone the repository:

```bash
git clone https://github.com/<your-username>/jollypanda-studio.git
```

Open the project with your preferred editor.

Run it using any local development server.

Examples:

```bash
npx serve
```

or

```bash
python -m http.server
```

---

## Future Roadmap

Planned features include:

* Portfolio
* Contact Page
* Project Request Form
* Blog
* Careers
* Dark Mode
* CMS Integration

---

## License

Copyright © Jolly Panda Studio.

All rights reserved.

This repository contains the source code of the official Jolly Panda Studio website.
