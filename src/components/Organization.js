import { Fragment } from "react";
import "./Organization.css";

const Organization = (props) => {
  return (
    <Fragment>
      <div className="container">
        <div>
          <p className="org-name">Organization Name</p>
          <br />
          <p>Details about organization</p>
        </div>
        <div>
          <div>
            <input
              type="number"
              min={0}
              className="coin-input"
              placeholder="Enter Amount"
            />
          </div>
          <div>
            <button className="donate">{props.field}</button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Organization;
