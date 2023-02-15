import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import s from "../styles/HeaderStyles.module.css";

const Header = () => {
  let { user, logoutUser, authTokens } = useContext(AuthContext);
  let [profile, setProfile] = useState();
  let [drop, setDrop] = useState(false);

  let fetchProfile = () => {
    fetch("http://127.0.0.1:8000/api/profile/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
    })
      .then((response) => {
        if (response.status === 200) return response.json();
      })
      .then((data) => {
        console.log(data);
        setProfile(data);
      });
  };

  let changeVisibility = () => {
    setDrop(!drop);
  };

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  if (profile !== undefined)
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
            <div className={s.dropdownContainer}>
              <img
                className={s.profileImage}
                src={`http://127.0.0.1:8000/Programming/DJ and ReactJS/todo-app/todo/media${profile[0].picture}`}
                alt="Profile"
                onClick={changeVisibility}
              />
              {drop && (
                <div className={s.dropdown}>
                  <ul>
                    <li className={s.dropdownChild}>
                      <Link to='/profile'>Profile</Link>
                    </li>
                    <hr />
                    <li
                      className={s.dropdownChild}
                      onClick={(event) => {
                        logoutUser();
                        changeVisibility();
                      }}
                    >
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
