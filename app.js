/* ===================================================================
   Word Unscrambler Pro — app.js
   High-performance real-time word finder with Scrabble scoring,
   filtering, sorting, favorites, and dark/light theme.
   =================================================================== */

(function () {
  "use strict";

  /* ---------- DOM refs ---------- */
  var $ = function (id) { return document.getElementById(id); };
  var dom = {
    input:        $("letterInput"),
    clearBtn:     $("clearBtn"),
    charCount:    $("charCount"),
    resultCount:  $("resultCount"),
    dictBadge:    $("dictBadge"),
    filterToggle: $("filterToggle"),
    filterPanel:  $("filterPanel"),
    sortBy:       $("sortBy"),
    fLen:         $("fLen"),
    fStarts:      $("fStarts"),
    fEnds:        $("fEnds"),
    fContains:    $("fContains"),
    resultsGrid:  $("resultsGrid"),
    showingNote:  $("showingNote"),
    emptyState:   $("emptyState"),
    favSection:   $("favSection"),
    favGrid:      $("favGrid"),
    themeToggle:  $("themeToggle"),
    iconSun:      $("iconSun"),
    iconMoon:     $("iconMoon"),
    toast:        $("toast"),
    trustBar:     $("trustBar"),
    geoBanner:    $("geoBanner"),
    bestSection:  $("bestSection"),
    bestGrid:     $("bestGrid"),
    copyAllBtn:   $("copyAllBtn"),
    recentSection:$("recentSection"),
    recentChips:  $("recentChips"),
    recentClear:  $("recentClear")
  };

  /* ---------- Constants ---------- */
  var MAX_RENDER  = 250;
  var DEBOUNCE_MS = 40;

  var LETTER_SCORE = {
    a:1,b:3,c:3,d:2,e:1,f:4,g:2,h:4,i:1,j:8,k:5,l:1,m:3,
    n:1,o:1,p:3,q:10,r:1,s:1,t:1,u:1,v:4,w:4,x:8,y:4,z:10
  };

  var DICT_SOURCES = [
    "https://raw.githubusercontent.com/dolph/dictionary/master/enable1.txt",
    "https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt"
  ];
  var DB_NAME  = "unscramblerDB";
  var DB_VER   = 2;
  var STORE    = "words";
  var CACHE_KEY = "allWords_v2";

  /* ---------- Geo / Region ---------- */
  var GEO_REGIONS = {
    US: { name: "United States", flag: "\ud83c\uddfa\ud83c\uddf8", dict: "TWL", spelling: "US", demonym: "American" },
    GB: { name: "United Kingdom", flag: "\ud83c\uddec\ud83c\udde7", dict: "SOWPODS", spelling: "UK", demonym: "British" },
    CA: { name: "Canada", flag: "\ud83c\udde8\ud83c\udde6", dict: "TWL", spelling: "CA", demonym: "Canadian" },
    AU: { name: "Australia", flag: "\ud83c\udde6\ud83c\uddfa", dict: "SOWPODS", spelling: "AU", demonym: "Australian" },
    NZ: { name: "New Zealand", flag: "\ud83c\uddf3\ud83c\uddff", dict: "SOWPODS", spelling: "AU", demonym: "Kiwi" },
    IE: { name: "Ireland", flag: "\ud83c\uddee\ud83c\uddea", dict: "SOWPODS", spelling: "UK", demonym: "Irish" }
  };
  var userRegion = null;  // set by geo-detect

  /* ---------- Security: HTML escaping ---------- */
  function escapeHtml(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }
  function sanitizeWord(w) {
    return String(w).replace(/[^a-z]/gi, '').toLowerCase();
  }

  /* ---------- SVG templates ---------- */
  var SVG_HEART_OUT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
  var SVG_HEART_IN  = '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
  var SVG_COPY      = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';

  /* ---------- State ---------- */
  var wordSet   = new Set();
  var wordFreqs = {};          // word -> char-freq map
  var favorites = loadFavorites();

  var lastRaw   = "";          // last input text
  var cached    = [];          // unscrambled (before filters/sort)
  var lastRendered = [];       // words currently shown (for Copy All)
  var debounceTimer = null;
  var recentSearches = loadRecent();

  /* ================================================================
     DICTIONARY
     ================================================================ */

  function charFreq(s) {
    var f = {};
    for (var i = 0; i < s.length; i++) {
      var c = s[i];
      f[c] = (f[c] || 0) + 1;
    }
    return f;
  }

  function addWords(list) {
    for (var i = 0; i < list.length; i++) {
      var w = list[i].trim().toLowerCase();
      if (w.length >= 2 && w.length <= 15 && /^[a-z]+$/.test(w) && !wordSet.has(w)) {
        wordSet.add(w);
        wordFreqs[w] = charFreq(w);
      }
    }
  }

  function updateBadge(ready) {
    var count = wordSet.size;
    if (ready && count > 1000) {
      dom.dictBadge.textContent = count.toLocaleString() + " words";
      dom.dictBadge.className = "badge badge-ready";
    } else {
      dom.dictBadge.textContent = "Loading\u2026";
      dom.dictBadge.className = "badge badge-loading";
    }
  }

  /* --- IndexedDB cache --- */
  function openDB() {
    return new Promise(function (res, rej) {
      var r = indexedDB.open(DB_NAME, DB_VER);
      r.onupgradeneeded = function () {
        var db = r.result;
        if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
      };
      r.onsuccess = function () { res(r.result); };
      r.onerror   = function () { rej(r.error); };
    });
  }
  function getCached() {
    return openDB().then(function (db) {
      return new Promise(function (res, rej) {
        var tx = db.transaction(STORE, "readonly");
        var rq = tx.objectStore(STORE).get(CACHE_KEY);
        rq.onsuccess = function () { res(rq.result || null); };
        rq.onerror   = function () { rej(rq.error); };
      });
    });
  }
  function setCache(arr) {
    return openDB().then(function (db) {
      return new Promise(function (res, rej) {
        var tx = db.transaction(STORE, "readwrite");
        tx.objectStore(STORE).put(arr, CACHE_KEY);
        tx.oncomplete = function () { res(); };
        tx.onerror    = function () { rej(tx.error); };
      });
    });
  }

  /* --- Fetch from CDN --- */
  function fetchSource(url) {
    return fetch(url)
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(function (t) { return t.split(/\r?\n/); })
      .catch(function () { return []; });
  }

  function fetchAllSources() {
    return Promise.all(DICT_SOURCES.map(fetchSource))
      .then(function (results) {
        results.forEach(function (list) { addWords(list); });
        updateBadge(true);
        var all = []; wordSet.forEach(function (w) { all.push(w); });
        setCache(all).catch(function () {});
        recompute();
      })
      .catch(function () { updateBadge(true); });
  }

  function loadDictionary() {
    /* 1. Embedded */
    if (typeof DICTIONARY !== "undefined") addWords(DICTIONARY);
    updateBadge(false);

    /* 2. Check cache, then CDN */
    getCached()
      .then(function (arr) {
        if (arr && arr.length > 170000) {
          addWords(arr);
          updateBadge(true);
          recompute();
        } else {
          fetchAllSources();
        }
      })
      .catch(function () { fetchAllSources(); });
  }

  /* ================================================================
     SCRABBLE SCORING
     ================================================================ */
  function scoreWord(w) {
    var s = 0;
    for (var i = 0; i < w.length; i++) s += LETTER_SCORE[w[i]] || 0;
    return s;
  }

  /* ================================================================
     CORE LOGIC
     ================================================================ */

  function isSubset(wf, inputF) {
    for (var c in wf) { if ((inputF[c] || 0) < wf[c]) return false; }
    return true;
  }

  function findWords(letters) {
    var cleaned = letters.toLowerCase().replace(/[^a-z]/g, "");
    if (cleaned.length < 2) return [];
    var inputF = charFreq(cleaned);
    var out = [];
    wordSet.forEach(function (w) {
      if (w.length <= cleaned.length && isSubset(wordFreqs[w], inputF)) out.push(w);
    });
    return out;
  }

  /* ---------- Filters ---------- */
  function getFilters() {
    return {
      len:      parseInt(dom.fLen.value) || 0,
      starts:   dom.fStarts.value.toLowerCase().replace(/[^a-z]/g, ""),
      ends:     dom.fEnds.value.toLowerCase().replace(/[^a-z]/g, ""),
      contains: dom.fContains.value.toLowerCase().replace(/[^a-z]/g, "")
    };
  }

  function applyFilters(words, f) {
    return words.filter(function (w) {
      if (f.len > 0) {
        if (f.len >= 12 ? w.length < 12 : w.length !== f.len) return false;
      }
      if (f.starts && w.indexOf(f.starts) !== 0) return false;
      if (f.ends && w.indexOf(f.ends, w.length - f.ends.length) === -1) return false;
      if (f.contains) {
        for (var i = 0; i < f.contains.length; i++) {
          if (w.indexOf(f.contains[i]) === -1) return false;
        }
      }
      return true;
    });
  }

  /* ---------- Sort ---------- */
  function sortWords(arr, mode) {
    var s = arr.slice();
    switch (mode) {
      case "length-desc":  s.sort(function(a,b){ return b.length - a.length || a.localeCompare(b); }); break;
      case "length-asc":   s.sort(function(a,b){ return a.length - b.length || a.localeCompare(b); }); break;
      case "score-desc":   s.sort(function(a,b){ return scoreWord(b) - scoreWord(a) || a.localeCompare(b); }); break;
      case "score-asc":    s.sort(function(a,b){ return scoreWord(a) - scoreWord(b) || a.localeCompare(b); }); break;
      case "alpha":        s.sort(); break;
      case "group-length": s.sort(function(a,b){ return b.length - a.length || scoreWord(b) - scoreWord(a) || a.localeCompare(b); }); break;
      case "group-score":  s.sort(function(a,b){ return scoreWord(b) - scoreWord(a) || b.length - a.length || a.localeCompare(b); }); break;
    }
    return s;
  }

  function isGroupMode(mode) { return mode === "group-length" || mode === "group-score"; }

  function groupKey(word, mode) {
    if (mode === "group-length") return word.length;
    return scoreWord(word);
  }

  function groupLabel(key, mode) {
    if (mode === "group-length") return key + "-letter words";
    return key + " points";
  }

  /* ================================================================
     RENDERING
     ================================================================ */

  /* ---------- Build a group header element ---------- */
  function makeGroupHeader(label, count, bestWord) {
    var div = document.createElement("div");
    div.className = "group-header";
    var best = bestWord ? escapeHtml(bestWord) + " (" + scoreWord(bestWord) + " pts)" : "";
    div.innerHTML =
      '<span class="gh-label">' + escapeHtml(label) + '</span>' +
      '<span class="gh-count">' + count + ' word' + (count !== 1 ? 's' : '') + '</span>' +
      (best ? '<span class="gh-best">Best: ' + best + '</span>' : '');
    return div;
  }

  function render(words, totalBeforeFilter) {
    var grid = dom.resultsGrid;
    var total = words.length;
    var mode = dom.sortBy.value;
    var grouped = isGroupMode(mode);
    var limited = Math.min(total, MAX_RENDER);

    /* update count */
    if (dom.input.value.replace(/[^a-z]/gi, "").length < 2) {
      dom.resultCount.innerHTML = "Type letters above to start";
    } else if (total === 0) {
      dom.resultCount.innerHTML = "No words found";
    } else {
      var extra = totalBeforeFilter !== total
        ? " <span style='color:var(--text-2);font-weight:400'>(filtered from " + totalBeforeFilter + ")</span>"
        : "";
      dom.resultCount.innerHTML = "<span>" + total + "</span> word" + (total !== 1 ? "s" : "") + " found" + extra;
    }

    /* empty state */
    dom.emptyState.classList.toggle("hidden", total > 0 || dom.input.value.length > 0);

    /* showing note */
    if (total > MAX_RENDER) {
      dom.showingNote.textContent = "Showing " + MAX_RENDER + " of " + total + " words";
      dom.showingNote.classList.remove("hidden");
    } else {
      dom.showingNote.classList.add("hidden");
    }

    /* find top score (across all visible words) */
    var topScore = 0;
    for (var t = 0; t < limited; t++) {
      var sc = scoreWord(words[t]);
      if (sc > topScore) topScore = sc;
    }

    /* ---- Grouped rendering ---- */
    if (grouped && limited > 0) {
      /* Pre-compute groups for visible words */
      var groups = [];  // [{key, label, words, bestWord}]
      var gMap = {};    // key -> index in groups
      for (var g = 0; g < limited; g++) {
        var gw = words[g];
        var gk = groupKey(gw, mode);
        if (!(gk in gMap)) {
          gMap[gk] = groups.length;
          groups.push({ key: gk, label: groupLabel(gk, mode), words: [], bestWord: gw, bestScore: scoreWord(gw) });
        }
        var grp = groups[gMap[gk]];
        grp.words.push(gw);
        var gs = scoreWord(gw);
        if (gs > grp.bestScore) { grp.bestScore = gs; grp.bestWord = gw; }
      }

      var frag = document.createDocumentFragment();
      for (var gi = 0; gi < groups.length; gi++) {
        frag.appendChild(makeGroupHeader(groups[gi].label, groups[gi].words.length, groups[gi].bestWord));
        for (var gj = 0; gj < groups[gi].words.length; gj++) {
          frag.appendChild(buildCard(groups[gi].words[gj], topScore));
        }
      }
      grid.innerHTML = "";
      grid.appendChild(frag);
      return;
    }

    /* ---- Flat rendering ---- */
    var frag2 = document.createDocumentFragment();
    for (var i = 0; i < limited; i++) {
      frag2.appendChild(buildCard(words[i], topScore));
    }
    grid.innerHTML = "";
    grid.appendChild(frag2);
  }

  /* ---------- Build a single word card ---------- */
  function buildCard(w, topScore) {
    var score = scoreWord(w);
    var isTop = score === topScore && topScore > 4;
    var isFav = favorites.has(w);
    var card = document.createElement("div");
    card.className = "word-card" + (isTop ? " top" : "");
    var safe = escapeHtml(w);
    card.innerHTML =
      '<span class="word-text">' + safe + "</span>" +
      '<span class="word-score">' + score + " pts</span>" +
      '<div class="word-actions">' +
        '<button class="act-btn fav-btn' + (isFav ? " fav-on" : "") + '" data-w="' + safe + '" aria-label="Save">' + (isFav ? SVG_HEART_IN : SVG_HEART_OUT) + "</button>" +
        '<button class="act-btn copy-btn" data-w="' + safe + '" aria-label="Copy">' + SVG_COPY + "</button>" +
      "</div>";
    return card;
  }

  /* ---------- Re-run pipeline from cached ---------- */
  function pipeline() {
    var f = getFilters();
    var filtered = applyFilters(cached, f);
    var sorted   = sortWords(filtered, dom.sortBy.value);
    lastRendered = sorted;
    render(sorted, cached.length);
    renderBest(cached);
    dom.copyAllBtn.classList.toggle("hidden", sorted.length === 0);
  }

  /* ---------- Full recompute (input changed) ---------- */
  function recompute() {
    var raw = dom.input.value.replace(/[^a-z]/gi, "").toLowerCase();
    if (raw === lastRaw && cached.length > 0) { pipeline(); return; }
    lastRaw = raw;
    cached = findWords(raw);
    pipeline();
  }

  /* ================================================================
     FAVORITES
     ================================================================ */
  function loadFavorites() {
    try {
      var s = localStorage.getItem("wup_favs");
      if (!s) return new Set();
      var arr = JSON.parse(s);
      if (!Array.isArray(arr)) return new Set();
      var safe = arr.filter(function (w) { return typeof w === 'string' && /^[a-z]{2,15}$/.test(w); });
      return new Set(safe);
    } catch (e) { return new Set(); }
  }
  function saveFavorites() {
    try { localStorage.setItem("wup_favs", JSON.stringify(Array.from(favorites))); } catch (e) {}
  }
  function toggleFavorite(word) {
    if (favorites.has(word)) favorites.delete(word); else favorites.add(word);
    saveFavorites();
    pipeline();
    renderFavorites();
  }
  function renderFavorites() {
    if (favorites.size === 0) { dom.favSection.classList.add("hidden"); return; }
    dom.favSection.classList.remove("hidden");
    var arr = sortWords(Array.from(favorites), "score-desc");
    var frag = document.createDocumentFragment();
    arr.forEach(function (w) {
      var score = scoreWord(w);
      var card = document.createElement("div");
      card.className = "word-card";
      var safe = escapeHtml(w);
    card.innerHTML =
        '<span class="word-text">' + safe + "</span>" +
        '<span class="word-score">' + score + " pts</span>" +
        '<div class="word-actions">' +
          '<button class="act-btn fav-btn fav-on" data-w="' + safe + '" aria-label="Remove">' + SVG_HEART_IN + "</button>" +
          '<button class="act-btn copy-btn" data-w="' + safe + '" aria-label="Copy">' + SVG_COPY + "</button>" +
        "</div>";
      frag.appendChild(card);
    });
    dom.favGrid.innerHTML = "";
    dom.favGrid.appendChild(frag);
  }

  /* ================================================================
     BEST WORDS (top 5 highest-scoring from current results)
     ================================================================ */
  function renderBest(words) {
    if (words.length === 0) {
      dom.bestSection.classList.add("hidden");
      return;
    }
    var scored = words.map(function (w) { return { w: w, s: scoreWord(w) }; });
    scored.sort(function (a, b) { return b.s - a.s || a.w.localeCompare(b.w); });
    var top5 = scored.slice(0, 5);
    var topScore = top5[0].s;

    var frag = document.createDocumentFragment();
    top5.forEach(function (item) {
      var card = buildCard(item.w, topScore);
      card.style.animationDelay = "0ms";
      frag.appendChild(card);
    });
    dom.bestGrid.innerHTML = "";
    dom.bestGrid.appendChild(frag);
    dom.bestSection.classList.remove("hidden");
  }

  /* ================================================================
     RECENT SEARCHES (persisted in localStorage)
     ================================================================ */
  var MAX_RECENT = 8;

  function loadRecent() {
    try {
      var s = localStorage.getItem("wup_recent");
      if (!s) return [];
      var arr = JSON.parse(s);
      if (!Array.isArray(arr)) return [];
      return arr.filter(function (w) { return typeof w === 'string' && /^[a-z]{2,15}$/.test(w); }).slice(0, MAX_RECENT);
    } catch (e) { return []; }
  }
  function saveRecent() {
    try { localStorage.setItem("wup_recent", JSON.stringify(recentSearches)); } catch (e) {}
  }
  function addRecent(letters) {
    if (!letters || letters.length < 2) return;
    var idx = recentSearches.indexOf(letters);
    if (idx !== -1) recentSearches.splice(idx, 1);
    recentSearches.unshift(letters);
    if (recentSearches.length > MAX_RECENT) recentSearches.length = MAX_RECENT;
    saveRecent();
    renderRecent();
  }
  function renderRecent() {
    if (recentSearches.length === 0) {
      dom.recentSection.classList.add("hidden");
      return;
    }
    dom.recentSection.classList.remove("hidden");
    var frag = document.createDocumentFragment();
    recentSearches.forEach(function (letters) {
      var btn = document.createElement("button");
      btn.className = "recent-chip";
      btn.textContent = letters;
      btn.dataset.letters = letters;
      frag.appendChild(btn);
    });
    dom.recentChips.innerHTML = "";
    dom.recentChips.appendChild(frag);
  }

  /* ================================================================
     THEME
     ================================================================ */
  function loadTheme() { return localStorage.getItem("wup_theme") || "dark"; }
  function applyTheme(t) {
    var safe = (t === "light") ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", safe);
    localStorage.setItem("wup_theme", safe);
    dom.iconSun.classList.toggle("hidden", t === "dark");
    dom.iconMoon.classList.toggle("hidden", t === "light");
  }

  /* ================================================================
     TOAST
     ================================================================ */
  var toastTimer = null;
  function showToast(msg) {
    dom.toast.textContent = msg;
    dom.toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { dom.toast.classList.remove("show"); }, 1800);
  }

  function copyWord(word) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(word).then(function () { showToast("Copied \"" + escapeHtml(word) + "\""); });
    } else {
      showToast(word);
    }
  }

  /* ================================================================
     EVENT HANDLERS
     ================================================================ */

  /* --- Input (debounced real-time) --- */
  dom.input.addEventListener("input", function () {
    var v = dom.input.value.replace(/[^a-z]/gi, "");
    if (v !== dom.input.value) dom.input.value = v;
    dom.charCount.textContent = v.length;
    document.querySelector(".char-count").classList.toggle("max", v.length >= 15);
    dom.clearBtn.classList.toggle("hidden", v.length === 0);

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function () {
      recompute();
      addRecent(dom.input.value.replace(/[^a-z]/gi, "").toLowerCase());
    }, DEBOUNCE_MS);
  });

  /* --- Clear --- */
  dom.clearBtn.addEventListener("click", function () {
    dom.input.value = "";
    dom.charCount.textContent = "0";
    document.querySelector(".char-count").classList.remove("max");
    dom.clearBtn.classList.add("hidden");
    lastRaw = "";
    cached = [];
    lastRendered = [];
    render([], 0);
    renderBest([]);
    dom.copyAllBtn.classList.add("hidden");
    dom.input.focus();
  });

  /* --- Filter toggle --- */
  dom.filterToggle.addEventListener("click", function () {
    var panel = dom.filterPanel;
    var open = !panel.classList.contains("collapsed");
    panel.classList.toggle("collapsed");
    dom.filterToggle.classList.toggle("active", !open);
  });

  /* --- Filter / sort change --- */
  [dom.fLen, dom.fStarts, dom.fEnds, dom.fContains, dom.sortBy].forEach(function (el) {
    el.addEventListener("input", pipeline);
    el.addEventListener("change", pipeline);
  });

  /* restrict filter text inputs to letters only */
  [dom.fStarts, dom.fEnds, dom.fContains].forEach(function (el) {
    el.addEventListener("input", function () {
      el.value = el.value.replace(/[^a-z]/gi, "").toLowerCase();
    });
  });

  /* --- Popular chips --- */
  document.querySelectorAll(".chip[data-letters]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      dom.input.value = btn.dataset.letters;
      dom.input.dispatchEvent(new Event("input"));
    });
  });

  /* --- Results click delegation (copy / fav) --- */
  function handleGridClick(e) {
    var btn = e.target.closest(".act-btn");
    if (!btn) return;
    var w = btn.dataset.w;
    if (!w) return;
    if (btn.classList.contains("copy-btn")) {
      copyWord(w);
    } else if (btn.classList.contains("fav-btn")) {
      toggleFavorite(w);
    }
  }
  dom.resultsGrid.addEventListener("click", handleGridClick);
  dom.favGrid.addEventListener("click", handleGridClick);
  dom.bestGrid.addEventListener("click", handleGridClick);

  /* --- Copy All --- */
  dom.copyAllBtn.addEventListener("click", function () {
    if (lastRendered.length === 0) return;
    var text = lastRendered.join(", ");
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(function () {
        showToast("Copied " + lastRendered.length + " words");
      });
    } else {
      showToast("Copied " + lastRendered.length + " words");
    }
  });

  /* --- Recent search chips --- */
  dom.recentChips.addEventListener("click", function (e) {
    var btn = e.target.closest(".recent-chip");
    if (!btn || !btn.dataset.letters) return;
    dom.input.value = btn.dataset.letters;
    dom.input.dispatchEvent(new Event("input"));
  });

  /* --- Clear recent --- */
  dom.recentClear.addEventListener("click", function () {
    recentSearches = [];
    saveRecent();
    renderRecent();
  });

  /* --- Theme toggle --- */
  dom.themeToggle.addEventListener("click", function () {
    var current = document.documentElement.getAttribute("data-theme");
    applyTheme(current === "dark" ? "light" : "dark");
  });

  /* --- Keyboard shortcut: Escape to clear --- */
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && document.activeElement === dom.input) {
      dom.clearBtn.click();
    }
  });

  /* ================================================================
     GEO-DETECTION & REGIONAL PERSONALIZATION
     ================================================================ */

  function detectGeo() {
    /* Try ipapi.co (free, no key needed, CORS-friendly) */
    fetch("https://ipapi.co/json/", { mode: "cors" })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (data) {
        var code = (data.country_code || "").toUpperCase();
        var tz = data.timezone || "";
        userRegion = GEO_REGIONS[code] || null;
        applyRegion(code, data.city || "", tz);
      })
      .catch(function () {
        /* silent fallback — use defaults */
      });
  }

  function applyRegion(code, city, tz) {
    var r = userRegion;
    if (!r) return;

    /* Update trust bar with localised message */
    var safeCity = city ? escapeHtml(city) + ", " : "";
    dom.trustBar.innerHTML =
      r.flag + " " + safeCity + escapeHtml(r.name) +
      " &mdash; Using <strong>" + escapeHtml(r.dict) + " dictionary</strong>. " +
      "Proudly built for word game players across \ud83c\uddfa\ud83c\uddf8 USA, \ud83c\uddec\ud83c\udde7 UK, \ud83c\udde8\ud83c\udde6 Canada &amp; \ud83c\udde6\ud83c\uddfa Australia.";

    /* Show geo banner with personalised tip */
    var tip = getTimeTip(tz, r);
    if (tip) {
      dom.geoBanner.textContent = tip;
      dom.geoBanner.classList.remove("hidden");
    }

    /* Update HTML lang for subtle localisation */
    if (code === "GB" || code === "IE") document.documentElement.lang = "en-GB";
    else if (code === "AU" || code === "NZ") document.documentElement.lang = "en-AU";
    else if (code === "CA") document.documentElement.lang = "en-CA";
  }

  function getTimeTip(tz, region) {
    try {
      var h = new Date().toLocaleString("en-US", { timeZone: tz, hour: "numeric", hour12: false });
      var hour = parseInt(h);
      if (hour >= 18 && hour <= 23) {
        return "\u2728 Peak Scrabble hour in " + region.name + "! Sharpen your game with our " + region.dict + " word finder.";
      } else if (hour >= 0 && hour < 6) {
        return "\ud83c\udf19 Late-night word game session? Our " + region.dict + " dictionary has you covered.";
      } else if (hour >= 6 && hour < 12) {
        return "\u2615 Good morning! Start your day with a quick Wordle solve or Scrabble practice.";
      } else if (hour >= 12 && hour < 18) {
        return "\ud83c\udfaf Afternoon word game session? Find every word from your letters instantly.";
      }
    } catch (e) {}
    return "";
  }

  /* ================================================================
     INIT
     ================================================================ */
  applyTheme(loadTheme());
  renderFavorites();
  renderRecent();
  loadDictionary();
  detectGeo();

})();
