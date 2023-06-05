import {ethers} from "hardhat";
import {BigNumber, Contract} from "ethers";

export async function deployPuduAirDrop(tokensPerReferral: BigNumber, tokensPerSignIn: BigNumber, puduTokenAddress: string): Promise<Contract> {
  const puduAirDropContractFactory = await ethers.getContractFactory("PuduAirDrop");
  const puduAirDropContract = await puduAirDropContractFactory.deploy(tokensPerReferral, tokensPerSignIn, puduTokenAddress);
  await puduAirDropContract.deployed();
  return puduAirDropContract;
}