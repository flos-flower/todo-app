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
