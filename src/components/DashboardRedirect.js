import { Fragment, useState, useEffect } from "react";
import Dashboard from "./Dashboard";
import OrgDashboard from "./OrgDashboard";
import BeneficiaryDashboard from "./BeneficiaryDashboard";

const DashboardRedirect = (props) => {
  const [identity, setIdentity] = useState();
  useEffect(() => {
    setIdentity(localStorage.getItem("identity"));
    console.log("identity : ", identity);
  }, []);
  return (
    <Fragment>
      {identity === "donor" && (
        <Dashboard onLogout={props.onLogout} loggedIn={props.loggedIn} />
      )}
      {identity === "organization" && (
        <OrgDashboard onLogout={props.onLogout} loggedIn={props.loggedIn} />
      )}
      {identity === "beneficiary" && (
        <BeneficiaryDashboard
          onLogout={props.onLogout}
          loggedIn={props.loggedIn}
        />
      )}
    </Fragment>
  );
};

export default DashboardRedirect;
