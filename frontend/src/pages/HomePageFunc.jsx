import AuthContext from '../context/AuthContext';
import React, {useContext, useState, useEffect } from 'react';
import jwt_decode from "jwt-decode"; 

const HomePageFunc = () => {
    let [todoList, setTodoList] = useState([])
    let [taskList, setTaskList] = useState([])
    let [activeItem, setActiveItem] = useState({
        column:null,
        id:null,
        title:'',
        completed:false,
      })
    let [editing, setEditing] = useState(false)
    let [taskInputTag, setTaskInputTag] = useState([])
    let [columnInputTag, setColumnInputTag] = useState(false)
    let [columnName, setColumnName] = useState('')
    let [taskTitle, setTaskTitle] = useState({
        user:'',
        title:'',
        column:'',
    })

    let {authTokens} = useContext(AuthContext)
    let {logoutUser} = useContext(AuthContext)
    
    let fetchColumns = () => {
        fetch('http://127.0.0.1:8000/api/column-list/', {
            method: 'GET',
            headers:{
            'Content-Type':'application/json',
            'Authorization':'Bearer ' + String(authTokens.access),
            }
        })
        .then(response => {
            if(response.status === 200) return response.json() 
            else if (response.statusText === "Unauthorized") logoutUser()
        })
        .then(data => 
            setTodoList(data)
        )
    }
    
    let fetchTasks = () => {
        fetch('http://127.0.0.1:8000/api/task-list/', {
          method: 'GET',
          headers:{
            'Content-Type':'application/json',
            'Authorization':'Bearer ' + String(authTokens.access),
          }
        })
        .then(response => {
          if(response.status === 200) return response.json() 
          else if (response.statusText === "Unauthorized") logoutUser()
        })
        .then(data => 
            setTaskList(data)
        )
    }
    
    let changeTaskTag = (index) => {
        let tasks = [...taskInputTag]
        let task = tasks[index]
        tasks[index] = !task
        setTaskInputTag(tasks)
    }
    
    let changeColumnTag = (e) => {
        e.preventDefault()
        setColumnInputTag(!columnInputTag)
    }
    
    let handleKeyDown = (e) => {
        e.target.style.height = 'inherit';
        e.target.style.height = `${e.target.scrollHeight}px`;
    }

    useEffect(() => {
        fetchColumns()
        fetchTasks()
    },[]);

    let handleColumnChange = (e) => {
        var value = e.target.value
        setColumnName(value)
    }

    let handleTaskChange = (e, index) => {
        var value = e.target.value
        setTaskTitle({
            user: (jwt_decode(authTokens.access)).user_id,
            title: value,
            column: index 
        })
    }

    let addColumn = (e) => {
        e.preventDefault()
        var userid = (jwt_decode(authTokens.access)).user_id
        var url= 'http://127.0.0.1:8000/api/column-create/'
        fetch(url, {
            method:'POST',
            headers:{
              'Content-type':'application/json',
            },
            body:JSON.stringify({
                user: userid,
                name: columnName,
            })
          }).then(() => {
            fetchColumns()
            setColumnName('')
          }).catch(function(error){
            console.log('ERROR', error)
          })
    }

    let addTask = () => {
        var userid = (jwt_decode(authTokens.access)).user_id
        var url = 'http://127.0.0.1:8000/api/task-create/'
        fetch(url, {
            method:'POST',
            headers:{
              'Content-type':'application/json',
            },
            body:JSON.stringify(taskTitle)
          }).then((response) => {
            fetchTasks()
            setTaskTitle('')
          }).catch(function(error){
            console.log('ERROR', error)
          })
    }

    return(
        <div className='columnsDiv'>
          {todoList.map((column, index)=>{
            return(
              <div className='tasksDiv' key={index}>
                <div className='columnName'>
                  <span>{column.name}</span>
                </div>
                  {taskList.map((task, task_index)=>{
                    return (
                      task.column === column.id &&
                        <div key={task_index} className='tasks'>
                          <span>{task.title}</span>
                            <div className='taskButtons'>
                                <div className='btn-change'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                                    </svg>
                                </div>
                                <div className='btn-delete'> 
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    )
                  })}
                  {taskInputTag[index] ?(
                    <form onSubmit={(e)=>{e.preventDefault(); changeTaskTag(index); addTask()}} className='taskInput'>
                      <textarea onChange={(e) => handleTaskChange(e, column.id)} onKeyDown={handleKeyDown} placeholder='Enter a title' autoFocus/>
                      <div className='buttonsDiv'>
                        <button className='btn-add'>Add task</button>
                        <button onClick={() => changeTaskTag(index)} type="button" className='btn-cancel'>&#9587;</button>
                      </div>
                    </form>
                    ):(
                      <div onClick={() => changeTaskTag(index)} className='taskAdd'>
                        <span className='plus'>+</span>
                        <span>Add task</span>
                      </div>
                    )}
              </div>
            )
          })}
            {columnInputTag ?(
              <form onSubmit={(e)=>{ addColumn(e); changeColumnTag(e)}} className='columnInput'>
                <textarea onChange={handleColumnChange} onKeyDown={handleKeyDown} placeholder='Enter a title' autoFocus/>
                <div className='buttonsDiv'>
                    <button className='btn-add'>Add column</button>
                    <button onClick={changeColumnTag} type="button" className='btn-cancel'>&#9587;</button>
                </div>
              </form>
  
            ):(
              <div onClick={changeColumnTag} className='columnAdd'>
                <span className='plus'>+</span>
                <span>Add column</span>
              </div>
            )}
        </div>
      )
}

export default HomePageFunc;