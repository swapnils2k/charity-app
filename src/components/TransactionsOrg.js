import { Fragment, useEffect, useState } from "react";
import React from "react";
import { getUserList } from "../DataFunctions";
import { getAllTransactionsForOrg } from "../DataFunctions";
import { db } from "../Firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const TransactionsOrg = (props) => {
  const userMap = new Map();
  const [tList, setTList] = useState([]);
  const [orgTrnsactions, setOrgTransactions] = useState([]);

  const getData = async () => {
    let orgList = [];
    const q = query(collection(db, "organizations"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      orgList.push({
        org_details: doc.data().org_details,
        org_id: doc.data().org_id,
        org_name: doc.data().org_name,
      });
    });
    console.log("This is the list => ", orgList);
    let orgTrnsactions = [];
    for (var i = 0; i < orgList.length; i++) {
      const resp = await getAllTransactionsForOrg(orgList[i].org_id);
      orgTrnsactions = [...orgTrnsactions, ...resp];
    }
    console.log(orgTrnsactions);

    // await tempFun(orgList);
    console.log("After wait");
    return orgTrnsactions;
    // console.log(orgTrnsactions);
  };
  // const tempFun = async (orgList) => {
  //   let promisesList = [];
  //   orgList.map(async (org) => {
  //     promisesList.push(getAllTransactionsForOrg(org.org_id));
  //   });
  //   Promise.all(promisesList).then((allResp) => {
  //     setOrgTransactions(...allResp);
  //     console.log(allResp);
  //   });
  // };

  const mapIdToName = async () => {
    const resp = await getData();
    console.log(resp);
    const userList = await getUserList();
    userList.map((user) => {
      userMap.set(user.user_id, user.name);
    });
    resp.map((t) => {
      t.fromName = userMap.get(t.from);
      t.toName = userMap.get(t.to);
    });
    resp.sort(function (x, y) {
      return new Date(y.date) - new Date(x.date);
    });
    console.log(resp);
    // setTList(orgTrnsactions);
    setOrgTransactions(resp);
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

            {orgTrnsactions.map((transaction, i) => [
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
        {orgTrnsactions.length === 0 && (
          <div className="loading-transaction">No transactions found</div>
        )}
      </div>
    </Fragment>
  );
};

export default TransactionsOrg;
