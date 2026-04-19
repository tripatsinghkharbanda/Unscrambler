/* Theme toggle for SEO pages — keeps CSP script-src 'self' clean (no inline scripts) */
(function(){
  try {
    var t = localStorage.getItem('wup_theme');
    if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t);
  } catch(e) {}
  var btn = document.getElementById('themeToggle');
  if (btn) btn.addEventListener('click', function() {
    var cur = document.documentElement.getAttribute('data-theme');
    var next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('wup_theme', next); } catch(e) {}
  });
})();
