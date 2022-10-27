import { Fragment, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Dashboard from "./components/Dashboard";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") === "1") {
      setIsLoggedIn(true);
    }
  }, []);
  const loginHandler = async (userid, password) => {
    localStorage.setItem("isLoggedIn", "1");
    localStorage.setItem("userid", userid);
    setIsLoggedIn(true);
  };

  const logoutHandler = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
  };

  return (
    <Fragment>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn === true ? (
                <Dashboard onLogout={logoutHandler} />
              ) : (
                <Login onLogin={loginHandler} alreadyLoggedIn={isLoggedIn} />
              )
            }
          />
          <Route
            path="/charity/login"
            element={
              isLoggedIn === true ? (
                <Dashboard onLogout={logoutHandler} />
              ) : (
                <Login onLogin={loginHandler} alreadyLoggedIn={isLoggedIn} />
              )
            }
          />
          <Route
            path="/charity/signup"
            element={
              isLoggedIn === true ? (
                <Dashboard onLogout={logoutHandler} />
              ) : (
                <SignUp onLogin={loginHandler} alreadyLoggedIn={isLoggedIn} />
              )
            }
          />
          <Route
            path="/charity/dashboard"
            element={
              <Dashboard onLogout={logoutHandler} loggedIn={isLoggedIn} />
            }
          />
        </Routes>
      </BrowserRouter>
    </Fragment>
  );
}

export default App;
