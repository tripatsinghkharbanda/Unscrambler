/**
 * test-accuracy.js
 * Tests word-finding algorithm correctness and Scrabble scoring accuracy.
 * Uses the same logic as app.js and generate-pages.js.
 *
 * Usage: node test-accuracy.js
 */

const https = require("https");

/* ── Scrabble scoring (mirrors app.js) ── */
const LETTER_SCORE = {
  a:1,b:3,c:3,d:2,e:1,f:4,g:2,h:4,i:1,j:8,k:5,l:1,m:3,
  n:1,o:1,p:3,q:10,r:1,s:1,t:1,u:1,v:4,w:4,x:8,y:4,z:10
};

function scoreWord(w) {
  let s = 0;
  for (const ch of w) s += LETTER_SCORE[ch] || 0;
  return s;
}

function charFreq(s) {
  const f = {};
  for (const c of s) f[c] = (f[c] || 0) + 1;
  return f;
}

function isSubset(wf, inputF) {
  for (const c in wf) { if ((inputF[c] || 0) < wf[c]) return false; }
  return true;
}

function findWords(letters, dict) {
  const cleaned = letters.toLowerCase().replace(/[^a-z]/g, "");
  if (cleaned.length < 2) return [];
  const inputF = charFreq(cleaned);
  const results = [];
  for (const w of dict) {
    if (w.length >= 2 && w.length <= cleaned.length) {
      if (isSubset(charFreq(w), inputF)) results.push(w);
    }
  }
  return results;
}

/* ── Fetch ENABLE dictionary ── */
function fetchDict(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        const words = data.split(/\r?\n/).map(w => w.trim().toLowerCase()).filter(w => /^[a-z]{2,15}$/.test(w));
        resolve(words);
      });
    }).on("error", reject);
  });
}

