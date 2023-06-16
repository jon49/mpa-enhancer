var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));

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

// node_modules/html-es6cape/dist/index.esm.js
var t = { "&": "&amp;", ">": "&gt;", "<": "&lt;", '"': "&quot;", "'": "&#39;", "`": "&#96;" };
var e = new RegExp(Object.keys(t).join("|"), "g");
function n(n2) {
  return void 0 === n2 && (n2 = ""), String(n2).replace(e, function(e3) {
    return t[e3];
  });
}

// node_modules/html-template-tag/dist/index.esm.js
function e2(e3) {
  for (var a = [], t2 = 1; t2 < arguments.length; t2++)
    a[t2 - 1] = arguments[t2];
  return e3.raw.reduce(function(t3, n2, i) {
    var o = a[i - 1];
    return Array.isArray(o) ? o = o.join("") : e3.raw[i - 1] && e3.raw[i - 1].endsWith("$") ? t3 = t3.slice(0, -1) : o = n(o), t3 + o + n2;
  });
}

// src-todo/server/layout.ts
function todoView({ completed, title, id, editing }) {
  let completedClass = completed ? "completed" : "";
  let editingClass = editing ? "editing" : "";
  let liClass = `class="${completedClass} ${editingClass}"`;
  return e2`
    <li $${liClass}>
        <form method="post" action="/todos?handler=toggle-complete&id=$${"" + id}">
            <input
                id="toggle_${"" + id}"
                class="toggle"
                type="checkbox"
                ${completed ? "checked" : ""}
                onchange="this.form.submit()"
                >
            $${!editing ? e2`
                <label
                    id="edit_${"" + id}"
                    class="view"
                    >${title}</label>
                <button formaction="/todos?handler=edit&id=${"" + id}">Edit</button>` : ""}
            $${!editing ? "" : e2`
                <input
                    id="edit_${"" + id}"
                    class="edit"
                    value="${title}"
                    name="title"
                    autocomplete="off"
                    autofocus
                    >
                <button hidden formaction="/todos?handler=update&id=${"" + id}"></button>
                <button formaction="/todos?handler=cancel-edit&id=${"" + id}">Cancel</button>`}
            <button class="destroy" formaction="/todos?handler=delete&id=${"" + id}"></button>
        </form>
    </li>`;
}
var _a;
function layout(todos, activeCount, count) {
  return e2(_a || (_a = __template([`
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>MPA Enhancer \u2022 TodoMVC</title>
    <link rel="stylesheet" href="./css/base.css">
    <link rel="stylesheet" href="./css/index.css">
    <!-- CSS overrides - remove if you don't need it -->
    <link rel="stylesheet" href="./css/app.css">
</head>
<body>
    <section class="todoapp">
        <header class="header">
            <h1>todos</h1>
            <form method="post" action="/todos?handler=create">
            <input
                class="new-todo"
                placeholder="What needs to be done?"
                autocomplete="off"
                name="title"
                `, '\n                >\n            </form>\n        </header>\n        <!-- This section should be hidden by default and shown when there are todos -->\n        <section id="todo-section" class="main ', '">\n            <form\n                method="post"\n                action="/todos?handler=toggle-all"\n                onchange="this.submit()"\n                >\n                <input id="toggle-all" class="toggle-all" type="checkbox">\n                <label for="toggle-all">Mark all as complete</label>\n            </form>\n            <ul id="todo-list" class="todo-list">$', '</ul>\n        </section>\n        <!-- This footer should be hidden by default and shown when there are todos -->\n        <footer id="footer" class="footer ', '}">\n            <span class="todo-count">\n                <strong>', "</strong> item", ' left\n            </span>\n        <ul class="filters">\n            <li>\n                <a id=link-all class="selected" href="?filter=all">All</a>\n            </li>\n            <li><a id=link-active href="?filter=active">Active</a></li>\n            <li><a id=link-completed href="?filter=completed">Completed</a></li>\n        </ul>\n        <!--Hidden if no completed items are left \u2193 -->\n        $', `
        </footer>
    </section>
    <footer class="info">
        <p>Double - click to edit a todo</p>
        <p><a href="https://github.com/jon49/htmf/tree/master/src-todo">Source Code</a></p >
        <p>Created by <a href="https://jnyman.com">Jon Nyman</a></p>
        <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
    </footer>
    <!--Scripts here.Don't remove \u2193 -->
    <script src="./js/sw-loader.js"><\/script>
    <script src="./js/app.js"><\/script>
    <script src="./js/lib/mpa.js"><\/script>
</body>
</html>`])), todos.length === 0 ? "autofocus" : "", todos.length === 0 ? "hidden" : "", todos.map(todoView).join(""), !count ? "hidden" : "", "" + activeCount, activeCount === 1 ? "" : "s", count - activeCount === 0 ? "" : e2`<form method="post" action="/todos?handler=clear-completed" target="#todo-list">
                <button id="clear-completed" class="clear-completed">Clear completed</button>
            </form>`);
}

