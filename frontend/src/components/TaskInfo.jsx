import Context from "../context/Context";
import { useRef, useContext, useState, useEffect } from "react";
import s from "../styles/TaskInfoStyles.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faX,
  faPaperclip,
  faUser,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { faCommentAlt } from "@fortawesome/free-regular-svg-icons";

const TaskInfo = (props) => {
  const refFile = useRef(null);
  const memberRef = useRef(null);

  let [descEdit, setDescEdit] = useState(false);
  let [descValue, setDescValue] = useState(
    props.task.description ? props.task.description : ""
  );
  let [visibleMemberList, setVisibleMemberList] = useState(false);

  let { userList, selectedTable, authTokens } = useContext(Context);

  const chooseFile = () => {
    refFile.current.click();
  };

  let changeMemberListVisibility = () => {
    setVisibleMemberList(!visibleMemberList);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        memberRef.current &&
        !memberRef.current.contains(event.target) &&
        visibleMemberList === true
      ) {
        changeMemberListVisibility && changeMemberListVisibility();
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [visibleMemberList]);

  let handleKeyDown = (e) => {
    e.target.style.height = "inherit";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  let updateTask = (e) => {
    e.preventDefault();
    let url = `http://127.0.0.1:8000/api/task-update/${props.task.id}`;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
      body: JSON.stringify({
        ...props.task,
        description: descValue,
      }),
    })
      .then((response) => {
        props.fetchTasks();
        setDescEdit(false);
      })
      .catch(function (error) {
        console.log("ERROR", error);
      });
  };

  let addMember = (id) => {
    let url = `http://127.0.0.1:8000/api/task-update/${props.task.id}`;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
      body: JSON.stringify({
        ...props.task,
        members: [...props.task.members, id],
      }),
    })
      .then((response) => {
        props.fetchTasks();
      })
      .catch(function (error) {
        console.log("ERROR", error);
      });
  };

  const handleFileChange = (e) => {
    const data = new FormData();
    for (let i in e.target.files) {
      data.append("attachments", e.target.files[i]);
    }
    data.append("task", props.task.id);
    var url = `http://127.0.0.1:8000/api/attachment-upload`;
    fetch(url, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + String(authTokens.access),
      },
      body: data,
    })
      .then((response) => {
        props.fetchAttachments();
      })
      .catch(function (error) {
        console.log("ERROR", error);
      });
  };

  let updateTaskMembers = (userid) => {
    let url = `http://127.0.0.1:8000/api/task-update/${props.task.id}`;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
      body: JSON.stringify({
        ...props.task,
        members: props.task.members.filter((user) => user !== userid),
      }),
    })
      .then((response) => {
        props.fetchTasks();
      })
      .catch(function (error) {
        console.log("ERROR", error);
      });
  };

  let deleteAttachment = (id) => {
    fetch(`http://127.0.0.1:8000/api/attachment-delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
    }).then((response) => {
      props.fetchAttachments();
    });
  };

  return (
    <div className={s.TaskInfoContainer}>
      {console.log(props.attachmentsList)}
      <div className={s.TaskInfoDiv}>
        <FontAwesomeIcon
          icon={faX}
          onClick={props.changeVisibility}
          style={{
            color: "black",
            fontSize: "0.6rem",
            position: "absolute",
            right: "1rem",
            top: "1rem",
            cursor: "pointer",
          }}
        />
        <p>{props.taskName}</p>
        <div className={s.mainDiv}>
          <div className={s.mainContent}>
            <div className={s.descriptionDiv}>
              <div className={s.descDiv}>
                <FontAwesomeIcon
                  icon={faCommentAlt}
                  style={{
                    fontSize: "0.9rem",
                    marginRight: "0.25rem",
                  }}
                />
                <span>Description</span>
                {props.task.description && descEdit === false && (
                  <div
                    className={s.startDescEdit}
                    onClick={
                      props.user.user_id === selectedTable.user
                        ? () => {
                            setDescEdit(!descEdit);
                          }
                        : undefined
                    }
                  >
                    <span>Edit</span>
                  </div>
                )}
              </div>
              {descEdit ? (
                <form className={s.addDescDiv} onSubmit={updateTask}>
                  <textarea
                    onKeyDown={(e) => handleKeyDown(e)}
                    name="description"
                    value={descValue}
                    placeholder="Add a description"
                    className={s.descriptionText}
                    type="text"
                    autoFocus
                    onChange={(e) => setDescValue(e.target.value)}
                  />
                  <input value="Save" type="submit" className={s.saveDesc} />
                  <div
                    onClick={() => {
                      setDescEdit(false);
                      props.task.description
                        ? setDescValue(props.task.description)
                        : setDescValue("");
                    }}
                    className={s.closeDesc}
                  >
                    <FontAwesomeIcon
                      icon={faX}
                      style={{
                        color: "black",
                        fontSize: "0.75rem",
                        margin: "0",
                      }}
                    />
                  </div>
                </form>
              ) : props.task.description ? (
                <div
                  className={s.descExist}
                  onClick={
                    props.user.user_id === selectedTable.user
                      ? () => {
                          setDescEdit(!descEdit);
                        }
                      : undefined
                  }
                >
                  <div className={s.descText}>
                    <p>{props.task.description}</p>
                  </div>
                </div>
              ) : (
                <textarea
                  placeholder="Add a description"
                  className={s.descriptionAdd}
                  disabled={props.user.user_id !== selectedTable.user && true}
                  type="text"
                  onClick={
                    props.user.user_id === selectedTable.user
                      ? () => {
                          setDescEdit(!descEdit);
                        }
                      : undefined
                  }
                />
              )}
            </div>
            {props.attachmentsList.some((e) => e.task === props.task.id) && (
              <div className={s.attachmentsDiv}>
                <FontAwesomeIcon
                  icon={faPaperclip}
                  style={{
                    color: "black",
                    fontSize: "0.9rem",
                    marginRight: ".3rem",
                  }}
                />
                <span>Attachments</span>
                <div className={s.attachmentsContainer}>
                  {props.attachmentsList.map((attachment, index) => {
                    return (
                      attachment.task === props.task.id && (
                        <div key={index} className={s.attachmentItem}>
                          <a
                            href={`http://127.0.0.1:8000/Programming/DJ and ReactJS/todo-app/todo/media${attachment.file}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <div className={s.attachmentImage}></div>
                          </a>
                          <div>
                            <span>
                              {attachment.file.replace(/^.*[\\\/]/, "")}
                            </span>
                            <div
                              className={s.deleteAttachment}
                              onClick={
                                props.user.user_id === selectedTable.user
                                  ? () => {
                                      deleteAttachment(attachment.id);
                                    }
                                  : undefined
                              }
                            >
                              <span>Delete</span>
                            </div>
                          </div>
                        </div>
                      )
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <div className={s.options}>
            <p>Add-ons</p>
            <form>
              <div className={s.addOptions} onClick={chooseFile}>
                <FontAwesomeIcon
                  icon={faPaperclip}
                  style={{
                    color: "black",
                    fontSize: ".75rem",
                    marginRight: ".3rem",
                  }}
                />
                <span>Attachment</span>
              </div>
              {props.user.user_id === selectedTable.user ? (
                <input
                  type="file"
                  multiple
                  ref={refFile}
                  onChange={handleFileChange}
                />
              ) : (
                <input
                  type="file"
                  multiple
                  ref={refFile}
                  onChange={handleFileChange}
                  disabled
                />
              )}
            </form>
            <div
              className={s.addOptions}
              style={{ padding: "0" }}
              ref={memberRef}
            >
              <div
                className={s.optionName}
                onClick={
                  props.user.user_id === selectedTable.user
                    ? changeMemberListVisibility
                    : undefined
                }
              >
                <FontAwesomeIcon
                  icon={faUser}
                  style={{
                    color: "black",
                    fontSize: ".75rem",
                    marginRight: ".3rem",
                  }}
                />
                <span>Members</span>
              </div>
              {visibleMemberList && (
                <ul className={s.membersList}>
                  {userList.map((user, index) => {
                    return user.id === selectedTable.user ? (
                      <li
                        key={index}
                        onClick={() => {
                          props.task.members.includes(user.id)
                            ? updateTaskMembers(user.id)
                            : addMember(user.id);
                        }}
                        className={s.memberLi}
                      >
                        <span>{user.username}</span>
                        {props.task.members.includes(user.id) && (
                          <FontAwesomeIcon
                            icon={faCheck}
                            style={{
                              color: "black",
                              fontSize: "0.6rem",
                              position: "absolute",
                              right: "0.25rem",
                              top: "0.45rem",
                              cursor: "pointer",
                            }}
                          />
                        )}
                      </li>
                    ) : (
                      selectedTable.members.includes(user.id) && (
                        <li
                          key={index}
                          onClick={() => {
                            props.task.members.includes(user.id)
                              ? updateTaskMembers(user.id)
                              : addMember(user.id);
                          }}
                          className={s.memberLi}
                        >
                          <span>{user.username}</span>
                          {props.task.members.includes(user.id) && (
                            <FontAwesomeIcon
                              icon={faCheck}
                              style={{
                                color: "black",
                                fontSize: "0.6rem",
                                position: "absolute",
                                right: "0.25rem",
                                top: "0.45rem",
                                cursor: "pointer",
                              }}
                            />
                          )}
                        </li>
                      )
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskInfo;
