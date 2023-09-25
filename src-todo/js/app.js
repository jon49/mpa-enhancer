
function fillTodos() {
    let count = +document.querySelector('.todo-count > strong').textContent
    if (count > 1001) {
        return
    }
    var newTodo = document.querySelector('.new-todo')
    newTodo.value = 'todo ' + (count + 1)
    newTodo.form.submit()
}

fillTodos()


