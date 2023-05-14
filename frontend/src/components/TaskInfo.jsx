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
import {
  faCommentAlt,
  faImage,
  faTrashAlt,
  faSquareCheck,
} from "@fortawesome/free-regular-svg-icons";

const TaskInfo = (props) => {
  const refFile = useRef(null);
  const refImage = useRef(null);
  const memberRef = useRef(null);

  let [descEdit, setDescEdit] = useState(false);
  let [descValue, setDescValue] = useState(
    props.task.description ? props.task.description : undefined
  );
  let [visibleMemberList, setVisibleMemberList] = useState(false);
  let [visibleCheckCreation, setVisibleCheckCreation] = useState(false);
  let [checkboxValue, setCheckboxValue] = useState("");
  let [checkboxEditValue, setCheckboxEditValue] = useState("");
  let [checkboxUpdateTag, setCheckboxUpdateTag] = useState([]);

  let { userList, selectedTable, authTokens } = useContext(Context);

  const chooseFile = () => {
    refFile.current.click();
  };

  const chooseCover = () => {
    refImage.current.click();
  };

  let changeMemberListVisibility = () => {
    setVisibleMemberList(!visibleMemberList);
  };

  let changeCheckboxInputVisibility = () => {
    setVisibleCheckCreation(!visibleCheckCreation);
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
        image: "",
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
        image: "",
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
    var url = `http://127.0.0.1:8000/api/attachment-upload/`;
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

  const handleCoverChange = (e) => {
    const data = new FormData();
    data.append("image", e.target.files[0]);
    var url = `http://127.0.0.1:8000/api/task-image-update/${props.task.id}`;
    fetch(url, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + String(authTokens.access),
      },
      body: data,
    })
      .then((response) => {
        props.fetchTasks();
      })
      .catch(function (error) {
        console.log("ERROR", error);
      });
  };

  const deleteCover = () => {
    var url = `http://127.0.0.1:8000/api/task-image-delete/${props.task.id}`;
    fetch(url, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + String(authTokens.access),
      },
    })
      .then((response) => {
        props.fetchTasks();
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
        image: "",
      }),
    })
      .then((response) => {
        props.fetchTasks();
      })
      .catch(function (error) {
        console.log("ERROR", error);
      });
  };

  let complitionChange = (check) => {
    let url = `http://127.0.0.1:8000/api/check-box-update/${check.id}`;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
      body: JSON.stringify({
        complition: !check.complition,
        description: check.description,
      }),
    })
      .then((response) => {
        props.fetchCheckboxes();
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

  let addCheckboxText = () => {
    let url = `http://127.0.0.1:8000/api/check-box-create/`;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
      body: JSON.stringify({
        description: checkboxValue,
        task: props.task.id,
      }),
    })
      .then((response) => {
        props.fetchCheckboxes();
      })
      .catch(function (error) {
        console.log("ERROR", error);
      });
  };

  let deleteCheckbox = (id) => {
    fetch(`http://127.0.0.1:8000/api/check-box-delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
    }).then((response) => {
      props.fetchCheckboxes();
    });
  };

  let changeUpdateTag = (index) => {
    let checkboxes = [...checkboxUpdateTag];
    for (let i = 0; i < checkboxUpdateTag.length; i++) {
      if (i !== index) checkboxes[i] = false;
    }
    let checkbox = checkboxes[index];
    checkboxes[index] = !checkbox;
    setCheckboxUpdateTag(checkboxes);
  };

  let updateCheckboxText = (updatedCheck) => {
    let url = `http://127.0.0.1:8000/api/check-box-update/${updatedCheck.id}`;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
      body: JSON.stringify({
        description: checkboxEditValue,
        complition: updatedCheck.complition,
      }),
    })
      .then((response) => {
        props.fetchCheckboxes();
      })
      .catch(function (error) {
        console.log("ERROR", error);
      });
  };

  return (
    <div className={s.TaskInfoContainer}>
      <div className={s.TaskInfoDiv}>
        {props.task.image && (
          <img
            className={s.taskImage}
            src={`http://127.0.0.1:8000/Programming/DJ and ReactJS/todo-app/todo/media${props.task.image}`}
          />
        )}
        <div className={s.closeTaskInfo} onClick={props.changeVisibility}>
          <FontAwesomeIcon icon={faX} />
        </div>
        {props.task.image && (
          <div className={s.deleteCover} onClick={deleteCover}>
            <FontAwesomeIcon icon={faTrashAlt} />
          </div>
        )}
        <p>{props.taskName}</p>
        <div className={s.mainDiv}>
          <div className={s.mainContent}>
            <div className={s.descriptionDiv}>
              <div className={s.descDiv}>
                <FontAwesomeIcon
                  icon={faCommentAlt}
                  style={{
                    fontSize: "0.9rem",
                    marginRight: "0.6rem",
                    marginLeft: "-1.5rem",
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
                    marginRight: "0.6rem",
                    marginLeft: "-1.5rem",
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
            <div className={s.checkListDiv}>
              <FontAwesomeIcon
                icon={faSquareCheck}
                style={{
                  color: "black",
                  fontSize: "1rem",
                  marginRight: "0.6rem",
                  marginLeft: "-1.5rem",
                }}
              />
              <span>Checklist</span>
              <div className={s.checkBoxesContainer}>
                <div className={s.checkBoxesList}>
                  {props.checkList && (
                    <div
                      className={s.checkListMapDiv}
                      style={{
                        marginBottom:
                          props.checkList.filter(
                            (check) => check.task === props.task.id
                          ).length !== 0
                            ? "1rem"
                            : "0",
                      }}
                    >
                      {props.checkList.map((check, check_index) => {
                        return (
                          check.task === props.task.id && (
                            <div key={check_index}>
                              <input
                                type="checkbox"
                                defaultChecked={check.complition}
                                onChange={() => complitionChange(check)}
                              />
                              {checkboxUpdateTag[check_index] ? (
                                <div className={s.editingCheckbox}>
                                  <textarea
                                    name="checkboxEditValue"
                                    value={checkboxEditValue}
                                    placeholder="Add text"
                                    className={s.checkboxValue}
                                    type="text"
                                    autoFocus
                                    onChange={(e) =>
                                      setCheckboxEditValue(e.target.value)
                                    }
                                  />
                                  <div className={s.checkboxButtonsDiv}>
                                    <div
                                      className={s.saveValue}
                                      onClick={() => {
                                        changeUpdateTag(check_index);
                                        updateCheckboxText(check);
                                      }}
                                    >
                                      <span>Save</span>
                                    </div>
                                    <div
                                      className={s.cancelCreation}
                                      onClick={() => {
                                        changeUpdateTag(check_index);
                                      }}
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
                                  </div>
                                </div>
                              ) : (
                                <div className={s.checkboxDesc}>
                                  <span
                                    style={{
                                      textDecoration: check.complition
                                        ? "line-through"
                                        : "none",
                                    }}
                                    onClick={() => {
                                      changeUpdateTag(check_index);
                                      setCheckboxEditValue(check.description);
                                    }}
                                  >
                                    {check.description}
                                  </span>
                                  <div
                                    onClick={
                                      props.user.user_id === selectedTable.user
                                        ? () => {
                                            deleteCheckbox(check.id);
                                          }
                                        : undefined
                                    }
                                    className={s.checkboxDelete}
                                  >
                                    <FontAwesomeIcon
                                      icon={faTrashAlt}
                                      style={{
                                        fontSize: ".8rem",
                                      }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        );
                      })}
                    </div>
                  )}
                  {visibleCheckCreation ? (
                    <div className={s.checkboxCreation}>
                      <textarea
                        name="checkboxValue"
                        value={checkboxValue}
                        placeholder="Add text"
                        className={s.checkboxValue}
                        type="text"
                        autoFocus
                        onChange={(e) => setCheckboxValue(e.target.value)}
                      />
                      <div className={s.checkboxButtonsDiv}>
                        <div
                          className={s.saveValue}
                          onClick={() => {
                            changeCheckboxInputVisibility();
                            checkboxValue !== "" && addCheckboxText();
                            setCheckboxValue("");
                          }}
                        >
                          <span>Save</span>
                        </div>
                        <div
                          className={s.cancelCreation}
                          onClick={() => {
                            changeCheckboxInputVisibility();
                            setCheckboxValue("");
                          }}
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
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div
                        className={s.addCheck}
                        onClick={changeCheckboxInputVisibility}
                      >
                        <span>Add an item</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
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
            <form>
              <div className={s.addOptions} onClick={chooseCover}>
                <FontAwesomeIcon
                  icon={faImage}
                  style={{
                    color: "black",
                    fontSize: ".75rem",
                    marginRight: ".3rem",
                  }}
                />
                <span>Cover</span>
              </div>
              {props.user.user_id === selectedTable.user ? (
                <input
                  type="file"
                  accept="image/*"
                  ref={refImage}
                  onChange={handleCoverChange}
                />
              ) : (
                <input
                  type="file"
                  accept="image/*"
                  ref={refImage}
                  onChange={handleCoverChange}
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
