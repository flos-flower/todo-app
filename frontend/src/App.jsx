import React from "react";
import "./styles/App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Header from "./components/Header";
import HomePageFunc from "./pages/HomePageFunc";
import ProfileInfo from "./components/ProfileInfo"

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Header />
          <Routes style={{ zIndex: 1 }}>
            <Route
              exact
              path="/"
              element={<PrivateRoute Component={HomePageFunc} />}
            />
            <Route element={<LoginPage />} path="/login" exact />
            <Route element={<RegisterPage />} path="/register" exact />
            <Route element={<ProfileInfo />} path="/profile" exact />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
