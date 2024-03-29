import Context from "../context/Context";
import React, { useContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import List from "../components/List";
import Table from "../components/Table";
import TableSettings from "../components/TableSettings";

const HomePageFunc = () => {
  let [todoList, setTodoList] = useState([]);
  let [taskList, setTaskList] = useState([]);
  let [attachmentsList, setAttachmentsList] = useState([]);
  let [checkList, setCheckList] = useState([]);
  let [datesList, setDatesList] = useState([]);
  let [editing, setEditing] = useState();
  let [editingColumn, setEditingColumn] = useState("");
  let [taskInputTag, setTaskInputTag] = useState([]);
  let [visibleTaskInfo, setVisibleTaskInfo] = useState([]);
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

  let { authTokens, logoutUser, selectedTable, tableList, createTable, user } =
    useContext(Context);

  let fetchColumns = () => {
    let tables = [];
    for (let i of tableList) {
      tables = [...tables, i.id];
    }
    fetch(
      `http://127.0.0.1:8000/api/column-list/?tables=${encodeURIComponent(
        tables
      )}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    )
      .then((response) => {
        if (response.status === 200) return response.json();
        else if (response.statusText === "Unauthorized") logoutUser();
      })
      .then((data) => setTodoList(data));
  };

  let fetchCheckboxes = () => {
    let tasks = [];
    for (let i of taskList) {
      for (let j of i) {
        tasks = [...tasks, j.id];
      }
    }
    fetch(
      `http://127.0.0.1:8000/api/check-list/?tasks=${encodeURIComponent(
        tasks
      )}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    )
      .then((response) => {
        if (response.status === 200) return response.json();
        else if (response.statusText === "Unauthorized") logoutUser();
      })
      .then((data) => setCheckList(data));
  };

  let fetchTasks = () => {
    let columns = [];
    for (let i of todoList) {
      columns = [...columns, i.id];
    }
    fetch(
      `http://127.0.0.1:8000/api/task-list/?columns=${encodeURIComponent(
        columns
      )}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    )
      .then((response) => {
        if (response.status === 200) return response.json();
        else if (response.statusText === "Unauthorized") logoutUser();
      })
      .then((data) => {
        const getTasks = async () => {
          let tasks = [];
          for (let i of todoList) {
            tasks = [
              ...tasks,
              data.filter((task) => {
                return task.column === i.id;
              }),
            ];
          }
          return tasks;
        };
        const setTasks = async () => {
          setTaskList(await getTasks());
        };
        setTasks();
      });
  };

  let fetchDates = () => {
    let tasks = [];
    for (let i of taskList) {
      for (let j of i) {
        tasks = [...tasks, j.id];
      }
    }
    fetch(
      `http://127.0.0.1:8000/api/dates-list/?tasks=${encodeURIComponent(
        tasks
      )}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    )
      .then((response) => {
        if (response.status === 200) return response.json();
        else if (response.statusText === "Unauthorized") logoutUser();
      })
      .then((data) => setDatesList(data));
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

  let handleKeyDown = (e, id, index) => {
    e.target.style.height = "inherit";
    e.target.style.height = `${e.target.scrollHeight}px`;
    if (e.key === "Enter") {
      e.preventDefault();
      changeUpdateTag(id);
      updateTask(id);
    }
  };

  let handleColumnKeyDown = (e, index, id) => {
    e.target.style.height = "inherit";
    e.target.style.height = `${e.target.scrollHeight}px`;
    if (e.key === "Enter") {
      e.preventDefault();
      changeColumnUpdateTag(index);
      updateColumn(id, index);
    }
  };

  let fetchAttachments = () => {
    let tasks = [];
    for (let i of taskList) {
      for (let j of i) {
        tasks = [...tasks, j.id];
      }
    }
    fetch(
      `http://127.0.0.1:8000/api/attachments-list/?tasks=${encodeURIComponent(
        tasks
      )}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    )
      .then((response) => {
        if (response.status === 200) return response.json();
        else if (response.statusText === "Unauthorized") logoutUser();
      })
      .then((data) => setAttachmentsList(data));
  };

  useEffect(() => {
    fetchColumns();
  }, [tableList.length]);

  useEffect(() => {
    fetchTasks();
  }, [todoList.length]);

  useEffect(() => {
    fetchAttachments();
    fetchCheckboxes();
    fetchDates();
  }, [taskList.length]);

  let handleClickOutside = () => {
    let columns = [...open];
    for (let i = 0; i < columns.length; i++) {
      columns[i] = false;
    }
    setOpen(columns);
  };

  let handleColumnChange = (e) => {
    let value = e.target.value;
    setColumnName(value);
  };

  let handleTaskChange = (e, id, index) => {
    let value = e.target.value;
    setTaskTitle({
      user: jwt_decode(authTokens.access).user_id,
      title: value,
      column: id,
      order: taskList[index].length,
    });
  };

  let addColumn = (e) => {
    e.preventDefault();
    let userid = jwt_decode(authTokens.access).user_id;
    let url = "http://127.0.0.1:8000/api/column-create/";
    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
      body: JSON.stringify({
        user: userid,
        name: columnName,
        table: selectedTable.id,
      }),
    })
      .then(() => {
        fetchColumns();
        setColumnName("");
      })
      .catch(function (error) {
        console.log("ERROR", error);
      });
  };

  let addTask = () => {
    let url = "http://127.0.0.1:8000/api/task-create/";
    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
      body: JSON.stringify(taskTitle),
    })
      .then((response) => {
        fetchTasks();
        setTaskTitle("");
      })
      .catch(function (error) {
        console.log("ERROR", error);
      });
  };

  let updateTask = (id) => {
    let url = `http://127.0.0.1:8000/api/task-update/${id}`;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
      body: JSON.stringify(editing),
    })
      .then((response) => {
        fetchTasks();
      })
      .catch(function (error) {
        console.log("ERROR", error);
      });
  };

  let updateColumn = (id, index) => {
    let url = `http://127.0.0.1:8000/api/column-update/${id}`;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
      body: JSON.stringify({
        ...todoList[index],
        name: editingColumn,
      }),
    })
      .then((response) => {
        fetchColumns();
      })
      .catch(function (error) {
        console.log("ERROR", error);
      });
  };

  let deleteItem = (task) => {
    fetch(`http://127.0.0.1:8000/api/task-delete/${task.id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
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
        Authorization: "Bearer " + String(authTokens.access),
      },
    }).then((response) => {
      fetchColumns();
    });
  };

  let startEdit = (value) => {
    setEditing({
      title: value,
    });
  };

  let startColumnEdit = (value) => {
    setEditingColumn(value);
  };

  let handleEditingChange = (e, index) => {
    let value = e.target.value;
    setEditing({
      user: jwt_decode(authTokens.access).user_id,
      title: value,
      column: index,
      image: "",
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
      }
    }
    let column = columns[index];
    columns[index] = !column;
    setOpen(columns);
  };

  let dropdownUpdateTask = (id, title, column) => {
    let url = `http://127.0.0.1:8000/api/task-update/${id}`;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
      body: JSON.stringify({
        user: jwt_decode(authTokens.access).user_id,
        title: title,
        column: column,
        order: taskList[column].length,
      }),
    })
      .then((response) => {
        fetchTasks();
        setTaskTitle("");
      })
      .catch(function (error) {
        console.log("ERROR", error);
      });
  };

  //
  let taskClick = (index) => {
    let tasks = [...visibleTaskInfo];
    for (let i = 0; i < tasks.length; i++) {
      if (i !== index) {
        tasks[i] = false;
      }
    }
    let task = tasks[index];
    tasks[index] = !task;
    setVisibleTaskInfo(tasks);
  };

  if (tableList.length === 0) return <Table createTable={createTable} />;
  return (
    <div style={{ height: "calc(100% - 3.1rem)" }}>
      <TableSettings
        taskList={taskList}
        setTaskList={setTaskList}
        datesList={datesList}
      />
      <List
        todoList={todoList}
        columnUpdateTag={columnUpdateTag}
        handleColumnKeyDown={handleColumnKeyDown}
        editingColumn={editingColumn}
        editing={editing}
        handleColumnEditing={handleColumnEditing}
        changeColumnUpdateTag={changeColumnUpdateTag}
        startColumnEdit={startColumnEdit}
        deleteColumn={deleteColumn}
        taskList={taskList}
        taskUpdateTag={taskUpdateTag}
        handleKeyDown={handleKeyDown}
        handleEditingChange={handleEditingChange}
        changeUpdateTag={changeUpdateTag}
        startEdit={startEdit}
        deleteItem={deleteItem}
        dropdownClick={dropdownClick}
        handleClickOutside={handleClickOutside}
        dropdownUpdateTask={dropdownUpdateTask}
        taskInputTag={taskInputTag}
        changeTaskTag={changeTaskTag}
        addTask={addTask}
        handleTaskChange={handleTaskChange}
        columnInputTag={columnInputTag}
        addColumn={addColumn}
        changeColumnTag={changeColumnTag}
        handleColumnChange={handleColumnChange}
        open={open}
        selectedTable={selectedTable}
        tableList={tableList}
        user={user}
        visibleTaskInfo={visibleTaskInfo}
        taskClick={taskClick}
        fetchTasks={fetchTasks}
        attachmentsList={attachmentsList}
        fetchAttachments={fetchAttachments}
        setTaskList={setTaskList}
        fetchCheckboxes={fetchCheckboxes}
        checkList={checkList}
        fetchDates={fetchDates}
        datesList={datesList}
      />
    </div>
  );
};

export default HomePageFunc;
