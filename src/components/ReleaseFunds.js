import { Fragment, useState, useEffect } from "react";
import { getBenForOrg } from "../DataFunctions";
import Modal from "./Modal";
import { releaseFunds, getBenDetails } from "../Web3Client";
import { putTransaction } from "../DataFunctions";

import "./ReleaseFunds.css";

const ReleaseFunds = () => {
  const [benList, setBenList] = useState([]);
  const [error, setError] = useState();
  useEffect(() => {
    const org_id = localStorage.getItem("userid");
    getBenForOrg(org_id)
      .then((response) => {
        const tempList = [];
        response.map((ben) => {
          if (ben.status === "accept") {
            tempList.push(ben);
          }
        });
        setBenList(tempList);
      })
      .catch((e) => {
        console.log(e);
        setError({
          title: "Something went wrong",
          message: e,
        });
      });
  }, []);
  const resetErrorHandler = () => {
    setError(null);
  };

  const release = async (benAddress) => {
    const benDetails = await getBenDetails(benAddress);
    const response = await releaseFunds(benAddress, benDetails.Amount);
    const putDataResponse = await putTransaction(
      response.transactionHash,
      benDetails.Amount.toString(),
      localStorage.getItem("userid"),
      benAddress
    );
    const org_id = localStorage.getItem("userid");
    const updateStatusResponse = await (org_id, benAddress, "release");
  };

  const onReleaseFunds = (e) => {
    const benAddress = e.target.value;
    release(benAddress)
      .then()
      .catch((e) => {
        console.log(e);
        setError({
          title: "Something went wrong",
          message: "User has not received sufficient votes",
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
                  {ben.status === "accept" && (
                    <button
                      className="button-enabled"
                      value={ben.user_id}
                      onClick={onReleaseFunds}
                    >
                      Release
                    </button>
                  )}
                  {ben.status !== "accept" && (
                    <button disabled className="button-disabled">
                      Release
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Fragment>
  );
};

export default ReleaseFunds;
