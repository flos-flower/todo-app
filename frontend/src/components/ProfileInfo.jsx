import React, { useContext } from "react";
import s from "../styles/ProfileStyles.module.css";
import Context from "../context/Context";
import { useState } from "react";

const ProfileInfo = () => {
  let { user, profile, handleImageChange, handleProfileChange } =
    useContext(Context);
  let [name, setName] = useState(() => {
    if (profile[0].name === null) return "";
    else return `${profile[0].name}`;
  });
  let [surname, setSurname] = useState(() => {
    if (profile[0].surname === null) return "";
    else return `${profile[0].surname}`;
  });

  let onNameChange = (e) => {
    setName(e.target.value);
  };

  let onSurnameChange = (e) => {
    setSurname(e.target.value);
  };

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
              <input
                type="file"
                accept="image/*"
                title=" "
                name="image"
                onChange={handleImageChange}
              ></input>
            </div>
            <span>{user.username}</span>
          </div>
          <form className={s.formDiv} onSubmit={handleProfileChange}>
            <label>
              Name
              <input
                onChange={onNameChange}
                value={name}
                placeholder="Name"
                name="name"
                className={s.infoInput}
              />
            </label>
            <label>
              Last name
              <input
                onChange={onSurnameChange}
                value={surname}
                placeholder="Last name"
                name="surname"
                className={s.infoInput}
              />
            </label>
            <input type="submit" value="Save" />
          </form>
        </div>
      </div>
    );
};

export default ProfileInfo;
