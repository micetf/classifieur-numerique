// Service Worker pour ClassifieurCPC
const CACHE_NAME = "classifieurcpc-cache-v1";

// Liste des ressources à mettre en cache lors de l'installation
const urlsToCache = [
    "/",
    "/index.html",
    "/static/css/main.css",
    "/static/js/main.js",
    "/manifest.json",
    "/favicon.ico",
    "/logo192.png",
    "/logo512.png",
];

// Installation du Service Worker
self.addEventListener("install", (event) => {
    console.log("Installation du Service Worker");
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then((cache) => {
                console.log("Cache ouvert");
                return cache.addAll(urlsToCache);
            })
            .catch((error) => {
                console.error(
                    "Erreur lors de la mise en cache des ressources:",
                    error
                );
            })
    );
});

// Activation du Service Worker
self.addEventListener("activate", (event) => {
    console.log("Activation du Service Worker");
    const cacheWhitelist = [CACHE_NAME];

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        // Supprimer les caches obsolètes
                        console.log(
                            "Suppression du cache obsolète:",
                            cacheName
                        );
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Stratégie Cache First, puis Network
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Utiliser la ressource en cache si elle existe
            if (response) {
                return response;
            }

            // Cloner la requête pour éviter le stream unique
            const fetchRequest = event.request.clone();

            return fetch(fetchRequest)
                .then((response) => {
                    // Vérifier que la réponse est valide
                    if (
                        !response ||
                        response.status !== 200 ||
                        response.type !== "basic"
                    ) {
                        return response;
                    }

                    // Cloner la réponse pour éviter le stream unique
                    const responseToCache = response.clone();

                    // Mise en cache de la nouvelle ressource, sauf pour les requêtes API
                    // et les éléments d'IndexedDB
                    if (
                        !event.request.url.includes("/api/") &&
                        !event.request.url.includes("chrome-extension://") &&
                        !event.request.url.includes("indexeddb")
                    ) {
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, responseToCache);
                        });
                    }

                    return response;
                })
                .catch((error) => {
                    console.error("Erreur de récupération:", error);

                    // Retourner une réponse par défaut en cas d'erreur
                    // Note: Dans une version plus complète, on pourrait créer une page offline.html
                    return new Response("Application hors ligne", {
                        status: 503,
                        statusText: "Service Unavailable",
                        headers: new Headers({
                            "Content-Type": "text/plain",
                        }),
                    });
                });
        })
    );
});

// Message pour communiquer avec la page principale
self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") {
        self.skipWaiting();
    }
});
