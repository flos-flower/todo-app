import React, { useContext } from "react";
import s from "../styles/ProfileStyles.module.css";
import AuthContext from "../context/AuthContext";

const ProfileInfo = () => {
  let { user, profile } = useContext(AuthContext);

  if (profile !== undefined)
    return (
      <div className={s.profileDiv}>
        <div className={s.infoDiv}>
          <div className={s.basicInfo}>
            <div className={s.uploadWrapper}>
              <img
                className={s.profileImage}
                src={`http://127.0.0.1:8000/Programming/DJ and ReactJS/todo-app/todo/media${profile[0].picture}`}
                alt="Profile"
              />
              <input type="file" title=" "></input>
            </div>
            <span>{user.username}</span>
          </div>
          <form>
            <input></input>
          </form>
        </div>
      </div>
    );
};

export default ProfileInfo;
