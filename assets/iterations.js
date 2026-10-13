// Iteration list + floating switcher. Add new versions here; the overview page and the switcher both read it.
window.ITERATIONS = [
  {
    id: 'v1',
    title: 'Editorial',
    date: '11.10.2026',
    path: 'v1/index.html',
    desc: 'One-Pager mit grossen Bildern, Serif-Typografie (Instrument Serif), Wein-Selector mit Farb-Halo, Nacht-Thema.'
  },
  {
    id: 'v2',
    title: 'Erich-Meier-Stil',
    date: '11.10.2026',
    path: 'v2/index.html',
    desc: 'Vollbild-Slides mit Schlagworten und drehender Flasche, Unterseiten Weingut / Weine / Kontakt, Wein-Overlay, schlichte Grotesk.'
  }
];

(function () {
  const script = document.currentScript;
  if (!script || script.dataset.switcher === 'off' || window.self !== window.top) return;
  // Online the switcher stays hidden unless the link carries ?versionen (remembered for the tab session)
  const local = ['localhost', '127.0.0.1', ''].includes(location.hostname);
  let forced = /[?&]versionen\b/.test(location.search);
  try { if (forced) sessionStorage.setItem('uh-versionen', '1'); forced = forced || sessionStorage.getItem('uh-versionen') === '1'; } catch (e) {}
  if (!local && !forced) return;
  const root = new URL('..', script.src);            // project root (assets/ lives one level down)
  const here = location.href;
  const current = window.ITERATIONS.find(it => here.startsWith(new URL(it.path.split('/')[0] + '/', root).href));

  const css = `
    .it-switch{position:fixed;left:16px;bottom:16px;z-index:2147483000;display:flex;align-items:center;gap:2px;
      padding:4px;border-radius:999px;background:rgba(20,20,20,.82);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);
      font:500 11px/1 system-ui,-apple-system,sans-serif;letter-spacing:.06em;box-shadow:0 6px 24px rgba(0,0,0,.25)}
    .it-switch a{color:rgba(255,255,255,.7);text-decoration:none;padding:7px 10px;border-radius:999px;white-space:nowrap}
    .it-switch a:hover{color:#fff;background:rgba(255,255,255,.12)}
    .it-switch a.on{background:#fff;color:#111}
    .it-switch .it-sep{width:1px;height:14px;background:rgba(255,255,255,.2);margin:0 4px}
    @media print{.it-switch{display:none}}`;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const nav = document.createElement('nav');
  nav.className = 'it-switch';
  nav.setAttribute('aria-label', 'Iterationen');
  nav.innerHTML =
    `<a href="${new URL('iterationen.html', root).href}" title="Alle Iterationen">☰ Übersicht</a><span class="it-sep"></span>` +
    window.ITERATIONS.map(it =>
      `<a href="${new URL(it.path, root).href}" class="${current && current.id === it.id ? 'on' : ''}" title="${it.title}">${it.id}</a>`
    ).join('');
  const mount = () => document.body.appendChild(nav);
  document.body ? mount() : addEventListener('DOMContentLoaded', mount);
})();
