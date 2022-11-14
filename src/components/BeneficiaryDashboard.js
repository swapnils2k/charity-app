import { Fragment, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Transaction from "./Transaction";
import WalletBalance from "./WalletBalance";
import { getBeneficiaryStatus } from "../DataFunctions";
import "./Dashboard.css";
import logo from "../images/logo.png";

const BeneficiaryDashboard = (props) => {
  const [navigation, setNavigation] = useState("Home");
  const [ben, setSBen] = useState([]);
  const navigate = useNavigate();
  // const getStatus = async () => {
  //   const response = await getBeneficiaryStatus();
  //   console.log(response);
  //   setStatus(response.status);
  // };
  useEffect(() => {
    if (props.loggedIn === false) {
      console.log("User not logged in");
      navigate(`/`);
    }
    getBeneficiaryStatus()
      .then((response) => {
        setSBen(response[0]);
      })
      .catch((e) => console.log(e));
  }, []);

  const changeToHome = () => {
    setNavigation("Home");
  };
  const changeToRelease = () => {
    setNavigation("Transactions");
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
                {navigation !== "Home" && <div className="nav-div">Home</div>}
                {navigation === "Home" && (
                  <div
                    className="nav-div"
                    style={{
                      height: "100%",
                      backgroundColor: "lightblue",
                      borderRadius: "5px",
                    }}
                  >
                    Home
                  </div>
                )}
              </a>
            </li>
            <li>
              <a href="#" onClick={changeToRelease}>
                {navigation !== "Transactions" && (
                  <div className="nav-div">Transactions</div>
                )}
                {navigation === "Transactions" && (
                  <div
                    className="nav-div"
                    style={{
                      height: "100%",
                      backgroundColor: "lightblue",
                      borderRadius: "5px",
                    }}
                  >
                    Transactions
                  </div>
                )}
              </a>
            </li>
            <li>
              <Link to={`/charity/login`} onClick={props.onLogout}>
                <div className="nav-div">Logout</div>
              </Link>
            </li>
          </ul>
        </div>
        {navigation === "Home" && (
          <div className="home">
            <div className="navigation-page">
              <h2>{navigation}</h2>
              <h2>United Care</h2>
            </div>
            <WalletBalance className="wallet" />
            <div className="home-wrapper">
              Requested Organization: {ben.org_id}
              <br /><br />
              Your Current Request Status: {ben.status}
            </div>
          </div>
        )}

        {navigation === "Transactions" && (
          <div className="home">
            <div className="navigation-page">
              <h2>{navigation}</h2>
              <h2>United Care</h2>
            </div>
            <WalletBalance className="wallet" />
            <div className="home-wrapper">
              <Transaction />
            </div>
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default BeneficiaryDashboard;
