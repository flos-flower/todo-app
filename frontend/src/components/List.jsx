import s from "../styles/ListStyles.module.css";
import InputBar from "./InputBar";
import TaskInfo from "./TaskInfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashAlt,
  faEdit,
  faUser,
} from "@fortawesome/free-regular-svg-icons";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const List = (props) => {
  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceItems = [...props.taskList[parseInt(source.droppableId)]];
      const destItems = [...props.taskList[parseInt(destination.droppableId)]];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      let newItems = [...props.taskList];
      props.taskList.map((task, index) => {
        if (index === parseInt(source.droppableId)) {
          newItems[index] = sourceItems;
        }
        if (index === parseInt(destination.droppableId)) {
          newItems[index] = destItems;
        }
      });
      props.setTaskList(newItems);
    } else {
      const copiedItems = [...props.taskList[parseInt(source.droppableId)]];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      let newItems = [...props.taskList];
      props.taskList.map((task, index) => {
        if (index === parseInt(source.droppableId)) {
          newItems[index] = copiedItems;
        }
      });
      props.setTaskList(newItems);
    }
  };
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

      <DragDropContext onDragEnd={(result) => handleOnDragEnd(result)}>
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
                <Droppable droppableId={"" + index}>
                  {(provided) => (
                    <div
                      className={s.taskListContainer}
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {props.taskList[index] &&
                        props.taskList[index].map((task, task_index) => {
                          return props.taskUpdateTag[task.id] ? (
                            <form key={task.id} className={s.updateForm}>
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
                          ) : (
                            <Draggable
                              key={task.id}
                              draggableId={task.id + ""}
                              index={task_index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  className={
                                    snapshot.isDragging ? s.taskDrag : s.tasks
                                  }
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <span
                                    onClick={() => props.taskClick(task.id)}
                                  >
                                    {task.title}
                                  </span>
                                  <div className={s.taskButtons}>
                                    <div
                                      onClick={
                                        props.user.user_id ===
                                        props.selectedTable.user
                                          ? () => {
                                              props.changeUpdateTag(task.id);
                                              props.startEdit(
                                                task.title,
                                                column.id
                                              );
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
                              )}
                            </Draggable>
                          );
                        })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
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
      </DragDropContext>
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
