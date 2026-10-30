/* Views, part 1: shared helpers, Home, Practice, Problem, Review. */
const PROBS = window.AMC_PROBLEMS;
const BY_ID = Object.fromEntries(PROBS.map(p => [p.id, p]));
const CAT_KEYS = Object.keys(CONFIG.cats);
const Views = {};

/* ---------- small shared pieces ---------- */
const bar = (pct, cat) => `<div class="bar ${cat ? 'b-' + cat : ''}" role="img" aria-label="${pct} percent"><i style="--w:${pct}%"></i></div>`;
const chip = (act, k, v, label, on, extra = '') => `<button type="button" class="chip" data-act="${act}" data-k="${k}" data-v="${v}" ${extra} aria-pressed="${on}">${label}</button>`;
const fmtNum = x => (Number.isInteger(x) ? String(x) : x.toFixed(1));

function dailyProblem(lv) {
  const all = PROBS.filter(p => p.lv === lv), mid = all.filter(p => p.d >= 2 && p.d <= 4), list = mid.length ? mid : all;
  return list[U.hash(U.dayKey() + ':' + lv) % list.length];
}
function nextContest(lv) {
  const t = Store.profile.target;
  if (t) { const d = U.daysUntil(t); if (d >= 0) return { name: 'your target date', date: t, days: d }; }
  return CONFIG.contests.filter(c => c.levels.includes(lv)).map(c => ({ ...c, days: U.daysUntil(c.date) }))
    .filter(c => c.days >= 0).sort((a, b) => a.days - b.days)[0] || null;
}
function recordFor(p, ok, mode, secs) { Store.record({ ...p, ok, mode, secs }); }

function sideHTML() {
  const st = Store.streak(), today = Store.todayCount(), goal = Store.profile.dailyGoal, lv = Store.profile.level, nc = nextContest(lv);
  const frac = goal ? Math.min(1, today / goal) : 0, C = 2 * Math.PI * 34;
  const cd = !nc ? `<div><b>No contest date set</b><div class="muted">Add your own in <a href="#/settings">Settings</a>.</div></div>`
    : nc.days === 0 ? `<div><b>Contest day</b><div class="muted">${U.esc(nc.name)} is today. Good luck.</div></div>`
    : `<div class="cd"><span class="bignum">${nc.days}</span><div><b>${nc.days === 1 ? 'day' : 'days'} to go</b><div class="muted">${U.esc(nc.name)}, ${U.niceDate(nc.date)}</div></div></div>`;
  return `
    <div class="panel tile">
      <div class="ringwrap"><svg viewBox="0 0 80 80" class="ring" aria-hidden="true"><circle cx="40" cy="40" r="34" class="ring-bg"/><circle cx="40" cy="40" r="34" class="ring-fg" style="--c:${C.toFixed(1)};--off:${(C * (1 - frac)).toFixed(1)}"/></svg><span class="ringnum">${today}</span></div>
      <div><b>${goal && today >= goal ? 'Daily goal reached' : 'Today’s goal'}</b><div class="muted">${today} of ${goal} problems answered</div></div>
    </div>
    <div class="panel tile"><span class="bignum">${st.cur}</span><div><b>${st.cur === 1 ? 'day' : 'days'} in a row</b><div class="muted">Best streak: ${st.best}</div></div></div>
    <div class="panel tile">${cd}</div>`;
}

