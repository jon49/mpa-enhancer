// node_modules/idb-keyval/dist/index.js
function promisifyRequest(request) {
  return new Promise((resolve, reject) => {
    request.oncomplete = request.onsuccess = () => resolve(request.result);
    request.onabort = request.onerror = () => reject(request.error);
  });
}
function createStore(dbName, storeName) {
  const request = indexedDB.open(dbName);
  request.onupgradeneeded = () => request.result.createObjectStore(storeName);
  const dbp = promisifyRequest(request);
  return (txMode, callback) => dbp.then((db) => callback(db.transaction(storeName, txMode).objectStore(storeName)));
}
var defaultGetStoreFunc;
function defaultGetStore() {
  if (!defaultGetStoreFunc) {
    defaultGetStoreFunc = createStore("keyval-store", "keyval");
  }
  return defaultGetStoreFunc;
}
function get(key, customStore = defaultGetStore()) {
  return customStore("readonly", (store) => promisifyRequest(store.get(key)));
}
function set(key, value, customStore = defaultGetStore()) {
  return customStore("readwrite", (store) => {
    store.put(value, key);
    return promisifyRequest(store.transaction);
  });
}
function getMany(keys, customStore = defaultGetStore()) {
  return customStore("readonly", (store) => Promise.all(keys.map((key) => promisifyRequest(store.get(key)))));
}
function del(key, customStore = defaultGetStore()) {
  return customStore("readwrite", (store) => {
    store.delete(key);
    return promisifyRequest(store.transaction);
  });
}

// node_modules/html-template-tag-stream/lib/index.js
var chars = {
  "&": "&amp;",
  ">": "&gt;",
  "<": "&lt;",
  '"': "&quot;",
  "'": "&#39;",
  "`": "&#96;"
};
var chars_default = chars;
var re = new RegExp(Object.keys(chars_default).join("|"), "g");
function escape(str = "") {
  return String(str).replace(re, (match) => chars_default[match]);
}
var html_es6cape_default = escape;
var htmlPrototype = Object.getPrototypeOf(html);
async function* typeChecker(sub, isRawHtml) {
  const type = typeof sub, isPromise = sub instanceof Promise;
  if (sub == null) {
  } else if (type === "string") {
    yield isRawHtml ? sub : html_es6cape_default(sub);
  } else if (type === "number") {
    yield "" + sub;
  } else if (isPromise || sub instanceof Function) {
    sub = isPromise ? await sub : sub();
    for await (const s of typeChecker(sub, isRawHtml)) {
      yield s;
    }
  } else if (Array.isArray(sub)) {
    for await (const s of sub) {
      for await (const x of typeChecker(s, true)) {
        yield x;
      }
    }
  } else if (sub.constructor === htmlPrototype) {
    for await (const s of sub) {
      yield s;
    }
  } else {
    yield isRawHtml ? sub.toString() : html_es6cape_default(sub.toString());
  }
}
async function* html(literals, ...subs) {
  const lits = literals.raw, length = lits.length;
  let isRawHtml = true;
  for (let i = 0; i < length; i++) {
    let lit = lits[i];
    const sub = subs[i - 1];
    for await (const s of typeChecker(sub, isRawHtml)) {
      yield s;
    }
    lit = (isRawHtml = lit.endsWith("$")) ? lit.slice(0, -1) : lit;
    if (lit)
      yield lit;
  }
}
var async_generator_html_default = html;

