// SPDX-License-Identifier: UNLICENSED

import "./util/OwnableUpgradeable.sol";
import "./util/ReentrancyGuardUpgradeable.sol";

pragma solidity ^0.8.10;

contract KIOption is OwnableUpgradeable, ReentrancyGuardUpgradeable {
  
  function initialize() public initializer {
    __Ownable_init();
  }
}