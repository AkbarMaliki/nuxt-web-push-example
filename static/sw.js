importScripts('/_nuxt/workbox.4c4f5ca6.js', 'custom-sw.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/2fe3e7e1520c57f9707a.js",
    "revision": "09e7c413db407c8822327ea2196195b6"
  },
  {
    "url": "/_nuxt/40581e6e01d63e057a55.js",
    "revision": "2c08fb4ac69ea9decd1d2be03fa901be"
  },
  {
    "url": "/_nuxt/5e85937c151932ed6ca4.js",
    "revision": "e89e3d26b839b61ad25cca6911f1f224"
  },
  {
    "url": "/_nuxt/740f5ef6146a348250ad.js",
    "revision": "a7bc753370c4169f5fe1773447988d73"
  },
  {
    "url": "/_nuxt/d63046e840dd36dc5598.js",
    "revision": "bd383c9eb4c70091191327662f21f95b"
  }
], {
  "cacheId": "nuxt",
  "directoryIndex": "/",
  "cleanUrls": false
})

workbox.clientsClaim()
workbox.skipWaiting()

workbox.routing.registerRoute(new RegExp('/_nuxt/.*'), workbox.strategies.cacheFirst({}), 'GET')

workbox.routing.registerRoute(new RegExp('/.*'), workbox.strategies.networkFirst({}), 'GET')
