/**
 * generate-guides.js — Creates 8 new editorial guides in /guides/
 * Usage: node generate-guides.js
 */
'use strict';
const fs = require('fs'), path = require('path');
const D = 'https://unscramblewordspro.com';
const O = path.join(__dirname, 'guides');
const Y = '2026';

const CSS = [
  '*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}',
  '[data-theme=dark]{--bg:#0F172A;--ba:#1E293B;--br:#334155;--bd:#334155;',
  '--t:#E5E7EB;--t2:#94A3B8;--t3:#64748B;--pr:#2563EB;--pb:rgba(37,99,235,.12);--ac:#22C55E}',
  '[data-theme=light]{--bg:#F8FAFC;--ba:#fff;--br:#F1F5F9;--bd:#E2E8F0;',
  '--t:#0F172A;--t2:#475569;--t3:#94A3B8;--pr:#2563EB;--pb:rgba(37,99,235,.07);--ac:#16A34A}',
  'body{font-family:Inter,system-ui,sans-serif;background:var(--bg);color:var(--t);line-height:1.65}',
  '.hdr{background:var(--ba);border-bottom:1px solid var(--bd);padding:0 20px}',
  '.hi{max-width:760px;margin:0 auto;height:56px;display:flex;align-items:center;justify-content:space-between}',
  '.logo{display:flex;align-items:center;gap:8px;font-weight:800;font-size:16px;color:var(--t);text-decoration:none}',
  '.lp{background:var(--pr);color:#fff;font-size:10px;padding:2px 6px;border-radius:4px;font-weight:700}',
  '.tb{background:none;border:1px solid var(--bd);border-radius:8px;padding:6px 8px;cursor:pointer;color:var(--t);display:flex}',
  '.wrap{max-width:760px;margin:0 auto;padding:0 20px 60px}',
  '.bc{font-size:13px;color:var(--t3);padding:14px 0;margin-bottom:16px}.bc a{color:var(--pr);text-decoration:none}',
  '.ah{margin-bottom:24px}.at{font-size:11px;font-weight:700;color:var(--pr);text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px}',
  '.ah h1{font-size:clamp(22px,4vw,30px);font-weight:800;letter-spacing:-.03em;line-height:1.2;margin-bottom:12px}',
  '.lead{font-size:16px;color:var(--t2);line-height:1.7}.am{font-size:12px;color:var(--t3);margin-top:8px}',
  'article h2{font-size:20px;font-weight:700;margin:26px 0 10px}',
  'article h3{font-size:16px;font-weight:600;margin:16px 0 8px;color:var(--t2)}',
  'article p{font-size:15px;color:var(--t2);margin-bottom:12px;line-height:1.78}',
  'article ul,article ol{padding-left:20px;margin-bottom:12px}',
  'article li{font-size:15px;color:var(--t2);margin-bottom:6px;line-height:1.7}article strong{color:var(--t)}',
  '.tip{background:var(--ba);border-left:3px solid var(--pr);border-radius:0 8px 8px 0;padding:12px 16px;margin:12px 0}',
  '.tl{font-size:11px;font-weight:700;color:var(--pr);text-transform:uppercase;letter-spacing:.08em;margin-bottom:4px}',
  '.tip p{margin:0;font-size:14px;color:var(--t2)}',
  '.fi{border:1px solid var(--bd);border-radius:10px;padding:14px 18px;margin-bottom:8px}',
  '.fq{font-weight:700;font-size:15px;margin-bottom:8px;color:var(--t)}.fa{font-size:14px;color:var(--t2);line-height:1.72}',
  '.cta{text-align:center;background:var(--pb);border:1px solid var(--pr);border-radius:12px;padding:22px 16px;margin:24px 0}',
  '.cta h2{font-size:18px;font-weight:800;margin-bottom:8px}.cta p{font-size:14px;color:var(--t2);margin-bottom:12px}',
  '.cb{display:inline-block;padding:10px 24px;background:var(--pr);color:#fff;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px}',
  '.rl{display:flex;flex-wrap:wrap;gap:7px;margin:10px 0}',
  '.rl a{padding:5px 12px;font-size:13px;font-weight:500;border-radius:8px;background:var(--bg);border:1px solid var(--bd);color:var(--pr);text-decoration:none}',
  '.ft{background:var(--ba);border-top:1px solid var(--bd);padding:22px 20px}',
  '.fl{display:flex;flex-wrap:wrap;justify-content:center;gap:8px 18px;margin-bottom:10px}.fl a{color:var(--t3);font-size:13px;text-decoration:none}',
  '.fc{text-align:center;font-size:12px;color:var(--t3)}'
].join('');

