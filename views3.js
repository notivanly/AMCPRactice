/* Views, part 3: Drills, Progress, Resources, Settings. */

/* ---------- Drills ---------- */
const DRILL_LEVELS = [[1, 'Warm-up'], [2, 'Standard'], [3, 'Challenge']];
const DRILL_LENS = [[10, 'Sprint (10)'], [20, 'Round (20)'], [0, 'Endless']];

Views.drills = () => {
  const d = App.drill;
  if (!d) {
    const s = App.drillCfg || (App.drillCfg = { cat: 'all', lvl: 2, len: 10 });
    const group = (k, opts) => opts.map(([v, l]) => chip('dcfg', k, v, l, String(s[k]) === String(v))).join('');
    const stat = Store.data.drills;
    return {
      html: `
        <h1>Drills</h1>
        <p class="lede">Fresh questions every time, with instant feedback and a worked solution. Good for ten minutes of warm-up or for building speed on one topic.</p>
        <section class="panel strong setup">
          <div class="frow"><span class="flabel" id="d1">Topic</span><div class="chips" role="group" aria-labelledby="d1">${group('cat', [['all', 'Mixed'], ...CAT_KEYS.map(c => [c, CONFIG.cats[c].name])])}</div></div>
          <div class="frow"><span class="flabel" id="d2">Challenge</span><div class="chips" role="group" aria-labelledby="d2">${group('lvl', DRILL_LEVELS)}</div></div>
          <div class="frow"><span class="flabel" id="d3">Length</span><div class="chips" role="group" aria-labelledby="d3">${group('len', DRILL_LENS)}</div></div>
          <div class="btnrow"><button type="button" class="btn primary big" data-act="dstart">Start drill</button></div>
        </section>
        ${stat.n ? `<p class="muted">So far you have answered ${U.plural(stat.n, 'drill question')} (${U.pct(stat.c, stat.n)}% correct). Best streak: ${stat.best}.</p>` : ''}`,
      title: 'Drills',
      acts: {
        dcfg(el) { App.drillCfg[el.dataset.k] = el.dataset.k === 'cat' ? el.dataset.v : +el.dataset.v; App.rerender(); },
        dstart() { const s2 = App.drillCfg; App.drill = { ...s2, done: 0, correct: 0, streak: 0, best: 0, secs: 0, finished: false }; App.rerender(); }
      }
    };
  }

  if (d.finished) {
    return {
      html: `
        <h1>Drill complete</h1>
        <section class="panel strong scorecard">
          <div class="score"><span class="scorenum">${d.correct}</span><span class="outof">of ${d.done} correct</span></div>
          <dl class="facts"><div><dt>Accuracy</dt><dd>${U.pct(d.correct, d.done)}%</dd></div><div><dt>Best streak</dt><dd>${d.best}</dd></div><div><dt>Average time</dt><dd>${d.done ? U.fmtTime(d.secs / d.done) : '0:00'}</dd></div></dl>
        </section>
        <div class="btnrow"><button type="button" class="btn primary" data-act="again">Go again</button><button type="button" class="btn" data-act="dback">Change settings</button><a class="btn ghost" href="#/progress">See progress</a></div>`,
      title: 'Drill complete',
      acts: {
        again() { App.drill = { cat: d.cat, lvl: d.lvl, len: d.len, done: 0, correct: 0, streak: 0, best: 0, secs: 0, finished: false }; App.rerender(); },
        dback() { App.drill = null; App.rerender(); }
      }
    };
  }

  let nextQ = () => {};
  const catName = d.cat === 'all' ? 'Mixed topics' : CONFIG.cats[d.cat].name, lvlName = DRILL_LEVELS.find(x => x[0] === d.lvl)[1];
  const stats = () => `<span><b>${d.done}</b>${d.len ? ` of ${d.len}` : ''} answered</span><span><b>${d.correct}</b> correct</span><span><b>${d.streak}</b> in a row</span>`;
  return {
    html: `
      <h1 class="sr">Drill: ${catName}</h1>
      <div class="crumbs"><span><b>${catName}</b>, ${lvlName.toLowerCase()}</span><span class="muted"><button type="button" class="linklike" data-act="end">End session</button></span></div>
      <div class="drillstats" id="dstats" aria-live="polite">${stats()}</div>
      <div id="host"></div>
      <div class="pnav"><button type="button" class="btn primary" id="dnext" data-act="dnext">Skip question</button></div>
      <p class="muted small keys">Keyboard: A to E choose, Enter checks, then Enter again for the next question.</p>`,
    title: 'Drills',
    acts: {
      end() { if (d.done === 0 || confirm('End this drill now?')) { if (d.done) { d.finished = true; } else App.drill = null; App.rerender(); } },
      dnext() { nextQ(); }
    },
    mount(root) {
      let card = null;
      const host = U.$('#host', root);
      function load(typeset) {
        const p = Gen.make(d.cat, d.lvl);
        card = UI.mountCard(host, p, {
          mode: 'drill',
          onAttempt: (ok, pick, secs) => {
            Store.record({ ...p, ok, mode: 'd', secs });
            d.done++; d.secs += secs; if (ok) { d.correct++; d.streak++; d.best = Math.max(d.best, d.streak); Store.bestDrillStreak(d.best); } else d.streak = 0;
            U.$('#dstats').innerHTML = stats();
          },
          onDone: () => { const b = U.$('#dnext'); b.textContent = d.len && d.done >= d.len ? 'See results' : 'Next question'; b.classList.add('hl'); }
        });
        const b = U.$('#dnext'); b.textContent = 'Skip question'; b.classList.remove('hl');
        host.setAttribute('tabindex', '-1'); host.focus({ preventScroll: true });   // so Enter checks the answer instead of re-pressing Next
        if (typeset) U.typeset(host);
      }
      function next() { if (d.len && d.done >= d.len) { d.finished = true; App.rerender(); } else load(true); }
      nextQ = next;
      load(false);
      App.onKey = e => {
        if (card.handleKey(e)) return e.preventDefault();
        if (e.key === 'Enter' && card.isDone()) { e.preventDefault(); next(); }
      };
    }
  };
};

