document.addEventListener('DOMContentLoaded', main);

// varibles
const body = document.querySelector('body');
const themeSwitch = document.getElementById('switchBtn');
const addBtn = document.getElementById('addBtn');
const jobInput = document.getElementById('jobInput');
const todoList = document.getElementById('todo-list');
function main() {
    loadTodos(JSON.parse(localStorage.getItem('todos')));

    //#region theme switch
    themeSwitch.addEventListener('click', () => {
        body.classList.toggle('light');
        themeSwitch.innerHTML = body.classList.contains('light') ? '<i class="bi bi-moon"></i>' : '<i class="bi bi-brightness-high"></i>';
    });
    //#endregion

    //#region save jobs in localStorage
    addBtn.addEventListener('click', () => {
        var jobTitle = jobInput.value.trim();
        if (!jobTitle) {
            return;
        } else {
            jobInput.value = ''
        }
        var todos = !localStorage.getItem('todos') ? [] : JSON.parse(localStorage.getItem('todos'));
        var todo = {
            title: jobTitle,
            is_done: false
        }
        loadTodos([todo]);

        todos.push(todo);
        localStorage.setItem('todos', JSON.stringify(todos));

    });
    //#endregion

    //#region dragging
    todoList.addEventListener('dragover', (e) => {
        e.preventDefault();
        var todoListArray = [...document.querySelectorAll('.todo-item')];
        var startElement = document.querySelector('.dragging');
        var endElement;
        todoListArray.forEach((todo) => {
            if (todo.contains(e.target) && !todo.classList.contains('dragging')) {
                endElement = todo;
            }
        });
        if (endElement) {
            var todoItems = [...todoList.querySelectorAll('.todo-item')];
            var currentPos = todoItems.indexOf(startElement);
            var newPos = todoItems.indexOf(endElement);

            if (newPos < currentPos) {
                todoList.insertBefore(startElement, endElement);
            } else {
                todoList.insertBefore(startElement, endElement.nextSibling);
            }

            var todos = JSON.parse(localStorage.getItem('todos'));
            var remove = todos.splice(currentPos, 1)[0];
            todos.splice(newPos, 0, remove);

            localStorage.setItem('todos', JSON.stringify(todos));
        }
    });
    //#endregion


}

function loadTodos(todos) {
    if (!todos) {
        return;
    } else {
        todos.forEach((todo) => {
            // Elements
            var li = document.createElement('li');
            var is_doneDiv = document.createElement('div');
            var btnDone = document.createElement('button');
            var titleDiv = document.createElement('div');
            var titleP = document.createElement('p');
            var removeDiv = document.createElement('div');
            var btnRemove = document.createElement('button');

            // add class and attribute
            li.classList.add('todo-item');
            li.setAttribute('draggable', true);
            is_doneDiv.classList.add('col-1');
            btnDone.classList.add('btn-done');
            btnDone.setAttribute('type', 'button');
            titleDiv.classList.add('col-8');
            removeDiv.classList.add('col-1');
            btnRemove.classList.add('btn-remove');
            btnRemove.setAttribute('type', 'button');

            // add Events
            li.addEventListener('dragstart', (e) => {
                li.classList.add('dragging')
            });
            li.addEventListener('dragend', (e) => {
                li.classList.remove('dragging')
            });

            btnRemove.addEventListener('click', (e) => {
                var todoListArray = [...document.querySelectorAll('.todo-item')];
                var liDelete = e.target.parentElement.parentElement;
                (liDelete).classList.add('todo-delete');
                var liIndex = todoListArray.indexOf(liDelete);
                removeTodo(liIndex);
                setTimeout(() => { liDelete.remove() }, 520);
            })

            btnDone.addEventListener('click', (e) => {
                if (e.target.classList.contains('bi')) {
                    if (e.target.classList.contains('bi-check2-circle')) {
                        e.target.setAttribute('class', "bi bi-circle");
                        var currentTodo = [...document.querySelectorAll('.todo-item')].indexOf(e.target.parentElement.parentElement.parentElement);
                        complateTodo(currentTodo,false);
                    } else {
                        e.target.setAttribute('class', "bi bi-check2-circle");
                        var currentTodo = [...document.querySelectorAll('.todo-item')].indexOf(e.target.parentElement.parentElement.parentElement);
                        complateTodo(currentTodo,true);
                    }
                }

            });
            // merge and add to HTML
            btnDone.innerHTML = todo.is_done == true
                ? '<i class="bi bi-check2-circle"></i>'
                : '<i class="bi bi-circle"></i>';
            titleP.innerText = todo.title;
            btnRemove.innerHTML = '<i class="bi bi-plus-lg"></i>';

            is_doneDiv.appendChild(btnDone);
            titleDiv.appendChild(titleP);
            removeDiv.appendChild(btnRemove);

            li.appendChild(is_doneDiv);
            li.appendChild(titleDiv);
            li.appendChild(btnRemove);

            todoList.appendChild(li);
        });
    }
}

function removeTodo(index) {
    var todos = JSON.parse(localStorage.getItem('todos'));
    todos.splice(index, 1);
    localStorage.setItem('todos', JSON.stringify(todos));
}
function complateTodo(index, isComplate) {
    var todos = JSON.parse(localStorage.getItem('todos'));
    todos[index].is_done = isComplate;
    localStorage.setItem('todos', JSON.stringify(todos));
}

jobInput.addEventListener('keydown', (e) => {
    if (e.key == 'Enter') {
        addBtn.click();
    }
})