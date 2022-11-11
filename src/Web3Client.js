import Web3 from "web3";
import SmartContractBuild from "./SmartContract.json";

let selectedAccount;
let isInitialized = false;
let erc20Contract;
let nftContract;
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

  const networkId = await web3.eth.net.getId();

  //   nftContract = new web3.eth.Contract(
  //     SmartContractBuild.abi,
  //     SmartContractBuild.networks[networkId].address
  //   );

  erc20Contract = new web3.eth.Contract(
    SmartContractBuild,
    "0xe512e9C4ac3560fD858165c6e44bDc72aB72D4Ed"
  );
  console.log("Initialized smart contract");

  isInitialized = true;
};

export const checkDonorExists = async () => {
  if (!isInitialized) {
    await init();
  }
  console.log("Running methods as Initialized smart contract");
  erc20Contract.methods
    .registeredOrg("0xdD870fA1b7C4700F2BD7f44238821C26f7392148")
    .call({ from: selectedAccount })
    .then(function (result) {
      console.log(result);
    })
    .catch((e) => {
      console.log(e);
    });
};

export const getWalletBalanceETH = async () => {
  if (!isInitialized) {
    await init();
  }
  console.log(selectedAccount);
  console.log(web3);
  const bal = await web3.eth.getBalance(selectedAccount);
  const balance = web3.utils.fromWei(bal, "ether");

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
  erc20Contract.methods
    .donorSignUp(name, "certificate")
    .send({ from: selectedAccount })
    .then(function (result) {
      console.log(result);
    })
    .catch((e) => {
      console.log(e);
    });
};

export const orgSignUp = async (name) => {
  if (!isInitialized) {
    await init();
  }
  const cert = "certificate";
  erc20Contract.methods
    .orgSignUp(name, "certificate")
    .send({ from: selectedAccount })
    .then(function (result) {
      console.log(result);
    })
    .catch((e) => {
      console.log(e);
    });
};

export const beneSignUp = async (name, balance, orgAddress) => {
  if (!isInitialized) {
    await init();
  }
  console.log(name, balance, orgAddress);
  const wei = web3.utils.toWei(balance);
  erc20Contract.methods
    .beneSignUp(name, wei, orgAddress)
    .send({ from: selectedAccount })
    .then(function (receipt) {
      console.log(receipt);
    })
    .catch((e) => {
      console.log(e);
    });
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

export const beneUpdateStatus = async (benAddress, status) => {
  if (!isInitialized) {
    await init();
  }
  erc20Contract.methods
    .beneUpdateStatus(benAddress, status)
    .send({ from: selectedAccount })
    .then(function (result) {
      console.log(result);
    })
    .catch((e) => {
      console.log(e);
    });
};

export const releaseFunds = async (beneAddress, amount) => {
  if (!isInitialized) {
    await init();
  }
  // const transferAmount = web3.utils.fromWei(amount, "ether");
  console.log(amount);
  const response = await erc20Contract.methods
    .releaseFunds(beneAddress)
    .send({ from: selectedAccount, value: amount });
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
