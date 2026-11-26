// Service worker do portal: só cuida da página inicial (pra abrir mesmo sem internet).
// Não mexe em nada dos jogos (/forma-palavras/, /pe-na-tabua/), que têm o próprio jeito de funcionar.
const CACHE = 'portal-v4';
const ARQUIVOS = ['/', '/index.html', '/hub.js', '/manifest.json', '/icone-192.png', '/icone-512.png', '/apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARQUIVOS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin || !ARQUIVOS.includes(url.pathname)) return;   // o resto passa direto
  // internet primeiro (pega sempre a versão nova); sem internet, usa a guardada
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(k => k.put(e.request, c)); return r; })
    .catch(() => caches.match(e.request).then(r => r || caches.match('/'))));
});
