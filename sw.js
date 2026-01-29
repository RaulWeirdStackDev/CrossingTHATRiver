const CACHE_NAME = 'crossing-that-river-v2'; // ⚠️ Cambiado a v2 para forzar actualización
const API_URL = 'https://riverbackend.onrender.com';

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

// ═══════════════════════════════════════════════════════════
// INSTALACIÓN: Cachear archivos estáticos
// ═══════════════════════════════════════════════════════════
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Instalando v2...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Service Worker: Cacheando archivos estáticos');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ Service Worker: Archivos cacheados exitosamente');
        return self.skipWaiting(); // Activar inmediatamente
      })
      .catch((error) => {
        console.error('❌ Service Worker: Error al cachear:', error);
      })
  );
});

// ═══════════════════════════════════════════════════════════
// ACTIVACIÓN: Limpiar cachés antiguos
// ═══════════════════════════════════════════════════════════
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker: Activando...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Service Worker: Eliminando caché antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker: Activado y reclamando clientes');
      return self.clients.claim();
    })
  );
});

// ═══════════════════════════════════════════════════════════
// FETCH: Estrategia híbrida
// ═══════════════════════════════════════════════════════════
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // ────────────────────────────────────────────────
  // 🚨 REGLA CRÍTICA: NUNCA cachear la API del backend
  // ────────────────────────────────────────────────
  if (url.origin === API_URL || request.url.includes('riverbackend.onrender.com')) {
    console.log('🌐 Service Worker: Petición a API - SIEMPRE desde red:', request.url);
    
    event.respondWith(
      fetch(request)
        .then(response => {
          console.log('✅ Service Worker: Respuesta de API recibida');
          return response;
        })
        .catch(error => {
          console.error('❌ Service Worker: Error en API:', error);
          // Respuesta de error para modo offline
          return new Response(
            JSON.stringify({ 
              error: 'Sin conexión a internet',
              offline: true 
            }),
            { 
              status: 503,
              statusText: 'Service Unavailable',
              headers: { 
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store'
              }
            }
          );
        })
    );
    return; // ⚠️ IMPORTANTE: Salir aquí para no cachear
  }

  // ────────────────────────────────────────────────
  // 📦 Cache First para archivos estáticos
  // ────────────────────────────────────────────────
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          console.log('📦 Service Worker: Desde caché:', request.url);
          return cachedResponse;
        }
        
        console.log('🌐 Service Worker: Descargando:', request.url);
        return fetch(request)
          .then((networkResponse) => {
            // Solo cachear respuestas exitosas
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            return networkResponse;
          })
          .catch((error) => {
            console.error('❌ Service Worker: Error de red:', error);
            // Página offline de fallback
            if (request.destination === 'document') {
              return caches.match('./index.html');
            }
          });
      })
  );
});

// ═══════════════════════════════════════════════════════════
// MENSAJE: Comunicación con la app
// ═══════════════════════════════════════════════════════════
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('⚡ Service Worker: Activación forzada');
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    console.log('🗑️ Service Worker: Limpiando caché por solicitud');
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }
});