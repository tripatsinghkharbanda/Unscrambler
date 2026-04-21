/**
 * generate-pages.js
 * Generates 100 SEO-optimised HTML pages for unscramblewordspro.com
 * Each page targets "words with letters {X}", "unscramble {X}", "anagram of {X}"
 *
 * Usage:  node generate-pages.js
 * Output: ./pages/words-from-{letters}.html  (100 files)
 */

const fs = require("fs");
const path = require("path");
const https = require("https");

/* ── 100 curated letter combos (3-7 letters, high search value) ── */
const COMBOS = [
  // 3-letter
  "ate","ape","art","ear","eat","era","net","ore","tea","tin",
  // 4-letter
  "acer","abet","arts","bale","care","dare","earn","fate","gale","hare",
  "isle","lace","mane","nape","pale","race","sale","tale","vane","wane",
  // 5-letter
  "angel","brace","crane","dealt","earth","feast","grain","heart","irate",
  "leapt","mango","ocean","parse","raise","sauce","tease","unite","waste",
  "adore","bleat","crate","dream","glare","haste","lemon","meats","reign",
  "slate","trace","arena","beast","cheap","gears","lance","onset","pearl",
  "roast","snare","steam","stare","tears","notes","rinse","share","stone",
  // 6-letter
  "racing","baster","castle","detail","eating","famine","garden","halter",
  "insert","listen","master","nestle","orange","palest","reason","sadnet",
  "tapers","travel","walnut","cradle","loaner","poster","remain","silent",
  "stream","thread","winter",
  // 7-letter
  "eastern","roasted","saltine","nastier","realign","strange","plaster",
  "storing","leading","claimed","painter","coaster","trading","reliant",
  "threads"
];

const DOMAIN = "https://unscramblewordspro.com";
const OUT_DIR = path.join(__dirname, "pages");

const LETTER_SCORE = {
  a:1,b:3,c:3,d:2,e:1,f:4,g:2,h:4,i:1,j:8,k:5,l:1,m:3,
  n:1,o:1,p:3,q:10,r:1,s:1,t:1,u:1,v:4,w:4,x:8,y:4,z:10
};

function scoreWord(w) {
  let s = 0;
  for (const ch of w) s += LETTER_SCORE[ch] || 0;
  return s;
}

function charFreq(s) {
  const f = {};
  for (const c of s) f[c] = (f[c] || 0) + 1;
  return f;
}

function isSubset(wf, inputF) {
  for (const c in wf) { if ((inputF[c] || 0) < wf[c]) return false; }
  return true;
}

function findWords(letters, dict) {
  const cleaned = letters.toLowerCase().replace(/[^a-z]/g, "");
  if (cleaned.length < 2) return [];
  const inputF = charFreq(cleaned);
  const results = [];
  for (const w of dict) {
    if (w.length >= 2 && w.length <= cleaned.length) {
      if (isSubset(charFreq(w), inputF)) results.push(w);
    }
  }
  results.sort((a, b) => b.length - a.length || scoreWord(b) - scoreWord(a) || a.localeCompare(b));
  return results;
}

function escapeHtml(s) {
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
          .replace(/"/g,"&quot;").replace(/'/g,"&#39;");
}

/* ── Fetch ENABLE dictionary ── */
function fetchDict(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        const words = data.split(/\r?\n/).map(w => w.trim().toLowerCase()).filter(w => /^[a-z]{2,15}$/.test(w));
        resolve(words);
      });
    }).on("error", reject);
  });
}

