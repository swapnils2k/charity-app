const MyContract = artifacts.require("CharityApp");

module.exports = function(deployer) {
  deployer.deploy(MyContract);
};