self.addEventListener('install', function(event){
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', function(event){
  return caches.match(event.request)
    .then(function(response){
      if(response){
        return response;
      }
      return fetch(event.request).then(function(res){
        if(event.request.url.endsWith('.jpg')){
          caches.open('horse-app').then(function(cache){
            cache.put(event.request, res.clone());
          });
        }
        return res;
      });
    });
});