/* ── Intro paragraph templates (rotated to avoid duplication) ── */
const INTROS = [
  (L, n) => `Looking for words you can make from the letters <strong>${L.toUpperCase()}</strong>? You've come to the right place. Our word unscrambler found <strong>${n} valid words</strong> that can be formed using these letters. Whether you're playing Scrabble, Words With Friends, Wordle, or any other word game, this page gives you every possible word — sorted by length and scored for maximum points. Use the results below to find your best play, learn new vocabulary, and dominate your next game night.`,
  (L, n) => `Can you unscramble <strong>${L.toUpperCase()}</strong>? We can. Our powerful word finder has identified <strong>${n} words</strong> that use some or all of these letters. From short two-letter plays to longer high-scoring words, every result below is valid in the Scrabble TWL and Collins SOWPODS dictionaries. Bookmark this page for quick reference the next time these letters appear on your rack or in a word puzzle.`,
  (L, n) => `The letters <strong>${L.toUpperCase()}</strong> can be rearranged into <strong>${n} valid English words</strong>. This page lists every word our dictionary engine found, complete with Scrabble point values. Whether you're stuck in a crossword, solving an anagram, or need a clutch Scrabble play, scroll down to see the full list organised by word length and score.`,
  (L, n) => `Need to find every word hiding in <strong>${L.toUpperCase()}</strong>? Our anagram solver discovered <strong>${n} results</strong> using these letters. Each word below is verified against authoritative word-game dictionaries including ENABLE, Collins SOWPODS, and TWL. Use the scored results to pick the highest-value play in Scrabble, Words With Friends, or any tile-based word game.`,
  (L, n) => `Unscrambling <strong>${L.toUpperCase()}</strong> reveals <strong>${n} playable words</strong>. Below you'll find every valid combination sorted by length, each with its Scrabble score. These results work for Scrabble (US TWL and UK SOWPODS), Words With Friends, Wordle clue-solving, Jumble puzzles, and more. Study the list to sharpen your word-game skills and discover words you never knew existed.`,
];

/* ── Section: How to use these letters ── */
const HOW_SECTIONS = [
  (L) => `<p>In <strong>Scrabble</strong>, look for the longest word you can play from ${L.toUpperCase()} to maximise your score. If the board is tight, shorter words that land on premium squares (double/triple letter or word scores) can be even more valuable. Remember that two-letter words are essential for parallel plays.</p><p>For <strong>Wordle</strong>, if you know some of these letters are in today's answer, use our homepage tool to filter by word length (5), starting letter, ending letter, or contained letters to narrow down the possibilities.</p><p>In <strong>Words With Friends</strong>, the scoring differs slightly from Scrabble, but the word list overlaps heavily. The highest-scoring words below will generally be strong WWF plays too.</p>`,
  (L) => `<p>When playing <strong>Scrabble</strong> with letters like ${L.toUpperCase()}, prioritise words that use high-value tiles on premium squares. Check the score column below to find the strongest plays. Bingos (using all 7 tiles) earn a 50-point bonus — look for 7-letter words in the list.</p><p>For <strong>crossword puzzles</strong>, use the word-length groupings below to find words that fit your grid. Each word is a valid English dictionary entry.</p><p>If you're solving a <strong>Wordle</strong> or <strong>Jumble</strong>, start with the 5-letter and 6-letter results respectively — they're the most common target lengths for those games.</p>`,
  (L) => `<p>These letters — ${L.toUpperCase()} — offer several strong plays for <strong>Scrabble</strong>. Focus on the "Best Scoring Words" section above for maximum points. If you can place a word on a triple-word-score square, even a modest 5-letter word can yield 30+ points.</p><p>For <strong>word puzzle apps</strong> like Word Cookies, Wordscapes, or Text Twist, the full word list below gives you every valid answer. Work through the longer words first, then fill in the shorter ones.</p><p>Playing <strong>Words With Friends</strong>? The same words apply, though WWF uses a slightly different dictionary. The vast majority of results below are valid in both games.</p>`,
];

