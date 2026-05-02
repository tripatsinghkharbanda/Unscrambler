/**
 * generate-word-lists.js
 * Generates high-value SEO word-list pages in /word-lists/:
 *  - 26 pages: five-letter-words-starting-with-[a-z].html
 *  - 5 pages:  [three|four|five|six|seven]-letter-words.html
 *  - 3 pages:  q-without-u-words, z-words-scrabble, x-words-scrabble
 * Usage: node generate-word-lists.js
 */
const fs    = require("fs");
const path  = require("path");
const https = require("https");

const DOMAIN  = "https://unscramblewordspro.com";
const OUT_DIR = path.join(__dirname, "word-lists");

const LS = {a:1,b:3,c:3,d:2,e:1,f:4,g:2,h:4,i:1,j:8,k:5,l:1,m:3,n:1,o:1,p:3,q:10,r:1,s:1,t:1,u:1,v:4,w:4,x:8,y:4,z:10};
const sw = w => [...w].reduce((s,c)=>s+(LS[c]||0),0);

function fetchDict(url){
  return new Promise((res,rej)=>{
    https.get(url,r=>{let d="";r.on("data",c=>d+=c);r.on("end",()=>res(d.split(/\r?\n/).map(w=>w.toLowerCase().trim()).filter(w=>/^[a-z]+$/.test(w))))}).on("error",rej);
  });
}

const CSS=`*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}[data-theme=dark]{--bg:#0F172A;--bg-alt:#1E293B;--bg-r:#334155;--surface:#1E293B;--bd:#334155;--bh:#475569;--t:#E5E7EB;--t2:#94A3B8;--t3:#64748B;--pr:#2563EB;--pr-bg:rgba(37,99,235,.12);--ac:#22C55E;--ac-bg:rgba(34,197,94,.12);--sh:0 4px 16px rgba(0,0,0,.35)}[data-theme=light]{--bg:#F8FAFC;--bg-alt:#fff;--bg-r:#F1F5F9;--surface:#fff;--bd:#E2E8F0;--bh:#CBD5E1;--t:#0F172A;--t2:#475569;--t3:#94A3B8;--pr:#2563EB;--pr-bg:rgba(37,99,235,.07);--ac:#16A34A;--ac-bg:rgba(22,163,74,.08);--sh:0 4px 16px rgba(0,0,0,.08)}html{scroll-behavior:smooth}body{font-family:'Inter',system-ui,sans-serif;background:var(--bg);color:var(--t);line-height:1.6;min-height:100vh}.container{max-width:860px;margin:0 auto;padding:0 20px}.trust-bar{background:var(--bg-alt);border-bottom:1px solid var(--bd);padding:8px 20px;text-align:center;font-size:12px;color:var(--t2)}.header{background:var(--bg-alt);border-bottom:1px solid var(--bd);padding:14px 20px}.header-inner{max-width:860px;margin:0 auto;display:flex;align-items:center;justify-content:space-between}.logo{font-weight:800;font-size:18px;display:flex;align-items:center;gap:10px;color:var(--t);text-decoration:none}.logo svg{color:var(--pr)}.logo-pro{color:var(--pr)}.theme-btn{background:var(--bg-r);border:1px solid var(--bd);border-radius:8px;padding:6px;cursor:pointer;color:var(--t2);display:flex}.breadcrumb{padding:12px 0;font-size:13px;color:var(--t3)}.breadcrumb a{color:var(--pr);text-decoration:none}.hero{padding:32px 0 20px}.hero h1{font-size:28px;font-weight:800;letter-spacing:-.03em;line-height:1.2;margin-bottom:10px}.hl{color:var(--ac)}.subtitle{font-size:15px;color:var(--t2);margin-bottom:16px}.try-link{display:inline-block;padding:10px 24px;background:var(--pr);color:#fff;border-radius:10px;text-decoration:none;font-weight:600;font-size:15px}.stat-bar{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:12px;background:var(--bg-alt);border:1px solid var(--bd);border-radius:12px;padding:18px;margin:18px 0}.stat-val{font-size:24px;font-weight:800;color:var(--ac);text-align:center}.stat-lbl{font-size:11px;color:var(--t3);text-transform:uppercase;letter-spacing:.05em;text-align:center;margin-top:2px}.section{padding:22px 0;border-top:1px solid var(--bd)}.section h2{font-size:19px;font-weight:700;margin-bottom:12px}.section h3{font-size:15px;font-weight:600;margin:16px 0 8px;color:var(--t2)}.section p{font-size:15px;color:var(--t2);margin-bottom:10px;line-height:1.75}.section ol,.section ul{padding-left:20px;margin-bottom:10px}.section li{font-size:15px;color:var(--t2);margin-bottom:6px;line-height:1.65}.word-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(148px,1fr));gap:6px;margin:10px 0}.word-item{display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:var(--surface);border:1px solid var(--bd);border-radius:8px;transition:all .15s}.word-item:hover{border-color:var(--bh);transform:translateY(-1px)}.word-item.best{border-color:var(--ac);background:var(--ac-bg)}.wi-text{font-weight:600;font-size:13px;letter-spacing:.02em}.wi-score{font-size:11px;font-weight:600;padding:2px 5px;border-radius:5px;background:var(--bg-r);color:var(--t2)}.word-item.best .wi-score{background:var(--ac-bg);color:var(--ac)}.letter-group{margin-bottom:18px}.lg-head{font-size:12px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px;padding-bottom:4px;border-bottom:1px solid var(--bd)}.letter-nav{display:flex;flex-wrap:wrap;gap:5px;margin:10px 0}.letter-nav a{width:34px;height:34px;display:flex;align-items:center;justify-content:center;border-radius:7px;background:var(--surface);border:1px solid var(--bd);color:var(--pr);font-weight:700;font-size:13px;text-decoration:none;transition:all .15s}.letter-nav a:hover,.letter-nav a.active{background:var(--pr);color:#fff;border-color:var(--pr)}.length-nav{display:flex;flex-wrap:wrap;gap:7px;margin:10px 0}.length-nav a{padding:7px 15px;border-radius:8px;background:var(--surface);border:1px solid var(--bd);color:var(--pr);font-weight:600;font-size:14px;text-decoration:none;transition:all .15s}.length-nav a:hover,.length-nav a.active{background:var(--pr);color:#fff;border-color:var(--pr)}.tip-box{background:var(--bg-alt);border-left:3px solid var(--pr);border-radius:8px;padding:14px 18px;margin:14px 0}.tip-lbl{font-size:11px;font-weight:700;color:var(--pr);text-transform:uppercase;letter-spacing:.08em;margin-bottom:5px}.tip-box p{margin:0;color:var(--t2);font-size:14px}.faq-item{border:1px solid var(--bd);border-radius:9px;padding:14px 18px;margin-bottom:9px}.faq-q{font-weight:700;font-size:14.5px;margin-bottom:7px}.faq-a{font-size:14px;color:var(--t2);line-height:1.7}.related{display:flex;flex-wrap:wrap;gap:7px;margin:10px 0}.related a{padding:6px 13px;font-size:13px;font-weight:500;border-radius:8px;background:var(--surface);border:1px solid var(--bd);color:var(--pr);text-decoration:none;transition:all .15s}.related a:hover{background:var(--pr-bg);border-color:var(--pr)}.cta-box{text-align:center;background:var(--pr-bg);border:1px solid var(--pr);border-radius:12px;padding:26px 20px;margin:22px 0}.cta-box h2{font-size:19px;font-weight:800;margin-bottom:8px}.cta-box p{font-size:14px;color:var(--t2);margin-bottom:14px}.cta-btn{display:inline-block;padding:11px 26px;background:var(--pr);color:#fff;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px}.footer{border-top:1px solid var(--bd);padding:20px;text-align:center;font-size:12px;color:var(--t3);margin-top:36px}.footer a{color:var(--pr);text-decoration:none}.footer-links{display:flex;flex-wrap:wrap;justify-content:center;gap:8px 18px;margin-bottom:10px}@media(max-width:600px){.hero h1{font-size:22px}.word-grid{grid-template-columns:repeat(auto-fill,minmax(125px,1fr))}.stat-bar{grid-template-columns:1fr 1fr}}`;

