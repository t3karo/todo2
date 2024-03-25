import { Task } from "./Task.js";

class Todos{
    #task=[]
    #backend_url=''

    constructor(url){
        this.#backend_url=url
    }

    getTasks =async() => {
        return new Promise(async(resolve, reject)=>{
           fetch(this.#backend_url)
              .then(response=>response.json())
                .then(data=>{
                    this.#readJson(data)
                    resolve(this.#task)
                })
                .catch(error=>{
                    reject(error)
                })
        })
    }

addTask=async(text)=>{
    return new Promise(async(resolve,reject)=>{
       fetch(this.#backend_url+'/new',{
           method:'POST',
           headers:{'Content-Type':'application/json'},
           body:JSON.stringify({description:text})
       })
         .then(response=>response.json())
            .then(json=>{
                const task=this.#addToArray(json.id,text)
                resolve(task)
            })  
            .catch(error=>{
                reject(error)
            })

    })  
}

removeTask=async(id)=>{
    return new Promise(async(resolve,reject)=>{
        fetch(this.#backend_url+'/delete/'+id,{
            method:'DELETE'
        })
          .then(response=>response.json())
            .then(json=>{
                this.#removeFromArray(json.id)
                resolve(json.id)
            })
            .catch(error=>{
                reject(error)
            })
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
