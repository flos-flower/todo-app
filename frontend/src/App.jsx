import React from "react";
import "./styles/App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute";
import AuthRoute from "./utils/AuthRoute";
import { ContextProvider } from "./context/Context";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import ProfileInfo from "./components/ProfileInfo"

function App() {
  return (
    <div className="App">
      <Router>
        <ContextProvider>
          <Header />
          <Routes style={{ zIndex: 1 }}>
            <Route
              exact
              path="/"
              element={<PrivateRoute Component={HomePage} />}
            />
            <Route
              exact
              path="/login"
              element={<AuthRoute Component={LoginPage} />}
            />
            <Route
              exact
              path="/register"
              element={<AuthRoute Component={RegisterPage} />}
            />
            <Route element={<ProfileInfo />} path="/profile" exact />
          </Routes>
        </ContextProvider>
      </Router>
    </div>
  );
}

export default App;
