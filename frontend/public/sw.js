// Service Worker for Created by Dobas PWA
const CACHE_NAME = 'created-by-dobas-v1.0.0';
const STATIC_CACHE = 'static-v1.0.0';
const DYNAMIC_CACHE = 'dynamic-v1.0.0';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/offline.html'
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /\/api\/products/,
  /\/api\/about-us/,
  /\/api\/testimonials/,
  /\/api\/blog/,
  /\/api\/site-settings/
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!request.url.startsWith('http')) {
    return;
  }

  // Skip requests to different origins (like Google Fonts)
  try {
    const url = new URL(request.url);
    const isOwnOrigin = url.origin === self.location.origin;
    const isAPIRequest = API_CACHE_PATTERNS.some(pattern => pattern.test(request.url));
    
    // Only handle requests to our own origin or API requests
    if (!isOwnOrigin && !isAPIRequest) {
      return;
    }
  } catch (error) {
    // If URL parsing fails, skip this request
    return;
  }

  // Handle different types of requests
  if (isStaticFile(request)) {
    event.respondWith(cacheFirst(request));
  } else if (isAPIRequest(request)) {
    event.respondWith(networkFirst(request));
  } else if (isImageRequest(request)) {
    event.respondWith(cacheFirst(request));
  } else {
    event.respondWith(networkFirst(request));
  }
});

// Cache first strategy (for static files and images)
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Cache first failed:', error);
    return getOfflinePage();
  }
}

// Network first strategy (for API calls and dynamic content)
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Network first failed, trying cache:', error);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.destination === 'document') {
      return getOfflinePage();
    }
    
    // For API requests, return a meaningful error response instead of throwing
    if (isAPIRequest(request)) {
      return new Response(
        JSON.stringify({ 
          error: 'Network unavailable', 
          message: 'Please check your internet connection and try again.',
          offline: true 
        }), 
        { 
          status: 503, 
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    throw error;
  }
}

// Helper functions
function isStaticFile(request) {
  return STATIC_FILES.some(file => request.url.endsWith(file));
}

function isAPIRequest(request) {
  return API_CACHE_PATTERNS.some(pattern => pattern.test(request.url));
}

function isImageRequest(request) {
  return request.destination === 'image' || 
         /\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(request.url);
}

async function getOfflinePage() {
  const cache = await caches.open(STATIC_CACHE);
  const offlinePage = await cache.match('/offline.html');
  return offlinePage || new Response('Offline', { status: 200 });
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync-orders') {
    event.waitUntil(syncOrders());
  } else if (event.tag === 'background-sync-reviews') {
    event.waitUntil(syncReviews());
  }
});

// Sync offline orders when back online
async function syncOrders() {
  try {
    // Get offline orders from IndexedDB or localStorage
    const offlineOrders = getOfflineOrders();
    
    for (const order of offlineOrders) {
      try {
        await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(order)
        });
        
        // Remove from offline storage after successful sync
        removeOfflineOrder(order.id);
      } catch (error) {
        console.log('Failed to sync order:', order.id, error);
      }
    }
  } catch (error) {
    console.log('Background sync failed:', error);
  }
}

// Sync offline reviews when back online
async function syncReviews() {
  try {
    const offlineReviews = getOfflineReviews();
    
    for (const review of offlineReviews) {
      try {
        await fetch('/api/reviews', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(review)
        });
        
        removeOfflineReview(review.id);
      } catch (error) {
        console.log('Failed to sync review:', review.id, error);
      }
    }
  } catch (error) {
    console.log('Review sync failed:', error);
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);
  
  const options = {
    body: 'You have new updates from Created by Dobas!',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    data: {
      url: '/'
    },
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/icon-192.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };

  if (event.data) {
    const data = event.data.json();
    options.body = data.body || options.body;
    options.data.url = data.url || options.data.url;
  }

  event.waitUntil(
    self.registration.showNotification('Created by Dobas', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});

// Utility functions for offline storage
function getOfflineOrders() {
  // Implementation would use IndexedDB or localStorage
  return JSON.parse(localStorage.getItem('offlineOrders') || '[]');
}

function removeOfflineOrder(orderId) {
  const orders = getOfflineOrders();
  const filtered = orders.filter(order => order.id !== orderId);
  localStorage.setItem('offlineOrders', JSON.stringify(filtered));
}

function getOfflineReviews() {
  return JSON.parse(localStorage.getItem('offlineReviews') || '[]');
}

function removeOfflineReview(reviewId) {
  const reviews = getOfflineReviews();
  const filtered = reviews.filter(review => review.id !== reviewId);
  localStorage.setItem('offlineReviews', JSON.stringify(filtered));
}

// Handle app updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
