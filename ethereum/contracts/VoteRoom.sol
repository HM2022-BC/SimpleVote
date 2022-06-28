// // SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.8.0;

/// @title Vote room smart contract, a proof-of-concept voting system with private and public voting
/// @author Group 3 (Jonas Buse, Emir Simsek, Felix Pollok, Michael Meissner)
/// @notice A smart contract that lets managers create new votes which either designated adresses can partake in, or which everybody can use
contract VoteRoom {
    /// A single vote which can be public or private
    struct VoteData {
        string description;
        bool isFinalized;
        mapping(address => bool) hasVoted;
        uint256 inFavor;
        uint256 against;
        uint256 abstain;
        uint256 minimumVotes;
        bool isPublic;
    }

    /// Owner and manager who can whitelist people and start votes
    address public manager;

    /// Mapping of all whitelisted voters
    mapping(address => bool) public invitedVoters;

    /// Number of whitelisted voters
    uint256 public voterCount;

    /// Array of votes
    VoteData[] public votes;

    /// Description of the room
    string public voteRoomDescription;

    /// Only the manager can access
    modifier managerGuard() {
        require(msg.sender == manager);
        _;
    }

    /// Only a whitelisted voter can access
    modifier voterGuard() {
        require(invitedVoters[msg.sender]);
        _;
    }

    /**
     * @dev constructor that already takes new voters
     * @param author manager of the new vote room
     * @param description description for the whole room
     * @param newVoters a list of addresses of whitelisted voters
     */
    constructor(
        address author,
        string memory description,
        address[] memory newVoters
    ) public {
        manager = author;
        voteRoomDescription = description;
        for (uint256 index = 0; index < newVoters.length; index++) {
            invitedVoters[newVoters[index]] = true;
            voterCount++;
        }
    }

    /**
     * @dev Invite new voters after creation
     * @param newVoters array of addresses of newly whitelisted voters
     */
    function inviteVoters(address[] memory newVoters) public managerGuard {
        for (uint256 index = 0; index < newVoters.length; index++) {
            invitedVoters[newVoters[index]] = true;
            voterCount++;
        }
    }

    /**
     * @dev The manager can create a new Vote with all possible inputs
     * @param description of the singular vote
     * @param minimumVotes the number of the minimum amount of votes
     * @param isPublic boolean if this vote should be restricted to the whitlist of available to the public
     */
    function createVote(
        string memory description,
        uint256 minimumVotes,
        bool isPublic
    ) public managerGuard {
        VoteData memory newVote = VoteData({
            description: description,
            isFinalized: false,
            inFavor: 0,
            against: 0,
            abstain: 0,
            minimumVotes: minimumVotes,
            isPublic: isPublic
        });
        votes.push(newVote);
    }
}
