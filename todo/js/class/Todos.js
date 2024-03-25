import { Task } from "./Task.js";

class Todos{
    #task=[]
    #backend_url=''

    constructor(url){
        this.#backend_url=url
    }

    getTasks =async() => {
        return new Promise(async(resolve, reject)=>{
            try{
                const response= await fetch(this.#backend_url);
                const json=await response.json();
                this.#readJson(json);
                resolve(this.#task)
            }catch(error){
                reject(error)
            }
        })
    }

addTask=async(text)=>{
    return new Promise(async(resolve,reject)=>{
        try{
        const json=JSON.stringify({description:text})
        const response=await fetch(this.#backend_url+'/new',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:json
        })
        const task=await response.json()
        const newTask=this.#addToArray(task.id,text)
        resolve(newTask)
        }catch(error){
            reject(error)
        }
    })
}

removeTask=async(id)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            const response=await fetch(this.#backend_url+'/delete/'+id,{
            method:'delete'
        })
            this.#removeFromArray(id)
            resolve()
        }catch(error){
            reject(error)
        }
    })
}

#readJson=(tasksAsJson)=>{
    tasksAsJson.forEach(node=>{
        const task=new Task(node.id, node.description)
        this.#task.push(task)
    })
}
#addToArray=(id,text)=>{
    const task=new Task(id,text)
    this.#task.push(task)
    return task
}

#removeFromArray=(id)=>{
    const arrayWithoutRemoved= this.#task.filter(task=>task.id!==id)
    this.#task=arrayWithoutRemoved
}
}
export { Todos }