/* ── Pick N related page links (not self) ── */
function pickRelated(currentLetters, allCombos, n) {
  const others = allCombos.filter(c => c !== currentLetters);
  // prefer combos that share at least one letter
  const shared = others.filter(c => [...c].some(ch => currentLetters.includes(ch)));
  const pool = shared.length >= n ? shared : others;
  const picked = [];
  const used = new Set();
  while (picked.length < n && picked.length < pool.length) {
    const idx = Math.floor((picked.length * 7 + currentLetters.charCodeAt(0)) % pool.length);
    const candidate = pool[idx];
    if (!used.has(candidate)) { picked.push(candidate); used.add(candidate); }
    pool.splice(idx, 1);
  }
  return picked;
}

/* ── Group words by length ── */
function groupByLength(words) {
  const groups = {};
  for (const w of words) {
    const len = w.length;
    if (!groups[len]) groups[len] = [];
    groups[len].push(w);
  }
  return Object.keys(groups).sort((a,b) => b - a).map(len => ({
    len: Number(len), words: groups[len]
  }));
}

/* ── Build a single HTML page ── */
function buildPage(letters, words, allCombos, index) {
  const L = letters.toLowerCase();
  const U = letters.toUpperCase();
  const slug = `words-from-${L}`;
  const url = `${DOMAIN}/pages/${slug}.html`;
  const n = words.length;

  const best5 = words.slice().sort((a,b) => scoreWord(b) - scoreWord(a)).slice(0, 10);
  const groups = groupByLength(words);
  const related = pickRelated(L, allCombos, 5);
  const intro = INTROS[index % INTROS.length](L, n);
  const howSection = HOW_SECTIONS[index % HOW_SECTIONS.length](L);

  const title = `Unscramble ${U} | ${n} Words Found — Scrabble Solver`;
  const desc = `Unscramble ${U} to find ${n} valid words. See all words from letters ${U} with Scrabble scores. Free word finder for Scrabble, Wordle & word games.`;

  // Build words table for each length group
  let allWordsHTML = "";
  for (const g of groups) {
    allWordsHTML += `<h3>${g.len}-Letter Words (${g.words.length})</h3>\n`;
    allWordsHTML += `<div class="word-grid">\n`;
    for (const w of g.words) {
      const sc = scoreWord(w);
      allWordsHTML += `  <div class="word-item"><span class="wi-text">${escapeHtml(w)}</span><span class="wi-score">${sc} pts</span></div>\n`;
    }
    allWordsHTML += `</div>\n`;
  }

  // Best words section
  let bestHTML = "";
  for (const w of best5) {
    const sc = scoreWord(w);
    bestHTML += `  <div class="word-item best"><span class="wi-text">${escapeHtml(w)}</span><span class="wi-score">${sc} pts</span></div>\n`;
  }

  // Related links
  let relatedHTML = "";
  for (const r of related) {
    relatedHTML += `    <a href="words-from-${r}.html" class="related-link">Words from ${r.toUpperCase()}</a>\n`;
  }

  // FAQ schema
  const faqSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `What words can you make from ${U}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `You can make ${n} words from the letters ${U}. The highest scoring word is "${best5[0] || L}" worth ${best5[0] ? scoreWord(best5[0]) : 0} Scrabble points.`
        }
      },
      {
        "@type": "Question",
        "name": `How many words can be formed from the letters ${U}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `There are ${n} valid English words that can be formed using some or all of the letters ${U}. This includes ${groups.length} different word lengths.`
        }
      }
    ]
  });

  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.googlesyndication.com https://*.googletagservices.com https://*.google.com https://*.google.co.uk https://*.doubleclick.net https://*.googleadservices.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; connect-src https://*.googlesyndication.com https://*.google.com https://*.google.co.uk https://*.doubleclick.net https://*.googleapis.com https://*.adtrafficquality.google https://*.googleadservices.com; img-src 'self' data: https://*.googlesyndication.com https://*.google.com https://*.google.co.uk https://*.doubleclick.net https://*.googleusercontent.com; frame-src https://*.doubleclick.net https://*.googlesyndication.com https://*.google.com; base-uri 'self'; form-action 'self';">
  <meta http-equiv="X-Content-Type-Options" content="nosniff">
  <meta name="referrer" content="strict-origin-when-cross-origin">
  <meta name="google-adsense-account" content="ca-pub-6261071610831190">
  <title>${escapeHtml(title.slice(0, 60))}</title>
  <meta name="description" content="${escapeHtml(desc.slice(0, 160))}">
  <meta name="keywords" content="unscramble ${L}, words with letters ${L}, anagram of ${L}, ${L} scrabble words, ${L} word finder, words from ${L}, ${L} anagram solver, ${L} wordle">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${escapeHtml(title.slice(0, 60))}">
  <meta property="og:description" content="${escapeHtml(desc.slice(0, 160))}">
  <meta property="og:url" content="${url}">
  <meta property="og:site_name" content="Unscramble Words Pro">
  <script type="application/ld+json">${faqSchema}</script>
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    [data-theme="dark"] {
      --bg: #0F172A; --bg-alt: #1E293B; --bg-raised: #334155; --surface: #1E293B;
      --border: #334155; --border-hover: #475569; --text: #E5E7EB; --text-2: #94A3B8;
      --text-3: #64748B; --primary: #2563EB; --primary-bg: rgba(37,99,235,0.12);
      --accent: #22C55E; --accent-bg: rgba(34,197,94,0.12);
      --shadow: 0 4px 16px rgba(0,0,0,0.35); --shadow-sm: 0 1px 3px rgba(0,0,0,0.3);
    }
    [data-theme="light"] {
      --bg: #F8FAFC; --bg-alt: #FFFFFF; --bg-raised: #F1F5F9; --surface: #FFFFFF;
      --border: #E2E8F0; --border-hover: #CBD5E1; --text: #0F172A; --text-2: #475569;
      --text-3: #94A3B8; --primary: #2563EB; --primary-bg: rgba(37,99,235,0.07);
      --accent: #16A34A; --accent-bg: rgba(22,163,74,0.08);
      --shadow: 0 4px 16px rgba(0,0,0,0.08); --shadow-sm: 0 1px 3px rgba(0,0,0,0.06);
    }
    html { scroll-behavior: smooth; }
    body { font-family: 'Inter', system-ui, -apple-system, sans-serif; background: var(--bg); color: var(--text); line-height: 1.6; min-height: 100vh; }
    .container { max-width: 820px; margin: 0 auto; padding: 0 20px; }

    /* Trust bar */
    .trust-bar { background: var(--bg-alt); border-bottom: 1px solid var(--border); padding: 8px 20px; text-align: center; font-size: 12px; color: var(--text-2); }

    /* Header */
    .header { background: var(--bg-alt); border-bottom: 1px solid var(--border); padding: 14px 20px; }
    .header-inner { max-width: 820px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; }
    .logo { font-weight: 800; font-size: 18px; display: flex; align-items: center; gap: 10px; color: var(--text); text-decoration: none; letter-spacing: -0.02em; }
    .logo svg { color: var(--primary); flex-shrink: 0; filter: drop-shadow(0 0 6px rgba(37,99,235,0.4)); }
    .logo .logo-pro { color: var(--primary); }
    .theme-btn { background: var(--bg-raised); border: 1px solid var(--border); border-radius: 8px; padding: 6px; cursor: pointer; color: var(--text-2); display: flex; }
    .hidden { display: none !important; }

    /* Hero */
    .hero { padding: 36px 0 20px; text-align: center; }
    .hero h1 { font-size: 28px; font-weight: 800; letter-spacing: -0.03em; line-height: 1.2; margin-bottom: 8px; }
    .hero h1 .hl { color: var(--accent); }
    .hero .subtitle { font-size: 15px; color: var(--text-2); max-width: 560px; margin: 0 auto 16px; }
    .hero .try-link { display: inline-block; margin-top: 12px; padding: 10px 24px; background: var(--primary); color: #fff; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 15px; transition: background .15s; }
    .hero .try-link:hover { background: var(--primary); filter: brightness(1.15); }

    /* Sections */
    .section { padding: 28px 0; }
    .section h2 { font-size: 20px; font-weight: 700; margin-bottom: 12px; letter-spacing: -0.02em; }
    .section h3 { font-size: 16px; font-weight: 600; margin: 20px 0 10px; color: var(--text-2); }
    .section p { font-size: 15px; color: var(--text-2); margin-bottom: 12px; line-height: 1.7; }

    /* Word grid */
    .word-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 8px; margin-bottom: 16px; }
    .word-item {
      display: flex; align-items: center; justify-content: space-between;
      padding: 10px 14px; background: var(--surface); border: 1px solid var(--border);
      border-radius: 10px; transition: all .15s;
    }
    .word-item:hover { border-color: var(--border-hover); box-shadow: var(--shadow-sm); transform: translateY(-1px); }
    .word-item.best { border-color: var(--accent); background: var(--accent-bg); }
    .wi-text { font-weight: 600; font-size: 15px; letter-spacing: 0.02em; }
    .wi-score { font-size: 11px; font-weight: 600; padding: 2px 7px; border-radius: 6px; background: var(--bg-raised); color: var(--text-2); white-space: nowrap; }
    .word-item.best .wi-score { background: var(--accent-bg); color: var(--accent); }

    /* Related links */
    .related { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
    .related-link {
      padding: 6px 14px; font-size: 13px; font-weight: 500; border-radius: 8px;
      background: var(--surface); border: 1px solid var(--border); color: var(--primary);
      text-decoration: none; transition: all .15s;
    }
    .related-link:hover { background: var(--primary-bg); border-color: var(--primary); }

    /* Breadcrumb */
    .breadcrumb { padding: 12px 0; font-size: 13px; color: var(--text-3); }
    .breadcrumb a { color: var(--primary); text-decoration: none; }
    .breadcrumb a:hover { text-decoration: underline; }

    /* Summary box */
    .summary-box {
      background: var(--bg-alt); border: 1px solid var(--border); border-radius: 12px;
      padding: 20px; margin: 16px 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 16px;
    }
    .sb-item { text-align: center; }
    .sb-value { font-size: 24px; font-weight: 800; color: var(--accent); }
    .sb-label { font-size: 12px; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.05em; }

    /* Footer */
    .footer { border-top: 1px solid var(--border); padding: 20px; text-align: center; font-size: 12px; color: var(--text-3); margin-top: 40px; }
    .footer a { color: var(--primary); text-decoration: none; }
    .footer a:hover { text-decoration: underline; }
    .footer-links { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px 20px; margin-bottom: 10px; }

    /* How-to section */
    .how-section p { margin-bottom: 10px; }

    @media (max-width: 600px) {
      .hero h1 { font-size: 22px; }
      .word-grid { grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); }
      .summary-box { grid-template-columns: 1fr 1fr; }
    }
  </style>
