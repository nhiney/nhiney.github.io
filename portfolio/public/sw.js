const CACHE_PREFIX = "yen-nhi-portfolio";
const FALLBACK_VERSION = "dev";
const OFFLINE_URL = "/offline/";
const MANIFEST_URL = "/offline-manifest.js";

self.__OFFLINE_MANIFEST = {
  version: FALLBACK_VERSION,
  precache: ["/", "/blog/", OFFLINE_URL, "/manifest.webmanifest"],
};

try {
  importScripts(MANIFEST_URL);
} catch {
  // The generated manifest is available after a production build.
}

const MANIFEST = self.__OFFLINE_MANIFEST || {};
const VERSION = MANIFEST.version || FALLBACK_VERSION;
const PRECACHE_CACHE = `${CACHE_PREFIX}-precache-${VERSION}`;
const RUNTIME_CACHE = `${CACHE_PREFIX}-runtime-${VERSION}`;
const STATIC_PATHS = ["/_next/static/", "/favicon.ico", "/icon.png", "/apple-icon.png"];
const BLOG_PATH = "/blog/";
const CONCURRENT_CACHE_REQUESTS = 12;
const PRECACHE_URLS = Array.from(
  new Set([
    "/",
    "/blog/",
    OFFLINE_URL,
    "/manifest.webmanifest",
    ...(MANIFEST.precache || []),
  ]),
);

function isSameOrigin(url) {
  return url.origin === self.location.origin;
}

function isStaticAsset(pathname) {
  return STATIC_PATHS.some((path) => pathname.startsWith(path));
}

function isBlogAsset(pathname) {
  return pathname === BLOG_PATH || pathname.startsWith(BLOG_PATH);
}

function shouldRuntimeCache(request, url) {
  if (request.method !== "GET" || !isSameOrigin(url)) return false;
  if (isStaticAsset(url.pathname) || isBlogAsset(url.pathname)) return true;
  return /\.(?:css|js|txt|woff2?|png|jpe?g|webp|svg|ico)$/i.test(url.pathname);
}

async function addToCache(cache, url) {
  try {
    const response = await fetch(url, { cache: "reload" });
    if (response.ok || response.type === "opaque") {
      await cache.put(url, response);
    }
  } catch {
    // Ignore individual warm-cache misses so one failed file does not block SW install.
  }
}

async function precache() {
  const cache = await caches.open(PRECACHE_CACHE);
  const queue = [...PRECACHE_URLS];
  const workers = Array.from(
    { length: Math.min(CONCURRENT_CACHE_REQUESTS, queue.length) },
    async () => {
      while (queue.length > 0) {
        const url = queue.shift();
        if (url) await addToCache(cache, url);
      }
    },
  );

  await Promise.all(workers);
}

function navigationCandidates(url) {
  const pathname = url.pathname;
  const withoutSlash = pathname.replace(/\/$/, "") || "/";
  const withSlash = withoutSlash === "/" ? "/" : `${withoutSlash}/`;

  return Array.from(
    new Set([
      pathname,
      withSlash,
      `${withoutSlash}/index.html`,
      OFFLINE_URL,
      "/offline/index.html",
    ]),
  );
}

async function matchCachedNavigation(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  const url = new URL(request.url);
  for (const candidate of navigationCandidates(url)) {
    const match = await caches.match(candidate);
    if (match) return match;
  }

  return null;
}

async function networkFirstNavigation(request) {
  const cache = await caches.open(RUNTIME_CACHE);

  try {
    const response = await fetch(request);
    if (response.ok) {
      await cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await matchCachedNavigation(request);
    if (cached) return cached;
    return Response.error();
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  const url = new URL(request.url);
  if (url.pathname.endsWith(".txt")) {
    const routeData = await caches.match(request, { ignoreSearch: true });
    if (routeData) return routeData;
  }

  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(RUNTIME_CACHE);
    await cache.put(request, response.clone());
  }
  return response;
}

self.addEventListener("install", (event) => {
  event.waitUntil(precache().then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith(CACHE_PREFIX) && key !== PRECACHE_CACHE && key !== RUNTIME_CACHE)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (!isSameOrigin(url)) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  if (shouldRuntimeCache(request, url)) {
    event.respondWith(cacheFirst(request));
  }
});