// src-todo/server/layout.ts
function todoView({ completed, title, id }) {
  let completedClass = completed ? "completed" : "";
  let liClass = `class="${completedClass}"`;
  return async_generator_html_default`
    <li $${liClass}>
        <form method="post" action="?handler=toggle-complete&id=$${"" + id}">
            <button
                id="toggle_${"" + id}"
                class="toggle button-toggle"
                type="checkbox"
            >$${completed ? "&#10004;" : ""}</button>
        </form>
        <form method="post">
            <div>
                <input
                    id="edit_${"" + id}"
                    class="edit"
                    value="${title}"
                    name="title"
                    autocomplete="off" >
                <label for="edit_${"" + id}" class="view">${title} &#9998;</label>
                <button hidden formaction="?handler=update&id=${"" + id}"></button>
            </div>
            <button class="destroy" formaction="?handler=delete&id=${"" + id}"></button>
        </form>
    </li>`;
}
function layout(todos, activeCount, count, enableJS) {
  return async_generator_html_default`
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>MPA Enhancer • TodoMVC</title>
    <link rel="stylesheet" href="./css/base.css">
    <link rel="stylesheet" href="./css/index.css">
    <!-- CSS overrides - remove if you don't need it -->
    <link rel="stylesheet" href="./css/app.css">
</head>
<body data-mpa-scroll-to="#toggle-all">
    <section class="todoapp">
        <header class="header">
            <h1>todos</h1>
            <form method="post" action="?handler=create">
            <input
                class="new-todo"
                placeholder="What needs to be done?"
                autocomplete="off"
                name="title"
                ${todos.length === 0 || !enableJS ? "autofocus" : ""}
                >
            </form>
        </header>
        <!-- This section should be hidden by default and shown when there are todos -->
        <section id="todo-section" class="main ${todos.length === 0 ? "hidden" : ""}">
            <form method="post" action="?handler=toggle-all">
                <button id=toggle-all class="toggle-all-2">Mark all as complete</button>
            </form>
            <ul id="todo-list" class="todo-list">${todos.map(todoView)}</ul>
        </section>
        <!-- This footer should be hidden by default and shown when there are todos -->
        <footer id="footer" mpa-miss="#footer" class="footer ${!count ? "hidden" : ""}}">
            <span class="todo-count">
                <strong>${"" + activeCount}</strong> item${activeCount === 1 ? "" : "s"} left
            </span>
        <ul class="filters">
            <li>
                <a id=link-all class="selected" href="?filter=all">All</a>
            </li>
            <li><a id=link-active href="?filter=active">Active</a></li>
            <li><a id=link-completed href="?filter=completed">Completed</a></li>
        </ul>
        <!--Hidden if no completed items are left ↓ -->
        ${count - activeCount === 0 ? "" : async_generator_html_default`<form method="post" action="?handler=clear-completed">
                <button id="clear-completed" class="clear-completed">Clear completed</button>
            </form>`}
        </footer>
    </section>
    <footer class="info">
        <p><form method=post action="?handler=toggle-js"><button>${enableJS ? "Disable JS" : "Enable JS"}</button></form></p>
        <p><a href="https://github.com/jon49/mpa-enhancer/tree/master/src-todo">Source Code</a></p >
        <p>Created by <a href="https://jnyman.com">Jon Nyman</a></p>
        <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
    </footer>
    $${enableJS ? `<script src="./js/lib/mpa.js"><\/script>` : ""}
    <!--$${enableJS ? `<script src="./js/app.js"><\/script>` : ""}-->
</body>
</html>`;
}

// src-todo/server/actions.ts
var getAll = async ({ request }) => {
  let [todos, { enableJS }] = await Promise.all([getTodos(), getSettings()]);
  let activeCount = todos.filter((x) => !x.completed).length;
  let count = todos.length;
  if (request.url.endsWith("completed"))
    todos = todos.filter((x) => x.completed);
  if (request.url.endsWith("active"))
    todos = todos.filter((x) => !x.completed);
  return layout(todos, activeCount, count, enableJS);
};
var createTodo = async ({ data }) => {
  if (data.title === "")
    return;
  const todos = await getTodoIds();
  const newTodoId = Date.now();
  todos.push(newTodoId);
  await set("todos", todos);
  const newData = { ...data, completed: false, id: newTodoId };
  await set(newTodoId, newData);
};
var updateTodo = async (opts) => {
  let { url, data } = opts;
  if (data.title === "")
    return;
  const oldData = await getDataFromQueryId(url);
  if (!oldData)
    return;
  await set(oldData.id, { ...oldData, ...data });
};
var deleteTodo = async ({ url }) => {
  const todos = await getTodoIds();
  const idMaybe = url.searchParams.get("id");
  if (!idMaybe)
    return;
  const id = parseInt(idMaybe);
  const cleanedTodos = todos.filter((x) => x !== id);
  await set("todos", cleanedTodos);
  await del(id);
};
var toggleComplete = async ({ url }) => {
  const oldData = await getDataFromQueryId(url);
  if (!oldData)
    return;
  await set(oldData.id, { ...oldData, completed: !oldData.completed });
};
async function getDataFromQueryId(url) {
  const idMaybe = url.searchParams.get("id");
  if (!idMaybe)
    return;
  const id = parseInt(idMaybe);
  const oldData = await get(id);
  return oldData;
}
var toggleAll = async () => {
  const todos = await getTodos();
  const completed = !todos.every((x) => x.completed);
  const newData = todos.map((x) => ({ ...x, completed }));
  await Promise.all(newData.map((x) => set(x.id, x)));
};
var clearCompleted = async () => {
  const todos = await getTodos();
  const completed = todos.filter((x) => x.completed).map((x) => x.id);
  await Promise.all(completed.map((x) => del(x)));
  await set("todos", todos.filter((x) => !completed.includes(x.id)).map((x) => x.id));
};
var toggleJS = async () => {
  const settings = await getSettings();
  settings.enableJS = !settings.enableJS;
  await set("settings", settings);
};
async function getSettings() {
  const settings = await get("settings") ?? { enableJS: true };
  return settings;
}
async function getTodoIds() {
  const todos = await get("todos") ?? [];
  return todos;
}
async function getTodos() {
  const todos = await getTodoIds();
  if (todos.length === 0)
    return [];
  const todoData = await getMany(todos);
  return todoData;
}

