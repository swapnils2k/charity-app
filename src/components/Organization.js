import { Fragment, useEffect, useState } from "react";
import "./Organization.css";

const Organization = (props) => {
  
  return (
    <Fragment>
      <div className="container">
        <div>
          <p className="org-name">{props.org_name}</p>
          <br />
          <p>{props.org_details}</p>
        </div>
        
      </div>
    </Fragment>
  );
};

export default Organization;
