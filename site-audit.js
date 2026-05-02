const fs = require('fs');
const path = require('path');

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/g, ' ')
    .replace(/\s+/g, ' ').trim();
}
function wordCount(html) {
  return stripHtml(html).split(/\s+/).filter(w => w.length > 1).length;
}
function getTitle(html) {
  const m = html.match(/<title[^>]*>(.*?)<\/title>/i);
  return m ? m[1].replace(/&[a-z]+;/g,' ').slice(0, 90) : '-';
}
function getDesc(html) {
  const m = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)
           || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);
  return m ? m[1].slice(0, 100) : '-';
}
function getH1(html) {
  const m = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  return m ? m[1].replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim().slice(0, 80) : '-';
}
function getH2s(html) {
  return [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)]
    .map(m => m[1].replace(/<[^>]+>/g,'').trim().slice(0,50)).slice(0,6);
}
function getLinks(html, base) {
  return [...html.matchAll(/href=["']([^"'#?]+\.html[^"']*|\/guides\/[^"']*|\/pages\/[^"']*|\/[^"']*\.html)["']/gi)]
    .map(m => m[1]).filter((v,i,a) => a.indexOf(v) === i);
}
function schemaTypes(html) {
  const m = [...html.matchAll(/"@type"\s*:\s*"([^"]+)"/g)].map(x => x[1]);
  return [...new Set(m)].join(', ') || 'none';
}
function hasCanonical(html) {
  return /<link[^>]+rel=["']canonical["']/i.test(html);
}
function hasFAQ(html) {
  return /FAQPage/i.test(html) || /<section[^>]*faq/i.test(html) || /faq/i.test(html);
}

const ROOT = __dirname;
const rootFiles = [
  'index.html','about.html','how-to-unscramble-words.html','how-to-win-wordle.html',
  'improve-vocabulary-for-students.html','word-games-for-kids.html',
  'contact.html','privacy.html','terms.html','sitemap.html'
];
const guideFiles = fs.readdirSync(path.join(ROOT,'guides'))
  .filter(f => f.endsWith('.html')).map(f => 'guides/'+f);
const allPageFiles = fs.readdirSync(path.join(ROOT,'pages'))
  .filter(f => f.endsWith('.html'));
const pageFilesAll = allPageFiles.map(f => 'pages/'+f);
// Sample 10 pages spread across the list
const samplePages = [0,20,40,60,80,100,120,140,160,180].map(i => 'pages/'+allPageFiles[Math.min(i, allPageFiles.length-1)]);

const allFiles = [...rootFiles, ...guideFiles];

console.log('\n====== PHASE 1: SITE STRUCTURE AUDIT ======\n');
console.log('Total pages:');
console.log('  Root editorial:', rootFiles.length);
console.log('  Guides:', guideFiles.length);
console.log('  Generated /pages/:', allPageFiles.length);
console.log('  TOTAL:', rootFiles.length + guideFiles.length + allPageFiles.length);

console.log('\n--- EDITORIAL + GUIDE PAGES ---');
console.log('File | Type | Words | Canonical | Schema | FAQ | H1');
for (const f of allFiles) {
  const html = fs.readFileSync(path.join(ROOT, f), 'utf8');
  const wc = wordCount(html);
  const type = f.startsWith('guides/') ? 'Guide' : ['privacy','terms','contact','sitemap'].some(x=>f.includes(x)) ? 'Policy' : 'Editorial';
  const risk = wc < 300 ? '🔴' : wc < 700 ? '🟡' : '🟢';
  const canon = hasCanonical(html) ? 'yes' : 'NO';
  const schema = schemaTypes(html);
  const faq = hasFAQ(html) ? 'yes' : 'no';
  const h1 = getH1(html);
  console.log(`${risk} ${f} | ${type} | ${wc}w | canon:${canon} | schema:${schema} | faq:${faq}`);
  console.log(`   H1: ${h1}`);
  console.log(`   Title: ${getTitle(html)}`);
  console.log(`   Desc: ${getDesc(html).slice(0,90)}`);
  const h2s = getH2s(html);
  if (h2s.length) console.log(`   H2s: ${h2s.join(' | ')}`);
  const links = getLinks(html, f);
  console.log(`   Internal links: ${links.length} -> ${links.slice(0,6).join(', ')}`);
  console.log('');
}

console.log('\n--- SAMPLED GENERATED PAGES (/pages/) ---');
for (const f of samplePages) {
  const html = fs.readFileSync(path.join(ROOT, f), 'utf8');
  const wc = wordCount(html);
  const risk = wc < 300 ? '🔴' : wc < 700 ? '🟡' : '🟢';
  const schema = schemaTypes(html);
  const links = getLinks(html, f);
  console.log(`${risk} ${f} | ${wc}w | schema:${schema} | inlinks:${links.length}`);
  console.log(`   Title: ${getTitle(html)}`);
}

console.log('\n--- WORD COUNT DISTRIBUTION (all /pages/) ---');
const wcDist = {under300:0, under500:0, under700:0, under1000:0, over1000:0};
let totalWC = 0;
for (const f of pageFilesAll) {
  const html = fs.readFileSync(path.join(ROOT, f), 'utf8');
  const wc = wordCount(html);
  totalWC += wc;
  if (wc < 300) wcDist.under300++;
  else if (wc < 500) wcDist.under500++;
  else if (wc < 700) wcDist.under700++;
  else if (wc < 1000) wcDist.under1000++;
  else wcDist.over1000++;
}
console.log(`  <300w (🔴 THIN):  ${wcDist.under300} pages`);
console.log(`  300-499w (🟡):    ${wcDist.under500} pages`);
console.log(`  500-699w (🟡):    ${wcDist.under700} pages`);
console.log(`  700-999w (🟢):    ${wcDist.under1000} pages`);
console.log(`  1000+w (🟢):      ${wcDist.over1000} pages`);
console.log(`  Avg word count:   ${Math.round(totalWC/pageFilesAll.length)}w`);

console.log('\n--- ORPHAN PAGE CHECK (pages with no inbound links from editorial) ---');
const editorialHtml = rootFiles.concat(guideFiles).map(f => fs.readFileSync(path.join(ROOT,f),'utf8')).join(' ');
const linkedPages = new Set([...editorialHtml.matchAll(/href=["']([^"']+pages\/[^"']+)["']/gi)].map(m=>m[1].replace(/^.*pages\//,'pages/')));
const orphans = pageFilesAll.filter(f => !linkedPages.has(f));
console.log(`  Total /pages/: ${pageFilesAll.length}`);
console.log(`  Linked from editorial: ${linkedPages.size}`);
console.log(`  Orphan (no editorial link): ${orphans.length}`);
console.log(`  Sample orphans: ${orphans.slice(0,8).join(', ')}`);
