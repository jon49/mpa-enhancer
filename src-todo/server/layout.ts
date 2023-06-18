import html from "html-template-tag"

export interface Todo {
    completed: boolean
    title: string
    id: number
    editing: boolean
}

function todoView({ completed, title, id, editing }: Todo, enableJS: boolean) {
    let completedClass = completed ? "completed" : ""
    let editingClass = editing ? "editing" : ""
    let liClass = `class="${completedClass} ${editingClass}"`
    // @ts-ignore
    return html`
    <li $${liClass}>
        <form method="post" action="?handler=toggle-complete&id=$${"" + id}">
            <button
                id="toggle_${"" + id}"
                class="toggle button-toggle"
                type="checkbox"
            >$${completed ? "&#10004;" : ""}</button>
        </form>
        <form method="post">
            $${!editing
            ? html`
                <label
                    id="edit_${"" + id}"
                    class="view"
                    >${title}
                    <button
                        id="edit_${"" + id}"
                        class="edit-text"
                        title="Edit"
                        aria-label="Edit"
                        formaction="?handler=edit&id=${"" + id}">
                        &#9998;</button>
                    </label>`
            : ""}
            $${!editing
            ? ""
            : html`
            <div>
                <input
                    id="edit_${"" + id}"
                    class="edit"
                    value="${title}"
                    name="title"
                    autocomplete="off"
                    ${enableJS ? "" : "autofocus"}
                    >
                <button hidden formaction="?handler=update&id=${"" + id}"></button>
                <button id="edit_${"" + id}" class="cancel-edit" title="Cancel" aria-label="Cancel" formaction="?handler=cancel-edit&id=${"" + id}">&#10008;</button>
            </div>
            `
        }
            <button class="destroy" formaction="?handler=delete&id=${"" + id}"></button>
        </form>
    </li>`
}

export function layout(todos: Todo[], activeCount: number, count: number, enableJS: boolean) {
    // @ts-ignore
    return html`
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
<body>
    <section class="todoapp">
        <header class="header">
            <h1>todos</h1>
            <form method="post" action="?handler=create">
            <input
                class="new-todo"
                placeholder="What needs to be done?"
                autocomplete="off"
                name="title"
                ${todos.length === 0 ? 'autofocus' : ''}
                >
            </form>
        </header>
        <!-- This section should be hidden by default and shown when there are todos -->
        <section id="todo-section" class="main ${todos.length === 0 ? 'hidden' : ''}">
            <form method="post" action="?handler=toggle-all">
                <button id=toggle-all class="toggle-all-2">Mark all as complete</button>
            </form>
            <ul id="todo-list" class="todo-list">$${todos.map(x => todoView(x, enableJS)).join('')}</ul>
        </section>
        <!-- This footer should be hidden by default and shown when there are todos -->
        <footer id="footer" class="footer ${!count ? 'hidden' : ''}}">
            <span class="todo-count">
                <strong>${"" + activeCount}</strong> item${activeCount === 1 ? '' : 's'} left
            </span>
        <ul class="filters">
            <li>
                <a id=link-all class="selected" href="?filter=all">All</a>
            </li>
            <li><a id=link-active href="?filter=active">Active</a></li>
            <li><a id=link-completed href="?filter=completed">Completed</a></li>
        </ul>
        <!--Hidden if no completed items are left ↓ -->
        $${ count - activeCount === 0
            ? ''
        : html`<form method="post" action="?handler=clear-completed">
                <button id="clear-completed" class="clear-completed">Clear completed</button>
            </form>`
        }
        </footer>
    </section>
    <footer class="info">
        <p><form method=post action="?handler=toggle-js"><button>${enableJS ? "Disable JS" : "Enable JS"}</button></form></p>
        <p><a href="https://github.com/jon49/mpa-enhancer/tree/master/src-todo">Source Code</a></p >
        <p>Created by <a href="https://jnyman.com">Jon Nyman</a></p>
        <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
    </footer>
    <!--Scripts here.Don't remove ↓ -->
    <script src="./js/sw-loader.js"></script>
    <script src="./js/app.js"></script>
    $${enableJS ? `<script src="./js/lib/mpa.js"></script>` : ''}
</body>
</html>`
}

