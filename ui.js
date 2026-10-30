/* The problem card: one component used by practice, drills, mock tests and review. */
const UI = (() => {
  const LET = 'ABCDE';

  const dots = d => `<span class="dots" role="img" aria-label="Difficulty ${d} of 5" title="Difficulty ${d} of 5">${[1, 2, 3, 4, 5].map(i => `<i class="${i <= d ? 'on' : ''}"></i>`).join('')}</span>`;
  const catTag = cat => `<span class="tag"><i class="cdot c-${cat}"></i>${CONFIG.cats[cat].name}</span>`;
  const lvTag = p => `<span class="tag lv">${p.lv ? 'AMC ' + p.lv : 'Drill'}</span>`;

  function cardHTML(p, o) {
    const mode = o.mode || 'practice';
    const star = o.bookmarkable
      ? `<button type="button" class="star" data-star aria-pressed="${Store.isStarred(p.id)}" aria-label="Star this problem" title="Star for later">${U.icon('star', 20)}</button>` : '';
    const choices = p.ch.map((c, i) => `
      <div class="crow">
        <button type="button" class="choice" data-i="${i}" aria-pressed="false" aria-label="Choice ${LET[i]}"><span class="bubble">${LET[i]}</span><span class="ctext">$${c}$</span></button>
        <button type="button" class="elim" data-e="${i}" aria-pressed="false" aria-label="Cross out choice ${LET[i]}" title="Cross out this choice">&times;</button>
      </div>`).join('');
    const actions = mode === 'practice' || mode === 'drill' ? `
      <div class="pactions">
        <button type="button" class="btn ghost sm" data-hint>Hint</button>
        <button type="button" class="btn ghost sm" data-reveal>Show solution</button>
        <button type="button" class="btn primary" data-check disabled>Check answer</button>
      </div>` : '';
    return `
    <article class="pcard ${o.num ? 'has-num' : ''}">
      <header class="pmeta">
        <div class="tags">${o.num ? `<span class="qnum" aria-label="Question ${o.num}">${o.num}</span>` : ''}${lvTag(p)}${mode === 'exam' ? '' : `${catTag(p.cat)}<span class="tag soft">${U.esc(p.topic)}</span>`}</div>
        <div class="pmeta-r">${mode === 'exam' ? '' : dots(p.d)}${star}</div>
      </header>
      <div class="ptext read">${U.rich(p.q)}${p.fig ? `<div class="fig">${p.fig}</div>` : ''}</div>
      <div class="choices" role="group" aria-label="Answer choices">${choices}</div>
      ${actions}
      <div class="hintbox read" hidden><strong>Hint.</strong> ${U.inline(p.hint || '')}</div>
      <div class="fb" aria-live="polite"></div>
      <section class="solution read" hidden><h3>Solution</h3>${U.rich(p.sol)}</section>
    </article>`;
  }

  /* Mounts a card into `root`. Options:
       mode: 'practice' | 'drill' | 'exam' | 'review'
       pick: initial pick (exam resume / review)   num: question number (exam)
       onAttempt(ok, pick, secs)  first check or reveal      onDone(ok, tries)  question finished
       onPick(pick)               exam: pick changed
     Returns a small API so views can add keyboard shortcuts. Typesetting is left to the caller. */
  function mountCard(root, p, o = {}) {
    const mode = o.mode || 'practice';
    root.innerHTML = cardHTML(p, o);
    const el = root.querySelector('.pcard');
    const btns = Array.from(el.querySelectorAll('.choice')), elims = Array.from(el.querySelectorAll('.elim'));
    const checkBtn = el.querySelector('[data-check]'), hintBtn = el.querySelector('[data-hint]'), revealBtn = el.querySelector('[data-reveal]');
    const fb = el.querySelector('.fb'), sol = el.querySelector('.solution'), hintBox = el.querySelector('.hintbox');
    let picked = o.pick == null ? null : o.pick, done = mode === 'review', tries = 0, attempted = false;
    const t0 = Date.now(), struck = new Set(), wrongSet = new Set();

    function paint() {
      btns.forEach((b, i) => {
        b.setAttribute('aria-pressed', picked === i ? 'true' : 'false');
        b.classList.toggle('sel', picked === i && !done);
        b.classList.toggle('out', struck.has(i));
        b.classList.toggle('correct', done && i === p.a);
        b.classList.toggle('wrong', done && picked === i && i !== p.a);
        b.classList.toggle('missed', !done && wrongSet.has(i));
        b.disabled = done || wrongSet.has(i);
        elims[i].classList.toggle('on', struck.has(i));
        elims[i].setAttribute('aria-pressed', struck.has(i) ? 'true' : 'false');
        elims[i].disabled = done || wrongSet.has(i);
      });
      if (checkBtn) checkBtn.disabled = picked === null || done;
      if (revealBtn) revealBtn.disabled = done;
    }

    function choose(i) {
      if (done || wrongSet.has(i)) return;
      if (mode === 'exam') { picked = picked === i ? null : i; if (o.onPick) o.onPick(picked); }
      else picked = i;
      struck.delete(i); paint();
    }

    function finish(ok) {
      done = true;
      if (mode === 'review') {
        fb.innerHTML = picked === null ? `<div class="verdict info">You left this blank. The answer is (${LET[p.a]}).</div>`
          : picked === p.a ? `<div class="verdict ok">You answered (${LET[picked]}), which is correct.</div>`
          : `<div class="verdict no">You answered (${LET[picked]}). The answer is (${LET[p.a]}).</div>`;
      } else {
        fb.innerHTML = ok ? `<div class="verdict ok">${tries <= 1 ? 'Correct.' : 'Correct on the second try.'}</div>`
                          : `<div class="verdict no">The answer is (${LET[p.a]}).</div>`;
      }
      sol.hidden = false; hintBox.hidden = true; paint();
    }

    function check() {
      if (done || picked === null || mode === 'exam') return;
      const secs = (Date.now() - t0) / 1000, ok = picked === p.a;
      if (!attempted) { attempted = true; if (o.onAttempt) o.onAttempt(ok, picked, secs); }
      tries++;
      if (ok || tries >= 2) { finish(ok); if (o.onDone) o.onDone(ok, tries); }
      else {
        wrongSet.add(picked); struck.add(picked);
        fb.innerHTML = `<div class="verdict no">Not quite. Choice (${LET[picked]}) is crossed out. Try again, or <button type="button" class="linklike" data-reveal2>show the solution</button>.</div>`;
        picked = null; paint();
      }
    }

    function reveal() {
      if (done || mode === 'exam') return;
      if (!attempted) { attempted = true; if (o.onAttempt) o.onAttempt(false, null, (Date.now() - t0) / 1000); }
      finish(false); if (o.onDone) o.onDone(false, tries);
    }

    btns.forEach((b, i) => b.addEventListener('click', () => choose(i)));
    elims.forEach((b, i) => b.addEventListener('click', () => { if (done || wrongSet.has(i)) return; struck.has(i) ? struck.delete(i) : struck.add(i); if (picked === i) { picked = null; if (mode === 'exam' && o.onPick) o.onPick(null); } paint(); }));
    if (checkBtn) checkBtn.addEventListener('click', check);
    if (revealBtn) revealBtn.addEventListener('click', reveal);
    if (hintBtn) hintBtn.addEventListener('click', () => { if (!done) { hintBox.hidden = !hintBox.hidden; hintBtn.textContent = hintBox.hidden ? 'Hint' : 'Hide hint'; } });
    fb.addEventListener('click', e => { if (e.target.closest('[data-reveal2]')) reveal(); });
    const star = el.querySelector('[data-star]');
    if (star) star.addEventListener('click', () => { const on = Store.toggleStar(p.id); star.setAttribute('aria-pressed', on); U.toast(on ? 'Starred. Find it under Review.' : 'Star removed.'); });

    if (mode === 'review') { finish(picked === p.a); }
    paint();
    return {
      el, choose, check, reveal,
      hint() { if (hintBtn) hintBtn.click(); },
      star() { if (star) star.click(); },
      isDone: () => done, getPick: () => picked,
      handleKey(e) {            // shared keyboard shortcuts; returns true when handled
        const k = e.key.toLowerCase(), idx = 'abcde'.indexOf(k) >= 0 && k.length === 1 ? 'abcde'.indexOf(k) : '12345'.indexOf(k) >= 0 && k.length === 1 ? '12345'.indexOf(k) : -1;
        if (idx >= 0) { choose(idx); return true; }
        if (k === 'enter' && !done && picked !== null && mode !== 'exam') { check(); return true; }
        if (k === 'h' && hintBtn) { hintBtn.click(); return true; }
        if (k === 's' && star) { star.click(); return true; }
        return false;
      }
    };
  }

  // A compact row for problem lists (practice browser, review).
  function statusBadge(id) {
    const s = Store.status(id);
    const map = { new: ['New', ''], solved: ['Solved', U.icon('check', 14)], missed: ['Missed last time', U.icon('x', 14)] };
    return `<span class="pstat s-${s}" title="${map[s][0]}" aria-label="${map[s][0]}">${map[s][1]}</span>`;
  }
  function problemRow(p) {
    return `<a class="prow" href="#/problem/${p.id}" data-act="open" data-id="${p.id}">
      ${statusBadge(p.id)}
      <span class="pmain"><b>${U.esc(p.topic)}</b><span class="muted">${CONFIG.cats[p.cat].name}</span></span>
      ${Store.isStarred(p.id) ? `<span class="starred" title="Starred" aria-label="Starred">${U.icon('star', 14)}</span>` : ''}
      <span class="tag lv">AMC ${p.lv}</span>${dots(p.d)}
    </a>`;
  }

  return { dots, catTag, cardHTML, mountCard, problemRow, statusBadge, LET };
})();
