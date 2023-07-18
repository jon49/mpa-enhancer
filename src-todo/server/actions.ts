// @ts-ignore
import { get, getMany, set, del } from "idb-keyval"
import { layout } from "./layout.js"

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
type GetHandler = (o: GetHandlerOptions) => Promise<AsyncGenerator<string>>

interface Settings {
    enableJS: boolean
}

interface Todo {
    completed: boolean
    title: string
    id: number
}

export interface TodoView extends Todo { }

export const getAll : GetHandler = async ({ request }) => {
    let [ todos, { enableJS } ] = await Promise.all([getTodos(), getSettings()])
    let activeCount = todos.filter(x => !x.completed).length
    let count = todos.length
    if (request.url.endsWith("completed"))
        todos = todos.filter(x => x.completed)
    if (request.url.endsWith("active"))
        todos = todos.filter(x => !x.completed)
    return layout(todos, activeCount, count, enableJS)
}

export const createTodo : Handler = async({ data }) => {
    if (data.title === "") return
    const todos = await getTodoIds()
    const newTodoId = Date.now()
    todos.push(newTodoId)
    await set("todos", todos)
    const newData = { ...data, completed: false, id: newTodoId }
    await set(newTodoId, newData)
}

export const updateTodo : Handler = async (opts) => {
    let { url, data } = opts
    if (data.title === "") return
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

async function getDataFromQueryId(url: URL) {
    const idMaybe = url.searchParams.get("id")
    if (!idMaybe) return
    const id = parseInt(idMaybe)
    const oldData = await get(id)
    return oldData
}

export const toggleAll : Handler = async () => {
    const todos = await getTodos()
    const completed = !todos.every(x => x.completed)
    const newData = todos.map(x => ({ ...x, completed: completed }))
    await Promise.all(newData.map(x => set(x.id, x)))
}

export const clearCompleted : Handler = async () => {
    const todos = await getTodos()
    const completed = todos.filter(x => x.completed).map(x => x.id)
    await Promise.all(completed.map(x => del(x)))
    await set("todos", todos.filter(x => !completed.includes(x.id)).map(x => x.id))
}

export const toggleJS : Handler = async () => {
    const settings = await getSettings()
    settings.enableJS = !settings.enableJS
    await set("settings", settings)
}

async function getSettings() {
    const settings : Settings = (await get("settings")) ?? { enableJS: true }
    return settings
}

async function getTodoIds() {
    const todos : number[] = (await get("todos")) ?? []
    return todos
}

async function getTodos() {
    const todos : number[] = await getTodoIds()
    if (todos.length === 0) return []
    const todoData : Todo[] = await getMany(todos)
    return todoData
}

