"use strict";

const ethers = require("ethers");
const BadgerHarvestAllScript = require("../artifacts/contracts/BadgerHarvestAllScript.sol/BadgerHarvestAllScript");

const harvestAll = async (strategies, signer) => {
  const factory = new ethers.ContractFactory(
    BadgerHarvestAllScript.abi,
    BadgerHarvestAllScript.bytecode,
    signer
  );
  const tx = await signer.sendTransaction({
    data: await factory.getDeployTransaction(strategies).data,
  });
  return tx;
};
