import { Fragment, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Organization from "./Organization";
import Transaction from "./Transaction";
import WalletBalance from "./WalletBalance";
import Beneficiary from "./Beneficiary";
import TransactionsOrg from "./TransactionsOrg";
import "./Dashboard.css";
import logo from "../images/logo.png";
import { getAllTransactionsForOrg } from "../DataFunctions";
import { db } from "../Firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const Dashboard = (props) => {
  const [navigation, setNavigation] = useState("Home");
  const navigate = useNavigate();
  const [orgList, setOrgList] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [orgTrnsactions, setOrgTransactions] = useState([]);
  const getData = async () => {
    let orgList = [];
    const q = query(collection(db, "organizations"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      orgList.push({
        org_details: doc.data().org_details,
        org_id: doc.data().org_id,
        org_name: doc.data().org_name,
      });
    });
    console.log("This is the list => ", orgList);
    let orgTrnsactions = [];
    await tempFun(orgList);
    console.log("After wait");
    setOrgList(orgList);
  };
  const tempFun = async (orgList) => {
    let promisesList = [];
    orgList.map(async (org) => {
      promisesList.push(getAllTransactionsForOrg(org.org_id));
    });
    Promise.all(promisesList).then((allResp) => {
      setOrgTransactions(...allResp);
    });
  };
  useEffect(() => {
    if (props.loggedIn === false) {
      console.log("User not logged in");
      navigate(`/`);
    }
    getData();
    // console.log("This is the list => ", list);
  }, []);

  const changeToHome = () => {
    // console.log("This is the list => ", orgList);
    setNavigation("Home");
  };
  const changeToTransactions = () => {
    setNavigation("Transactions");
  };
  const changeToOrgTransactions = () => {
    setNavigation("Organization Transactions");
  };

  return (
    <Fragment>
      <div className="separator">
        <div className="navbar">
          <div className="logo">
            <img src={logo} alt="Logo" />
          </div>
          <ul>
            <li key="home">
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
            <li key="transactions">
              <a href="#" onClick={changeToTransactions}>
                {navigation !== "Transactions" && (
                  <div className="nav-div">Transactions</div>
                )}
                {navigation === "Transactions" && (
                  <div
                    className="nav-div"
                    style={{
                      // padding: "10px",
                      backgroundColor: "lightblue",
                      borderRadius: "5px",
                    }}
                  >
                    Transactions
                  </div>
                )}
              </a>
            </li>
            <li key="orgTransactions">
              <a href="#" onClick={changeToOrgTransactions}>
                {navigation !== "Organization Transactions" && (
                  <div className="nav-div">Organization Transactions</div>
                )}
                {navigation === "Organization Transactions" && (
                  <div
                    className="nav-div"
                    style={{
                      // padding: "12px",
                      backgroundColor: "lightblue",
                      borderRadius: "5px",
                    }}
                  >
                    Organization Transactions
                  </div>
                )}
              </a>
            </li>
            <li key="logout">
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
              {orgList.map((org, i) => {
                return [
                  <Organization
                    field="Donate"
                    org_name={org.org_name}
                    org_details={org.org_details}
                    key={i}
                  />,
                  <Beneficiary
                    org={org.org_id}
                    key={org.org_name}
                    setSelectedUser={setSelectedUser}
                  />,
                ];
              })}
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

        {navigation === "Organization Transactions" && (
          <div className="home">
            <div className="navigation-page">
              <h2>{navigation}</h2>
              <h2>United Care</h2>
            </div>
            <WalletBalance className="wallet" />
            <div className="home-wrapper">
              <TransactionsOrg orgTrnsactions={orgTrnsactions} />
            </div>
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default Dashboard;
