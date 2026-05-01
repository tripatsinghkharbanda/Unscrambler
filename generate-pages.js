/**
 * generate-pages.js
 * Generates 100 SEO-optimised HTML pages for unscramblewordspro.com
 * Each page targets "words with letters {X}", "unscramble {X}", "anagram of {X}"
 *
 * Usage:  node generate-pages.js
 * Output: ./pages/words-from-{letters}.html  (100 files)
 */

const fs = require("fs");
const path = require("path");
const https = require("https");

/* ── 217 curated letter combos (3-7 letters, high search value) ── */
const COMBOS = [
  // 3-letter
  "ate","ape","art","ear","eat","era","net","ore","tea","tin",
  // 4-letter
  "acer","abet","arts","bale","care","dare","earn","fate","gale","hare",
  "isle","lace","mane","nape","pale","race","sale","tale","vane","wane",
  // 5-letter (original)
  "angel","brace","crane","dealt","earth","feast","grain","heart","irate",
  "leapt","mango","ocean","parse","raise","sauce","tease","unite","waste",
  "adore","bleat","crate","dream","glare","haste","lemon","meats","reign",
  "slate","trace","arena","beast","cheap","gears","lance","onset","pearl",
  "roast","snare","steam","stare","tears","notes","rinse","share","stone",
  // 5-letter (new — 40)
  "anger","bland","brave","burst","chant","charm","chart","chase","chord",
  "clean","clear","clone","cloud","cover","craft","dance","dense","drive",
  "eagle","elbow","ember","evade","extra","flame","flair","float","floor",
  "found","frame","fresh","frost","giant","glide","globe","grace","grade",
  "graze","guard","guide","horse",
  // 6-letter (original)
  "racing","baster","castle","detail","eating","famine","garden","halter",
  "insert","listen","master","nestle","orange","palest","reason","sadnet",
  "tapers","travel","walnut","cradle","loaner","poster","remain","silent",
  "stream","thread","winter",
  // 6-letter (new — 40)
  "action","across","artist","battle","candle","canter","center","change",
  "charge","closer","combat","crafty","dancer","deadly","define","deluge",
  "desert","duster","errand","falter","gamble","glance","hamlet","honest",
  "hunter","insane","jangle","jungle","lancer","lather","latent","linger",
  "luster","mangle","mantle","marble","marvel","muster","nectar","noting",
  // 7-letter (original)
  "eastern","roasted","saltine","nastier","realign","strange","plaster",
  "storing","leading","claimed","painter","coaster","trading","reliant",
  "threads",
  // 7-letter (new — 20)
  "algebra","blanket","blunder","breaker","cabinet","captain","capture",
  "cartoon","chapter","cluster","compete","concern","content","counter",
  "courage","curtain","darling","dashing","floated","frosted"
];

const DOMAIN = "https://unscramblewordspro.com";
const OUT_DIR = path.join(__dirname, "pages");

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
  results.sort((a, b) => b.length - a.length || scoreWord(b) - scoreWord(a) || a.localeCompare(b));
  return results;
}

