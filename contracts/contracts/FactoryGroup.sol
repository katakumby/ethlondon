//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Group.sol";

contract Factory {
    Group[] public GroupArray;
    mapping(address => uint256[]) public organiserGroups;
    mapping(address => uint256[]) public userGroups;

    function createNewGroup(string memory _group) public {
        Group group = new Group(_group);
        GroupArray.push(Group);
        organiserGroups[msg.sender].push(GroupArray.length - 1);
    }

    function joinGroup(uint256 _groupIndex) public {
        Grouper(address(GroupArray[_groupIndex])).join();
        userGroups[msg.sender].push(_groupIndex);
    }

    function payInGroup(uint256 _groupIndex) public {
        Grouper(address(GroupArray[_groupIndex])).makePayment();
    }

    function startLotteryForGroup(uint256 _groupIndex) public {
        Grouper(address(GroupArray[_groupIndex])).startLottery();
    }

    // function startProgressForGroup(uint256 _groupIndex) public {
    //     Grouper(address(GroupArray[_groupIndex])).startProgress();
    // }

    function getGroupAddress(
        uint256 _groupIndex
    ) public view returns (address) {
        return address(GroupArray[_groupIndex]);
    }
}
