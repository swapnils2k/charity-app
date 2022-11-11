import { Fragment, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Organization from "./Organization";
import Transaction from "./Transaction";
import WalletBalance from "./WalletBalance";
import ReleaseFunds from "./ReleaseFunds";
import "./Dashboard.css";
import logo from "../images/logo.png";
import { getBenForOrg, updateBeneficiaryStatus } from "../DataFunctions";
import Web3 from "web3";
import { beneUpdateStatus } from "../Web3Client";

const OrgDashboard = (props) => {
  const [navigation, setNavigation] = useState("Home");
  const navigate = useNavigate();
  const [benList, setBenList] = useState([]);
  const updateList = () => {
    getBenForOrg(localStorage.getItem("userid")).then((response) => {
      console.log(response);
      setBenList(response);
    });
  };
  useEffect(() => {
    if (props.loggedIn === false) {
      console.log("User not logged in");
      navigate(`/`);
    }
    updateList();
  }, []);

  const changeToHome = () => {
    setNavigation("Home");
  };
  const changeToRelease = () => {
    setNavigation("Release");
  };
  const changeToReleaseFunds = () => {
    setNavigation("Fund");
  };
  const onAccept = (e) => {
    updateBeneficiaryStatus(
      localStorage.getItem("userid"),
      e.target.value,
      "accept"
    )
      .then((response) => {
        beneUpdateStatus(e.target.value, 1).then((response) => {
          console.log(response);
          updateList();
        });
        console.log(response);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const onReject = (e) => {
    updateBeneficiaryStatus(
      localStorage.getItem("userid"),
      e.target.value,
      "reject"
    )
      .then((response) => {
        console.log(response);
        beneUpdateStatus(e.target.value, 2).then((response) => {
          console.log(response);
          updateList();
        });
      })
      .catch((e) => {
        console.log(e);
      });
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
                Requests
              </a>
            </li>
            <li>
              <a href="#" onClick={changeToRelease}>
                Transactions
              </a>
            </li>
            <li>
              <a href="#" onClick={changeToReleaseFunds}>
                Release Funds
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
              <span>Requests</span>
              <div className="org-req-wrapper">
                <div className="org-req-row">
                  <div>Name</div>
                  <div>Status</div>
                  <div>Update</div>
                </div>
                {benList.length === 0 && (
                  <div className="loading-transaction">No Pending Requests</div>
                )}
                {benList.map((ben, i) => {
                  if (ben.status === "pending") {
                    return [
                      <div key={i} className="org-req-row">
                        <div>{ben.name}</div>
                        <div>{ben.status}</div>
                        <div>
                          <button
                            className="org-dash-button org-dash-button-a"
                            value={ben.user_id}
                            onClick={onAccept}
                          >
                            Accept
                          </button>
                          <button
                            className="org-dash-button org-dash-button-r"
                            value={ben.user_id}
                            onClick={onReject}
                          >
                            Reject
                          </button>
                        </div>
                      </div>,
                    ];
                  }
                })}
              </div>
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
              <Transaction />
            </div>
          </div>
        )}
        {navigation === "Fund" && (
          <div className="home">
            <div className="navigation-page">
              <h2>Release Funds</h2>
            </div>
            <WalletBalance className="wallet" />
            <div className="home-wrapper">
              <ReleaseFunds />
            </div>
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default OrgDashboard;
