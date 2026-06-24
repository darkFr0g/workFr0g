/* Field Hub — single source for the app version + the in-header reload button.
   Loaded by every page (no build step). On each release, update APP_VERSION
   here AND CACHE_VERSION in sw.js — that's it; every page's header/footer
   version updates automatically. */
var APP_VERSION = 'v1.6.0';

(function () {
  // Styles for the header-right cluster (injected so we don't duplicate CSS per page).
  var css =
    '.hdr-right{margin-left:auto;display:flex;align-items:center;gap:10px;flex-shrink:0}' +
    '.hdr-right .reload-btn{background:none;border:none;color:rgba(255,255,255,.55);cursor:pointer;padding:4px;margin:0;display:flex;align-items:center;line-height:0;-webkit-tap-highlight-color:transparent}' +
    '.hdr-right .reload-btn:active{color:#fff}' +
    '.hdr-right .reload-btn svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}' +
    '.hdr-right .hdr-version{font-family:ui-monospace,"SF Mono",monospace;font-size:10px;font-weight:500;color:rgba(255,255,255,.5);letter-spacing:.04em;white-space:nowrap}' +
    '.status-dot{display:none!important}';
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  // Force-reload: clear caches then reload so the device pulls the latest deploy.
  function forceReload() {
    function go() { location.reload(); }
    // Only purge caches when online — keep the cached app intact for offline use.
    if (navigator.onLine && window.caches && caches.keys) {
      caches.keys()
        .then(function (ks) { return Promise.all(ks.map(function (k) { return caches.delete(k); })); })
        .then(go, go);
    } else {
      go();
    }
  }
  window.forceReload = forceReload;

  function build() {
    // Sync any footer version badges.
    var foots = document.querySelectorAll('.footer-version');
    for (var i = 0; i < foots.length; i++) foots[i].textContent = APP_VERSION;

    // Inject the reload button + version into the page header.
    var host = document.querySelector('.header-inner') || document.querySelector('.header');
    if (!host || host.querySelector('.hdr-right')) return;

    var dot = host.querySelector('.status-dot');
    if (dot && dot.parentNode) dot.parentNode.removeChild(dot);

    var wrap = document.createElement('div');
    wrap.className = 'hdr-right';

    var btn = document.createElement('button');
    btn.className = 'reload-btn';
    btn.type = 'button';
    btn.title = 'Reload latest';
    btn.setAttribute('aria-label', 'Reload latest');
    btn.innerHTML = '<svg viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>';
    btn.onclick = forceReload;

    var ver = document.createElement('span');
    ver.className = 'hdr-version';
    ver.textContent = APP_VERSION;

    wrap.appendChild(btn);
    wrap.appendChild(ver);
    host.appendChild(wrap);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
