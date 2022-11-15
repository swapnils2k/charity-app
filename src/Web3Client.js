import Web3 from "web3";
import SmartContractBuild from "./SmartContract.json";

let selectedAccount;
let isInitialized = false;
let erc20Contract;
let web3;

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
  web3 = new Web3(provider);

  // const networkId = await web3.eth.net.getId();

  //   nftContract = new web3.eth.Contract(
  //     SmartContractBuild.abi,
  //     SmartContractBuild.networks[networkId].address
  //   );

  erc20Contract = new web3.eth.Contract(
    SmartContractBuild,
    "0xB26862cDfa83D40b48AF8C15d8910002f258D172"
  );
  console.log("Initialized smart contract");

  isInitialized = true;
};

export const getWalletBalanceETH = async () => {
  if (!isInitialized) {
    await init();
  }
  console.log(selectedAccount);
  console.log(web3);
  const bal = await web3.eth.getBalance(selectedAccount);
  const balance = await web3.utils.fromWei(bal, "ether");

  return balance;
};

export const getWalletBalance = async () => {
  if (!isInitialized) {
    await init();
  }
  const identity = localStorage.getItem("identity");
  if (identity === "beneficiary") {
    const result = await erc20Contract.methods
      .registeredBen(selectedAccount)
      .call({ from: selectedAccount });
    return result.Amount;
  }
  if (identity === "donor") {
    const result = await erc20Contract.methods
      .registeredDonor(selectedAccount)
      .call({ from: selectedAccount });
    return result.Amount;
  }
  if (identity === "organization") {
    const result = await erc20Contract.methods
      .registeredOrg(selectedAccount)
      .call({ from: selectedAccount });
    return result.Balance;
  }
};

export const donorSignUp = async (name) => {
  if (!isInitialized) {
    await init();
  }
  const response = await erc20Contract.methods
    .donorSignUp(name)
    .send({ from: selectedAccount });
  return response;
};

export const orgSignUp = async (name) => {
  if (!isInitialized) {
    await init();
  }
  const response = await erc20Contract.methods
    .orgSignUp(name, "certificate")
    .send({ from: selectedAccount });
  return response;
};

export const beneSignUp = async (name, balance, orgAddress) => {
  if (!isInitialized) {
    await init();
  }
  // console.log(name, balance, orgAddress);
  const wei = web3.utils.toWei(balance);
  const response = await erc20Contract.methods
    .beneSignUp(name, wei, orgAddress)
    .send({ from: selectedAccount });
  return response;
};

export const getBenDetails = async (benAddress) => {
  if (!isInitialized) {
    await init();
  }
  const response = await erc20Contract.methods
    .registeredBen(benAddress)
    .call({ from: selectedAccount });
  return response;
};

export const getBenAmount = async (benAddress) => {
  if (!isInitialized) {
    await init();
  }
  const response = await erc20Contract.methods
    .registeredBen(benAddress)
    .call({ from: selectedAccount });
  const amount = web3.utils.fromWei(response.Amount, "ether");
  return amount;
};

export const getOrgDetails = async () => {
  if (!isInitialized) {
    await init();
  }
  const response = await erc20Contract.methods
    .registeredOrg(selectedAccount)
    .call({ from: selectedAccount });
  return response;
};

export const beneUpdateStatus = async (benAddress, status) => {
  if (!isInitialized) {
    await init();
  }
  // console.log(benAddress, status);
  const response = await erc20Contract.methods
    .beneUpdateStatus(benAddress, status)
    .send({ from: selectedAccount });
  return response;
};

export const releaseFunds = async (beneAddress, amount) => {
  if (!isInitialized) {
    await init();
  }
  const transferAmount = web3.utils.toWei(amount, "ether");
  console.log(transferAmount);
  const response = await erc20Contract.methods
    .releaseFunds(beneAddress)
    .send({ from: selectedAccount, value: transferAmount });
  return response;
};

export const donate = async (orgAddress, beneAddress, amount) => {
  if (!isInitialized) {
    await init();
  }
  console.log(orgAddress, beneAddress, amount);
  const amountToSend = web3.utils.toWei(amount, "ether");
  const response = await erc20Contract.methods
    .donate(orgAddress, beneAddress)
    .send({ from: selectedAccount, value: amountToSend });
  return response;
};
