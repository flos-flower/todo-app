import React, { useContext, useState, useEffect, useRef } from "react";
import s from "../styles/TableSettingsStyles.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faUserPlus, faPlus } from "@fortawesome/free-solid-svg-icons";
import Context from "../context/Context";

let TableSettings = (props) => {
  let [visibleUserInvitation, setVisibleUserInvitation] = useState(false);
  let { selectedTable, userList, addMember } = useContext(Context);
  let [inputUsername, setInputUsername] = useState("");

  const ref = useRef(null);

  let changeVisibility = () => {
    setVisibleUserInvitation(!visibleUserInvitation);
    console.log("efe");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        ref.current &&
        !ref.current.contains(event.target) &&
        visibleUserInvitation === true
      ) {
        changeVisibility && changeVisibility();
      }
    };
    document.addEventListener("mousedown", handleClickOutside, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, [visibleUserInvitation]);

  let onUsernameChange = (e) => {
    setInputUsername(e.target.value);
  };
  return (
    <div className={s.mainDiv}>
      <span>{selectedTable.name}</span>
      {console.log(selectedTable)}
      <div className={s.settings} ref={ref}>
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
                  user.username.includes(inputUsername) &&
                  inputUsername !== "" && (
                    <li key={index}>
                      <span>{user.username}</span>
                      <div><FontAwesomeIcon icon={faPlus} onClick={() => addMember(user.id)} className={s.addMember}/></div>
                    </li>
                  )
                );
              })}
            </ul>
          </div>
        )}
        <FontAwesomeIcon
          icon={faGear}
          className={s.settingGear}
          onClick={() => visibleUserInvitation === true && changeVisibility()}
        />
      </div>
    </div>
  );
};

export default TableSettings;
