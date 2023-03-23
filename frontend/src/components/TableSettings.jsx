import React, { useContext, useState, useEffect, useRef } from "react";
import s from "../styles/TableSettingsStyles.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGear,
  faUserPlus,
  faPlus,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import Context from "../context/Context";

let TableSettings = (props) => {
  let [visibleUserInvitation, setVisibleUserInvitation] = useState(false);
  let [visibleMemberList, setVisibleMemberList] = useState(false);
  let { userList, addMember, selectedTable, updateTableMembers } =
    useContext(Context);
  let [inputUsername, setInputUsername] = useState("");

  const ref = useRef(null);
  const memberRef = useRef(null);

  let changeVisibility = () => {
    setVisibleUserInvitation(!visibleUserInvitation);
  };

  let changeMemberListVisibility = () => {
    setVisibleMemberList(!visibleMemberList);
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
      <div className={s.settings} ref={ref}>
        <div className={s.membersWrapper} ref={memberRef}>
          <div className={s.membersSettings}>
            <span
              className={s.membersIcon}
              onClick={() => {
                changeMemberListVisibility();
                visibleUserInvitation === true && changeVisibility();
              }}
            >
              Members
            </span>
          </div>
          {visibleMemberList && (
            <ul className={s.membersList}>
              {userList.map((user, index) => {
                return (
                  selectedTable.members.includes(user.id) && (
                    <li key={index}>
                      <span>{user.username}</span>
                      <div
                        className={s.deleteUser}
                        onClick={(e) =>
                          updateTableMembers(e, selectedTable.id, user.id)
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          className="bi bi-trash"
                          viewBox="0 0 16 16"
                        >
                          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                          <path
                            fillRule="evenodd"
                            d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                          />
                        </svg>
                      </div>
                    </li>
                  )
                );
              })}
            </ul>
          )}
        </div>
        <FontAwesomeIcon
          icon={faUserPlus}
          className={s.settingAddUser}
          onClick={changeVisibility}
        />
        {visibleUserInvitation && (
          <div className={s.userInvitationBackground}>
            <div className={s.userInvitation}>
              <input
                value={inputUsername}
                onChange={(e) => onUsernameChange(e)}
                type="text"
                placeholder="Username"
              />
              <FontAwesomeIcon
                icon={faX}
                onClick={changeVisibility}
                style={{
                  color: "black",
                  fontSize: "0.6rem",
                  position: "absolute",
                  right: "3%",
                  top: "4.5%",
                  cursor: "pointer",
                }}
              />
              <ul>
                {userList.map((user, index) => {
                  return (
                    user.username.includes(inputUsername) &&
                    inputUsername !== "" && !selectedTable.members.includes(user.id) && (
                      <li key={index}>
                        <span>{user.username}</span>
                        <div
                          onClick={() => {
                            addMember(user.id);
                            changeVisibility();
                            setInputUsername("");
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faPlus}
                            className={s.addMember}
                          />
                        </div>
                      </li>
                    )
                  );
                })}
              </ul>
            </div>
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
