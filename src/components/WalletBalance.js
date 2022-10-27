import { Fragment } from "react";
import "./WalletBalance.css";

const Transaction = () => {
  return (
    <Fragment>
      <div className="wallet-container">
        <div className="wallet-left">
          <h3>Wallet Details</h3>
          <div className="balance-align">
            <p>Balance: 25</p>
          </div>
        </div>
        <div className="wallet-right">
          <div className="deposit-used">
            <p>Coins Deposited: 75.6</p>
          </div>
          <div className="deposit-used">
            <p>Coins Used 44.7</p>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Transaction;
