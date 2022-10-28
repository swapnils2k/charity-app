import Web3 from "web3";
import SmartContractBuild from "./SmartContract.json";

let selectedAccount;
let isInitialized = false;
let erc20Contract;
let nftContract;

export const init = async () => {
  let provider = window.ethereum;

  if (typeof provider !== "undefined") {
    provider
      .request({ method: "eth_requestAccounts" })
      .then((accounts) => {
        selectedAccount = accounts[0];
        console.log(`Selected account is ${selectedAccount}`);
      })
      .catch((err) => {
        console.log(err);
        return;
      });

    window.ethereum.on("accountsChanged", function (accounts) {
      selectedAccount = accounts[0];
      console.log(`Selected account changed to ${selectedAccount}`);
    });
  }
  const Web3 = require("web3");
  const web3 = new Web3(provider);

  const networkId = await web3.eth.net.getId();

  //   nftContract = new web3.eth.Contract(
  //     SmartContractBuild.abi,
  //     SmartContractBuild.networks[networkId].address
  //   );

  erc20Contract = new web3.eth.Contract(
    SmartContractBuild,
    "0xd9145CCE52D386f254917e481eB44e9943F39138"
  );
  console.log("Initialized smart contract");

  isInitialized = true;
};

export const checkDonorExists = async () => {
  if (!isInitialized) {
    await init();
  }
  console.log("Running methods as Initialized smart contract");

  return erc20Contract.methods
    .registeredBen(selectedAccount)
    .call()
    .then((response) => {
      return response;
    });
};