/* ---------- Progress ---------- */
function lineChart(tests) {
  const pts = tests.slice(0, 12).reverse();
  if (pts.length < 2) return '<p class="muted">Take at least two mock tests to see your trend here.</p>';
  const W = 640, H = 230, pl = 40, pr = 16, pt = 14, pb = 30;
  const x = i => pl + ((W - pl - pr) * i) / (pts.length - 1), y = v => pt + (H - pt - pb) * (1 - v / 100);
  const grid = [0, 25, 50, 75, 100].map(v => `<line class="gl" x1="${pl}" x2="${W - pr}" y1="${y(v)}" y2="${y(v)}"/><text x="${pl - 8}" y="${y(v) + 4}" text-anchor="end">${v}%</text>`).join('');
  const line = pts.map((t, i) => `${x(i).toFixed(1)},${y((100 * t.raw) / t.max).toFixed(1)}`).join(' ');
  const dots = pts.map((t, i) => `<circle class="pt" cx="${x(i).toFixed(1)}" cy="${y((100 * t.raw) / t.max).toFixed(1)}" r="5"><title>${CONFIG.exam[t.lv].name}: ${fmtNum(t.raw)} of ${t.max} (${Math.round((100 * t.raw) / t.max)}%)</title></circle>`).join('');
  const labels = pts.map((t, i) => `<text x="${x(i).toFixed(1)}" y="${H - 8}" text-anchor="middle">${CONFIG.exam[t.lv].name.replace('AMC ', '')}</text>`).join('');
  return `<svg viewBox="0 0 ${W} ${H}" class="chart" role="img" aria-label="Mock test scores over time, as a percent of the maximum score">${grid}<polyline class="ln" points="${line}"/>${dots}${labels}</svg><p class="muted small">Each point is one mock test, oldest on the left. The label under it is the contest (8, 10 or 12).</p>`;
}
function heatmap() {
  const days = Store.byDay(), weeks = 17, today = new Date(), dow = (today.getDay() + 6) % 7;
  const start = new Date(today); start.setDate(today.getDate() - dow - (weeks - 1) * 7);
  const lvl = n => (n === 0 ? 0 : n <= 2 ? 1 : n <= 5 ? 2 : n <= 9 ? 3 : 4), cells = [];
  for (let i = 0; i < weeks * 7; i++) {
    const dt = new Date(start); dt.setDate(start.getDate() + i);
    const n = days[U.dayKey(dt)] || 0, fut = dt > today;
    cells.push(`<i class="h ${fut ? 'fut' : 'h' + lvl(n)}" title="${dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}: ${U.plural(n, 'problem')}"></i>`);
  }
  return `<div class="heat" role="img" aria-label="Problems answered each day over the last ${weeks} weeks">${cells.join('')}</div>`;
}

