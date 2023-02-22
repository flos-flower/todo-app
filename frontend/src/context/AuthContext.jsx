import React from "react";
import { createContext, useState, useEffect, useRef } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  let [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );
  let [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwt_decode(localStorage.getItem("authTokens"))
      : null
  );
  let [loading, setLoading] = useState(true);
  let [profile, setProfile] = useState();

  const dataFetchedRef = useRef(false);
  const navigate = useNavigate();

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
        setProfile(data);
      });
  };

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  let loginUser = async (e) => {
    e.preventDefault();
    let response = await fetch("http://127.0.0.1:8000/api/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: e.target.username.value,
        password: e.target.password.value,
      }),
    });
    let data = await response.json();
    if (response.status === 200) {
      setAuthTokens(data);
      setUser(jwt_decode(data.access));
      localStorage.setItem("authTokens", JSON.stringify(data));
      navigate("/");
    } else {
      alert("Something went wrong!");
    }
  };

  let registerUser = async (values, e) => {
    e.preventDefault();
    let response = await fetch("http://127.0.0.1:8000/api/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: e.target.email.value,
        username: e.target.username.value,
        password: e.target.password.value,
      }),
    });
    if (response.status === 200) {
      console.log(JSON.stringify({
        email: e.target.email.value,
        username: e.target.username.value,
        password: e.target.password.value,
      }))
      navigate("/login");
    } else {
      alert("Something went wrong!");
    }
  };

  let logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    navigate("/login");
  };

  let updateToken = async () => {
    console.log("Updated token!");
    let response = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: authTokens && authTokens.refresh }),
    });
    let data = await response.json();
    if (response.ok) {
      setAuthTokens(data);
      setUser(jwt_decode(data.access));
      localStorage.setItem("authTokens", JSON.stringify(data));
    } else {
      logoutUser();
    }
    if (loading) {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const data = new FormData()
    data.append('picture', e.target.files[0])
    data.append('user', user.user_id)
    var url = `http://127.0.0.1:8000/api/profile-update/${profile[0].id}`;
    fetch(url, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + String(authTokens.access),
      },
      body: data,
    })
      .then((response) => {
        fetchProfile();
      })
      .catch(function(error) {
        console.log("ERROR", error);
      });
  };

  let handleProfileChange = (e) => {
    e.preventDefault()
    var url = `http://127.0.0.1:8000/api/profile-update/${profile[0].id}`;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
      body: JSON.stringify({
        ...profile[0],
        picture: '',
        name: e.target.name.value,
        surname: e.target.surname.value,
      }),
    })
      .then((response) => {
        fetchProfile();
      })
      .catch(function(error) {
        console.log("ERROR", error);
      });
  }

  let contextData = {
    authTokens: authTokens,
    user: user,
    loginUser: loginUser,
    logoutUser: logoutUser,
    registerUser: registerUser,
    profile:profile,
    handleImageChange:handleImageChange,
    handleProfileChange:handleProfileChange,
  };

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    if (loading) {
      updateToken();
    }

    let fourMinutes = 1000 * 60 * 1;
    let interval = setInterval(() => {
      if (authTokens) {
        updateToken();
      }
    }, fourMinutes);
    return () => clearInterval(interval);
  }, [authTokens, loading]);

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