function shell({title,desc,canonical,keywords,schema,crumbs,body}){
  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-ZCJTBHHQPX"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-ZCJTBHHQPX');</script>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
  <meta name="google-adsense-account" content="ca-pub-6261071610831190">
  <title>${title.slice(0,65)}</title>
  <meta name="description" content="${desc.slice(0,160)}">
  <meta name="keywords" content="${keywords}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${canonical}">
  <meta property="og:title" content="${title.slice(0,60)}">
  <meta property="og:description" content="${desc.slice(0,160)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:site_name" content="Unscramble Words Pro">
  ${schema||""}
  <link rel="icon" type="image/svg+xml" href="../favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>${CSS}</style>
</head>
<body>
  <div class="trust-bar">&#127482;&#127480; USA &bull; &#127468;&#127463; UK &bull; &#127464;&#127462; Canada &bull; &#127462;&#127482; Australia &mdash; Scrabble &amp; Wordle word tools</div>
  <header class="header"><div class="header-inner">
    <a href="${DOMAIN}/" class="logo">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
      Unscramble Words <span class="logo-pro">Pro</span>
    </a>
    <button id="themeToggle" class="theme-btn" aria-label="Toggle theme">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
    </button>
  </div></header>
  <main class="container">
    <nav class="breadcrumb">${crumbs}</nav>
    ${body}
  </main>
  <footer class="footer"><div class="container">
    <div class="footer-links">
      <a href="${DOMAIN}/">Home</a><a href="${DOMAIN}/about.html">About</a>
      <a href="${DOMAIN}/guides/">Guides</a><a href="${DOMAIN}/word-lists/">Word Lists</a>
      <a href="${DOMAIN}/privacy.html">Privacy</a><a href="${DOMAIN}/contact.html">Contact</a>
      <a href="${DOMAIN}/sitemap.html">Site Index</a>
    </div>
    <p>&copy; 2026 <a href="${DOMAIN}/">Unscramble Words Pro</a> &mdash; Free word finder &amp; Scrabble/Wordle helper</p>
  </div></footer>
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6261071610831190" crossorigin="anonymous"></script>
  <script>const b=document.getElementById('themeToggle'),r=document.documentElement;r.setAttribute('data-theme',localStorage.getItem('theme')||'dark');b.addEventListener('click',()=>{const t=r.getAttribute('data-theme')==='dark'?'light':'dark';r.setAttribute('data-theme',t);localStorage.setItem('theme',t);});</script>
</body></html>`;
}

function faqSch(qas){
  return `<script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[${qas.map(q=>`{"@type":"Question","name":${JSON.stringify(q.q)},"acceptedAnswer":{"@type":"Answer","text":${JSON.stringify(q.a)}}}`).join(",")}]}</script>`;
}

function wordGrid(words,limit=30){
  return words.slice(0,limit).map((w,i)=>{
    const sc=sw(w),cls=i<5?" best":"";
    return `<div class="word-item${cls}"><span class="wi-text">${w.toUpperCase()}</span><span class="wi-score">${sc}pts</span></div>`;
  }).join("");
}

function letterNav(active,base){
  return "abcdefghijklmnopqrstuvwxyz".split("").map(c=>{
    const cls=c===active?' class="active"':'';
    return `<a href="${base}-${c}.html"${cls}>${c.toUpperCase()}</a>`;
  }).join("");
}

function lengthNav(active){
  return [[3,"three"],[4,"four"],[5,"five"],[6,"six"],[7,"seven"]].map(([n,s])=>{
    const cls=n===active?' class="active"':'';
    return `<a href="${s}-letter-words.html"${cls}>${n} Letters</a>`;
  }).join("");
}

/* ── Unique letter intros (condensed) ── */
const LI={
  a:"A is a highly productive Wordle starting letter, appearing in about 45% of all 5-letter Wordle answers. Top openers like CRANE, STARE, and SLATE all contain A. In Scrabble, A is worth 1 point but enables hundreds of words across all rack combinations.",
  b:"B starts fewer common English words than most letters, which makes a confirmed B in position 1 very useful in Wordle. In Scrabble, B scores 3 points and words like BLAZE and BRAVE score well on premium squares.",
  c:"C is one of the most productive Wordle starting letters. CRANE is widely considered the best single opener, and CHART ranks close behind. The CH-, CR-, and CL- clusters make C-words easy to form in Scrabble.",
  d:"D starts a solid range of 5-letter words. DEALT, DRAIN, and DRIVE are effective Wordle guesses. In Scrabble, D scores 2 points and the common -ED, -DER endings help clear D tiles efficiently.",
  e:"E is the most common letter in English but starts fewer words than it ends. E-starting 5-letter words like EARTH and EMBER test E alongside high-frequency consonants. In Scrabble, E is 1 point but the most flexible tile.",
  f:"F starts a distinct group of 5-letter words. FLAME, FRESH, and FROST are common Wordle answers. F scores 4 points in Scrabble, making F-words good value when placed on Double or Triple Word Score squares.",
  g:"G-starting words like GLARE, GRAIN, and GRACE are efficient Wordle guesses that cover multiple high-frequency letters. The GR- and GL- clusters make G-words straightforward to build in Scrabble.",
  h:"H appears in roughly 23% of Wordle answers. HEART, HASTE, and HINGE cover key letter positions efficiently. The 4-point H tile and essential two-letter words (HA, HE, HI, HO) make H important in Scrabble.",
  i:"I-starting 5-letter words are less common, which means a confirmed I in position 1 narrows Wordle dramatically. IRATE is a favourite opener because it tests four high-frequency letters alongside I.",
  j:"J is one of the rarest starting letters, making it one of the highest-information Wordle clues. In Scrabble, J scores 8 points and rewards precise placement on bonus squares.",
  k:"K starts a limited group of 5-letter words. KNIFE, KNOCK, and KNEEL are among the most common. K scores 5 points in Scrabble and the KN- cluster expands otherwise difficult K-rack combinations.",
  l:"L is one of the most versatile consonants. LANCE, LEMON, and LEARN are useful Wordle guesses. L scores 1 point in Scrabble and forms productive word endings: -LY, -LE, -LER.",
  m:"M-starting words span broad everyday vocabulary. METAL, MERIT, and MOURN are common Wordle answers. M scores 3 points and the MA-, ME-, MI-, MO- clusters are easy to build in Scrabble.",
  n:"N starts a useful set of 5-letter words including NERVE, NIGHT, and NOBLE. N scores 1 point in Scrabble and forms the two-letter words NA and NO that are valid in all regional rulesets.",
  o:"O-starting 5-letter words appear regularly in Wordle. OCEAN, ONSET, and OLIVE test O in position 1 alongside common consonants. O is worth 1 point in Scrabble and is second only to E in frequency.",
  p:"P starts a large group. PARSE, PEARL, and PLAIN are effective Wordle guesses. P scores 3 points in Scrabble and the PL-, PR-, PH- clusters produce high-value words on premium squares.",
  q:"Q starts very few 5-letter words — QUEEN, QUERY, QUIET are the most common. In Scrabble, Q scores 10 points (highest, tied with Z) and rewards careful placement on Triple Letter or Word Score squares.",
  r:"R appears in roughly 43% of all Wordle answers. RAISE, CRANE, and STARE all rely on R for high information value. R scores 1 point in Scrabble but is the most flexible consonant in the game.",
  s:"S is the most common starting letter for 5-letter English words. The ENABLE dictionary contains over 1,800 5-letter S-words. SLATE and STARE are top Wordle openers. Note: Wordle deliberately avoids most S-plural answers.",
  t:"T is the third most common English consonant, appearing in 35% of Wordle answers. TRACE, TEARS, and THORN are well-known guesses. T scores 1 point and the TH- and TR- clusters produce many words.",
  u:"U-starting 5-letter words are rare, so a confirmed U in position 1 narrows Wordle significantly. ULTRA, USHER, and UNITE are common answers. U scores 1 point in Scrabble and is required by nearly all Q-words.",
  v:"V-starting words like VALOR, VIVID, and VOICE are valid but uncommon Wordle answers. V scores 4 points in Scrabble and knowing V-words like VALVE and VIGOR helps clear this otherwise difficult tile.",
  w:"W-starting words include WASTE, WATCH, and WEARY. W scores 4 points in Scrabble. WALTZ and WHIRL score well on premium squares. W in position 1 is a moderately common but distinct Wordle clue.",
  x:"X starts the fewest 5-letter words of any letter. XENON and XYLEM are among the only common options. In Scrabble, X scores 8 points and plays like OX, AX, EX, and XI allow double-direction scoring.",
  y:"Y starts a small set of 5-letter words: YACHT, YIELD, YOUNG, YOURS. Y scores 4 points in Scrabble and is more useful as a word ending (-LY, -RY) than as a starter, but knowing Y-words helps clear difficult racks.",
  z:"Z starts very few common words. ZESTY, ZONAL, and ZEBRA are among the few. Z scores 10 points — the highest tile value alongside Q. JAZZ scores 29 base points and Z on a Triple Letter Square earns 30 from Z alone."
};

const WD={
  a:{w:"A appears in ~45% of Wordle answers. Openers like CRANE, STARE, and SLATE all contain A. When A is green in position 1, try ABIDE, AFOUL, AGLOW to test common second letters.",s:"A is worth 1 point and is one of the most rack-flexible tiles. A-starting plays work well on opening squares that reach Double Word Score positions."},
  b:{w:"B starts fewer common words than expected, making a green B in position 1 highly informative. BLAZE, BRAVE, and BROKE are strong B-starting test guesses.",s:"B scores 3 points. BLAZE (16pts) and BANJO (14pts) are high-value B-words for premium squares."},
  c:{w:"CRANE and CHART are two of the best Wordle openers. A green C with known vowels quickly narrows to CHEST, CHILD, CLAIM, or CLEAN.",s:"C scores 3 points. CH- and CR- clusters produce high-frequency words. CC pairs (OCCUR) score well on premium squares."},
  d:{w:"DEALT and DREAM are popular D-starters that test common letters. After confirming D, target DA-, DE-, DI-, DR- patterns next.",s:"D scores 2 points. The -ED ending converts almost any verb to a D-ending word, but D-starting plays include DIZZY (24pts) on premium squares."},
  e:{w:"E is in 56% of Wordle answers but starts far fewer. A green E in position 1 narrows the field significantly — test vowel clusters EA-, EI-, EU- in your next guess.",s:"E is worth 1 point. E tiles pair with J, Q, X, Z to form JEE, QUA, EX, ZEE — all useful Scrabble two- or three-letter words."},
  f:{w:"FLAME, FRESH, and FROST test F alongside common letters. After a green F, FOUND, FRONT, and FIRST are efficient next guesses.",s:"F scores 4 points. FIZZ (25pts) is one of the highest-scoring 4-letter words. FJORD (15pts) is a strong opener with unusual letter coverage."},
  g:{w:"GLARE, GRAIN, and GRACE cover high-frequency letters well. A confirmed G leads naturally to GHOST, GROAN, GROVE — all valid Wordle answers.",s:"G scores 2 points. GR- and GL- clusters form many common words. GRAZE (15pts) and JAZZY — while not G-starting — show how G combines with high-value tiles."},
  h:{w:"HEART and HASTE are efficient Wordle guesses covering H with common vowels. After green H, target HA-, HE-, HI-, HO- word clusters.",s:"H scores 4 points. Two-letter H-words (HA, HE, HI, HO) are essential for parallel Scrabble plays in tight board positions."},
  i:{w:"IRATE is a popular Wordle opener testing I + 4 high-frequency letters. Green I in position 1 is rare — leads to IRKED, IVORY, and ISSUE as strong follow-up guesses.",s:"I scores 1 point. Excess I tiles weaken Scrabble racks — use IMAGE, INEPT, and INFER to clear multiple I tiles at once."},
  j:{w:"J is extremely rare in Wordle, so a grey J in guess 1 eliminates very few candidates. JAPAN, JUDGE, JUICE, and JOINT are the most likely J-starting answers.",s:"J scores 8 points. Play J on a Double or Triple Letter Score square for maximum value. JO (SOWPODS) is the only 2-letter J-word."},
  k:{w:"K starts very few Wordle words, making a grey K high-information. KNIFE, KNOCK, and KNEEL are the most common K-starting Wordle answers.",s:"K scores 5 points. KA (SOWPODS) and KI (SOWPODS) are two-letter K-words for parallel plays. KLUTZ (16pts) scores well on premium squares."},
  l:{w:"LANCE, LEAPT, and LEMON are strong L-starting Wordle guesses. L is common in position 3-4 of Wordle answers — a grey L in position 1 doesn't eliminate much.",s:"L scores 1 point. -LY and -LE endings convert many words into new plays. JAZZY-style words adding L near premium squares score high."},
  m:{w:"METAL, MERIT, and MOURN are common Wordle answers. M is moderately common — appears in ~15% of all answers in any position.",s:"M scores 3 points. MAGIC on a Double Word Square scores 12 base points. MUZZY (21pts) and JAZZY with M-hooks score extremely high."},
  n:{w:"NERVE, NIGHT, and NOBLE are useful N-starting guesses. N is much more common as a word-ender than a starter in Wordle answers.",s:"N scores 1 point. NA, NE, and NO are essential two-letter plays. N forms many bingo patterns: adding N to 6-letter racks frequently produces 7-letter bingos."},
  o:{w:"OCEAN, ONSET, and OLIVE test O in position 1 alongside common consonants. O is the second most common vowel in Wordle, so a green O in position 1 is a significant narrowing.",s:"O scores 1 point. OOH, OOT, OOF (SOWPODS) clear excess O tiles. OUZO (14pts) is one of the highest-scoring 4-letter O-starters."},
  p:{w:"PARSE, PEARL, and PLAIN are strong P-starting Wordle guesses. PL- and PR- patterns appear frequently in common English words.",s:"P scores 3 points. PA, PE, PI are valid in TWL and SOWPODS. PIZZA (24pts) and PROXY (17pts) are high-value P-words for premium plays."},
  q:{w:"Q is the rarest Wordle starting letter. QUEEN, QUERY, and QUIET are nearly all the Q-starting answers. A grey Q eliminates almost nothing — but a green Q almost solves the puzzle.",s:"Q scores 10 points (highest, tied with Z). Place Q on a Triple Letter Score for 30 points from Q alone. QUIXOTIC (rare) and QUARTZ (24pts) are spectacular premium-square plays."},
  r:{w:"R is in 43% of Wordle answers. RAISE and CRANE are among the best openers specifically because of R's frequency. A green R in position 1 leads to REACT, REALM, RISKY, and ROUND.",s:"R scores 1 point. -ER, -AR, -OR endings convert almost any root to a new word. R is essential in bingo words and hooks onto hundreds of board positions."},
  s:{w:"S starts more 5-letter words than any other letter. SLATE and STARE are among the best Wordle openers. Note: NYT Wordle avoids S-plural answers, so while S-words are valid guesses, plurals rarely appear as answers.",s:"S scores 1 point but is the most tactically powerful Scrabble tile. An S can pluralise almost any noun on the board. Save S tiles for bingos or hooks on high-value board positions."},
  t:{w:"TRACE, TEARS, and THORN are common T-starting Wordle words. T is the third most common consonant — testing T in position 1 returns useful information without being overly restrictive.",s:"T scores 1 point. TA, TE (SOWPODS), TI are two-letter T-words for parallel plays. TOPAZ (16pts) and FRITZ-style T-words score well on premium squares."},
  u:{w:"U-starting 5-letter words are rare, making green U in position 1 a powerful narrowing clue. ULTRA, USHER, and UNITE are the most common. Testing U early is especially useful in Hard Mode.",s:"U scores 1 point. UNCO, UNAU, and UREA clear excess U tiles. U is required by nearly all Q-words: QUEEN, QUEST, QUILT — knowing these clears both U and Q at once."},
  v:{w:"V appears in ~5% of Wordle answers. VALOR, VIVID, VOICE, and VOTER are common V-starting answers. A grey V confirmed early is high-value information.",s:"V scores 4 points. V is considered a 'problem tile'. VALVE, VIGOR, VYING, and VOILE help clear difficult V tiles. VIZIER (19pts) is a bingo candidate with V."},
  w:{w:"W-starting Wordle answers include WASTE, WATCH, WEARY, and WOKEN. W in position 1 is moderately common and effectively tests a distinct letter cluster.",s:"W scores 4 points. WALTZ (17pts) and WHIZZ (29pts) are among the highest-scoring W-words. Two-letter WO (SOWPODS) allows useful parallel plays."},
  x:{w:"X is the rarest Wordle starting letter alongside Q. XENON and XYLEM are among the only options. X more commonly appears in word-interior or final positions.",s:"X scores 8 points. OX, AX, EX, XI, and XU are two-letter X-words that allow plays in two directions from one tile — the most efficient use of any high-value letter."},
  y:{w:"Y is far more common as a word-ending than a starting letter in Wordle. YACHT, YIELD, YOUNG, and YOURS are the main Y-starting answers.",s:"Y scores 4 points. Adding Y to a noun or adjective on the board (EARL→EARLY, HORN→HORNY) is a key Scrabble tactic. YEH, YEP, YEW are 3-letter Y-words for tight board positions."},
  z:{w:"Z is extremely rare as a starting letter. ZESTY, ZONAL, and ZEBRA are nearly all options. Any Z clue in Wordle is high-value information due to Z's rarity.",s:"Z scores 10 points. JAZZ (29pts), FIZZ (25pts), and BUZZ (23pts) are among the highest-scoring Scrabble words. ZA is valid in TWL; ZO is valid in SOWPODS."}
};

/* ══ Build letter page ══ */
function buildLetterPage(letter, words5){
  const L=letter.toUpperCase();
  const words=words5.filter(w=>w[0]===letter).sort((a,b)=>sw(b)-sw(a));
  const n=words.length, top=sw(words[0]||"a");
  const ctx=WD[letter]||{w:"",s:""};
  const groups={};
  for(const w of words){const k=w[1]||"?";if(!groups[k])groups[k]=[];groups[k].push(w);}
  const gKeys=Object.keys(groups).sort();

  const groupsHtml=gKeys.map(k=>{
    const gs=groups[k].sort();
    return `<div class="letter-group"><div class="lg-head">${L}${k.toUpperCase()} (${gs.length})</div><div class="word-grid">${gs.map(w=>`<div class="word-item"><span class="wi-text">${w.toUpperCase()}</span><span class="wi-score">${sw(w)}pts</span></div>`).join("")}</div></div>`;
  }).join("");

  const schema=faqSch([
    {q:`How many 5-letter words start with ${L}?`,a:`There are ${n} five-letter words starting with ${L} in the ENABLE dictionary (the standard word list for North American Scrabble and Words With Friends).`},
    {q:`What is the highest-scoring 5-letter ${L}-word in Scrabble?`,a:words[0]?`${words[0].toUpperCase()} scores ${top} base points — the most of any 5-letter word starting with ${L} in the ENABLE dictionary.`:`No common 5-letter words start with ${L} in the ENABLE dictionary.`},
    {q:`Are 5-letter ${L}-words good for Wordle?`,a:ctx.w},
    {q:`How do I use ${L}-starting words in Scrabble?`,a:ctx.s}
  ]);

  const body=`
  <section class="hero">
    <h1>5-Letter Words Starting With <span class="hl">${L}</span></h1>
    <p class="subtitle">All ${n} five-letter words starting with ${L} — Scrabble scores, Wordle tips, and grouped by second letter.</p>
    <a href="${DOMAIN}/" class="try-link">Find Words From Your Letters &rarr;</a>
  </section>
  <div class="stat-bar">
    <div><div class="stat-val">${n}</div><div class="stat-lbl">Total Words</div></div>
    <div><div class="stat-val">${top}</div><div class="stat-lbl">Best Score</div></div>
    <div><div class="stat-val">${gKeys.length}</div><div class="stat-lbl">Letter Groups</div></div>
    <div><div class="stat-val">5</div><div class="stat-lbl">Letters Each</div></div>
  </div>
  <section class="section">
    <h2>About 5-Letter ${L}-Words</h2>
    <p>${LI[letter]||""}</p>
    <h3>All 26 Starting Letters</h3>
    <div class="letter-nav">${letterNav(letter,"five-letter-words-starting-with")}</div>
    <h3>Other Word Lengths</h3>
    <div class="length-nav">${lengthNav(5)}</div>
  </section>
  <section class="section">
    <h2>Top 30 Highest-Scoring ${L}-Words (Scrabble)</h2>
    <p>Play these on Double or Triple Word Score squares for maximum value.</p>
    <div class="word-grid">${wordGrid(words,30)}</div>
  </section>
  <section class="section">
    <h2>Wordle Strategy: ${L}-Starting Words</h2>
    <p>${ctx.w}</p>
    <div class="tip-box"><div class="tip-lbl">Pro Tip</div><p>When ${L} is confirmed green in position 1, your next guess should test the most common 2nd-letter patterns: ${gKeys.slice(0,5).map(k=>L+k.toUpperCase()).join(", ")}. This narrows the answer set fastest.</p></div>
  </section>
  <section class="section">
    <h2>Scrabble Strategy: ${L}-Starting Words</h2>
    <p>${ctx.s}</p>
    <ol>
      <li><strong>Target premium squares:</strong> Play your highest-scoring ${L}-word on a Double or Triple Word Score square first.</li>
      <li><strong>Parallel plays:</strong> Place a 5-letter word alongside an existing word to score both simultaneously.</li>
      <li><strong>Rack balance:</strong> A 5-letter play leaves 2 tiles, so you draw 5 new tiles — choose words that keep a good vowel-consonant mix.</li>
    </ol>
  </section>
  <section class="section">
    <h2>All ${n} Five-Letter Words Starting With ${L}</h2>
    <p>Grouped alphabetically by second letter. Valid in ENABLE (TWL / Words With Friends / Boggle).</p>
    ${groupsHtml}
  </section>
  <section class="section">
    <h2>Frequently Asked Questions</h2>
    <div class="faq-item"><div class="faq-q">How many 5-letter words start with ${L}?</div><div class="faq-a">There are <strong>${n}</strong> five-letter words starting with ${L} in the ENABLE dictionary.</div></div>
    <div class="faq-item"><div class="faq-q">Which ${L}-word scores highest in Scrabble?</div><div class="faq-a">${words[0]?`<strong>${words[0].toUpperCase()}</strong> scores ${top} base points. On a Triple Word Score square that is ${top*3} points.`:"No common 5-letter words start with "+L+"."}</div></div>
    <div class="faq-item"><div class="faq-q">Are these valid Wordle guesses?</div><div class="faq-a">Yes — all 5-letter words from the ENABLE dictionary are valid Wordle guesses. Wordle answers are drawn from a curated subset of common words, so high-Scrabble-scoring words may appear less often as answers.</div></div>
  </section>
  <div class="cta-box">
    <h2>Find Words From Any Letters</h2>
    <p>Enter any set of letters and instantly see every valid word with Scrabble scores.</p>
    <a href="${DOMAIN}/" class="cta-btn">Open Word Finder &rarr;</a>
  </div>
  <section class="section">
    <h2>Related Word Lists</h2>
    <div class="related">
      <a href="${DOMAIN}/word-lists/five-letter-words.html">All 5-Letter Words</a>
      <a href="${DOMAIN}/word-lists/four-letter-words.html">4-Letter Words</a>
      <a href="${DOMAIN}/word-lists/six-letter-words.html">6-Letter Words</a>
      <a href="${DOMAIN}/word-lists/q-without-u-words.html">Q Without U Words</a>
      <a href="${DOMAIN}/guides/best-wordle-starting-words.html">Best Wordle Starters</a>
      <a href="${DOMAIN}/guides/scrabble-strategy-guide.html">Scrabble Strategy</a>
    </div>
  </section>`;

  return shell({
    title:`5-Letter Words Starting With ${L} (${n} Words) | Scrabble & Wordle`,
    desc:`All ${n} five-letter words starting with ${L} with Scrabble scores. Browse by second letter, get Wordle tips and Scrabble strategy. Free, no login.`,
    canonical:`${DOMAIN}/word-lists/five-letter-words-starting-with-${letter}.html`,
    keywords:`5 letter words starting with ${L}, five letter words ${L}, ${L} wordle words, scrabble words starting with ${L}`,
    schema,crumbs:`<a href="${DOMAIN}/">Home</a> &rsaquo; <a href="${DOMAIN}/word-lists/">Word Lists</a> &rsaquo; <span>5-Letter Words: ${L}</span>`,body
  });
}

/* ══ Build word-length page ══ */
const LM={3:{name:"Three",slug:"three"},4:{name:"Four",slug:"four"},5:{name:"Five",slug:"five"},6:{name:"Six",slug:"six"},7:{name:"Seven",slug:"seven"}};
const LT={
  3:"3-letter words are the backbone of Scrabble scoring. They allow you to extend existing words at both ends and score parallel plays. Every competitive Scrabble player memorises all valid 3-letter words.",
  4:"4-letter words are the most common length in English. They form the core of most Scrabble racks and allow efficient plays while maintaining tile balance for future turns.",
  5:"5-letter words are the entire focus of Wordle — every answer is exactly 5 letters. In Scrabble, 5-letter words often reach premium squares from the opening position.",
  6:"6-letter words use most of your Scrabble rack and often reach bonus squares. They are one tile short of a bingo, so knowing common 6-letter words sets up 7-letter plays.",
  7:"7-letter words earn the 50-point bingo bonus in Scrabble. Playing all 7 rack tiles is the single most powerful move in the game and can shift a close match decisively."
};

function buildLengthPage(len, words){
  const meta=LM[len];
  const sorted=[...words].sort((a,b)=>sw(b)-sw(a));
  const n=words.length, topSc=sw(sorted[0]||"a"), avg=Math.round(sorted.reduce((s,w)=>s+sw(w),0)/sorted.length);
  const groups={};
  for(const w of words){if(!groups[w[0]])groups[w[0]]=0;groups[w[0]]++;}
  const distRows=Object.entries(groups).sort((a,b)=>b[1]-a[1]).slice(0,12).map(([k,c])=>
    `<tr><td style="padding:6px 12px;font-weight:700">${k.toUpperCase()}</td><td style="padding:6px 12px;color:var(--t2)">${c} words</td><td style="padding:6px 12px"><a href="${DOMAIN}/word-lists/${meta.slug}-letter-words-starting-with-${k}.html" style="color:var(--pr)">See all →</a></td></tr>`
  ).join("");

  const schema=faqSch([
    {q:`How many ${len}-letter words are there in English?`,a:`The ENABLE dictionary contains ${n.toLocaleString()} valid ${len}-letter words — the standard for North American Scrabble, Words With Friends, and Boggle.`},
    {q:`What is the highest-scoring ${len}-letter word in Scrabble?`,a:sorted[0]?`${sorted[0].toUpperCase()} scores ${topSc} base points. On a Triple Word Score square, that is ${topSc*3} points.`:"See the full list above."},
    {q:`Are ${len}-letter words useful for Wordle?`,a:len===5?"Yes — every Wordle answer is exactly 5 letters. This entire list represents valid Wordle guesses.":`${len}-letter words are not Wordle answers (which are always 5 letters), but learning ${len}-letter patterns strengthens vocabulary and Scrabble performance.`}
  ]);

  const body=`
  <section class="hero">
    <h1><span class="hl">${meta.name}-Letter Words</span>: Full List with Scrabble Scores</h1>
    <p class="subtitle">All ${n.toLocaleString()} ${len}-letter English words — with Scrabble scores, top scorers, and strategy tips.</p>
    <a href="${DOMAIN}/" class="try-link">Find Words From Your Letters &rarr;</a>
  </section>
  <div class="stat-bar">
    <div><div class="stat-val">${n.toLocaleString()}</div><div class="stat-lbl">Total Words</div></div>
    <div><div class="stat-val">${topSc}</div><div class="stat-lbl">Highest Score</div></div>
    <div><div class="stat-val">${avg}</div><div class="stat-lbl">Avg Score</div></div>
    <div><div class="stat-val">${len}</div><div class="stat-lbl">Letters Each</div></div>
  </div>
  <section class="section">
    <h2>Why ${meta.name}-Letter Words Matter</h2>
    <p>${LT[len]}</p>
    <p>This page lists every ${len}-letter word from the ENABLE dictionary — the open-source standard for North American Scrabble (TWL), Words With Friends, and Boggle. Each entry includes its base Scrabble score.</p>
    <h3>Browse by Starting Letter</h3>
    <div class="letter-nav">${"abcdefghijklmnopqrstuvwxyz".split("").map(c=>`<a href="${DOMAIN}/word-lists/${meta.slug}-letter-words-starting-with-${c}.html">${c.toUpperCase()}</a>`).join("")}</div>
    <h3>Browse by Length</h3>
    <div class="length-nav">${lengthNav(len)}</div>
  </section>
  <section class="section">
    <h2>Top 50 Highest-Scoring ${meta.name}-Letter Words</h2>
    <p>Play these on Double or Triple Word Score squares for maximum value.</p>
    <div class="word-grid">${wordGrid(sorted,50)}</div>
  </section>
  <section class="section">
    <h2>${meta.name}-Letter Words by Starting Letter</h2>
    <table style="border-collapse:collapse;width:100%;font-size:14px;margin:12px 0">
      <thead><tr style="background:var(--bg-alt)"><th style="padding:8px 12px;text-align:left">Letter</th><th style="padding:8px 12px;text-align:left">Count</th><th style="padding:8px 12px;text-align:left">Full List</th></tr></thead>
      <tbody>${distRows}</tbody>
    </table>
  </section>
  <section class="section">
    <h2>Scrabble Strategy for ${meta.name}-Letter Words</h2>
    <p>${LT[len]}</p>
    <ol>
      <li><strong>Premium squares:</strong> From the opening square, a ${len}-letter word ${len===7?"earns the 50-point bingo bonus plus the base word score":"can reach a Double or Triple Word Score square on the right board"}. Always aim for bonus squares first.</li>
      <li><strong>Rack balance:</strong> A ${len}-letter play draws ${len} new tiles. Choose words that leave a balanced vowel-consonant rack for your next turn.</li>
      <li><strong>Parallel plays:</strong> A ${len}-letter word placed alongside an existing word scores both the main word and the new letters it creates by touching the board.</li>
      <li><strong>Extension potential:</strong> Learn which ${len}-letter words accept prefix or suffix extensions to set up a longer future play.</li>
    </ol>
    <div class="tip-box"><div class="tip-lbl">Strategy Tip</div><p>The most efficient ${len}-letter Scrabble plays score 15+ base points. On a Double Word Score square, that becomes 30+ — enough to build or maintain a meaningful lead.</p></div>
  </section>
  <section class="section">
    <h2>Frequently Asked Questions</h2>
    <div class="faq-item"><div class="faq-q">How many ${len}-letter words are in the English language?</div><div class="faq-a">The ENABLE dictionary contains <strong>${n.toLocaleString()}</strong> valid ${len}-letter words — the standard for North American Scrabble and word games.</div></div>
    <div class="faq-item"><div class="faq-q">What ${len}-letter word scores highest in Scrabble?</div><div class="faq-a">${sorted[0]?`<strong>${sorted[0].toUpperCase()}</strong> scores ${topSc} base points. It uses: ${[...sorted[0]].map(c=>`${c.toUpperCase()}(${LS[c]||0})`).join(", ")}.`:"See the full list."}</div></div>
    <div class="faq-item"><div class="faq-q">Are these words valid in all word games?</div><div class="faq-a">All words on this list are from the ENABLE dictionary, which is valid in North American Scrabble (TWL), Words With Friends, Boggle, and Jumble. Collins SOWPODS (UK/Australia) includes additional words.</div></div>
  </section>
  <div class="cta-box">
    <h2>Find Every Word From Your Letters</h2>
    <p>Enter any set of letters and our tool shows every valid word, sorted by length and Scrabble score.</p>
    <a href="${DOMAIN}/" class="cta-btn">Try Word Finder Free &rarr;</a>
  </div>
  <section class="section">
    <h2>More Word Lists</h2>
    <div class="related">
      <a href="${DOMAIN}/word-lists/q-without-u-words.html">Q Without U Words</a>
      <a href="${DOMAIN}/word-lists/z-words-scrabble.html">Z Words</a>
      <a href="${DOMAIN}/word-lists/x-words-scrabble.html">X Words</a>
      <a href="${DOMAIN}/word-lists/high-scoring-scrabble-words.html">Highest Scoring Words</a>
      <a href="${DOMAIN}/guides/two-letter-scrabble-words.html">2-Letter Scrabble Words</a>
      <a href="${DOMAIN}/guides/scrabble-dictionary-guide.html">TWL vs SOWPODS</a>
    </div>
  </section>`;

  return shell({
    title:`${meta.name}-Letter Words (${n.toLocaleString()} Words) | Scrabble Scores & Lists`,
    desc:`Full list of all ${n.toLocaleString()} ${len}-letter English words with Scrabble scores. Browse by starting letter. For Scrabble, Wordle, and word games.`,
    canonical:`${DOMAIN}/word-lists/${meta.slug}-letter-words.html`,
    keywords:`${len} letter words, ${meta.name.toLowerCase()} letter words, ${len} letter words list, ${len}-letter scrabble words, word list ${len} letters`,
    schema,crumbs:`<a href="${DOMAIN}/">Home</a> &rsaquo; <a href="${DOMAIN}/word-lists/">Word Lists</a> &rsaquo; <span>${meta.name}-Letter Words</span>`,body
  });
}

/* ══ Build special pages ══ */
function buildQPage(words){
  const qWords=words.filter(w=>w.includes("q")&&!w.includes("qu")).sort((a,b)=>sw(b)-sw(a));
  const n=qWords.length, top=qWords[0]||"qoph";
  const schema=faqSch([
    {q:"What are Q without U words in Scrabble?",a:`Q-without-U words are valid Scrabble words containing Q not followed by U. There are ${n} such words in the ENABLE dictionary, including TRANQ, QOPH, and QANAT.`},
    {q:"What is the best Q-without-U word?",a:top?`${top.toUpperCase()} scores ${sw(top)} base points — the highest Q-without-U word in the ENABLE dictionary.`:"QOPH and TRANQ are among the top scorers."},
    {q:"Is QI valid in North American Scrabble?",a:"QI is valid in Collins SOWPODS (UK/Australia/international) but is NOT currently in TWL (North American). Always confirm which dictionary your game uses."}
  ]);
  const body=`
  <section class="hero">
    <h1><span class="hl">Q Without U Words</span> — Complete Scrabble List</h1>
    <p class="subtitle">All ${n} valid Scrabble words containing Q not followed by U, sorted by score. Never be stuck with an unplayable Q tile again.</p>
    <a href="${DOMAIN}/" class="try-link">Find Words From Your Letters &rarr;</a>
  </section>
  <div class="stat-bar">
    <div><div class="stat-val">${n}</div><div class="stat-lbl">Q-Without-U Words</div></div>
    <div><div class="stat-val">10</div><div class="stat-lbl">Q Tile Value</div></div>
    <div><div class="stat-val">${sw(top)}</div><div class="stat-lbl">Best Word Score</div></div>
    <div><div class="stat-val">${top.length}</div><div class="stat-lbl">Longest Length</div></div>
  </div>
  <section class="section">
    <h2>Why Q-Without-U Words Are Essential in Scrabble</h2>
    <p>Q is the joint highest-scoring tile in Scrabble at 10 points. The problem: nearly all common English Q-words require U immediately after it. When U tiles are scarce or already played, a Q on your rack becomes a liability.</p>
    <p>Q-without-U words solve this entirely. Knowing even five of these words means you are never stuck with an unplayable Q. In competitive Scrabble, this knowledge regularly converts a 0-point pass into a 20+ point scoring play.</p>
    <p>Most Q-without-U words come from Arabic, Hebrew, or other languages absorbed into English specialist vocabulary. Collins SOWPODS (UK/international) includes more of these than TWL (North American), making this list especially valuable for international players.</p>
    <div class="tip-box"><div class="tip-lbl">Key Tip</div><p>Memorise QAT, TRANQ, and QOPH first. These three short words cover the most common Q-without-U scenarios and score well on any premium square.</p></div>
  </section>
  <section class="section">
    <h2>Complete Q-Without-U Word List (by Scrabble Score)</h2>
    <div class="word-grid">${wordGrid(qWords,60)}</div>
  </section>
  <section class="section">
    <h2>How to Play Q Without U in Scrabble</h2>
    <ol>
      <li><strong>QI (SOWPODS):</strong> 2-letter word worth 11 points. On a Double Letter Score covering Q: 21 points. The most important Q-without-U word for international players.</li>
      <li><strong>QAT / QOPH:</strong> 3-4 letter words scoring 12-16 base points. Easy to place parallel to existing board words.</li>
      <li><strong>TRANQ:</strong> 5-letter word scoring 14 points. Extendable to TRANQS with an S tile.</li>
      <li><strong>Triple Letter targeting:</strong> Q alone on a Triple Letter Score earns 30 points from a single tile.</li>
      <li><strong>Double-direction plays:</strong> Place a Q-without-U word so Q touches an existing word in two directions and scores both.</li>
    </ol>
  </section>
  <section class="section">
    <h2>Frequently Asked Questions</h2>
    <div class="faq-item"><div class="faq-q">How many Q-without-U words exist in Scrabble?</div><div class="faq-a">There are <strong>${n}</strong> Q-without-U words in the ENABLE dictionary. Collins SOWPODS includes additional words like QI not in ENABLE.</div></div>
    <div class="faq-item"><div class="faq-q">What Q-without-U word scores highest?</div><div class="faq-a"><strong>${top.toUpperCase()}</strong> scores ${sw(top)} base points — ${sw(top)*3} on a Triple Word Score square.</div></div>
    <div class="faq-item"><div class="faq-q">Is QI valid in North American Scrabble?</div><div class="faq-a">QI is valid in Collins SOWPODS (UK, Australia, international) but is not currently in TWL (North American). Check your game's dictionary before playing it.</div></div>
  </section>
  <div class="cta-box">
    <h2>Stuck With a Q Tile?</h2>
    <p>Enter your letters including Q and our word finder shows every valid play instantly.</p>
    <a href="${DOMAIN}/" class="cta-btn">Find Q-Words Now &rarr;</a>
  </div>
  <section class="section"><h2>Related Word Lists</h2><div class="related">
    <a href="${DOMAIN}/word-lists/z-words-scrabble.html">Z Words</a>
    <a href="${DOMAIN}/word-lists/x-words-scrabble.html">X Words</a>
    <a href="${DOMAIN}/word-lists/high-scoring-scrabble-words.html">Highest Scoring Words</a>
    <a href="${DOMAIN}/guides/two-letter-scrabble-words.html">2-Letter Scrabble Words</a>
    <a href="${DOMAIN}/guides/scrabble-strategy-guide.html">Scrabble Strategy</a>
  </div></section>`;
  return shell({
    title:"Q Without U Words — Complete Scrabble List (Sorted by Score)",
    desc:`All ${n} valid Scrabble words with Q but not U, sorted by score. Essential for playing the 10-point Q tile when U is unavailable.`,
    canonical:`${DOMAIN}/word-lists/q-without-u-words.html`,
    keywords:"q without u words, q words scrabble no u, scrabble q words, qi scrabble, tranq scrabble",
    schema,crumbs:`<a href="${DOMAIN}/">Home</a> &rsaquo; <a href="${DOMAIN}/word-lists/">Word Lists</a> &rsaquo; <span>Q Without U Words</span>`,body
  });
}

function buildHighValuePage(letter, words, titleStr, descStr, slug, tips){
  const lWords=words.filter(w=>w.includes(letter)).sort((a,b)=>sw(b)-sw(a));
  const n=lWords.length, L=letter.toUpperCase();
  const schema=faqSch([
    {q:`What are the highest-scoring Scrabble words with ${L}?`,a:`${lWords.slice(0,3).map(w=>w.toUpperCase()).join(", ")} are among the highest-scoring ${L}-containing words. ${lWords[0]?`${lWords[0].toUpperCase()} scores ${sw(lWords[0])} base points.`:""}`},
    {q:`How many Scrabble words contain ${L}?`,a:`There are ${n} words in the ENABLE dictionary containing the letter ${L}.`},
    {q:`What two-letter words contain ${L}?`,a:`Two-letter ${L}-words include ${lWords.filter(w=>w.length===2).map(w=>w.toUpperCase()).join(", ")||"none in ENABLE"}. These are valuable for parallel plays in Scrabble.`}
  ]);
  const body=`
  <section class="hero">
    <h1><span class="hl">${L} Words</span> for Scrabble — Complete List with Scores</h1>
    <p class="subtitle">All ${n} words containing ${L} from the ENABLE dictionary, sorted by Scrabble score. The ${L} tile is worth ${LS[letter]} points.</p>
    <a href="${DOMAIN}/" class="try-link">Find Words From Your Letters &rarr;</a>
  </section>
  <div class="stat-bar">
    <div><div class="stat-val">${n}</div><div class="stat-lbl">Total ${L}-Words</div></div>
    <div><div class="stat-val">${LS[letter]}</div><div class="stat-lbl">${L} Tile Value</div></div>
    <div><div class="stat-val">${lWords[0]?sw(lWords[0]):0}</div><div class="stat-lbl">Best Word Score</div></div>
    <div><div class="stat-val">1</div><div class="stat-lbl">${L} Tiles in Bag</div></div>
  </div>
  <section class="section">
    <h2>Why ${L} Words Matter in Scrabble</h2>
    <p>${tips.intro}</p>
    <p>${tips.strategy}</p>
    <div class="tip-box"><div class="tip-lbl">Top Tip</div><p>${tips.tip}</p></div>
  </section>
  <section class="section">
    <h2>Top 60 Highest-Scoring ${L} Words</h2>
    <p>Play these on Triple Letter or Triple Word Score squares for maximum value.</p>
    <div class="word-grid">${wordGrid(lWords,60)}</div>
  </section>
  <section class="section">
    <h2>Short ${L} Words (2-3 Letters) — Essential Scrabble Plays</h2>
    <p>Short words give you flexibility to play ${L} in tight board positions while still scoring well.</p>
    <div class="word-grid">${lWords.filter(w=>w.length<=3).map(w=>`<div class="word-item best"><span class="wi-text">${w.toUpperCase()}</span><span class="wi-score">${sw(w)}pts</span></div>`).join("")||"<p>No 2-3 letter "+L+"-words in ENABLE.</p>"}</div>
  </section>
  <section class="section">
    <h2>How to Play the ${L} Tile</h2>
    <ol>${tips.howto.map(t=>`<li>${t}</li>`).join("")}</ol>
  </section>
  <section class="section">
    <h2>Frequently Asked Questions</h2>
    <div class="faq-item"><div class="faq-q">How many words contain ${L}?</div><div class="faq-a">There are <strong>${n}</strong> words in the ENABLE dictionary containing ${L}.</div></div>
    <div class="faq-item"><div class="faq-q">What ${L}-word scores highest?</div><div class="faq-a">${lWords[0]?`<strong>${lWords[0].toUpperCase()}</strong> scores ${sw(lWords[0])} base points.`:"See full list above."}</div></div>
    <div class="faq-item"><div class="faq-q">How many ${L} tiles are in a Scrabble bag?</div><div class="faq-a">There is only <strong>1</strong> ${L} tile in a standard Scrabble set. It scores ${LS[letter]} points and should almost always be played on a premium square.</div></div>
  </section>
  <div class="cta-box">
    <h2>Have a ${L} Tile in Your Rack?</h2>
    <p>Enter your letters and find the best play instantly — with Scrabble scores for every result.</p>
    <a href="${DOMAIN}/" class="cta-btn">Find Best ${L} Play &rarr;</a>
  </div>
  <section class="section"><h2>Related Word Lists</h2><div class="related">
    <a href="${DOMAIN}/word-lists/q-without-u-words.html">Q Without U Words</a>
    <a href="${DOMAIN}/word-lists/high-scoring-scrabble-words.html">Highest Scoring Words</a>
    <a href="${DOMAIN}/guides/two-letter-scrabble-words.html">2-Letter Scrabble Words</a>
    <a href="${DOMAIN}/guides/scrabble-strategy-guide.html">Scrabble Strategy</a>
    <a href="${DOMAIN}/guides/scrabble-dictionary-guide.html">TWL vs SOWPODS</a>
  </div></section>`;
  return shell({title:titleStr,desc:descStr,canonical:`${DOMAIN}/word-lists/${slug}`,keywords:`${L} words scrabble, words with ${L}, ${L} scrabble words, best ${L} words`,schema,crumbs:`<a href="${DOMAIN}/">Home</a> &rsaquo; <a href="${DOMAIN}/word-lists/">Word Lists</a> &rsaquo; <span>${L} Words</span>`,body});
}

function buildHighScorePage(words){
  const sorted=[...words].filter(w=>w.length>=3&&w.length<=8).sort((a,b)=>sw(b)-sw(a)).slice(0,200);
  const schema=faqSch([
    {q:"What is the highest-scoring word in Scrabble?",a:`${sorted[0]?`${sorted[0].toUpperCase()} scores ${sw(sorted[0])} base points and is among the highest-scoring words in the ENABLE dictionary. On premium squares the score multiplies substantially.`:"See the full list."}`},
    {q:"What letters score highest in Scrabble?",a:"Q and Z score 10 points each. J and X score 8 points. K scores 5 points. Q, Z, J, X, and K tiles in the same word produce the highest base scores."},
    {q:"What is a good Scrabble score per word?",a:"An average Scrabble play scores 20-30 points. Words scoring 30+ base points are exceptional. Words scoring 50+ base points exist but are rare without premium square bonuses."}
  ]);
  const body=`
  <section class="hero">
    <h1><span class="hl">Highest-Scoring Scrabble Words</span> — Top 200 List</h1>
    <p class="subtitle">The 200 words with the highest base Scrabble scores from the ENABLE dictionary, sorted from highest to lowest.</p>
    <a href="${DOMAIN}/" class="try-link">Check Your Letters &rarr;</a>
  </section>
  <div class="stat-bar">
    <div><div class="stat-val">${sw(sorted[0]||"a")}</div><div class="stat-lbl">Highest Score</div></div>
    <div><div class="stat-val">200</div><div class="stat-lbl">Words Listed</div></div>
    <div><div class="stat-val">10</div><div class="stat-lbl">Q/Z Tile Value</div></div>
    <div><div class="stat-val">50</div><div class="stat-lbl">Bingo Bonus</div></div>
  </div>
  <section class="section">
    <h2>How Scrabble Scoring Works</h2>
    <p>Each Scrabble tile has a face value from 1 (A, E, I, O, U, L, N, S, T, R) to 10 (Q, Z). The base score of a word is the sum of all tile values. Premium squares multiply individual tiles (Double/Triple Letter Score) or entire words (Double/Triple Word Score).</p>
    <p>Words with high base scores contain multiple high-value tiles. Q (10pts), Z (10pts), J (8pts), X (8pts), and K (5pts) are the five highest-value tiles. Words combining two or more of these tiles score dramatically higher than average.</p>
    <div class="tip-box"><div class="tip-lbl">Strategy</div><p>The highest base-score word in your rack is rarely the best play. Always consider which premium squares are available and whether a lower-scoring word reaches a Double or Triple Word Score square for a bigger total.</p></div>
  </section>
  <section class="section">
    <h2>Top 200 Highest-Scoring Words (Base Score)</h2>
    <p>Ranked by base Scrabble score (sum of letter values, no premium squares). All words are valid in the ENABLE dictionary.</p>
    <div class="word-grid">${wordGrid(sorted,200)}</div>
  </section>
  <section class="section">
    <h2>High-Value Tile Combinations</h2>
    <ul>
      <li><strong>Q + Z words:</strong> Extremely rare. QUIZ scores 22 base points and is one of the most efficient 4-letter plays in Scrabble.</li>
      <li><strong>J + X words:</strong> JINX scores 18 base points — excellent on any premium square.</li>
      <li><strong>Z + J or Z + X:</strong> No common English words, but Z alone in JAZZ (29pts) or FIZZ (25pts) scores very high.</li>
      <li><strong>K combinations:</strong> KNACK (13pts), KAYAK (16pts), and KHAKI (14pts) are reliable high-value plays with K.</li>
    </ul>
  </section>
  <section class="section">
    <h2>Frequently Asked Questions</h2>
    <div class="faq-item"><div class="faq-q">What is the highest base score possible in Scrabble?</div><div class="faq-a">The theoretical maximum word score (without premium squares) for a word in the ENABLE dictionary is ${sw(sorted[0]||"a")} points — achieved by ${sorted[0]?sorted[0].toUpperCase():"certain high-value combinations"}. Real games rarely see scores above 50 base points without premium squares.</div></div>
    <div class="faq-item"><div class="faq-q">What is the highest score ever achieved in a Scrabble game?</div><div class="faq-a">The record Scrabble word score is 392 points for CAZIQUES, placed on premium squares in a professional game. The highest single game score ever recorded is 850 points.</div></div>
    <div class="faq-item"><div class="faq-q">Are all words on this list valid in tournament Scrabble?</div><div class="faq-a">All words are from the ENABLE dictionary — the basis for TWL (North American Scrabble). Some words may not be in Collins SOWPODS. Always verify with your tournament's official dictionary.</div></div>
  </section>
  <div class="cta-box">
    <h2>Find Your Best Play</h2>
    <p>Enter your rack tiles and our word finder instantly shows the highest-scoring valid words.</p>
    <a href="${DOMAIN}/" class="cta-btn">Find Best Play &rarr;</a>
  </div>
  <section class="section"><h2>Related Word Lists</h2><div class="related">
    <a href="${DOMAIN}/word-lists/q-without-u-words.html">Q Without U Words</a>
    <a href="${DOMAIN}/word-lists/z-words-scrabble.html">Z Words</a>
    <a href="${DOMAIN}/word-lists/x-words-scrabble.html">X Words</a>
    <a href="${DOMAIN}/guides/two-letter-scrabble-words.html">2-Letter Scrabble Words</a>
    <a href="${DOMAIN}/guides/scrabble-strategy-guide.html">Scrabble Strategy</a>
  </div></section>`;
  return shell({
    title:"Highest-Scoring Scrabble Words — Top 200 (Base Score)",
    desc:"The 200 highest base-score Scrabble words from the ENABLE dictionary, ranked by points. Includes Q, Z, J, X, and K combinations. With strategy tips.",
    canonical:`${DOMAIN}/word-lists/high-scoring-scrabble-words.html`,
    keywords:"highest scoring scrabble words, best scrabble words, high score scrabble, scrabble word scores, top scrabble words",
    schema,crumbs:`<a href="${DOMAIN}/">Home</a> &rsaquo; <a href="${DOMAIN}/word-lists/">Word Lists</a> &rsaquo; <span>Highest-Scoring Words</span>`,body
  });
}

/* ══ Index page for /word-lists/ ══ */
function buildIndexPage(){
  const body=`
  <section class="hero">
    <h1>Word Lists for <span class="hl">Scrabble, Wordle &amp; Word Games</span></h1>
    <p class="subtitle">Comprehensive word lists sorted by length, starting letter, and Scrabble score. Free, no login required.</p>
    <a href="${DOMAIN}/" class="try-link">Try the Word Finder &rarr;</a>
  </section>
  <section class="section">
    <h2>5-Letter Words by Starting Letter</h2>
    <p>Every 5-letter word from the ENABLE dictionary, grouped by starting letter — with Scrabble scores and Wordle strategy tips. Essential for Wordle players and competitive Scrabble players alike.</p>
    <div class="letter-nav">${"abcdefghijklmnopqrstuvwxyz".split("").map(c=>`<a href="${DOMAIN}/word-lists/five-letter-words-starting-with-${c}.html">${c.toUpperCase()}</a>`).join("")}</div>
  </section>
  <section class="section">
    <h2>Word Lists by Length</h2>
    <p>Complete lists of all English words at each length, with Scrabble scores and strategy tips.</p>
    <div class="length-nav">
      <a href="${DOMAIN}/word-lists/three-letter-words.html">3-Letter Words</a>
      <a href="${DOMAIN}/word-lists/four-letter-words.html">4-Letter Words</a>
      <a href="${DOMAIN}/word-lists/five-letter-words.html">5-Letter Words</a>
      <a href="${DOMAIN}/word-lists/six-letter-words.html">6-Letter Words</a>
      <a href="${DOMAIN}/word-lists/seven-letter-words.html">7-Letter Words</a>
    </div>
  </section>
  <section class="section">
    <h2>Special Scrabble Word Lists</h2>
    <p>High-value word lists for Scrabble players targeting specific tiles and board positions.</p>
    <div class="related">
      <a href="${DOMAIN}/word-lists/q-without-u-words.html">Q Without U Words</a>
      <a href="${DOMAIN}/word-lists/z-words-scrabble.html">Z Words (10 pts)</a>
      <a href="${DOMAIN}/word-lists/x-words-scrabble.html">X Words (8 pts)</a>
      <a href="${DOMAIN}/word-lists/high-scoring-scrabble-words.html">Highest-Scoring Words</a>
    </div>
  </section>
  <section class="section">
    <h2>Strategy Guides</h2>
    <div class="related">
      <a href="${DOMAIN}/guides/scrabble-strategy-guide.html">Scrabble Strategy Guide</a>
      <a href="${DOMAIN}/guides/two-letter-scrabble-words.html">2-Letter Scrabble Words</a>
      <a href="${DOMAIN}/guides/best-wordle-starting-words.html">Best Wordle Starting Words</a>
      <a href="${DOMAIN}/guides/scrabble-dictionary-guide.html">TWL vs SOWPODS</a>
    </div>
  </section>`;
  return shell({
    title:"Word Lists for Scrabble & Wordle | Unscramble Words Pro",
    desc:"Complete word lists by length and starting letter, with Scrabble scores. Includes Q-without-U words, Z words, X words, and highest-scoring word lists.",
    canonical:`${DOMAIN}/word-lists/`,
    keywords:"word lists scrabble, 5 letter words, word lists by length, scrabble word lists, wordle word lists",
    schema:"",crumbs:`<a href="${DOMAIN}/">Home</a> &rsaquo; <span>Word Lists</span>`,body
  });
}

/* ══ MAIN ══ */
async function main(){
  console.log("Fetching ENABLE dictionary...");
  let dict;
  try {
    dict = await fetchDict("https://raw.githubusercontent.com/dolph/dictionary/master/enable1.txt");
    console.log(`Loaded ${dict.length} words.`);
  } catch(e){
    console.error("Dict fetch failed. Using fallback.");
    const src=fs.readFileSync(path.join(__dirname,"dictionary.js"),"utf8");
    const m=src.match(/\[[\s\S]*\]/);
    dict=m?JSON.parse(m[0]):[];
  }

  if(!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR,{recursive:true});

  // 1. Index page
  fs.writeFileSync(path.join(OUT_DIR,"index.html"), buildIndexPage(), "utf8");
  console.log("  ✓ index.html");

  // 2. 26 five-letter-words-starting-with-[a-z] pages
  const words5=dict.filter(w=>w.length===5);
  let lc=0;
  for(const letter of "abcdefghijklmnopqrstuvwxyz"){
    const html=buildLetterPage(letter,words5);
    fs.writeFileSync(path.join(OUT_DIR,`five-letter-words-starting-with-${letter}.html`),html,"utf8");
    lc++;
  }
  console.log(`  ✓ ${lc} letter pages (five-letter-words-starting-with-[a-z])`);

  // 3. Word-length hub pages
  for(const len of [3,4,5,6,7]){
    const wl=dict.filter(w=>w.length===len);
    fs.writeFileSync(path.join(OUT_DIR,`${LM[len].slug}-letter-words.html`),buildLengthPage(len,wl),"utf8");
    console.log(`  ✓ ${LM[len].slug}-letter-words.html (${wl.length} words)`);
  }

  // 4. Q without U words
  fs.writeFileSync(path.join(OUT_DIR,"q-without-u-words.html"),buildQPage(dict),"utf8");
  console.log("  ✓ q-without-u-words.html");

  // 5. Z words
  const zTips={
    intro:"Z is tied with Q as the highest-value Scrabble tile at 10 points. There is only one Z tile in the bag, and knowing every word that uses it is essential for maximising its value.",
    strategy:"Common Z-words include ZAP, ZEN, ZIP, ZIT, ZOO (3-letter), ZEAL, ZEST, ZINC, ZONE, ZOOM (4-letter), and JAZZY, FIZZY, FUZZY (5-letter). Short Z-words (ZA, ZO in SOWPODS) are critical for tight board positions.",
    tip:"ZA (SOWPODS) and ZAP are the shortest Z-words. ZAX (19pts), JAZZ (29pts), and FIZZ (25pts) are the most explosive Z plays on premium squares.",
    howto:["<strong>Triple Letter + Double Word:</strong> Z on a Triple Letter Square inside a Double Word Score play scores 30+ from Z alone, then doubles the total.",
           "<strong>Two-letter Z words:</strong> ZA (SOWPODS) allows Z to be played in almost any tight position for 11 base points.",
           "<strong>Hook words:</strong> Learn which words accept Z as a hook: ADZE→ADZES, QUIZ→QUIZZ (invalid) — and which don't.",
           "<strong>Bingo bonus:</strong> If you can form a 7-letter bingo using Z, you earn 50 extra points on top of the word score."]
  };
  fs.writeFileSync(path.join(OUT_DIR,"z-words-scrabble.html"),buildHighValuePage("z",dict,"Z Words for Scrabble — Complete List with Scores","All Z-words from the ENABLE dictionary sorted by Scrabble score. The Z tile is worth 10 points — learn how to maximise it.","z-words-scrabble.html",zTips),"utf8");
  console.log("  ✓ z-words-scrabble.html");

  // 6. X words
  const xTips={
    intro:"X scores 8 points in Scrabble — the third highest tile value after Q and Z. Like Q and Z, there is only one X tile in the bag, and it rewards precise placement on premium squares.",
    strategy:"The key to playing X well is the two-letter X-words: OX, AX, EX, XI (all valid in TWL), and XU (SOWPODS). These short words let X score in two directions simultaneously — one of the highest-efficiency plays in the game.",
    tip:"OX and AX are the most useful X plays. Placed correctly, one X tile touching two board words can score 30+ points from a single letter.",
    howto:["<strong>Double-direction plays:</strong> Place X so it forms a valid word both across and down. OX, AX, and EX enable this from almost any position.",
           "<strong>Triple Letter targeting:</strong> X on a Triple Letter Square scores 24 points from X alone — more than most full words.",
           "<strong>XI and XU:</strong> XI is valid in TWL (scoring 9 base points). XU is valid in Collins SOWPODS. Both allow flexible parallel plays.",
           "<strong>Extended plays:</strong> AX becomes AXED, AXLE, AXES. EX becomes EXAM, EXCEL, EXACT. These extensions turn a 2-letter setup into a 4-5 letter play."]
  };
  fs.writeFileSync(path.join(OUT_DIR,"x-words-scrabble.html"),buildHighValuePage("x",dict,"X Words for Scrabble — Complete List with Scores","All X-words from the ENABLE dictionary sorted by Scrabble score. The X tile is worth 8 points — includes OX, AX, EX, XI and hundreds more.","x-words-scrabble.html",xTips),"utf8");
  console.log("  ✓ x-words-scrabble.html");

  // 7. Highest-scoring words
  fs.writeFileSync(path.join(OUT_DIR,"high-scoring-scrabble-words.html"),buildHighScorePage(dict),"utf8");
  console.log("  ✓ high-scoring-scrabble-words.html");

  // Count
  const total=fs.readdirSync(OUT_DIR).filter(f=>f.endsWith(".html")).length;
  console.log(`\nDone! ${total} pages written to ${OUT_DIR}`);
}

main().catch(console.error);
