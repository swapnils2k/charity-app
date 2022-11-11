import { Fragment, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Modal from "./Modal";
import "./Login.css";
import Web3 from "web3";
import { donorSignUp, beneSignUp, orgSignUp } from "../Web3Client";
import Organization from "./Organization";
import {
  putUser,
  putOrganization,
  putBeneficiary,
  getOrgList,
} from "../DataFunctions";

const SignUp = (props) => {
  const [error, setError] = useState();
  const [name, setName] = useState("");
  const [identity, setIdentity] = useState("");
  const [userid, setUserid] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [orgList, setOrgList] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState("");
  const [amount, setAmount] = useState(0);
  const [orgDetails, setOrgDetails] = useState(0);
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
    getOrgList().then((response) => {
      setOrgList(response);
    });
  };
  const onSetOrg = (event) => {
    setSelectedOrg(event.target.value);
  };
  const onAmountChangeHandler = (event) => {
    setAmount(event.target.value);
  };
  const onOrgDetailsChangeHandler = (event) => {
    setOrgDetails(event.target.value);
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
    // if (identity == "organization") {
    //   putOrganization(userid.trim(), name, orgDetails);
    // }
    // if (identity == "beneficiary") {
    //   putBeneficiary(name, selectedOrg, userid.trim());
    // }
    // putUser(userid.trim(), name, password.trim(), identity);
    // props.onLogin(userid, password, identity);

    if (identity === "donor") {
      donorSignUp(userid)
        .then((result) => {
          console.log("Signed Up as Donor", result);
          putUser(userid.trim(), name, password.trim(), identity);
          props.onLogin(userid, password, identity);
          navigate(`/charity/dashboard`);
        })
        .catch((e) => {
          console.log(e);
          return;
        });
    } else if (identity === "organization") {
      orgSignUp(name)
        .then((result) => {
          console.log("Signed Up as Organization", result);
          putOrganization(userid.trim(), name, orgDetails);
          putUser(userid.trim(), name, password.trim(), identity);
          props.onLogin(userid, password, identity);
          navigate(`/charity/dashboard`);
        })
        .catch((e) => {
          console.log(e);
          return;
        });
    } else {
      beneSignUp(name, amount, selectedOrg)
        .then((result) => {
          console.log("Signed Up as Beneficiary", result);
          putBeneficiary(name, selectedOrg, userid.trim());
          putUser(userid.trim(), name, password.trim(), identity);
          props.onLogin(userid, password, identity);
          navigate(`/charity/dashboard`);
        })
        .catch((e) => {
          console.log(e);
          return;
        });
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
          {identity === "beneficiary" && (
            <select
              name="organization"
              id="id"
              defaultValue=""
              onChange={onSetOrg}
            >
              <option value="" disabled>
                Choose Organization
              </option>
              {orgList.map((org, i) => {
                return (
                  <option key={i} value={org.org_id}>
                    {org.org_name}
                  </option>
                );
              })}
            </select>
          )}
          {identity == "beneficiary" && (
            <input
              type="number"
              placeholder="Request Amount"
              id="amount"
              className="input"
              onChange={onAmountChangeHandler}
            />
          )}
          {identity === "organization" && (
            <input
              type="text"
              placeholder="Enter Organization Details"
              id="organization"
              className="input"
              onChange={onOrgDetailsChangeHandler}
            />
          )}
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