Views.progress = () => {
  const s = Store.summary(), st = Store.streak(), solved = PROBS.filter(p => Store.status(p.id) === 'solved').length;
  const rows = (obj, order, label) => order.filter(k => obj[k]).map(k => `<div class="catrow"><span class="catname">${label(k)}</span>${bar(U.pct(obj[k].c, obj[k].n), String(k).length <= 3 && CONFIG.cats[k] ? k : '')}<span class="small">${U.pct(obj[k].c, obj[k].n)}% of ${obj[k].n}</span></div>`).join('') || '<p class="muted">Answer a few problems and your numbers will show up here.</p>';
  const weak = Object.entries(s.topic).filter(([, v]) => v.n >= 3).map(([k, v]) => ({ k, ...v, acc: v.c / v.n })).sort((a, b) => a.acc - b.acc || b.n - a.n).slice(0, 5);
  const weakHTML = weak.length ? weak.map(w => { const [cat, topic] = w.k.split('|'); return `<a class="prow" href="#/practice" data-act="focus" data-cat="${cat}" data-topic="${U.esc(topic)}"><span class="pmain"><b>${U.esc(topic)}</b><span class="muted">${CONFIG.cats[cat].name}</span></span><span class="small">${Math.round(w.acc * 100)}% of ${w.n}</span></a>`; }).join('')
    : '<p class="muted">Once you have answered at least three problems in a topic, your weakest ones will be listed here.</p>';
  const dr = Store.data.drills;
  const html = `
    <h1>Progress</h1>
    <div class="stats4">
      <div class="panel stat"><b>${s.n}</b><span class="muted">answers recorded</span></div>
      <div class="panel stat"><b>${s.n ? U.pct(s.c, s.n) : 0}%</b><span class="muted">answered correctly</span></div>
      <div class="panel stat"><b>${solved}<small> / ${PROBS.length}</small></b><span class="muted">problems solved</span></div>
      <div class="panel stat"><b>${st.cur}</b><span class="muted">day streak (best ${st.best})</span></div>
    </div>
    <div class="cols2">
      <section aria-labelledby="p1"><h2 id="p1">By topic</h2><div class="panel">${rows(s.cat, CAT_KEYS, k => `<i class="cdot c-${k}"></i>${CONFIG.cats[k].name}`)}</div></section>
      <section aria-labelledby="p2"><h2 id="p2">By contest</h2><div class="panel">${rows(s.lv, [8, 10, 12], k => 'AMC ' + k)}</div>
        <h2 id="p3">By difficulty</h2><div class="panel">${rows(s.d, [1, 2, 3, 4, 5], k => ['', 'Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5'][k])}</div></section>
    </div>
    <section aria-labelledby="p4"><h2 id="p4">Where to focus next</h2><div class="plist">${weakHTML}</div></section>
    <section aria-labelledby="p5"><h2 id="p5">Mock test scores</h2><div class="panel">${lineChart(Store.tests)}</div></section>
    <section aria-labelledby="p6"><h2 id="p6">Practice calendar</h2><div class="panel">${heatmap()}<p class="muted small">Darker squares mean more problems answered that day.</p></div></section>
    ${dr.n ? `<p class="muted">Drills: ${U.plural(dr.n, 'question')} answered, ${U.pct(dr.c, dr.n)}% correct, best streak ${dr.best}.</p>` : ''}`;
  return {
    html, title: 'Progress',
    acts: { focus(el) { const f = App.getFilters(); f.cat = el.dataset.cat; f.q = el.dataset.topic; f.lv = 'all'; f.status = 'all'; f.diff = 'all'; } }
  };
};

