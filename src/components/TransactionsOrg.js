import { Fragment, useEffect, useState } from "react";
import React from "react";
import { getUserList } from "../DataFunctions";

const TransactionsOrg = (props) => {
  const userMap = new Map();
  const [tList, setTList] = useState([]);

  const mapIdToName = async () => {
    const userList = await getUserList();
    userList.map((user) => {
      userMap.set(user.user_id, user.name);
    });
    props.orgTrnsactions.map((t) => {
      t.fromName = userMap.get(t.from);
      t.toName = userMap.get(t.to);
    });
    props.orgTrnsactions.sort(function (x, y) {
      return new Date(y.date) - new Date(x.date);
    });
    setTList(props.orgTrnsactions);
  };

  useEffect(() => {
    mapIdToName().catch((e) => console.log(e));
  }, []);

  return (
    <Fragment>
      <div className="transaction-div">
        <b>Transactions</b>
      </div>
      <div className="table-content">
        <table>
          <tbody>
            <tr>
              <th>Transaction ID</th>
              <th>From</th>
              <th>To</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>

            {tList.map((transaction, i) => [
              <tr key={transaction.id}>
                <td>{transaction.id}</td>
                <td>{transaction.fromName}</td>
                <td>{transaction.toName}</td>
                <td>{transaction.amount}</td>
                <td>{new Date(transaction.date).toString()}</td>
              </tr>,
            ])}
          </tbody>
        </table>
        {tList.length === 0 && (
          <div className="loading-transaction">No transactions found</div>
        )}
      </div>
    </Fragment>
  );
};

export default TransactionsOrg;