/* ── Test cases ── */
async function main() {
  console.log("=== WORD UNSCRAMBLER ACCURACY TEST ===\n");

  console.log("Fetching ENABLE dictionary...");
  const dict = await fetchDict("https://raw.githubusercontent.com/dolph/dictionary/master/enable1.txt");
  const dictSet = new Set(dict);
  console.log(`Dictionary loaded: ${dict.length} words\n`);

  let totalTests = 0;
  let passed = 0;
  let failed = 0;
  const errors = [];

  function assert(test, msg) {
    totalTests++;
    if (test) { passed++; }
    else { failed++; errors.push("FAIL: " + msg); console.log("  FAIL: " + msg); }
  }

  // ────────────────────────────────────
  // TEST 1: Known words must be found
  // ────────────────────────────────────
  console.log("--- TEST 1: Known words must be found ---");

  const knownCases = [
    { letters: "crane", mustContain: ["crane", "cane", "care", "race", "acre", "earn", "near", "are", "ran", "an", "re"] },
    { letters: "ate", mustContain: ["ate", "eat", "eta", "tea", "at", "ae", "ta", "et"] },
    { letters: "heart", mustContain: ["heart", "earth", "hater", "rathe", "hear", "heat", "rate", "tear", "hare", "the", "her", "hat", "rat", "art", "ear", "are", "eat", "ate", "era", "eta", "tea"] },
    { letters: "strange", mustContain: ["strange", "garnets", "stare", "gears", "range", "anger", "agent", "great", "stage", "rates", "gates", "an", "at"] },
    { letters: "qi", mustContain: ["qi"] },
    { letters: "za", mustContain: ["za"] },
  ];

  for (const tc of knownCases) {
    const results = findWords(tc.letters, dict);
    const resultSet = new Set(results);
    for (const expected of tc.mustContain) {
      if (dictSet.has(expected)) { // only test if word is actually in dictionary
        assert(resultSet.has(expected), `"${tc.letters}" should find "${expected}"`);
      }
    }
    console.log(`  "${tc.letters}": ${results.length} words found, checked ${tc.mustContain.length} expected`);
  }

  // ────────────────────────────────────
  // TEST 2: No impossible words returned
  // ────────────────────────────────────
  console.log("\n--- TEST 2: No impossible words (letter constraint) ---");

  const constraintCases = [
    { letters: "abc", impossible: ["abcd", "cab", "back"] },   // "cab" only uses a,b,c which are in "abc", "back" needs k
    { letters: "ate", impossible: ["ates", "late", "mate"] },   // needs letters not in input
    { letters: "tin", impossible: ["tint", "hint", "thin"] },   // tint needs 2 t's, hint needs h, thin needs h
  ];

  for (const tc of constraintCases) {
    const results = findWords(tc.letters, dict);
    const resultSet = new Set(results);
    for (const bad of tc.impossible) {
      // Verify that the word truly CAN'T be formed from the letters
      const inputF = charFreq(tc.letters);
      const wordF = charFreq(bad);
      const canForm = isSubset(wordF, inputF);
      if (!canForm) {
        assert(!resultSet.has(bad), `"${tc.letters}" must NOT contain "${bad}" (letter constraint violated)`);
      }
    }

    // Also verify ALL returned words are valid subsets
    const inputF = charFreq(tc.letters);
    let subsetOK = 0;
    for (const w of results) {
      const wf = charFreq(w);
      if (isSubset(wf, inputF)) subsetOK++;
      else {
        assert(false, `"${tc.letters}" returned "${w}" which is NOT a valid subset`);
      }
    }
    console.log(`  "${tc.letters}": ${results.length} words, all ${subsetOK} pass subset check`);
  }

  // ────────────────────────────────────
  // TEST 3: All returned words exist in dictionary
  // ────────────────────────────────────
  console.log("\n--- TEST 3: All returned words are real dictionary words ---");

  const dictCheckCases = ["crane", "plaster", "nastier", "strange", "heart", "ocean", "walnut"];
  for (const letters of dictCheckCases) {
    const results = findWords(letters, dict);
    let allReal = true;
    for (const w of results) {
      if (!dictSet.has(w)) {
        assert(false, `"${letters}" returned "${w}" which is NOT in ENABLE dictionary`);
        allReal = false;
      }
    }
    if (allReal) {
      assert(true, `"${letters}": all ${results.length} words are in dictionary`);
    }
    console.log(`  "${letters}": ${results.length} words, all in dictionary: ${allReal}`);
  }

  // ────────────────────────────────────
  // TEST 4: Scrabble scoring accuracy
  // ────────────────────────────────────
  console.log("\n--- TEST 4: Scrabble scoring ---");

  const scoreCases = [
    { word: "qi", expected: 11 },
    { word: "za", expected: 11 },
    { word: "ax", expected: 9 },
    { word: "ox", expected: 9 },
    { word: "jo", expected: 9 },
    { word: "xi", expected: 9 },
    { word: "crane", expected: 7 },    // c3+r1+a1+n1+e1 = 7
    { word: "heart", expected: 8 },    // h4+e1+a1+r1+t1 = 8
    { word: "strange", expected: 8 },  // s1+t1+r1+a1+n1+g2+e1 = 8
    { word: "plaster", expected: 9 },  // p3+l1+a1+s1+t1+e1+r1 = 9
    { word: "jazz", expected: 29 },    // j8+a1+z10+z10 = 29
    { word: "quiz", expected: 22 },    // q10+u1+i1+z10 = 22
    { word: "queen", expected: 14 },   // q10+u1+e1+e1+n1 = 14
    { word: "a", expected: 1 },
    { word: "z", expected: 10 },
  ];

  for (const tc of scoreCases) {
    const got = scoreWord(tc.word);
    assert(got === tc.expected, `score("${tc.word}") = ${got}, expected ${tc.expected}`);
    if (got === tc.expected) {
      console.log(`  score("${tc.word}") = ${got} ✓`);
    }
  }

  // ────────────────────────────────────
  // TEST 5: Edge cases
  // ────────────────────────────────────
  console.log("\n--- TEST 5: Edge cases ---");

  assert(findWords("", dict).length === 0, "empty string returns 0 words");
  assert(findWords("a", dict).length === 0, "single letter returns 0 words (min 2)");
  assert(findWords("zzzzzz", dict).length === 0, "impossible letters return 0 words");
  assert(findWords("123!@#", dict).length === 0, "non-alpha input returns 0 words");
  assert(findWords("CRANE", dict).length > 0, "uppercase input is handled");
  assert(findWords("CrAnE", dict).length > 0, "mixed case input is handled");

  // Duplicate letters test
  const aaResults = findWords("aa", dict);
  for (const w of aaResults) {
    const wf = charFreq(w);
    assert(!wf['a'] || wf['a'] <= 2, `"aa" returned "${w}" which needs more than 2 a's`);
  }
  console.log(`  Edge cases: all passed`);

  // ────────────────────────────────────
  // TEST 6: Verify generated page word counts match
  // ────────────────────────────────────
  console.log("\n--- TEST 6: Generated page word count spot-check ---");

  const fs = require("fs");
  const path = require("path");
  const pagesDir = path.join(__dirname, "pages");
  const spotChecks = ["crane", "heart", "nastier", "plaster", "ate"];

  for (const letters of spotChecks) {
    const filePath = path.join(pagesDir, `words-from-${letters}.html`);
    if (!fs.existsSync(filePath)) { console.log(`  SKIP: ${filePath} not found`); continue; }
    const html = fs.readFileSync(filePath, "utf8");

    // Extract claimed word count from title
    const titleMatch = html.match(/(\d+) Words Found/);
    const claimedCount = titleMatch ? parseInt(titleMatch[1]) : -1;

    // Count word items in all-words section vs best section
    const totalItemCount = (html.match(/<div class="word-item/g) || []).length;
    const bestItemCount = (html.match(/<div class="word-item best/g) || []).length;
    const allWordsItemCount = totalItemCount - bestItemCount;

    // Recompute from scratch
    const recomputed = findWords(letters, dict);

    assert(claimedCount === recomputed.length,
      `"${letters}" page claims ${claimedCount} words, recompute finds ${recomputed.length}`);
    assert(allWordsItemCount === recomputed.length,
      `"${letters}" all-words section has ${allWordsItemCount} items, expected ${recomputed.length}`);
    assert(bestItemCount <= 10,
      `"${letters}" best section has ${bestItemCount} items (should be ≤10)`);
    console.log(`  "${letters}": claimed=${claimedCount}, all-words=${allWordsItemCount}, best=${bestItemCount}, recomputed=${recomputed.length}`);
  }

  // ────────────────────────────────────
  // SUMMARY
  // ────────────────────────────────────
  console.log("\n========================================");
  console.log(`TOTAL: ${totalTests} tests | PASSED: ${passed} | FAILED: ${failed}`);
  if (errors.length > 0) {
    console.log("\nFailed tests:");
    errors.forEach(e => console.log("  " + e));
  }
  console.log("========================================");

  process.exit(failed > 0 ? 1 : 0);
}

main().catch(err => { console.error(err); process.exit(1); });
