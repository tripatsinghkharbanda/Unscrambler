/* site-nav.js — Injects site navigation and author bar */
(function () {
  /* Apply saved theme early to avoid flash */
  try { var _st = localStorage.getItem('wup_theme') || localStorage.getItem('theme'); if (_st) document.documentElement.setAttribute('data-theme', _st); } catch(e) {}

  /* ── Nav injection (requires a header container) ─────────────────────── */
  var container = document.querySelector('.header-inner')
    || document.querySelector('.hdr .hi')
    || document.querySelector('header .hi');

  if (container && !container.querySelector('.site-nav, .nav-links, .hi-nav') && !document.getElementById('site-nav-css')) {
    var s = document.createElement('style');
    s.id = 'site-nav-css';
    s.textContent = '.site-nav{display:flex;align-items:center;gap:2px;flex:1;justify-content:flex-end;margin:0 8px}'
      + '.site-nav a{padding:5px 10px;font-size:13px;font-weight:600;color:var(--text-2,var(--t2,#94a3b8));border-radius:6px;text-decoration:none;transition:color .15s,background .15s;white-space:nowrap}'
      + '.site-nav a:hover{color:var(--primary,var(--pr,#2563eb));background:rgba(37,99,235,.08);text-decoration:none}'
      + '.site-nav a.sn-wl{color:#4ade80!important;font-weight:700}'
      + '.site-nav a.sn-wl:hover{background:rgba(83,141,78,.15)!important}'
      + '[data-theme="light"] .site-nav a.sn-wl{color:#16a34a!important}'
      + '@media(max-width:640px){.site-nav{display:none}}'
      + '.sn-theme-btn{background:none;border:1px solid var(--border,var(--b,#334155));border-radius:8px;padding:6px;cursor:pointer;color:var(--text-2,var(--t2,#94a3b8));display:flex;align-items:center;flex-shrink:0;margin-left:6px}'
      + '.sn-theme-btn:hover{border-color:var(--primary,#2563eb)}';
    document.head.appendChild(s);

    var nav = document.createElement('nav');
    nav.className = 'site-nav';
    nav.setAttribute('aria-label', 'Main navigation');
    nav.innerHTML = '<a href="/guides/">Guides</a>'
      + '<a href="/word-lists/">Word Lists</a>'
      + '<a href="/blog/">Blog</a>'
      + '<a href="/wordle/daily-challenge/" class="sn-wl">&#129001;&nbsp;Wordle</a>'
      + '<a href="/about.html">About</a>'
      + '<a href="/editorial-team/">Editorial Team</a>';

    var btn = container.querySelector('button');
    if (btn) container.insertBefore(nav, btn);
    else container.appendChild(nav);

    if (!document.getElementById('themeToggle')) {
      var tb = document.createElement('button');
      tb.id = 'themeToggle';
      tb.className = 'sn-theme-btn';
      tb.setAttribute('aria-label', 'Toggle theme');
      tb.innerHTML = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
      container.appendChild(tb);
      tb.addEventListener('click', function() {
        var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        try { localStorage.setItem('wup_theme', next); } catch(e) {}
      });
    }
  }

  /* ── Author bar (always injected, independent of nav) ─────────────────── */
  if (!document.querySelector('.author-bar')) {
    var as = document.createElement('style');
    as.textContent = '.author-bar{display:flex;align-items:center;justify-content:center;gap:8px;padding:11px 20px;font-size:13px;text-align:center;flex-wrap:wrap;color:var(--text-3,var(--t3,#64748b));background:var(--bg-alt,var(--bg-s,#1e293b));border-top:1px solid var(--border,var(--b,#334155))}'
      + '.author-bar a{color:var(--primary,var(--p,var(--pr,#2563eb)));font-weight:600;text-decoration:none}'
      + '.author-bar a:hover{text-decoration:underline}'
      + '.author-bar-icon{flex-shrink:0;opacity:.7}';
    document.head.appendChild(as);
    var ab = document.createElement('div');
    ab.className = 'author-bar';
    ab.innerHTML = '<svg class="author-bar-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>'
      + 'Written &amp; reviewed by <a href="/editorial-team/">Unscramble Words Pro Editorial Team</a> &mdash; Last updated: May 2026';
    var footer = document.querySelector('footer, [class*="footer"]');
    if (footer) footer.parentNode.insertBefore(ab, footer);
    else document.body.appendChild(ab);
  }
})();
