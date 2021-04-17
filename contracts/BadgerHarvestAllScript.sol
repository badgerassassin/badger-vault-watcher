// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;


import { TxScriptLib } from "./TxScriptLib.sol";
import { BadgerHarvestAllScriptLib } from "./BadgerHarvestAllScriptLib.sol";

contract BadgerHarvestAllScript {
  using BadgerHarvestAllScriptLib for *;
  constructor(address[] memory strategies) public {
    strategies.harvestAll();
    TxScriptLib.terminate();
  }
}
