/**
 * audit-content.js
 * Checks all site HTML for:
 *   1. Flesch Reading Ease score > 60
 *   2. AI/spun/boilerplate red-flag phrases
 *   3. Harmful / adult / dangerous content keywords
 *   4. Scraped-content indicators (duplicate long sentences across files)
 */
const fs   = require("fs");
const path = require("path");
const ROOT = __dirname;

/* ── Pages excluded from Flesch check (legal/utility prose is inherently complex) ── */
const FLESCH_EXCLUDE = ["privacy.html", "terms.html", "sitemap.html", "contact.html"];

/* ── Extract only <p> tag text (avoids table/nav/header noise in Flesch) ── */
function extractParagraphs(html) {
  const matches = [...html.matchAll(/<p(?:\s[^>]*)?>([^<]*(?:<(?!\/p>)[^<]*)*)<\/p>/gi)];
  return matches.map(m => m[0]
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ").replace(/&ndash;/g, "-").replace(/&mdash;/g, "-")
    .replace(/&rsquo;/g, "'").replace(/\s+/g, " ").trim()
  ).join(" ");
}

/* ── Strip HTML tags and decode basic entities (for phrase/harmful checks) ── */
function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ").replace(/&ndash;/g, "-").replace(/&mdash;/g, "-")
    .replace(/&rsquo;/g, "'").replace(/&ldquo;/g, '"').replace(/&rdquo;/g, '"')
    .replace(/\s+/g, " ").trim();
}

/* ── Count syllables (approximate) ── */
function countSyllables(word) {
  word = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!word) return 0;
  // silent e at end
  word = word.replace(/e$/, "");
  const vowelGroups = word.match(/[aeiouy]+/g);
  return Math.max(1, vowelGroups ? vowelGroups.length : 1);
}

/* ── Flesch Reading Ease ── */
function fleschScore(text) {
  const sentences = (text.match(/[.!?]+/g) || []).length || 1;
  const words     = text.split(/\s+/).filter(w => w.length > 0);
  if (words.length < 10) return null; // too short to score
  const syllables = words.reduce((s, w) => s + countSyllables(w), 0);
  const asl = words.length / sentences;        // avg sentence length
  const asw = syllables / words.length;        // avg syllables per word
  return Math.round(206.835 - 1.015 * asl - 84.6 * asw);
}

/* ── AI / spun / boilerplate red flags ── */
// Whole-word patterns (word boundaries prevent substring matches like 'thus' in 'enthusiasts')
const AI_PHRASE_REGEXES = [
  /in today's fast-paced world/i,
  /it's no secret that/i,
  /look no further/i,
  /\bin conclusion\b/i,
  /\bto summarize\b/i,
  /\bdelve into\b/i,
  /\bdive into\b/i,
  /embark on a journey/i,
  /unlock the secrets/i,
  /\bgame-changer\b/i,
  /\bgame-changing\b/i,
  /\brevolutionary\b/i,
  /\bleverage\b/i,
  /\bparamount\b/i,
  /\bmeticulous(ly)?\b/i,
  /\bseamlessly\b/i,
  /it is worth noting/i,
  /needless to say/i,
  /at the end of the day/i,
  /\brest assured\b/i,
  /navigate the complexities/i,
  /in the realm of/i,
  /\ba testament to\b/i,
  /\bcrucial role\b/i,
  /\brapidly evolving\b/i,
  /\bever-evolving\b/i,
  /\bin summary\b/i,
  /\bhence\b/i,
  /\bhenceforth\b/i,
  /\butili[sz]e\b/i,
  /\bholistic\b/i,
  /\bsynergy\b/i,
  /\bparadigm\b/i,
  /\btransformative\b/i,
  /\bcutting-edge\b/i,
  /\bstate-of-the-art\b/i,
  /\baforementioned\b/i,
];

/* ── Harmful content keywords ── */
const HARMFUL = [
  // adult
  "porn","xxx","sex","nude","naked","escort","onlyfans",
  // violence
  "kill yourself","how to kill","suicide method","bomb making","how to make a bomb",
  // drugs
  "how to make meth","drug synthesis","buy cocaine","buy heroin",
  // piracy
  "crack download","keygen","serial key","warez","nulled",
  // gambling
  "online casino","place your bets","casino bonus",
];

/* ── Collect files to audit ── */
function collectHtmlFiles(dir, arr, skipDirs = []) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (!skipDirs.includes(f) && !["node_modules",".git"].includes(f)) collectHtmlFiles(full, arr, skipDirs);
    } else if (f.endsWith(".html")) {
      arr.push(full);
    }
  }
}

