var cache;

self.addEventListener('install', function(event){
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', function(event){
  console.log(event.request);
  caches.match(event.request)
    .then(function(response){
      if(response){
        console.log(response);
        return response;
      }
      return fetch(event.request).then(function(res){
        console.log(event.request.url);
        if(event.request.url.endsWith('.jpg')){
          caches.open('horse-app').then(function(cache){
            cache.put(event.request, res.clone());
          });
        }
        return res;
      });
    });
});
