const QuadraticPoll = artifacts.require("QuadraticPoll");

module.exports = function(deployer) {
  deployer.deploy(QuadraticPoll);
};
