/* Privacy hooks for the whole site. Loaded first on every page (<script src="/privacy.js">).
 *
 * What this site actually does with data: it stores game progress in the visitor's own browser
 * (localStorage keys that start with "studygame_"). Nothing is sent anywhere. There are no cookies,
 * no analytics, no ads, no social pixels, no external fonts and no AI services.
 *
 * Because there is nothing to track, this file does four jobs:
 *   HOOK 1  Global Privacy Control (GPC): read the browser's signal and treat it as an opt-out.
 *   HOOK 2  Consent gate: Privacy.allowed(category) / Privacy.loadScript(). Any optional script added in
 *           the future MUST be loaded through loadScript so it cannot run before opt-in (and never under GPC).
 *   HOOK 3  Retention: saved progress is deleted automatically after 365 days without a visit.
 *   HOOK 4  Data-subject tools: export and delete everything this site keeps in the browser.
 * Plus a small, non-blocking privacy notice (shown once). No personal data, passwords or tokens are
 * ever written to localStorage or the console by this site.
 */
(function (w, d) {
  'use strict';
  var PREFIX = 'studygame_';        // game progress and settings (no personal data)
  var META = 'privacy_meta';        // this file's own record: last visit, notice acknowledged, optional opt-ins
  var MAX_IDLE_DAYS = 365;          // HOOK 3: retention limit
  var CATEGORIES = ['analytics', 'marketing', 'ai']; // optional categories: all OFF by default

  var store = null;
  try { store = w.localStorage; } catch (e) { store = null; }

  // HOOK 1: Global Privacy Control. (A static host cannot read the Sec-GPC request header, so we read the
  // same signal in the browser: navigator.globalPrivacyControl.)
  var GPC = w.navigator && w.navigator.globalPrivacyControl === true;

  function readMeta() {
    var m = null;
    try { m = JSON.parse(store.getItem(META)); } catch (e) { m = null; }
    if (!m || typeof m !== 'object') m = {};
    if (!m.optional || typeof m.optional !== 'object') m.optional = {};
    return m;
  }
  function writeMeta(m) { try { if (store) store.setItem(META, JSON.stringify(m)); } catch (e) { /* storage unavailable: nothing to do */ } }
  function gameKeys() {
    var out = [];
    if (!store) return out;
    try { for (var i = 0; i < store.length; i++) { var k = store.key(i); if (k && k.indexOf(PREFIX) === 0) out.push(k); } } catch (e) { /* ignore */ }
    return out;
  }

  var meta = readMeta();

  // HOOK 3: automatic retention clean-up. Runs on every page load, before any game reads its saved data.
  (function retention() {
    var now = Date.now(), last = meta.lastSeen ? Date.parse(meta.lastSeen) : NaN;
    if (!isNaN(last) && now - last > MAX_IDLE_DAYS * 86400000) {
      gameKeys().forEach(function (k) { try { store.removeItem(k); } catch (e) { /* ignore */ } });
      meta.optional = {};
      delete meta.noticeAck;
    }
    meta.lastSeen = new Date(now).toISOString();
    writeMeta(meta);
  })();

  var Privacy = {
    gpc: GPC,
    // HOOK 2: consent gate. Essential functions need no consent. Optional categories need an explicit opt-in
    // AND no GPC signal.
    allowed: function (category) {
      if (CATEGORIES.indexOf(category) < 0) return false;
      return !GPC && readMeta().optional[category] === true;
    },
    grant: function (category) {
      if (GPC || CATEGORIES.indexOf(category) < 0) return false;
      var m = readMeta(); m.optional[category] = true; writeMeta(m); return true;
    },
    revoke: function (category) { var m = readMeta(); delete m.optional[category]; writeMeta(m); },
    // The only approved way to add an optional third-party script. Returns false (and loads nothing) without opt-in.
    loadScript: function (src, category) {
      if (!Privacy.allowed(category)) return false;
      var s = d.createElement('script'); s.src = src; s.async = true; d.head.appendChild(s); return true;
    },
    // HOOK 4: data-subject tools (used on /privacy-requests/).
    exportData: function () {
      var out = { exportedAt: new Date().toISOString(), note: 'Everything this site keeps in your browser. Nothing is stored on a server.', data: {} };
      gameKeys().forEach(function (k) { try { out.data[k] = JSON.parse(store.getItem(k)); } catch (e) { out.data[k] = store.getItem(k); } });
      out.privacy = readMeta();
      return out;
    },
    deleteData: function () {
      gameKeys().forEach(function (k) { try { store.removeItem(k); } catch (e) { /* ignore */ } });
      try { store.removeItem(META); } catch (e) { /* ignore */ }
    },
    resetNotice: function () { var m = readMeta(); delete m.noticeAck; writeMeta(m); }
  };
  w.Privacy = Privacy;

  // Privacy notice: non-blocking, shown once. It is a notice, not a consent wall, because nothing optional exists.
  function showNotice() {
    if (readMeta().noticeAck || d.getElementById('pv-notice')) return;
    var css = d.createElement('style');
    css.textContent = '#pv-notice{position:fixed;left:12px;right:12px;bottom:12px;z-index:100;max-width:640px;margin:0 auto;padding:12px 14px;border:2px solid #3d4380;border-radius:12px;background:#181b36;color:#f3f4fb;font:600 14px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;box-shadow:0 4px 0 #0007}#pv-notice p{margin:0 0 8px}#pv-notice a{color:#ffb454}#pv-notice button{font:inherit;font-weight:800;padding:6px 14px;border-radius:8px;border:2px solid #7ef7c1;background:#0b0d1c;color:#7ef7c1;cursor:pointer}#pv-notice button:focus-visible,#pv-notice a:focus-visible{outline:3px solid #ffe66d;outline-offset:2px}';
    var box = d.createElement('div'); box.id = 'pv-notice'; box.setAttribute('role', 'region'); box.setAttribute('aria-label', 'Privacy notice');
    var p = d.createElement('p');
    p.innerHTML = 'This site uses <b>no cookies and no trackers</b>. Your progress is saved only in this browser. ' +
      (GPC ? 'Your browser sent a Global Privacy Control signal; we honor it (and there is nothing sold or shared). ' : '') +
      '<a href="/privacy-policy/">Privacy policy</a> · <a href="/privacy-requests/">Your data</a>';
    var b = d.createElement('button'); b.type = 'button'; b.textContent = 'Got it';
    b.onclick = function () { var m = readMeta(); m.noticeAck = new Date().toISOString(); writeMeta(m); box.remove(); };
    box.appendChild(p); box.appendChild(b); d.head.appendChild(css); d.body.appendChild(box);
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', showNotice); else showNotice();
})(window, document);
