import { Fragment, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Organization from "./Organization";
import Transaction from "./Transaction";
import WalletBalance from "./WalletBalance";
import "./Dashboard.css";
import logo from "../images/logo.png";

const BeneficiaryDashboard = (props) => {
  const [navigation, setNavigation] = useState("Home");
  const navigate = useNavigate();
  useEffect(() => {
    if (props.loggedIn === false) {
      console.log("User not logged in");
      navigate(`/`);
    }
  }, []);

  const changeToHome = () => {
    setNavigation("Home");
  };
  const changeToRelease = () => {
    setNavigation("Release");
  };
  return (
    <Fragment>
      <div className="separator">
        <div className="navbar">
          <div className="logo">
            <img src={logo} alt="Logo" />
          </div>
          <ul>
            <li>
              <a href="#" onClick={changeToHome}>
                Home
              </a>
            </li>
            <li>
              <a href="#" onClick={changeToRelease}>
                Requests
              </a>
            </li>
            <li>
              <Link to={`/charity/login`} onClick={props.onLogout}>
                {/* <a href="#" onClick={props.onLogout}> */}
                Logout
                {/* </a> */}
              </Link>
            </li>
          </ul>
        </div>
        {navigation === "Home" && (
          <div className="home">
            <div className="navigation-page">
              <h2>{navigation}</h2>
            </div>
            <WalletBalance className="wallet" />
            <div className="home-wrapper">
              <Organization field="Request"/>
              <Organization field="Request"/>
              <Organization field="Request"/>
              <Organization field="Request"/>
            </div>
          </div>
        )}

        {navigation === "Release" && (
          <div className="home">
            <div className="navigation-page">
              <h2>{navigation}</h2>
            </div>
            <WalletBalance className="wallet" />
            <div className="home-wrapper">
              <div className="transaction-div">
                <p>Transactions</p>
              </div>
              <table>
                <tbody>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Amount</th>
                    <th>Action</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                  <Transaction />
                  <Transaction />
                  <Transaction />
                  <Transaction />
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default BeneficiaryDashboard;
