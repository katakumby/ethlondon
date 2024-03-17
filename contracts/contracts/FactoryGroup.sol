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
        uint256 _numberOfInstalments // IWorldID _worldId,
        // string memory _actionId
    ) public // string memory _appId,
    {
        Group group = new Group(
            _token,
            _asset,
            // address(this),
            _assetPrice,
            _numberOfUsers,
            _numberOfInstalments
            // _worldId,
            // _appId,
            // _actionId
        );
        GroupArray.push(group);
        organiserGroups[msg.sender].push(GroupArray.length - 1);
    }

    function joinGroup(
        uint256 _groupIndex,
        address signal,
        uint256 root,
        uint256 nullifierHash,
        uint256[8] calldata proof
    ) public {
        Group(address(GroupArray[_groupIndex])).joinGroup(
            signal,
            root,
            nullifierHash,
            proof
        );
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
