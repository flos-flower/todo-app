import React, { useContext, useState } from "react";
import s from "../styles/TableSettingsStyles.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import Context from "../context/Context";

let TableSettings = (props) => {
  let [visibleUserInvitation, setVisibleUserInvitation] = useState(false);
  let { selectedTable, userList } = useContext(Context);
  let [inputUsername, setInputUsername] = useState("");

  let changeVisibility = () => {
    setVisibleUserInvitation(!visibleUserInvitation)
    console.log('efe')
  }

  let onUsernameChange = (e) => {
    setInputUsername(e.target.value);
  };
  return (
    <div className={s.mainDiv}>
      <span>{selectedTable.name}</span>
      <div className={s.settings}>
        <FontAwesomeIcon
          icon={faUserPlus}
          className={s.settingAddUser}
          onClick={changeVisibility}
        />
        {visibleUserInvitation && (
          <div className={s.userInvitation}>
            <input
              value={inputUsername}
              onChange={(e) => onUsernameChange(e)}
              type="text"
              placeholder="Username"
            />
            <ul>
              {userList.map((user, index) => {
                return (
                  (user.username.includes(inputUsername) && inputUsername !== '') && (
                    <li key={index}>{user.username}</li>
                  )
                );
              })}
            </ul>
          </div>
        )}
        <FontAwesomeIcon icon={faGear} className={s.settingGear} />
      </div>
    </div>
  );
};

export default TableSettings;
