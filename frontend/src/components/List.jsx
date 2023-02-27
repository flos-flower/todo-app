import OutsideClickHandler from "react-outside-click-handler";
import s from "../styles/ListStyles.module.css";
import InputBar from "./InputBar";

const List = (props) => {
  return (
    <div className={s.columnsDiv}>
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
                    onClick={() => {
                      props.changeColumnUpdateTag(index);
                      props.startColumnEdit(column.name);
                    }}
                  >
                    {column.name}
                  </span>
                  <svg
                    onClick={() => props.deleteColumn(column)}
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
              {props.taskList.map((task, task_index) => {
                return props.taskUpdateTag[task_index]
                  ? task.column === column.id && (
                      <form key={task_index} className={s.updateForm}>
                        <textarea
                          onKeyDown={(e) =>
                            props.handleKeyDown(e, task_index, task.id)
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
                      <div key={task_index} className={s.tasks}>
                        <span>{task.title}</span>
                        <div className={s.taskButtons}>
                          <div
                            onClick={() => {
                              props.changeUpdateTag(task_index);
                              props.startEdit(task.title, column.id);
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
                            onClick={() => props.deleteItem(task)}
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
                              onClick={() => props.dropdownClick(task_index)}
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
                                                props.dropdownClick(task_index);
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
                          </div>
                        </div>
                      </div>
                    );
              })}
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
                  onClick={() => props.changeTaskTag(index)}
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
      />
    </div>
  );
};

export default List;
