import React, { useContext, useState, useEffect } from "react";
import Context from "../context/Context";
import s from "../styles/RegisterStyles.module.css";
import { useForm } from "react-hook-form";

const RegisterPage = () => {
  let [userList, setUserList] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  let fetchUsers = () => {
    fetch("http://127.0.0.1:8000/api/users/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 200) return response.json();
      })
      .then((data) => setUserList(data));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const uniqueUsername = (value) => {
    for (let i = 0; i < userList.length; i++)
      if (value === userList[i].username) return "Username already in use";
  };

  const uniqueEmail = (value) => {
    for (let i = 0; i < userList.length; i++)
      if (value === userList[i].email) return "Email already in use";
  };

  let { registerUser } = useContext(Context);
  return (
    <div className={s.formDiv}>
      <form
        onSubmit={handleSubmit(registerUser)}
        className={s.submitForm}
      >
        <input
          type="text"
          name="email"
          placeholder="Email"
          {...register("email", {
            required: "Please enter email",
            pattern: {
              value: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              message: "Wrong email format",
            },
            validate: uniqueEmail,
          })}
        />
        {errors.email && <p>{errors.email.message}</p>}
        <input
          type="text"
          name="username"
          placeholder="Username"
          {...register("username", {
            required: "Please enter the username",
            validate: uniqueUsername,
          })}
        />
        {errors.username && <p>{errors.username.message}</p>}
        <input
          type="password"
          name="password"
          placeholder="Password"
          {...register("password", { required: "Please enter the password" })}
        />
        {errors.password && <p>{errors.password.message}</p>}
        <input className={s.submitButton} type="submit" value="Sign up" />
      </form>
    </div>
  );
};

export default RegisterPage;
