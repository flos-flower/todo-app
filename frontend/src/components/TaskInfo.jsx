import Context from "../context/Context";
import { useRef, useContext, useState } from "react";
import s from "../styles/TaskInfoStyles.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faPaperclip, faUser } from "@fortawesome/free-solid-svg-icons";

const TaskInfo = (props) => {
  const refFile = useRef(null);
  const chooseFile = () => {
    refFile.current.click();
  };

  let [descEdit, setDescEdit] = useState(false);
  let [descValue, setDescValue] = useState(props.task.description);
  let [visibleMemberList, setVisibleMemberList] = useState(false);

  let { userList, selectedTable, authTokens } = useContext(Context);

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
    console.log(e.target.files);
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
                <span>Description</span>
                {props.task.description && descEdit === false && (
                  <div
                    className={s.startDescEdit}
                    onClick={() => setDescEdit(!descEdit)}
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
                  onClick={() => setDescEdit(!descEdit)}
                >
                  <div className={s.descText}>
                    <p>{props.task.description}</p>
                  </div>
                </div>
              ) : (
                <textarea
                  placeholder="Add a description"
                  className={s.descriptionAdd}
                  type="text"
                  onClick={() => setDescEdit(!descEdit)}
                />
              )}
            </div>
            {props.attachmentsList.some((e) => e.task === props.task.id) && (
              <div className={s.attachmentsDiv}>
                <p>Attachments</p>
                <div className={s.attachmentsContainer}>
                  {props.attachmentsList.map((attachment, index) => {
                    return (
                      attachment.task === props.task.id && (
                        <div key={index} className={s.attachmentItem}>
                          <a
                            href={`http://127.0.0.1:8000/Programming/DJ and ReactJS/todo-app/todo/media${attachment.file}`}
                            target="_blank"
                          >
                            <div className={s.attachmentImage}></div>
                          </a>
                          <div>
                            <span>
                              {attachment.file.replace(/^.*[\\\/]/, "")}
                            </span>
                            <div
                              className={s.deleteAttachment}
                              onClick={() => deleteAttachment(attachment.id)}
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
              <input
                type="file"
                multiple
                ref={refFile}
                onChange={handleFileChange}
              />
            </form>
            <div
              className={s.addOptions}
              onClick={() => setVisibleMemberList(!visibleMemberList)}
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
              {visibleMemberList && (
                <ul className={s.membersList}>
                  {userList.map((user, index) => {
                    return user.id === selectedTable.user ? (
                      <li
                        key={index}
                        onClick={() => {
                          setVisibleMemberList(!visibleMemberList);
                          addMember(user.id);
                        }}
                      >
                        <span>{user.username}</span>
                      </li>
                    ) : (
                      selectedTable.members.includes(user.id) && (
                        <li
                          key={index}
                          onClick={() => {
                            setVisibleMemberList(!visibleMemberList);
                            addMember(user.id);
                          }}
                        >
                          <span>{user.username}</span>
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
