import { Fragment, useState, useEffect } from "react";
import { db } from "../Firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getAllTransactionsForUser, getUserList } from "../DataFunctions";

const Transaction = () => {
  const [transactionsList, setTransactionsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const getData = async () => {
    const response = await getAllTransactionsForUser();
    console.log(response);
    response.sort(function (x, y) {
      return new Date(y.date) - new Date(x.date);
    });
    const userMap = new Map();
    const userList = await getUserList();
    userList.map((user) => {
      userMap.set(user.user_id, user.name);
    });
    response.map((t) => {
      t.fromName = userMap.get(t.from);
      t.toName = userMap.get(t.to);
    });
    setTransactionsList(response);
    setIsLoading(false);

    console.log("This is the list => ", transactionsList);
  };
  useEffect(() => {
    getData().catch((e) => console.log(e));
    // console.log("This is the list => ", list);
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

            {transactionsList.map((transaction, i) => [
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
        {transactionsList.length === 0 && (
          <div className="loading-transaction">No transactions found</div>
        )}
        {isLoading && (
          <div className="loading-transaction">Fetching Transactions</div>
        )}
      </div>
    </Fragment>
  );
};

export default Transaction;
