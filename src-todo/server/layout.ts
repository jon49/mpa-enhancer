import html from "html-template-tag"

export interface Todo {
    completed: boolean
    title: string
    id: number
    editing: boolean
}

function todoView({ completed, title, id, editing }: Todo) {
    let completedClass = completed ? "completed" : ""
    let editingClass = editing ? "editing" : ""
    let liClass = `class="${completedClass} ${editingClass}"`
    // @ts-ignore
    return html`
    <li $${liClass}>
        <form method="post" action="todos?handler=toggle-complete&id=$${"" + id}">
            <input
                id="toggle_${"" + id}"
                class="toggle"
                type="checkbox"
                ${completed ? "checked" : ""}
                onchange="this.form.submit()"
                >
            $${!editing
            ? html`
                <label
                    id="edit_${"" + id}"
                    class="view"
                    >${title}</label>
                <button formaction="todos?handler=edit&id=${"" + id}">Edit</button>`
            : ""}
            $${!editing
            ? ""
            : html`
                <input
                    id="edit_${"" + id}"
                    class="edit"
                    value="${title}"
                    name="title"
                    autocomplete="off"
                    autofocus
                    >
                <button hidden formaction="todos?handler=update&id=${"" + id}"></button>
                <button formaction="todos?handler=cancel-edit&id=${"" + id}">Cancel</button>`
        }
            <button class="destroy" formaction="todos?handler=delete&id=${"" + id}"></button>
        </form>
    </li>`
}

export function layout(todos: Todo[], activeCount: number, count: number) {
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
            <form method="post" action="todos?handler=create">
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
            <form
                method="post"
                action="todos?handler=toggle-all"
                onchange="this.submit()"
                >
                <input id="toggle-all" class="toggle-all" type="checkbox">
                <label for="toggle-all">Mark all as complete</label>
            </form>
            <ul id="todo-list" class="todo-list">$${todos.map(todoView).join('')}</ul>
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
        : html`<form method="post" action="todos?handler=clear-completed" target="#todo-list">
                <button id="clear-completed" class="clear-completed">Clear completed</button>
            </form>`
        }
        </footer>
    </section>
    <footer class="info">
        <p>Double - click to edit a todo</p>
        <p><a href="https://github.com/jon49/htmf/tree/master/src-todo">Source Code</a></p >
        <p>Created by <a href="https://jnyman.com">Jon Nyman</a></p>
        <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
    </footer>
    <!--Scripts here.Don't remove ↓ -->
    <script src="./js/sw-loader.js"></script>
    <script src="./js/app.js"></script>
    <script src="./js/lib/mpa.js"></script>
</body>
</html>`
}

