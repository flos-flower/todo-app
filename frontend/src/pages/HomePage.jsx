import React from "react";
import AuthContext from "../context/AuthContext";

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todoList: [],
      taskList: [],
      activeItem: {
        column: null,
        id: null,
        title: "",
        completed: false,
      },
      editing: false,
      taskInputTag: [],
      columnInputTag: false,
    };
    this.fetchColumns = this.fetchColumns.bind(this);
    this.fetchTasks = this.fetchTasks.bind(this);

    this.changeColumnTag = this.changeColumnTag.bind(this);
    this.changeTaskTag = this.changeTaskTag.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    this.fetchColumns();
    this.fetchTasks();
  }

  fetchColumns() {
    fetch("http://127.0.0.1:8000/api/column-list/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(this.context.authTokens.access),
      },
    })
      .then((response) => {
        if (response.status === 200) return response.json();
        else if (response.statusText === "Unauthorized")
          this.context.logoutUser();
      })
      .then((data) =>
        this.setState({
          todoList: data,
        })
      );
  }

  fetchTasks() {
    fetch("http://127.0.0.1:8000/api/task-list/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(this.context.authTokens.access),
      },
    })
      .then((response) => {
        if (response.status === 200) return response.json();
        else if (response.statusText === "Unauthorized")
          this.context.logoutUser();
      })
      .then((data) =>
        this.setState({
          taskList: data,
        })
      );
  }

  changeTaskTag(index) {
    let tasks = [...this.state.taskInputTag];
    let task = tasks[index];
    tasks[index] = !task;
    this.setState({
      taskInputTag: tasks,
    });
  }

  changeColumnTag(e) {
    e.preventDefault();
    this.setState((prevState) => ({
      columnInputTag: !prevState.columnInputTag,
    }));
  }

  handleKeyDown(e) {
    e.target.style.height = "inherit";
    e.target.style.height = `${e.target.scrollHeight}px`;
  }

  render() {
    var columns = this.state.todoList;
    var tasks = this.state.taskList;
    var taskInputTag = this.state.taskInputTag;
    var columnInputTag = this.state.columnInputTag;
    return (
      <div className="columnsDiv">
        {columns.map((column, index) => {
          return (
            <div className="tasksDiv" key={index}>
              <div className="columnName">
                <span>{column.name}</span>
              </div>
              {tasks.map((task, task_index) => {
                return (
                  task.column === column.id && (
                    <div key={task_index} className="tasks">
                      <span>{task.title}</span>
                      <div className="btn-change">&#128393;</div>
                    </div>
                  )
                );
              })}
              {taskInputTag[index] ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    this.changeTaskTag(index);
                  }}
                  className="taskInput"
                >
                  <textarea
                    onKeyDown={this.handleKeyDown}
                    placeholder="Enter a title"
                    autoFocus
                  />
                  <div className="buttonsDiv">
                    <button className="btn-add">Add task</button>
                    <button className="btn-cancel">&#9587;</button>
                  </div>
                </form>
              ) : (
                <div
                  onClick={() => this.changeTaskTag(index)}
                  className="taskAdd"
                >
                  <span className="plus">+</span>
                  <span>Add task</span>
                </div>
              )}
            </div>
          );
        })}
        {columnInputTag ? (
          <form onSubmit={this.changeColumnTag} className="columnInput">
            <textarea
              onKeyDown={this.handleKeyDown}
              placeholder="Enter a title"
              autoFocus
            />
            <div className="buttonsDiv">
              <button className="btn-add">Add column</button>
              <button className="btn-cancel">&#9587;</button>
            </div>
          </form>
        ) : (
          <div onClick={this.changeColumnTag} className="columnAdd">
            <span className="plus">+</span>
            <span>Add column</span>
          </div>
        )}
      </div>
    );
  }
}

HomePage.contextType = AuthContext;
export default HomePage;
