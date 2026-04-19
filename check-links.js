const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const DOMAIN = "https://unscramblewordspro.com";
const errors = [];
let totalLinks = 0;
let checkedFiles = 0;

function getLocalPath(href, fromFile) {
  // Skip external, mailto, javascript, anchor-only links
  if (/^(https?:|mailto:|javascript:|#)/i.test(href)) return null;
  
  const dir = path.dirname(fromFile);
  let resolved;
  if (href.startsWith("/")) {
    resolved = path.join(ROOT, href);
  } else {
    resolved = path.join(dir, href);
  }
  return resolved;
}

function extractLinks(html) {
  const links = [];
  const re = /href="([^"]+)"/g;
  let m;
  while ((m = re.exec(html))) {
    links.push(m[1]);
  }
  const reSrc = /src="([^"]+)"/g;
  while ((m = reSrc.exec(html))) {
    // Only check local src (not external CDNs)
    if (!/^https?:/i.test(m[1])) {
      links.push(m[1]);
    }
  }
  return links;
}

function checkFile(filePath) {
  const html = fs.readFileSync(filePath, "utf8");
  const links = extractLinks(html);
  const relPath = path.relative(ROOT, filePath);
  checkedFiles++;

  for (const href of links) {
    totalLinks++;
    
    // Convert domain-relative URLs
    let checkHref = href;
    if (href.startsWith(DOMAIN)) {
      checkHref = href.slice(DOMAIN.length) || "/";
    }
    
    const localPath = getLocalPath(checkHref, filePath);
    if (!localPath) continue; // external link, skip
    
    // Check if / maps to index.html
    let target = localPath;
    if (target.endsWith(path.sep) || target === ROOT) {
      target = path.join(target, "index.html");
    }
    
    if (!fs.existsSync(target)) {
      errors.push({ file: relPath, href, resolved: path.relative(ROOT, target) });
    }
  }
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

console.log(`Scanning ${htmlFiles.length} HTML files for broken links...\n`);
for (const f of htmlFiles) {
  checkFile(f);
}

console.log(`Checked ${checkedFiles} files, ${totalLinks} links total.`);
if (errors.length === 0) {
  console.log("\n✅ No broken links found!");
} else {
  console.log(`\n❌ ${errors.length} broken link(s) found:\n`);
  for (const e of errors) {
    console.log(`  ${e.file}`);
    console.log(`    href="${e.href}"`);
    console.log(`    → missing: ${e.resolved}\n`);
  }
}
process.exit(errors.length > 0 ? 1 : 0);
