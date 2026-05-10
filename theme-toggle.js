/* theme-toggle.js — shared across all pages */
(function () {
  /* ---- Theme toggle ---- */
  var btn = document.getElementById('themeToggle');
  if (btn) {
    var stored = localStorage.getItem('theme');
    if (stored) document.documentElement.setAttribute('data-theme', stored);
    btn.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme') || 'dark';
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }

  /* ---- Site navigation (Pattern A: .header-inner pages) ---- */
  var hi = document.querySelector('.header-inner');
  if (!hi) return;
  if (hi.querySelector('.site-nav, .nav-links, .hi-nav')) return; // already present

  var s = document.createElement('style');
  s.id = 'site-nav-css';
  s.textContent = '.site-nav{display:flex;align-items:center;gap:2px;flex:1;justify-content:flex-end;margin:0 8px}'
    + '.site-nav a{padding:5px 10px;font-size:13px;font-weight:600;color:var(--text-2,#94a3b8);border-radius:6px;text-decoration:none;transition:color .15s,background .15s;white-space:nowrap}'
    + '.site-nav a:hover{color:var(--primary,#2563eb);background:rgba(37,99,235,.08);text-decoration:none}'
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

  var themeBtn = hi.querySelector('button');
  if (themeBtn) hi.insertBefore(nav, themeBtn);
  else hi.appendChild(nav);
})();
