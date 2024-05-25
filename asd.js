const form = document.getElementById("todo-form")
const todoInput = document.getElementById("todo")
const todoList = document.getElementsByClassName("list-group")[0]
const firstCardBody = document.getElementsByClassName("card-body")[0]
const secondCardBody = document.getElementsByClassName("card-body")[1]
const filter = document.getElementById("filter")
const clearButton = document.getElementById("clear-todos")


eventListeners();

function eventListeners() {
    form.addEventListener("submit",addTodo)
    document.addEventListener("DOMContentLoaded",loadAllTodosToUI)
    secondCardBody.addEventListener("click",deleteTodo);
    filter.addEventListener("keyup",filterTodos)
    clearButton.addEventListener("click",clearAllTodos)
}

function clearAllTodos(){
    if (confirm("Tümünü silmek istediğinize emin misiniz?")){
        while(todoList.firstElementChild != null){
            todoList.removeChild(todoList.firstElementChild)
        }
        localStorage.removeItem("todos")
    }
}


function filterTodos(e){
    const filterValue = e.target.value.toLowerCase();
    const listItems = document.querySelectorAll(".list-group-item")
    listItems.forEach(function(listItem){
        const text = listItem.textContent.toLowerCase();
        if(text.indexOf(filterValue) === -1){
            listItem.setAttribute("style", "display : none !important");
        }
        else{
            listItem.setAttribute("style" , "display : block")
        }
    })


}


function loadAllTodosToUI(){
    let todos = getTodosFromStorage()

    todos.forEach(function(todo){
        addTodoToUI(todo)
    })
}
function deleteTodo(e){
  if (e.target.className === "fa fa-remove"){
    e.target.parentElement.parentElement.remove()
    deleteTodoFromStorage(e.target.parentElement.parentElement.textContent)
    showAlert("success", "Başarıyla silindi")

  }
}

function addTodo(e) {
    const newTodo = todoInput.value.trim();
    const filterValue = newTodo.toLowerCase();
    const listItems = document.querySelectorAll(".list-group-item");
    let todoExists = false;

    if (newTodo === "") {
        showAlert("danger", "Lütfen bir Todo Giriniz...");
    } else {
        listItems.forEach((item)=> {
            if (item.textContent.trim().toLowerCase() === filterValue) {
                todoExists = true;
            }
        });

        if (todoExists) {
            showAlert("danger", "Bu Todo zaten mevcut!");
        } else {
            addTodoToUI(newTodo);
            addTodoToStorage(newTodo);
            showAlert("success", "Todo Başarıyla Eklendi");
        }
    }

    e.preventDefault();
}


function getTodosFromStorage(){ //Storageden Todoları alma
    let todos;

    if(localStorage.getItem("todos")=== null){
      todos = []
    }
    else {
      todos = JSON.parse(localStorage.getItem("todos"))
    }
    return todos;
}

function deleteTodoFromStorage(deletetodo){
    let todos = getTodosFromStorage();

    todos.forEach(function(todo,index){
        if(todo === deletetodo){
            todos.splice(index,1);
        }
    })
    localStorage.setItem("todos",JSON.stringify(todos))
}


function addTodoToStorage(newTodo){
  let todos = getTodosFromStorage();

  todos.push(newTodo);

  localStorage.setItem("todos",JSON.stringify(todos))

}


function showAlert(type, message) {
    const alert = document.createElement("div");
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    firstCardBody.appendChild(alert)

    setTimeout(function(){
        alert.remove()
    },2000);
}



function addTodoToUI(newTodo){
 const listItem = document.createElement("li")
 listItem.className = "list-group-item d-flex justify-content-between"
 
 const link = document.createElement("a")
 
 link.href = "#"
 link.className ="delete-item"
 link.innerHTML = "<i class = 'fa fa-remove'></i>"

 listItem.appendChild(document.createTextNode(newTodo))
 listItem.appendChild(link)

 //Todo liste eklemek

 todoList.appendChild(listItem)
 todoInput.value ="";

}
