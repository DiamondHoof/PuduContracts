// SPDX-License-Identifier: BUSL-1.1
// Pudu Community
// http://pudu.community/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Pudu is ERC20, Ownable {
    bool public _taxStatus;
    uint public _taxAmount;
    address public _puduTaxAddress;

    constructor() ERC20("Pudu", "PUDU") {
        _mint(msg.sender, 1000000000  * (10 ** decimals()));
        _puduTaxAddress = msg.sender;
        _taxStatus = true;
        // Note: The tax amount cannot be changed but can be disabled.
        _taxAmount = 200; // 200 = 0.5%
    }

    // Public Functions

    function transfer(address recipient, uint amount) public override returns (bool) {
        (uint recipientReceives, uint amountTaxed) =  calculateTax(msg.sender, recipient, amount);
        // If taxes are enabled and are higher than 0, transfer them to the _puduTaxAddress
        if (amountTaxed > 0) {
            super.transfer(_puduTaxAddress, amountTaxed);
        }
        return super.transfer(recipient, recipientReceives);
    }

    function transferFrom(address sender, address recipient, uint256 amount) public override returns (bool) {
        (uint recipientReceives, uint amountTaxed) =  calculateTax(sender, recipient, amount);
        // If taxes are enabled and are higher than 0, transfer them to the _puduTaxAddress
        if (amountTaxed > 0) {
            super.transferFrom(sender, _puduTaxAddress, amountTaxed);
        }
        return super.transferFrom(sender, recipient, recipientReceives);
    }

    function calculateTax(address sender, address recipient, uint amount) public view returns (uint recipientReceives, uint amountTaxed) {
        require(recipient != address(0), "Cannot transfer to the zero address");
        require(balanceOf(sender) >= amount, "Not enough balance");
        if (_taxStatus == false) {
            amountTaxed = 0;
            recipientReceives = amount;
        } else {
            amountTaxed = amount / _taxAmount;
            recipientReceives = amount - amountTaxed;
        }
        return (recipientReceives, amountTaxed);
    }

    // Only Owner

    function _updateTaxStatus(bool taxStatus) external onlyOwner {
        _taxStatus = taxStatus;
        emit TaxStatusUpdated(taxStatus);
    }

}