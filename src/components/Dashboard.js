import { Fragment, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Organization from "./Organization";
import Transaction from "./Transaction";
import WalletBalance from "./WalletBalance";
import Beneficiary from "./Beneficiary";
import "./Dashboard.css";
import logo from "../images/logo.png";
import { db } from "../Firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const Dashboard = (props) => {
  const [navigation, setNavigation] = useState("Home");
  const navigate = useNavigate();
  const [orgList, setOrgList] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
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
      console.log("This is the list => ", orgList);
    });
    setOrgList(orgList);
    // console.log("This is the list => ", list);
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
  const changeToProfile = () => {
    setNavigation("Profile");
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
                Home
              </a>
            </li>
            <li key="profile">
              <a href="#" onClick={changeToProfile}>
                Profile
              </a>
            </li>
            <li key="logout">
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

        {navigation === "Profile" && (
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
      </div>
    </Fragment>
  );
};

export default Dashboard;
