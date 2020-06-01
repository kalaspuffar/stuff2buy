var cacheName = 'stuff2buy-v1';
var appShellFiles = [
    '/assets/icons/icon-72x72.png',
    '/assets/icons/icon-96x96.png',
    '/assets/icons/icon-128x128.png',
    '/assets/icons/icon-144x144.png',
    '/assets/icons/icon-152x152.png',
    '/assets/icons/icon-192x192.png',
    '/assets/icons/icon-384x384.png',
    '/assets/icons/icon-512x512.png',
    '/assets/icons/maskable_icon-72x72.png',
    '/assets/icons/maskable_icon-96x96.png',
    '/assets/icons/maskable_icon-128x128.png',
    '/assets/icons/maskable_icon-144x144.png',
    '/assets/icons/maskable_icon-152x152.png',
    '/assets/icons/maskable_icon-192x192.png',
    '/assets/icons/maskable_icon-384x384.png',
    '/assets/icons/maskable_icon-512x512.png',
    '/assets/logo.svg',
    '/manifest.json',
];

self.addEventListener('install', (e) => {
    console.log('[Service Worker] Install');
    e.waitUntil(
        caches.open(cacheName).then((cache) => {
            console.log('[Service Worker] Caching all: app shell and content');
            return cache.addAll(appShellFiles);
        })
    );
});

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


self.addEventListener('fetch', (e) => {
    const url = new URL(e.request.url);
    if (url.pathname == '/' && url.search == '') {        
        var responseInit = {
            status: 302,
            statusText: 'Found',
            headers: {
                Location: '/?id=' + makeid(32)
            }
        };
        
        var redirectResponse = new Response('', responseInit);
        e.respondWith(redirectResponse);
        return;
    }

    if (url.pathname == '/loaddata.php' || url.pathname == '/savedata.php' || url.pathname == '/fetchpage.php') {
        e.respondWith(fetch(e.request).then((response) => {
            console.log('[Service Worker] Fetching resource from network: ' + e.request.url);
            return response;
        }));   
        return; 
    }

    e.respondWith(caches.match(e.request).then((r) => {
        console.log('[Service Worker] Fetching resource: ' + e.request.url);
        return r || fetch(e.request).then((response) => {
            console.log('[Service Worker] Fetching resource from network: ' + e.request.url);
            return caches.open(cacheName).then((cache) => {
                console.log('[Service Worker] Caching new resource: '+e.request.url);
                cache.put(e.request, response.clone());
                return response;
            });
        });
    }));
});  