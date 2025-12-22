const CACHE_NAME = "notifyme-v1";

const ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon.png",
  "/icon-192.png",
  "/icon-512.png"
];
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js");

const firebaseConfig ({
  apiKey: "BCI0fuf200mjg3WoRYzUvwtVUH4q1a9-9H6QpqQ_G26FZrkOTgzLPt__9wJTlgSW1ujUFVcu8HtePs0raW8nUBs",
  authDomain: "notifyme-pro-87f7f.firebaseapp.com",
  projectId: "notifyme-pro-87f7f",
  messagingSenderId: "159097240950",
  appId: "1:159097240950:web:87e2bfce2cd4ba7bdece57"
});

const messaging = firebase.messaging();

/* Background Push */
messaging.onBackgroundMessage(payload => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/icon-192.png"
  });
});

/* INSTALL */
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

/* ACTIVATE */
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => key !== CACHE_NAME && caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

/* FETCH */
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response =>
      response || fetch(event.request)
    )
  );
});

/* NOTIFICATION CLICK */
self.addEventListener("notificationclick", event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow("/")
  );
});
