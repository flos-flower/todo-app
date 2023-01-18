import React from 'react';
import AuthContext from '../context/AuthContext';
import jwt_decode from "jwt-decode";

class HomePage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      todoList:[],
      taskList:[],
      activeItem:{
        column:null,
        id:null,
        title:'',
        completed:false,
      },
      editing: false,
      taskInputTag: false,
      columnInputTag: false,
    };
    this.fetchColumns = this.fetchColumns.bind(this)
    this.fetchTasks = this.fetchTasks.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

    this.startEdit = this.startEdit.bind(this)
    this.deleteItem = this.deleteItem.bind(this)
    this.strikeUnstrike = this.strikeUnstrike.bind(this)
  };

  componentDidMount(){
    this.fetchColumns()
    this.fetchTasks()
  }

  fetchColumns(){
    fetch('http://127.0.0.1:8000/api/column-list/', {
      method: 'GET',
      headers:{
        'Content-Type':'application/json',
        'Authorization':'Bearer ' + String(this.context.authTokens.access),
      }
    })
    .then(response => {
      if(response.status === 200) return response.json() 
      else if (response.statusText === "Unauthorized") this.context.logoutUser()
    })
    .then(data => 
      this.setState({
        todoList:data
      })
    )
  }

  fetchTasks(){
    fetch('http://127.0.0.1:8000/api/task-list/', {
      method: 'GET',
      headers:{
        'Content-Type':'application/json',
        'Authorization':'Bearer ' + String(this.context.authTokens.access),
      }
    })
    .then(response => {
      if(response.status === 200) return response.json() 
      else if (response.statusText === "Unauthorized") this.context.logoutUser()
    })
    .then(data => 
      this.setState({
        taskList:data
      })
    )
  }

  handleChange(e){
    var value = e.target.value
    var userid = (jwt_decode(this.context.authTokens.access)).user_id

    this.setState({
      activeItem:{
        ...this.state.activeItem,
        title: value,
        user: userid
      }
    })
  }

  handleSubmit(e){
    e.preventDefault()
    var url= 'http://127.0.0.1:8000/api/task-create/'

    if(this.state.editing === true){
      url = `http://127.0.0.1:8000/api/task-update/${ this.state.activeItem.id }`
      this.setState({
        editing:false
      })
    }

    fetch(url, {
      method:'POST',
      headers:{
        'Content-type':'application/json',
      },
      body:JSON.stringify(this.state.activeItem)
    }).then((response) => {
      this.fetchColumns()
      this.setState({
        activeItem:{
          user: null,
          id:null,
          title:'',
          completed:false,
        }
      })
    }).catch(function(error){
      console.log('ERROR', error)
    })
  }

  startEdit(task){
    this.setState({
      activeItem:task,
      editing:true,
    })
  }

  deleteItem(task){
    fetch(`http://127.0.0.1:8000/api/task-delete/${ task.id }`, {
      method:'DELETE',
      headers:{
        'Content-type':'application/json',
      },
    }).then((response) => {
      this.fetchColumns()
    })
  }

  strikeUnstrike(task){
    task.completed = !task.completed

    var url = `http://127.0.0.1:8000/api/task-update/${ task.id }`

    fetch(url, {
      method:'POST',
      headers:{
        'Content-type':'application/json',
      },
      body:JSON.stringify({'completed':task.completed, 'title':task.title})
    }).then(() => {
      this.fetchColumns()
    })

    console.log('task:', task.completed)
  }

  changeTaskTag = () => {
    this.setState((prevState) => ({
      taskInputTag:!prevState.taskInputTag,
    }))
  }

  changeColumnTag = () => {
    this.setState((prevState) => ({
      columnInputTag:!prevState.columnInputTag,
    }))
  }

  render(){
    var columns = this.state.todoList
    var tasks = this.state.taskList
    var taskInputTag = this.state.taskInputTag
    var columnInputTag = this.state.columnInputTag
    return(
      <div className='columnsDiv'>
        {columns.map((column, index)=>{
          return(
            <div className='tasksDiv' key={index}>
              <div className='columnName'>
                <span>{column.name}</span>
              </div>
                {tasks.map((task, task_index)=>{
                  return (
                    task.column === column.id &&
                      <div key={task_index} className='tasks'>
                        <span>{task.title}</span>
                      </div>
                  )
                })}
                {columnInputTag ?(
                  <input autoFocus type="text"/>
                  ):(
                    <div className='taskAdd'>
                      <span className='plus'>+</span>
                      <span>Добавить задачу</span>
                    </div>
                  )}
            </div>
          )
        })}
          {taskInputTag ?(
          <input autoFocus type="text"/>
          ):(
            <div className='columnAdd'>
              <span className='plus'>+</span>
              <span>Добавить столбец</span>
            </div>
          )}
      </div>
    )
  }
}

HomePage.contextType = AuthContext
export default HomePage;