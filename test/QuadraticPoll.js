const QuadraticPoll = artifacts.require('QuadraticPoll');

contract('QuadraticPoll', accounts => {

	const TITLE_1 = 'The development of domestic institutions';
	const TITLE_2 = 'The representatives in the international sphere';
	const TITLE_3 = 'Inclusion Caribbean nations in the African Union';

	it('Must be registered to vote', async () => {
		let contract = await QuadraticPoll.deployed();
		let voterRegistration = await contract.register({from: accounts[0]});
		let voter = await contract.voters.call(accounts[0]);
		let voter_status = voter[0].toNumber();
		let voter_credits = voter[1].toNumber();
		let voter_totalVotes = voter[2].toNumber();

		assert.equal(voter_status, 1); // 0: UNKNOWN, 1: REGISTERED
	});


	it('Costs 1 credits for 1 votes', async () => {
		let contract = await QuadraticPoll.deployed();

		// register and setup
		let voterRegistration = await contract.register({from: accounts[0]});
		let voterBeforeVoting = await contract.voters.call(accounts[0]);
		let voter_credits_before = voterBeforeVoting[1].toNumber();
		// let voter_totalVotes_before = voterBeforeVoting[2].toNumber();

		// do vote
	 	let issue_1 = await contract.newIssue(TITLE_3, {from: accounts[0]});
		let voteOnIssue = contract.vote(1, 1, {from: accounts[0]}); // one vote

		// check voter
		let voterAfterVoting = await contract.voters.call(accounts[0]);
		let voter_credits_after = voterAfterVoting[1].toNumber();
		// let voter_totalVotes_after = voterAfterVoting[2].toNumber();

		assert.equal(voter_credits_before - 1, voter_credits_after);
	});

	it('Costs 4 credits for 2 votes', async () => {
		let contract = await QuadraticPoll.deployed();

		// register and setup
		let voterRegistration = await contract.register({from: accounts[1]});
		let voterBeforeVoting = await contract.voters.call(accounts[1]);
		let voter_credits_before = voterBeforeVoting[1].toNumber();
		// let voter_totalVotes_before = voterBeforeVoting[2].toNumber();

		// do vote
	 	let issue_1 = await contract.newIssue(TITLE_3, {from: accounts[1]});
		let voteOnIssue = contract.vote(1, 2, {from: accounts[1]}); // one vote

		// check voter
		let voterAfterVoting = await contract.voters.call(accounts[1]);
		let voter_credits_after = voterAfterVoting[1].toNumber();
		// let voter_totalVotes_after = voterAfterVoting[2].toNumber();

		assert.equal(voter_credits_before - 4, voter_credits_after);
	});

	it('Costs 9 credits for 3 votes', async () => {
		let contract = await QuadraticPoll.deployed();

		// register and setup
		let voterRegistration = await contract.register({from: accounts[2]});
		let voterBeforeVoting = await contract.voters.call(accounts[2]);
		let voter_credits_before = voterBeforeVoting[1].toNumber();
		// let voter_totalVotes_before = voterBeforeVoting[2].toNumber();

		// do vote
	 	let issue_1 = await contract.newIssue(TITLE_3, {from: accounts[2]});
		let voteOnIssue = contract.vote(1, 3, {from: accounts[2]}); // one vote

		// check voter
		let voterAfterVoting = await contract.voters.call(accounts[2]);
		let voter_credits_after = voterAfterVoting[1].toNumber();
		// let voter_totalVotes_after = voterAfterVoting[2].toNumber();

		assert.equal(voter_credits_before - 9, voter_credits_after);
	});

	it('Costs 16 credits for 4 votes', async () => {
		let contract = await QuadraticPoll.deployed();

		// register and setup
		let voterRegistration = await contract.register({from: accounts[3]});
		let voterBeforeVoting = await contract.voters.call(accounts[3]);
		let voter_credits_before = voterBeforeVoting[1].toNumber();
		// let voter_totalVotes_before = voterBeforeVoting[2].toNumber();

		// do vote
	 	let issue_1 = await contract.newIssue(TITLE_3, {from: accounts[3]});
		let voteOnIssue = contract.vote(1, 4, {from: accounts[3]}); // one vote

		// check voter
		let voterAfterVoting = await contract.voters.call(accounts[3]);
		let voter_credits_after = voterAfterVoting[1].toNumber();
		// let voter_totalVotes_after = voterAfterVoting[2].toNumber();

		assert.equal(voter_credits_before - 16, voter_credits_after);
	});

});
