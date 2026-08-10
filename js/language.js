/* ==========================================================================
   Jolly Panda Studio — language.js
   Loads /lang/{code}.json and applies translations to every element with a
   data-i18n="dot.path.key" attribute, without a page reload. Persists the
   chosen language in localStorage and updates <html lang/dir> plus the
   active state on every .lang-switch button on the page.
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

  function detectInitialLang() {
    var stored = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      /* localStorage unavailable (private mode, etc.) — fall through */
    }
    if (stored && SUPPORTED_LANGS.indexOf(stored) !== -1) return stored;

    var browserLang = (navigator.language || "").slice(0, 2);
    if (SUPPORTED_LANGS.indexOf(browserLang) !== -1) return browserLang;

    return DEFAULT_LANG;
  }

  function fetchDictionary(lang) {
    if (cache[lang]) return Promise.resolve(cache[lang]);
    return fetch("lang/" + lang + ".json")
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

  function initLanguageSwitchers() {
    document.querySelectorAll(".lang-switch__btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var lang = btn.getAttribute("data-lang");
        setLanguage(lang);
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
