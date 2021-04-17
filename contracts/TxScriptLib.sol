// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

library TxScriptLib {
  function terminate() internal pure {
    assembly {
      return(0x0, 0x0)
    }
  }
}
