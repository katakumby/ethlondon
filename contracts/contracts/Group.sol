// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "hardhat/console.sol";
import "./ERC4907/IERC4907.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ByteHasher} from "./helpers/ByteHasher.sol";
import {IWorldID} from "./interfaces/IWorldID.sol";
contract Group {
    using ByteHasher for bytes;
    struct User {
        bool exists;
        uint256 remainingAmount;
        uint256 remainingPayments;
    }

    address public admin;
    IERC20 public token;
    IERC4907 public asset;
    uint256 public assetPrice;
    uint256 public numberOfInstalments;
    uint256 public instalmentSize;
    // uint16 public currentPayment;
    // uint16 public numberOfPayments;

    uint256 public numberOfUsers;
    uint256 public currentUsers;

    address[] public possibleWinners;

    mapping(address => User) public userMap;

    // Payments for a given user
    // mapping(address => mapping(uint16 => bool)) public user_payments;

    /// @notice Thrown when attempting to reuse a nullifier
    error InvalidNullifier();

    /// @dev The World ID instance that will be used for verifying proofs
    IWorldID internal immutable worldId;

    /// @dev The contract's external nullifier hash
    uint256 internal immutable externalNullifier;

    /// @dev The World ID group ID (always 1)
    uint256 internal immutable groupId = 1;

    /// @dev Whether a nullifier hash has been used already. Used to guarantee an action is only performed once by a single person
    mapping(uint256 => bool) internal nullifierHashes;

    // Event declarations
    event UserAdded(address indexed user);
    event UserRemoved(address indexed user);
    event PaymentMade(address indexed user, uint256 amount);
    event LotteryWinners(address[] winners);

    constructor(
        address _token,
        address _asset,
        uint256 _assetPrice,
        uint256 _numberOfUsers,
        uint256 _numberOfInstalments
    ) {
        admin = msg.sender;
        token = IERC20(_token);
        asset = IERC4907(_asset);
        assetPrice = _assetPrice;
        numberOfUsers = _numberOfUsers;
        numberOfInstalments = _numberOfInstalments;
        instalmentSize = _assetPrice / _numberOfInstalments;
        require(
            2 * assetPrice == numberOfUsers * instalmentSize,
            // 2* 24,000     == 96 * 500
            "Incorrect group settings"
        );

        console.log("Setting erc 20 contract: ", _token);
        worldId = IWorldID(0x42FF98C4E85212a5D31358ACbFe76a621b50fC02);
        externalNullifier = abi
            .encodePacked(
                abi
                    .encodePacked(
                        "app_staging_5b179dc5f0ba2b412b0af12ca60ce74c"
                    )
                    .hashToField(),
                address(this)
            )
            .hashToField();
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only the admin can perform this action");
        _;
    }

    function joinGroup(
        address signal,
        uint256 root,
        uint256 nullifierHash,
        uint256[8] calldata proof
    ) public {
        require(currentUsers < numberOfUsers, "User capacity reached");

        // verify worldcoin id
        // First, we make sure this person hasn't done this before
        if (nullifierHashes[nullifierHash]) revert InvalidNullifier();

        // We now verify the provided proof is valid and the user is verified by World ID
        worldId.verifyProof(
            root,
            groupId,
            abi.encodePacked(signal).hashToField(),
            nullifierHash,
            externalNullifier,
            proof
        );

        // We now record the user has done this, so they can't do it again (proof of uniqueness)
        nullifierHashes[nullifierHash] = true;
        // address _user = msg.sender;
        //take payment
        // require(userMap[_user].exists, "User already in the group");
        bool sent = token.transferFrom(signal, address(this), instalmentSize);
        require(sent, "Payment failed");

        currentUsers++; // just to check when to start the group

        possibleWinners.push(signal);
        userMap[signal].remainingAmount = assetPrice - instalmentSize;
        userMap[signal].remainingPayments = numberOfInstalments - 1;

        console.log("Adding user:", signal); // Debugging line

        // console.log("users[msg.sender]: ", users[signal]);
        emit UserAdded(signal);
    }

    // function removeUser(uint256 user_index) public onlyAdmin {
    //     require(userStructs[user_index].exists, "User not exists");

    //     address removed = userStructs[user_index].user;

    //     // Remove the winner from the participants array by swapping the last element and popping
    //     userStructs[user_index] = userStructs[userStructs.length - 1];
    //     userStructs.pop();

    //     emit UserRemoved(removed);
    // }

    function makePayment() public {
        console.log("\nAttempting payment by:", msg.sender); // Debugging line
        require(
            userMap[msg.sender].exists,
            "Only a participant can make a payment"
        );
        bool sent = token.transferFrom(
            msg.sender,
            address(this),
            instalmentSize
        );
        require(sent, "Payment failed");

        userMap[msg.sender].remainingAmount = assetPrice - instalmentSize;
        userMap[msg.sender].remainingPayments = numberOfInstalments - 1;
        possibleWinners.push(msg.sender);

        emit PaymentMade(msg.sender, assetPrice);
    }

    function startLottery() public onlyAdmin {
        require(
            currentUsers == numberOfUsers,
            "Group is not full yet, cannot start lottery"
        );
        console.log("Starting lottery");

        uint256 contractBalance = token.balanceOf(address(this));
        // how many assets can be bought with the contract balance
        uint256 assetsToBuy = contractBalance / assetPrice;

        // generally here we'd use 1 as lottery and 2nd one as aucitons
        // or more than 1 for lottery if we have enoough for more than 2 prizes
        // Randomly select a winner // VRF WOULD COME HERE

        //initialize empty array of capacity total supply
        address[] memory winningAddr = new address[](assetsToBuy);

        console.log("before for loop: ", possibleWinners.length);
        for (uint256 i = 0; i < assetsToBuy; i++) {
            uint256 winnerIndex = uint256(
                keccak256(
                    abi.encodePacked(
                        block.timestamp,
                        block.difficulty,
                        possibleWinners.length,
                        i
                    )
                )
            ) % possibleWinners.length; // favour early participants

            winningAddr[i] = possibleWinners[winnerIndex];

            for (uint ii = winnerIndex; ii < possibleWinners.length - 1; ii++) {
                possibleWinners[ii] = possibleWinners[ii + 1];
            }
            possibleWinners.pop();
        }
        console.log("before trasnger");
        bool sent = token.transfer(admin, assetPrice * assetsToBuy);
        require(sent, "Payment to admin failed");

        // mint the assets and rent to winners
        for (uint256 i = 0; i < assetsToBuy; i++) {
            uint256 tokenID = asset.mint(address(this), "Asset", 0);
            asset.setUser(tokenID, winningAddr[i], 1742192348);
        }

        possibleWinners = new address[](0);
        emit LotteryWinners(winningAddr);

        console.log("Lottery winners: ", winningAddr[0]);
    }
}
