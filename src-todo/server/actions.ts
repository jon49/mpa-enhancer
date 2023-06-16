// @ts-ignore
import { get, getMany, set, del } from "idb-keyval"
import { Todo, layout } from "./layout.js"

interface RequestOptions {
    request: Request
    url: URL
    data: any
}
interface GetHandlerOptions {
    request: Request
    url: URL
}
type Handler = (o: RequestOptions) => Promise<void>
type GetHandler = (o: GetHandlerOptions) => Promise<string>

export const getAll : GetHandler = async ({ request }) => {
    const todos = await getTodoIds()
    if (todos.length === 0) return layout([], 0, 0)
    let todoData = await getMany(todos)
    let activeCount = todoData.filter(x => !x.completed).length
    let count = todoData.length
    if (request.url.endsWith("completed"))
        todoData = todoData.filter(x => x.completed)
    if (request.url.endsWith("active"))
        todoData = todoData.filter(x => !x.completed)
    return layout(todoData, activeCount, count)
}

export const createTodo : Handler = async({ data }) => {
    if (data.title === "") return
    const todos = await getTodoIds()
    const newTodoId = Date.now()
    todos.push(newTodoId)
    await set("todos", todos)
    const newData = { ...data, completed: false, id: newTodoId, editing: false }
    await set(newTodoId, newData)
}

export const updateTodo : Handler = async (opts) => {
    let { url, data } = opts
    await cancelEdit(opts)
    const oldData = await getDataFromQueryId(url)
    if (!oldData) return
    await set(oldData.id, { ...oldData, ...data })
}

export const deleteTodo : Handler = async ({ url }) => {
    const todos = await getTodoIds()
    const idMaybe = url.searchParams.get("id")
    if (!idMaybe) return
    const id = parseInt(idMaybe)
    const cleanedTodos = todos.filter(x => x !== id)
    await set("todos", cleanedTodos)
    await del(id)
}

export const toggleComplete : Handler = async ({ url }) => {
    const oldData = await getDataFromQueryId(url)
    if (!oldData) return
    await set(oldData.id, { ...oldData, completed: !oldData.completed })
}

export const edit : Handler = async ({ url }) => {
    const oldData = await getDataFromQueryId(url)
    if (!oldData) return
    const todos = await getTodos()
    todos.forEach(x => x.editing = false)
    await Promise.all(todos.map(x => set(x.id, x)))
    await set(oldData.id, { ...oldData, editing: true })
}

export const cancelEdit : Handler = async ({ url }) => {
    const oldData = await getDataFromQueryId(url)
    if (!oldData) return
    await set(oldData.id, { ...oldData, editing: false })
}

async function getDataFromQueryId(url: URL) {
    const idMaybe = url.searchParams.get("id")
    if (!idMaybe) return
    const id = parseInt(idMaybe)
    const oldData = await get(id)
    return oldData
}

async function getTodoIds() {
    const todos : number[] = (await get("todos")) ?? []
    return todos
}

async function getTodos() {
    const todos = await getTodoIds()
    const todoData : Todo[] = await getMany(todos)
    return todoData
}

export const toggleAll : Handler = async () => {
    const todos = await getTodoIds()
    const todoData : Todo[] = await getMany(todos)
    const completed = !todoData.every(x => x.completed)
    const newData = todoData.map(x => ({ ...x, completed: completed }))
    await Promise.all(newData.map(x => set(x.id, x)))
}

export const clearCompleted : Handler = async () => {
    const todos = await getTodoIds()
    const todoData : Todo[] = await getMany(todos)
    const completed = todoData.filter(x => x.completed).map(x => x.id)
    await Promise.all(completed.map(x => del(x)))
    await set("todos", todos.filter(x => !completed.includes(x)))
}