function make(g) {
  const faqSchema = g.faq.map(f => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a }
  }));
  const schema = JSON.stringify([
    { '@context': 'https://schema.org', '@type': 'Article',
      headline: g.title, description: g.desc,
      url: D + '/guides/' + g.slug,
      datePublished: Y + '-05-01', dateModified: Y + '-05-01',
      author: { '@type': 'Organization', name: 'Unscramble Words Pro', url: D },
      publisher: { '@type': 'Organization', name: 'Unscramble Words Pro', url: D } },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqSchema }
  ]);
  const faqHtml = g.faq.map(f =>
    `<div class="fi"><div class="fq">${f.q}</div><div class="fa">${f.a}</div></div>`
  ).join('');
  const relHtml = g.rel.map(r => `<a href="${r[0]}">${r[1]}</a>`).join('');

  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-ZCJTBHHQPX"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-ZCJTBHHQPX');</script>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<meta name="google-adsense-account" content="ca-pub-6261071610831190">
<title>${g.title}</title>
<meta name="description" content="${g.desc}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="${D}/guides/${g.slug}">
<meta property="og:type" content="article">
<meta property="og:title" content="${g.title}">
<meta property="og:description" content="${g.desc}">
<meta property="og:url" content="${D}/guides/${g.slug}">
<meta property="og:site_name" content="Unscramble Words Pro">
<script type="application/ld+json">${schema}</script>
<link rel="icon" type="image/svg+xml" href="../favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6261071610831190" crossorigin="anonymous"></script>
<style>${CSS}</style>
</head>
<body>
<header class="hdr"><div class="hi">
  <a href="${D}/" class="logo">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>Unscramble Words <span class="lp">Pro</span>
  </a>
  <button id="T" class="tb" aria-label="Toggle theme">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  </button>
</div></header>
<div class="wrap">
  <nav class="bc"><a href="${D}/">Home</a> &rsaquo; <a href="${D}/guides/">Guides</a> &rsaquo; <span>${g.crumb}</span></nav>
  <header class="ah">
    <div class="at">${g.tag}</div>
    <h1>${g.h1}</h1>
    <p class="lead">${g.lead}</p>
    <p class="am">&#128197; Updated ${Y} &nbsp;&bull;&nbsp; &#9200; ${g.mins} min read</p>
  </header>
  <article>
    ${g.body}
    <h2>Frequently Asked Questions</h2>
    ${faqHtml}
    <div class="cta">
      <h2>Put Your Knowledge to Work</h2>
      <p>Try our free word finder &mdash; enter any letters and instantly see every valid play, sorted by score.</p>
      <a href="${D}/" class="cb">Open Word Finder Free &rarr;</a>
    </div>
    <h2>Related Guides &amp; Word Lists</h2>
    <div class="rl">${relHtml}</div>
  </article>
</div>
<footer class="ft">
  <div class="fl">
    <a href="${D}/">Home</a><a href="${D}/about.html">About</a>
    <a href="${D}/guides/">Guides</a><a href="${D}/word-lists/">Word Lists</a>
    <a href="${D}/privacy.html">Privacy</a><a href="${D}/contact.html">Contact</a>
  </div>
  <p class="fc">&copy; ${Y} <a href="${D}/" style="color:var(--pr)">Unscramble Words Pro</a> &mdash; Free Scrabble solver &amp; Wordle helper</p>
</footer>
<script>
const b=document.getElementById('T'),r=document.documentElement;
r.setAttribute('data-theme',localStorage.getItem('theme')||'dark');
b.addEventListener('click',()=>{
  const t=r.getAttribute('data-theme')==='dark'?'light':'dark';
  r.setAttribute('data-theme',t);localStorage.setItem('theme',t);
});
</script>
</body>
</html>`;
}

// ── Guide data ──────────────────────────────────────────────────────────────

const GUIDES = require('./guides-data.js');

let n = 0;
for (const g of GUIDES) {
  fs.writeFileSync(path.join(O, g.slug), make(g), 'utf8');
  console.log('  \u2713', g.slug);
  n++;
}
console.log(`\nDone! ${n} guides written to ${O}`);
