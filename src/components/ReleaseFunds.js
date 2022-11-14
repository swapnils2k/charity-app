import { Fragment, useState, useEffect } from "react";
import { getBenForOrg } from "../DataFunctions";
import Modal from "./Modal";
import { releaseFunds, getBenAmount } from "../Web3Client";
import { putTransaction, updateBeneficiaryStatus } from "../DataFunctions";

import "./ReleaseFunds.css";

const ReleaseFunds = () => {
  const [benList, setBenList] = useState([]);
  const [error, setError] = useState();

  const getBenForOrganization = async (org_id) => {
    const response = await getBenForOrg(org_id);
    const tempList = [];
    response.map((ben) => {
      if (ben.status === "VotesAchieved") {
        tempList.push(ben);
      }
    });
    setBenList(tempList);
  };

  useEffect(() => {
    const org_id = localStorage.getItem("userid");
    getBenForOrganization(org_id).catch((e) => {
      console.log(e);
      setError({
        title: "Something went wrong",
        message: e,
      });
    });
  }, [getBenForOrganization]);
  const resetErrorHandler = () => {
    setError(null);
  };

  const release = async (benAddress) => {
    const amount = await getBenAmount(benAddress);
    console.log(amount);
    const response = await releaseFunds(benAddress, amount);
    const putDataResponse = await putTransaction(
      response.transactionHash,
      amount.toString(),
      localStorage.getItem("userid"),
      benAddress
    );
    const org_id = localStorage.getItem("userid");
    const updateStatusResponse = await updateBeneficiaryStatus(
      org_id,
      benAddress,
      "release"
    );
    getBenForOrganization(org_id);
  };

  const onReleaseFunds = (e) => {
    const benAddress = e.target.value;
    release(benAddress)
      .then()
      .catch((e) => {
        console.log(e);
        setError({
          title: "Something went wrong",
          message: "Please try again",
        });
      });
  };
  return (
    <Fragment>
      {error && (
        <Modal
          title={error.title}
          message={error.message}
          onConfirm={resetErrorHandler}
        />
      )}
      <div>
        <table>
          <tbody>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Release</th>
            </tr>
            {benList.map((ben, i) => (
              <tr key={i}>
                <td>{ben.name}</td>
                <td>{ben.status}</td>
                <td>
                  {ben.status === "VotesAchieved" && (
                    <button
                      className="button-enabled"
                      value={ben.user_id}
                      onClick={onReleaseFunds}
                    >
                      Release
                    </button>
                  )}
                  {ben.status !== "VotesAchieved" && (
                    <button disabled className="button-disabled">
                      Release
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {benList.length === 0 && (
          <div className="loading-transaction">No Pending Requests</div>
        )}
      </div>
    </Fragment>
  );
};

export default ReleaseFunds;
