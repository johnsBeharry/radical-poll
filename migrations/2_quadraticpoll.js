const SafeMath = artifacts.require('lib/SafeMath');
const Ownable = artifacts.require('lib/Ownable.sol');
const QuadraticPoll = artifacts.require("QuadraticPoll");

module.exports = function(deployer) {
  deployer.then(async () => {
    await deployer.deploy(SafeMath);
    await deployer.link(SafeMath, QuadraticPoll);
    await deployer.deploy(QuadraticPoll);
  });
};
