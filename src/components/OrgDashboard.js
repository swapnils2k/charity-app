import { Fragment, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Organization from "./Organization";
import Transaction from "./Transaction";
import WalletBalance from "./WalletBalance";
import ReleaseFunds from "./ReleaseFunds";
import "./Dashboard.css";
import logo from "../images/logo.png";
import { getBenForOrg, updateBeneficiaryStatus } from "../DataFunctions";
import { beneUpdateStatus, getOrgDetails, getBenDetails } from "../Web3Client";

const OrgDashboard = (props) => {
  const [navigation, setNavigation] = useState("Home");
  const navigate = useNavigate();
  const [benList, setBenList] = useState([]);
  const [toggleBenList, setToggleBenList] = useState([]);
  const updateList = () => {
    getBenForOrg(localStorage.getItem("userid")).then((response) => {
      console.log(response);
      let tempList = [];
      let tempToggleList = [];
      response.map((ben) => {
        if (ben.status === "pending") {
          tempList.push(ben);
        } else if (ben.status === "accept" || ben.status === "VotingStart") {
          tempToggleList.push(ben);
        }
      });
      // console.log(tempToggleList);
      setBenList(tempList);
      setToggleBenList(tempToggleList);
    });
  };

  const updateBenStatus = async (stats) => {
    const r = await beneUpdateStatus(stats[0], 6);
    // const delay = (milliseconds) => {
    //   return new Promise((resolve) => {
    //     setTimeout(resolve, milliseconds);
    //   });
    // };
    // await delay(5000);
    const res = await getBenDetails(stats[0]);
    console.log(res.Status);
    let UpdatedStatus = "";
    if (res.Status === "3") {
      UpdatedStatus = "VotesAchieved";
    } else if (res.Status === "7") {
      UpdatedStatus = "VotesNotAchieved";
    }
    const response = await updateBeneficiaryStatus(
      localStorage.getItem("userid"),
      stats[0],
      UpdatedStatus
    );
    updateList();
  };

  const updateStatusAccept = async (stats) => {
    const r = await beneUpdateStatus(stats[0], 5);
    const res = await updateBeneficiaryStatus(
      localStorage.getItem("userid"),
      stats[0],
      "VotingStart"
    );
    updateList();
  };

  const onToggleVoting = (e) => {
    const stats = e.target.value.split(" ");
    console.log(stats);
    if (stats[1] === "accept") {
      updateStatusAccept(stats).catch((e) => console.log(e));
    } else if (stats[1] === "VotingStart") {
      updateBenStatus(stats).catch((e) => console.log(e));
    }
  };

  useEffect(() => {
    if (props.loggedIn === false) {
      console.log("User not logged in");
      navigate(`/`);
    }
    updateList();
  }, []);

  const changeToHome = () => {
    setNavigation("Requests");
  };
  const changeToRelease = () => {
    setNavigation("Transactions");
  };
  const changeToReleaseFunds = () => {
    setNavigation("Fund");
  };

  const asyncAccept = async (e) => {
    const r = await updateBeneficiaryStatus(
      localStorage.getItem("userid"),
      e.target.value,
      "accept"
    );
    const response = await beneUpdateStatus(e.target.value, 1);
    updateList();
  };
  const onAccept = (e) => {
    asyncAccept(e).catch((e) => {
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
                {navigation !== "Requests" && (
                  <div className="nav-div">Requests</div>
                )}
                {navigation === "Requests" && (
                  <div
                    className="nav-div"
                    style={{
                      height: "100%",
                      backgroundColor: "lightblue",
                      borderRadius: "5px",
                    }}
                  >
                    Requests
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
              <a href="#" onClick={changeToReleaseFunds}>
                {navigation !== "Fund" && (
                  <div className="nav-div">Release Funds</div>
                )}
                {navigation === "Fund" && (
                  <div
                    className="nav-div"
                    style={{
                      height: "100%",
                      backgroundColor: "lightblue",
                      borderRadius: "5px",
                    }}
                  >
                    Release Funds
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
        {navigation === "Requests" && (
          <div className="home">
            <div className="navigation-page">
              <h2>{navigation}</h2>
              <h2>United Care</h2>
            </div>
            <WalletBalance className="wallet" />
            <div className="home-wrapper">
              <span>Requests</span>
              <div className="org-req-wrapper">
                {/* <div className="org-req-row">
                  <div>Name</div>
                  <div>Status</div>
                  <div>Update</div>
                </div> */}
                <table>
                  <tbody>
                    <tr>
                      <th>Name</th>
                      <th>Status</th>
                      <th>Update</th>
                    </tr>
                    {benList.map((ben, i) => {
                      return [
                        <tr key={i}>
                          <td>{ben.name}</td>
                          <td>{ben.status}</td>
                          <td>
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
                          </td>
                        </tr>,
                      ];
                    })}
                  </tbody>
                </table>
                {benList.length === 0 && (
                  <div className="loading-transaction">No Pending Requests</div>
                )}
              </div>
              <br />

              <div className="org-req-wrapper">
                <span>Toggle Voting</span>
                <table>
                  <tbody>
                    <tr>
                      <th>Name</th>
                      <th>Status</th>
                      <th>Toggle</th>
                    </tr>
                    {toggleBenList.map((ben, i) => {
                      return [
                        <tr key={i}>
                          <td>{ben.name}</td>
                          <td>{ben.status}</td>
                          <td>
                            <button
                              className="toggle-button"
                              onClick={onToggleVoting}
                              value={ben.user_id + " " + ben.status}
                            >
                              Toggle Voting
                            </button>
                          </td>
                        </tr>,
                      ];
                    })}
                  </tbody>
                </table>
                {toggleBenList.length === 0 && (
                  <div className="loading-transaction">No Pending Requests</div>
                )}
              </div>
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
        {navigation === "Fund" && (
          <div className="home">
            <div className="navigation-page">
              <h2>Release Funds</h2>
              <h2>United Care</h2>
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
