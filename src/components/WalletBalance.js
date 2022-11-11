import { Fragment, useState, useEffect } from "react";
import Web3 from "web3";
import "./WalletBalance.css";
import { getWalletBalanceETH } from "../Web3Client";

const WalletBalance = () => {
  const [balance, setBalance] = useState("");
  useEffect(() => {
    getWalletBalanceETH().then((bal) => {
      console.log("Balance received ========> ", bal);
      setBalance(bal);
    });
  }, []);
  return (
    <Fragment>
      <div className="wallet-container">
        <div className="wallet-left">
          <h3>Wallet Details</h3>
          <div className="balance-align">
            <p>Balance: {balance}</p>
          </div>
        </div>
        {/* <div className="wallet-right">
          <div className="deposit-used">
            <p>Coins Deposited: 75.6</p>
          </div>
          <div className="deposit-used">
            <p>Coins Used 44.7</p>
          </div>
        </div> */}
      </div>
    </Fragment>
  );
};

export default WalletBalance;
