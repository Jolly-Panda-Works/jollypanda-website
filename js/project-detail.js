/* ==========================================================================
   Jolly Panda Studio — project-detail.js
   Reads the ?id= query param, loads data/projects.json, and renders the
   matching project's full detail into the page. Falls back to a friendly
   "not found" state if the id doesn't match anything (bad link, removed
   project, etc.). Re-renders on language change, same as the rest of the
   site's i18n behavior — no reload needed.
   ========================================================================== */

(function () {
  "use strict";

  var DATA_URL = "data/projects.json";
  var DEFAULT_LANG = "en";

  var currentLang = document.documentElement.getAttribute("lang") || DEFAULT_LANG;
  var projectsCache = null;
  var i18nDict = null;
  var currentProject = null;

  var root = null;

  function localize(field, lang) {
    if (field == null) return "";
    if (typeof field === "string") return field;
    return field[lang] || field[DEFAULT_LANG] || Object.values(field)[0] || "";
  }

  function localizeList(field, lang) {
    if (field == null) return [];
    if (Array.isArray(field)) return field;
    return field[lang] || field[DEFAULT_LANG] || Object.values(field)[0] || [];
  }

  function getI18n(path, fallback) {
    if (!i18nDict) return fallback;
    var value = path.split(".").reduce(function (acc, key) {
      return acc && typeof acc === "object" ? acc[key] : undefined;
    }, i18nDict);
    return typeof value === "string" ? value : fallback;
  }

  function getProjectIdFromUrl() {
    var params = new URLSearchParams(window.location.search);
    return params.get("id");
  }

  function backIcon() {
    return (
      '<span class="dir-icon dir-icon--sm" aria-hidden="true">' +
      '<svg class="dir-icon__ltr" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      '<svg class="dir-icon__rtl" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      "</span>"
    );
  }

  function checkIcon() {
    return '<svg viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  function zoomIcon() {
    return '<svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/><path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M11 8v6M8 11h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  }

  function externalIcon() {
    return '<svg viewBox="0 0 24 24" fill="none"><path d="M14 5h5v5M19 5l-9 9M9 5H6a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1v-3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  function storeIcon(type) {
    if (type === "appstore") {
      return '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 12.5c-.03-2.55 2.08-3.78 2.17-3.84-1.19-1.74-3.04-1.98-3.7-2-1.57-.16-3.07.93-3.87.93-.8 0-2.02-.9-3.33-.88-1.71.03-3.3 1-4.18 2.53-1.78 3.09-.46 7.66 1.28 10.17.85 1.22 1.85 2.6 3.18 2.55 1.28-.05 1.76-.82 3.31-.82 1.54 0 1.98.82 3.33.8 1.38-.02 2.25-1.24 3.08-2.47.97-1.42 1.37-2.79 1.4-2.86-.03-.01-2.63-1.01-2.67-4.11zM14.7 4.75c.7-.85 1.17-2.02 1.04-3.2-1 .04-2.24.68-2.96 1.51-.65.75-1.22 1.94-1.06 3.09 1.13.09 2.28-.55 2.98-1.4z"/></svg>';
    }
    if (type === "googleplay") {
      return '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3.6 2.6c-.35.35-.55.9-.55 1.6v15.6c0 .7.2 1.25.55 1.6l.1.08L12.8 12v-.2L3.7 2.5l-.1.1z"/><path d="M15.9 15.1l-3.1-3.1v-.2l3.1-3.1 6.83 3.88c.51.29.51 1.32 0 1.6l-6.83 3.9z"/><path d="M12.8 12l3.1 3.1L3.7 21.5c-.35.35-.9.35-1.25.08l10.35-9.58z"/><path d="M12.8 12L2.45 2.42c.35-.27.9-.27 1.25.08L15.9 8.9 12.8 12z"/></svg>';
    }
    if (type === "github") {
      return '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 008 10.94c.58.11.79-.25.79-.56v-2.17c-3.25.71-3.94-1.39-3.94-1.39-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.27 3.39.97.11-.75.41-1.27.74-1.56-2.6-.3-5.34-1.3-5.34-5.78 0-1.28.46-2.33 1.2-3.15-.12-.3-.52-1.52.11-3.17 0 0 .98-.31 3.2 1.2a11.1 11.1 0 015.82 0c2.22-1.51 3.2-1.2 3.2-1.2.63 1.65.23 2.87.11 3.17.75.82 1.2 1.87 1.2 3.15 0 4.49-2.74 5.48-5.35 5.77.42.36.8 1.08.8 2.18v3.23c0 .31.21.67.8.56A11.5 11.5 0 0023.5 12C23.5 5.65 18.35.5 12 .5z"/></svg>';
    }
    return externalIcon();
  }

  function linkIcon() {
    return '<svg viewBox="0 0 24 24" fill="none"><path d="M10 13a5 5 0 007.07 0l2.83-2.83a5 5 0 00-7.07-7.07L11.5 4.5M14 11a5 5 0 00-7.07 0L4.1 13.83a5 5 0 007.07 7.07L12.5 19.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  function twitterIcon() {
    return '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 2H22l-7.2 8.2L23 22h-6.6l-5.2-6.8L5.2 22H2l7.7-8.8L1.5 2h6.8l4.7 6.2L18.9 2zm-1.2 18h1.8L7.4 4H5.5l12.2 16z"/></svg>';
  }

  function telegramIcon() {
    return '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 4.5L2.9 11.6c-1.2.5-1.2 1.2-.2 1.5l4.6 1.4 10.6-6.7c.5-.3 1-.1.6.2l-8.6 7.8h0l-.3 4.6c.4 0 .6-.2.9-.5l2.2-2.1 4.6 3.4c.8.5 1.4.2 1.6-.8l3-14.2c.3-1.3-.5-1.9-1.5-1.7z"/></svg>';
  }

  function linkedinIcon() {
    return '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.94 8.5H3.56V20h3.38V8.5zM5.25 3.5a1.96 1.96 0 100 3.92 1.96 1.96 0 000-3.92zM20.44 20h-3.37v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V20H9.68V8.5h3.24v1.57h.05c.45-.86 1.56-1.76 3.2-1.76 3.43 0 4.06 2.25 4.06 5.18V20z"/></svg>';
  }

  function closeIcon() {
    return '<svg viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  }

  function navIcon(direction) {
    // "prev" points toward the start of reading order, "next" toward the end —
    // same twin-SVG convention used by forward/back icons elsewhere on the site.
    var startPath = "M15 6l-6 6 6 6"; // left-pointing chevron
    var endPath = "M9 6l6 6-6 6"; // right-pointing chevron
    var ltrPath = direction === "prev" ? startPath : endPath;
    var rtlPath = direction === "prev" ? endPath : startPath;
    return (
      '<span class="dir-icon" aria-hidden="true">' +
      '<svg class="dir-icon__ltr" viewBox="0 0 24 24" fill="none"><path d="' + ltrPath + '" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      '<svg class="dir-icon__rtl" viewBox="0 0 24 24" fill="none"><path d="' + rtlPath + '" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      "</span>"
    );
  }

  /* ---------------- Lightbox ---------------- */

  var lightboxEl = null;
  var lightboxItems = [];
  var lightboxIndex = 0;
  var lightboxLastFocus = null;

  function ensureLightbox() {
    if (lightboxEl) return lightboxEl;

    var el = document.createElement("div");
    el.className = "lightbox";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.innerHTML =
      '<div class="lightbox__stage">' +
      '<button type="button" class="lightbox__close" data-lightbox-close aria-label="' +
      getI18n("projectDetail.gallery.close", "Close") +
      '">' + closeIcon() + "</button>" +
      '<button type="button" class="lightbox__nav lightbox__nav--prev" data-lightbox-prev aria-label="' +
      getI18n("projectDetail.gallery.prev", "Previous") +
      '">' + navIcon("prev") + "</button>" +
      '<button type="button" class="lightbox__nav lightbox__nav--next" data-lightbox-next aria-label="' +
      getI18n("projectDetail.gallery.next", "Next") +
      '">' + navIcon("next") + "</button>" +
      '<div class="lightbox__media-wrap" data-lightbox-media></div>' +
      '<p class="lightbox__caption" data-lightbox-caption></p>' +
      '<p class="lightbox__counter" data-lightbox-counter></p>' +
      "</div>";

    document.body.appendChild(el);

    el.addEventListener("click", function (event) {
      if (event.target === el) closeLightbox();
    });
    el.querySelector("[data-lightbox-close]").addEventListener("click", closeLightbox);
    el.querySelector("[data-lightbox-prev]").addEventListener("click", function () {
      showLightboxItem(lightboxIndex - 1);
    });
    el.querySelector("[data-lightbox-next]").addEventListener("click", function () {
      showLightboxItem(lightboxIndex + 1);
    });

    document.addEventListener("keydown", function (event) {
      if (!lightboxEl || !lightboxEl.classList.contains("is-open")) return;
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowRight") {
        var dir = document.documentElement.getAttribute("dir");
        showLightboxItem(lightboxIndex + (dir === "rtl" ? -1 : 1));
      }
      if (event.key === "ArrowLeft") {
        var dir2 = document.documentElement.getAttribute("dir");
        showLightboxItem(lightboxIndex + (dir2 === "rtl" ? 1 : -1));
      }
    });

    lightboxEl = el;
    return el;
  }

  function showLightboxItem(index) {
    if (!lightboxItems.length) return;
    lightboxIndex = (index + lightboxItems.length) % lightboxItems.length;
    var item = lightboxItems[lightboxIndex];
    var mediaWrap = lightboxEl.querySelector("[data-lightbox-media]");
    var captionEl = lightboxEl.querySelector("[data-lightbox-caption]");
    var counterEl = lightboxEl.querySelector("[data-lightbox-counter]");

    mediaWrap.innerHTML = "";
    if (item.type === "video") {
      var video = document.createElement("video");
      video.src = item.src;
      if (item.poster) video.poster = item.poster;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      mediaWrap.appendChild(video);
    } else {
      var img = document.createElement("img");
      img.src = item.src;
      img.alt = item.caption || "";
      mediaWrap.appendChild(img);
    }

    captionEl.textContent = item.caption || "";
    captionEl.style.display = item.caption ? "" : "none";

    var counterTemplate = getI18n("projectDetail.gallery.counter", "{current} of {total}");
    counterEl.textContent = counterTemplate
      .replace("{current}", lightboxIndex + 1)
      .replace("{total}", lightboxItems.length);

    var showNav = lightboxItems.length > 1;
    lightboxEl.querySelector("[data-lightbox-prev]").style.display = showNav ? "" : "none";
    lightboxEl.querySelector("[data-lightbox-next]").style.display = showNav ? "" : "none";
  }

  function stopLightboxMedia() {
    if (!lightboxEl) return;
    var video = lightboxEl.querySelector("video");
    if (video) {
      video.pause();
      video.removeAttribute("src");
      video.load();
    }
  }

  function openLightbox(items, startIndex) {
    ensureLightbox();
    lightboxItems = items;
    lightboxLastFocus = document.activeElement;
    showLightboxItem(startIndex || 0);
    lightboxEl.classList.add("is-open");
    document.body.style.overflow = "hidden";
    lightboxEl.querySelector("[data-lightbox-close]").focus();
  }

  function closeLightbox() {
    if (!lightboxEl) return;
    lightboxEl.classList.remove("is-open");
    document.body.style.overflow = "";
    stopLightboxMedia();
    if (lightboxLastFocus && typeof lightboxLastFocus.focus === "function") {
      lightboxLastFocus.focus();
    }
  }

  function buildGallerySection(project, lang) {
    var gallery = project.gallery;
    if (!gallery || !gallery.length) return "";

    var items = gallery.map(function (item) {
      return { type: "image", src: item.src, caption: localize(item.caption, lang) };
    });

    var framesHtml = items
      .map(function (item, index) {
        var captionHtml = item.caption
          ? '<span class="gallery-frame__caption">' + item.caption.replace(/</g, "&lt;") + "</span>"
          : "";
        var label = item.caption || getI18n("projectDetail.gallery.galleryTitle", "Gallery");
        return (
          '<button type="button" class="gallery-frame" data-gallery-index="' + index + '" aria-label="' + label.replace(/"/g, "&quot;") + '">' +
          '<img src="' + item.src + '" alt="" loading="lazy" draggable="false" oncontextmenu="return false" />' +
          '<span class="gallery-frame__zoom" aria-hidden="true">' + zoomIcon() + "</span>" +
          captionHtml +
          "</button>"
        );
      })
      .join("");

    return (
      '<section class="section section--tight project-gallery" data-reveal data-gallery-items=\'' +
      JSON.stringify(items).replace(/'/g, "&#39;") +
      "'>" +
      '<div class="container">' +
      "<h2>" + getI18n("projectDetail.gallery.galleryTitle", "Gallery") + "</h2>" +
      '<div class="project-gallery__scroll">' + framesHtml + "</div>" +
      "</div>" +
      "</section>"
    );
  }

  function buildVideoSection(project, lang) {
    var video = project.video;
    if (!video || !video.url) return "";

    var caption = localize(video.caption, lang);
    var posterAttr = video.poster ? ' poster="' + video.poster + '"' : "";

    return (
      '<section class="section section--tight project-video" data-reveal>' +
      '<div class="container">' +
      "<h2>" + getI18n("projectDetail.video.title", "Watch It In Action") + "</h2>" +
      '<div class="project-video__player">' +
      '<video controls preload="metadata"' + posterAttr + '>' +
      '<source src="' + video.url + '" />' +
      "</video>" +
      "</div>" +
      (caption ? '<p class="project-video__caption">' + caption.replace(/</g, "&lt;") + "</p>" : "") +
      "</div>" +
      "</section>"
    );
  }

  function actionLinkLabel(link, lang) {
    if (link.label) return localize(link.label, lang);
    return getI18n("projectDetail.actionLinks." + link.type, link.type);
  }

  function buildActionLinksHtml(links, lang, ghost) {
    if (!links || !links.length) return "";
    return links
      .map(function (link) {
        var label = actionLinkLabel(link, lang);
        var icon = link.type === "appstore" || link.type === "googleplay" || link.type === "github"
          ? storeIcon(link.type)
          : externalIcon();
        return (
          '<a href="' + link.url + '" class="action-link' + (ghost ? " action-link--ghost" : "") + '" target="_blank" rel="noopener noreferrer">' +
          icon + "<span>" + label.replace(/</g, "&lt;") + "</span></a>"
        );
      })
      .join("");
  }

  /* ---------------- Share row ---------------- */

  function buildShareRow() {
    return (
      '<div class="share-row" data-share-row>' +
      '<span class="share-row__label">' + getI18n("projectDetail.share.label", "Share") + "</span>" +
      '<button type="button" class="share-btn" data-share="copy" aria-label="' + getI18n("projectDetail.share.copyLink", "Copy Link") + '">' +
      linkIcon() +
      '<span class="share-btn__tooltip" data-share-tooltip>' + getI18n("projectDetail.share.copyLink", "Copy Link") + "</span>" +
      "</button>" +
      '<a class="share-btn" data-share="twitter" aria-label="' + getI18n("projectDetail.share.twitter", "Share on X") + '" target="_blank" rel="noopener noreferrer">' + twitterIcon() + "</a>" +
      '<a class="share-btn" data-share="telegram" aria-label="' + getI18n("projectDetail.share.telegram", "Share on Telegram") + '" target="_blank" rel="noopener noreferrer">' + telegramIcon() + "</a>" +
      '<a class="share-btn" data-share="linkedin" aria-label="' + getI18n("projectDetail.share.linkedin", "Share on LinkedIn") + '" target="_blank" rel="noopener noreferrer">' + linkedinIcon() + "</a>" +
      "</div>"
    );
  }

  function wireShareRow(root, title) {
    var shareRow = root.querySelector("[data-share-row]");
    if (!shareRow) return;

    var url = window.location.href;
    var team = getI18n("brand.name", "Jolly Panda Studio");
    var message = getI18n("projectDetail.share.message", "{project} by {team} — take a look:")
      .replace("{project}", title)
      .replace("{team}", team);

    var twitterLink = shareRow.querySelector('[data-share="twitter"]');
    if (twitterLink) twitterLink.href = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(message) + "&url=" + encodeURIComponent(url);

    var telegramLink = shareRow.querySelector('[data-share="telegram"]');
    if (telegramLink) telegramLink.href = "https://t.me/share/url?url=" + encodeURIComponent(url) + "&text=" + encodeURIComponent(message);

    var linkedinLink = shareRow.querySelector('[data-share="linkedin"]');
    if (linkedinLink) linkedinLink.href = "https://www.linkedin.com/sharing/share-offsite/?url=" + encodeURIComponent(url);

    var copyBtn = shareRow.querySelector('[data-share="copy"]');
    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        var tooltip = copyBtn.querySelector("[data-share-tooltip]");
        var restoreText = tooltip ? tooltip.textContent : "";
        var copyText = message + " " + url;
        var showCopied = function () {
          if (!tooltip) return;
          tooltip.textContent = getI18n("projectDetail.share.copied", "Link Copied");
          tooltip.classList.add("is-visible");
          setTimeout(function () {
            tooltip.classList.remove("is-visible");
            setTimeout(function () {
              tooltip.textContent = restoreText;
            }, 200);
          }, 1400);
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(copyText).then(showCopied).catch(function () {});
        } else {
          var temp = document.createElement("textarea");
          temp.value = copyText;
          temp.style.position = "fixed";
          temp.style.opacity = "0";
          document.body.appendChild(temp);
          temp.select();
          try {
            document.execCommand("copy");
          } catch (e) {
            /* no-op */
          }
          document.body.removeChild(temp);
          showCopied();
        }
      });
    }
  }

  function wireGallery(root) {
    var galleryEl = root.querySelector("[data-gallery-items]");
    if (!galleryEl) return;
    var items = JSON.parse(galleryEl.getAttribute("data-gallery-items"));
    var scrollEl = galleryEl.querySelector(".project-gallery__scroll");

    var isDragging = false;
    var dragMoved = false;
    var startX = 0;
    var scrollStart = 0;

    function onMouseDown(event) {
      isDragging = true;
      dragMoved = false;
      startX = event.pageX;
      scrollStart = scrollEl.scrollLeft;
    }

    function onMouseMove(event) {
      if (!isDragging) return;
      var dx = event.pageX - startX;
      if (Math.abs(dx) > 4) {
        if (!dragMoved) scrollEl.classList.add("is-dragging");
        dragMoved = true;
      }
      if (dragMoved) scrollEl.scrollLeft = scrollStart - dx;
    }

    function endDrag() {
      if (!isDragging) return;
      isDragging = false;
      scrollEl.classList.remove("is-dragging");
    }

    if (scrollEl) {
      scrollEl.addEventListener("mousedown", onMouseDown);
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", endDrag);
      scrollEl.addEventListener("mouseleave", endDrag);
    }

    galleryEl.querySelectorAll("[data-gallery-index]").forEach(function (btn) {
      btn.addEventListener("click", function (event) {
        if (dragMoved) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        var index = parseInt(btn.getAttribute("data-gallery-index"), 10);
        openLightbox(items, index);
      });
    });
  }

  function renderNotFound() {
    document.title = getI18n("projectDetail.notFound.title", "We couldn't find that project") + " — Jolly Panda Studio";
    root.innerHTML =
      '<div class="container">' +
      '<div class="project-not-found" data-reveal>' +
      "<h1>" + getI18n("projectDetail.notFound.title", "We couldn't find that project") + "</h1>" +
      "<p>" + getI18n("projectDetail.notFound.desc", "It may have been renamed or removed. Take a look at everything we've built instead.") + "</p>" +
      '<a href="projects.html" class="btn btn-primary">' +
      getI18n("projectDetail.notFound.cta", "Browse All Projects") +
      "</a>" +
      "</div>" +
      "</div>";
    if (window.JollyPandaAnimations) {
      window.JollyPandaAnimations.observe(root.querySelectorAll("[data-reveal]"));
    }
  }

  function renderError() {
    root.innerHTML =
      '<div class="container">' +
      '<div class="project-not-found" data-reveal><p>' +
      getI18n("projectDetail.error", "We couldn't load this project right now.") +
      "</p></div></div>";
  }

  function renderProject(project, lang) {
    var title = localize(project.title, lang);
    var shortDesc = localize(project.shortDescription, lang);
    var fullDescRaw = localize(project.fullDescription, lang);
    var highlights = localizeList(project.highlights, lang);
    var categoryLabel = getI18n("projectsPage.categoryLabels." + project.category, project.category);
    var tags = project.tags || [];
    var actionLinks = project.actionLinks || [];
    var titleAttr = title.replace(/"/g, "&quot;");

    document.title = title + " — Jolly Panda Studio";
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", shortDesc);

    var paragraphs = fullDescRaw
      .split("\n\n")
      .filter(Boolean)
      .map(function (p) {
        return "<p>" + p.replace(/</g, "&lt;") + "</p>";
      })
      .join("");

    var highlightsHtml = highlights.length
      ? '<div class="project-detail__panel" data-reveal>' +
        "<h3>" + getI18n("projectDetail.highlightsTitle", "Highlights") + "</h3>" +
        '<ul class="project-detail__list">' +
        highlights
          .map(function (item) {
            return "<li>" + checkIcon() + "<span>" + item.replace(/</g, "&lt;") + "</span></li>";
          })
          .join("") +
        "</ul></div>"
      : "";

    var tagsHtml = tags.length
      ? '<div class="project-detail__panel" data-reveal>' +
        "<h3>" + getI18n("projectDetail.tagsTitle", "Built With") + "</h3>" +
        '<div class="project-detail__tags">' +
        tags
          .map(function (tag) {
            return '<span class="project-detail__tag">' + tag.replace(/</g, "&lt;") + "</span>";
          })
          .join("") +
        "</div></div>"
      : "";

    /* ---- Hero: full-bleed cover image, bottom scrim holding logo/title/links/share ---- */
    var logoHtml = project.logo
      ? '<span class="project-hero__logo"><img src="' + project.logo + '" alt="" /></span>'
      : "";

    var heroHtml =
      '<div class="project-hero">' +
      '<img class="project-hero__cover-img" src="' + project.image + '" alt="" draggable="false" oncontextmenu="return false" />' +
      '<div class="project-hero__scrim"></div>' +
      '<a href="projects.html" class="project-hero__back">' + backIcon() + "<span>" +
      getI18n("projectDetail.back", "Back to Projects") +
      "</span></a>" +
      '<div class="project-hero__overlay">' +
      '<div class="container">' +
      '<div data-reveal>' +
      '<div class="project-hero__identity">' +
      logoHtml +
      "<div>" +
      '<div class="project-hero__meta">' +
      '<span class="eyebrow">' + categoryLabel + "</span>" +
      (project.year ? '<span class="project-card__year">' + project.year + "</span>" : "") +
      "</div>" +
      '<h1 class="project-hero__title">' + title.replace(/</g, "&lt;") + "</h1>" +
      "</div>" +
      "</div>" +
      '<p class="project-hero__desc">' + shortDesc.replace(/</g, "&lt;") + "</p>" +
      '<div class="project-hero__actions-row">' +
      '<div class="project-hero__links">' + buildActionLinksHtml(actionLinks, lang, true) + "</div>" +
      buildShareRow() +
      "</div>" +
      "</div>" +
      "</div>" +
      "</div>" +
      "</div>";

    /* ---- Description + aside ---- */
    var bodyHtml =
      '<section class="section section--tight">' +
      '<div class="container">' +
      '<div class="project-detail__grid">' +
      '<div class="project-detail__body" data-reveal>' + paragraphs + "</div>" +
      '<div class="project-detail__aside">' + highlightsHtml + tagsHtml + "</div>" +
      "</div>" +
      "</div>" +
      "</section>";

    /* ---- Gallery (full width, scrollable, image-only, not for saving) ---- */
    var galleryHtml = buildGallerySection(project, lang);

    /* ---- Video (optional — only rendered when the project provides one) ---- */
    var videoHtml = buildVideoSection(project, lang);

    /* ---- Download / try-it-yourself, with action links again + a supporting image ---- */
    var downloadImage = project.image;
    var hasLinks = actionLinks.length > 0;
    var downloadHtml =
      '<section class="section project-download">' +
      '<div class="container">' +
      '<div class="project-download__grid">' +
      '<div class="project-download__content" data-reveal>' +
      "<h2>" + getI18n("projectDetail.download.title", "Try It Yourself") + "</h2>" +
      "<p>" + getI18n(
        hasLinks ? "projectDetail.download.desc" : "projectDetail.download.descFallback",
        hasLinks ? "Here's where you can check it out directly." : "This one isn't public yet — but we're happy to walk you through it."
      ) + "</p>" +
      (hasLinks ? '<div class="project-download__links">' + buildActionLinksHtml(actionLinks, lang, false) + "</div>" : "") +
      '<div class="project-download__secondary">' +
      '<a href="mailto:hello@jollypanda.ir">' + getI18n("projectDetail.cta.button", "Start a Conversation") + "</a>" +
      '<a href="projects.html">' + getI18n("projectDetail.back", "Back to Projects") + "</a>" +
      "</div>" +
      "</div>" +
      '<div class="project-download__image" data-reveal>' +
      '<img src="' + downloadImage + '" alt="' + titleAttr + '" draggable="false" oncontextmenu="return false" />' +
      "</div>" +
      "</div>" +
      "</div>" +
      "</section>";

    root.innerHTML = heroHtml + bodyHtml + galleryHtml + videoHtml + downloadHtml;

    if (window.JollyPandaAnimations) {
      window.JollyPandaAnimations.observe(root.querySelectorAll("[data-reveal]"));
    }

    wireGallery(root);
    wireShareRow(root, title);
  }

  function render() {
    if (!root || !projectsCache) return;
    closeLightbox();
    var id = getProjectIdFromUrl();
    currentProject = projectsCache.find(function (p) {
      return p.id === id;
    });

    if (!currentProject) {
      renderNotFound();
      return;
    }

    renderProject(currentProject, currentLang);
  }

  function loadDictionaryThenRender() {
    fetch("lang/" + currentLang + ".json")
      .then(function (res) {
        return res.ok ? res.json() : null;
      })
      .then(function (dict) {
        i18nDict = dict;
        render();
      })
      .catch(function () {
        render();
      });
  }

  function init() {
    root = document.getElementById("projectDetailRoot");
    if (!root) return;

    fetch(DATA_URL)
      .then(function (res) {
        if (!res.ok) throw new Error("Failed to load project data: " + res.status);
        return res.json();
      })
      .then(function (projects) {
        projectsCache = projects;
        loadDictionaryThenRender();
      })
      .catch(function (err) {
        console.error("[project-detail.js]", err);
        renderError();
      });
  }

  document.addEventListener("jollypanda:languagechange", function (event) {
    currentLang = (event.detail && event.detail.lang) || currentLang;
    loadDictionaryThenRender();
  });

  document.addEventListener("DOMContentLoaded", init);
})();
