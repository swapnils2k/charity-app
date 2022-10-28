import { Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Modal from "./Modal";
import "./Login.css";
import { db } from "../Firebase";
import { collection, doc, setDoc } from "firebase/firestore";

const SignUp = (props) => {
  const [error, setError] = useState();
  const [name, setName] = useState("");
  const [identity, setIdentity] = useState("");
  const [userid, setUserid] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const navigate = useNavigate();
  const onNameChange = (event) => {
    setName(event.target.value);
  };
  const onUserIdChange = (event) => {
    setUserid(event.target.value);
  };
  const onPasswordChange = (event) => {
    setPassword(event.target.value);
  };
  const onConfirmPassword = (event) => {
    setconfirmPassword(event.target.value);
  };
  const onIdentityChange = (event) => {
    setIdentity(event.target.value);
  };
  const onSignUp = (event) => {
    event.preventDefault();
    if (
      (password.trim().length > 0 &&
        password.trim() !== confirmPassword.trim()) ||
      password.trim().length === 0
    ) {
      setError({
        title: "Password doesnt match",
        message:
          "Please make sure that the passwords match (non-empty values).",
      });
      return;
    }
    props.onLogin(userid, password);
    const userRef = doc(collection(db, "users"));
    const data = {
      user_id: userid.trim(),
      name: name,
      password: password.trim(),
      identity: identity,
    };
    setDoc(userRef, data);
    navigate(`/charity/dashboard`);
    if (identity === "donator") {
      navigate(`/charity/dashboard/donator`);
    } else if (identity === "organization") {
      navigate(`/charity/dashboard/organization`);
    } else {
      navigate(`/charity/dashboard/beneficiary`);
    }
  };
  const resetErrorHandler = () => {
    setError(null);
  };
  const routeLink = `/charity/login`;
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
          <h3>Sign Up Here</h3>
          <input
            type="text"
            placeholder="Enter Name"
            id="name"
            className="input"
            onChange={onNameChange}
          />

          {/* <label htmlFor="DEID" className="label">
          DE ID
        </label> */}
          <input
            type="text"
            placeholder="Decentralized Identity"
            id="username"
            className="input"
            onChange={onUserIdChange}
          />

          {/* <label htmlFor="password" className="label">
          Password
        </label> */}
          <input
            type="password"
            placeholder="Enter Password"
            id="password"
            className="input"
            onChange={onPasswordChange}
          />

          {/* <label htmlFor="password" className="label">
          Password
        </label> */}
          <input
            type="password"
            placeholder="Confirm Password"
            id="password"
            className="input"
            onChange={onConfirmPassword}
          />
          <select
            name="identity"
            id="id"
            defaultValue=""
            onChange={onIdentityChange}
          >
            <option value="" disabled>
              Sign Up as
            </option>
            <option value="beneficiary">Beneficiary</option>
            <option value="donor">Donor</option>
            <option value="organization">Organization</option>
          </select>
          <button className="button" onClick={onSignUp}>
            Sign Up
          </button>
          <p>
            Already a User? Login <Link to={routeLink}>Here</Link>
          </p>
        </form>
      </div>
    </Fragment>
  );
};

export default SignUp;
