import Context from "../context/Context";
import { useRef, useContext } from "react";
import s from "../styles/TaskInfoStyles.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faPaperclip } from "@fortawesome/free-solid-svg-icons";

const TaskInfo = (props) => {
  const refFile = useRef(null);
  const chooseFile = () => {
    refFile.current.click();
  };

  let { user, authTokens } = useContext(Context);

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
        props.fetchTasks();
      })
      .catch(function (error) {
        console.log("ERROR", error);
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
            right: "2%",
            top: "3%",
            cursor: "pointer",
          }}
        />
        <p>{props.taskName}</p>
        <div className={s.mainDiv}>
          <div className={s.mainContent}>
            <div className={s.descriptionDiv}>
              <p>Description</p>
              <textarea
                placeholder="Add a description"
                className={s.descriptionText}
                type="text"
              />
            </div>
            {props.attachmentsList !== null && (
              <div className={s.attachmentsDiv}>
                <p>Attachments</p>
              </div>
            )}
          </div>
          <div className={s.options}>
            <p>Add-ons</p>
            <form>
              <div className={s.attachFile} onClick={chooseFile}>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskInfo;
