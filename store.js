/* Everything the app remembers lives in this device's localStorage under one key. */
const Store = (() => {
  const KEY = 'amc-arena:v1';
  const defaults = () => ({
    v: 1,
    profile: { level: 10, theme: 'auto', dailyGoal: 5, target: '', showTimer: true, fontScale: 1 },
    probs: {},          // problem id -> { a: attempts, c: correct, last: 'c'|'w', t: time, bm: starred }
    log: [],            // one entry per answered question (capped)
    tests: [],          // finished mock tests
    active: null,       // mock test in progress
    drills: { n: 0, c: 0, best: 0 }
  });
  let data = load();
  let persistent = true;

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const d = JSON.parse(raw), b = defaults();
        return { ...b, ...d, profile: { ...b.profile, ...(d.profile || {}) }, drills: { ...b.drills, ...(d.drills || {}) } };
      }
    } catch (e) { /* storage blocked or corrupt: start fresh */ }
    return defaults();
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(data)); persistent = true; } catch (e) { persistent = false; } }

  const rec = id => data.probs[id] || null;
  function status(id) { const r = rec(id); return !r || !r.a ? 'new' : (r.last === 'c' ? 'solved' : 'missed'); }
  const isStarred = id => !!(rec(id) && rec(id).bm);
  function toggleStar(id) {
    const r = data.probs[id] || (data.probs[id] = { a: 0, c: 0, last: '', t: 0, bm: 0 });
    r.bm = r.bm ? 0 : 1; save(); return !!r.bm;
  }

  // e: { id, cat, lv, d, topic, ok, mode, secs, gen }
  function record(e) {
    const t = Date.now();
    data.log.push({ t, id: e.gen ? null : e.id, cat: e.cat, lv: e.lv || null, d: e.d, topic: e.topic, ok: e.ok ? 1 : 0, m: e.mode, s: Math.round(e.secs || 0), g: e.gen ? 1 : 0 });
    if (data.log.length > 4000) data.log.splice(0, data.log.length - 4000);
    if (e.gen) { data.drills.n++; if (e.ok) data.drills.c++; }
    else {
      const r = data.probs[e.id] || (data.probs[e.id] = { a: 0, c: 0, last: '', t: 0, bm: 0 });
      r.a++; if (e.ok) r.c++; r.last = e.ok ? 'c' : 'w'; r.t = t;
    }
    save();
  }

  function summary() {
    const by = fn => { const m = {}; for (const e of data.log) { const k = fn(e); if (k == null) continue; const o = m[k] || (m[k] = { n: 0, c: 0 }); o.n++; o.c += e.ok; } return m; };
    return {
      n: data.log.length, c: data.log.reduce((a, e) => a + e.ok, 0),
      cat: by(e => e.cat), lv: by(e => e.lv), d: by(e => (e.g ? null : e.d)), topic: by(e => e.cat + '|' + e.topic)
    };
  }
  function byDay() { const m = {}; for (const e of data.log) { const k = U.dayKey(new Date(e.t)); m[k] = (m[k] || 0) + 1; } return m; }
  const todayCount = () => byDay()[U.dayKey()] || 0;
  function streak() {
    const days = byDay(), d = new Date();
    if (!days[U.dayKey(d)]) d.setDate(d.getDate() - 1);
    let cur = 0;
    while (days[U.dayKey(d)]) { cur++; d.setDate(d.getDate() - 1); }
    let best = 0, run = 0, prev = null;
    for (const k of Object.keys(days).sort()) {
      const dt = new Date(k + 'T00:00:00');
      run = prev && Math.round((dt - prev) / 86400000) === 1 ? run + 1 : 1;
      best = Math.max(best, run); prev = dt;
    }
    return { cur, best };
  }

  function exportJSON() { return JSON.stringify(data); }
  function importJSON(text) {
    const d = JSON.parse(text), b = defaults();
    if (!d || typeof d !== 'object' || typeof d.probs !== 'object' || !Array.isArray(d.log) || !Array.isArray(d.tests)) throw new Error('That file is not an AMC Arena backup.');
    data = { ...b, ...d, profile: { ...b.profile, ...(d.profile || {}) }, drills: { ...b.drills, ...(d.drills || {}) } };
    save();
  }
  function reset() { data = defaults(); save(); }

  return {
    get data() { return data; },
    get profile() { return data.profile; },
    get persistent() { return persistent; },
    setProfile(patch) { Object.assign(data.profile, patch); save(); },
    rec, status, isStarred, toggleStar, record, summary, byDay, todayCount, streak,
    get tests() { return data.tests; },
    addTest(t) { data.tests.unshift(t); if (data.tests.length > 60) data.tests.length = 60; save(); },
    get active() { return data.active; },
    setActive(a) { data.active = a; save(); },
    bestDrillStreak(n) { if (n > data.drills.best) { data.drills.best = n; save(); } },
    exportJSON, importJSON, reset, save
  };
})();
