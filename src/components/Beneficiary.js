import { Fragment, useEffect, useState } from "react";
import { db } from "../Firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import "./Beneficiary.css";
import { getBenForOrg, putTransaction } from "../DataFunctions";
import Web3 from "web3";
import { donate } from "../Web3Client";

const Beneficiary = (props) => {
  const [benList, setBenList] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [amount, setAmount] = useState(0);
  const amountChangeHandler = (event) => {
    setAmount(event.target.value);
    console.log(amount);
  };
  useEffect(() => {
    getBenForOrg(props.org).then((response) => {
      console.log(response);
      setBenList(response);
    });
  }, []);

  const onSelectUserHandler = (event) => {
    event.preventDefault();
    setSelectedUser(event.target.value);
    console.log(event.target.value);
  };
  const onDonate = () => {
    let benAddress = selectedUser;
    console.log(selectedUser);
    if (benAddress === "No Preference" || benAddress === "") {
      benAddress = "0x0000000000000000000000000000000000000000";
    }
    donate(props.org, benAddress, amount.toString()).then((response) => {
      console.log(response);
      putTransaction(
        response.transactionHash,
        amount.toString(),
        localStorage.getItem("userid"),
        props.org
      );
    });
  };
  return (
    <div>
      <label htmlFor="users">Choose a Beneficiary to Donate:</label>

      <select name="users" id="users" onChange={onSelectUserHandler}>
        <option value="No Preference">No Preference</option>
        {benList.map((ben, i) => {
          if (ben.status === "accept") {
            return [
              <option value={ben.user_id} key={i}>
                {ben.name}
              </option>,
            ];
          }
        })}
      </select>
      <div>
        <div>
          <input
            type="number"
            min={0}
            className="coin-input"
            placeholder="Enter Amount"
            onChange={amountChangeHandler}
          />
        </div>
        <div>
          <button className="donate" onClick={onDonate}>
            Donate
          </button>
        </div>
      </div>
    </div>
  );
};

export default Beneficiary;
