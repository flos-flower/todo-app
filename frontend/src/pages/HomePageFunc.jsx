import AuthContext from "../context/AuthContext";
import React, { useContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import OutsideClickHandler from "react-outside-click-handler";
import s from "../styles/HomePage.module.css";

const HomePageFunc = () => {
  let [todoList, setTodoList] = useState([]);
  let [taskList, setTaskList] = useState([]);
  let [editing, setEditing] = useState({
    user: "",
    title: "",
    column: "",
  });
  let [editingColumn, setEditingColumn] = useState("");
  let [taskInputTag, setTaskInputTag] = useState([]);
  let [columnInputTag, setColumnInputTag] = useState(false);
  let [columnName, setColumnName] = useState("");
  let [taskTitle, setTaskTitle] = useState({
    user: "",
    title: "",
    column: "",
  });
  let [taskUpdateTag, setTaskUpdateTag] = useState([]);
  let [columnUpdateTag, setColumnUpdateTag] = useState([]);
  let [open, setOpen] = useState([]);

  let { authTokens } = useContext(AuthContext);
  let { logoutUser } = useContext(AuthContext);

  let fetchColumns = () => {
    fetch("http://127.0.0.1:8000/api/column-list/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
    })
      .then((response) => {
        if (response.status === 200) return response.json();
        else if (response.statusText === "Unauthorized") logoutUser();
      })
      .then((data) => setTodoList(data));
  };

  let fetchTasks = () => {
    fetch("http://127.0.0.1:8000/api/task-list/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
    })
      .then((response) => {
        if (response.status === 200) return response.json();
        else if (response.statusText === "Unauthorized") logoutUser();
      })
      .then((data) => setTaskList(data));
  };

  let changeTaskTag = (index) => {
    let tasks = [...taskInputTag];
    let task = tasks[index];
    tasks[index] = !task;
    setTaskInputTag(tasks);
  };

  let changeUpdateTag = (index) => {
    let tasks = [...taskUpdateTag];
    for (let i = 0; i < taskUpdateTag.length; i++) {
      if (i !== index) tasks[i] = false;
    }
    let task = tasks[index];
    tasks[index] = !task;
    setTaskUpdateTag(tasks);
  };

  let changeColumnTag = (e) => {
    e.preventDefault();
    setColumnInputTag(!columnInputTag);
  };

  let changeColumnUpdateTag = (index) => {
    let columns = [...columnUpdateTag];
    for (let i = 0; i < columnUpdateTag.length; i++) {
      if (i !== index) columns[i] = false;
    }
    let column = columns[index];
    columns[index] = !column;
    setColumnUpdateTag(columns);
  };

  let handleKeyDown = (e, index, id) => {
    e.target.style.height = "inherit";
    e.target.style.height = `${e.target.scrollHeight}px`;
    if (e.key === "Enter") {
      e.preventDefault();
      changeUpdateTag(index);
      updateTask(id);
    }
  };

  let handleColumnKeyDown = (e, index, id) => {
    e.target.style.height = "inherit";
    e.target.style.height = `${e.target.scrollHeight}px`;
    if (e.key === "Enter") {
      e.preventDefault();
      changeColumnUpdateTag(index);
      updateColumn(id);
    }
  };

  useEffect(() => {
    fetchColumns();
    fetchTasks();
  }, []);

  let handleClickOutside = () => {
    let columns = [...open];
    for (let i = 0; i < columns.length; i++) {
      columns[i] = false;
    }
    setOpen(columns);
  };

  let handleColumnChange = (e) => {
    var value = e.target.value;
    setColumnName(value);
  };

  let handleTaskChange = (e, index) => {
    var value = e.target.value;
    setTaskTitle({
      user: jwt_decode(authTokens.access).user_id,
      title: value,
      column: index,
    });
  };

  let addColumn = (e) => {
    e.preventDefault();
    var userid = jwt_decode(authTokens.access).user_id;
    var url = "http://127.0.0.1:8000/api/column-create/";
    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        user: userid,
        name: columnName,
      }),
    })
      .then(() => {
        fetchColumns();
        setColumnName("");
      })
      .catch(function(error) {
        console.log("ERROR", error);
      });
  };

  let addTask = () => {
    var url = "http://127.0.0.1:8000/api/task-create/";
    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(taskTitle),
    })
      .then((response) => {
        fetchTasks();
        setTaskTitle("");
      })
      .catch(function(error) {
        console.log("ERROR", error);
      });
  };

  let updateTask = (id) => {
    var url = `http://127.0.0.1:8000/api/task-update/${id}`;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(editing),
    })
      .then((response) => {
        fetchTasks();
        setTaskTitle("");
      })
      .catch(function(error) {
        console.log("ERROR", error);
      });
  };

  let updateColumn = (id) => {
    var url = `http://127.0.0.1:8000/api/column-update/${id}`;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        user: jwt_decode(authTokens.access).user_id,
        name: editingColumn,
      }),
    })
      .then((response) => {
        fetchColumns();
        setTaskTitle("");
      })
      .catch(function(error) {
        console.log("ERROR", error);
      });
  };

  let deleteItem = (task) => {
    fetch(`http://127.0.0.1:8000/api/task-delete/${task.id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
    }).then((response) => {
      fetchTasks();
    });
  };

  let deleteColumn = (column) => {
    fetch(`http://127.0.0.1:8000/api/column-delete/${column.id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
    }).then((response) => {
      fetchColumns();
    });
  };

  let startEdit = (value, index) => {
    setEditing({
      user: jwt_decode(authTokens.access).user_id,
      title: value,
      column: index,
    });
  };

  let startColumnEdit = (value) => {
    setEditingColumn(value);
  };

  let handleEditingChange = (e, index) => {
    var value = e.target.value;
    setEditing({
      user: jwt_decode(authTokens.access).user_id,
      title: value,
      column: index,
    });
  };

  let handleColumnEditing = (e) => {
    setEditingColumn(e.target.value);
  };

  let dropdownClick = (index) => {
    let columns = [...open];
    for (let i = 0; i < columns.length; i++) {
      if (i !== index) {
        columns[i] = false;
        console.log(i);
      }
    }
    let column = columns[index];
    columns[index] = !column;
    setOpen(columns);
  };

  let dropdownUpdateTask = (id, title, column) => {
    var url = `http://127.0.0.1:8000/api/task-update/${id}`;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        user: jwt_decode(authTokens.access).user_id,
        title: title,
        column: column,
      }),
    })
      .then((response) => {
        fetchTasks();
        setTaskTitle("");
      })
      .catch(function(error) {
        console.log("ERROR", error);
      });
  };

  return (
    <div className={s.columnsDiv}>
      {todoList.map((column, index) => {
        return (
          <div className={s.tasksDiv} key={index}>
            {columnUpdateTag[index] ? (
              <form key={index}>
                <textarea
                  onKeyDown={(e) => handleColumnKeyDown(e, index, column.id)}
                  autoFocus
                  value={editingColumn}
                  onChange={(e) => handleColumnEditing(e)}
                  className={s.updateColumnForm}
                />
              </form>
            ) : (
              <div className={s.columnName}>
                <span
                  onClick={() => {
                    changeColumnUpdateTag(index);
                    startColumnEdit(column.name);
                  }}
                >
                  {column.name}
                </span>
                <svg
                  onClick={() => deleteColumn(column)}
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  className={`bi bi-x ${s.deleteColumn}`}
                  viewBox="0 0 16 16"
                >
                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                </svg>
              </div>
            )}
            {taskList.map((task, task_index) => {
              return taskUpdateTag[task_index]
                ? task.column === column.id && (
                    <form key={task_index} className={s.updateForm}>
                      <textarea
                        onKeyDown={(e) => handleKeyDown(e, task_index, task.id)}
                        value={editing.title}
                        onChange={(e) => handleEditingChange(e, column.id)}
                        autoFocus
                      />
                    </form>
                  )
                : task.column === column.id && (
                    <div key={task_index} className={s.tasks}>
                      <span>{task.title}</span>
                      <div className={s.taskButtons}>
                        <div
                          onClick={() => {
                            changeUpdateTag(task_index);
                            startEdit(task.title, column.id);
                          }}
                          className={s.btnChange}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            className="bi bi-pencil"
                            viewBox="0 0 16 16"
                          >
                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                          </svg>
                        </div>
                        <div
                          onClick={() => deleteItem(task)}
                          className={s.btnDelete}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            className="bi bi-trash"
                            viewBox="0 0 16 16"
                          >
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                            <path
                              fillRule="evenodd"
                              d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                            />
                          </svg>
                        </div>
                        <div className={s.dropdownContainer}>
                          <button
                            type="button"
                            className={s.dropdownButton}
                            onClick={() => dropdownClick(task_index)}
                          >
                            ☰
                          </button>
                          {open[task_index] && (
                            <OutsideClickHandler
                              onOutsideClick={() => {
                                handleClickOutside();
                              }}
                            >
                              <div className={s.dropdown}>
                                <ul>
                                  {todoList.map((option, option_index) => {
                                    return (
                                      <li
                                        onClick={() => {
                                          dropdownUpdateTask(
                                            task.id,
                                            task.title,
                                            option.id
                                          );
                                          dropdownClick(task_index);
                                        }}
                                        className={s.dropdownChild}
                                        key={option_index}
                                      >
                                        {option.name}
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            </OutsideClickHandler>
                          )}
                        </div>
                      </div>
                    </div>
                  );
            })}
            {taskInputTag[index] ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  changeTaskTag(index);
                  addTask();
                }}
                className={s.taskInput}
              >
                <textarea
                  onChange={(e) => handleTaskChange(e, column.id)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter a title"
                  autoFocus
                />
                <div className={s.buttonsDiv}>
                  <button className={s.btnAdd}>Add task</button>
                  <button
                    onClick={() => changeTaskTag(index)}
                    type="button"
                    className={s.btnCancel}
                  >
                    &#9587;
                  </button>
                </div>
              </form>
            ) : (
              <div onClick={() => changeTaskTag(index)} className={s.taskAdd}>
                <span className={s.plus}>+</span>
                <span>Add task</span>
              </div>
            )}
          </div>
        );
      })}
      {columnInputTag ? (
        <form
          onSubmit={(e) => {
            addColumn(e);
            changeColumnTag(e);
          }}
          className={s.columnInput}
        >
          <textarea
            onChange={handleColumnChange}
            onKeyDown={handleKeyDown}
            placeholder="Enter a title"
            autoFocus
          />
          <div className={s.buttonsDiv}>
            <button className={s.btnAdd}>Add column</button>
            <button
              onClick={changeColumnTag}
              type="button"
              className={s.btnCancel}
            >
              &#9587;
            </button>
          </div>
        </form>
      ) : (
        <div onClick={changeColumnTag} className={s.columnAdd}>
          <span className={s.plus}>+</span>
          <span>Add column</span>
        </div>
      )}
    </div>
  );
};

export default HomePageFunc;
