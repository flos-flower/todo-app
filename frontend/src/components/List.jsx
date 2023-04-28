import s from "../styles/ListStyles.module.css";
import InputBar from "./InputBar";
import TaskInfo from "./TaskInfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashAlt,
  faEdit,
  faUser,
} from "@fortawesome/free-regular-svg-icons";

const List = (props) => {
  return (
    <div className={s.columnsDiv}>
      {props.taskList.map((taskArr, index_arr) => {
        return taskArr.map((task, index) => {
          return (
            props.visibleTaskInfo[task.id] && (
              <TaskInfo
                changeVisibility={() => props.taskClick(task.id)}
                taskName={task.title}
                column={props.taskList}
                key={index}
                task={task}
                fetchTasks={props.fetchTasks}
                attachmentsList={props.attachmentsList}
                fetchAttachments={props.fetchAttachments}
                user={props.user}
              />
            )
          );
        });
      })}
      {props.todoList.map((column, index) => {
        return (
          props.selectedTable.id === column.table && (
            <div className={s.tasksDiv} key={index}>
              {props.columnUpdateTag[index] ? (
                <form key={index}>
                  <textarea
                    onKeyDown={(e) =>
                      props.handleColumnKeyDown(e, index, column.id)
                    }
                    autoFocus
                    value={props.editingColumn}
                    onChange={(e) => props.handleColumnEditing(e)}
                    className={s.updateColumnForm}
                  />
                </form>
              ) : (
                <div className={s.columnName}>
                  <span
                    onClick={
                      props.user.user_id === props.selectedTable.user
                        ? () => {
                            props.changeColumnUpdateTag(index);
                            props.startColumnEdit(column.name);
                          }
                        : undefined
                    }
                  >
                    {column.name}
                  </span>
                  <svg
                    onClick={
                      props.user.user_id === props.selectedTable.user
                        ? () => {
                            props.deleteColumn(column);
                          }
                        : undefined
                    }
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
              <div className={s.taskListContainer}>
                {props.taskList.map((taskArr, taskArr_index) => {
                  return taskArr.map((task, task_index) => {
                    return props.taskUpdateTag[task.id]
                      ? task.column === column.id && (
                          <form
                            key={task.id}
                            className={s.updateForm}
                          >
                            <textarea
                              onKeyDown={(e) =>
                                props.handleKeyDown(e, task.id)
                              }
                              value={props.editing.title}
                              onChange={(e) =>
                                props.handleEditingChange(e, column.id)
                              }
                              autoFocus
                            />
                          </form>
                        )
                      : task.column === column.id && (
                          <div
                            draggable={true}
                            key={task.id}
                            className={s.tasks}
                          >
                            <span onClick={() => props.taskClick(task.id)}>
                              {task.title}
                            </span>
                            <div className={s.taskButtons}>
                              <div
                                onClick={
                                  props.user.user_id ===
                                  props.selectedTable.user
                                    ? () => {
                                        props.changeUpdateTag(task.id);
                                        props.startEdit(task.title, column.id);
                                      }
                                    : undefined
                                }
                                className={s.btnChange}
                              >
                                <FontAwesomeIcon
                                  icon={faEdit}
                                  style={{
                                    fontSize: ".7rem",
                                  }}
                                />
                              </div>
                              <div
                                onClick={
                                  props.user.user_id ===
                                  props.selectedTable.user
                                    ? () => props.deleteItem(task)
                                    : undefined
                                }
                                className={s.btnDelete}
                              >
                                <FontAwesomeIcon
                                  icon={faTrashAlt}
                                  style={{
                                    fontSize: ".7rem",
                                  }}
                                />
                              </div>
                              {/* <div className={s.dropdownContainer}>
                              <button
                                type="button"
                                className={s.dropdownButton}
                                onClick={
                                  props.user.user_id ===
                                  props.selectedTable.user
                                    ? () => props.dropdownClick(task_index)
                                    : undefined
                                }
                              >
                                ☰
                              </button>
                              {props.open[task_index] && (
                                <OutsideClickHandler
                                  onOutsideClick={() => {
                                    props.handleClickOutside();
                                  }}
                                >
                                  <div className={s.dropdown}>
                                    <ul>
                                      {props.todoList.map(
                                        (option, option_index) => {
                                          return (
                                            <li
                                              className={s.dropdownChild}
                                              key={option_index}
                                            >
                                              <p
                                                onClick={() => {
                                                  props.dropdownUpdateTask(
                                                    task.id,
                                                    task.title,
                                                    option.id
                                                  );
                                                  props.dropdownClick(
                                                    task_index
                                                  );
                                                }}
                                              >
                                                {option.name}
                                              </p>
                                            </li>
                                          );
                                        }
                                      )}
                                    </ul>
                                  </div>
                                </OutsideClickHandler>
                              )}
                            </div> */}
                            </div>
                            {task.members.length !== 0 && (
                              <div className={s.membersCount}>
                                <div style={{ marginRight: "0.3rem" }}>
                                  <FontAwesomeIcon
                                    icon={faUser}
                                    className={s.memberIcon}
                                  />
                                  {task.members.length}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                  });
                })}
              </div>
              {props.taskInputTag[index] ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    props.changeTaskTag(index);
                    props.addTask();
                  }}
                  className={s.taskInput}
                >
                  <textarea
                    onChange={(e) => props.handleTaskChange(e, column.id)}
                    onKeyDown={props.handleKeyDown}
                    placeholder="Enter a title"
                    autoFocus
                  />
                  <div className={s.buttonsDiv}>
                    <button className={s.btnAdd}>Add task</button>
                    <button
                      onClick={() => props.changeTaskTag(index)}
                      type="button"
                      className={s.btnCancel}
                    >
                      &#9587;
                    </button>
                  </div>
                </form>
              ) : (
                <div
                  onClick={
                    props.user.user_id === props.selectedTable.user
                      ? () => props.changeTaskTag(index)
                      : undefined
                  }
                  className={s.taskAdd}
                >
                  <span className={s.plus}>+</span>
                  <span>Add task</span>
                </div>
              )}
            </div>
          )
        );
      })}
      <InputBar
        add={props.addColumn}
        changeTag={props.changeColumnTag}
        condition={props.columnInputTag}
        handleChange={props.handleColumnChange}
        handleKeyDown={props.handleKeyDown}
        addName="Add column"
        user={props.user}
        selectedTable={props.selectedTable}
      />
    </div>
  );
};

export default List;
