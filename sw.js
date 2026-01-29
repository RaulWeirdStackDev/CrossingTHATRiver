const CACHE_NAME = 'crossing-that-river-v1';
const urlsToCache = [
  './',
  //intro y app
  './index.html',
  './introStyle.css',
  './manifest.json',
  './modal.js',


  //pwa icons
  './pwa/icon-192.png',
  './pwa/icon-512.png',

  //assets
  './assets/img/boat.png',
  './assets/img/btnBack.png',
  './assets/img/btnScore.png',
  './assets/img/btnStart.png',
  './assets/img/btnStart2.png',
  './assets/img/defeatS.png',
  './assets/img/defeatW.png',
  './assets/img/farmer.png',
  './assets/img/hiScores.png',
  './assets/img/intro.png',
  './assets/img/instrucciones.png',
  './assets/img/lettuce.png',
  './assets/img/river.png',
  './assets/img/riverDesktop.png',
  './assets/img/sheep.png',
  './assets/img/victory.png',
  './assets/img/wolf.png',

  // Game
  './game/game.html',
  './game/gameStyle.css',
  './game/gameScript.js',
  
  // Score
  './score/hiScores.html',
  './score/scoreStyle.css',
];

// Instalación: cachear todos los recursos
self.addEventListener('install', (event) => {
  console.log('Service Worker: Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Cacheando archivos');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: Todos los archivos cacheados');
        return self.skipWaiting(); // Activar inmediatamente
      })
      .catch((error) => {
        console.error('Service Worker: Error al cachear:', error);
      })
  );
});

// Activación: limpiar cachés antiguos
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activando...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Eliminando caché antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activado y reclamando clientes');
      return self.clients.claim(); // Tomar control inmediato
    })
  );
});

// Fetch: estrategia Cache First con Network Fallback
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Si está en caché, devolverlo
        if (cachedResponse) {
          console.log('Service Worker: Sirviendo desde caché:', event.request.url);
          return cachedResponse;
        }
        
        // Si no está en caché, intentar obtenerlo de la red
        console.log('Service Worker: Obteniendo de la red:', event.request.url);
        return fetch(event.request)
          .then((networkResponse) => {
            // Opcionalmente, cachear la respuesta de red
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone);
              });
            }
            return networkResponse;
          })
          .catch((error) => {
            console.error('Service Worker: Error de red:', error);
            // Aquí podrías devolver una página offline personalizada
            // return caches.match('/offline.html');
          });
      })
  );
});