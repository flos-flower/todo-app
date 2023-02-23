import React, { useContext, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Context from "../context/Context";
import s from "../styles/HeaderStyles.module.css";
import ProfileDropdown from "./ProfileDropdown";

const Header = () => {
  let { user, logoutUser, profile } = useContext(Context);
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
              <ProfileDropdown
                user={user}
                changeVisibility={changeVisibility}
                logoutUser={logoutUser}
              />
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
