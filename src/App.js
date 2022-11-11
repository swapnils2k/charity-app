import { Fragment, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import DashboardRedirect from "./components/DashboardRedirect";
import Web3 from "web3";
import { checkDonorExists } from "./Web3Client";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [identity, setIdentity] = useState();
  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") === "1") {
      setIsLoggedIn(true);
    }
    // checkDonorExists()
    //   .then((response) => {
    //     console.log(response);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  }, []);
  const loginHandler = async (userid, password, identity) => {
    localStorage.setItem("isLoggedIn", "1");
    localStorage.setItem("userid", userid);
    localStorage.setItem("identity", identity);
    setIsLoggedIn(true);
    setIdentity(identity);
  };

  const logoutHandler = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userid");
    localStorage.removeItem("identity");
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
                <DashboardRedirect
                  onLogout={logoutHandler}
                  loggedIn={isLoggedIn}
                />
              ) : (
                <Login onLogin={loginHandler} />
              )
            }
          />
          <Route
            path="/charity/login"
            element={
              isLoggedIn === true ? (
                <DashboardRedirect
                  onLogout={logoutHandler}
                  loggedIn={isLoggedIn}
                />
              ) : (
                <Login onLogin={loginHandler} />
              )
            }
          />
          <Route
            path="/charity/signup"
            element={
              isLoggedIn === true ? (
                <DashboardRedirect
                  onLogout={logoutHandler}
                  loggedIn={isLoggedIn}
                />
              ) : (
                <SignUp onLogin={loginHandler} />
              )
            }
          />
          <Route
            path="/charity/dashboard"
            element={
              <DashboardRedirect
                onLogout={logoutHandler}
                loggedIn={isLoggedIn}
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </Fragment>
  );
}

export default App;
