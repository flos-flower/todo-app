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
  let [phoneNumber, setPhoneNumber] = useState(() => {
    if (profile[0].phone_number === null) return "";
    else return `${profile[0].phone_number}`;
  });
  let [email] = useState(`${profile[0].email}`);
  let [username] = useState(`${profile[0].username}`);

  let onNameChange = (e) => {
    setName(e.target.value);
  };

  let onSurnameChange = (e) => {
    setSurname(e.target.value);
  };

  let onPhoneChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  let phoneFieldFocus = () => {
    phoneNumber === "" && setPhoneNumber("+7");
  };

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
          <span>{profile[0].username}</span>
        </div>
        <form className={s.formDiv} onSubmit={handleProfileChange}>
          <label>
            Username
            <input
              disabled
              value={username}
              name="username"
              className={s.infoInput}
            />
          </label>
          <label>
            Email
            <input
              disabled
              value={email}
              name="email"
              className={s.infoInput}
            />
          </label>
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
          <label>
            Phone number
            <input
              onChange={onPhoneChange}
              value={phoneNumber}
              placeholder="Phone number"
              name="phone_number"
              className={s.infoInput}
              onFocus={phoneFieldFocus}
            />
          </label>
          <input type="submit" value="Save" />
        </form>
      </div>
    </div>
  );
};

export default ProfileInfo;
