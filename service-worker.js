/* ÜSTAD AKADEMİ SİTESİ — çevrimdışı servis çalışanı (88. madde) */
var SURUM = 'ustad-akademi-v1.6.3';
var CEKIRDEK = [
  './', 'index.html', 'site.css', 'akademi.css', 'canli.css', 'akademi-studyo.css',
  'akademi.js', 'akademi-kimlik.js', 'akademi-beyin.js', 'akademi-sinav.js',
  'akademi-proje.js', 'akademi-gorev.js', 'akademi-oyun.js', 'akademi-lab.js',
  'akademi-mentor.js', 'akademi-kariyer.js', 'akademi-harita.js', 'akademi-studyo.js',
  'akademi-veri.js', 'three.min.js', 'sahne3d.js', 'manifest.json',
  'foto/ustad-kenan.jpg', 'foto/rozet.png', 'foto/ikon-192.png', 'foto/ikon-512.png'
];
self.addEventListener('install', function (e) {
  self.skipWaiting();
  e.waitUntil(caches.open(SURUM).then(function (c) {
    return Promise.all(CEKIRDEK.map(function (u) { return c.add(u)['catch'](function () {}); }));
  }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.map(function (k) { return k === SURUM ? null : caches['delete'](k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(function (r) {
    return r || fetch(e.request).then(function (y) {
      var kopya = y.clone();
      caches.open(SURUM).then(function (c) { try { c.put(e.request, kopya); } catch (er) {} });
      return y;
    })['catch'](function () {
      return e.request.mode === 'navigate' ? caches.match('index.html') : undefined;
    });
  }));
});
