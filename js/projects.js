/* ==========================================================================
   Jolly Panda Studio — projects.js
   Loads data/projects.json once and renders it into #projectsGrid on the
   Projects page. Supports:
     - a text search box (matches title, description and tags)
     - category filter chips (all / website / game / application)
     - live re-render on language change (i18n) with no reload
   Nothing about the project list is hardcoded in HTML — adding, removing,
   or editing an entry in data/projects.json is enough to update the grid.
   ========================================================================== */

(function () {
  "use strict";

  var DATA_URL = "data/projects.json";
  var DEFAULT_LANG = "en";
  var CATEGORIES = ["website", "game", "application"];

  var grid = null;
  var searchInput = null;
  var filterButtons = null;
  var resultsEl = null;
  var i18nDict = null;

  var projectsCache = null;
  var currentLang = document.documentElement.getAttribute("lang") || DEFAULT_LANG;
  var state = { category: "all", query: "" };
  var searchDebounce = null;

  /** Reads a bilingual field like { en, fa }, falling back gracefully. */
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

  function normalize(str) {
    return (str || "").toString().toLowerCase().trim();
  }

  function matchesQuery(project, lang, query) {
    if (!query) return true;
    var haystack = [
      localize(project.title, lang),
      localize(project.shortDescription, lang),
      (project.tags || []).join(" "),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.indexOf(query) !== -1;
  }

  function filterProjects(projects, lang) {
    var query = normalize(state.query);
    return projects.filter(function (project) {
      var categoryOk = state.category === "all" || project.category === state.category;
      return categoryOk && matchesQuery(project, lang, query);
    });
  }

  function forwardIcon() {
    return (
      '<span class="dir-icon dir-icon--sm" aria-hidden="true">' +
      '<svg class="dir-icon__ltr" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      '<svg class="dir-icon__rtl" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      "</span>"
    );
  }

  function buildCard(project, lang) {
    var card = document.createElement("a");
    card.className = "project-card";
    card.href = "project-detail.html?id=" + encodeURIComponent(project.id);

    var title = localize(project.title, lang);
    var desc = localize(project.shortDescription, lang);
    var categoryLabel = getI18n("projectsPage.categoryLabels." + project.category, project.category);

    var media = document.createElement("div");
    media.className = "project-card__media";

    var img = document.createElement("img");
    img.src = project.image;
    img.alt = title;
    img.loading = "lazy";
    media.appendChild(img);

    var badge = document.createElement("span");
    badge.className = "project-card__badge project-card__badge--" + project.category;
    badge.textContent = categoryLabel;
    media.appendChild(badge);

    var body = document.createElement("div");
    body.className = "project-card__body";

    var titleEl = document.createElement("h3");
    titleEl.className = "project-card__title";
    titleEl.textContent = title;

    var descEl = document.createElement("p");
    descEl.className = "project-card__desc";
    descEl.textContent = desc;

    var footer = document.createElement("div");
    footer.className = "project-card__footer";

    var year = document.createElement("span");
    year.className = "project-card__year";
    year.textContent = project.year || "";

    var link = document.createElement("span");
    link.className = "project-card__link";
    link.innerHTML =
      '<span>' + getI18n("projectsPage.viewProject", "View project") + "</span>" + forwardIcon();

    footer.appendChild(year);
    footer.appendChild(link);

    body.appendChild(titleEl);
    body.appendChild(descEl);
    body.appendChild(footer);

    card.appendChild(media);
    card.appendChild(body);

    return card;
  }

  function updateResultsCount(count) {
    if (!resultsEl) return;
    if (count === 1) {
      resultsEl.textContent = getI18n("projectsPage.resultsCount.one", "1 project");
    } else {
      var template = getI18n("projectsPage.resultsCount.other", "{count} projects");
      resultsEl.textContent = template.replace("{count}", count);
    }
  }

  function renderEmptyState() {
    grid.innerHTML = "";
    var empty = document.createElement("div");
    empty.className = "projects__empty";
    var h3 = document.createElement("h3");
    h3.textContent = getI18n("projectsPage.empty", "No projects match your search yet.");
    var p = document.createElement("p");
    p.textContent = getI18n("projectsPage.emptyHint", "Try a different keyword or filter.");
    empty.appendChild(h3);
    empty.appendChild(p);
    grid.appendChild(empty);
  }

  function renderErrorState() {
    grid.innerHTML = "";
    var error = document.createElement("div");
    error.className = "projects__empty";
    var p = document.createElement("p");
    p.textContent = getI18n("projectsPage.error", "We couldn't load the projects right now.");
    error.appendChild(p);
    grid.appendChild(error);
  }

  function render() {
    if (!grid || !projectsCache) return;

    var filtered = filterProjects(projectsCache, currentLang);
    updateResultsCount(filtered.length);

    if (filtered.length === 0) {
      renderEmptyState();
      return;
    }

    grid.innerHTML = "";
    var fragment = document.createDocumentFragment();
    filtered.forEach(function (project) {
      fragment.appendChild(buildCard(project, currentLang));
    });
    grid.appendChild(fragment);
  }

  function setActiveFilter(category) {
    state.category = category;
    if (filterButtons) {
      filterButtons.forEach(function (btn) {
        var isActive = btn.getAttribute("data-filter") === category;
        btn.classList.toggle("is-active", isActive);
        btn.setAttribute("aria-pressed", isActive ? "true" : "false");
      });
    }
    render();
  }

  function initFilters() {
    filterButtons = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));
    if (!filterButtons.length) return;
    filterButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        setActiveFilter(btn.getAttribute("data-filter"));
      });
    });
  }

  function initSearch() {
    searchInput = document.getElementById("projectsSearch");
    if (!searchInput) return;
    searchInput.addEventListener("input", function () {
      var value = searchInput.value;
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(function () {
        state.query = value;
        render();
      }, 180);
    });
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

  function initProjectsGrid() {
    grid = document.getElementById("projectsGrid");
    resultsEl = document.getElementById("projectsResults");
    if (!grid) return;

    initFilters();
    initSearch();

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
        console.error("[projects.js]", err);
        renderErrorState();
      });
  }

  document.addEventListener("jollypanda:languagechange", function (event) {
    currentLang = (event.detail && event.detail.lang) || currentLang;
    loadDictionaryThenRender();
  });

  document.addEventListener("DOMContentLoaded", initProjectsGrid);

  window.JollyPandaProjects = { CATEGORIES: CATEGORIES };
})();