// Audit root + guides (full editorial content)
const editorialFiles = [];
for (const f of fs.readdirSync(ROOT)) {
  const full = path.join(ROOT, f);
  if (f.endsWith(".html")) editorialFiles.push(full);
}
const guidesDir = path.join(ROOT, "guides");
for (const f of fs.readdirSync(guidesDir)) {
  if (f.endsWith(".html")) editorialFiles.push(path.join(guidesDir, f));
}

// For generated /pages/, sample every 25th page (representative check)
const pagesDir = path.join(ROOT, "pages");
const allPages = fs.readdirSync(pagesDir).filter(f => f.endsWith(".html")).sort();
const sampledPages = allPages.filter((_, i) => i % 25 === 0).map(f => path.join(pagesDir, f));

const allFilesToAudit = [...editorialFiles, ...sampledPages];

/* ── Duplicate sentence detection (scrape indicator) ── */
const sentenceIndex = new Map(); // sentence -> [files]

/* ── Run audit ── */
const issues = [];

function auditFile(file) {
  const rel      = path.relative(ROOT, file);
  const raw      = fs.readFileSync(file, "utf8");
  const text     = stripHtml(raw);
  const basename = path.basename(file);

  const fileIssues = [];
  let score = null;

  // 1. Flesch score (paragraph text only; skip legal/utility pages)
  if (!FLESCH_EXCLUDE.includes(basename)) {
    const paraText = extractParagraphs(raw);
    score = fleschScore(paraText);
    if (score !== null && score < 60) {
      fileIssues.push(`FLESCH ${score} (target >60 — paragraph prose only)`);
    }
  }

  // 2. AI/spun phrases (word-boundary regex, applied to full stripped text)
  const foundAI = AI_PHRASE_REGEXES.filter(r => r.test(text));
  if (foundAI.length > 0) {
    fileIssues.push(`AI/SPUN phrases: ${foundAI.map(r => r.source).join(", ")}`);
  }

  // 3. Harmful content
  const foundHarmful = HARMFUL.filter(p => text.toLowerCase().includes(p));
  if (foundHarmful.length > 0) {
    fileIssues.push(`HARMFUL content: "${foundHarmful.join('", "')}"`);
  }

  // 4. Duplicate sentence detection
  const sentences = text.match(/[^.!?]{40,}[.!?]/g) || [];
  for (const s of sentences) {
    const key = s.trim().toLowerCase().slice(0, 120);
    if (!sentenceIndex.has(key)) sentenceIndex.set(key, []);
    sentenceIndex.get(key).push(rel);
  }

  if (fileIssues.length > 0) {
    issues.push({ file: rel, issues: fileIssues });
  } else {
    const scoreLabel = score !== null ? ` (Flesch: ${score})` : "";
    console.log(`  ✅ ${rel}${scoreLabel}`);
  }
}

console.log("=== CONTENT AUDIT ===\n");
console.log(`Auditing ${allFilesToAudit.length} files (${editorialFiles.length} editorial + ${sampledPages.length} page samples)...\n`);

for (const file of allFilesToAudit) {
  auditFile(file);
}

/* ── Check duplicate sentences (scrape detection) ── */
const scraped = [];
for (const [sentence, files] of sentenceIndex) {
  // Only flag if same sentence appears in 3+ DIFFERENT editorial files (normal boilerplate in pages/ is expected)
  const editorialMatches = files.filter(f => !f.startsWith("pages"));
  const uniqueEditorial  = [...new Set(editorialMatches)];
  if (uniqueEditorial.length >= 3) {
    scraped.push({ sentence: sentence.slice(0, 100), files: uniqueEditorial });
  }
}

/* ── Report ── */
console.log("\n=== ISSUES FOUND ===");
if (issues.length === 0) {
  console.log("  ✅ No content issues found.");
} else {
  for (const { file, issues: fi } of issues) {
    console.log(`\n  ❌ ${file}`);
    for (const i of fi) console.log(`     → ${i}`);
  }
}

if (scraped.length > 0) {
  console.log("\n=== POTENTIAL SCRAPED / DUPLICATE SENTENCES (3+ editorial files) ===");
  for (const { sentence, files } of scraped.slice(0, 10)) {
    console.log(`  "${sentence}..."`);
    console.log(`  → in: ${files.join(", ")}`);
  }
} else {
  console.log("\n  ✅ No scraped/duplicate sentences across editorial files.");
}

console.log("\n=== SUMMARY ===");
console.log(`Files audited : ${allFilesToAudit.length}`);
console.log(`Issues found  : ${issues.length}`);
console.log(`Scrape flags  : ${scraped.length}`);