/* ---------- Resources ---------- */
const FORMULAS = {
  alg: [
    ['Quadratic formula', 'x=\\dfrac{-b\\pm\\sqrt{b^2-4ac}}{2a}'],
    ['Vieta (for $ax^2+bx+c$)', 'r+s=-\\dfrac{b}{a},\\qquad rs=\\dfrac{c}{a}'],
    ['Squares and cubes', 'a^2-b^2=(a-b)(a+b),\\quad a^3\\pm b^3=(a\\pm b)(a^2\\mp ab+b^2)'],
    ['Sum of squares', 'a^2+b^2=(a+b)^2-2ab'],
    ['Simon’s Favorite Factoring Trick', 'xy+ax+by+ab=(x+b)(y+a)'],
    ['Arithmetic series', 'S_n=\\dfrac{n}{2}(a_1+a_n)'],
    ['Geometric series', 'S_n=a\\,\\dfrac{1-r^n}{1-r},\\qquad S_\\infty=\\dfrac{a}{1-r}\\ (|r|<1)'],
    ['AM–GM (nonnegative numbers)', '\\dfrac{a_1+\\cdots+a_n}{n}\\ge\\sqrt[n]{a_1\\cdots a_n}'],
    ['Logarithms', '\\log_b(xy)=\\log_bx+\\log_by,\\quad \\log_bx^k=k\\log_bx,\\quad \\log_bx=\\dfrac{\\log_ax}{\\log_ab}'],
    ['Sums of powers', '1+\\cdots+n=\\dfrac{n(n+1)}{2},\\quad 1^2+\\cdots+n^2=\\dfrac{n(n+1)(2n+1)}{6}'],
    ['Cubic identity', 'a^3+b^3+c^3-3abc=(a+b+c)(a^2+b^2+c^2-ab-bc-ca)'],
    ['Complex numbers', '|a+bi|=\\sqrt{a^2+b^2},\\qquad (\\cos\\theta+i\\sin\\theta)^n=\\cos n\\theta+i\\sin n\\theta']
  ],
  geo: [
    ['Triangle area', 'K=\\tfrac12bh=\\tfrac12ab\\sin C=rs=\\dfrac{abc}{4R}'],
    ['Heron’s formula', 'K=\\sqrt{s(s-a)(s-b)(s-c)},\\quad s=\\dfrac{a+b+c}{2}'],
    ['Equilateral triangle', 'K=\\dfrac{\\sqrt3}{4}s^2,\\qquad h=\\dfrac{\\sqrt3}{2}s'],
    ['Special right triangles', '45^\\circ\\text{-}45^\\circ\\text{-}90^\\circ:\\ 1:1:\\sqrt2\\qquad 30^\\circ\\text{-}60^\\circ\\text{-}90^\\circ:\\ 1:\\sqrt3:2'],
    ['Pythagorean triples', '3,4,5\\quad 5,12,13\\quad 8,15,17\\quad 7,24,25\\quad 20,21,29\\quad 9,40,41'],
    ['Inradius of a right triangle', 'r=\\dfrac{a+b-c}{2}'],
    ['Law of Cosines and Sines', 'c^2=a^2+b^2-2ab\\cos C,\\qquad \\dfrac{a}{\\sin A}=2R'],
    ['Polygons', '\\text{angle sum}=180(n-2),\\quad \\text{diagonals}=\\dfrac{n(n-3)}{2}'],
    ['Circles', 'A=\\pi r^2,\\ C=2\\pi r,\\ \\text{sector}=\\dfrac{\\theta}{360}\\pi r^2,\\ \\text{inscribed angle}=\\tfrac12\\text{arc}'],
    ['Chords and tangents', 'ab=cd\\ \\text{(chords)},\\qquad PT^2=PA\\cdot PB\\ \\text{(tangent and secant)}'],
    ['Similar figures', '\\text{length ratio }k\\Rightarrow\\text{area ratio }k^2,\\ \\text{volume ratio }k^3'],
    ['Solids', 'V_{\\text{cyl}}=\\pi r^2h,\\ V_{\\text{cone}}=\\tfrac13\\pi r^2h,\\ V_{\\text{sph}}=\\tfrac43\\pi r^3,\\ SA_{\\text{sph}}=4\\pi r^2'],
    ['Trigonometry', '\\sin^2\\theta+\\cos^2\\theta=1,\\quad \\sin2\\theta=2\\sin\\theta\\cos\\theta,\\quad \\cos2\\theta=2\\cos^2\\theta-1'],
    ['Coordinates', '\\text{area}=\\tfrac12\\left|x_1(y_2-y_3)+x_2(y_3-y_1)+x_3(y_1-y_2)\\right|']
  ],
  nt: [
    ['Divisors of $n=p_1^{e_1}\\cdots p_k^{e_k}$', '\\tau(n)=\\prod(e_i+1),\\qquad \\sigma(n)=\\prod\\dfrac{p_i^{e_i+1}-1}{p_i-1}'],
    ['GCD and LCM', '\\gcd(a,b)\\cdot\\operatorname{lcm}(a,b)=ab'],
    ['Divisibility rules', '3,9:\\text{ digit sum};\\quad 4:\\text{ last two digits};\\quad 8:\\text{ last three};\\quad 11:\\text{ alternating digit sum}'],
    ['Modular arithmetic', 'a\\equiv b\\Rightarrow a^k\\equiv b^k,\\qquad a^{p-1}\\equiv1\\pmod p\\ (p\\nmid a)'],
    ['Euler’s totient', '\\varphi(n)=n\\prod\\left(1-\\dfrac1p\\right),\\qquad a^{\\varphi(n)}\\equiv1\\pmod n\\ (\\gcd(a,n)=1)'],
    ['Trailing zeros of $n!$', '\\left\\lfloor\\dfrac n5\\right\\rfloor+\\left\\lfloor\\dfrac n{25}\\right\\rfloor+\\left\\lfloor\\dfrac n{125}\\right\\rfloor+\\cdots'],
    ['Units digit cycles', '2,3,7,8:\\ \\text{period }4\\qquad 4,9:\\ \\text{period }2\\qquad 0,1,5,6:\\ \\text{period }1'],
    ['Difference of squares', 'x^2-y^2=N\\Rightarrow (x-y)(x+y)=N\\ \\text{(same parity)}'],
    ['Number bases', '\\overline{abc}_b=ab^2+bb+c\\ \\text{(digits }a,b,c)']
  ],
  cp: [
    ['Permutations and combinations', 'P(n,k)=\\dfrac{n!}{(n-k)!},\\qquad \\dbinom nk=\\dfrac{n!}{k!(n-k)!}'],
    ['Arrangements with repeats', '\\dfrac{n!}{a!\\,b!\\cdots},\\qquad \\text{circular: }(n-1)!'],
    ['Stars and bars', '\\text{nonnegative: }\\dbinom{n+k-1}{k-1},\\qquad \\text{positive: }\\dbinom{n-1}{k-1}'],
    ['Pascal and the hockey stick', '\\dbinom nk=\\dbinom{n-1}{k-1}+\\dbinom{n-1}{k},\\quad \\sum_{i=r}^{n}\\dbinom ir=\\dbinom{n+1}{r+1}'],
    ['Binomial theorem', '(x+y)^n=\\sum_{k=0}^n\\dbinom nk x^{n-k}y^k,\\qquad \\sum_k\\dbinom nk=2^n'],
    ['Inclusion–exclusion', '|A\\cup B|=|A|+|B|-|A\\cap B|'],
    ['Derangements', 'D_n=n!\\sum_{k=0}^{n}\\dfrac{(-1)^k}{k!}\\quad(D_4=9,\\ D_5=44)'],
    ['Probability', 'P(A^c)=1-P(A),\\qquad P(A\\cap B)=P(A)P(B)\\ \\text{(independent)}'],
    ['Expected value', 'E[X]=\\sum xP(x),\\quad E[X+Y]=E[X]+E[Y],\\quad \\text{wait for first success: }\\dfrac1p'],
    ['Catalan numbers', 'C_n=\\dfrac{1}{n+1}\\dbinom{2n}{n}\\quad(1,1,2,5,14,42,\\ldots)']
  ]
};

