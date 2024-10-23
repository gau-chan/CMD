const CACHE_NAME = 'cmd-prompt-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/style.css',
  '/script.js'
];

// インストールイベントでキャッシュにファイルを追加
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// fetchイベントでGETリクエストのみキャッシュ処理
self.addEventListener('fetch', function(event) {
  // POSTリクエストはキャッシュせず、そのままネットワークに送信
  if (event.request.method !== 'GET') {
    return; // POSTリクエストは処理しない
  }

  // GETリクエストの場合のみキャッシュから応答する
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // キャッシュがあればキャッシュからレスポンス、なければネットワークから取得
        return response || fetch(event.request);
      })
  );
});

// 古いキャッシュを削除する
self.addEventListener('activate', function(event) {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
