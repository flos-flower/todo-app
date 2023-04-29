import React, { useContext, useState, useEffect, useRef } from "react";
import s from "../styles/TableSettingsStyles.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGear,
  faUserPlus,
  faPlus,
  faX,
  faCrown,
} from "@fortawesome/free-solid-svg-icons";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import Context from "../context/Context";

let TableSettings = (props) => {
  let [visibleUserInvitation, setVisibleUserInvitation] = useState(false);
  let [visibleMemberList, setVisibleMemberList] = useState(false);
  let { userList, addMember, selectedTable, updateTableMembers, user } =
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
            {visibleMemberList && (
              <ul className={s.membersList}>
                {userList.map((user, index) => {
                  return user.id === selectedTable.user ? (
                    <li key={index}>
                      <span>{user.username}</span>
                      <FontAwesomeIcon
                        icon={faCrown}
                        className={s.crownIcon}
                        title="Admin"
                      />
                    </li>
                  ) : (
                    selectedTable.members.includes(user.id) && (
                      <li key={index}>
                        <span>{user.username}</span>
                        <div
                          className={s.deleteUser}
                          onClick={(e) =>
                            updateTableMembers(e, selectedTable.id, user.id)
                          }
                        >
                          <FontAwesomeIcon
                            icon={faTrashAlt}
                            style={{
                              fontSize: ".7rem",
                            }}
                          />
                        </div>
                      </li>
                    )
                  );
                })}
              </ul>
            )}
          </div>
        </div>
        <FontAwesomeIcon
          icon={faUserPlus}
          className={s.settingAddUser}
          onClick={
            user.user_id === selectedTable.user
              ? () => changeVisibility()
              : undefined
          }
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
                    inputUsername !== "" &&
                    !selectedTable.members.includes(user.id) &&
                    selectedTable.user !== user.id && (
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
