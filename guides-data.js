'use strict';
const D = 'https://unscramblewordspro.com';

module.exports = [

// ── 1. Wordle Tips ───────────────────────────────────────────────────────────
{
  slug: 'wordle-tips-and-tricks.html',
  tag: 'Wordle', crumb: 'Wordle Tips', mins: 6,
  h1: 'Wordle Tips and Tricks: 10 Strategies to Solve Every Puzzle',
  title: 'Wordle Tips and Tricks 2026: 10 Strategies to Solve Every Puzzle',
  desc: '10 proven Wordle strategies: best opening words, Hard Mode tips, trap patterns, and streak protection. For beginners and advanced players.',
  lead: 'Wordle gives you six guesses to find a 5-letter word. With the right strategy you can consistently solve in 3 guesses or fewer — whether you are on your first day or protecting a year-long streak.',
  body: `
<h2>1. Choose a High-Coverage Opening Word</h2>
<p>Your first guess should test as many high-frequency letters as possible. CRANE tests C, R, A, N, E — five high-frequency letters with no repeated vowels. SLATE tests S, L, A, T, E. Both give maximum information from a single guess. Other strong openers: STARE, RAISE, TRACE, AROSE, CRATE.</p>
<h2>2. Use Guess 2 to Test New Letters</h2>
<p>Unless you have 3+ green tiles, introduce entirely new letters on guess 2. A strong pair is CRANE + STOIL — covering 10 distinct letters. An all-grey first guess is actually good news: you eliminated 5 letters and have full freedom on guess 2.</p>
<div class="tip"><div class="tl">Strategy</div><p>If guess 1 returns all grey, test the next 5 highest-frequency unused letters on guess 2. You have already eliminated a significant portion of the alphabet.</p></div>
<h2>3. Never Reuse a Yellow Letter in the Same Position</h2>
<p>A yellow tile means the letter is in the answer but not in that column. Always move yellow letters to a new position. Reusing one in the same column is the most common Wordle mistake and wastes an entire guess.</p>
<h2>4. Eliminate Vowels Systematically</h2>
<p>English 5-letter words average 1.8 vowels. If your opener covers A, E, I and all return grey, the answer uses O and/or U. Confirming remaining vowels on guess 2 dramatically narrows the candidate pool.</p>
<h2>5. Know the Positional Biases</h2>
<ul>
<li><strong>Position 1:</strong> S, C, B, T, P are most common starting letters</li>
<li><strong>Position 3:</strong> A, I, O are common middle vowels</li>
<li><strong>Position 5:</strong> E, Y, T, R are most common final letters — S is rare here (NYT avoids plurals)</li>
</ul>
<h2>6. Recognise Trap Patterns Early</h2>
<p>These patterns produce 5+ valid candidates and cause most late-game failures. When you identify one at guess 3, use guess 4 to test multiple variable consonants at once rather than guessing one candidate randomly.</p>
<ul>
<li><strong>_ATCH:</strong> BATCH, CATCH, HATCH, LATCH, MATCH, PATCH, WATCH — 7 candidates</li>
<li><strong>_IGHT:</strong> FIGHT, LIGHT, MIGHT, NIGHT, RIGHT, SIGHT, TIGHT — 7 candidates</li>
<li><strong>_OUND:</strong> BOUND, FOUND, HOUND, MOUND, POUND, ROUND, SOUND, WOUND — 8 candidates</li>
</ul>
<h2>7. Double Letters Appear in ~15% of Answers</h2>
<p>BOOZE, KNEEL, SHEER, DIZZY are all valid Wordle answers. If you have used all common single-instance letters and still cannot find the word, try words with doubled vowels or consonants. This is a reliable late-game unlock.</p>
<h2>8. Hard Mode: Use Elimination Guesses on Trap Patterns</h2>
<p>In Hard Mode, a _ATCH trap with 3 guesses left and 7 candidates gives only a 3-in-7 success rate if you guess one per turn. A single guess testing 5 variable consonants at once — B, C, H, M, P in position 1 — converts this into a near-certain solve.</p>
<h2>9. Build a Two-Word Opening Combo</h2>
<p>Using the same two openers every day covers 10 unique letters consistently: CRANE + STOIL covers C, R, A, N, E, S, T, O, I, L. AUDIO + STERN covers all 5 vowels plus S, T, R, N — excellent vowel-first coverage. Both strategies build pattern recognition faster than switching openers daily.</p>
<h2>10. Use a Word Finder for Pattern Matching</h2>
<p>When confirmed letters leave multiple candidates, enter your greens and yellows into a word finder. It instantly shows every valid 5-letter word matching your pattern, letting you choose the one that eliminates the most remaining candidates in your next guess.</p>`,
  faq: [
    { q: 'What is the best Wordle starting word?',
      a: 'CRANE, SLATE, and STARE consistently rank as top openers by letter frequency analysis. CRANE tests five high-frequency letters (C, R, A, N, E) with no repeated vowels. Your optimal starter depends on whether you prioritise vowel coverage, consonant coverage, or positional frequency.' },
    { q: 'How does Wordle Hard Mode work?',
      a: 'Hard Mode requires every subsequent guess to use all confirmed green and yellow letters. This eliminates sacrifice guesses and makes every play productive but constraining. Hard Mode players benefit most from learning trap patterns and using a word finder to check all remaining candidates before committing.' },
    { q: 'Do Wordle answers repeat?',
      a: 'Since the New York Times took over Wordle, each answer appears only once. The NYT curates the answer list, removing offensive words and overly obscure vocabulary.' },
    { q: 'Can I use a word unscrambler for Wordle?',
      a: 'Yes — especially useful in Hard Mode. Enter confirmed letters as fixed positions (greens) and required letters (yellows) to see every matching 5-letter candidate, then choose the one that tests the most unknowns.' }
  ],
  rel: [
    [D + '/guides/best-wordle-starting-words.html', 'Best Wordle Starting Words'],
    [D + '/guides/wordle-hard-mode-tips.html', 'Hard Mode Tips'],
    [D + '/word-lists/five-letter-words.html', 'All 5-Letter Words'],
    [D + '/word-lists/five-letter-words-starting-with-s.html', '5-Letter S-Words'],
    [D + '/guides/scrabble-strategy-guide.html', 'Scrabble Strategy']
  ]
},

// ── 2. Scrabble Bingo Words ──────────────────────────────────────────────────
{
  slug: 'scrabble-bingo-words.html',
  tag: 'Scrabble', crumb: 'Scrabble Bingo Words', mins: 6,
  h1: 'Scrabble Bingo Words: How to Play All 7 Tiles for the 50-Point Bonus',
  title: 'Scrabble Bingo Words 2026: Play All 7 Tiles for the 50-Point Bonus',
  desc: 'Complete guide to Scrabble bingos — the SATINE stem, high-frequency 7-letter words, rack management, and finding bingo lanes on any board.',
  lead: 'A Scrabble bingo is when you play all 7 tiles in one turn, earning a 50-point bonus on top of the base word score. A single bingo can swing a close match by 70 or more points.',
  body: `
<h2>What Is a Bingo in Scrabble?</h2>
<p>A bingo (called a "bonus word" in British Scrabble) occurs when you play all 7 tiles in one turn. The 50-point bonus is added to the word base score, making most bingos worth 57 to 80-plus points. Expert players average 1 to 2 per game. The key is not memorising every 7-letter word — it is learning the letter <em>stems</em> that produce them.</p>
<h2>The SATINE Stem: Your Bingo Foundation</h2>
<p>The letters S, A, T, I, N, E appear in more 7-letter words than any other 6-letter set. Keeping 3 to 4 of these on your rack maximises bingo probability. Adding different 7th letters to SATINE produces a large set of valid bingos:</p>
<ul>
<li>SATINE + R = NASTIER, RETAINS, STAINER</li>
<li>SATINE + L = SALTINE, ENTAILS, ELASTIN</li>
<li>SATINE + G = SEATING, TEASING, EATINGS</li>
<li>SATINE + D = INSTEAD, DESTAIN, DETAINS</li>
</ul>
<h2>High-Frequency Bingo Words to Study</h2>
<ul>
<li><strong>EASTERN</strong> — 7 pts base + 50 bingo bonus = 57 pts minimum</li>
<li><strong>STRANGE</strong> — 8 pts + 50 = 58 pts</li>
<li><strong>PAINTER</strong> — 9 pts + 50 = 59 pts</li>
<li><strong>TRADING</strong> — 9 pts + 50 = 59 pts</li>
<li><strong>CLAIMED</strong> — 12 pts + 50 = 62 pts</li>
<li><strong>NASTIER</strong> — 7 pts + 50 = 57 pts</li>
<li><strong>REALIGN</strong> — 8 pts + 50 = 58 pts</li>
<li><strong>LEADING</strong> — 8 pts + 50 = 58 pts</li>
</ul>
<div class="tip"><div class="tl">Memorisation Tip</div><p>Group bingos by stem rather than memorising individual words. Learning 10 stems (-ING endings, -ED endings, SATINE variants) covers hundreds of bingo words more efficiently than rote memorisation.</p></div>
<h2>Rack Management for Bingos</h2>
<ol>
<li><strong>Keep SATINE letters:</strong> Sacrifice short-term points to hold S, A, T, I, N, E, R, L when possible.</li>
<li><strong>Avoid duplicates:</strong> Two of the same vowel weakens your rack. Play or trade one immediately.</li>
<li><strong>Value the S tile:</strong> Never play S for fewer than 8 extra points above a non-S alternative.</li>
<li><strong>Hold blanks:</strong> Never play a blank for fewer than 25 to 30 extra points. Blanks complete bingos that would otherwise be impossible.</li>
<li><strong>Vowel balance:</strong> Keep 2 to 3 vowels and 4 to 5 consonants. Four or more vowels rarely produce bingos.</li>
</ol>
<h2>Common Bingo Patterns</h2>
<ul>
<li><strong>-ING bingos:</strong> LEADING, TRADING, READING, STORING, COASTING</li>
<li><strong>-ED bingos:</strong> CLAIMED, TRAINED, PAINTED, DETAILED, RESTORED</li>
<li><strong>-ER/-ERS bingos:</strong> PAINTER, EASTERN, MASTERS, POSTERS</li>
<li><strong>RE- prefix bingos:</strong> REALIGN, RESTORE, REPLACE, RETRAIN</li>
</ul>
<h2>Finding Bingo Lanes on the Board</h2>
<p>Spotting a bingo in your rack is only half the challenge — you also need an open lane. Look for open rows or columns with 7-plus empty squares and one existing tile to hook onto. Words ending in E, S, D, R, N are the best hook targets. A bingo can also pass through one or two tiles already on the board if all crossing letters form valid words.</p>`,
  faq: [
    { q: 'What is a bingo in Scrabble?',
      a: 'A bingo is playing all 7 tiles in one turn, earning a 50-point bonus on top of the word base score. Bingos typically score 57 to 80-plus points and are the most decisive single move in competitive Scrabble.' },
    { q: 'What rack letters are best for bingos?',
      a: 'The best bingo letters are S, A, T, I, N, E, R, and L — found in more 7-letter words than any other combination. The SATINE rack (S, A, T, I, N, E plus one tile) produces more bingos than any other 6-tile combination.' },
    { q: 'How common are bingos in Scrabble?',
      a: 'Expert players average 1 to 2 bingos per game. At club level, one per 3 to 4 games marks strong performance. Studying common stems and rack management dramatically increases bingo frequency within weeks.' },
    { q: 'Should I always play a bingo if I find one?',
      a: 'Not always. If your bingo opens a Triple Word Score lane for your opponent, the 50-point bonus may not outweigh that risk. Always check whether a bingo play creates a premium square opportunity your opponent can exploit.' }
  ],
  rel: [
    [D + '/guides/scrabble-strategy-guide.html', 'Scrabble Strategy'],
    [D + '/guides/two-letter-scrabble-words.html', '2-Letter Words'],
    [D + '/word-lists/seven-letter-words.html', 'All 7-Letter Words'],
    [D + '/word-lists/high-scoring-scrabble-words.html', 'Highest-Scoring Words'],
    [D + '/guides/scrabble-dictionary-guide.html', 'TWL vs SOWPODS']
  ]
},

// ── 3. Boggle Tips ───────────────────────────────────────────────────────────
{
  slug: 'boggle-tips.html',
  tag: 'Boggle', crumb: 'Boggle Tips', mins: 5,
  h1: 'Boggle Tips and Strategy: How to Find More Words Faster',
  title: 'Boggle Tips and Strategy 2026: Find More Words Faster',
  desc: 'Practical Boggle strategy for all levels — grid scanning, long-word hunting, prefix and suffix patterns, and post-game analysis to build vocabulary fast.',
  lead: 'Boggle is a race: find as many valid words as possible in a 4x4 grid in 3 minutes. Winners are not the best spellers — they are the players with the most efficient scanning strategies.',
  body: `
<h2>Scoring: Long Words Always Win</h2>
<p>Boggle scoring: 3-letter = 1 pt, 4-letter = 1 pt, 5-letter = 2 pts, 6-letter = 3 pts, 7-letter = 5 pts, 8-letter = 11 pts. One 8-letter word equals eleven 3-letter words. Long-word hunting is almost always more efficient than maximising short-word count — unless you have already found all obvious long words with time remaining.</p>
<div class="tip"><div class="tl">Key Insight</div><p>An expert who finds 3 long words (7 to 8 letters) plus 10 short words almost always beats a player who finds 25 short words and no long ones.</p></div>
<h2>Start From High-Value Tiles First</h2>
<p>Begin every game by scanning Q, X, Z, J tiles. These rare letters form fewer words, but those words are unique — your opponent is unlikely to find them. Locking in a JINX, QUIZ, or FIZZ in the first 30 seconds claims rare points before the grid becomes familiar to both players.</p>
<h2>Scan for Productive Endings</h2>
<p>Expert Boggle players scan for patterns rather than complete words. Identify these letter chains in the grid first, then find all the roots that feed into them:</p>
<ul>
<li><strong>-ING:</strong> Any I-N-G chain. Every verb root leading to it is a valid word.</li>
<li><strong>-ED:</strong> A terminal E-D chain converts most verb roots to past tense.</li>
<li><strong>-ER / -ERS:</strong> Find E-R chains and look for roots heading into them from any direction.</li>
<li><strong>RE- / UN- / IN-:</strong> Prefix chains that open many long words from a small grid area.</li>
</ul>
<h2>Work Through Centre Tiles</h2>
<p>Centre tiles connect to 8 adjacent tiles instead of the 3 to 5 that edge and corner tiles reach. A high-frequency letter (E, A, R, S, T) in the centre dramatically increases word count. Identify the most-connected centre tile in each game and build your longest chains through it.</p>
<h2>Find All Word Forms From Each Root</h2>
<p>Once you find a root word, immediately check its forms: plural (-S), past tense (-ED), present participle (-ING), comparative (-ER), superlative (-EST). A single root like RAIN yields RAINS, RAINED, RAINING, RAINER — four words from the same grid area. This multiplies your score from a single discovery.</p>
<h2>Use a Consistent Scanning Pattern</h2>
<p>Random scanning wastes time. Work in a spiral from one corner inward, then switch to column-by-column for the final 60 seconds. Consistency matters more than the specific pattern — muscle memory reduces cognitive load and frees you to focus on word recognition rather than grid navigation.</p>
<h2>Post-Game Analysis: Fastest Improvement Method</h2>
<p>After each game, enter all board tiles as a single letter set into a word finder and compare its full output to your word list. The words you missed are your vocabulary gaps. Reviewing them in context — from letters you actually held — builds recall far faster than studying word lists in isolation from actual play.</p>`,
  faq: [
    { q: 'What is the highest-scoring word possible in Boggle?',
      a: '8-letter words score 11 points each — the maximum per word. Words like TRAINERS, STRANGER, and PAINTERS appear in favourable grid configurations. With Q and U tiles, long Q-words score maximum points if the letter path exists in the grid.' },
    { q: 'What short words should every Boggle player know?',
      a: 'Essential short Boggle words include AA, AE, OE (2-letter), QUA, PHO, ETA, ZAG, JAB, AXE (3-letter). Two-letter words are valid in most Boggle variants using the Merriam-Webster word list. Learning rare short words fills point gaps your opponents miss.' },
    { q: 'How long is a Boggle round?',
      a: 'Standard Boggle gives 3 minutes per round. Most competitive and online variants also use 3 minutes. The timer rewards efficient scanning patterns — strategy matters as much as vocabulary for consistent high scores.' },
    { q: 'What word list does official Boggle use?',
      a: 'Official Boggle uses the Merriam-Webster OSPD in North America. Online variants often use SOWPODS. Always check your specific platform before memorising rare words.' }
  ],
  rel: [
    [D + '/guides/scrabble-strategy-guide.html', 'Scrabble Strategy'],
    [D + '/word-lists/three-letter-words.html', 'All 3-Letter Words'],
    [D + '/word-lists/four-letter-words.html', 'All 4-Letter Words'],
    [D + '/guides/two-letter-scrabble-words.html', '2-Letter Word List'],
    [D + '/', 'Word Unscrambler Tool']
  ]
},

// ── 4. Words With Friends Strategy ──────────────────────────────────────────
{
  slug: 'words-with-friends-strategy.html',
  tag: 'Words With Friends', crumb: 'Words With Friends Strategy', mins: 5,
  h1: 'Words With Friends Strategy Guide: Tips to Win Every Game',
  title: 'Words With Friends Strategy 2026: Tips to Win Every Game',
  desc: 'Complete Words With Friends strategy — board differences from Scrabble, WWF-only words, premium square control, and rack management for consistent wins.',
  lead: 'Words With Friends shares Scrabble mechanics but plays differently. The board layout, letter values, and valid word list all differ — Scrabble expertise does not automatically transfer to WWF wins.',
  body: `
<h2>Key Differences From Scrabble</h2>
<p>WWF uses a 15x15 board like Scrabble but premium squares are in different positions. Letter values also differ: Q scores 12 in WWF versus 10 in Scrabble. The valid word list includes informal contemporary words not in TWL. And unlike Scrabble, WWF is asynchronous — no clock, giving you time for careful analysis on every turn without time pressure.</p>
<h2>Opening Strategy in WWF</h2>
<p>In WWF the opening square does not reach a Triple Word Score position in one move, meaning opening plays score less than in Scrabble. Focus on tile efficiency and board control rather than raw points on turn 1. A good opening places a 5 to 6 letter word through the centre, reaching the nearest Double Word Score squares while keeping a flexible rack for turn 2.</p>
<div class="tip"><div class="tl">Opening Tip</div><p>In WWF, turns 2 to 4 often score more than the opener because the board has more connection points. Do not sacrifice rack quality chasing opening points.</p></div>
<h2>WWF-Only Words Worth Knowing</h2>
<p>These words are valid in WWF but not in standard North American Scrabble (TWL): EMOJI, TWERK, VIBE, COLLAB, LOTSA, RIDIC, WANNA, SHIV. WWF's dictionary is updated more frequently than official Scrabble word lists and includes many contemporary informal words. When in doubt, try the word — the game tells you immediately if it is invalid.</p>
<h2>Premium Square Control</h2>
<p>WWF Triple Word Score squares are more accessible on turns 3 to 6. Both players race to claim TW squares mid-game — controlling TW corner clusters is worth 10 to 30 extra points per game. If you cannot use a TW square on your turn, play a word that blocks your opponent's easiest path to it. Setting up a word adjacent to a TW square is also strong — then connecting to it on your next turn for a high-scoring play.</p>
<h2>Rack Management</h2>
<ol>
<li><strong>Leave value:</strong> A leave of AEINST is far stronger than AEIOU. Always evaluate what tiles you keep after each play.</li>
<li><strong>Vowel balance:</strong> Do not keep more than 2 to 3 vowels after any turn.</li>
<li><strong>Bingo planning:</strong> WWF uses the same 50-point bingo bonus. Keep SATINE-adjacent racks and plan 2 to 3 turns ahead.</li>
<li><strong>Q management:</strong> Q scores 12 in WWF. Never hold Q without a U or a Q-without-U play available.</li>
</ol>
<h2>Using a Word Finder in WWF</h2>
<p>WWF allows word finder tools — there is no official rule against them. The best use is finding the highest-scoring word that also reaches a premium square. Enter your tiles, sort by score, then check board positioning before committing. This takes under 30 seconds and is standard practice among competitive WWF players worldwide.</p>`,
  faq: [
    { q: 'What are the biggest differences between Scrabble and Words With Friends?',
      a: 'Main differences: (1) board layout — premium squares in different positions; (2) letter values — Q=12 in WWF vs 10 in Scrabble; (3) valid words — WWF includes informal words like EMOJI and TWERK not in TWL; (4) no clock — WWF is asynchronous, allowing careful analysis.' },
    { q: 'Are there words valid in WWF but not Scrabble?',
      a: 'Yes — WWF includes informal contemporary words like EMOJI, TWERK, VIBE, COLLAB, and RIDIC not in the TWL Scrabble word list. WWF dictionary is updated more frequently than official Scrabble word lists.' },
    { q: 'Is using a word finder cheating in Words With Friends?',
      a: 'No — WWF has no official rule against word finder tools. The game is designed for casual asynchronous play where strategy tools are part of the experience. Using a word finder is standard among competitive WWF players.' },
    { q: 'What are the highest-scoring words in Words With Friends?',
      a: 'Words combining Q (12pts), Z (10pts), J (10pts), and X (8pts) on Triple Letter or Triple Word Score squares score highest. Bingo plays through Triple Word squares scoring 100-plus points are the most achievable high scores in real games.' }
  ],
  rel: [
    [D + '/guides/scrabble-strategy-guide.html', 'Scrabble Strategy'],
    [D + '/guides/two-letter-scrabble-words.html', '2-Letter Words'],
    [D + '/word-lists/high-scoring-scrabble-words.html', 'Highest-Scoring Words'],
    [D + '/word-lists/q-without-u-words.html', 'Q Without U Words'],
    [D + '/', 'Free Word Finder']
  ]
},

// ── 5. Common Word Endings ───────────────────────────────────────────────────
{
  slug: 'common-word-endings.html',
  tag: 'Word Lists', crumb: 'Common Word Endings', mins: 5,
  h1: 'Common Word Endings: 15 English Suffixes for Scrabble and Word Games',
  title: 'Common Word Endings: 15 English Suffixes That Create Scrabble Plays',
  desc: 'How -TION, -ING, -ED, -ER, -MENT, -NESS, and 9 more English suffixes work in Scrabble and word games — with strategy tips, bingo patterns, and board tactics.',
  lead: 'Just 15 English suffixes account for the majority of all word game plays. Mastering these endings lets you convert any Scrabble root word into 3 to 5 additional plays without memorising new vocabulary.',
  body: `
<h2>Why Suffixes Matter in Scrabble</h2>
<p>In Scrabble, knowing a word ending is as valuable as knowing a complete word. A suffix that attaches to existing board words gives you a play in almost any position. An S tile converts any noun on the board into a plural — creating a second word while scoring points for the full extended word. This parallel-play tactic is one of the most efficient moves in competitive Scrabble.</p>
<h2>The 5 Highest-Value Scrabble Endings</h2>
<h3>-S (plural and verb form)</h3>
<p>The most powerful Scrabble suffix. S converts almost any noun to plural and most verbs to third-person singular. Save S tiles for bingos or high-value hooks — never play S for fewer than 8 extra points above a non-S alternative.</p>
<h3>-ED (past tense)</h3>
<p>Converts almost any regular verb to past tense and creates common bingo words: CLAIMED, TRAINED, PAINTED, DETAILED, RESTORED. An E-D pair at the end of an open board lane is a strong hook target in any position.</p>
<h3>-ING (present participle)</h3>
<p>The second most common bingo-producing ending. Every verb root plus an I-N-G chain is a potential long word. Common bingo words: LEADING, TRADING, READING, STORING, COASTING. In Boggle, expert players scan for -ING chains as their first priority.</p>
<h3>-ER (comparative and agent noun)</h3>
<p>Forms comparatives (FASTER, SMARTER) and agent nouns (RUNNER, PLAYER, TEACHER). An E-R pair on the board can be hooked by almost any verb or adjective root, making it one of the most versatile Scrabble extensions.</p>
<h3>-EST (superlative)</h3>
<p>Forms superlatives (FASTEST, SMARTEST) and standalone words (FEST, NEST, VEST). An E-S-T chain is a hook target for any comparative base word on the board.</p>
<h2>High-Frequency Bingo Endings: -TION, -MENT, -NESS</h2>
<p><strong>-TION/-ATION</strong> produces 7 to 8 letter bingo words: CAUTION, OVATION, ORATION, STATION, BASTION. The T-I-O-N chain uses common low-value tiles, making these bingos achievable from typical rack draws.</p>
<p><strong>-MENT</strong> produces PAYMENT, GARMENT, COMMENT, ELEMENT, TORMENT. M-E-N-T scores 6 base points for the ending alone, and 7-letter -MENT bingos appear regularly in competitive play.</p>
<p><strong>-NESS</strong> converts adjectives to nouns: SADNESS, FITNESS, MADNESS, WITNESS. Useful for playing through an existing N or S on the board.</p>
<h2>More Productive Endings</h2>
<ul>
<li><strong>-FUL:</strong> HELPFUL, CAREFUL, THANKFUL, WONDERFUL</li>
<li><strong>-LESS:</strong> HOPELESS, USELESS, CARELESS, POWERLESS</li>
<li><strong>-LY:</strong> QUICKLY, SLOWLY, EXACTLY — converts adjectives to adverbs</li>
<li><strong>-ABLE/-IBLE:</strong> POSSIBLE, CAPABLE, SUITABLE, READABLE</li>
<li><strong>-AL:</strong> MUSICAL, LOGICAL, NATIONAL, CENTRAL</li>
<li><strong>-OUS:</strong> FAMOUS, NERVOUS, SERIOUS, GENEROUS</li>
</ul>
<div class="tip"><div class="tl">Power Move</div><p>Adding -S to an existing board word while placing your tiles perpendicular to it creates two words simultaneously. You score both words for the cost of one play — one of the highest-efficiency moves in Scrabble.</p></div>`,
  faq: [
    { q: 'What is the most common word ending in English?',
      a: '-S is technically most common, but -ING, -ED, -ER, and -TION are most productive for generating new words. In Scrabble, -S is most tactically valuable because it converts existing board words into new scoring positions from a single tile.' },
    { q: 'What endings produce the most Scrabble bingos?',
      a: '-ING and -ED endings produce the most 7-letter bingo words. Common patterns: LEADING, TRADING (both -ING) and CLAIMED, TRAINED (both -ED). Knowing these endings and their common roots covers a large percentage of real bingo opportunities.' },
    { q: 'What are the most common English suffixes?',
      a: 'The 10 most common: -S/-ES, -ING, -ED, -ER/-OR, -LY, -TION/-SION, -MENT, -NESS, -ABLE/-IBLE, and -FUL. Together these account for the majority of all derived words in English.' },
    { q: 'How do word endings help with vocabulary?',
      a: 'Learning one suffix lets you understand hundreds of words without memorising each individually. Knowing -NESS converts adjectives to nouns means you correctly use any new adjective plus -NESS combination, even words you encounter for the first time.' }
  ],
  rel: [
    [D + '/guides/scrabble-strategy-guide.html', 'Scrabble Strategy'],
    [D + '/guides/scrabble-bingo-words.html', 'Scrabble Bingo Words'],
    [D + '/guides/two-letter-scrabble-words.html', '2-Letter Words'],
    [D + '/word-lists/seven-letter-words.html', 'All 7-Letter Words'],
    [D + '/word-lists/high-scoring-scrabble-words.html', 'Highest-Scoring Words']
  ]
},

// ── 6. Wordle Hard Mode Tips ─────────────────────────────────────────────────
{
  slug: 'wordle-hard-mode-tips.html',
  tag: 'Wordle', crumb: 'Wordle Hard Mode Tips', mins: 5,
  h1: 'Wordle Hard Mode Tips: How to Win Without Wasting Guesses',
  title: 'Wordle Hard Mode Tips 2026: Win Without Wasting Guesses',
  desc: 'Complete Wordle Hard Mode strategy — confirmed letter rules, trap patterns (_ATCH, _IGHT, _OUND), the 3-guesses-left decision framework, and protecting your streak.',
  lead: 'Wordle Hard Mode requires every guess to use all revealed green and yellow letters. This eliminates sacrifice guesses and makes trap patterns far more dangerous — mastering it makes you a significantly better Wordle player.',
  body: `
<h2>What Hard Mode Changes</h2>
<p>Every confirmed green letter must appear in the same position in all future guesses. Every yellow letter must be included somewhere in all future guesses. You can never play a word that ignores confirmed tiles. This means no sacrifice guesses, and trap patterns where multiple words share the same ending become potentially game-ending if not handled early in the solve.</p>
<h2>Opening Strategy for Hard Mode</h2>
<p>Your first guess is completely unconstrained — use it to get maximum information. CRANE, SLATE, STARE, and RAISE are all strong choices. Once you have any greens or yellows, your flexibility locks immediately, so the opener matters more in Hard Mode than in Normal Mode. An all-grey first guess is excellent news: you eliminated 5 letters and have full freedom on guess 2.</p>
<div class="tip"><div class="tl">Hard Mode Tip</div><p>In Normal Mode, an all-grey guess is discouraging. In Hard Mode, it is a genuine advantage — full freedom on guess 2 with 5 letters already eliminated from consideration.</p></div>
<h2>Using Yellow Letters Strategically</h2>
<p>Yellow letters must appear in every future guess but you choose the position. Use this freedom to test new columns and gather information simultaneously. Yellow E in position 3 on guess 1 — put E in position 1 on guess 2. If it returns grey, E is not in positions 1 or 3. With two yellow letters, find a word that places both in new positions while testing new consonants in the remaining slots.</p>
<h2>The Major Trap Patterns</h2>
<p>These patterns produce many valid candidates and cause most Hard Mode failures:</p>
<ul>
<li><strong>_ATCH:</strong> BATCH, CATCH, HATCH, LATCH, MATCH, PATCH, WATCH — 7 candidates</li>
<li><strong>_IGHT:</strong> FIGHT, LIGHT, MIGHT, NIGHT, RIGHT, SIGHT, TIGHT — 7 candidates</li>
<li><strong>_OUND:</strong> BOUND, FOUND, HOUND, MOUND, POUND, ROUND, SOUND, WOUND — 8 candidates</li>
</ul>
<p>When you identify a trap at guess 3, use guess 4 to test as many variable consonants simultaneously as possible. In a _ATCH trap, a guess testing B, C, M, H, P in position 1 eliminates five candidates at once rather than one per turn.</p>
<h2>The 3-Guesses-Left Decision Framework</h2>
<ol>
<li><strong>Elimination guess:</strong> Eliminates the most remaining candidates. Best when 4-plus candidates remain with 3-plus guesses left.</li>
<li><strong>Direct guess:</strong> Guess a specific candidate. Best when 2 to 3 candidates remain with 2 guesses left.</li>
<li><strong>The 50/50 rule:</strong> With 2 guesses and 2 candidates remaining, guess the more common word first. If it fails, you still have one guess for the other candidate.</li>
</ol>
<h2>Protecting Your Streak</h2>
<p>In a _IGHT trap with 3 guesses left and 7 candidates, guessing one per turn gives only a 3-in-7 success chance. A well-placed elimination guess first — even if it does not directly advance toward the answer — raises that to a near-certain solve. This is the difference between a broken streak and a comfortable win.</p>`,
  faq: [
    { q: 'What is Wordle Hard Mode?',
      a: 'Hard Mode requires every guess to use all confirmed green letters in exact positions and all yellow letters somewhere in the word. This eliminates sacrifice guesses and forces all plays to make measurable progress toward the answer.' },
    { q: 'What are the hardest patterns in Hard Mode?',
      a: 'The most dangerous: _ATCH (7 candidates), _IGHT (7 candidates), and _OUND (8 candidates). These trap patterns regularly cause Hard Mode failures because players are forced to guess candidates one at a time rather than using an elimination guess.' },
    { q: 'Should I play Wordle in Hard Mode?',
      a: 'Hard Mode forces deeper strategic thinking and makes you a significantly better player. With proper strategy for trap patterns, Hard Mode win rates can still exceed 95% consistently.' },
    { q: 'What is the best Hard Mode opening word?',
      a: 'CRANE, SLATE, STARE, and RAISE all work well. Your opener matters even more in Hard Mode because it is your only completely unconstrained play — use it to maximise information about vowels and common consonants.' }
  ],
  rel: [
    [D + '/guides/wordle-tips-and-tricks.html', 'Wordle Tips and Tricks'],
    [D + '/guides/best-wordle-starting-words.html', 'Best Wordle Starting Words'],
    [D + '/word-lists/five-letter-words.html', 'All 5-Letter Words'],
    [D + '/word-lists/five-letter-words-starting-with-s.html', '5-Letter S-Words'],
    [D + '/', 'Word Finder Tool']
  ]
},

// ── 7. Q Words for Scrabble ──────────────────────────────────────────────────
{
  slug: 'q-words-scrabble.html',
  tag: 'Scrabble', crumb: 'Q Words for Scrabble', mins: 5,
  h1: 'Q Words for Scrabble: Complete Guide Including Q-Without-U Plays',
  title: 'Q Words for Scrabble 2026: Complete List Including Q Without U',
  desc: 'All Q-words for Scrabble — standard QU- words, Q-without-U plays, two-letter Q words, and strategy for maximising the 10-point Q tile on premium squares.',
  lead: 'Q is tied with Z as the highest-scoring Scrabble tile at 10 points. Knowing every valid Q-word — including rare Q-without-U plays — ensures you never hold an unplayable Q tile again.',
  body: `
<h2>Q in Scrabble: The High-Stakes Tile</h2>
<p>Q is worth 10 points — tied with Z as the highest tile value. There is only one Q in a Scrabble bag. Nearly all common Q-words require U immediately after it. When U tiles are scarce or already played, Q becomes a liability rather than an asset. The solution is twofold: know all Q-without-U words, and maximise Q value on premium squares whenever U is available.</p>
<h2>Essential Short QU- Words</h2>
<ul>
<li><strong>QUIZ (4 letters, 22 pts):</strong> One of the highest-scoring 4-letter Scrabble words. On Triple Word Score: 66 pts.</li>
<li><strong>QUAY (4 letters, 16 pts):</strong> Valid in TWL and SOWPODS. Good for tight positions.</li>
<li><strong>QUAD (4 letters, 14 pts):</strong> Common word, easy to place in most board positions.</li>
<li><strong>QUAFF (5 letters, 21 pts):</strong> Two F tiles — very high scoring on premium squares.</li>
<li><strong>QUA (3 letters, 12 pts):</strong> Valid in SOWPODS. Useful for parallel plays.</li>
<li><strong>QUEEN, QUEST, QUITE, QUOTA, QUOTE:</strong> Common 5-letter Q-words for standard plays.</li>
</ul>
<h2>Q Without U: Essential Emergency Plays</h2>
<p>When you have Q but no U available, these words save the day. TRANQ (5 letters, 14 pts) and QOPH (4 letters, 18 pts) are the most reliable Q-without-U plays across multiple rulesets. QANAT (5 letters, 14 pts), SHEQEL, and QINTAR are valid in SOWPODS.</p>
<p>QI is valid in Collins SOWPODS (UK, Australia, New Zealand, international) but is NOT currently in TWL (North American Scrabble). Always confirm which dictionary your game uses before playing QI. See the full <a href="https://unscramblewordspro.com/word-lists/q-without-u-words.html">Q-Without-U Words list</a>.</p>
<h2>Maximising Q on Premium Squares</h2>
<ul>
<li><strong>Triple Letter Score:</strong> Q alone scores 30 points — more than most complete words.</li>
<li><strong>Double Word Score:</strong> QUIZ on DWS = 44 points.</li>
<li><strong>Triple Word Score:</strong> QUIZ on TWS = 66 points — one of the highest 4-letter plays possible.</li>
</ul>
<div class="tip"><div class="tl">Strategy</div><p>Never play Q on a regular square if any premium square is reachable. Even a short 3-letter Q-word on a Triple Letter Score (Q alone = 30 pts) outscores most regular plays in the entire game.</p></div>
<h2>Q-Words in Wordle</h2>
<p>Q appears in fewer than 2% of Wordle answers. The most common Q-starting 5-letter Wordle answers are QUEEN, QUERY, and QUIET — all requiring U in position 2. A confirmed Q in position 1 immediately points to QU- words as the only viable candidates. See our complete list of <a href="https://unscramblewordspro.com/word-lists/five-letter-words-starting-with-q.html">5-letter words starting with Q</a>.</p>`,
  faq: [
    { q: 'What are Q-without-U words in Scrabble?',
      a: 'Q-without-U words contain Q not followed by U. Examples: TRANQ (5 letters, 14 pts), QOPH (4 letters, 18 pts), QANAT (5 letters, 14 pts). These are essential when U tiles are unavailable.' },
    { q: 'Is QI valid in Scrabble?',
      a: 'QI is valid in Collins SOWPODS (UK, Australia, New Zealand, international) but is NOT currently in TWL (North American Scrabble). Always confirm which dictionary your game uses before playing QI.' },
    { q: 'What is the highest-scoring Q-word in Scrabble?',
      a: 'QUIZ scores 22 base points. On a Triple Word Score square, QUIZ scores 66 points. Longer words like QUIZZED (30-plus base points) score extremely high on premium squares.' },
    { q: 'How many Q tiles are in a Scrabble set?',
      a: 'Exactly one Q tile in a standard Scrabble set. It scores 10 points — the highest tile value alongside Z.' }
  ],
  rel: [
    [D + '/word-lists/q-without-u-words.html', 'Q Without U Words'],
    [D + '/guides/scrabble-strategy-guide.html', 'Scrabble Strategy'],
    [D + '/word-lists/high-scoring-scrabble-words.html', 'Highest-Scoring Words'],
    [D + '/word-lists/z-words-scrabble.html', 'Z Words Scrabble'],
    [D + '/guides/two-letter-scrabble-words.html', '2-Letter Words']
  ]
},

// ── 8. How to Improve at Word Games ─────────────────────────────────────────
{
  slug: 'how-to-improve-word-game-skills.html',
  tag: 'Learning', crumb: 'Improve Word Game Skills', mins: 5,
  h1: 'How to Improve at Word Games: Practice Methods That Actually Work',
  title: 'How to Improve at Word Games 2026: Practice Methods That Actually Work',
  desc: 'Evidence-based methods to improve at Scrabble, Wordle, and word games — post-game analysis, stem study, vocabulary building, and word finder practice routines.',
  lead: 'Most word game players improve by playing more games. The players who improve fastest study strategically between games. This guide covers the methods that produce measurable skill gains in the shortest time.',
  body: `
<h2>The Fastest Path: Post-Game Analysis</h2>
<p>The single most effective practice method is post-game analysis. After each game, review every turn: what was the best play I could have made here? For Scrabble, enter your rack tiles into a word finder after each turn and compare the highest-scoring play available to what you actually played. Players who do this consistently improve their average score within weeks — not months.</p>
<div class="tip"><div class="tl">Key Method</div><p>Post-game analysis beats playing more games 3 to 1 for skill improvement. Thirty minutes of analysis is worth 90 minutes of unreviewed play.</p></div>
<h2>Scrabble: Learn Two-Letter Words First</h2>
<p>The highest-ROI vocabulary investment for any Scrabble player is memorising all valid two-letter words. There are 107 in TWL and 125 in SOWPODS. These words enable parallel plays that score in two directions from a single move. Start with the highest-value two-letter words: QI, ZA, JO, XI (SOWPODS), OX, AX, EX, AA, AE, OE, KI, KA. These appear most often in positions where knowing them converts a pass into a high-scoring play.</p>
<h2>Scrabble: Study Bingo Stems, Not Individual Words</h2>
<p>Rather than memorising individual 7-letter bingo words, study stems — 6-letter groups that produce 7-letter words when one tile is added. The SATINE stem (S, A, T, I, N, E) produces bingos with most 7th letters added to it. Other productive stems: SATIRE, TISANE, RETINA, STOLEN. Knowing 10 stems covers hundreds of bingo words more efficiently than rote memorisation of individual words.</p>
<h2>Wordle: Analyse Guess Efficiency Over Time</h2>
<p>Track your average guesses over 30 puzzles. Above 4.0 average means your opener or second-guess strategy needs work. Average 3.5 to 4.0 means trap patterns (_ATCH, _IGHT) are costing you. Study each failure: identify which guess introduced unnecessary constraints and which guess could have eliminated the most candidates. This specific failure analysis produces faster improvement than general practice.</p>
<h2>Word Finder as a Learning Tool</h2>
<ol>
<li><strong>Post-game review:</strong> Enter your tiles and see every word you missed. Context-based learning builds recall far faster than isolated word lists.</li>
<li><strong>Length-filter practice:</strong> Enter a letter set, find all 5-letter words yourself before revealing the answer, then check against the full output.</li>
<li><strong>Score-sorting:</strong> Sort results by Scrabble score and memorise the top 5 words for each common letter combination — these are the plays you most often miss in real games.</li>
</ol>
<h2>Build a 5-Minute Daily Habit</h2>
<p>Five minutes of focused daily study consistently outperforms a two-hour session once a week. A suggested routine: review 5 new two-letter words (2 minutes), enter yesterday's Wordle answer into the word finder and check related words you know (1 minute), enter the rack AEINRST into the word finder and scan for unfamiliar bingo words in the output (2 minutes). This habit compounding over 90 days produces more measurable improvement than any other single practice method available to casual players.</p>
<h2>Play Against Stronger Opponents</h2>
<p>Skill growth requires challenge. Playing opponents slightly better than you forces you to apply knowledge under pressure and exposes strategy gaps that solo practice cannot reveal. Online Scrabble platforms, Wordle communities, and Words With Friends all offer ranked matchmaking against appropriately skilled opponents.</p>`,
  faq: [
    { q: 'How long does it take to improve at Scrabble?',
      a: 'With focused post-game analysis and deliberate practice (two-letter words, bingo stems, premium square tactics), most players see measurable score improvement within 4 to 6 weeks. Reaching competitive club-level play typically takes 6 to 12 months of consistent study.' },
    { q: 'What is the best way to learn new Scrabble words?',
      a: 'Post-game analysis using a word finder is the most effective method — reviewing each turn to see the plays you missed. This builds vocabulary in real game context, which is far more memorable than studying word lists in isolation. Start with two-letter words, then common bingo stems.' },
    { q: 'How do I improve my Wordle average?',
      a: 'Track your average guesses per puzzle over 30 days. Above 4.0 means your opener or second-guess strategy needs work. Scores of 3.5 to 4.0 usually mean trap patterns are costing you. Study each failure by reviewing the optimal guess path afterward.' },
    { q: 'Should I use a word finder to learn or to win?',
      a: 'Both — but the learning use is more valuable long-term. Use it post-game to find words you missed, use length filters to test yourself, and sort by score to identify your highest-value gaps. Over time this builds a vocabulary that makes the in-game use progressively less necessary.' }
  ],
  rel: [
    [D + '/guides/scrabble-strategy-guide.html', 'Scrabble Strategy'],
    [D + '/guides/scrabble-bingo-words.html', 'Scrabble Bingo Words'],
    [D + '/guides/wordle-tips-and-tricks.html', 'Wordle Tips and Tricks'],
    [D + '/guides/two-letter-scrabble-words.html', '2-Letter Words'],
    [D + '/', 'Word Finder Tool']
  ]
}

];
