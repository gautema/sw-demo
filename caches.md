#Cache API - https://davidwalsh.name/cache
The awesome ServiceWorker API is meant to give developers a bit more control over what is and isn't cached, and how.  Sure we can play games with ETags and the like but doing it programmatically with JavaScript just feels better, more controllable.  As with every API, however, adding stuff to cache isn't just fun and games -- you have to do the cleanup work yourself too, and by "cleanup work" I mean having to delete cache.

Let's have a look at how you can get caches, add and delete requests from caches, and how you can then delete an entire cache!

##Detecting the cache API
To detect if the browser supports the Cache API...

```javascript
if('caches' in window) {
  // Has support!
}
```

...check for the presence of the caches object within the window.
```javascript
caches.open('test-cache').then(function(cache) {
  // Cache is created and accessible
});
```

The `caches.open` call returns a `Promise` and the cache object that was either created or existed before the open call.

##Adding to Cache
You can think of a cache as an array of Request objects which act as keys to their responses which are stored by the browser. Simple addition to cache is happens via two main methods: add and addAll. You can provide these methods a string for the URL that should be fetched and cached or a Request object. You can learn more about Request objects by reading my fetch API post.

To batch add URLs to cache, you can use the addAll method:


```javascript
caches.open('test-cache').then(function(cache) {
  cache.addAll(['/', '/images/logo.png'])
    .then(function() {
      // Cached!
    });
});
```

The `addAll` method accepts an array of URLs whose URLs and responses should be cached. `addAl`l returns a Promise. To add a single URL, use the `add` method:

```javascript
caches.open('test-cache').then(function(cache) {
  cache.add('/page/1');  // "/page/1" URL will be fetched and cached!
});
```

`add` can also accept a custom `Request`:
```javascript
caches.open('test-cache').then(function(cache) {
  cache.add(new Request('/page/1', { /* request options */ }));
});
```

Similar to add is put whereby you can add a URL and its Response object:
```javascript
fetch('/page/1').then(function(response) {
  return caches.open('test-cache').then(function(cache) {
    return cache.put('/page/1', response);
  });
});
```

##Exploring Cache
To view requests that have already been cached, you can use the individual cache''s keys method to retrieve an array of cached Request objects:
```javascript
caches.open('test-cache').then(function(cache) {
  cache.keys().then(function(cachedRequests) {
    console.log(cachedRequests); // [Request, Request]
  });
});

/*
Request {
  bodyUsed: false
  credentials: "omit"
  headers: Headers
  integrity: ""
  method: "GET"
  mode: "no-cors"
  redirect: "follow"
  referrer: ""
  url: "https://fullhost.tld/images/logo.png"
}
*/
```
If you''d like to view the response of a cached Request, you can do so by using cache.match or cache.matchAll:
```javascript
caches.open('test-cache').then(function(cache) {
  cache.match('/page/1').then(function(matchedResponse) {
    console.log(matchedResponse);
  });
});

/*
Response {
  body: (...),
  bodyUsed: false,
  headers: Headers,
  ok: true,
  status: 200,
  statusText: "OK",
  type: "basic",
  url: "https://davidwalsh.name/page/1"
}
*/
```
You can learn more about Response objects by reading my fetch API post.

Removing a Cached Request
To remove a request from cache, use the cache''s delete method:
```javascript
caches.open('test-cache').then(function(cache) {
  cache.delete('/page/1');
});
```
The cache will no longer contain /page/1!

Getting Existing Cache Names
To get the names of existing caches, use caches.keys:

```javascript
caches.keys().then(function(cacheKeys) {
  console.log(cacheKeys); // ex: ["test-cache"]
});
```
window.caches.keys() again returns a promise.

Deleting A Cache
Deleting a cache is simple once you have cache key name:

```javascript
caches.delete('test-cache').then(function() {
  console.log('Cache successfully deleted!');
});
You'll often delete a cache when you're replacing with a new one (to trigger re-installation of a new service worker):

// Assuming `CACHE_NAME` is the newest name
// Time to clean up the old!
var CACHE_NAME = 'version-8';

// ...

caches.keys().then(function(cacheNames) {
  return Promise.all(
    cacheNames.map(function(cacheName) {
      if(cacheName != CACHE_NAME) {
        return caches.delete(cacheName);
      }
    })
  );
});

```