</head>
<body>
  <div class="trust-bar">Proudly built for word game players across &#127482;&#127480; USA, &#127468;&#127463; UK, &#127464;&#127462; Canada &amp; &#127462;&#127482; Australia.</div>

  <header class="header">
    <div class="header-inner">
      <a href="${DOMAIN}/" class="logo">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
        Unscramble Words <span class="logo-pro">Pro</span>
      </a>
      <button id="themeToggle" class="theme-btn" aria-label="Toggle theme">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
      </button>
    </div>
  </header>

  <main class="container">
    <nav class="breadcrumb">
      <a href="${DOMAIN}/">Home</a> &rsaquo; <span>Unscramble ${U}</span>
    </nav>

    <section class="hero">
      <h1>Unscramble <span class="hl">${U}</span></h1>
      <p class="subtitle">${n} words found from the letters ${U} &mdash; with Scrabble scores for every result.</p>
      <a href="${DOMAIN}/" class="try-link">Try Your Own Letters &rarr;</a>
    </section>

    <div class="summary-box">
      <div class="sb-item"><div class="sb-value">${n}</div><div class="sb-label">Words Found</div></div>
      <div class="sb-item"><div class="sb-value">${groups.length}</div><div class="sb-label">Word Lengths</div></div>
      <div class="sb-item"><div class="sb-value">${best5[0] ? scoreWord(best5[0]) : 0}</div><div class="sb-label">Best Score</div></div>
      <div class="sb-item"><div class="sb-value">${best5[0] ? best5[0].length : 0}</div><div class="sb-label">Longest Word</div></div>
    </div>

    <section class="section">
      <h2>About the Letters ${U}</h2>
      <p>${intro}</p>
    </section>

    <section class="section">
      <h2>Best Scoring Words from ${U}</h2>
      <div class="word-grid">
