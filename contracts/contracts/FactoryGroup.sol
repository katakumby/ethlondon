//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Group.sol";

contract FactoryGroup {
    Group[] public GroupArray;
    mapping(address => uint256[]) public organiserGroups;
    mapping(address => uint256[]) public userGroups;

    function createNewGroup(
        address _token,
        address _asset,
        uint256 _assetPrice,
        uint256 _numberOfUsers,
        uint256 _numberOfInstalments
    ) public {
        Group group = new Group(
            _token,
            _asset,
            // address(this),
            _assetPrice,
            _numberOfUsers,
            _numberOfInstalments
        );
        GroupArray.push(group);
        organiserGroups[msg.sender].push(GroupArray.length - 1);
    }

    function joinGroup(uint256 _groupIndex) public {
        Group(address(GroupArray[_groupIndex])).joinGroup(msg.sender);
        userGroups[msg.sender].push(_groupIndex);
    }

    function payInGroup(uint256 _groupIndex) public {
        Group(address(GroupArray[_groupIndex])).makePayment();
    }

    function startLotteryForGroup(uint256 _groupIndex) public {
        Group(address(GroupArray[_groupIndex])).startLottery();
    }

    // function startProgressForGroup(uint256 _groupIndex) public {
    //     Grouper(address(GroupArray[_groupIndex])).startProgress();
    // }
}
