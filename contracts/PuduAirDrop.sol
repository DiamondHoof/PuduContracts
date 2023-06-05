// SPDX-License-Identifier: BSD-3
// Pudu Community
// Pudolphus Diamondhoof
// http://pudu.community/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract PuduAirDrop is Ownable {
    uint public _tokensPerReferral;
    uint public _tokensPerSignIn;
    IERC20 public _puduToken;

    struct Participant {
        bool signedIn;
        address referrer;
        uint referralCount;
        uint tokensReceived;
    }

    struct AirDropStats {
        uint totalSigns;
        uint totalReferred;
        uint puduGiven;
    }

    mapping(address => Participant) public _participants;
    AirDropStats public _airDropStats;

    constructor(uint tokensPerReferral, uint tokensPerSignIn, address puduTokenAddress) {
        _tokensPerReferral = tokensPerReferral;
        _tokensPerSignIn = tokensPerSignIn;
        _puduToken = IERC20(puduTokenAddress);
    }

    function signIn(address referrer) external {
        require(!_participants[msg.sender].signedIn, "You have already signed in");
        require(referrer != msg.sender, "Cannot refer yourself");
        require(_puduToken.balanceOf(address(this)) > _tokensPerSignIn, "No PUDU available");
        _participants[msg.sender].signedIn = true;
        _airDropStats.totalSigns = _airDropStats.totalSigns + 1;
        _airDropStats.puduGiven = _airDropStats.puduGiven + _tokensPerSignIn;
        _participants[msg.sender].tokensReceived = _tokensPerSignIn;
        require(_puduToken.transfer(msg.sender, _tokensPerSignIn), "PUDU transfer failed");
        emit ParticipantSignedIn(msg.sender);
        // If the referrer is not the 0 Address and the referrer has signed in
        if (referrer != address(0) && _participants[referrer].signedIn && _puduToken.balanceOf(address(this)) > _tokensPerReferral) {
            _participants[msg.sender].referrer = referrer;
            _participants[referrer].referralCount = _participants[referrer].referralCount + 1;
            _participants[referrer].tokensReceived = _participants[referrer].tokensReceived + _tokensPerReferral;
            _airDropStats.totalReferred = _airDropStats.totalReferred + 1;
            _airDropStats.puduGiven = _airDropStats.puduGiven + _tokensPerReferral;
            require(_puduToken.transfer(referrer, _tokensPerReferral), "referrer PUDU transfer failed");
            emit ReferralRecorded(referrer, msg.sender);
        }
    }

    function availableRewards() external view returns (uint256) {
        return _puduToken.balanceOf(address(this));
    }

    // Update Airdrop rewards
    function updateTokenRewards(uint tokensPerSignIn, uint tokensPerReferral) external onlyOwner {
        _tokensPerSignIn = tokensPerSignIn;
        _tokensPerReferral = tokensPerReferral;
    }

    // Finish the Airdrop by withdrawing remaining tokens
    function finishAirDropAndWithdrawTokens() external onlyOwner {
        require(_puduToken.balanceOf(address(this)) > 0, "No PUDU available");
        require(_puduToken.transfer(owner(), _puduToken.balanceOf(address(this))), "PUDU transfer failed");
    }

    // Events
    event ParticipantSignedIn(address indexed participant);
    event ReferralRecorded(address indexed participant, address indexed referral);
}
