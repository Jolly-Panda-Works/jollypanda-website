/* ==========================================================================
   Jolly Panda Studio — team.js
   Fetches data/team.json and renders one card per member into #teamGrid.
   Nothing about the team is hardcoded in HTML — adding, removing, or
   editing an entry in team.json is enough to update the rendered section,
   no markup changes required.

   Bilingual fields: firstName / lastName / position are each objects of
   the form { "en": "...", "fa": "..." }. The grid re-renders automatically
   whenever the site language changes (see the jollypanda:languagechange
   event dispatched by language.js), so switching language updates names
   and positions instantly without a page reload.
   ========================================================================== */

(function () {
  "use strict";

  var DATA_URL = "data/team.json";
  var DEFAULT_LANG = "en";

  var teamGrid = null;
  var membersCache = null;
  var currentLang = document.documentElement.getAttribute("lang") || DEFAULT_LANG;

  /**
   * Reads a bilingual field like { en, fa }. Falls back to English, then
   * to whatever locale is present, so a partially-translated entry in
   * team.json still renders instead of showing a blank string.
   */
  function localize(field, lang) {
    if (field == null) return "";
    if (typeof field === "string") return field; // tolerate a plain string too
    return field[lang] || field[DEFAULT_LANG] || Object.values(field)[0] || "";
  }

  function buildCard(member, lang) {
    var hasLink = typeof member.link === "string" && member.link.trim() !== "";
    var firstName = localize(member.firstName, lang);
    var lastName = localize(member.lastName, lang);
    var position = localize(member.position, lang);
    var fullName = [firstName, lastName].filter(Boolean).join(" ");

    // Fully clickable when a link is provided (opens in a new tab);
    // otherwise a plain, non-interactive card — no href, no click target.
    var card = document.createElement(hasLink ? "a" : "article");
    card.className = "team-card" + (hasLink ? " team-card--linked" : "");

    if (hasLink) {
      card.href = member.link.trim();
      card.target = "_blank";
      card.rel = "noopener noreferrer";
      card.setAttribute("aria-label", fullName + (position ? " — " + position : ""));
    }

    var photoWrap = document.createElement("div");
    photoWrap.className = "team-card__photo";

    var img = document.createElement("img");
    img.src = member.image;
    img.alt = fullName;
    img.loading = "lazy";
    img.width = 200;
    img.height = 200;
    photoWrap.appendChild(img);

    var name = document.createElement("h3");
    name.className = "team-card__name";
    name.textContent = fullName;

    var positionEl = document.createElement("p");
    positionEl.className = "team-card__position";
    positionEl.textContent = position;

    card.appendChild(photoWrap);
    card.appendChild(name);
    card.appendChild(positionEl);

    if (hasLink) {
      var hint = document.createElement("span");
      hint.className = "team-card__hint";
      hint.setAttribute("aria-hidden", "true");
      // Reuses the site-wide direction-aware icon system (see .dir-icon
      // in style.css): two explicitly-drawn SVG variants, toggled purely
      // by CSS based on html[dir] — never a transform/mirror hack.
      hint.innerHTML =
        '<span class="dir-icon dir-icon--sm">' +
        '<svg class="dir-icon__ltr" viewBox="0 0 24 24" fill="none"><path d="M7 17L17 7M17 7H9M17 7v8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        '<svg class="dir-icon__rtl" viewBox="0 0 24 24" fill="none"><path d="M17 17L7 7M7 7h8M7 7v8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        "</span>";
      card.appendChild(hint);
    }

    return card;
  }

  function renderTeam(members, grid, lang) {
    grid.innerHTML = "";

    if (!Array.isArray(members) || members.length === 0) {
      var empty = document.createElement("p");
      empty.className = "team__empty";
      empty.setAttribute("data-i18n", "team.empty");
      empty.textContent = "Team information is coming soon.";
      grid.appendChild(empty);
      return;
    }

    var fragment = document.createDocumentFragment();
    members.forEach(function (member) {
      fragment.appendChild(buildCard(member, lang));
    });
    grid.appendChild(fragment);
    // Note: the grid itself carries [data-reveal-group], which animations.js
    // already observes on page load. CSS reveals any current children of a
    // ".is-visible" group live, so newly-inserted cards animate in for free
    // — no extra observer wiring needed here.
  }

  function initTeamSection() {
    teamGrid = document.getElementById("teamGrid");
    if (!teamGrid) return;

    fetch(DATA_URL)
      .then(function (res) {
        if (!res.ok) throw new Error("Failed to load team data: " + res.status);
        return res.json();
      })
      .then(function (members) {
        membersCache = members;
        renderTeam(membersCache, teamGrid, currentLang);
      })
      .catch(function (err) {
        console.error("[team.js]", err);
        teamGrid.innerHTML = "";
        var error = document.createElement("p");
        error.className = "team__empty";
        error.setAttribute("data-i18n", "team.error");
        error.textContent = "We couldn't load the team right now.";
        teamGrid.appendChild(error);
      });
  }

  // Re-render with the new language the instant the person switches —
  // no page reload, matching the rest of the site's i18n behavior.
  document.addEventListener("jollypanda:languagechange", function (event) {
    currentLang = (event.detail && event.detail.lang) || currentLang;
    if (membersCache && teamGrid) {
      renderTeam(membersCache, teamGrid, currentLang);
    }
  });

  document.addEventListener("DOMContentLoaded", initTeamSection);
})();
