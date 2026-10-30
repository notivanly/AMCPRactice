/* App shell: routing, event delegation, theme and preferences. Loaded last. */
const App = {
  acts: {}, inputs: {}, changes: {}, onKey: null, cleanups: [],
  queue: null,        // list of problem ids being worked through (practice, review)
  filters: null, drill: null, drillCfg: null, testCfg: null, reviewTab: 'missed',
  getFilters() { return this.filters || (this.filters = { lv: String(Store.profile.level), cat: 'all', diff: 'all', status: 'all', q: '' }); },
  rerender() { render(true); },
  applyPrefs() {
    const p = Store.profile, mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : { matches: false };
    const dark = p.theme === 'dark' || (p.theme === 'auto' && mq.matches);
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    document.documentElement.style.setProperty('--fs', p.fontScale || 1);
    const meta = document.querySelector('meta[name="theme-color"]'); if (meta) meta.content = dark ? '#12181b' : '#eef2f0';
    const btn = document.getElementById('themeBtn');
    if (btn) { btn.innerHTML = U.icon(dark ? 'sun' : 'moon', 20); btn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme'); }
  }
};

const ROUTES = [
  [/^\/?$/, () => Views.home()],
  [/^\/practice\/?$/, () => Views.practice()],
  [/^\/problem\/([\w-]+)\/?$/, id => Views.problem(id)],
  [/^\/tests\/?$/, () => Views.tests()],
  [/^\/test\/run\/?$/, () => Views.testRun()],
  [/^\/test\/results\/([\w-]+)\/?$/, id => Views.testResults(id)],
  [/^\/drills\/?$/, () => Views.drills()],
  [/^\/review\/?$/, () => Views.review()],
  [/^\/progress\/?$/, () => Views.progress()],
  [/^\/resources\/?$/, () => Views.resources()],
  [/^\/settings\/?$/, () => Views.settings()]
];

const mainEl = document.getElementById('main');

function setActiveNav(path) {
  const key = path.startsWith('/problem') ? '/practice' : path.startsWith('/test') ? '/tests' : '/' + (path.split('/')[1] || '');
  U.$$('[data-nav]').forEach(a => { if (a.dataset.nav === key) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  const s = document.getElementById('settingsBtn'); if (s) { if (path.startsWith('/settings')) s.setAttribute('aria-current', 'page'); else s.removeAttribute('aria-current'); }
}

function render(keepScroll) {
  App.cleanups.forEach(f => { try { f(); } catch (e) { /* ignore */ } });
  App.cleanups = []; App.onKey = null;
  const path = (location.hash.replace(/^#/, '') || '/').split('?')[0];
  let view = null;
  for (const [re, fn] of ROUTES) { const m = path.match(re); if (m) { view = fn(...m.slice(1)); break; } }
  if (!view) view = Views.notFound();
  App.acts = view.acts || {}; App.inputs = view.inputs || {}; App.changes = view.changes || {};
  const y = window.scrollY;
  mainEl.innerHTML = view.html;
  if (view.mount) view.mount(mainEl);
  U.typeset(mainEl);
  document.title = (view.title ? view.title + ' | ' : '') + CONFIG.siteName;
  setActiveNav(path);
  if (keepScroll) window.scrollTo(0, y); else { window.scrollTo(0, 0); mainEl.focus({ preventScroll: true }); }
}

mainEl.addEventListener('click', e => {
  const el = e.target.closest('[data-act]'); if (!el || !mainEl.contains(el)) return;
  const fn = App.acts[el.dataset.act]; if (fn) fn(el, e);
});
mainEl.addEventListener('input', e => {
  const el = e.target.closest('[data-input]'); if (el && App.inputs[el.dataset.input]) App.inputs[el.dataset.input](el, e);
});
mainEl.addEventListener('change', e => {
  const el = e.target.closest('[data-change]'); if (el && App.changes[el.dataset.change]) App.changes[el.dataset.change](el, e);
});
document.addEventListener('keydown', e => {
  if (!App.onKey || e.ctrlKey || e.metaKey || e.altKey) return;
  const t = e.target;
  if (t && t.closest && t.closest('input, textarea, select, [contenteditable="true"]')) return;
  if (e.key === 'Enter' && t && t.closest && t.closest('a, button') && !t.closest('.choice')) return;
  App.onKey(e);
});

document.getElementById('themeBtn').addEventListener('click', () => {
  const dark = document.documentElement.getAttribute('data-theme') === 'dark';
  Store.setProfile({ theme: dark ? 'light' : 'dark' }); App.applyPrefs();
});
if (window.matchMedia) {
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  const onChange = () => { if (Store.profile.theme === 'auto') App.applyPrefs(); };
  mq.addEventListener ? mq.addEventListener('change', onChange) : mq.addListener && mq.addListener(onChange);
}
window.addEventListener('hashchange', () => render(false));
App.applyPrefs();
render(false);