/* ---------- Home ---------- */
Views.home = () => {
  const lv = Store.profile.level, daily = dailyProblem(lv);
  const missedN = PROBS.filter(p => Store.status(p.id) === 'missed').length;
  const dateStr = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
  const topics = CAT_KEYS.map(cat => {
    const list = PROBS.filter(p => p.lv === lv && p.cat === cat), solved = list.filter(p => Store.status(p.id) === 'solved').length;
    return `<a class="topic" href="#/practice" data-act="topic" data-cat="${cat}">
      <span class="topic-h"><i class="cdot c-${cat}"></i><b>${CONFIG.cats[cat].name}</b></span>
      <span class="muted">${CONFIG.cats[cat].blurb}</span>${bar(U.pct(solved, list.length), cat)}
      <span class="small">${solved} of ${list.length} solved at AMC ${lv}</span></a>`;
  }).join('');
  const html = `
    <div class="hero">
      <section class="panel strong daily" aria-labelledby="dtitle">
        <div class="daily-head">
          <div><h1 id="dtitle">Problem of the day</h1><p class="muted">${dateStr}. One new AMC ${lv} problem every day.</p></div>
          <div class="chips" role="group" aria-label="Contest level">${[8, 10, 12].map(l => chip('level', 'lv', l, 'AMC ' + l, l === lv)).join('')}</div>
        </div>
        <div id="dailyHost"></div>
      </section>
      <aside class="side" id="side" aria-label="Your progress today">${sideHTML()}</aside>
    </div>
    <nav class="qa" aria-label="Ways to practice">
      <a class="qa-item" href="#/tests"><span class="qa-ic">${U.icon('clock', 22)}</span><b>Take a mock test</b><span class="muted">25 questions, timed like the real exam</span></a>
      <a class="qa-item" href="#/practice"><span class="qa-ic">${U.icon('target', 22)}</span><b>Practice by topic</b><span class="muted">${PROBS.length} problems by level, topic and difficulty</span></a>
      <a class="qa-item" href="#/drills"><span class="qa-ic">${U.icon('bolt', 22)}</span><b>Run a quick drill</b><span class="muted">Endless fresh questions, instant feedback</span></a>
      <a class="qa-item" href="#/review"><span class="qa-ic">${U.icon('bookmark', 22)}</span><b>Review mistakes</b><span class="muted">${missedN ? U.plural(missedN, 'problem') + ' to retry' : 'Missed and starred problems collect here'}</span></a>
    </nav>
    <section aria-labelledby="ttitle"><h2 id="ttitle">Your topics at AMC ${lv}</h2><div class="topics">${topics}</div></section>`;
  return {
    html, title: 'Home',
    acts: {
      level(el) { Store.setProfile({ level: +el.dataset.v }); App.filters = null; App.rerender(); },
      topic(el) { const f = App.getFilters(); f.cat = el.dataset.cat; f.lv = String(Store.profile.level); f.status = 'all'; f.diff = 'all'; f.q = ''; }
    },
    mount(root) {
      const card = UI.mountCard(U.$('#dailyHost', root), daily, {
        mode: 'practice', bookmarkable: true,
        onAttempt: (ok, pick, secs) => { recordFor(daily, ok, 'p', secs); U.$('#side').innerHTML = sideHTML(); }
      });
      App.onKey = e => { if (card.handleKey(e)) e.preventDefault(); };
    }
  };
};

/* ---------- Practice browser ---------- */
function filtered(f) {
  const q = f.q.trim().toLowerCase();
  return PROBS.filter(p =>
    (f.lv === 'all' || p.lv === +f.lv) && (f.cat === 'all' || p.cat === f.cat) &&
    (f.diff === 'all' || (f.diff === 'easy' ? p.d <= 2 : f.diff === 'med' ? p.d === 3 : p.d >= 4)) &&
    (f.status === 'all' || (f.status === 'starred' ? Store.isStarred(p.id) : Store.status(p.id) === f.status)) &&
    (!q || p.topic.toLowerCase().includes(q) || CONFIG.cats[p.cat].name.toLowerCase().includes(q) || p.q.toLowerCase().includes(q)));
}
const listHTML = (list, empty) => list.length ? list.map(UI.problemRow).join('') : `<div class="empty">${empty}</div>`;
function startQueue(ids, label) { App.queue = { ids, i: 0, label }; location.hash = '#/problem/' + ids[0]; }

