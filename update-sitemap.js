/**
 * update-sitemap.js
 * Rebuilds sitemap.xml from all HTML files in /pages + root pages
 */
const fs = require("fs");
const path = require("path");

const DOMAIN = "https://unscramblewordspro.com";
const ROOT   = __dirname;
const TODAY  = new Date().toISOString().slice(0, 10);

const rootPages = [
  { loc: "/",              priority: "1.0", changefreq: "weekly"  },
  { loc: "/about.html",   priority: "0.9", changefreq: "monthly" },
  { loc: "/sitemap.html", priority: "0.7", changefreq: "monthly" },
  { loc: "/contact.html", priority: "0.6", changefreq: "monthly" },
  { loc: "/privacy.html", priority: "0.5", changefreq: "yearly"  },
  { loc: "/terms.html",   priority: "0.5", changefreq: "yearly"  },
];

const pagesDir = path.join(ROOT, "pages");
const pageFiles = fs.readdirSync(pagesDir)
  .filter(f => f.endsWith(".html"))
  .sort();

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

for (const p of rootPages) {
  xml += `  <url>\n`;
  xml += `    <loc>${DOMAIN}${p.loc}</loc>\n`;
  xml += `    <lastmod>${TODAY}</lastmod>\n`;
  xml += `    <changefreq>${p.changefreq}</changefreq>\n`;
  xml += `    <priority>${p.priority}</priority>\n`;
  xml += `  </url>\n`;
}

for (const f of pageFiles) {
  xml += `  <url>\n`;
  xml += `    <loc>${DOMAIN}/pages/${f}</loc>\n`;
  xml += `    <lastmod>${TODAY}</lastmod>\n`;
  xml += `    <changefreq>monthly</changefreq>\n`;
  xml += `    <priority>0.8</priority>\n`;
  xml += `  </url>\n`;
}

xml += `</urlset>\n`;

fs.writeFileSync(path.join(ROOT, "sitemap.xml"), xml, "utf8");
console.log(`sitemap.xml updated: ${rootPages.length} root pages + ${pageFiles.length} SEO pages = ${rootPages.length + pageFiles.length} total URLs`);
