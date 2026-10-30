/* Views, part 2: mock tests (setup, exam runner, results). */
const Exam = {
  // Questions run easy -> hard like the real contest, with a spread of topics.
  build(lv, n, fresh) {
    const pool = PROBS.filter(p => p.lv === lv), used = new Set(), out = [], catN = {};
    for (let i = 0; i < n; i++) {
      const target = 1 + Math.min(4, Math.floor((i * 5) / n));
      const best = pool.filter(p => !used.has(p.id)).map(p => ({
        p, s: Math.abs(p.d - target) * 2 + (fresh && Store.status(p.id) !== 'new' ? 1.5 : 0) + (catN[p.cat] || 0) * 0.35 + Math.random() * 1.2
      })).sort((a, b) => a.s - b.s)[0].p;
      used.add(best.id); catN[best.cat] = (catN[best.cat] || 0) + 1; out.push(best);
    }
    return out;
  },
  start(cfg) {
    const ex = CONFIG.exam[cfg.lv], n = cfg.len, probs = Exam.build(cfg.lv, n, cfg.fresh);
    const a = {
      id: 't' + Date.now().toString(36), lv: cfg.lv, ids: probs.map(p => p.id), picks: Array(n).fill(null), flags: Array(n).fill(false),
      t: Array(n).fill(0), cur: 0, start: Date.now(), mark: Date.now(), dur: cfg.timed ? Math.round((ex.minutes * 60 * n) / 25) : 0
    };
    Store.setActive(a); location.hash = '#/test/run';
  },
  grade(a, record) {
    const ex = CONFIG.exam[a.lv], n = a.ids.length; let c = 0, w = 0, b = 0; const cats = {};
    a.ids.forEach((id, i) => {
      const p = BY_ID[id], pk = a.picks[i], ct = cats[p.cat] || (cats[p.cat] = { c: 0, n: 0 });
      ct.n++;
      if (pk === null) b++; else if (pk === p.a) { c++; ct.c++; } else w++;
      if (record && pk !== null) Store.record({ ...p, ok: pk === p.a, mode: 't', secs: a.t[i] });
    });
    return {
      id: a.id, t: Date.now(), lv: a.lv, n, c, w, b, raw: c * ex.correct + b * ex.blank, max: n * ex.correct,
      secs: Math.round(a.t.reduce((x, y) => x + y, 0)), timed: !!a.dur, dur: a.dur, ids: a.ids, picks: a.picks, tq: a.t.map(x => Math.round(x)), cats
    };
  }
};