Views.practice = () => {
  const f = App.getFilters(), list = filtered(f), lvNum = f.lv === 'all' ? null : +f.lv;
  const cards = CAT_KEYS.map(cat => {
    const all = PROBS.filter(p => (!lvNum || p.lv === lvNum) && p.cat === cat), solved = all.filter(p => Store.status(p.id) === 'solved').length;
    return `<button type="button" class="topic" data-act="filter" data-k="cat" data-v="${f.cat === cat ? 'all' : cat}" aria-pressed="${f.cat === cat}">
      <span class="topic-h"><i class="cdot c-${cat}"></i><b>${CONFIG.cats[cat].name}</b></span>${bar(U.pct(solved, all.length), cat)}
      <span class="small">${solved} of ${all.length} solved</span></button>`;
  }).join('');
  const group = (k, opts) => opts.map(([v, label]) => chip('filter', k, v, label, String(f[k]) === String(v))).join('');
  const html = `
    <h1>Practice by topic</h1>
    <p class="lede">Choose a contest level and topic, then work through the problems. You get two tries on each one, with a hint if you need it.</p>
    <div class="topics compact">${cards}</div>
    <section class="panel filters" aria-label="Filters">
      <div class="frow"><span class="flabel" id="fl1">Contest</span><div class="chips" role="group" aria-labelledby="fl1">${group('lv', [['all', 'All'], [8, 'AMC 8'], [10, 'AMC 10'], [12, 'AMC 12']])}</div></div>
      <div class="frow"><span class="flabel" id="fl2">Difficulty</span><div class="chips" role="group" aria-labelledby="fl2">${group('diff', [['all', 'Any'], ['easy', 'Easier'], ['med', 'Medium'], ['hard', 'Harder']])}</div></div>
      <div class="frow"><span class="flabel" id="fl3">Status</span><div class="chips" role="group" aria-labelledby="fl3">${group('status', [['all', 'Any'], ['new', 'New'], ['missed', 'Missed'], ['solved', 'Solved'], ['starred', 'Starred']])}</div></div>
      <div class="frow"><label class="flabel" for="search">Search</label><input id="search" class="input" type="search" placeholder="Try “circles” or “divisors”" value="${U.esc(f.q)}" data-input="search" autocomplete="off"></div>
    </section>
    <div class="listhead">
      <h2 id="count" aria-live="polite">${U.plural(list.length, 'problem')}</h2>
      <div class="btnrow"><button type="button" class="btn sm" data-act="start" data-shuffle="0">Start in order</button><button type="button" class="btn primary sm" data-act="start" data-shuffle="1">Shuffle and start</button></div>
    </div>
    <div id="plist" class="plist">${listHTML(list, 'No problems match these filters. Try clearing one.')}</div>`;
  return {
    html, title: 'Practice',
    acts: {
      filter(el) { App.getFilters()[el.dataset.k] = el.dataset.v; App.rerender(); },
      start(el) {
        const ids = filtered(App.getFilters()).map(p => p.id); if (!ids.length) return U.toast('No problems match these filters.');
        startQueue(el.dataset.shuffle === '1' ? U.shuffle(ids) : ids, 'Practice');
      },
      open(el) { const ids = filtered(App.getFilters()).map(p => p.id); App.queue = { ids, i: ids.indexOf(el.dataset.id), label: 'Practice' }; }
    },
    inputs: {
      search(el) {
        App.getFilters().q = el.value; const l = filtered(App.getFilters());
        U.$('#plist').innerHTML = listHTML(l, 'No problems match these filters. Try clearing one.');
        U.$('#count').textContent = U.plural(l.length, 'problem');
      }
    }
  };
};

/* ---------- Single problem ---------- */
Views.notFound = () => ({ html: `<div class="panel"><h1>We couldn’t find that page</h1><p>The link may be out of date. <a href="#/">Go home</a> or <a href="#/practice">browse problems</a>.</p></div>`, title: 'Not found' });

