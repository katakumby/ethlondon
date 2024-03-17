// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;
interface ISupraRouter {
    function generateRequest(
        string memory _functionSig,
        uint8 _rngCount,
        uint256 _numConfirmations,
        uint256 _clientSeed,
        address _clientWalletAddress
    ) external returns (uint256);
    function generateRequest(
        string memory _functionSig,
        uint8 _rngCount,
        uint256 _numConfirmations,
        address _clientWalletAddress
    ) external returns (uint256);
}
/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 * @custom:dev-run-script ./scripts/deploy_with_ethers.ts
 */
contract Storage {
    uint256 number;
    address supraAddr;
    address supraClientAddress;
    mapping(uint256 => uint256[]) rngForNonce;

    constructor(address supraSC) {
        supraAddr = supraSC;
        supraClientAddress = msg.sender;
    }
    /**
     * @dev Store value in variable
     */
    function request() public {
        // Amount of random numbers to request
        uint8 rngCount = 5;
        // Amount of confirmations before the request is considered complete/final
        uint256 numConfirmations = 1;
        uint256 nonce = ISupraRouter(supraAddr).generateRequest(
            "requestCallback(uint256,uint256[])",
            rngCount,
            numConfirmations,
            supraClientAddress
        );
        number = nonce;
        // store nonce if necessary (e.g., in a hashmap)
        // this can be used to track parameters related to the request in a lookup table
        // these can be accessed inside the callback since the response from supra will include the nonce
    }
    function requestCallback(
        uint256 _nonce,
        uint256[] memory _rngList
    ) external {
        require(
            msg.sender == supraAddr,
            "Only the Supra Router can call this function."
        );
        uint8 i = 0;
        uint256[] memory x = new uint256[](_rngList.length);
        rngForNonce[_nonce] = x;
        for (i = 0; i < _rngList.length; i++) {
            rngForNonce[_nonce][i] = _rngList[i] % 100;
        }
    }

    function viewRngForNonce(
        uint256 nonce
    ) external view returns (uint256[] memory) {
        return rngForNonce[nonce];
    }
    /**
     * @dev Return value
     * @return value of 'number'
     */
    function retrieve() public view returns (uint256) {
        return number;
    }
}
