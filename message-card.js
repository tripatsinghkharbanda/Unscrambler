/* message-card.js — shared motivational card for Unscrambler & Wordle */
(function () {

  /* ---- CSS ---- */
  var s = document.createElement('style');
  s.textContent =
    '#wup-mc{position:fixed;bottom:-220px;left:50%;transform:translateX(-50%);'
    + 'background:#1e293b;border:1px solid rgba(245,158,11,.38);border-radius:18px;'
    + 'padding:18px 28px 16px;min-width:280px;max-width:360px;width:calc(100vw - 48px);'
    + 'text-align:center;z-index:10001;box-shadow:0 10px 48px rgba(0,0,0,.55);'
    + 'transition:bottom .44s cubic-bezier(.34,1.56,.64,1);pointer-events:auto}'
    + '#wup-mc.mc-on{bottom:28px}'
    + '#wup-mc .mc-x{position:absolute;top:9px;right:12px;background:none;border:none;'
    + 'color:#475569;font-size:20px;cursor:pointer;padding:2px 6px;line-height:1;'
    + 'border-radius:6px;transition:color .15s}'
    + '#wup-mc .mc-x:hover{color:#94a3b8}'
    + '#wup-mc .mc-em{font-size:34px;display:block;margin-bottom:7px;line-height:1}'
    + '#wup-mc .mc-title{font-size:16px;font-weight:800;color:#f59e0b;margin-bottom:6px;'
    + 'font-family:Inter,-apple-system,sans-serif;letter-spacing:-.01em}'
    + '#wup-mc .mc-body{font-size:13px;color:#94a3b8;line-height:1.6;'
    + 'font-family:Inter,-apple-system,sans-serif}'
    + '#wup-mc .mc-badge{display:inline-flex;align-items:center;gap:5px;'
    + 'background:rgba(245,158,11,.14);border:1px solid rgba(245,158,11,.22);'
    + 'border-radius:14px;padding:4px 12px;font-size:12px;font-weight:700;'
    + 'color:#f59e0b;margin-top:11px;font-family:Inter,-apple-system,sans-serif}'
    + '[data-theme="light"] #wup-mc{background:#fff;border-color:rgba(245,158,11,.3);'
    + 'box-shadow:0 8px 40px rgba(0,0,0,.12)}'
    + '[data-theme="light"] #wup-mc .mc-body{color:#475569}'
    + '@media(max-width:400px){#wup-mc{min-width:0;width:calc(100vw - 32px);padding:16px 20px 14px}}';
  document.head.appendChild(s);

  /* ---- DOM ---- */
  var card = document.createElement('div');
  card.id = 'wup-mc';
  card.setAttribute('role', 'status');
  card.setAttribute('aria-live', 'polite');
  card.innerHTML =
    '<button class="mc-x" id="mcClose" aria-label="Dismiss">\xd7</button>'
    + '<span class="mc-em" id="mcEm"></span>'
    + '<div class="mc-title" id="mcTitle"></div>'
    + '<div class="mc-body" id="mcBody"></div>'
    + '<div class="mc-badge" id="mcBadge"></div>';
  document.body.appendChild(card);
  document.getElementById('mcClose').onclick = function () { card.classList.remove('mc-on'); };

  /* ---- Message bank — organised by streak tier ---- */
  /* Each entry: [emoji, title, body]  {n} → streak count  */
  var TIERS = [
    /* 0  — first ever (streak=0) */
    [['🎉','Excellent unscramble!','Come back every day to build your streak and unlock tougher challenges!'],
     ['✨','Words unlocked!','Great first search! Daily practice is the single fastest way to grow your word power.']],
    /* 1  — streak 1 */
    [['🌱','Day 1 is done!','Come back tomorrow and you\'ll have a streak going — it gets addictive fast!'],
     ['🎯','Streak started!','One day down. Returning tomorrow is all it takes to start something great.']],
    /* 2  — streak 2–4 */
    [['📈','Building momentum!','Day {n} in a row. Players who practice daily improve vocabulary 3× faster.'],
     ['🌿','Habit forming!','Day {n} — consistency is the secret weapon of every great word game player.']],
    /* 3  — streak 5–9 */
    [['🔥','You\'re on fire!','{n}-day streak! Your pattern recognition is sharper today than it was yesterday.'],
     ['⚡','Electric run!','{n} straight days — you\'re already ahead of 80% of word game players.']],
    /* 4  — streak 10–19 */
    [['🏆','Double digits!','{n} days of dedication — that kind of consistency is genuinely rare and powerful.'],
     ['💪','Unstoppable!','Day {n}! A fortnight of daily play puts you firmly in the top 10% of dedicated solvers.']],
    /* 5  — streak 20–29 */
    [['🌟','Word game elite!','Day {n} — only 1 in 10 players ever reach a 20-day streak. You\'re one of them!'],
     ['🎖️','Extraordinary!','{n} days strong. Your vocabulary, speed, and recall have grown enormously since Day 1.']],
    /* 6  — streak 30+ */
    [['👑','Legend status!','A {n}-day streak puts you in the top 1% worldwide. Keep going — you\'re inspiring!'],
     ['🚀','Hall of fame!','{n} days! Most players quit in week one. You\'ve built something truly extraordinary.']]
  ];

  function getTierIdx(n) {
    if (n <= 0)  return 0;
    if (n === 1) return 1;
    if (n <= 4)  return 2;
    if (n <= 9)  return 3;
    if (n <= 19) return 4;
    if (n <= 29) return 5;
    return 6;
  }

  function pickMsg(n) {
    var tier = TIERS[getTierIdx(n)];
    var pick = tier[Math.floor(Math.random() * tier.length)];
    return { e: pick[0], t: pick[1], b: pick[2].replace(/\{n\}/g, n) };
  }

  var _timer = null;

  /* ---- Public API ---- */
  window.showMotivationCard = function (streak) {
    var n   = parseInt(streak, 10) || 0;
    var msg = pickMsg(n);

    document.getElementById('mcEm').textContent    = msg.e;
    document.getElementById('mcTitle').textContent = msg.t;
    document.getElementById('mcBody').textContent  = msg.b;

    var badge = document.getElementById('mcBadge');
    if (n > 0) {
      badge.textContent  = '🔥 ' + n + '-day streak';
      badge.style.display = '';
    } else {
      badge.style.display = 'none';
    }

    clearTimeout(_timer);
    card.classList.remove('mc-on');
    void card.offsetWidth;            /* force reflow for re-trigger */
    card.classList.add('mc-on');
    _timer = setTimeout(function () { card.classList.remove('mc-on'); }, 4800);
  };

})();
