App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  voter: null,
  hasVoted: false,

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {

    // check for ethereum object
    if(typeof window.ethereum !== 'undefined'){
      console.log('Modern Ethereuum browser detected.');

      // detect network
      if([3, 4, 5].includes(ethereum.networkVersion)) {
        console.log('Please connect to the Ropsten, Rinkby or your Local Network.')
      }

      // setup web3
      App.web3Provider = window.ethereum || window.web3.currentProvider;

      web3 = new Web3(App.web3Provider);
    } else {
      console.log('Not using an Ethereum Browser.');
    } 

    return App.initContract();
  },

  initContract: function() {
    $.getJSON("QuadraticPoll.json?v=0.1.0", function(poll) {
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
      instance.Voted({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log('event triggered', event)
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

      contractInstance.voters.call(App.account).then(function(voter) {
        App.voter = {
          status: voter[0].toString(),
          credits: voter[1].toString(),
          totalVotes: voter[2].toString()
        };

        $('#accountCredits').html(App.voter.credits);

        if(App.voter.status == 1) {
          $('#accountStatus').html('Registered Voter')
        } else {
          $('#accountStatus').html('Unregistered')
        }

        console.log('voter', App.voter)

        if (App.voter.status != 0) {
          App.registeredVoter = true;
          $('#voterRegistration').hide();
          $('#voterProfile').show();
        }

      });

      return contractInstance.issueCount();
    }).then(function(issueCount) {
      console.log(typeof issueCount, issueCount);
      var issuesResults = $("#issuesResults");
      issuesResults.empty();

      var issueSelect = $('#issueSelect');
      issueSelect.empty();

      for (var i = 1; i <= issueCount; i++) {
        contractInstance.getIssue(i).then(function(issue) {
          var id = issue[0];
          var title = issue[1];
          var credits = issue[2];

          // Render candidate Result
          var issueTemplate = `<tr><th>${id}</th><td>${title}</td><td>${credits}</td></tr>`
          issuesResults.append(issueTemplate);

          // Render issues to be voted on
          var issueOption = "<option value='" + id + "' >" + title + "</ option>"
          issueSelect.append(issueOption);


          var issueOption = "<option value='" + id + "' >" + title + "</ option>"
        });
      }

      return contractInstance.voters(App.account);
    }).then(function(hasVoted) {
      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  },

  castVote: function() {
    var issueId = $('#issueSelect').val();
    var voteAmt = $('#votesSelect').val();
    App.contracts.QuadraticPoll.deployed().then(function(instance) {
      return instance.vote(issueId, voteAmt, { from: App.account });
    }).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  },

  voterRegister: function() {
    $('#voterRegistration .registration-pending').show();
    $('#voterRegistration .registration-failed').hide();
    App.contracts.QuadraticPoll.deployed().then(function(instance) {
      return instance.register({ from: App.account });
    }).then(function(result) {
      // Wait for votes to update
      console.log('reigstration results', result)
      $('#voterRegistration').hide()
      $('#voterProfile').show()
    }).catch(function(err) {
    $('#voterRegistration .registration-pending').hide();
      $('#voterRegistration .registration-failed').show()
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
              console.log('Web3 browser unlocked with address', account[0]);
              $('#accountAddress').html(account[0]);
            } else {
              alert('Web3 browser is locked.')
            }
          })
      } catch {
        alert('Please confrim this dapp access to your Web3 browser in settings.')
      }
    }
  }

};

// click events
$('#registerVoter').on('click', function(e) {
  e.preventDefault();
  App.voterRegister();
});

window.onload = function() {
  App.unlockBrowserWallet();
  App.init();
};