function escapeHtml(s) {
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
          .replace(/"/g,"&quot;").replace(/'/g,"&#39;");
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

/* ── Intro paragraph templates (rotated to avoid duplication) ── */
const INTROS = [
  (L, n) => `Looking for words you can make from the letters <strong>${L.toUpperCase()}</strong>? You have come to the right place. Our word unscrambler found <strong>${n} valid words</strong> that can be formed using these letters. Whether you are playing Scrabble, Words With Friends, Wordle, or any other word game, this page gives you every possible word sorted by length and scored for maximum points. Use the results below to find your best play, learn new vocabulary, and improve your word-game performance. Every result has been verified against the ENABLE word list used in North American and international word game competitions, so you can trust each entry is dictionary-valid.`,
  (L, n) => `Can you unscramble <strong>${L.toUpperCase()}</strong>? We can. Our word finder has identified <strong>${n} words</strong> that use some or all of these letters. From short two-letter plays to longer high-scoring words, every result below is valid in the Scrabble TWL and Collins SOWPODS dictionaries used in US, UK, Canadian, and Australian tournaments. The words are organised by length so you can quickly find five-letter Wordle candidates, seven-letter Scrabble bingos, or short fills for a tight crossword grid. Bookmark this page for quick reference the next time these letters appear on your rack.`,
  (L, n) => `The letters <strong>${L.toUpperCase()}</strong> can be rearranged into <strong>${n} valid English words</strong>. This page lists every word our dictionary engine found, complete with Scrabble point values. Whether you are stuck in a crossword, solving an anagram, or need a high-scoring Scrabble play, scroll down to see the full list organised by word length and score. Our engine cross-references the ENABLE lexicon and the dwyl English words corpus to ensure comprehensive coverage, giving you results that work whether you play under North American TWL rules or UK and international Collins SOWPODS rules.`,
  (L, n) => `Need to find every word hiding in <strong>${L.toUpperCase()}</strong>? Our anagram solver discovered <strong>${n} results</strong> using these letters. Each word below is verified against authoritative word-game dictionaries including ENABLE, Collins SOWPODS, and TWL. The page is structured to help you at every stage of your game: the best-scoring words appear first for quick Scrabble reference, followed by a length-sorted full list ideal for Wordle elimination, Jumble solving, and word puzzle apps. Use the scored results to pick the highest-value play and gain an edge over your opponent.`,
  (L, n) => `Unscrambling <strong>${L.toUpperCase()}</strong> reveals <strong>${n} playable words</strong>. Below you will find every valid combination sorted by length, each with its Scrabble tile score. These results are useful for Scrabble under US TWL and UK SOWPODS rules, Words With Friends, Wordle clue-solving, Jumble puzzles, and any other English word game. Studying the word list for a given set of letters is one of the most effective ways to expand your vocabulary because it shows you real, dictionary-valid words built from letters you already recognise — not abstract word lists removed from context.`,
  (L, n) => `If the letters <strong>${L.toUpperCase()}</strong> just appeared on your Scrabble rack or Wordle keyboard, you are in the right place. We found <strong>${n} valid words</strong> from these letters by checking every possible subset and arrangement against our 370,000-word dictionary. The results are sorted by length and scored using standard Scrabble tile values, so the highest-potential plays rise to the top immediately. Whether you need a quick two-letter filler, a five-letter Wordle answer, or a seven-letter bingo play worth 50 bonus points, this page has every option laid out clearly.`,
  (L, n) => `Our word finder searched <strong>${n} valid words</strong> from the letters <strong>${L.toUpperCase()}</strong>. We verify every result against the ENABLE dictionary, the standard word list for competitive English word games across the United States, United Kingdom, Canada, and Australia. You will see results grouped by word length so that you can quickly navigate to the word length most relevant to your game. Five-letter words are highlighted for Wordle players; longer words with higher scores are prioritised for Scrabble; and the complete list gives crossword solvers and anagram enthusiasts every option available from these specific letters.`,
  (L, n) => `Word games reward players who know how to extract maximum value from any combination of letters. The set <strong>${L.toUpperCase()}</strong> yields <strong>${n} valid English words</strong> — each one playable in Scrabble, Words With Friends, or as a Wordle candidate. This page presents every valid result with its Scrabble score so that you can identify not just which plays are possible but which plays are best. The words are drawn from the ENABLE lexicon, which forms the foundation of the TWL tournament dictionary used in North America and overlaps substantially with the Collins SOWPODS list used in UK and Australian competitive play.`,
];

/* ── Letter analysis helper ── */
function analyseLetters(L) {
  const VOWELS = new Set(['a','e','i','o','u']);
  const HIGH_VALUE = { j:8, k:5, q:10, x:8, y:4, z:10, v:4, w:4, f:4, h:4 };
  const letters = L.toLowerCase().split('');
  const vowels = letters.filter(c => VOWELS.has(c));
  const consonants = letters.filter(c => !VOWELS.has(c));
  const highVal = letters.filter(c => HIGH_VALUE[c]);
  const unique = [...new Set(letters)];
  const repeated = letters.filter((c, i, a) => a.indexOf(c) !== i);
  const vowelList = vowels.length ? vowels.map(v => v.toUpperCase()).join(', ') : 'none';
  const consonantList = consonants.length ? consonants.map(c => c.toUpperCase()).join(', ') : 'none';
  const highValList = highVal.length ? highVal.map(c => `${c.toUpperCase()} (${HIGH_VALUE[c]} pts)`).join(', ') : 'none';

  let html = `<p>The letter set <strong>${L.toUpperCase()}</strong> contains <strong>${vowels.length} vowel${vowels.length !== 1 ? 's' : ''}</strong> (${vowelList}) and <strong>${consonants.length} consonant${consonants.length !== 1 ? 's' : ''}</strong> (${consonantList}). `;
  if (highVal.length) {
    html += `It includes the high-value tile${highVal.length > 1 ? 's' : ''} ${highValList}, which should be used on premium squares whenever possible. `;
  } else {
    html += `All tiles score 1&ndash;3 points each, making this a rack where length and bingo opportunities matter more than individual tile placement. `;
  }
  if (repeated.length) {
    html += `Note that <strong>${[...new Set(repeated)].map(c => c.toUpperCase()).join(', ')}</strong> appear${repeated.length === 1 ? 's' : ''} more than once, which limits some combinations but still allows a wide range of plays. `;
  }
  html += `With ${unique.length} unique letter${unique.length !== 1 ? 's' : ''} to work with, this is ${unique.length >= 6 ? 'a versatile rack with many possibilities' : 'a focused set that rewards knowing short, high-value words'}.</p>`;
  return html;
}

/* ── Section: How to use these letters ── */
const HOW_SECTIONS = [
  (L) => `<p>In <strong>Scrabble</strong>, look for the longest word you can play from ${L.toUpperCase()} to maximise your score. If the board is tight, shorter words that land on premium squares (double or triple letter and word scores) can be even more valuable. Remember that two-letter words are essential for parallel plays — see our <a href="${DOMAIN}/guides/two-letter-scrabble-words.html" style="color:var(--primary)">complete two-letter words guide</a>.</p><p>For <strong>Wordle</strong>, if you know some of these letters are in today's answer, use the filter on our <a href="${DOMAIN}/" style="color:var(--primary)">word unscrambler</a> to narrow by length (5), starting letter, ending letter, or contained letters.</p><p>In <strong>Words With Friends</strong>, the scoring differs slightly from Scrabble, but the word list overlaps heavily. The highest-scoring words below will generally be strong WWF plays too.</p>`,
  (L) => `<p>When playing <strong>Scrabble</strong> with letters like ${L.toUpperCase()}, prioritise words that use high-value tiles on premium squares. Check the score column in the Best Words section above for the strongest plays. Bingos — using all 7 tiles — earn a 50-point bonus, so always scan for 7-letter words first. Read our <a href="${DOMAIN}/guides/scrabble-strategy-guide.html" style="color:var(--primary)">full Scrabble strategy guide</a> for advanced techniques.</p><p>For <strong>crossword puzzles</strong>, use the word-length groupings below to find words that fit your available grid space. Each word is a valid English dictionary entry confirmed across multiple word lists.</p><p>If you are solving a <strong>Wordle</strong> or <strong>Jumble</strong>, start with the 5-letter and 6-letter results respectively — they are the most common target lengths for those games.</p>`,
  (L) => `<p>These letters — ${L.toUpperCase()} — offer several strong plays for <strong>Scrabble</strong>. Focus on the Best Scoring Words section for maximum points. If you can place a word on a triple-word-score square, even a modest 5-letter word can yield 30+ points. See which words are available at each length to plan your best play for the current board position.</p><p>For <strong>word puzzle apps</strong> like Word Cookies, Wordscapes, or Text Twist, the full word list below gives you every valid answer. Work through the longer words first, then fill in shorter ones to complete bonus rounds.</p><p>Playing <strong>Words With Friends</strong>? The same words apply, though WWF uses a slightly different tile distribution. The vast majority of results below are valid in both games.</p>`,
  (L) => `<p><strong>Scrabble players</strong> should pay close attention to the 2- and 3-letter words in this list. Short words played parallel to existing words create multiple scoring opportunities simultaneously — a technique called a parallel play. A well-placed 3-letter word touching three existing tiles can score 30+ points from a modest base word. Study our <a href="${DOMAIN}/guides/two-letter-scrabble-words.html" style="color:var(--primary)">two-letter words guide</a> to master this skill.</p><p>For <strong>Wordle</strong> solvers, any 5-letter word in the list below is a potential daily answer. Enter the letters into the <a href="${DOMAIN}/" style="color:var(--primary)">word finder</a> with a length filter of 5 to see all five-letter options at once.</p><p>In <strong>Bananagrams</strong> or speed-word games, the shortest valid words are most useful for quickly clearing your tile pile.</p>`,
  (L) => `<p>Getting the most from the letters <strong>${L.toUpperCase()}</strong> in <strong>Scrabble</strong> means thinking beyond the obvious word. Before playing the longest word you see, check whether a shorter word placed on a double or triple word score square would outscore it. A 5-letter word on a TWS (triple word score) beats most 7-letter words on a blank square. Balance length against premium square access every turn.</p><p>For <strong>anagram puzzles</strong> and <strong>cryptic crosswords</strong>, these letters can form the clue answer — scroll through the grouped word lengths to find entries that match your required length and any confirmed letters.</p><p>Players in the <strong>UK and Australia</strong> using Collins SOWPODS may find additional valid words beyond those shown — our results cover the ENABLE core list which aligns with both TWL and the majority of SOWPODS. Learn more in our <a href="${DOMAIN}/guides/scrabble-dictionary-guide.html" style="color:var(--primary)">dictionary comparison guide</a>.</p>`,
];

/* ── Educational benefit sections (rotated to avoid identical boilerplate) ── */
const STUDENT_SECTIONS = [
  () => `<p>Unscrambling words is a proven technique for improving spelling, vocabulary, and critical thinking. It is especially valuable for Grade 5&ndash;8 learners who are developing language fluency and preparing for reading comprehension tests.</p>
      <p>Practising with different letter combinations also builds pattern recognition &mdash; a skill that helps with faster reading, better typing, and stronger performance in any word-based subject. Players of all ages use this activity to sharpen their mental agility and expand their working vocabulary in a game-like setting.</p>
      <ul>
        <li><strong>Vocabulary growth:</strong> Seeing real words formed from familiar letters cements new words in memory faster than reading a list.</li>
        <li><strong>Spelling accuracy:</strong> Rearranging letters trains your brain to notice correct letter order.</li>
        <li><strong>Pattern recognition:</strong> Common prefixes (UN-, RE-) and suffixes (-ING, -ED, -ER) become second nature.</li>
        <li><strong>Cognitive agility:</strong> Regular word puzzles improve working memory and mental flexibility.</li>
      </ul>`,

  () => `<p>Research shows that finding a word yourself is far more powerful than reading it on a list. When you work out a word from scrambled letters, your brain stores it much more firmly. This is called active recall, and it produces stronger memory than passive review every time.</p>
      <p>Regular word puzzle practice also builds the mental focus needed for reading and maths. Students who play word games for 10&ndash;15 minutes a day tend to read faster and spell better within a few weeks.</p>
      <ul>
        <li><strong>Active recall:</strong> Finding words yourself builds memory far faster than reading a list.</li>
        <li><strong>Focus and attention:</strong> Sorting letters trains the same mental skills used in reading and maths.</li>
        <li><strong>Reading speed:</strong> Spotting word patterns from puzzles carries over into faster, more fluent reading.</li>
        <li><strong>Test skills:</strong> Vocabulary gains from word games show up directly in school exams and tests.</li>
      </ul>`,

  () => `<p>Most English words are built from smaller parts: roots, prefixes, and suffixes. Unscrambling letters helps students notice these building blocks in real words. This is far more useful than memorising a list of definitions.</p>
      <p>A student who knows the root <em>port</em> (carry) will instantly recognise import, export, transport, portable, and deportation. That one root unlocks five words at once. Root knowledge is tested in the vocabulary sections of the SAT, ACT, GCSE, and A-Level exams.</p>
      <ul>
        <li><strong>Root word skills:</strong> Learning one root unlocks dozens of related words at the same time.</li>
        <li><strong>Prefix and suffix patterns:</strong> Spotting -ING, -ED, UN-, and RE- helps you decode new words on the spot.</li>
        <li><strong>Word families:</strong> CREATE, CREATIVE, CREATION, and CREATOR all share one root &mdash; learn one, gain four.</li>
        <li><strong>Exam readiness:</strong> Root and word-structure questions appear in every major English test and entrance exam.</li>
      </ul>`,

  () => `<p>Games work better than drills. When a student finds a word by solving a puzzle, the moment of discovery creates a positive feeling that makes the word stick. Research shows that words learned through play are recalled far more easily than words from a list.</p>
      <p>A student who tries five wrong guesses before finding the right word has thought far more deeply about that word than one who simply read a definition. That is why words discovered through play tend to stay in long-term memory.</p>
      <ul>
        <li><strong>Genuine curiosity:</strong> Puzzles create real motivation to find answers &mdash; not just pressure to complete a task.</li>
        <li><strong>Learning from mistakes:</strong> Wrong guesses before the right answer build a stronger understanding of letter patterns.</li>
        <li><strong>Self-checking:</strong> Students test and correct their own answers, which builds confidence and independence.</li>
        <li><strong>Real-world use:</strong> Words found through games appear in daily conversation more often than words from a textbook.</li>
      </ul>`,
];

/* ── Tips sections (rotated to avoid identical boilerplate) ── */
const TIPS_SECTIONS = [
  () => `<ul class="tips-list">
        <li><strong>Start with vowels:</strong> Identify A, E, I, O, U first &mdash; every valid word needs at least one.</li>
        <li><strong>Look for common suffixes:</strong> Try adding -ING, -ED, -ER, -EST, -LY to shorter root words you spot.</li>
        <li><strong>Try common prefixes:</strong> UN-, RE-, IN-, and OUT- can unlock longer words from short roots.</li>
        <li><strong>Group by consonant clusters:</strong> ST-, TR-, SH-, CH-, and TH- are highly productive starting pairs.</li>
        <li><strong>Work down in length:</strong> Start with the longest possible word, then remove one letter at a time.</li>
        <li><strong>Use a word finder:</strong> Tools like this page help you verify ideas quickly and catch words you might miss manually.</li>
      </ul>`,

  () => `<ul class="tips-list">
        <li><strong>Arrange letters in a circle:</strong> Write or visualise the letters in a ring rather than a line &mdash; it breaks the reading order that locks your brain into one sequence.</li>
        <li><strong>Scan for double letters first:</strong> If two letters are the same, any word containing that pair (EE, TT, SS) narrows your search instantly.</li>
        <li><strong>Look for word families:</strong> If you find the word COLD, immediately test COLDS, COLDER, COLDEST &mdash; families share most of their letters.</li>
        <li><strong>Test plurals and verb forms early:</strong> Adding -S, -ES, -ED, or -ING to a shorter word you already found often produces a longer valid word for free.</li>
        <li><strong>Think about common endings:</strong> Words ending in -LE, -AL, -IC, -OUS are abundant in English &mdash; look for those letter combinations in your set.</li>
        <li><strong>Review what you missed:</strong> After checking this page, note every word you did not find independently &mdash; those gaps reveal your next vocabulary targets.</li>
      </ul>`,

  () => `<ul class="tips-list">
        <li><strong>Count your vowels first:</strong> With 2 vowels and 5 consonants, expect shorter words. With 4+ vowels, look for longer words and -TION, -OUS, -ION endings.</li>
        <li><strong>Try reversals:</strong> RATS becomes STAR, STAR becomes ARTS &mdash; simple reversal reveals entirely different words from the same letters.</li>
        <li><strong>Spot high-value tiles:</strong> If your letters include J, Q, X, or Z, prioritise short but high-scoring words built around those tiles: QI, ZA, XI, AX, JO.</li>
        <li><strong>Use elimination:</strong> Cross off letters as you use them mentally &mdash; once you have used 4 letters in a word, only the remaining ones are available for alternatives.</li>
        <li><strong>Think in categories:</strong> Ask yourself &mdash; is there a plant, animal, colour, job title, or action word hidden here? Category thinking activates different vocabulary stores.</li>
        <li><strong>Time yourself for speed:</strong> Set a 60-second timer and challenge yourself to find as many words as possible before checking &mdash; speed practice accelerates pattern recognition.</li>
      </ul>`,

  () => `<ul class="tips-list">
        <li><strong>Start with 2- and 3-letter words:</strong> Short valid words (GO, AT, IN, ARE, EAR, ATE) are easy to spot and often anchor longer words you can build from them.</li>
        <li><strong>Look for -TION and -SION:</strong> These suffixes create nouns from verbs and are extremely common in English &mdash; if you have T, I, O, N in your set, a noun may be hiding there.</li>
        <li><strong>Consider less obvious words:</strong> Common short words like AA (type of lava), QI (life force), and ZA (pizza) are valid in most word games and easy to miss.</li>
        <li><strong>Break consonant clusters apart:</strong> The cluster NGTH appears in words like LENGTH and STRENGTH &mdash; recognising these multi-consonant sequences unlocks long words quickly.</li>
        <li><strong>Ask &ldquo;what root is here?&rdquo;:</strong> If you see the letters A, C, T, you have the root ACT &mdash; from which you can build FACT, PACT, TACT, ACTED, ACTOR, ENACT.</li>
        <li><strong>Use this page as your teacher:</strong> Every word in the list below that you did not know before is a new vocabulary entry &mdash; look it up and note the definition.</li>
      </ul>`,
];

/* ── Pick N related page links (not self) ── */
function pickRelated(currentLetters, allCombos, n) {
  const others = allCombos.filter(c => c !== currentLetters);
  // prefer combos that share at least one letter
  const shared = others.filter(c => [...c].some(ch => currentLetters.includes(ch)));
  const pool = shared.length >= n ? shared : others;
  const picked = [];
  const used = new Set();
  while (picked.length < n && picked.length < pool.length) {
    const idx = Math.floor((picked.length * 7 + currentLetters.charCodeAt(0)) % pool.length);
    const candidate = pool[idx];
    if (!used.has(candidate)) { picked.push(candidate); used.add(candidate); }
    pool.splice(idx, 1);
  }
  return picked;
}

/* ── Example sentences for common words ── */
const WORD_SENTENCES = {
  at:"Meet me at the park after school.", it:"It was a beautiful sunny day.", in:"She was in the library studying.", an:"He ate an apple for breakfast.", is:"The book is on the table.", on:"The cat sat on the mat.", to:"She walked to the store.", do:"Can you do me a favour?", go:"Let's go to the beach today.", be:"Be kind to everyone you meet.", no:"There is no more milk left.", so:"She studied hard, so she passed.", up:"The balloon floated up into the sky.", us:"The teacher gave us extra time.", if:"If you practice, you will improve.",
  ate:"She ate a sandwich for lunch.", are:"They are going to the movies.", ace:"She hit an ace in the tennis match.", art:"The art show featured local paintings.", ear:"She whispered in his ear.", eat:"We eat dinner together every evening.", era:"The digital era changed how we communicate.", net:"He caught the fish in a net.", ore:"The miners dug for iron ore.", tea:"She sipped her hot tea slowly.", tin:"He stored the cookies in a tin.", ape:"The ape climbed to the top of the tree.", tap:"Turn off the tap to save water.", ran:"He ran as fast as he could.", cat:"The cat sat on the warm windowsill.", can:"She can speak three languages fluently.", car:"The red car drove down the highway.", tan:"After a week at the beach, she had a tan.", ten:"There are ten students in the group.", set:"She set the table for dinner.", sea:"The sea was calm and sparkling.", see:"Can you see the mountains from here?", use:"Use a ruler to draw a straight line.", sun:"The sun rises in the east.", run:"He went for a run every morning.", cut:"She used scissors to cut the paper.", cup:"He poured juice into the cup.", end:"The end of the book was surprising.", get:"Did you get my message?", hat:"He wore a blue hat to the game.", hit:"The ball hit the fence hard.", hot:"The soup was too hot to eat.", let:"Let me help you with that.", lot:"There is a lot of homework tonight.", map:"She used a map to find the trail.", man:"The old man sat on the bench.", met:"They met at the coffee shop.", new:"She got a new backpack for school.", now:"We must leave right now.", own:"Everyone should own a dictionary.", pay:"He will pay for the groceries.", pen:"She signed her name with a blue pen.", pet:"Her pet rabbit was fluffy and white.", pot:"She stirred the pot of vegetable soup.", put:"Put your books in your bag.", red:"She wore a red dress to the party.", sad:"She felt sad when the movie ended.", sky:"The sky was a brilliant shade of orange.", top:"The view from the top was breathtaking.", try:"Always try your best at everything.", two:"She has two brothers and one sister.", was:"He was the first to arrive.", way:"Is this the way to the station?", wet:"His shoes got wet in the rain.", win:"She trained hard to win the race.", won:"Our team won the championship.", yet:"She has not finished yet.",
  able:"She was able to solve the puzzle.", area:"The park covers a large area.", arms:"She stretched her arms above her head.", back:"He sat at the back of the class.", bale:"The farmer tied the hay into a bale.", base:"She ran to first base quickly.", bear:"A bear was spotted near the campsite.", beat:"Her heart began to beat faster.", best:"She always tries to do her best.", bird:"A tiny bird sang outside the window.", blue:"The sky turned a deep blue at dusk.", boat:"They sailed the boat across the lake.", bold:"The bold headline caught everyone's attention.", bone:"The dog chewed on a bone.", book:"She read a book every week.", calm:"She took a deep breath to stay calm.", care:"She handled the project with great care.", case:"The detective solved the case quickly.", chat:"They had a long chat over coffee.", city:"The city lit up beautifully at night.", clay:"She shaped the clay into a bowl.", coal:"Coal was once a main source of energy.", coat:"She buttoned up her coat in the cold.", code:"He cracked the secret code quickly.", cold:"The cold water refreshed her.", cool:"The evening breeze felt cool and pleasant.", core:"She ate the apple down to the core.", cost:"The cost of the trip was reasonable.", crew:"The ship's crew worked through the night.", crop:"The farmer harvested a good crop.", cure:"Scientists are searching for a cure.", dare:"He didn't dare to look down.", data:"The computer stored large amounts of data.", date:"They chose a date for the party.", dawn:"She woke up at dawn to watch the sunrise.", deep:"The ocean is deep and full of mystery.", desk:"Her desk was organised neatly.", diet:"A healthy diet includes fruits and vegetables.", dirt:"His boots were caked in dirt.", dish:"She carried the dish to the table.", dock:"The boat pulled up to the dock.", door:"He knocked on the door politely.", down:"The sun went down slowly.", draw:"She loves to draw animals.", drop:"A single drop of rain fell on her nose.", drum:"He played the drum at the concert.", dual:"The tool has a dual purpose.", dull:"The dull pencil needed sharpening.", dust:"She wiped the dust off the shelf.", each:"Each student received a certificate.", earn:"She worked hard to earn a good grade.", ease:"She completed the task with ease.", east:"The sun rises in the east.", edge:"She stood at the edge of the cliff.", even:"The score was even at halftime.", ever:"Have you ever visited a rainforest?", exam:"She studied all night for the exam.", face:"She washed her face with cold water.", fact:"A fact is something that is definitely true.", fair:"The school fair raised a lot of money.", fall:"Leaves fall from the trees in autumn.", fame:"He achieved fame through hard work.", farm:"They spent the weekend at a farm.", fast:"She ran fast to catch the bus.", fate:"It seemed like fate that they met.", fear:"He overcame his fear of heights.", film:"They watched a film on Friday night.", find:"Can you help me find my keys?", fine:"The weather was fine for a picnic.", fire:"The fire crackled in the fireplace.", firm:"She kept a firm grip on the rope.", fish:"They caught three fish from the river.", flat:"The road ahead was flat for miles.", flow:"The river began to flow more rapidly.", fold:"Fold the paper in half carefully.", fond:"She is fond of reading mystery novels.", food:"Fresh food is better for your health.", foot:"She tapped her foot to the music.", fork:"Use your fork and knife at the table.", form:"Please fill in the form carefully.", fort:"The children built a fort with pillows.", free:"Admission to the museum is free.", frog:"The frog leaped from stone to stone.", fuel:"The car needed fuel before the long trip.", full:"The stadium was full of cheering fans.", fund:"The school raised a fund for new books.", gain:"She worked hard to gain experience.", gale:"A gale battered the coast all night.", game:"They played a board game after dinner.", gate:"She closed the gate behind her.", gave:"He gave her a book for her birthday.", gear:"He shifted into a lower gear on the hill.", gift:"She received a gift wrapped in silver paper.", girl:"The girl won the spelling contest.", give:"Give your best effort every day.", glad:"He was glad to see his old friend.", glow:"The fire cast a warm glow across the room.", goal:"He kicked the ball and scored a goal.", gold:"The necklace was made of pure gold.", gone:"By the time she arrived, he was gone.", good:"She did a good job on the project.", grew:"The plant grew quickly in the sun.", grip:"She tightened her grip on the handle.", grit:"She showed real grit and determination.", grow:"Children grow quickly in their early years.", gust:"A gust of wind blew her hat off.", half:"She ate half of the sandwich.", halt:"The train came to a sudden halt.", hand:"He raised his hand to ask a question.", hard:"The test was harder than expected.", hare:"The hare ran much faster than the tortoise.", harm:"His words caused more harm than good.", hate:"She hates being late for anything.", haze:"A morning haze hung over the valley.", head:"She nodded her head in agreement.", heal:"Time helps to heal most wounds.", hear:"Can you hear the birds singing?", heat:"The heat of the summer was intense.", help:"She asked for help with the assignment.", hero:"The firefighter was hailed as a hero.", hide:"The children loved to hide and seek.", high:"The mountain was incredibly high.", hill:"They rolled down the grassy hill.", hire:"The company decided to hire more staff.", hold:"Please hold the door for me.", hole:"The rabbit disappeared into its hole.", home:"She was happy to be back home.", hook:"She hung her coat on the hook.", hope:"She had hope that things would improve.", horn:"The car driver sounded the horn.", host:"She was a wonderful host at the party.", hour:"The meeting lasted just one hour.", huge:"A huge wave crashed on the shore.", hunt:"They went on a treasure hunt in the park.", hurt:"He hurt his ankle during the game.", idea:"She came up with a brilliant idea.", inch:"The plant grew an inch every week.", isle:"The small isle was covered in pine trees.", item:"Each item on the list was checked off.", join:"Would you like to join our book club?", joke:"She told a funny joke at the party.", jump:"He had to jump across the puddle.", just:"She just finished the last chapter.", keen:"She is keen to learn new things.", keep:"Keep your room tidy every day.", kick:"He aimed the kick at the goal.", kind:"She was kind to everyone she met.", king:"The king ruled his kingdom wisely.", knew:"She knew the answer immediately.", know:"Do you know where the library is?", lace:"She tied the lace on her shoe.", lack:"A lack of sleep affects performance.", lake:"They swam in the clear mountain lake.", land:"The plane prepared to land at noon.", lane:"She jogged along the quiet country lane.", last:"He was the last to leave the classroom.", late:"Try not to be late for school.", laws:"We must follow the laws of the land.", lazy:"The lazy cat slept all afternoon.", lead:"She was chosen to lead the project.", leaf:"One red leaf floated to the ground.", lean:"She leaned against the wall to rest.", leap:"The frog made a giant leap over the log.", left:"Turn left at the traffic lights.", less:"Try to use less water when you wash.", liar:"Nobody believed the liar.", life:"A healthy life comes from good habits.", lift:"Could you lift this box for me?", like:"She likes to paint in the afternoons.", lime:"She squeezed lime juice over the salad.", line:"Please stand in a line and wait.", lion:"The lion roared across the savanna.", list:"She made a shopping list before going out.", live:"They live in a house near the beach.", load:"The truck carried a heavy load of bricks.", lock:"Remember to lock the door at night.", long:"She waited a long time for the bus.", look:"Look both ways before crossing the road.", loop:"The ribbon was tied in a neat loop.", lose:"Nobody wants to lose their keys.", loss:"She felt a deep sense of loss.", loud:"The music was loud but exciting.", love:"She has a great love of reading.", luck:"With a bit of luck, we will win.", lure:"The colourful display was enough to lure visitors in.", made:"She made a cake for the celebration.", mail:"The mail arrived early that morning.", main:"The main entrance was decorated with flowers.", make:"Can you help me make a model bridge?", male:"The male lion guards the pride.", mall:"They walked through the mall all afternoon.", mane:"The horse tossed its mane in the breeze.", mark:"Please mark the correct answer.", mass:"A mass of clouds gathered on the horizon.", mast:"The mast of the sailing boat was tall.", mate:"She greeted her mate with a wave.", math:"Math is useful in everyday life.", meal:"They enjoyed a warm meal together.", mean:"She did not mean to offend anyone.", meat:"He chose a vegetable dish instead of meat.", mend:"She used a needle and thread to mend the tear.", mess:"His desk was a complete mess.", mice:"Mice are small furry animals.", mild:"The mild weather was perfect for hiking.", mile:"She ran a mile without stopping.", milk:"She poured milk into her cereal.", mill:"The old windmill still turned in the breeze.", mine:"That book is mine, not yours.", mint:"She added a sprig of mint to the drink.", miss:"Don't miss the beginning of the film.", mist:"A thin mist covered the hills at dawn.", mode:"Switch the device to silent mode.", mole:"A mole dug tunnels under the garden.", mood:"Music can lift your mood instantly.", moon:"The full moon lit the path.", more:"Would you like some more water?", most:"She spent most of her time reading.", moth:"A moth flew around the lamp.", move:"They were asked to move their car.", much:"She achieved so much in one year.", must:"You must finish your homework first.", nail:"She hammered the nail into the wall.", name:"He called her name across the playground.", nape:"She felt a chill at the nape of her neck.", near:"The school is near the library.", neat:"Her notes were neat and organised.", need:"You need practice to improve.", next:"The next lesson starts at noon.", nice:"It was nice of him to help.", node:"Each node in the network is connected.", noon:"They met for lunch at noon.", nose:"She wrinkled her nose at the smell.", note:"She made a note to call back later.", nuts:"Squirrels collect nuts before winter.", once:"Once in a while, treat yourself.", only:"She is the only student who passed.", open:"Please open the window for fresh air.", oval:"The track had an oval shape.", oven:"She preheated the oven to bake bread.", over:"The game was over in under an hour.", page:"Turn to page fourteen in your textbook.", paid:"She paid for the groceries online.", pain:"He winced in pain after the fall.", pair:"She bought a new pair of shoes.", pale:"The pale moon shone through the curtains.", palm:"She held the coin in her palm.", pane:"The window pane was cracked by the ball.", park:"They met at the park on Saturday.", part:"She played a small part in the school play.", pass:"He hoped to pass his driving test.", past:"In the past, candles were used for light.", path:"They followed a narrow path through the forest.", peak:"They reached the mountain peak at noon.", pear:"She bit into a ripe pear.", pine:"The pine trees smelled wonderful.", pipe:"The plumber fixed the leaking pipe.", plan:"She drew up a plan for the project.", play:"Children learn a lot through play.", plot:"The plot of the novel was gripping.", poem:"She wrote a short poem about the ocean.", pole:"He climbed the wooden pole to hang the flag.", pond:"Ducks swam in the pond near the school.", pool:"They splashed around in the pool.", poor:"The poor harvest meant less food that year.", port:"The fishing boat returned to port.", post:"She pinned the note to the post.", pray:"She took a moment to pray.", prey:"The hawk circled above its prey.", pull:"Pull the door open instead of pushing.", pump:"She used a pump to inflate the tyres.", pure:"The mountain spring produced pure water.", push:"He gave the door a gentle push.", quiz:"The teacher gave a surprise quiz.", race:"She finished first in the race.", rack:"Hang your coat on the rack by the door.", rage:"He fought to control his rage.", rail:"She held the rail to keep her balance.", rain:"The rain fell steadily all afternoon.", rake:"He used a rake to gather the leaves.", tale:"She read a fairy tale at bedtime.", tear:"A single tear ran down her cheek.", tent:"They put up the tent before dark.", test:"He revised well before the test.", text:"She sent a text to let him know.", then:"Finish your homework, then you can play.", thin:"The ice was too thin to skate on.", tide:"The tide was coming in fast.", tile:"She chose a blue tile for the bathroom.", time:"Time flies when you are having fun.", tone:"She spoke in a calm, steady tone.", tool:"A hammer is a useful tool.", tour:"They went on a guided tour of the museum.", town:"The small town held a summer fair.", trap:"The hunter set a trap in the woods.", tree:"She climbed the tree to pick an apple.", trip:"The school trip to the museum was excellent.", true:"Hard work always brings true rewards.", tune:"She hummed a cheerful tune all morning.", turn:"It's your turn to choose the movie.", type:"Please type your name in the box.", undo:"Press Ctrl+Z to undo the change.", unit:"Each unit of work builds on the last.", used:"She used all her tokens in one go.", vale:"The valley was sometimes called a vale.", vane:"The weather vane spun in the storm.", vase:"She placed fresh flowers in the vase.", vast:"The vast desert stretched to the horizon.", very:"She was very happy with her results.", view:"The view from the hilltop was stunning.", vine:"The vine crept up the old stone wall.", wade:"She waded through the shallow stream.", wake:"Wake up before sunrise for the best views.", walk:"They took a long walk along the coast.", wall:"She painted a mural on the wall.", want:"She wants to become a scientist.", warm:"The fire kept the room warm all night.", wave:"She gave a little wave from the window.", weak:"After the illness, he felt weak.", well:"She has been doing really well lately.", went:"She went to the park with her friends.", west:"The sun sets in the west.", wide:"The road was wide enough for three lanes.", wild:"The wild horses ran freely across the plain.", will:"She will finish the book by Friday.", wind:"The wind rattled the windows.", wing:"The bird spread its wing and took flight.", wire:"The wire held the fence in place.", wise:"She made a wise decision.", wish:"Close your eyes and make a wish.", wolf:"The wolf howled at the full moon.", wood:"The log cabin was built from wood.", wool:"Her jumper was made from soft wool.", word:"Every word in a dictionary has a meaning.", work:"Hard work eventually pays off.", worm:"An earthworm helps to aerate the soil.", wrap:"Wrap the gift in coloured paper.", yard:"They played in the front yard.", yarn:"She bought a ball of yarn to knit a scarf.", year:"A new year brings new opportunities.", yell:"Don't yell — speak calmly instead.", zone:"This is a no-parking zone.", zeal:"She tackled every task with great zeal.",
  angel:"The angel costume won the fancy dress prize.", anger:"He took a deep breath to manage his anger.", brave:"She was brave enough to speak in front of the crowd.", chain:"A chain of mountains stretches across the region.", charm:"Her charm made her popular at every event.", chart:"The teacher drew a chart to show the results.", chase:"The dog began to chase the ball down the hill.", clean:"She cleaned her room from top to bottom.", clear:"The sky was clear after the rain stopped.", cloud:"A dark cloud drifted across the sun.", crane:"A crane was used to lift the heavy beam.", craft:"Pottery is a traditional craft still practised today.", dance:"She practised her dance routine every evening.", eagle:"The eagle soared high above the mountain ridge.", earth:"The earth's surface is mostly covered by water.", extra:"She did extra revision before the exam.", flame:"The flame flickered in the gentle breeze.", float:"A rubber duck began to float across the bath.", found:"She found the missing piece under the sofa.", frame:"He chose a wooden frame for the painting.", fresh:"Fresh air and exercise improve wellbeing.", frost:"A layer of frost covered the grass in the morning.", giant:"A giant oak tree stood at the edge of the field.", glide:"The skater began to glide across the ice.", globe:"She traced her finger across the globe.", grace:"She moved across the stage with grace.", grade:"She received a top grade on her essay.", grain:"A grain of sand can be beautiful under a microscope.", graze:"Sheep graze on the hillside all summer.", guard:"The guard stood at the entrance all night.", guide:"She volunteered as a tour guide at the museum.", heart:"She put her heart into every painting she made.", horse:"She learned to ride a horse that summer.", irate:"The irate customer demanded to speak to the manager.", lance:"The knight couched his lance and charged.", large:"The large stadium could hold 50,000 fans.", laser:"A laser pointer helped the speaker highlight key points.", leapt:"The cat leapt from the windowsill to the bed.", lemon:"She squeezed a lemon over the salad.", light:"She turned on the light to read.", magic:"The show had a real sense of magic about it.", mango:"She sliced a ripe mango for breakfast.", model:"He built a model aeroplane over the holidays.", money:"She saved her money carefully over the year.", month:"A lot can change in a single month.", music:"Music brings people together.", night:"The night was cold but the stars were bright.", noble:"It was a noble gesture to donate the prize money.", novel:"She wrote her first novel during the holidays.", nurse:"The nurse checked on the patient every hour.", ocean:"The ocean stretched endlessly to the horizon.", offer:"She received an offer to join the team.", olive:"He added an olive to the salad.", onset:"At the onset of winter, the temperature plummeted.", orbit:"Satellites orbit the earth constantly.", order:"He placed an order for the new textbooks.", outer:"The outer wall of the castle was crumbling.", owner:"The dog greeted its owner at the door.", paint:"She used bright colours to paint the mural.", paper:"Please write your name on the paper.", parse:"She had to parse the sentence into its components.", party:"They organised a surprise party for her.", peace:"A sense of peace settled over the valley.", pearl:"She wore a pearl necklace to the event.", phase:"The first phase of the project is complete.", phone:"She remembered to charge her phone overnight.", piano:"He practised the piano for an hour each day.", pilot:"The pilot landed the plane safely in the storm.", place:"She found a quiet place to study.", plain:"The plain stretched out flat in every direction.", plane:"The paper plane sailed across the classroom.", plant:"She watered the plant on the windowsill.", plate:"She placed the plate of food on the table.", plead:"He continued to plead his case calmly.", point:"That is a very good point you just made.", power:"Solar power is a renewable energy source.", press:"She waited to press the button.", price:"The price of the book was reasonable.", pride:"She beamed with pride after her performance.", print:"Print your name clearly at the top.", prize:"She won the prize for best essay.", probe:"Scientists sent a probe into deep space.", proof:"She provided proof of her identity.", prose:"The story was written in beautiful prose.", prove:"She worked to prove her theory.", pulse:"The nurse checked her pulse carefully.", queen:"The queen waved to the crowd.", quest:"The students went on a nature quest.", queue:"Everyone stood in a queue at the checkout.", quick:"She was quick to understand new ideas.", quiet:"Please keep quiet during the assembly.", quote:"She began her speech with a famous quote.", radar:"The radar detected the approaching aircraft.", raise:"She raised her hand to answer the question.", rally:"The team's morale began to rally after the win.", range:"The range of topics covered was impressive.", rapid:"Rapid improvements were made after training.", reach:"She could barely reach the top shelf.", ready:"Are you ready for the big match?", reign:"She will reign as champion for another year.", relax:"After exams, it's important to relax.", reply:"He wrote a kind reply to her letter.", river:"The river curved through the forest.", roast:"They had a roast dinner on Sunday.", robot:"The robot sorted the packages automatically.", round:"She ran three rounds of the track.", royal:"The royal family appeared on the balcony.", saint:"The cathedral was named after a local saint.", sauce:"She made a rich tomato sauce from scratch.", scale:"The fish had bright silver scales.", scare:"The sudden noise gave her a scare.", scene:"The final scene of the play was moving.", scout:"He joined the scouts at the age of eight.", sense:"She had a strong sense of direction.", serve:"She was asked to serve on the committee.", shade:"They rested in the shade of the oak tree.", shake:"Give the bottle a good shake before opening.", shape:"The shape of the cloud looked like a horse.", share:"Always share fairly with your classmates.", sharp:"The knife had a very sharp edge.", shelf:"The books were arranged neatly on the shelf.", shift:"She agreed to work the early morning shift.", shine:"The stars began to shine as night fell.", shirt:"He wore a clean white shirt to the interview.", short:"The journey was shorter than expected.", shout:"She had to shout to be heard over the noise.", sight:"The sight of the waterfall was breathtaking.", skill:"A good skill takes time to develop.", slate:"The teacher wrote on the slate in old chalk.", sleep:"A good night's sleep is essential.", slice:"She cut a thin slice of bread.", slide:"The children raced down the slide.", smile:"A smile can brighten someone's day.", smoke:"Smoke rose from the chimney.", snare:"The hunter set a snare in the undergrowth.", space:"She needed some space to think.", spare:"Do you have a spare pencil?", spark:"A spark from the campfire landed on the log.", speak:"Speak clearly when giving your presentation.", speed:"She drove within the speed limit.", spend:"Try not to spend more than your budget.", spine:"She kept her spine straight while sitting.", spoke:"He spoke with great confidence.", sport:"Sport is important for physical health.", spray:"She used spray paint to decorate the canvas.", stage:"She walked nervously onto the stage.", stamp:"She stuck a stamp on the envelope.", stand:"Please stand up when the teacher enters.", stare:"She tried not to stare at the painting.", start:"A healthy breakfast is a great start to the day.", state:"The state of the garden improved with care.", steam:"Steam rose from the hot bowl of soup.", steel:"The bridge was built from reinforced steel.", steep:"The hill was too steep to cycle up.", stern:"The teacher's stern look silenced the class.", stick:"She found a straight stick to use as a walking pole.", stone:"She skipped a flat stone across the pond.", store:"The corner store sold everything they needed.", storm:"A storm was brewing on the horizon.", story:"She told a story that kept everyone listening.", sugar:"Add a spoonful of sugar to the mixture.", sunny:"It was a warm and sunny afternoon.", sweet:"The strawberries were surprisingly sweet.", swift:"The swift movement of the dancer amazed the crowd.", swing:"The children took turns on the swing.", table:"Spread the map out on the table.", taste:"The lemonade had a pleasant sour taste.", tease:"He didn't mean to tease her about her haircut.", thick:"The thick blanket kept her warm.", think:"Stop and think before answering.", thorn:"She pricked her finger on a thorn.", three:"They waited three days for the delivery.", throw:"He practised how to throw the ball accurately.", tight:"The lid was too tight to open.", timer:"Set a timer for twenty minutes.", tired:"She was tired after the long walk.", title:"The book title was printed in gold.", toast:"She burned the toast and had to start again.", total:"The total score was higher than expected.", touch:"Don't touch the wet paint.", tough:"The maths problem was really tough.", towel:"Hang your towel up after your shower.", tower:"The Eiffel Tower is one of the most visited structures.", trace:"She traced the outline of the leaf.", track:"She trained on the track every morning.", trade:"The town relied on the trade of local goods.", trail:"They followed the trail through the forest.", train:"The train arrived five minutes early.", treat:"She bought herself a treat after the exam.", trend:"The trend for eco-friendly products is growing.", trial:"The trial run helped identify the problems.", tribe:"The tribe gathered around the fire.", trout:"They caught two trout from the stream.", truly:"She was truly grateful for the help.", trust:"Trust is the foundation of any friendship.", truth:"Always tell the truth.", tutor:"Her tutor helped her prepare for the exam.", twist:"He gave the lid a sharp twist to open it.", ultra:"The device uses ultra-fast charging.", under:"The cat hid under the bed.", unite:"The team needed to unite to win.", until:"She waited until everyone had sat down.", upper:"The upper floor of the library was quieter.", upset:"She was upset that she missed the event.", urban:"Urban parks provide green spaces in cities.", usual:"She arrived at her usual time.", value:"She placed great value on kindness.", video:"They filmed a short video for the project.", viral:"The video went viral overnight.", visit:"They planned a visit to the botanical gardens.", vital:"Sleep is vital for memory and learning.", vivid:"She had vivid dreams about the adventure.", voice:"Her voice carried across the hall.", vowel:"A vowel is one of the letters A, E, I, O, or U.", watch:"He checked his watch and realised he was late.", water:"Water is essential for all living things.", weave:"She began to weave the basket from reeds.", weird:"It felt weird to be back after so long.", whale:"The whale breached and crashed back into the sea.", wheat:"Wheat is ground into flour for baking.", wheel:"The wheel on her bike needed pumping up.", while:"She read for a while before bed.", white:"The white walls made the room feel larger.", whole:"She ate the whole sandwich in minutes.", wider:"The path grew wider towards the park.", witch:"The story featured a friendly witch.", woman:"The woman in the portrait was smiling.", world:"She wanted to travel the world one day.", worry:"Try not to worry about things you can't control.", worse:"The weather got worse as the day went on.", worth:"The hard work was worth the reward.", would:"She said she would finish the project soon.", wound:"The nurse cleaned and dressed the wound.", write:"Take time to write clearly in your exam.", wrote:"She wrote a poem about the seasons.", yacht:"The yacht sailed smoothly across the bay.", yield:"The crop yield was higher than expected.", young:"The young puppy explored the garden eagerly.", youth:"The youth group organised a fundraiser.", zebra:"A zebra's stripes are unique, like fingerprints.", zeal:"She tackled every task with great zeal.",
  eastern:"The eastern coastline is rugged and dramatic.", roasted:"They roasted vegetables for the evening meal.", saltine:"A saltine cracker pairs well with soup.", nastier:"The second draft was nastier in tone than the first.", realign:"She had to realign her priorities after the move.", strange:"The strange noise turned out to be a cat outside.", plaster:"He applied a plaster to the small cut on his finger.", storing:"She was storing old books in the loft.", leading:"She was the leading scorer in the tournament.", claimed:"He claimed the prize at the ceremony.", painter:"The painter worked through the afternoon light.", coaster:"She placed her mug on the coaster.", trading:"The two students ended up trading stickers.", reliant:"Modern life is reliant on electricity.", threads:"The threads on the jacket were unravelling.", algebra:"She enjoyed the algebra lesson more than she expected.", blanket:"He pulled the blanket over his shoulders.", blunder:"Missing the deadline was a costly blunder.", breaker:"A circuit breaker protects electrical systems.", cabinet:"The files were kept in a locked cabinet.", captain:"She was elected captain of the netball team.", capture:"The photographer managed to capture the sunrise.", cartoon:"The children laughed at the cartoon.", chapter:"Each chapter of the novel began with a quote.", cluster:"A cluster of stars was visible in the south.", compete:"She trained every day to compete at nationals.", concern:"Her main concern was the safety of the group.", content:"Good content is the key to a successful website.", counter:"He placed the groceries on the kitchen counter.", courage:"It takes real courage to speak up.", curtain:"She drew the curtain to block out the light.", darling:"He addressed the letter to his darling grandmother.", dashing:"The dashing young man arrived on horseback.", floated:"The balloon floated above the treetops.", frosted:"The frosted window blurred the streetlights outside.",
};

function buildExampleSentences(words) {
  const sorted = [...words].sort((a, b) => b.length - a.length || scoreWord(b) - scoreWord(a));
  const found = [];
  for (const w of sorted) {
    const key = w.toLowerCase();
    if (WORD_SENTENCES[key]) {
      found.push({ word: w, sentence: WORD_SENTENCES[key] });
      if (found.length >= 5) break;
    }
  }
  if (found.length < 3) {
    for (const w of sorted) {
      if (!found.find(f => f.word === w) && found.length < 3) {
        const cap = w.charAt(0).toUpperCase() + w.slice(1);
        found.push({ word: w, sentence: `"${cap}" is a valid English word that appears in standard dictionaries.` });
      }
    }
  }
  if (found.length === 0) return '';
  let html = '<ul>\n';
  for (const { word, sentence } of found) {
    html += `  <li><strong>${word.toUpperCase()}</strong>: ${escapeHtml(sentence)}</li>\n`;
  }
  html += '</ul>\n';
  return html;
}

/* ── Group words by length ── */
function groupByLength(words) {
  const groups = {};
  for (const w of words) {
    const len = w.length;
    if (!groups[len]) groups[len] = [];
    groups[len].push(w);
  }
  return Object.keys(groups).sort((a,b) => b - a).map(len => ({
    len: Number(len), words: groups[len]
  }));
}

/* ── Build a single HTML page ── */
function buildPage(letters, words, allCombos, index) {
  const L = letters.toLowerCase();
  const U = letters.toUpperCase();
  const slug = `words-from-${L}`;
  const url = `${DOMAIN}/pages/${slug}.html`;
  const n = words.length;

  const best5 = words.slice().sort((a,b) => scoreWord(b) - scoreWord(a)).slice(0, 10);
  const groups = groupByLength(words);
  const related = pickRelated(L, allCombos, 8);
  const intro = INTROS[index % INTROS.length](L, n);
  const howSection = HOW_SECTIONS[index % HOW_SECTIONS.length](L);
  const letterAnalysis = analyseLetters(L);
  const exampleSentences = buildExampleSentences(words);
  const studentSection = STUDENT_SECTIONS[index % STUDENT_SECTIONS.length]();
  const tipsSection    = TIPS_SECTIONS[index % TIPS_SECTIONS.length]();

  const bestScore = best5[0] ? scoreWord(best5[0]) : 0;
  const bestWord  = best5[0] ? best5[0].toUpperCase() : U;
  const noindex   = n < 20;
  const title = `Words from ${U} (${n} Results) | Scrabble & Word Finder`;
  const desc  = `Find ${n} words from ${U}. Includes high-scoring Scrabble words, meanings, and example sentences. Improve vocabulary and word skills — free tool, instant results.`;

  // Build words table for each length group
  let allWordsHTML = "";
  for (const g of groups) {
    allWordsHTML += `<h3>${g.len}-Letter Words (${g.words.length})</h3>\n`;
    allWordsHTML += `<div class="word-grid">\n`;
    for (const w of g.words) {
      const sc = scoreWord(w);
      allWordsHTML += `  <div class="word-item"><span class="wi-text">${escapeHtml(w)}</span><span class="wi-score">${sc} pts</span></div>\n`;
    }
    allWordsHTML += `</div>\n`;
  }

  // Best words section
  let bestHTML = "";
  for (const w of best5) {
    const sc = scoreWord(w);
    bestHTML += `  <div class="word-item best"><span class="wi-text">${escapeHtml(w)}</span><span class="wi-score">${sc} pts</span></div>\n`;
  }

  // Related links
  let relatedHTML = "";
  for (const r of related) {
    relatedHTML += `    <a href="words-from-${r}.html" class="related-link">Words from ${r.toUpperCase()}</a>\n`;
  }

  // FAQ schema
  const faqSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `What words can you make from ${U}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `You can make ${n} words from the letters ${U}. The highest scoring word is "${bestWord}" worth ${bestScore} Scrabble points. Results cover word lengths from 2 to ${L.length} letters.`
        }
      },
      {
        "@type": "Question",
        "name": `How many words can be formed from the letters ${U}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `There are ${n} valid English words that can be formed using some or all of the letters ${U}. This includes ${groups.length} different word lengths, verified against the ENABLE, TWL, and Collins SOWPODS dictionaries.`
        }
      },
      {
        "@type": "Question",
        "name": `What is the highest-scoring Scrabble word from ${U}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The highest-scoring Scrabble word you can make from ${U} is "${bestWord}", which scores ${bestScore} points using standard TWL tile values. Use it on a double or triple word score square to maximise your points.`
        }
      },
      {
        "@type": "Question",
        "name": `Can I use ${U} letters for Wordle or Words With Friends?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Yes. All ${n} words found from ${U} are valid for Wordle (filter by 5-letter results), Words With Friends, Boggle, Jumble, and crossword puzzles. The free tool at unscramblewordspro.com lets you filter by length, starting letter, ending letter, and contained letters.`
        }
      }
    ]
  });

  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-ZCJTBHHQPX"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-ZCJTBHHQPX');
  </script>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://*.googlesyndication.com https://*.googletagservices.com https://*.google.com https://*.google.co.uk https://*.doubleclick.net https://*.googleadservices.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; connect-src https://www.googletagmanager.com https://www.google-analytics.com https://region1.google-analytics.com https://*.googlesyndication.com https://*.google.com https://*.google.co.uk https://*.doubleclick.net https://*.googleapis.com https://*.adtrafficquality.google https://*.googleadservices.com; img-src 'self' data: https://*.googlesyndication.com https://*.google.com https://*.google.co.uk https://*.doubleclick.net https://*.googleusercontent.com; frame-src https://*.doubleclick.net https://*.googlesyndication.com https://*.google.com; base-uri 'self'; form-action 'self';">
  <meta http-equiv="X-Content-Type-Options" content="nosniff">
  <meta name="referrer" content="strict-origin-when-cross-origin">
  <meta name="google-adsense-account" content="ca-pub-6261071610831190">
  <title>${escapeHtml(title.slice(0, 60))}</title>
  <meta name="description" content="${escapeHtml(desc.slice(0, 160))}">
  <meta name="keywords" content="unscramble ${L}, words with letters ${L}, anagram of ${L}, ${L} scrabble words, ${L} word finder, words from ${L}, ${L} anagram solver, ${L} wordle">
  <meta name="robots" content="${noindex ? 'noindex, follow' : 'index, follow'}">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${escapeHtml(title.slice(0, 60))}">
  <meta property="og:description" content="${escapeHtml(desc.slice(0, 160))}">
  <meta property="og:url" content="${url}">
  <meta property="og:site_name" content="Unscramble Words Pro">
  <script type="application/ld+json">${faqSchema}</script>
  <script type="application/ld+json">
  {
    "@context":"https://schema.org",
    "@type":"BreadcrumbList",
    "itemListElement":[
      {"@type":"ListItem","position":1,"name":"Home","item":"${DOMAIN}/"},
      {"@type":"ListItem","position":2,"name":"Unscramble ${U}","item":"${url}"}
    ]
  }
  </script>
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    [data-theme="dark"] {
      --bg: #0F172A; --bg-alt: #1E293B; --bg-raised: #334155; --surface: #1E293B;
      --border: #334155; --border-hover: #475569; --text: #E5E7EB; --text-2: #94A3B8;
      --text-3: #64748B; --primary: #2563EB; --primary-bg: rgba(37,99,235,0.12);
      --accent: #22C55E; --accent-bg: rgba(34,197,94,0.12);
      --shadow: 0 4px 16px rgba(0,0,0,0.35); --shadow-sm: 0 1px 3px rgba(0,0,0,0.3);
    }
    [data-theme="light"] {
      --bg: #F8FAFC; --bg-alt: #FFFFFF; --bg-raised: #F1F5F9; --surface: #FFFFFF;
      --border: #E2E8F0; --border-hover: #CBD5E1; --text: #0F172A; --text-2: #475569;
      --text-3: #94A3B8; --primary: #2563EB; --primary-bg: rgba(37,99,235,0.07);
      --accent: #16A34A; --accent-bg: rgba(22,163,74,0.08);
      --shadow: 0 4px 16px rgba(0,0,0,0.08); --shadow-sm: 0 1px 3px rgba(0,0,0,0.06);
    }
    html { scroll-behavior: smooth; }
    body { font-family: 'Inter', system-ui, -apple-system, sans-serif; background: var(--bg); color: var(--text); line-height: 1.6; min-height: 100vh; }
    .container { max-width: 820px; margin: 0 auto; padding: 0 20px; }

    /* Trust bar */
    .trust-bar { background: var(--bg-alt); border-bottom: 1px solid var(--border); padding: 8px 20px; text-align: center; font-size: 12px; color: var(--text-2); }

    /* Header */
    .header { background: var(--bg-alt); border-bottom: 1px solid var(--border); padding: 14px 20px; }
    .header-inner { max-width: 820px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; }
    .logo { font-weight: 800; font-size: 18px; display: flex; align-items: center; gap: 10px; color: var(--text); text-decoration: none; letter-spacing: -0.02em; }
    .logo svg { color: var(--primary); flex-shrink: 0; filter: drop-shadow(0 0 6px rgba(37,99,235,0.4)); }
    .logo .logo-pro { color: var(--primary); }
    .theme-btn { background: var(--bg-raised); border: 1px solid var(--border); border-radius: 8px; padding: 6px; cursor: pointer; color: var(--text-2); display: flex; }
    .hidden { display: none !important; }

    /* Hero */
    .hero { padding: 36px 0 20px; text-align: center; }
    .hero h1 { font-size: 28px; font-weight: 800; letter-spacing: -0.03em; line-height: 1.2; margin-bottom: 8px; }
    .hero h1 .hl { color: var(--accent); }
    .hero .subtitle { font-size: 15px; color: var(--text-2); max-width: 560px; margin: 0 auto 16px; }
    .hero .try-link { display: inline-block; margin-top: 12px; padding: 10px 24px; background: var(--primary); color: #fff; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 15px; transition: background .15s; }
    .hero .try-link:hover { background: var(--primary); filter: brightness(1.15); }

    /* Sections */
    .section { padding: 28px 0; }
    .section h2 { font-size: 20px; font-weight: 700; margin-bottom: 12px; letter-spacing: -0.02em; }
    .section h3 { font-size: 16px; font-weight: 600; margin: 20px 0 10px; color: var(--text-2); }
    .section p { font-size: 15px; color: var(--text-2); margin-bottom: 12px; line-height: 1.7; }

    /* Word grid */
    .word-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 8px; margin-bottom: 16px; }
    .word-item {
      display: flex; align-items: center; justify-content: space-between;
      padding: 10px 14px; background: var(--surface); border: 1px solid var(--border);
      border-radius: 10px; transition: all .15s;
    }
    .word-item:hover { border-color: var(--border-hover); box-shadow: var(--shadow-sm); transform: translateY(-1px); }
    .word-item.best { border-color: var(--accent); background: var(--accent-bg); }
    .wi-text { font-weight: 600; font-size: 15px; letter-spacing: 0.02em; }
    .wi-score { font-size: 11px; font-weight: 600; padding: 2px 7px; border-radius: 6px; background: var(--bg-raised); color: var(--text-2); white-space: nowrap; }
    .word-item.best .wi-score { background: var(--accent-bg); color: var(--accent); }

    /* Related links */
    .related { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
    .related-link {
      padding: 6px 14px; font-size: 13px; font-weight: 500; border-radius: 8px;
      background: var(--surface); border: 1px solid var(--border); color: var(--primary);
      text-decoration: none; transition: all .15s;
    }
    .related-link:hover { background: var(--primary-bg); border-color: var(--primary); }

    /* Breadcrumb */
    .breadcrumb { padding: 12px 0; font-size: 13px; color: var(--text-3); }
    .breadcrumb a { color: var(--primary); text-decoration: none; }
    .breadcrumb a:hover { text-decoration: underline; }

    /* Summary box */
    .summary-box {
      background: var(--bg-alt); border: 1px solid var(--border); border-radius: 12px;
      padding: 20px; margin: 16px 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 16px;
    }
    .sb-item { text-align: center; }
    .sb-value { font-size: 24px; font-weight: 800; color: var(--accent); }
    .sb-label { font-size: 12px; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.05em; }

    /* Footer */
    .footer { border-top: 1px solid var(--border); padding: 20px; text-align: center; font-size: 12px; color: var(--text-3); margin-top: 40px; }
    .footer a { color: var(--primary); text-decoration: none; }
    .footer a:hover { text-decoration: underline; }
    .footer-links { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px 20px; margin-bottom: 10px; }

    /* How-to section */
    .how-section p { margin-bottom: 10px; }

    /* Learning / tips / CTA sections */
    .edu-section { background: var(--bg-alt); border: 1px solid var(--border); border-radius: 12px; padding: 20px 24px; margin: 20px 0; }
    .edu-section h2 { font-size: 18px; font-weight: 700; margin-bottom: 10px; }
    .edu-section p { font-size: 14.5px; color: var(--text-2); line-height: 1.75; margin-bottom: 8px; }
    .edu-section ul { list-style: none; padding: 0; margin: 0; }
    .edu-section ul li { font-size: 14.5px; color: var(--text-2); padding: 6px 0; border-bottom: 1px solid var(--border); display: flex; align-items: flex-start; gap: 8px; line-height: 1.6; }
    .edu-section ul li:last-child { border-bottom: none; }
    .edu-section ul li::before { content: ''; width: 8px; height: 8px; background: var(--primary); border-radius: 50%; flex-shrink: 0; margin-top: 6px; }
    .edu-section ul li strong { color: var(--text); }
    .tips-list li::before { background: var(--accent) !important; }
    .cta-section { text-align: center; background: var(--primary-bg); border: 1px solid var(--primary); border-radius: 12px; padding: 28px 24px; margin: 24px 0; }
    .cta-section h2 { font-size: 20px; font-weight: 800; margin-bottom: 8px; }
    .cta-section p { font-size: 15px; color: var(--text-2); margin-bottom: 16px; }
    .cta-btn { display: inline-block; padding: 12px 28px; background: var(--primary); color: #fff; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 15px; transition: filter .15s; }
    .cta-btn:hover { filter: brightness(1.15); }

    @media (max-width: 600px) {
      .hero h1 { font-size: 22px; }
      .word-grid { grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); }
      .summary-box { grid-template-columns: 1fr 1fr; }
    }
  </style>
</head>
<body>
  <div class="trust-bar">Proudly built for word game players across &#127482;&#127480; USA, &#127468;&#127463; UK, &#127464;&#127462; Canada &amp; &#127462;&#127482; Australia.</div>

  <header class="header">
    <div class="header-inner">
      <a href="${DOMAIN}/" class="logo">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
        Unscramble Words <span class="logo-pro">Pro</span>
      </a>
      <button id="themeToggle" class="theme-btn" aria-label="Toggle theme">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
      </button>
    </div>
  </header>

  <main class="container">
    <nav class="breadcrumb">
      <a href="${DOMAIN}/">Home</a> &rsaquo; <span>Unscramble ${U}</span>
    </nav>

    <section class="hero">
      <h1>Unscramble <span class="hl">${U}</span></h1>
      <p class="subtitle">${n} words found from the letters ${U} &mdash; with Scrabble scores for every result.</p>
      <a href="${DOMAIN}/" class="try-link">Try Your Own Letters &rarr;</a>
    </section>

    <div class="summary-box">
      <div class="sb-item"><div class="sb-value">${n}</div><div class="sb-label">Words Found</div></div>
      <div class="sb-item"><div class="sb-value">${groups.length}</div><div class="sb-label">Word Lengths</div></div>
      <div class="sb-item"><div class="sb-value">${best5[0] ? scoreWord(best5[0]) : 0}</div><div class="sb-label">Best Score</div></div>
      <div class="sb-item"><div class="sb-value">${best5[0] ? best5[0].length : 0}</div><div class="sb-label">Longest Word</div></div>
    </div>

    <section class="section">
      <h2>About the Letters ${U}</h2>
      <p>${intro}</p>
      <h3>Letter Analysis</h3>
      ${letterAnalysis}
      <p>For more on word game strategy, read our <a href="${DOMAIN}/guides/scrabble-strategy-guide.html" style="color:var(--primary)">Scrabble Strategy Guide</a>, the <a href="${DOMAIN}/guides/best-wordle-starting-words.html" style="color:var(--primary)">Best Wordle Starting Words guide</a>, or the <a href="${DOMAIN}/guides/two-letter-scrabble-words.html" style="color:var(--primary)">complete two-letter Scrabble words list</a>.</p>
    </section>

    <section class="section">
      <h2>Best Scoring Words from ${U}</h2>
      <div class="word-grid">
${bestHTML}
      </div>
    </section>

    <section class="section">
      <h2>All ${n} Words from ${U}</h2>
${allWordsHTML}
    </section>

    <section class="section how-section">
      <h2>How to Use These Letters in Scrabble or Wordle</h2>
${howSection}
    </section>

    <div class="edu-section">
      <h2>Example Sentences</h2>
      <p>See how the top words from <strong>${U}</strong> are used in everyday English:</p>
${exampleSentences}
    </div>

    <div class="edu-section">
      <h2>How This Helps Students</h2>
${studentSection}
    </div>

    <div class="edu-section">
      <h2>Tips to Find Words Faster</h2>
${tipsSection}
    </div>

    <div class="cta-section">
      <h2>Practice Your Word Skills</h2>
      <p>Ready to test what you have learned? Try entering your own letters into our free word unscrambler and discover every valid word in under a second.</p>
      <a href="${DOMAIN}/" class="cta-btn">Try the Word Finder &rarr;</a>
      <p style="margin-top: 12px; font-size: 13px;">Supports Scrabble, Wordle, Words With Friends, Boggle &amp; more &mdash; free, no login required.</p>
    </div>

    <section class="section">
      <h2>Try More Word Combinations</h2>
      <div class="related">
${relatedHTML}
      </div>
      <p style="margin-top: 16px;"><a href="${DOMAIN}/" style="color:var(--primary); font-weight: 600;">&#8592; Back to Word Unscrambler Pro</a> &nbsp;|&nbsp; <a href="${DOMAIN}/sitemap.html" style="color:var(--primary);">Browse All Combos</a> &nbsp;|&nbsp; <a href="${DOMAIN}/guides/" style="color:var(--primary);">Strategy Guides</a></p>
    </section>
  </main>

  <footer class="footer">
    <div class="container">
      <div class="footer-links">
        <a href="${DOMAIN}/">Home</a>
        <a href="${DOMAIN}/about.html">About</a>
        <a href="${DOMAIN}/guides/">Guides</a>
        <a href="${DOMAIN}/privacy.html">Privacy Policy</a>
        <a href="${DOMAIN}/terms.html">Terms of Service</a>
        <a href="${DOMAIN}/contact.html">Contact</a>
        <a href="${DOMAIN}/sitemap.html">Site Index</a>
      </div>
      <p>&copy; 2026 <a href="${DOMAIN}/">Unscramble Words Pro</a> &mdash; Free word finder, Scrabble solver &amp; anagram tool for US, UK, Canada &amp; Australia</p>
    </div>
  </footer>

  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6261071610831190"
     crossorigin="anonymous"></script>
  <script src="page-theme.js"></script>
</body>
</html>`;
}

/* ── Main ── */
async function main() {
  console.log("Fetching ENABLE dictionary...");
  let dict;
  try {
    dict = await fetchDict("https://raw.githubusercontent.com/dolph/dictionary/master/enable1.txt");
    console.log(`Loaded ${dict.length} words from ENABLE.`);
  } catch (e) {
    console.error("Failed to fetch dictionary. Using embedded fallback.");
    // Fallback: load embedded dictionary.js
    const src = fs.readFileSync(path.join(__dirname, "dictionary.js"), "utf8");
    const match = src.match(/\[[\s\S]*\]/);
    dict = match ? JSON.parse(match[0]) : [];
    console.log(`Loaded ${dict.length} words from embedded dictionary.`);
  }

  // De-duplicate combos
  const uniqueCombos = [...new Set(COMBOS.map(c => c.toLowerCase().replace(/[^a-z]/g, "")))];
  console.log(`Generating ${uniqueCombos.length} pages...`);

  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  let generated = 0;
  for (let i = 0; i < uniqueCombos.length; i++) {
    const letters = uniqueCombos[i];
    const words = findWords(letters, dict);
    if (words.length === 0) {
      console.warn(`  ⚠ Skipping "${letters}" — no words found.`);
      continue;
    }
    const html = buildPage(letters, words, uniqueCombos, i);
    const filename = `words-from-${letters}.html`;
    fs.writeFileSync(path.join(OUT_DIR, filename), html, "utf8");
    generated++;
    if (generated % 10 === 0) console.log(`  ${generated} pages written...`);
  }

  console.log(`\nDone! ${generated} HTML pages written to ${OUT_DIR}`);
}

main().catch(err => { console.error(err); process.exit(1); });