// src-todo/sw.ts
var version = "0.0.1";
var root = self.location.pathname.replace("/sw.js", "");
self.addEventListener("install", async (e) => {
  e.waitUntil(
    caches.open(version).then((cache) => cache.addAll([
      "/js/sw-loader.js",
      "/js/lib/mpa.js",
      "/js/app.js",
      "/css/base.css",
      "/css/index.css",
      "/css/app.css"
    ].map((x) => root + x)))
  );
});
self.addEventListener("fetch", (e) => e.respondWith(getResponse(e)));
self.addEventListener("activate", async (e) => {
  console.log(`Service worker activated. Cache version '${version}'.`);
  const keys = await caches.keys();
  if (e.waitUntil) {
    let cacheDeletes = keys.map((x) => version !== x && caches.delete(x)).filter((x) => x);
    if (cacheDeletes.length === 0)
      return;
    e.waitUntil(Promise.all(cacheDeletes));
  }
});
async function getResponse(e) {
  const url = new URL(e.request.url);
  console.log(`Fetching '${url.pathname}'`);
  if (url.pathname === root + "/" && e.request.method === "GET") {
    const index = await getAll({ request: e.request, url });
    return streamResponse(index);
  }
  const handler = url.searchParams.get("handler");
  if (handler) {
    return handle(handler, e.request, url);
  }
  return caches.match(url.pathname);
}
var encoder = new TextEncoder();
function streamResponse(generator) {
  const stream = new ReadableStream({
    async start(controller) {
      for await (let s of generator) {
        controller.enqueue(encoder.encode(s));
      }
      controller.close();
    }
  });
  return new Response(
    stream,
    {
      headers: { "content-type": "text/html; charset=utf-8" }
    }
  );
}
async function handle(handler, request, url) {
  const data = await getData(request, url);
  const opt = { request, url, data };
  switch (handler) {
    case "create":
      await createTodo(opt);
      break;
    case "update":
      await updateTodo(opt);
      break;
    case "delete":
      await deleteTodo(opt);
      break;
    case "toggle-complete":
      await toggleComplete(opt);
      break;
    case "toggle-all":
      await toggleAll(opt);
      break;
    case "clear-completed":
      await clearCompleted(opt);
      break;
    case "toggle-js":
      await toggleJS(opt);
      break;
    default:
      return new Response("Unknown handler", { status: 400 });
  }
  return Response.redirect(request.referrer, 302);
}
async function getData(req, url) {
  let o = {};
  if (req.method === "GET") {
    url.searchParams.forEach((val, key) => o[key] = val);
    return o;
  }
  if (req.headers.get("content-type")?.includes("application/x-www-form-urlencoded")) {
    const formData = await req.formData();
    formData.forEach((val, key) => o[key] = val);
  } else if (req.headers.get("Content-Type")?.includes("json")) {
    o = await req.json();
  }
  return o;
}
