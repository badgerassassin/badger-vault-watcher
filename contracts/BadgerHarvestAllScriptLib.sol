// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import { IStrategy } from "./IStrategy.sol";

library BadgerHarvestAllScriptLib {
  function harvestAll(address[] memory strategies) internal {
    for (uint256 i = 0; i < strategies.length; i++) {
      strategies[i].call(abi.encodeWithSelector(IStrategy.harvest.selector));
    }
  }
}
