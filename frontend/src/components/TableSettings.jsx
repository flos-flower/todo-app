import React, { useContext, useState, useEffect, useRef } from "react";
import s from "../styles/TableSettingsStyles.module.css";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGear,
  faUserPlus,
  faPlus,
  faX,
  faCrown,
  faUserTag,
  faSliders,
} from "@fortawesome/free-solid-svg-icons";
import {
  faTrashAlt,
  faUser,
  faCalendar,
  faClock,
} from "@fortawesome/free-regular-svg-icons";
import Context from "../context/Context";

let TableSettings = (props) => {
  let [visibleUserInvitation, setVisibleUserInvitation] = useState(false);
  let [visibleMemberList, setVisibleMemberList] = useState(false);
  let [visibleFiltersList, setVisibleFiltersList] = useState(false);
  let {
    userList,
    addMember,
    selectedTable,
    updateTableMembers,
    user,
    changeTableAdmin,
  } = useContext(Context);
  let [filtersList, setFiltersList] = useState([
    {
      checked: false,
      description: "No members",
      icon: faUser,
      color: "rgba(0, 0, 0, 0.07)",
      textColor: "grey",
    },
    {
      checked: false,
      description: "Tasks assigned to me",
      icon: faUser,
      color: "rgb(54, 217, 182)",
      textColor: "white",
    },
    {
      checked: false,
      description: "No dates",
      icon: faCalendar,
      color: "rgba(0, 0, 0, 0.07)",
      textColor: "grey",
    },
    {
      checked: false,
      description: "Not marked as complete",
      icon: faClock,
      color: "rgba(0, 0, 0, 0.07)",
      textColor: "grey",
    },
    {
      checked: false,
      description: "Overdue",
      icon: faClock,
      color: "rgb(254, 185, 55)",
      textColor: "white",
    },
    {
      checked: false,
      description: "Complete",
      icon: faClock,
      color: "rgb(0, 215, 0)",
      textColor: "white",
    },
  ]);
  let [inputUsername, setInputUsername] = useState("");
  let [tempTaskList, setTempTaskList] = useState("");

  const ref = useRef(null);
  const memberRef = useRef(null);
  const filterRef = useRef(null);

  let changeVisibility = () => {
    setVisibleUserInvitation(!visibleUserInvitation);
  };

  let changeMemberListVisibility = () => {
    setVisibleMemberList(!visibleMemberList);
  };

  let changeFilterListVisibility = () => {
    setVisibleFiltersList(!visibleFiltersList);
  };

  let filterChecked = (index) => {
    return new Promise((resolve, reject) => {
      const newState = filtersList.map((obj, obj_index) => {
        if (obj_index === index) {
          return { ...obj, checked: !obj.checked };
        }
        return obj;
      });

      setFiltersList(newState);
      resolve(newState);
    });
  };

  let filterTasks = async (index) => {
    filterChecked(index).then((newState) => {
      let filteredState = tempTaskList;
      if (newState[0].checked) {
        filteredState = filteredState.map((arr) => {
          return arr.filter((obj) => obj.members.length === 0);
        });
      }
      if (newState[1].checked) {
        filteredState = filteredState.map((arr) => {
          return arr.filter((obj) => obj.members.includes(user.user_id));
        });
      }
      if (newState[2].checked) {
        let datesArr = [];
        props.datesList.forEach((date) => {
          datesArr = [...datesArr, date.task];
        });
        filteredState = filteredState.map((arr) => {
          return arr.filter((object) => !datesArr.includes(object.id));
        });
      }
      if (newState[3].checked) {
        let datesArr = [];
        props.datesList.forEach((date) => {
          if (!date.complition) datesArr = [...datesArr, date.task];
        });
        filteredState = filteredState.map((arr) => {
          return arr.filter((object) => datesArr.includes(object.id));
        });
      }
      if (newState[4].checked) {
        let datesArr = [];
        props.datesList.forEach((date) => {
          if (dayjs(date.date) < dayjs() && !date.complition)
            datesArr = [...datesArr, date.task];
        });
        filteredState = filteredState.map((arr) => {
          return arr.filter((object) => datesArr.includes(object.id));
        });
      }
      if (newState[5].checked) {
        let datesArr = [];
        props.datesList.forEach((date) => {
          if (date.complition) datesArr = [...datesArr, date.task];
        });
        filteredState = filteredState.map((arr) => {
          return arr.filter((object) => datesArr.includes(object.id));
        });
      }

      props.setTaskList(filteredState);
    });
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
        filterRef.current &&
        !filterRef.current.contains(event.target) &&
        visibleFiltersList === true
      ) {
        changeFilterListVisibility && changeFilterListVisibility();
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [visibleFiltersList]);

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

  useEffect(() => {
    setTempTaskList(props.taskList);
  }, [props.taskList.length]);

  return (
    <div className={s.mainDiv}>
      <div className={s.settings} ref={ref}>
        <div className={s.filtersWrapper} ref={filterRef}>
          <div
            className={s.filtersSettings}
            onClick={changeFilterListVisibility}
          >
            <FontAwesomeIcon
              icon={faSliders}
              style={{
                fontSize: "0.9rem",
                marginRight: "0.3rem",
                color: "#212529",
              }}
            />
            <span className={s.filterIcon}>Filter</span>
          </div>
          {visibleFiltersList && (
            <div className={s.filtersList}>
              <span
                style={{ margin: "auto", fontSize: "0.9rem", color: "#808080" }}
              >
                Filter
              </span>
              <hr style={{ width: "95%", margin: "0.7rem auto" }} />
              {filtersList.map((filter, filter_index) => (
                <div key={filter_index}>
                  <input
                    type="checkbox"
                    defaultChecked={filter.checked}
                    style={{ cursor: "pointer" }}
                    onChange={() => {
                      filterTasks(filter_index);
                    }}
                  />
                  <div
                    className={s.filterMapIcons}
                    style={{
                      backgroundColor: filter.color,
                      color: filter.textColor,
                    }}
                  >
                    <FontAwesomeIcon icon={filter.icon} />
                  </div>
                  <span>{filter.description}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className={s.membersWrapper} ref={memberRef}>
          <div className={s.membersSettings}>
            <FontAwesomeIcon
              icon={faUser}
              style={{
                fontSize: "0.9rem",
                marginRight: "0.3rem",
                color: "#212529",
              }}
            />
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
                <span
                  style={{
                    margin: "auto",
                    fontSize: "0.9rem",
                    color: "#808080",
                  }}
                >
                  Members
                </span>
                <hr style={{ width: "95%", margin: "0.7rem auto" }} />
                {userList.map((member, index) => {
                  return member.id === selectedTable.user ? (
                    <li key={index}>
                      <span>{member.username}</span>
                      <FontAwesomeIcon
                        icon={faCrown}
                        className={s.crownIcon}
                        title="Admin"
                      />
                    </li>
                  ) : (
                    selectedTable.members.includes(member.id) && (
                      <li key={index}>
                        <span>{member.username}</span>
                        {selectedTable.user === user.user_id && (
                          <div>
                            <div
                              className={s.giveUser}
                              onClick={(e) =>
                                changeTableAdmin(e, selectedTable.id, member.id)
                              }
                            >
                              <FontAwesomeIcon
                                icon={faUserTag}
                                style={{
                                  fontSize: ".7rem",
                                }}
                                title="Pass admin rights"
                              />
                            </div>
                            <div
                              className={s.deleteUser}
                              onClick={(e) =>
                                updateTableMembers(
                                  e,
                                  selectedTable.id,
                                  member.id
                                )
                              }
                            >
                              <FontAwesomeIcon
                                icon={faTrashAlt}
                                style={{
                                  fontSize: ".7rem",
                                }}
                                title="Expel user from the table"
                              />
                            </div>
                          </div>
                        )}
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
