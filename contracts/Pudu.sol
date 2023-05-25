// SPDX-License-Identifier: BSD-3
// Pudu Community
// Pudolphus Diamondhoof
// http://pudu.community/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Pudu is ERC20, Ownable {
    bool public _taxStatus;
    uint public _taxAmount;
    address public _puduTaxAddress;
    mapping(address => bool) public _excludedFromTaxFees;

    constructor(address taxAddress, address nftDropAddress) ERC20("Pudu", "PUDU") {
        _excludedFromTaxFees[msg.sender] = true;
        _excludedFromTaxFees[taxAddress] = true;
        _excludedFromTaxFees[nftDropAddress] = true;
        _puduTaxAddress = taxAddress;
        // Mint DEX and CEX LP funds
        _mint(msg.sender, 870000000  * (10 ** decimals()));
        // Mint Marketing and development funds
        _mint(taxAddress, 70000000  * (10 ** decimals()));
        // Mint NFT Drop funds
        _mint(nftDropAddress, 60000000  * (10 ** decimals()));
        // Note: The tax amount cannot be changed but can be disabled.
        _taxStatus = true;
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
        if (_taxStatus == false || _excludedFromTaxFees[sender] || _excludedFromTaxFees[recipient]) {
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

    function _updateTaxExclusion(address updatedAddress, bool isExcluded) external onlyOwner {
        require(updatedAddress != address(0), "Cannot exclude the zero address");
        _excludedFromTaxFees[updatedAddress] = isExcluded;
        emit TaxExclusionUpdate(updatedAddress, isExcluded);
    }

    // Events
    event TaxStatusUpdated(bool taxStatus);
    event TaxExclusionUpdate(address updatedAddress, bool shouldBeTaxed);
}