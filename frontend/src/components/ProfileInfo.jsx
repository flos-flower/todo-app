import React, { useContext} from "react";
import s from "../styles/ProfileStyles.module.css";
import AuthContext from "../context/AuthContext";

const ProfileInfo = () => {
  let { user, profile, handleImageChange, isLoading } = useContext(AuthContext);

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
              <input type="file" accept="image/*" title=" " name="image" onChange={handleImageChange}></input>
            </div>
            <span>{user.username}</span>
          </div>
          <form className={s.formDiv}>
              <input placeholder="Name" name="name" className={s.infoInput} />
              <input placeholder="Last name" name="surname" className={s.infoInput} />
              <input type='submit' className={s.submitButton} />
          </form>
        </div>
      </div>
    );
};

export default ProfileInfo;