/* ---------- Setup ---------- */
Views.tests = () => {
  const a = Store.active, cfg = App.testCfg || (App.testCfg = { lv: Store.profile.level, len: 25, timed: true, fresh: true });
  const ex = CONFIG.exam[cfg.lv], mins = Math.round((ex.minutes * cfg.len) / 25);
  const scoreRule = lv => lv === 8 ? '1 point per correct answer' : '6 points per correct answer, 1.5 for a blank, 0 for a wrong answer';
  const optcards = [8, 10, 12].map(lv => `
    <button type="button" class="optcard" data-act="tcfg" data-k="lv" data-v="${lv}" aria-pressed="${cfg.lv === lv}">
      <b>${CONFIG.exam[lv].name}</b><span>${CONFIG.exam[lv].questions} questions, ${CONFIG.exam[lv].minutes} minutes</span><span class="muted">${scoreRule(lv)}</span>
    </button>`).join('');
  const lens = [[25, 'Full test (25)'], [12, 'Half test (12)'], [6, 'Quick set (6)']].map(([v, l]) => chip('tcfg', 'len', v, l, cfg.len === v)).join('');
  const hist = Store.tests.slice(0, 8).map(t => {
    const e = CONFIG.exam[t.lv], when = new Date(t.t).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    return `<tr><td>${when}</td><td>${e.name}${t.n < 25 ? ` (${t.n} questions)` : ''}</td><td><b>${fmtNum(t.raw)}</b> of ${t.max}</td><td>${t.c} right, ${t.w} wrong, ${t.b} blank</td><td>${U.fmtTime(t.secs)}</td><td><a href="#/test/results/${t.id}">Review</a></td></tr>`;
  }).join('');
  const resume = a ? `
    <section class="panel resume"><div><h2>You have a test in progress</h2>
      <p class="muted">${CONFIG.exam[a.lv].name}, ${a.picks.filter(x => x !== null).length} of ${a.ids.length} answered.${a.dur ? ' The clock is still running.' : ''}</p></div>
      <div class="btnrow"><a class="btn hl" href="#/test/run">Resume test</a><button type="button" class="btn ghost" data-act="discard">Discard</button></div></section>` : '';
  const html = `
    <h1>Mock tests</h1>
    <p class="lede">Sit a test the way you will on contest day: questions run from easy to hard, you can flag and skip, and nothing is graded until you submit. Questions are original, written in the style of the AMC.</p>
    ${resume}
    <section class="panel strong setup" aria-labelledby="bt">
      <h2 id="bt">Build a test</h2>
      <div class="optcards" role="group" aria-label="Contest">${optcards}</div>
      <div class="frow"><span class="flabel" id="ln">Length</span><div class="chips" role="group" aria-labelledby="ln">${lens}</div></div>
      <label class="check"><input type="checkbox" data-change="tcfgbox" data-k="timed" ${cfg.timed ? 'checked' : ''}><span>Run the clock (${mins} minutes)</span></label>
      <label class="check"><input type="checkbox" data-change="tcfgbox" data-k="fresh" ${cfg.fresh ? 'checked' : ''}><span>Prefer problems I haven’t tried yet</span></label>
      <div class="btnrow"><button type="button" class="btn primary big" data-act="begin">Start ${ex.name} test</button></div>
      <p class="muted small">No calculators on the real contest, so don’t use one here either.</p>
    </section>
    ${hist ? `<section><h2>Recent tests</h2><div class="tablewrap"><table class="table"><thead><tr><th>Date</th><th>Contest</th><th>Score</th><th>Answers</th><th>Time</th><th><span class="sr">Link</span></th></tr></thead><tbody>${hist}</tbody></table></div></section>` : ''}`;
  return {
    html, title: 'Mock tests',
    acts: {
      tcfg(el) { const v = el.dataset.k === 'lv' || el.dataset.k === 'len' ? +el.dataset.v : el.dataset.v; App.testCfg[el.dataset.k] = v; App.rerender(); },
      begin() {
        if (Store.active && !confirm('Starting a new test will discard the one in progress. Continue?')) return;
        Exam.start(App.testCfg);
      },
      discard() { if (confirm('Discard the test in progress? Your answers will be lost.')) { Store.setActive(null); App.rerender(); } }
    },
    changes: { tcfgbox(el) { App.testCfg[el.dataset.k] = el.checked; if (el.dataset.k === 'timed') App.rerender(); } }
  };
};

