import {
    clearCompleted,
    createTodo,
    deleteTodo,
    getAll,
    toggleAll,
    toggleComplete,
    updateTodo,
    toggleJS,
} from "./server/actions.js"

const version = "0.0.1"
const root = self.location.pathname.replace('/sw.js', '')

self.addEventListener("install", async e => {
    // @ts-ignore
    e.waitUntil(
        caches.open(version)
        // @ts-ignore
        .then(cache => cache.addAll([
            "/js/sw-loader.js",
            "/js/lib/mpa.js",
            "/css/base.css",
            "/css/index.css",
            "/css/app.css",
        ].map(x => root + x))))
})

// @ts-ignore
self.addEventListener("fetch", (e: FetchEvent) => e.respondWith(getResponse(e)))

// @ts-ignore
self.addEventListener("activate", async (e: ExtendableEvent) => {
    console.log(`Service worker activated. Cache version '${version}'.`)
    const keys = await caches.keys()
    if (e.waitUntil) {
        let cacheDeletes =
                keys
                .map((x: string) => ((version !== x) && caches.delete(x)))
                .filter(x => x)
        if (cacheDeletes.length === 0) return
        e.waitUntil(Promise.all(cacheDeletes))
    }
})

// @ts-ignore
async function getResponse(e: FetchEvent) {
    const url = new URL(e.request.url)
    console.log(`Fetching '${url.pathname}'`)
    if (url.pathname === root + "/" && e.request.method === "GET") {
        const index = await getAll({ request: e.request, url })
        return streamResponse(index)
    }

    const handler = url.searchParams.get("handler")
    if (handler) {
        return handle(handler, e.request, url)
    }

    return caches.match(url.pathname)
}

const encoder = new TextEncoder()
function streamResponse(generator: AsyncGenerator<any, void, unknown>) {
    const stream = new ReadableStream({
        async start(controller : ReadableStreamDefaultController<any>) {
            for await (let s of generator) {
                controller.enqueue(encoder.encode(s))
            }
            controller.close()
        }
    })

    return new Response(
        stream, {
            headers: { "content-type": "text/html; charset=utf-8" }
        })
}

async function handle(handler: string, request: Request, url: URL) {
    const data = await getData(request, url)
    const opt = { request, url, data }
    switch (handler) {
        case "create":
            await createTodo(opt)
            break
        case "update":
            await updateTodo(opt)
            break
        case "delete":
            await deleteTodo(opt)
            break
        case "toggle-complete":
            await toggleComplete(opt)
            break
        case "toggle-all":
            await toggleAll(opt)
            break
        case "clear-completed":
            await clearCompleted(opt)
            break
        case "toggle-js":
            await toggleJS(opt)
            break
        default:
            return new Response("Unknown handler", { status: 400 })
    }

    return Response.redirect(request.referrer, 302)
}

async function getData(req: Request, url: URL) {
    let o : any = {}
    if (req.method === "GET") {
        url.searchParams.forEach((val, key) => o[key] = val)
        return o
    }

    if (req.headers.get("content-type")?.includes("application/x-www-form-urlencoded")) {
        const formData = await req.formData()
        formData.forEach((val, key) => o[key] = val)
    } else if (req.headers.get("Content-Type")?.includes("json")) {
        o = await req.json()
    }
    return o
}

