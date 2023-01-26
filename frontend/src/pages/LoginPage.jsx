import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import "../styles/LoginStyles.css";

const LoginPage = () => {
  let { loginUser } = useContext(AuthContext);
  return (
    <div className="formDiv">
      <form className="submitLoginForm" onSubmit={loginUser}>
        <input type="text" name="username" placeholder="Enter Username" />
        <input type="password" name="password" placeholder="Enter Password" />
        <input className="submitLoginButton" type="submit" value="Sign in" />
      </form>
    </div>
  );
};

export default LoginPage;