${bestHTML}
      </div>
    </section>

    <section class="section">
      <h2>All ${n} Words from ${U}</h2>
${allWordsHTML}
    </section>

    <section class="section how-section">
      <h2>How to Use These Letters in Scrabble or Wordle</h2>
${howSection}
    </section>

    <section class="section">
      <h2>Explore More Letter Combinations</h2>
      <div class="related">
${relatedHTML}
      </div>
      <p style="margin-top: 16px;"><a href="${DOMAIN}/" style="color:var(--primary); font-weight: 600;">&#8592; Back to Word Unscrambler Pro</a></p>
    </section>
  </main>

  <footer class="footer">
    <div class="container">
      <div class="footer-links">
        <a href="${DOMAIN}/">Home</a>
        <a href="${DOMAIN}/about.html">About</a>
        <a href="${DOMAIN}/privacy.html">Privacy Policy</a>
        <a href="${DOMAIN}/terms.html">Terms of Service</a>
        <a href="${DOMAIN}/contact.html">Contact</a>
        <a href="${DOMAIN}/sitemap.html">Site Index</a>
      </div>
      <p>&copy; 2025 <a href="${DOMAIN}/">Unscramble Words Pro</a> &mdash; Free word finder, Scrabble solver &amp; anagram tool for US, UK, Canada &amp; Australia</p>
    </div>
  </footer>

  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6261071610831190"
     crossorigin="anonymous"></script>
  <script src="page-theme.js"></script>
