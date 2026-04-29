// Service Worker pour PWA et Cache
const CACHE_NAME = 'ludovic-portfolio-v1';
const STATIC_CACHE_NAME = 'ludovic-portfolio-static-v1';
const DYNAMIC_CACHE_NAME = 'ludovic-portfolio-dynamic-v1';

// Ressources à mettre en cache immédiatement
// Note: Les pages HTML ne sont plus mises en cache statiquement pour permettre les mises à jour en développement
const STATIC_ASSETS = [
    '/assets/css/css_index.css',
    '/assets/css/css_projet.css',
    '/assets/css/css_stages.css',
    '/assets/css/css_veille.css',
    '/assets/css/css_contact.css',
    '/assets/css/style.css',
    '/assets/js/script.js',
    '/assets/js/hero-animation.js'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/40146338-da86-4860-b176-bc9c8fc19c82',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'service-worker.js:24',message:'Service Worker installing',data:{cacheName:STATIC_CACHE_NAME,assetsCount:STATIC_ASSETS.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    
    event.waitUntil(
        caches.open(STATIC_CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Caching static assets');
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/40146338-da86-4860-b176-bc9c8fc19c82',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'service-worker.js:29',message:'Caching static assets',data:{assets:STATIC_ASSETS},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
            // #endregion
            return cache.addAll(STATIC_ASSETS).catch((err) => {
                // #region agent log
                fetch('http://127.0.0.1:7242/ingest/40146338-da86-4860-b176-bc9c8fc19c82',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'service-worker.js:31',message:'Error caching static assets',data:{error:err.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
                // #endregion
                console.error('[Service Worker] Error caching static assets:', err);
            });
        })
    );
    
    self.skipWaiting();
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/40146338-da86-4860-b176-bc9c8fc19c82',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'service-worker.js:40',message:'Service Worker activating',data:{staticCache:STATIC_CACHE_NAME,dynamicCache:DYNAMIC_CACHE_NAME},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/40146338-da86-4860-b176-bc9c8fc19c82',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'service-worker.js:44',message:'Checking existing caches',data:{cacheNames:cacheNames},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'C'})}).catch(()=>{});
            // #endregion
            
            const deleteOldCaches = Promise.all(
                cacheNames.map((cacheName) => {
                    // Supprimer tous les anciens caches
                    if (cacheName !== STATIC_CACHE_NAME && 
                        cacheName !== DYNAMIC_CACHE_NAME) {
                        console.log('[Service Worker] Deleting old cache:', cacheName);
                        // #region agent log
                        fetch('http://127.0.0.1:7242/ingest/40146338-da86-4860-b176-bc9c8fc19c82',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'service-worker.js:52',message:'Deleting old cache',data:{cacheName:cacheName},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'C'})}).catch(()=>{});
                        // #endregion
                        return caches.delete(cacheName);
                    }
                })
            );
            
            // Supprimer les pages HTML du cache statique s'il existe
            const clearHTMLFromStaticCache = cacheNames.includes(STATIC_CACHE_NAME)
                ? caches.open(STATIC_CACHE_NAME).then((cache) => {
                    // #region agent log
                    fetch('http://127.0.0.1:7242/ingest/40146338-da86-4860-b176-bc9c8fc19c82',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'service-worker.js:62',message:'Clearing HTML pages from static cache',data:{cacheName:STATIC_CACHE_NAME},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'E'})}).catch(()=>{});
                    // #endregion
                    return Promise.all([
                        cache.delete('/projets.html'),
                        cache.delete('/index.html'),
                        cache.delete('/parcours.html'),
                        cache.delete('/veille.html'),
                        cache.delete('/contact.html')
                    ]).catch(() => {});
                })
                : Promise.resolve();
            
            return Promise.all([deleteOldCaches, clearHTMLFromStaticCache]);
        })
    );
    
    return self.clients.claim();
});

