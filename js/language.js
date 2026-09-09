/* ==========================================================================
   Jolly Panda Studio — language.js
   Loads /lang/{code}.json and applies translations to every element with a
   data-i18n="dot.path.key" attribute, without a page reload. The active
   language is derived from the URL (root pages = English, /fa/ pages =
   Persian) so search engines always see a consistent language per URL —
   see /fa/ for the crawlable Persian versions with their own <html lang>,
   titles, meta tags and hreflang links baked in server-side.
   The EN/FA buttons navigate between the matching root and /fa/ page
   instead of swapping text in place, so the URL always matches what's
   on screen.
   ========================================================================== */

(function () {
  "use strict";

  var SUPPORTED_LANGS = ["en", "fa"];
  var DEFAULT_LANG = "en";
  var STORAGE_KEY = "jollypanda:lang";
  var cache = {}; // in-memory cache of already-fetched dictionaries

  /**
   * Reads a nested value out of an object using a dot-separated path.
   * e.g. getPath(dict, "hero.title.line1")
   */
  function getPath(obj, path) {
    return path.split(".").reduce(function (acc, key) {
      return acc && typeof acc === "object" ? acc[key] : undefined;
    }, obj);
  }

  function isFaPath() {
    return /^\/fa(\/|$)/.test(window.location.pathname);
  }

  // The current page's filename relative to its language root, e.g.
  // "/services.html" -> "services.html", "/fa/" -> "index.html".
  function currentPageFile() {
    var path = window.location.pathname;
    var file = isFaPath() ? path.replace(/^\/fa\/?/, "") : path.replace(/^\//, "");
    return file || "index.html";
  }

  // URL is the source of truth for which language is on screen — this
  // keeps every page's language consistent with its <html lang>, meta
  // tags and hreflang annotations for search engines.
  function detectInitialLang() {
    return isFaPath() ? "fa" : DEFAULT_LANG;
  }

  function fetchDictionary(lang) {
    if (cache[lang]) return Promise.resolve(cache[lang]);
    return fetch("/lang/" + lang + ".json")
      .then(function (res) {
        if (!res.ok) throw new Error("Failed to load language file: " + lang);
        return res.json();
      })
      .then(function (data) {
        cache[lang] = data;
        return data;
      });
  }

  function applyTranslations(dict) {
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      var value = getPath(dict, key);
      if (typeof value === "string") {
        el.textContent = value;
      }
    });

    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      // Format: data-i18n-attr="aria-label:some.key|title:other.key"
      var pairs = el.getAttribute("data-i18n-attr").split("|");
      pairs.forEach(function (pair) {
        var parts = pair.split(":");
        var attr = parts[0];
        var key = parts[1];
        var value = getPath(dict, key);
        if (attr && typeof value === "string") {
          el.setAttribute(attr, value);
        }
      });
    });
  }

  function updateLangSwitchButtons(lang) {
    document.querySelectorAll(".lang-switch__btn").forEach(function (btn) {
      var isActive = btn.getAttribute("data-lang") === lang;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  // Applies a language's text to the current page in place. Used on load
  // to (re)apply translations for dynamically-rendered content (team and
  // project cards read document.documentElement's lang themselves, but
  // this also keeps everything in sync and fires the languagechange event
  // they listen for).
  function setLanguage(lang) {
    if (SUPPORTED_LANGS.indexOf(lang) === -1) lang = DEFAULT_LANG;

    return fetchDictionary(lang).then(function (dict) {
      var dir = (dict.meta && dict.meta.dir) || (lang === "fa" ? "rtl" : "ltr");

      document.documentElement.setAttribute("lang", lang);
      document.documentElement.setAttribute("dir", dir);
      document.body.setAttribute("dir", dir);

      applyTranslations(dict);
      updateLangSwitchButtons(lang);

      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch (e) {
        /* ignore persistence failures */
      }

      document.dispatchEvent(
        new CustomEvent("jollypanda:languagechange", { detail: { lang: lang, dir: dir } })
      );
    });
  }

  // Clicking EN/FA navigates to the matching URL (root page <-> /fa/ page)
  // instead of switching text in place, so the address bar and the
  // rendered language always match — required for the /fa/ pages to be
  // indexed as genuinely separate, crawlable Persian content.
  function initLanguageSwitchers() {
    document.querySelectorAll(".lang-switch__btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var lang = btn.getAttribute("data-lang");
        var alreadyThisLang = lang === detectInitialLang();
        if (alreadyThisLang) return;

        var file = currentPageFile();
        var hash = window.location.hash || "";
        var target = (lang === "fa" ? "/fa/" + file : "/" + file) + hash;
        window.location.href = target;
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initLanguageSwitchers();
    setLanguage(detectInitialLang());
  });

  // Expose a minimal API in case future pages/scripts need it.
  window.JollyPandaLang = { setLanguage: setLanguage };
})();
