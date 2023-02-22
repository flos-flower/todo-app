import React, { useContext } from "react";
import Context from "../context/Context";
import s from "../styles/LoginStyles.module.css";

const LoginPage = () => {
  let { loginUser } = useContext(Context);
  return (
    <div className={s.formDiv}>
      <form className={s.submitLoginForm} onSubmit={loginUser}>
        <input type="text" name="username" placeholder="Enter Username" />
        <input type="password" name="password" placeholder="Enter Password" />
        <input className={s.submitLoginButton} type="submit" value="Sign in" />
      </form>
    </div>
  );
};

export default LoginPage;
