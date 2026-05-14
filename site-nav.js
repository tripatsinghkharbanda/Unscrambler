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
    s.textContent =
      /* Logo standardization */
      '.logo{font-size:17px!important;font-weight:800!important;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important}'
      + '.logo-pro,.lp{background:none!important;color:var(--primary,var(--pr,#2563eb))!important;font-size:inherit!important;padding:0!important;border-radius:0!important;font-weight:700!important;letter-spacing:normal!important}'
      /* Nav */
      + '.site-nav{display:flex;align-items:center;gap:2px;flex:1;justify-content:flex-end;margin:0 8px}'
      + '.site-nav a{padding:5px 10px;font-size:13px;font-weight:600;color:var(--text-2,var(--t2,#94a3b8));border-radius:6px;text-decoration:none;transition:color .15s,background .15s;white-space:nowrap}'
      + '.site-nav a:hover{color:var(--primary,var(--pr,#2563eb));background:rgba(37,99,235,.08);text-decoration:none}'
      + '.site-nav a.sn-wl{color:#4ade80!important;font-weight:700}'
      + '.site-nav a.sn-wl:hover{background:rgba(83,141,78,.15)!important}'
      + '[data-theme="light"] .site-nav a.sn-wl{color:#16a34a!important}'
      /* Buttons */
      + '.sn-theme-btn{background:none;border:1px solid var(--border,var(--b,#334155));border-radius:8px;padding:6px;cursor:pointer;color:var(--text-2,var(--t2,#94a3b8));display:flex;align-items:center;flex-shrink:0;margin-left:6px;transition:border-color .15s}'
      + '.sn-theme-btn:hover{border-color:var(--primary,#2563eb)}'
      + '.sn-ham{display:none;background:none;border:1px solid var(--border,var(--b,#334155));border-radius:8px;padding:7px;cursor:pointer;color:var(--text-2,var(--t2,#94a3b8));align-items:center;flex-shrink:0;margin-left:6px;transition:border-color .15s}'
      + '.sn-ham:hover{border-color:var(--primary,#2563eb)}'
      /* Desktop */
      + '@media(min-width:641px){.site-nav{display:flex!important}}'
      /* Mobile */
      + '@media(max-width:640px){'
      + '.site-nav{display:none;position:fixed;top:56px;left:0;right:0;flex-direction:column;gap:0;'
      + 'background:var(--bg-alt,var(--bg-s,var(--ba,#1e293b)));border-bottom:1px solid var(--border,var(--b,#334155));'
      + 'padding:8px 12px;z-index:999;box-shadow:0 8px 24px rgba(0,0,0,.25)}'
      + '.site-nav.sn-open{display:flex!important}'
      + '.site-nav a{padding:11px 14px;font-size:15px;border-radius:8px;border-bottom:1px solid var(--border,var(--b,#334155))}'
      + '.site-nav a:last-child{border-bottom:none}'
      + '.sn-ham{display:flex}'
      + '}';
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

    /* Hamburger button */
    var hamIcon = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
    var closeIcon = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
    var ham = document.createElement('button');
    ham.className = 'sn-ham';
    ham.setAttribute('aria-label', 'Toggle navigation');
    ham.setAttribute('aria-expanded', 'false');
    ham.innerHTML = hamIcon;
    container.appendChild(ham);
    ham.addEventListener('click', function() {
      var isOpen = nav.classList.toggle('sn-open');
      ham.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      ham.innerHTML = isOpen ? closeIcon : hamIcon;
    });
    nav.addEventListener('click', function(e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('sn-open');
        ham.setAttribute('aria-expanded', 'false');
        ham.innerHTML = hamIcon;
      }
    });
    document.addEventListener('click', function(e) {
      if (!container.contains(e.target) && nav.classList.contains('sn-open')) {
        nav.classList.remove('sn-open');
        ham.setAttribute('aria-expanded', 'false');
        ham.innerHTML = hamIcon;
      }
    });
  }

  /* ── Author bar (always injected, appended inside footer) ──────────────── */
  if (!document.querySelector('.wup-author-bar')) {
    var as = document.createElement('style');
    as.textContent = '.wup-author-bar{display:flex;align-items:center;justify-content:center;gap:8px;font-size:13px;color:var(--t2,var(--text-2,var(--t3,#94A3B8)));padding:10px 16px;border-top:1px solid var(--bd,var(--border,var(--b,#334155)));margin-top:24px;flex-wrap:wrap;text-align:center}'
      + '.wup-author-bar svg{flex-shrink:0;color:var(--pr,var(--primary,var(--p,#2563EB)))}'
      + '.wup-author-bar a{color:var(--pr,var(--primary,var(--p,#2563EB)));text-decoration:none;font-weight:600}'
      + '.wup-author-bar a:hover{text-decoration:underline}';
    document.head.appendChild(as);
    var ab = document.createElement('div');
    ab.className = 'wup-author-bar';
    ab.setAttribute('itemscope', '');
    ab.setAttribute('itemtype', 'https://schema.org/Person');
    ab.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
      + '<span>Written &amp; reviewed by <a href="/author/wordpro-editorial-team.html" itemprop="url"><span itemprop="name">Unscramble Words Pro Editorial Team</span></a> &mdash; Last&nbsp;updated:&nbsp;May&nbsp;2026</span>';
    var footer = document.querySelector('footer');
    if (footer) footer.appendChild(ab);
    else document.body.appendChild(ab);
  }
})();
