import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import s from "../styles/HeaderStyles.module.css";

const Header = () => {
  let { user, logoutUser} = useContext(AuthContext);
  let [profile, setProfile] = useState();

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
      .then((data) => setProfile(data));
  };

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
      <div className={s.logoutDiv}>
        {user && <img src={`${profile.picture}`}></img>}
        {user ? (
          <p className={s.logoutBtn} onClick={logoutUser}>
            Logout
          </p>
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
