const BACKEND_ROOT_URL='http://localhost:3001'
import { Todos } from "./class/Todos.js"

const todos=new Todos(BACKEND_ROOT_URL)

const list =document.querySelector('ul')
const input=document.querySelector('input')

input.disabled=false

const renderTask=(task)=>{
    const li=document.createElement('li')
    li.setAttribute('class','list-group-item')
    li.setAttribute('data-key',task.getId().toString())
    //li.innerHTML=task.getText()
    renderSpan(li,task.getText())
    renderLink(li,task.getId())
    list.append(li)
}

const renderSpan=(li,text)=>{
    const span=li.appendChild(document.createElement('span'))
    span.innerHTML=text
}

const renderLink = (li, id) => {
    // Create a new anchor element and append it to the list item
    const a = li.appendChild(document.createElement('a'))
    a.innerHTML = '<i class="bi bi-trash"></i>'
    a.setAttribute('style','float: right')
    a.addEventListener('click',(event) => {
        // On click, attempt to remove the task from the backend
        todos.removeTask(id).then((removed_id) => {
            // If successful, remove the task from the UI as well
            const li_to_remove = document.querySelector(`[data-key='${removed_id}']`)
            if (li_to_remove) {
                list.removeChild(li_to_remove);
            }
        }).catch((error) => {
            // Alert the user if there's an error
            alert(error)
        })
    })
}

const getTasks=async()=>{
    todos.getTasks().then((task)=>{
        task.forEach(task=>{
            renderTask(task)
        })
        input.disabled=false
    }).catch((error)=>{
        alert(error)
    })
}

const saveTask=async(task)=>{
    try{
        const response=await fetch(BACKEND_ROOT_URL+'/new',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({description:task})
        })
        return response.json();
    }
    catch(error){
        alert(error)
    }   
}

input.addEventListener('keypress',(event)=>{
    if(event.key==='Enter'){
        event.preventDefault()
        const task=input.value.trim()
        if (task!==''){
            todos.addTask(task).then((task)=>{
                renderTask(task)
                input.value=''
                input.focus()
        })
    }
}
})
getTasks()