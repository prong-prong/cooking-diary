const CACHE = 'cooking-diary-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/data.js',
  '/ingredients.html',
  '/manifest.json',
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // API 요청은 서비스워커가 건드리지 않음 (항상 네트워크, 캐시 안 함)
  if (url.pathname.startsWith('/api/')) return;
  if (e.request.method !== 'GET') return;

  // 네트워크 우선 → 배포가 바로 반영됨. 실패 시 캐시 폴백(오프라인 대비)
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
