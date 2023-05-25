import {ethers} from "hardhat";
import {Contract} from "ethers";

export async function deployPudu(taxAddress: string, nftDropAddress: string): Promise<Contract> {
  const puduContractFactory = await ethers.getContractFactory("Pudu");
  const puduContract = await puduContractFactory.deploy(taxAddress, nftDropAddress);
  await puduContract.deployed();
  return puduContract;
}