Views.problem = id => {
  const p = BY_ID[id]; if (!p) return Views.notFound();
  let q = App.queue;
  if (q && q.ids.includes(id)) q.i = q.ids.indexOf(id);
  else { const ids = PROBS.filter(x => x.lv === p.lv).map(x => x.id); q = App.queue = { ids, i: ids.indexOf(id), label: 'AMC ' + p.lv }; }
  const prev = q.i > 0 ? q.ids[q.i - 1] : null, next = q.i < q.ids.length - 1 ? q.ids[q.i + 1] : null;
  const nav = (id2, label, cls) => id2 ? `<a class="btn ${cls || ''}" href="#/problem/${id2}" id="${label === 'Next problem' ? 'nextBtn' : 'prevBtn'}">${label}</a>` : `<span class="btn disabled" aria-disabled="true">${label}</span>`;
  const html = `
    <h1 class="sr">${U.esc(p.topic)}, AMC ${p.lv}</h1>
    <div class="crumbs"><a href="#/practice">All problems</a><span class="muted">Problem ${q.i + 1} of ${q.ids.length}</span></div>
    <div id="host"></div>
    <div class="pnav">${nav(prev, 'Previous')}${nav(next, 'Next problem', 'primary')}</div>
    <p class="muted small keys">Keyboard: A to E choose, Enter checks, H hint, S star, left and right arrows move.</p>`;
  return {
    html, title: `${p.topic}, AMC ${p.lv}`,
    mount(root) {
      const card = UI.mountCard(U.$('#host', root), p, {
        mode: 'practice', bookmarkable: true,
        onAttempt: (ok, pick, secs) => recordFor(p, ok, 'p', secs),
        onDone: () => { const n = U.$('#nextBtn'); if (n) n.classList.add('hl'); }
      });
      App.onKey = e => {
        if (card.handleKey(e)) return e.preventDefault();
        if (e.key === 'Enter' && card.isDone() && next) { e.preventDefault(); location.hash = '#/problem/' + next; }
        else if (e.key === 'ArrowRight' && next) location.hash = '#/problem/' + next;
        else if (e.key === 'ArrowLeft' && prev) location.hash = '#/problem/' + prev;
      };
    }
  };
};

/* ---------- Review ---------- */
Views.review = () => {
  const tab = App.reviewTab || 'missed';
  const missed = PROBS.filter(p => Store.status(p.id) === 'missed'), starred = PROBS.filter(p => Store.isStarred(p.id));
  const list = tab === 'missed' ? missed : starred;
  const empty = tab === 'missed'
    ? 'Nothing to retry yet. Problems you miss will collect here so you can try them again.'
    : 'No starred problems yet. Use the star in the top corner of any problem to save it here.';
  const html = `
    <h1>Review</h1>
    <p class="lede">Problems you missed last time, and ones you starred to come back to. Getting a missed problem right removes it from this list.</p>
    <div class="chips" role="group" aria-label="Review list">${chip('tab', 'tab', 'missed', `Missed (${missed.length})`, tab === 'missed')}${chip('tab', 'tab', 'starred', `Starred (${starred.length})`, tab === 'starred')}</div>
    <div class="listhead"><h2>${U.plural(list.length, 'problem')}</h2>
      <div class="btnrow"><button type="button" class="btn primary sm" data-act="start" data-shuffle="0" ${list.length ? '' : 'disabled'}>Practice these</button></div></div>
    <div class="plist">${listHTML(list, empty)}</div>`;
  return {
    html, title: 'Review',
    acts: {
      tab(el) { App.reviewTab = el.dataset.v; App.rerender(); },
      start() { const l = (App.reviewTab || 'missed') === 'missed' ? missed : starred; if (l.length) startQueue(U.shuffle(l.map(p => p.id)), 'Review'); },
      open(el) { const ids = list.map(p => p.id); App.queue = { ids, i: ids.indexOf(el.dataset.id), label: 'Review' }; }
    }
  };
};
