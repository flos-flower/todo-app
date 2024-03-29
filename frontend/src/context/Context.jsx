import React from "react";
import { createContext, useState, useEffect, useRef } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";

const Context = createContext();

export default Context;

export const ContextProvider = ({ children }) => {
  let [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );
  let [userList, setUserList] = useState([]);
  let [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwt_decode(localStorage.getItem("authTokens"))
      : null
  );
  let [loading, setLoading] = useState(true);

  let [profile, setProfile] = useState();

  let [tableList, setTableList] = useState([]);
  let [selectedTable, setSelectedTable] = useState();

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

  let fetchTable = () => {
    fetch("http://127.0.0.1:8000/api/table-list/", {
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
        setTableList(data);
        setSelectedTable(data[0]);
      });
  };

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
      navigate(0);
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
      console.log(
        JSON.stringify({
          email: e.target.email.value,
          username: e.target.username.value,
          password: e.target.password.value,
        })
      );
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
    const data = new FormData();
    data.append("picture", e.target.files[0]);
    data.append("user", user.user_id);
    data.append("email", profile[0].email);
    data.append("username", profile[0].username);
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
      .catch(function (error) {
        console.log("ERROR", error);
      });
  };

  let handleProfileChange = (e) => {
    var url = `http://127.0.0.1:8000/api/profile-update/${profile[0].id}`;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
      body: JSON.stringify({
        ...profile[0],
        picture: "",
        name: e.target.name.value,
        surname: e.target.surname.value,
        phone_number: e.target.phone_number.value,
        email: e.target.email.value,
        username:e.target.username.value,
      }),
    })
      .then((response) => {
        fetchProfile();
      })
      .catch(function (error) {
        console.log("ERROR", error);
      });
  };

  let createTable = (e) => {
    e.preventDefault();
    let title = e.target.title.value;
    let userid = jwt_decode(authTokens.access).user_id;
    let url = "http://127.0.0.1:8000/api/table-create/";
    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
      body: JSON.stringify({
        user: userid,
        name: title,
        members:[userid]
      }),
    })
      .then((response) => {
        fetchTable();
      })
      .catch(function (error) {
        console.log("ERROR", error);
      });
  };

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

  let deleteTable = (id) => {
    fetch(`http://127.0.0.1:8000/api/table-delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
    }).then((response) => {
      fetchTable();
    });
  };

  let updateTableMembers = (e, id, userid) => {
    e.preventDefault();
    let url = `http://127.0.0.1:8000/api/table-update/${id}`;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
      body: JSON.stringify({
        ...selectedTable,
        members: selectedTable.members.filter((user) => user !== userid),
      }),
    })
      .then((response) => {
        fetchTable();
      })
      .catch(function (error) {
        console.log("ERROR", error);
      });
  };

  let changeTableAdmin = (e, id, userid) => {
    e.preventDefault();
    let url = `http://127.0.0.1:8000/api/table-update/${id}`;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
      body: JSON.stringify({
        ...selectedTable,
        user:userid,
        members:[...selectedTable.members, selectedTable.user]
      }),
    })
      .then((response) => {
        fetchTable();
      })
      .catch(function (error) {
        console.log("ERROR", error);
      });
  };

  let addMember = (id) => {
    let url = `http://127.0.0.1:8000/api/table-update/${selectedTable.id}`;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
      body: JSON.stringify({
        ...selectedTable,
        members: [...selectedTable.members, id],
      }),
    })
      .then((response) => {
        fetchTable();
      })
      .catch(function (error) {
        console.log("ERROR", error);
      });
  };

  useEffect(() => {
    if (user) {
      fetchTable();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

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

  let contextData = {
    authTokens: authTokens,
    userList: userList,
    user: user,
    loginUser: loginUser,
    logoutUser: logoutUser,
    registerUser: registerUser,
    profile: profile,
    handleImageChange: handleImageChange,
    handleProfileChange: handleProfileChange,
    tableList: tableList,
    selectedTable: selectedTable,
    setSelectedTable: setSelectedTable,
    fetchTable: fetchTable,
    createTable: createTable,
    deleteTable: deleteTable,
    addMember: addMember,
    updateTableMembers: updateTableMembers,
    changeTableAdmin:changeTableAdmin
  };

  return (
    <Context.Provider value={contextData}>
      {loading ? null : children}
    </Context.Provider>
  );
};
