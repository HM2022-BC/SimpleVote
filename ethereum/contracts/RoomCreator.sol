// // SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.8.0;

import "./VoteRoom.sol";

/**
 * @title Vote room Creator smart contract, create vote rooms and manage them
 * @author Group 3 (Jonas Buse, Emir Simsek, Felix Pollok, Michael Meissner)
 * @notice A smart contract that anyone create their own vote rooms and manage them
 */
contract RoomCreator {
    /// List of all vote rooms
    address[] public voteRoomAddresses;

    /// create a new vote room
    function createRoom(
        string memory description,
        address[] memory invitedVoters
    ) public {
        address newVoteRoom = address(
            new VoteRoom(msg.sender, description, invitedVoters)
        );
        voteRoomAddresses.push(newVoteRoom);
    }

    /// get all vote rooms
    function getAllVoteRooms() public view returns (address[] memory) {
        return voteRoomAddresses;
    }
}
