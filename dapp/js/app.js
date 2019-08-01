App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {

    if(window.ethereum){
      console.log(window.ethereum.selectedAddress, web3.version)
    } 

    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("QuadraticPoll.json", function(poll) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.QuadraticPoll = TruffleContract(poll);
      // Connect provider to interact with contract
      App.contracts.QuadraticPoll.setProvider(App.web3Provider);

      App.listenForEvents();

      return App.render();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.QuadraticPoll.deployed().then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance.votedEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        App.render();
      });
    });
  },

  render: function() {
    var contractInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html(account);
      }
    });

    // Load contract data
    App.contracts.QuadraticPoll.deployed().then(function(instance) {
      contractInstance = instance;
      return contractInstance.candidatesCount();
    }).then(function(candidatesCount) {
      var issuesResults = $("#issuesResults");
      issuesResults.empty();

      var issueSelect = $('#issueSelect');
      issueSelect.empty();

      for (var i = 1; i <= candidatesCount; i++) {
        contractInstance.issues(i).then(function(issue) {
          var id = issue[0];
          var title = issue[1];
          var credits = issue[2];

          // Render candidate Result
          var issueTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + credits + "</td></tr>"
          issuesResults.append(issueTemplate);

          // Render candidate ballot option
          var issueOption = "<option value='" + id + "' >" + name + "</ option>"
          issueSelect.append(issueOption);
        });
      }
      return contractInstance.voters(App.account);
    }).then(function(hasVoted) {
      // Do not allow a user to vote
      if(hasVoted) {
        $('form').hide();
      }
      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  },

  castVote: function() {
    var issueId = $('#issueSelect').val();
    App.contracts.QuadraticPoll.deployed().then(function(instance) {
      return instance.vote(issueId, { from: App.account });
    }).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  },

  voterRegister: function() {
    App.contracts.QuadraticPoll.deployed().then(function(instance) {
      return instance.register({ from: App.account });
    }).then(function(result) {
      // Wait for votes to update
      console.log('reigstration results', result)
      $('#voterRegistration').hide()
      $('#voterProfile').show()
    }).catch(function(err) {
      console.error(err);
    });
    return false;
  },

  unlockBrowserWallet: function() {
    if(window.ethereum){
      try {
        window.ethereum.enable()
          .then(function(account){
            if(account !== undefined) {
              alert('Metamask unlocked with address. '+ account[0]);
              $('#accountAddress').html(account[0]);
            } else {
              alert('Metamask is locked.')
            }
          })
      } catch {
        alert('Please confrim this dapp access to metamask.')
      }
    }
  }

};


$('#registerVoter').on();

$(function() {
  App.unlockBrowserWallet();
  $(window).load(function() {
    App.init();
  });
});
