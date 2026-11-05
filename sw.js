/* Service worker del tablero de deuda · APN
   Precarga el tablero y el informe para que la app abra sin conexión.
   La versión del caché se cambia en cada publicación: al activarse,
   borra las anteriores y toma el control de las pestañas abiertas. */
const VERSION = 'deuda-apn-2026-10-31';
const ASSETS = [
  './',
  './index.html',
  './informe-deudas-31oct26.pdf',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './favicon.ico'
];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(VERSION);
    // uno por uno: si un recurso opcional falla, la instalación no se cae
    await Promise.all(ASSETS.map(u => c.add(new Request(u, { cache: 'reload' })).catch(() => {})));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', e => {
  if (e.data === 'skipWaiting') self.skipWaiting();
});

/* Navegaciones: red primero (para tomar la versión nueva), caché como respaldo.
   Resto de los archivos: caché primero, y se refresca en segundo plano. */
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      try {
        const net = await fetch(req);
        const c = await caches.open(VERSION);
        c.put('./index.html', net.clone());
        return net;
      } catch (_) {
        return (await caches.match('./index.html')) || Response.error();
      }
    })());
    return;
  }

  e.respondWith((async () => {
    const hit = await caches.match(req, { ignoreSearch: true });
    if (hit) {
      fetch(req).then(r => {
        if (r && r.ok) caches.open(VERSION).then(c => c.put(req, r));
      }).catch(() => {});
      return hit;
    }
    try {
      const net = await fetch(req);
      if (net && net.ok) (await caches.open(VERSION)).put(req, net.clone());
      return net;
    } catch (_) {
      return Response.error();
    }
  })());
});
