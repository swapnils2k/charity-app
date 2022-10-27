import { Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import Modal from "./Modal";
import { db } from "../Firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

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
    const userRef = collection(db, "users");
    const q = query(
      userRef,
      where("user_id", "==", userid),
      where("password", "==", password)
    );
    const querySnapshot = await getDocs(q);
    console.log("query: ", querySnapshot);
    querySnapshot.forEach((doc) => {
      if (doc.data() != null) {
        props.onLogin(userid, password);
        navigate(`/charity/dashboard`);
      }
      console.log(doc.id, " => ", doc.data());
    });
    setError({
      title: "Invalid input",
      message:
        "Please enter a valid Decentralized ID and password (non-empty values).",
    });
    console.log(querySnapshot);
    console.log(userid, password);
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
