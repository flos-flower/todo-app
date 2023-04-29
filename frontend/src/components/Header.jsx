import React, { useContext, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Context from "../context/Context";
import s from "../styles/HeaderStyles.module.css";
import ProfileDropdown from "./ProfileDropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faX,
  faCrown,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import Table from "./Table";

const Header = () => {
  let {
    user,
    logoutUser,
    profile,
    selectedTable,
    setSelectedTable,
    tableList,
    createTable,
    deleteTable,
  } = useContext(Context);

  let [drop, setDrop] = useState(false);
  let [tableSelectVisible, setTableSelectVisible] = useState(false);
  let [tableFormVisible, setTableFormVisible] = useState(false);

  const ref = useRef(null);
  const tableRef = useRef(null);

  let changeVisibility = () => {
    setDrop(!drop);
  };

  let changeSelectVisibility = () => {
    setTableSelectVisible(!tableSelectVisible);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target) && drop === true) {
        changeVisibility && changeVisibility();
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [changeVisibility]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        tableRef.current &&
        !tableRef.current.contains(event.target) &&
        tableSelectVisible === true
      ) {
        changeSelectVisibility && changeSelectVisibility();
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [changeSelectVisibility]);

  return (
    <div className={s.headerDiv}>
      {user && (
        <div className={s.homeBtn}>
          <Link to="/">
            <FontAwesomeIcon icon={faHouse} />
          </Link>
        </div>
      )}
      {user ? (
        <div className={s.profileDiv}>
          {tableList.length !== 0 &&
            window.location.href === "http://localhost:3000/" && (
              <div
                className={s.selectTable}
                onClick={() => {
                  setTableSelectVisible(!tableSelectVisible);
                }}
                ref={tableRef}
              >
                <span className={s.selectTableName}>{selectedTable.name}</span>
                {tableSelectVisible && (
                  <ul className={s.tableOptions}>
                    {tableList.map((table, index) => {
                      return (
                        <li onClick={() => setSelectedTable(table)} key={index}>
                          {table.user === user.user_id ? (
                            <FontAwesomeIcon
                              icon={faCrown}
                              className={s.crownIcon}
                              title="You are an admin of this table"
                            />
                          ) : (
                            <FontAwesomeIcon
                              icon={faUser}
                              className={s.memberIcon}
                              title="You are a member of this table"
                            />
                          )}
                          {table.name}
                          {table.user === user.user_id && (
                            <div
                              onClick={() => deleteTable(table.id)}
                              className={s.deleteTable}
                            >
                              <FontAwesomeIcon
                                icon={faTrashAlt}
                                style={{
                                  fontSize: ".7rem",
                                }}
                              />
                            </div>
                          )}
                        </li>
                      );
                    })}
                    <li
                      className={s.createTableDiv}
                      onClick={() => setTableFormVisible(!tableFormVisible)}
                    >
                      Create<span className={s.plus}>+</span>
                    </li>
                  </ul>
                )}
              </div>
            )}
          <div className={s.dropdownContainer} ref={ref}>
            {profile !== undefined ? (
              <img
                className={s.profileImage}
                src={`http://127.0.0.1:8000/Programming/DJ and ReactJS/todo-app/todo/media${profile[0].picture}`}
                alt="Profile"
                onClick={() => {
                  setDrop(!drop);
                }}
              />
            ) : (
              <img
                className={s.profileImage}
                alt="Profile"
                onClick={() => {
                  setDrop(!drop);
                }}
              />
            )}
            {drop && (
              <ProfileDropdown
                user={user}
                changeVisibility={() => {
                  setDrop(!drop);
                }}
                logoutUser={logoutUser}
              />
            )}
          </div>
          {tableFormVisible && (
            <div className={s.visibleTableForm}>
              <Table
                createTable={createTable}
                changeVisibility={() => setTableFormVisible(!tableFormVisible)}
              />
              <FontAwesomeIcon
                icon={faX}
                onClick={() => setTableFormVisible(!tableFormVisible)}
                style={{
                  color: "black",
                  fontSize: "0.6rem",
                  position: "absolute",
                  right: "40.5%",
                  top: "31%",
                  cursor: "pointer",
                }}
              />
            </div>
          )}
        </div>
      ) : (
        <div className={s.authDiv}>
          {window.location.href === "http://localhost:3000/login" ? (
            <div className={s.selected}>
              <Link to="/login">Login</Link>
            </div>
          ) : (
            <div className={s.resting}>
              <Link to="/login">Login</Link>
            </div>
          )}
          {window.location.href === "http://localhost:3000/register" ? (
            <div className={s.selected}>
              <Link to="/register">Register</Link>
            </div>
          ) : (
            <div className={s.resting}>
              <Link to="/register">Register</Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Header;