/* ---------- Exam runner ---------- */
Views.testRun = () => {
  const a = Store.active;
  if (!a) return { html: `<div class="panel"><h1>No test in progress</h1><p>Build one on the <a href="#/tests">Mock tests</a> page.</p></div>`, title: 'Mock test' };
  const n = a.ids.length, ex = CONFIG.exam[a.lv];
  let card = null;
  const html = `
    <h1 class="sr">${ex.name} mock test</h1>
    <div class="exam-top panel">
      <div><b>${ex.name} mock test</b><div class="muted">Question <span id="qpos">${a.cur + 1}</span> of ${n}</div></div>
      <div class="timer" id="timer" role="timer" aria-label="${a.dur ? 'Time left' : 'Time elapsed'}">--:--</div>
      <button type="button" class="btn hl" data-act="submit">Submit test</button>
    </div>
    <div class="exam">
      <section class="panel strong" aria-label="Question">
        <div id="qhost"></div>
        <div class="qnav">
          <button type="button" class="btn" data-act="prev" id="bPrev">Previous</button>
          <button type="button" class="btn ghost" data-act="flag" id="bFlag" aria-pressed="false">${U.icon('flag', 16)} Flag for review</button>
          <button type="button" class="btn primary" data-act="next" id="bNext">Next</button>
        </div>
        <p class="muted small">Click a choice to select it, and click it again to clear it. Use × to cross choices out. Keys: A to E select, left and right arrows move, F flags.</p>
      </section>
      <aside class="panel sheet" aria-labelledby="sh"><h2 id="sh">Answer sheet</h2><div class="sheet-rows" id="sheet"></div>
        <p class="muted small">${a.lv === 8 ? 'Blank answers score zero, so it never hurts to guess.' : 'A blank is worth 1.5 points. A wrong answer is worth 0.'}</p></aside>
    </div>`;

  const save = () => Store.setActive(a);
  function renderSheet() {
    U.$('#sheet').innerHTML = a.ids.map((id, i) => `
      <div class="srow ${i === a.cur ? 'cur' : ''} ${a.flags[i] ? 'flag' : ''}">
        <button type="button" class="sn" data-act="goq" data-q="${i}" aria-label="Go to question ${i + 1}${a.flags[i] ? ', flagged' : ''}">${i + 1}</button>
        ${[0, 1, 2, 3, 4].map(k => `<button type="button" class="mb ${a.picks[i] === k ? 'on' : ''}" data-act="sheetpick" data-q="${i}" data-k="${k}" aria-pressed="${a.picks[i] === k}" aria-label="Question ${i + 1}, choice ${UI.LET[k]}">${UI.LET[k]}</button>`).join('')}
      </div>`).join('');
  }
  function updateNav() {
    U.$('#qpos').textContent = a.cur + 1;
    U.$('#bPrev').disabled = a.cur === 0; U.$('#bNext').disabled = a.cur === n - 1;
    const fl = U.$('#bFlag'); fl.setAttribute('aria-pressed', a.flags[a.cur]); fl.classList.toggle('on', a.flags[a.cur]);
  }
  function show(i, typeset) {
    const now = Date.now(); a.t[a.cur] += (now - a.mark) / 1000; a.mark = now; a.cur = i;
    card = UI.mountCard(U.$('#qhost'), BY_ID[a.ids[i]], { mode: 'exam', num: i + 1, pick: a.picks[i], onPick: pk => { a.picks[i] = pk; save(); renderSheet(); } });
    if (typeset) U.typeset(U.$('#qhost'));
    updateNav(); renderSheet(); save();
  }
  function finishTest(auto) {
    a.t[a.cur] += (Date.now() - a.mark) / 1000;
    const res = Exam.grade(a, true); Store.addTest(res); Store.setActive(null);
    if (auto) U.toast('Time is up. Your test was submitted.', 5000);
    location.hash = '#/test/results/' + res.id;
  }

  return {
    html, title: `${ex.name} mock test`,
    acts: {
      prev() { if (a.cur > 0) show(a.cur - 1, true); },
      next() { if (a.cur < n - 1) show(a.cur + 1, true); },
      goq(el) { show(+el.dataset.q, true); },
      flag() { a.flags[a.cur] = !a.flags[a.cur]; updateNav(); renderSheet(); save(); },
      sheetpick(el) {
        const q = +el.dataset.q, k = +el.dataset.k;
        a.picks[q] = a.picks[q] === k ? null : k; save();
        if (q === a.cur) show(q, true); else renderSheet();
      },
      submit() {
        const blanks = a.picks.filter(x => x === null).length, flagged = a.flags.filter(Boolean).length;
        let msg = 'Submit your test?';
        if (blanks) msg += `\n\n${U.plural(blanks, 'question')} unanswered${ex.blank ? ` (each blank is worth ${ex.blank} points)` : ''}.`;
        if (flagged) msg += `\n${flagged} flagged for review.`;
        if (confirm(msg)) finishTest(false);
      }
    },
    mount() {
      a.mark = Date.now();
      show(a.cur, false);
      const timer = U.$('#timer');
      const tick = () => {
        const elapsed = (Date.now() - a.start) / 1000;
        if (a.dur) {
          const left = Math.ceil(a.dur - elapsed); timer.textContent = U.fmtTime(left); timer.classList.toggle('low', left <= 300);
          if (left <= 0) { clearInterval(h); finishTest(true); }
        } else timer.textContent = U.fmtTime(elapsed);
      };
      const h = setInterval(tick, 500); tick();
      App.cleanups.push(() => clearInterval(h));
      App.onKey = e => {
        if (card.handleKey(e)) return e.preventDefault();
        if (e.key === 'ArrowRight' && a.cur < n - 1) show(a.cur + 1, true);
        else if (e.key === 'ArrowLeft' && a.cur > 0) show(a.cur - 1, true);
        else if (e.key.toLowerCase() === 'f') { a.flags[a.cur] = !a.flags[a.cur]; updateNav(); renderSheet(); save(); }
      };
    }
  };
};

