import { Fragment, useState, useEffect } from "react";
import { db } from "../Firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getAllTransactionsForUser } from "../DataFunctions";

const Transaction = () => {
  const [transactionsList, setTransactionsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const getData = async () => {
    let transactionsList = [];
    getAllTransactionsForUser()
      .then((response) => {
        setTransactionsList(response);
        setIsLoading(false);
      })
      .catch((e) => console.log(e));

    console.log("This is the list => ", transactionsList);
  };
  useEffect(() => {
    getData();
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
                <td>{transaction.from}</td>
                <td>{transaction.to}</td>
                <td>{transaction.amount}</td>
                <td>{transaction.date}</td>
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
