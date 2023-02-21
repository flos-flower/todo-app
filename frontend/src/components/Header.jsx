import React, { useContext, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import s from "../styles/HeaderStyles.module.css";

const Header = () => {
  let { user, logoutUser, profile } = useContext(AuthContext);
  let [drop, setDrop] = useState(false);
  const ref = useRef(null);

  let changeVisibility = () => {
    setDrop(!drop);
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

  return (
    <div className={s.headerDiv}>
      {window.location.href === "http://localhost:3000/" ? (
        <div className={`${s.homeBtn} ${s.selected}`}>
          <Link to="/">Home</Link>
        </div>
      ) : (
        <div className={s.homeBtn}>
          <Link to="/">Home</Link>
        </div>
      )}
      <div className={s.profileDiv}>
        {user ? (
          <div className={s.dropdownContainer} ref={ref}>
            {profile !== undefined ? (
              <img
                className={s.profileImage}
                src={`http://127.0.0.1:8000/Programming/DJ and ReactJS/todo-app/todo/media${profile[0].picture}`}
                alt="Profile"
                onClick={changeVisibility}
              />
            ) : (
              <img
                className={s.profileImage}
                alt="Profile"
                onClick={changeVisibility}
              />
            )}
            {drop && (
              <div className={s.dropdown}>
                <ul>
                  <li className={s.username}>
                    <p>{user.username}</p>
                  </li>
                  <hr />
                  <li onClick={changeVisibility} className={`${s.dropdownChild} ${s.profile}`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      fill="currentColor"
                      className={`bi bi-person ${s.profileIcon}`}
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z" />
                    </svg>
                    <Link to="/profile">Profile</Link>
                  </li>
                  <hr />
                  <li
                    className={s.dropdownChild}
                    onClick={(event) => {
                      logoutUser();
                      changeVisibility();
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      fill="currentColor"
                      className={`bi bi-box-arrow-right ${s.signoutIcon}`}
                      viewBox="0 0 16 16"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"
                      />
                      <path
                        fill-rule="evenodd"
                        d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"
                      />
                    </svg>
                    <p>Sign out</p>
                  </li>
                </ul>
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
              <div>
                <Link to="/login">Login</Link>
              </div>
            )}
            {window.location.href === "http://localhost:3000/register" ? (
              <div className={s.selected}>
                <Link to="/register">Register</Link>
              </div>
            ) : (
              <div>
                <Link to="/register">Register</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
