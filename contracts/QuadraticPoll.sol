pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

/// @title Quadratic Voting
/// @author Johns Beharry
/// @notice Please don't use this contract in an actual democratic election.
contract QuadraticPoll is Ownable {
	using SafeMath for uint256;

	uint256 public issueCount;

	// constants
	uint256 constant STARTING_CREDIT = 16;
	uint256 constant TOTAL_SUPPLY = 1024;

	enum Status {
		UNKNOWN,
		REGISTERED
	}

	struct Issue {
		string title;
		uint256 credits;
	}

	struct Voter {
		Status status;
		uint256 credits;
		uint256 count;
		mapping(uint256 => Issue) votes;
	}

	mapping(address => Voter) public voters;
	mapping(uint256 => Issue) public issues;

	event IssueAdded(
		string _name,
		address creator
	);

	event Voted(
		uint256 _issueId,
		uint256 cost,
		address _voter
	);

	modifier isRegistered() {
		require(voters[msg.sender].status == Status.REGISTERED);
		_;
	}
	
	constructor()
	public {
		issueCount = 0;
		newIssue('The development of domestic institutions');
		newIssue('The representatives in the international sphere');
		newIssue('Inclusion Caribbean nations in the African Union');
	}

	/// Create a new issue
	/// @param _title The name of the issue
	/// @return id of the issue
	function newIssue(string memory _title)
	public
	returns (uint256) {
		issueCount = issueCount + 1;
		issues[issueCount].title = _title;
		issues[issueCount].credits = 0;
		emit IssueAdded(_title, msg.sender);
		return issueCount;
	}

	/// Get an new issue
	/// @param _issueId The name of the issue
	/// @return title ofv the issue
	function getIssue(uint256 _issueId)
	external
	view
	returns (uint256, string memory, uint256) {
		return(_issueId, issues[_issueId].title, issues[_issueId].credits);
	}

	/// Get an new issue
	/// @param _issueId The name of the issue
	/// @return title ofv the issue
	function vote(
		uint256 _issueId,
		uint256 _votes
	)
	external
	isRegistered
	returns (uint256)
	{
		uint256 cost = _votes.mul(_votes);

		require(cost <= TOTAL_SUPPLY); // so we can mitigate an overflow error with user input
		require(voters[msg.sender].credits >= cost); // voter has enough credits 

		voters[msg.sender].count += 1;
		voters[msg.sender].credits = voters[msg.sender].credits.sub(cost);
		issues[_issueId].credits = issues[_issueId].credits.add(cost);

		emit Voted(_issueId, cost, msg.sender);
	}

	/// Allocate credits to new voters
	/// @return title of the issue
	function register() external returns (bool) {
		if(voters[msg.sender].count == 0) {
			voters[msg.sender].credits = STARTING_CREDIT;
			voters[msg.sender].status = Status.REGISTERED;
		}
	}
}