// src-todo/server/actions.ts
var getAll = async ({ request }) => {
  const todos = await getTodoIds();
  if (todos.length === 0)
    return layout([], 0, 0);
  let todoData = await getMany(todos);
  let activeCount = todoData.filter((x) => !x.completed).length;
  let count = todoData.length;
  if (request.url.endsWith("completed"))
    todoData = todoData.filter((x) => x.completed);
  if (request.url.endsWith("active"))
    todoData = todoData.filter((x) => !x.completed);
  return layout(todoData, activeCount, count);
};
var createTodo = async ({ data }) => {
  if (data.title === "")
    return;
  const todos = await getTodoIds();
  const newTodoId = Date.now();
  todos.push(newTodoId);
  await set("todos", todos);
  const newData = { ...data, completed: false, id: newTodoId, editing: false };
  await set(newTodoId, newData);
};
var updateTodo = async (opts) => {
  let { url, data } = opts;
  await cancelEdit(opts);
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
var edit = async ({ url }) => {
  const oldData = await getDataFromQueryId(url);
  if (!oldData)
    return;
  const todos = await getTodos();
  todos.forEach((x) => x.editing = false);
  await Promise.all(todos.map((x) => set(x.id, x)));
  await set(oldData.id, { ...oldData, editing: true });
};
var cancelEdit = async ({ url }) => {
  const oldData = await getDataFromQueryId(url);
  if (!oldData)
    return;
  await set(oldData.id, { ...oldData, editing: false });
};
async function getDataFromQueryId(url) {
  const idMaybe = url.searchParams.get("id");
  if (!idMaybe)
    return;
  const id = parseInt(idMaybe);
  const oldData = await get(id);
  return oldData;
}
async function getTodoIds() {
  const todos = await get("todos") ?? [];
  return todos;
}
async function getTodos() {
  const todos = await getTodoIds();
  const todoData = await getMany(todos);
  return todoData;
}
var toggleAll = async () => {
  const todos = await getTodoIds();
  const todoData = await getMany(todos);
  const completed = !todoData.every((x) => x.completed);
  const newData = todoData.map((x) => ({ ...x, completed }));
  await Promise.all(newData.map((x) => set(x.id, x)));
};
var clearCompleted = async () => {
  const todos = await getTodoIds();
  const todoData = await getMany(todos);
  const completed = todoData.filter((x) => x.completed).map((x) => x.id);
  await Promise.all(completed.map((x) => del(x)));
  await set("todos", todos.filter((x) => !completed.includes(x)));
};

// src-todo/sw.ts
var version = "0.0.1";
var root = self.location.pathname.replace("/sw.js", "");
self.addEventListener("install", (e3) => {
  console.log(`Installing version '${version}' service worker.`);
  e3.waitUntil(
    caches.open(version).then((cache) => cache.addAll([
      "/js/app.js",
      "/js/sw-loader.js",
      "/js/lib/mpa.js",
      "/css/base.css",
      "/css/index.css",
      "/css/app.css"
    ].map((x) => root + x)))
  );
});
self.addEventListener("fetch", (e3) => e3.respondWith(getResponse(e3)));
self.addEventListener("activate", async (e3) => {
  console.log(`Service worker activated. Cache version '${version}'.`);
  const keys = await caches.keys();
  if (e3.waitUntil) {
    let cacheDeletes = keys.map((x) => version !== x && caches.delete(x)).filter((x) => x);
    if (cacheDeletes.length === 0)
      return;
    e3.waitUntil(Promise.all(cacheDeletes));
  }
});
async function getResponse(e3) {
  const url = new URL(e3.request.url);
  console.log(`Fetching '${url.pathname}'`);
  if (url.pathname === root + "/" && e3.request.method === "GET") {
    const index = await getAll({ request: e3.request, url });
    return new Response(index, {
      headers: {
        "Content-Type": "text/html"
      }
    });
  }
  const handler = url.searchParams.get("handler");
  if (handler) {
    return handle(handler, e3.request, url);
  }
  return caches.match(url.pathname);
}
async function handle(handler, request, url) {
  const data = await getData(request, url);
  const opt = { request, url, data };
  let task = null;
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
    case "cancel-edit":
      await cancelEdit(opt);
      break;
    case "edit":
      await edit(opt);
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