</body>
</html>`;
}

/* ── Main ── */
async function main() {
  console.log("Fetching ENABLE dictionary...");
  let dict;
  try {
    dict = await fetchDict("https://raw.githubusercontent.com/dolph/dictionary/master/enable1.txt");
    console.log(`Loaded ${dict.length} words from ENABLE.`);
  } catch (e) {
    console.error("Failed to fetch dictionary. Using embedded fallback.");
    // Fallback: load embedded dictionary.js
    const src = fs.readFileSync(path.join(__dirname, "dictionary.js"), "utf8");
    const match = src.match(/\[[\s\S]*\]/);
    dict = match ? JSON.parse(match[0]) : [];
    console.log(`Loaded ${dict.length} words from embedded dictionary.`);
  }

  // De-duplicate combos
  const uniqueCombos = [...new Set(COMBOS.map(c => c.toLowerCase().replace(/[^a-z]/g, "")))];
  console.log(`Generating ${uniqueCombos.length} pages...`);

  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  let generated = 0;
  for (let i = 0; i < uniqueCombos.length; i++) {
    const letters = uniqueCombos[i];
    const words = findWords(letters, dict);
    if (words.length === 0) {
      console.warn(`  ⚠ Skipping "${letters}" — no words found.`);
      continue;
    }
    const html = buildPage(letters, words, uniqueCombos, i);
    const filename = `words-from-${letters}.html`;
    fs.writeFileSync(path.join(OUT_DIR, filename), html, "utf8");
    generated++;
    if (generated % 10 === 0) console.log(`  ${generated} pages written...`);
  }

  console.log(`\nDone! ${generated} HTML pages written to ${OUT_DIR}`);
}

main().catch(err => { console.error(err); process.exit(1); });
