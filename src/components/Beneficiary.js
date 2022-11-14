import { Fragment, useEffect, useState } from "react";
import "./Beneficiary.css";
import {
  getBenForOrg,
  putTransaction,
  updateBeneficiaryStatus,
} from "../DataFunctions";
import { donate, getBenDetails } from "../Web3Client";

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
      let temp = [];
      response.map((r) => {
        if (r.status === "VotingStart") {
          temp.push(r);
        }
      });
      console.log(temp);
      setBenList(temp);
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
      getBenDetails(benAddress).then((res) => {
        if (res.status === 3) {
          updateBeneficiaryStatus(props.org, benAddress, "VotesAcheived");
        }
      });
      putTransaction(
        response.transactionHash,
        amount.toString(),
        localStorage.getItem("userid"),
        props.org
      );
    });
  };
  return (
    <Fragment>
      <label htmlFor="users">Choose a Beneficiary to Donate:</label>
      <select name="users" id="users" onChange={onSelectUserHandler}>
        <option value="No Preference">No Preference</option>
        {benList.map((ben, i) => {
          return [
            <option value={ben.user_id} key={i}>
              {ben.name}
            </option>,
          ];
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
    </Fragment>
  );
};

export default Beneficiary;