Views.resources = () => {
  const formulas = CAT_KEYS.map((c, i) => `
    <details class="fsec" ${i === 0 ? 'open' : ''}><summary><i class="cdot c-${c}"></i>${CONFIG.cats[c].name}</summary>
      <dl class="formulas">${FORMULAS[c].map(([n, f]) => `<div><dt>${n.replace(/\$([^$]+)\$/g, '<span>$$$1$$</span>')}</dt><dd>$$${f}$$</dd></div>`).join('')}</dl></details>`).join('');
  const rows = [8, 10, 12].map(lv => { const e = CONFIG.exam[lv]; return `<tr><th scope="row">${e.name}</th><td>${e.questions}</td><td>${e.minutes} min</td><td>${lv === 8 ? '1 per correct, nothing else' : '6 per correct, 1.5 per blank, 0 per wrong'}</td><td>${e.max}</td><td>${e.grade}</td></tr>`; }).join('');
  const dates = CONFIG.contests.map(c => `<li><b>${c.name}</b>: ${U.niceDate(c.date)}${c.note ? ` (${c.note})` : ''}</li>`).join('');
  const html = `
    <h1>Resources</h1>
    <section aria-labelledby="r1"><h2 id="r1">The contests</h2>
      <div class="tablewrap"><table class="table"><thead><tr><th>Contest</th><th>Questions</th><th>Time</th><th>Scoring</th><th>Top score</th><th>Who can enter</th></tr></thead><tbody>${rows}</tbody></table></div>
      <p>No calculators on any of them. Dates for 2026–27:</p><ul class="plain">${dates}</ul>
      <p class="muted small">Dates and rules can change. Always confirm with the <a href="https://www.maa.org/AMC" target="_blank" rel="noopener">Mathematical Association of America</a>.</p></section>

    <section aria-labelledby="r2"><h2 id="r2">Should I guess?</h2>
      <div class="panel guess">
        <p>On the AMC 10 and 12 a blank is worth 1.5 points and a wrong answer 0, so a guess only pays when your odds beat 1 in 4. Choose how many answer choices you have left after crossing some out:</p>
        <div class="chips" role="group" aria-label="Choices remaining">${[5, 4, 3, 2].map(k => chip('guess', 'k', k, k + ' left', k === 5)).join('')}</div>
        <p id="guessout" class="verdict info" aria-live="polite"></p>
        <p class="muted small">On the AMC 8 there is no penalty and no credit for blanks, so always answer.</p>
      </div></section>

    <section aria-labelledby="r3"><h2 id="r3">Formula sheet</h2>${formulas}</section>

    <section aria-labelledby="r4"><h2 id="r4">How to get better</h2>
      <div class="read prose">
        <p><strong>Work the whole test once, then go back.</strong> On the AMC 10 and 12 you have about three minutes per question. Do the first ten quickly, bank the points you are sure of, then spend leftover time on the ones that need it.</p>
        <p><strong>Use the answer choices.</strong> Plug them in, estimate, or cross out the ones that cannot work. Choices are in increasing order, so the middle one is a good first test.</p>
        <p><strong>Draw a picture</strong> for every geometry problem, even when one is provided. Label every length you know.</p>
        <p><strong>After every test, redo what you missed</strong> without looking at the solution first. The Review page keeps those problems for you.</p>
        <p><strong>Mix topics, but fix weak spots.</strong> The Progress page shows which topics cost you the most.</p>
      </div></section>

    <section aria-labelledby="r5"><h2 id="r5">Real past exams</h2>
      <p>The problems here are original, written in the style of the contest. For official past exams with solutions, use these:</p>
      <ul class="plain">
        <li><a href="https://artofproblemsolving.com/wiki/index.php/AMC_8_Problems_and_Solutions" target="_blank" rel="noopener">AMC 8 problems and solutions</a></li>
        <li><a href="https://artofproblemsolving.com/wiki/index.php/AMC_10_Problems_and_Solutions" target="_blank" rel="noopener">AMC 10 problems and solutions</a></li>
        <li><a href="https://artofproblemsolving.com/wiki/index.php/AMC_12_Problems_and_Solutions" target="_blank" rel="noopener">AMC 12 problems and solutions</a></li>
        <li><a href="https://www.maa.org/AMC" target="_blank" rel="noopener">MAA: registration, dates and rules</a></li>
      </ul></section>

    <section aria-labelledby="r6"><h2 id="r6">About this site</h2>
      <p class="muted">${CONFIG.siteName} is an unofficial practice site. It is not affiliated with or endorsed by the Mathematical Association of America, which runs the AMC contests. All problems and solutions here are original. Your progress is saved only in this browser.</p></section>`;
  return {
    html, title: 'Resources',
    acts: {
      guess(el) {
        const k = +el.dataset.v, ev = 6 / k, better = ev > 1.5;
        U.$$('[data-act="guess"]').forEach(b => b.setAttribute('aria-pressed', b === el));
        U.$('#guessout').innerHTML = `With ${k} choices left, a guess is worth ${fmtNum(Math.round(ev * 100) / 100)} points on average, versus 1.5 for a blank. ${ev === 1.5 ? 'It is a tie.' : better ? '<strong>Guess.</strong>' : '<strong>Leave it blank</strong>, unless you have a hunch.'}`;
      }
    },
    mount(root) { U.$('[data-act="guess"]', root).click(); }
  };
};

