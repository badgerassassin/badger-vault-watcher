"use strict";

const CHAINID = Number(process.env.CHAINID || "1");
const INFURA_PROJECT_ID =
  process.env.INFURA_PROJECT_ID || "2f1de898efb74331bf933d3ac469b98d";
const GASNOW_SPEED = process.env.GASNOW_SPEED || "rapid";
const BLOCK_INTERVAL = process.env.BLOCK_INTERVAL || 1000;

const ethers = require("ethers");
const gasnow = require("ethers-gasnow");
const RedispatchSigner = require("ethers-redispatch-signer");
const PRIVATE_KEY =
  process.env.PRIVATE_KEY ||
  ethers.Wallet.createRandom()._signingKey().privateKey;
const harvestAll = require("../lib/harvest-all");
const { getNetwork } = require("@ethersproject/networks");
const { memoize } = require("lodash");

const getProvider = memoize(() => {
  if (CHAINID === 31337)
    return new ethers.providers.JsonRpcProvider("http://localhost:8545");
  const network = getNetwork(CHAINID);
  return new ethers.providers.InfuraProvider(network.name, INFURA_PROJECT_ID);
});

const getSigner = memoize(() => {
  const wallet = ethers.Wallet(PRIVATE_KEY).connect(getProvider());
  return wallet;
});
const deployments = require("../deploy-final");
const strategies = Object.values(deployments.strategies);

(async () => {
  const signer = getSigner();
  let startBlock;
  signer.provider.getGasPrice = gasnow.createGetGasPrice(GASNOW_SPEED);
  const redispatch = new RedispatchSigner(signer);
  signer.provider.on("block", async (number) => {
    if (!startBlock) startBlock = number;
    if ((number - startBlock) % BLOCK_INTERVAL !== 0) return;
    const tx = await harvestAll(strategies, redispatch);
    console.log("dispatched at block " + String(number));
    console.log(tx.hash);
    const receipt = await tx.wait();
    console.log("mined!");
    console.log(String(receipt.gasUsed) + " gas used");
  });
})().catch((err) => console.error(err));
