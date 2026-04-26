/**
 * request-indexing.js
 * Submits all sitemap URLs to Google Search Console Indexing API.
 *
 * SETUP (one-time):
 *  1. Go to https://console.cloud.google.com/ → Create a project
 *  2. Enable "Web Search Indexing API"
 *  3. Create a Service Account → download JSON key → save as "service-account.json" in this folder
 *  4. In Google Search Console → Settings → Users & permissions → Add the service account email as Owner
 *  5. Run:  npm install googleapis
 *  6. Run:  node request-indexing.js
 *
 * Rate limit: Google allows 200 requests/day on the free quota.
 * This script batches with a 500ms delay to stay safe.
 */

const fs   = require("fs");
const path = require("path");

const KEY_FILE = path.join(__dirname, "service-account.json");

if (!fs.existsSync(KEY_FILE)) {
  console.error("❌  service-account.json not found.");
  console.error("    Follow the SETUP steps in this file's header comment.");
  process.exit(1);
}

const { google } = require("googleapis");

const DOMAIN   = "https://unscramblewordspro.com";
const SITEMAP  = path.join(__dirname, "sitemap.xml");
const DELAY_MS = 500; // stay under rate limit

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  // Parse all URLs from sitemap.xml
  const sitemapXml = fs.readFileSync(SITEMAP, "utf8");
  const urls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  console.log(`Found ${urls.length} URLs in sitemap.xml\n`);

  // Auth
  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_FILE,
    scopes: ["https://www.googleapis.com/auth/indexing"],
  });
  const client = await auth.getClient();

  let success = 0, failed = 0;

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    try {
      const res = await client.request({
        url: "https://indexing.googleapis.com/v3/urlNotifications:publish",
        method: "POST",
        data: { url, type: "URL_UPDATED" },
      });
      console.log(`[${i + 1}/${urls.length}] ✅  ${url} → ${res.status}`);
      success++;
    } catch (err) {
      const code = err.response?.status || err.code;
      console.error(`[${i + 1}/${urls.length}] ❌  ${url} → ${code} ${err.message}`);
      failed++;
    }
    if (i < urls.length - 1) await sleep(DELAY_MS);
  }

  console.log(`\nDone. ${success} submitted, ${failed} failed.`);
  if (failed > 0) console.log("Tip: Re-run tomorrow if you hit the 200/day quota.");
}

main().catch(console.error);
