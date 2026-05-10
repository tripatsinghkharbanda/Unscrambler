/* site-nav.js — Injects site navigation into pages that don't use theme-toggle.js */
(function () {
  /* Find header container: Pattern A (.header-inner) or Pattern B (.hdr .hi / header .hi) */
  var container = document.querySelector('.header-inner')
    || document.querySelector('.hdr .hi')
    || document.querySelector('header .hi');
  if (!container) return;

  /* Guard: skip if any nav is already present */
  if (container.querySelector('.site-nav, .nav-links, .hi-nav')) return;

  /* Guard: skip if theme-toggle.js already injected (id check) */
  if (document.getElementById('site-nav-css')) return;

  var s = document.createElement('style');
  s.id = 'site-nav-css';
  s.textContent = '.site-nav{display:flex;align-items:center;gap:2px;flex:1;justify-content:flex-end;margin:0 8px}'
    + '.site-nav a{padding:5px 10px;font-size:13px;font-weight:600;color:var(--text-2,var(--t2,#94a3b8));border-radius:6px;text-decoration:none;transition:color .15s,background .15s;white-space:nowrap}'
    + '.site-nav a:hover{color:var(--primary,var(--pr,#2563eb));background:rgba(37,99,235,.08);text-decoration:none}'
    + '.site-nav a.sn-wl{color:#4ade80!important;font-weight:700}'
    + '.site-nav a.sn-wl:hover{background:rgba(83,141,78,.15)!important}'
    + '@media(max-width:640px){.site-nav{display:none}}';
  document.head.appendChild(s);

  var nav = document.createElement('nav');
  nav.className = 'site-nav';
  nav.setAttribute('aria-label', 'Main navigation');
  nav.innerHTML = '<a href="/guides/">Guides</a>'
    + '<a href="/word-lists/">Word Lists</a>'
    + '<a href="/blog/">Blog</a>'
    + '<a href="/wordle/daily-challenge/" class="sn-wl">&#129001;&nbsp;Wordle</a>'
    + '<a href="/about.html">About</a>';

  var btn = container.querySelector('button');
  if (btn) container.insertBefore(nav, btn);
  else container.appendChild(nav);
})();