/* ---------- Settings ---------- */
Views.settings = () => {
  const p = Store.profile;
  const html = `
    <h1>Settings</h1>
    <section class="panel settings">
      <div class="frow"><label class="flabel" for="s-level">Your contest</label>
        <select id="s-level" class="input" data-change="setting" data-k="level"><option value="8" ${p.level === 8 ? 'selected' : ''}>AMC 8</option><option value="10" ${p.level === 10 ? 'selected' : ''}>AMC 10</option><option value="12" ${p.level === 12 ? 'selected' : ''}>AMC 12</option></select></div>
      <div class="frow"><label class="flabel" for="s-goal">Daily goal</label>
        <input id="s-goal" class="input" type="number" min="1" max="100" value="${p.dailyGoal}" data-change="setting" data-k="dailyGoal"><span class="muted">problems per day</span></div>
      <div class="frow"><label class="flabel" for="s-target">Target date</label>
        <input id="s-target" class="input" type="date" value="${p.target}" data-change="setting" data-k="target"><span class="muted">Optional. Replaces the official contest date on the home page.</span></div>
      <div class="frow"><label class="flabel" for="s-theme">Theme</label>
        <select id="s-theme" class="input" data-change="setting" data-k="theme"><option value="auto" ${p.theme === 'auto' ? 'selected' : ''}>Match my device</option><option value="light" ${p.theme === 'light' ? 'selected' : ''}>Light</option><option value="dark" ${p.theme === 'dark' ? 'selected' : ''}>Dark</option></select></div>
      <div class="frow"><label class="flabel" for="s-font">Text size</label>
        <select id="s-font" class="input" data-change="setting" data-k="fontScale"><option value="1" ${p.fontScale === 1 ? 'selected' : ''}>Standard</option><option value="1.125" ${p.fontScale === 1.125 ? 'selected' : ''}>Large</option><option value="1.25" ${p.fontScale === 1.25 ? 'selected' : ''}>Extra large</option></select></div>
    </section>
    <h2>Your data</h2>
    <section class="panel settings">
      <p>Everything is stored in this browser only. Export a backup to move your progress to another device or keep it safe.</p>
      ${Store.persistent ? '' : '<p class="verdict no">This browser is blocking storage, so progress won’t be saved after you close the tab.</p>'}
      <div class="btnrow"><button type="button" class="btn" data-act="export">Export backup</button>
        <label class="btn ghost filebtn">Import backup<input type="file" accept="application/json,.json" data-change="import" class="sr"></label>
        <button type="button" class="btn danger" data-act="reset">Erase all progress</button></div>
    </section>`;
  return {
    html, title: 'Settings',
    changes: {
      setting(el) {
        const k = el.dataset.k; let v = el.value;
        if (k === 'level') v = +v; else if (k === 'fontScale') v = +v; else if (k === 'dailyGoal') v = Math.max(1, Math.min(100, Math.round(+v) || 5));
        Store.setProfile({ [k]: v });
        if (k === 'theme' || k === 'fontScale') App.applyPrefs();
        if (k === 'level') App.filters = null;
        U.toast('Saved.');
      },
      import(el) {
        const f = el.files[0]; if (!f) return;
        const fr = new FileReader();
        fr.onload = () => { try { Store.importJSON(fr.result); App.applyPrefs(); App.filters = null; U.toast('Backup imported.'); App.rerender(); } catch (e) { U.toast(e.message || 'Could not read that file.', 4500); } };
        fr.readAsText(f);
      }
    },
    acts: {
      export() {
        const blob = new Blob([Store.exportJSON()], { type: 'application/json' }), a = document.createElement('a');
        a.href = URL.createObjectURL(blob); a.download = 'amc-arena-backup.json'; document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      },
      reset() { if (confirm('Erase all progress, test history and starred problems on this device? This cannot be undone.')) { Store.reset(); App.applyPrefs(); App.filters = null; App.queue = null; U.toast('Progress erased.'); App.rerender(); } }
    }
  };
};
