const QuadraticPoll = artifacts.require("QuadraticPoll");

module.exports = function(deployer) {
  deployer.then(async () => {
    await deployer.deploy(QuadraticPoll);
  });
};