/* ---------- Results ---------- */
Views.testResults = id => {
  const r = Store.tests.find(t => t.id === id);
  if (!r) return Views.notFound();
  const ex = CONFIG.exam[r.lv], full = r.n === 25, eq = r.max ? Math.round((r.raw / r.max) * ex.max * 10) / 10 : 0;
  const L = UI.LET;
  const cats = CAT_KEYS.filter(c => r.cats[c]).map(c => `<div class="catrow"><span class="catname"><i class="cdot c-${c}"></i>${CONFIG.cats[c].name}</span>${bar(U.pct(r.cats[c].c, r.cats[c].n), c)}<span class="small">${r.cats[c].c} of ${r.cats[c].n}</span></div>`).join('');
  const items = r.ids.map((pid, i) => {
    const p = BY_ID[pid], pk = r.picks[i], st = pk === null ? 'blank' : pk === p.a ? 'right' : 'wrong';
    const label = { blank: 'Blank', right: 'Correct', wrong: 'Wrong' }[st];
    return `<details class="qitem" data-i="${i}"><summary><span class="qn">${i + 1}</span><span class="qstat s-${st}">${label}</span><span class="qsum"><b>${U.esc(p.topic)}</b><span class="muted">${CONFIG.cats[p.cat].name}</span></span><span class="small muted">${pk === null ? 'No answer' : 'You: ' + L[pk]}${st === 'right' ? '' : ', answer: ' + L[p.a]}${r.tq ? ', ' + U.fmtTime(r.tq[i]) : ''}</span></summary><div class="qbody"></div></details>`;
  }).join('');
  const missed = r.ids.filter((pid, i) => r.picks[i] !== BY_ID[pid].a);
  const html = `
    <h1>${ex.name} mock test results</h1>
    <section class="panel strong scorecard">
      <div class="score"><span class="scorenum">${fmtNum(r.raw)}</span><span class="outof">out of ${r.max}</span></div>
      <dl class="facts">
        <div><dt>Correct</dt><dd>${r.c}</dd></div><div><dt>Wrong</dt><dd>${r.w}</dd></div><div><dt>Blank</dt><dd>${r.b}</dd></div>
        <div><dt>Time used</dt><dd>${U.fmtTime(r.secs)}${r.timed ? ` of ${U.fmtTime(r.dur)}` : ''}</dd></div>
      </dl>
    </section>
    ${!full ? `<p class="note">This was a ${r.n}-question test. On a full 25-question ${ex.name} the same performance would score about ${fmtNum(eq)} out of ${ex.max}.</p>` : ''}
    ${r.lv !== 8 && full ? `<p class="note">For reference, the reported 2026–27 AIME cutoffs are 100 on the AMC 10 and 85 on the AMC 12 (confirm at <a href="https://www.maa.org/AMC" target="_blank" rel="noopener">maa.org/AMC</a>). These practice problems are not the real exam, so treat your score as a rough guide.</p>` : ''}
    <div class="btnrow"><a class="btn primary" href="#/tests">Take another test</a><button type="button" class="btn" data-act="retry" ${missed.length ? '' : 'disabled'}>Retry the ${missed.length} you missed or skipped</button></div>
    <section aria-labelledby="bc"><h2 id="bc">By topic</h2><div class="panel">${cats}</div></section>
    <section aria-labelledby="qq"><h2 id="qq">Question by question</h2><p class="muted">Open any question to see the full solution.</p><div class="qlist">${items}</div></section>`;
  return {
    html, title: 'Test results',
    acts: { retry() { if (missed.length) startQueue(missed, 'Missed on test'); } },
    mount(root) {
      U.$$('details.qitem', root).forEach(d => d.addEventListener('toggle', () => {
        if (!d.open || d.dataset.done) return; d.dataset.done = '1';
        const i = +d.dataset.i, host = U.$('.qbody', d);
        UI.mountCard(host, BY_ID[r.ids[i]], { mode: 'review', pick: r.picks[i] });
        U.typeset(host);
      }));
    }
  };
};
