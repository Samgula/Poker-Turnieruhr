// Offline-Cache: alles wird beim ersten Öffnen gespeichert, danach läuft die App ohne Internet
const CACHE = 'turnieruhr-6a46f08e1c';
const FILES = ["./", "index.html", "manifest.webmanifest", "icon-180.png", "icon-192.png", "icon-512.png", "fonts/fonts.css", "fonts/Barlow-400.woff2", "fonts/Barlow-500.woff2", "fonts/Barlow-600.woff2", "fonts/BarlowCondensed-500.woff2", "fonts/BarlowCondensed-600.woff2", "fonts/BarlowCondensed-700.woff2"];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  // Seite: erst Netz (für Updates), sonst Cache. Rest: erst Cache.
  if (e.request.mode === 'navigate') { e.respondWith(fetch(e.request, {cache: 'no-store'}).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put('index.html', c)); return r; }).catch(() => caches.match('index.html'))); return; }
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
