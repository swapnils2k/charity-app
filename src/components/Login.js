import { Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import Modal from "./Modal";
import { checkUserExists } from "../DataFunctions";

const Login = (props) => {
  const [error, setError] = useState();
  const [userid, setUserid] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const routeLink = `/charity/signup`;
  const onUserIdChange = (event) => {
    setUserid(event.target.value);
  };
  const onPasswordChange = (event) => {
    setPassword(event.target.value);
  };
  const onLogin = async (event) => {
    event.preventDefault();
    checkUserExists(userid.trim(), password.trim()).then((response) => {
      console.log(response);
      if (response !== null) {
        console.log(response);
        props.onLogin(userid, password, response.identity);
        navigate(`/charity/dashboard`);
      } else {
        setError({
          title: "Invalid input",
          message:
            "Please enter a valid Decentralized ID and password (non-empty values).",
        });
      }
    });
    // console.log(userid, password);
  };
  const resetErrorHandler = () => {
    setError(null);
  };
  return (
    <Fragment>
      {error && (
        <Modal
          title={error.title}
          message={error.message}
          onConfirm={resetErrorHandler}
        />
      )}
      <div className="login-container">
        <div className="pattern"></div>
        <form className="form">
          <div>
            <h3>Welcome Back!</h3>
          </div>

          {/* <label htmlFor="DEID" className="label">
            DE ID
          </label> */}
          <div>
            <input
              type="text"
              placeholder="Decentralized Identity"
              id="username"
              className="input"
              onChange={onUserIdChange}
            />
          </div>

          {/* <label htmlFor="password" className="label">
            Password
          </label> */}
          <div>
            <input
              type="password"
              placeholder="Password"
              id="password"
              className="input"
              onChange={onPasswordChange}
            />
          </div>

          <div>
            <Link to={`/charity/dashboard`}>
              <button className="button" onClick={onLogin}>
                SIGN-IN
              </button>
            </Link>
          </div>
          <div>
            Not a User? <Link to={routeLink}>Sign Up</Link> for FREE!
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default Login;