// Interception des requêtes réseau
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/40146338-da86-4860-b176-bc9c8fc19c82',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'service-worker.js:61',message:'Fetch event intercepted',data:{url:request.url,method:request.method,accept:request.headers.get('accept')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    
    // Ignorer les requêtes non-GET
    if (request.method !== 'GET') {
        return;
    }
    
    // Stratégie: Cache First pour les assets statiques
    if (isStaticAsset(request.url)) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/40146338-da86-4860-b176-bc9c8fc19c82',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'service-worker.js:72',message:'Using cacheFirst strategy',data:{url:request.url},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
        // #endregion
        event.respondWith(cacheFirst(request));
        return;
    }
    
    // Stratégie: Network First pour les pages HTML
    if (request.headers.get('accept').includes('text/html')) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/40146338-da86-4860-b176-bc9c8fc19c82',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'service-worker.js:77',message:'Using networkFirst strategy for HTML',data:{url:request.url},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        event.respondWith(networkFirst(request));
        return;
    }
    
    // Stratégie: Stale While Revalidate pour les images
    if (isImage(request.url)) {
        event.respondWith(staleWhileRevalidate(request));
        return;
    }
    
    // Par défaut: Network First
    event.respondWith(networkFirst(request));
});

// Stratégie: Cache First
async function cacheFirst(request) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/40146338-da86-4860-b176-bc9c8fc19c82',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'service-worker.js:137',message:'cacheFirst: checking cache',data:{url:request.url},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'G'})}).catch(()=>{});
    // #endregion
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/40146338-da86-4860-b176-bc9c8fc19c82',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'service-worker.js:142',message:'cacheFirst: serving from cache',data:{url:request.url,fromCache:true,isMultilingual:request.url.includes('multilingual.js')},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'G'})}).catch(()=>{});
        // #endregion
        return cachedResponse;
    }
    
    try {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/40146338-da86-4860-b176-bc9c8fc19c82',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'service-worker.js:100',message:'cacheFirst: fetching from network',data:{url:request.url},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
        // #endregion
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE_NAME);
            cache.put(request, networkResponse.clone());
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/40146338-da86-4860-b176-bc9c8fc19c82',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'service-worker.js:105',message:'cacheFirst: cached network response',data:{url:request.url,status:networkResponse.status},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
            // #endregion
        }
        return networkResponse;
    } catch (error) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/40146338-da86-4860-b176-bc9c8fc19c82',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'service-worker.js:108',message:'cacheFirst: network failed',data:{url:request.url,error:error.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
        // #endregion
        console.error('[Service Worker] Fetch failed:', error);
        return new Response('Offline', { status: 503 });
    }
}

// Stratégie: Network First
async function networkFirst(request) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/40146338-da86-4860-b176-bc9c8fc19c82',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'service-worker.js:113',message:'networkFirst: attempting network fetch',data:{url:request.url},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    try {
        const networkResponse = await fetch(request);
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/40146338-da86-4860-b176-bc9c8fc19c82',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'service-worker.js:116',message:'networkFirst: network response received',data:{url:request.url,status:networkResponse.status,ok:networkResponse.ok,fromCache:networkResponse.headers.get('x-cache')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE_NAME);
            cache.put(request, networkResponse.clone());
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/40146338-da86-4860-b176-bc9c8fc19c82',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'service-worker.js:120',message:'networkFirst: cached network response',data:{url:request.url},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
            // #endregion
        }
        return networkResponse;
    } catch (error) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/40146338-da86-4860-b176-bc9c8fc19c82',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'service-worker.js:123',message:'networkFirst: network failed, checking cache',data:{url:request.url,error:error.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
        // #endregion
        console.log('[Service Worker] Network failed, trying cache');
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/40146338-da86-4860-b176-bc9c8fc19c82',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'service-worker.js:126',message:'networkFirst: serving from cache after network failure',data:{url:request.url,fromCache:true},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
            // #endregion
            return cachedResponse;
        }
        
        // Page offline par défaut pour les pages HTML
        if (request.headers.get('accept').includes('text/html')) {
            return caches.match('/index.html');
        }
        
        return new Response('Offline', { status: 503 });
    }
}

// Stratégie: Stale While Revalidate
async function staleWhileRevalidate(request) {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    });
    
    return cachedResponse || fetchPromise;
}

// Helpers
function isStaticAsset(url) {
    return url.includes('/assets/css/') ||
           url.includes('/assets/js/') ||
           url.includes('/assets/fonts/');
}

function isImage(url) {
    return url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);
}

