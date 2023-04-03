import s from "../styles/TaskInfoStyles.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

const TaskInfo = (props) => {
  return (
    <div className={s.TaskInfoContainer}>
      <div className={s.TaskInfoDiv}>
        {console.log(props.column)}
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
        <div className={s.mainDiv}>
          <p>{props.taskName}</p>
          <p>Description</p>
          <textarea placeholder="Add a description" className={s.descriptionText} type="text" />
        </div>
      </div>
    </div>
  );
};

export default TaskInfo;
