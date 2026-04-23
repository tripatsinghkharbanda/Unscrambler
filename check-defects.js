const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const DOMAIN = "https://unscramblewordspro.com";
const issues = [];

function check(file, condition, msg) {
  if (!condition) issues.push({ file: path.relative(ROOT, file), msg });
}

function scanHTML(filePath) {
  const html = fs.readFileSync(filePath, "utf8");
  const rel = path.relative(ROOT, filePath);

  // DOCTYPE
  check(filePath, html.startsWith("<!DOCTYPE html>"), "Missing <!DOCTYPE html>");

  // Title
  check(filePath, /<title>[^<]+<\/title>/.test(html), "Missing or empty <title>");

  // Meta description
  check(filePath, /name="description"\s+content="[^"]+"/i.test(html), "Missing meta description");

  // Canonical
  check(filePath, /rel="canonical"\s+href="[^"]+"/i.test(html), "Missing canonical link");

  // Favicon
  check(filePath, /rel="icon"/.test(html), "Missing favicon link");

  // Charset
  check(filePath, /charset="UTF-8"/i.test(html), "Missing charset UTF-8");

  // Viewport
  check(filePath, /name="viewport"/i.test(html), "Missing viewport meta");

  // Lang attribute
  check(filePath, /<html[^>]+lang="/i.test(html), "Missing lang attribute on <html>");

  // Robots
  check(filePath, /name="robots"/i.test(html), "Missing robots meta");

  // AdSense script
  check(filePath, /adsbygoogle\.js/i.test(html), "Missing AdSense script");

  // AdSense account meta
  check(filePath, /google-adsense-account/i.test(html), "Missing google-adsense-account meta tag");

  // Footer links
  check(filePath, /privacy\.html/.test(html), "Missing link to Privacy Policy");
  check(filePath, /terms\.html/.test(html), "Missing link to Terms");
  check(filePath, /contact\.html/.test(html), "Missing link to Contact");
  check(filePath, /about\.html/.test(html), "Missing link to About");
  check(filePath, /sitemap\.html/.test(html), "Missing link to Site Index");

  // CSP present
  check(filePath, /Content-Security-Policy/.test(html) || rel.startsWith("pages"), "Missing CSP meta tag");

  // No broken HTML entities
  const badEntities = html.match(/&amp;amp;/g);
  check(filePath, !badEntities, `Double-encoded entities (&amp;amp;) found: ${badEntities ? badEntities.length : 0} occurrences`);

  // No empty href
  const emptyHrefs = html.match(/href=""/g);
  check(filePath, !emptyHrefs, `Empty href="" found: ${emptyHrefs ? emptyHrefs.length : 0}`);

  // No http:// (should be https://)
  const httpLinks = html.match(/href="http:\/\//g);
  check(filePath, !httpLinks, `Insecure http:// links found: ${httpLinks ? httpLinks.length : 0}`);

  // Theme toggle button
  check(filePath, /themeToggle/.test(html), "Missing theme toggle button");

  // Closing tags
  check(filePath, /<\/html>/.test(html), "Missing closing </html>");
  check(filePath, /<\/body>/.test(html), "Missing closing </body>");
  check(filePath, /<\/head>/.test(html), "Missing closing </head>");

  // Open Graph (for pages with SEO value)
  if (!rel.includes("privacy") && !rel.includes("terms") && !rel.includes("contact")) {
    // Only check main content pages
  }

  return html;
}

// Collect all HTML files
const htmlFiles = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== "node_modules" && entry.name !== ".git") {
      walk(full);
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      htmlFiles.push(full);
    }
  }
}
walk(ROOT);

console.log(`\n=== SITE DEFECT SCAN ===\n`);
console.log(`Scanning ${htmlFiles.length} HTML files...\n`);

for (const f of htmlFiles) {
  scanHTML(f);
}

// Check critical root files exist
const requiredFiles = [
  "index.html", "about.html", "privacy.html", "terms.html",
  "contact.html", "sitemap.html", "sitemap.xml", "ads.txt",
  "favicon.svg", "_headers"
];
for (const f of requiredFiles) {
  const p = path.join(ROOT, f);
  if (!fs.existsSync(p)) {
    issues.push({ file: f, msg: "Required file is MISSING" });
  } else {
    const stat = fs.statSync(p);
    if (stat.size === 0) {
      issues.push({ file: f, msg: "File exists but is EMPTY (0 bytes)" });
    }
  }
}

// Check ads.txt content
const adsTxt = path.join(ROOT, "ads.txt");
if (fs.existsSync(adsTxt)) {
  const content = fs.readFileSync(adsTxt, "utf8");
  check(adsTxt, content.includes("pub-6261071610831190"), "ads.txt missing publisher ID");
  check(adsTxt, content.includes("DIRECT"), "ads.txt missing DIRECT relationship");
}

// Check sitemap.xml has all pages
const sitemapPath = path.join(ROOT, "sitemap.xml");
if (fs.existsSync(sitemapPath)) {
  const sitemapContent = fs.readFileSync(sitemapPath, "utf8");
  check(sitemapPath, sitemapContent.includes("about.html"), "sitemap.xml missing about.html");
  check(sitemapPath, sitemapContent.includes("privacy.html"), "sitemap.xml missing privacy.html");
  check(sitemapPath, sitemapContent.includes("terms.html"), "sitemap.xml missing terms.html");
  check(sitemapPath, sitemapContent.includes("contact.html"), "sitemap.xml missing contact.html");
  check(sitemapPath, sitemapContent.includes("sitemap.html"), "sitemap.xml missing sitemap.html");

  // Count pages in sitemap
  const locCount = (sitemapContent.match(/<loc>/g) || []).length;
  console.log(`sitemap.xml: ${locCount} URLs listed`);

  // Check for pages/ entries
  const pagesDir = path.join(ROOT, "pages");
  if (fs.existsSync(pagesDir)) {
    const pageFiles = fs.readdirSync(pagesDir).filter(f => f.endsWith(".html"));
    let missingSitemap = 0;
    for (const pf of pageFiles) {
      if (!sitemapContent.includes(`pages/${pf}`)) {
        issues.push({ file: "sitemap.xml", msg: `Missing entry for pages/${pf}` });
        missingSitemap++;
      }
    }
    console.log(`SEO pages in sitemap: ${pageFiles.length - missingSitemap}/${pageFiles.length}`);
  }
}

// Check _headers CSP matches index.html CSP (both should have same AdSense domains)
const headersPath = path.join(ROOT, "_headers");
if (fs.existsSync(headersPath)) {
  const headersContent = fs.readFileSync(headersPath, "utf8");
  check(headersPath, headersContent.includes("adtrafficquality"), "_headers CSP missing adtrafficquality domain");
  check(headersPath, headersContent.includes("frame-ancestors"), "_headers missing frame-ancestors");
}

// Summary
console.log(`\n--- RESULTS ---`);
console.log(`Files scanned: ${htmlFiles.length}`);
console.log(`Required root files: ${requiredFiles.length} checked`);

if (issues.length === 0) {
  console.log(`\n✅ No defects found! Site is clean.\n`);
} else {
  console.log(`\n❌ ${issues.length} issue(s) found:\n`);
  const grouped = {};
  for (const i of issues) {
    if (!grouped[i.file]) grouped[i.file] = [];
    grouped[i.file].push(i.msg);
  }
  for (const [file, msgs] of Object.entries(grouped)) {
    console.log(`  ${file}`);
    for (const m of msgs) console.log(`    ⚠  ${m}`);
    console.log();
  }
}

process.exit(issues.length > 0 ? 1 : 0);
