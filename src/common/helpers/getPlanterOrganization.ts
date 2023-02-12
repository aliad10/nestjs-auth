const PlanterV2 = require("./../../../abi/Planter.json");
const Web3 = require("web3");

const web3 = new Web3("http://localhost:8545");

export async function getPlanterOrganization(planterAddress: string) {
  const instance = new web3.eth.Contract(
    PlanterV2.abi,
    "0x87D7a1E2dBfd71d643e6A1cA6e4343b34979C34D"
  );

  let org = await instance.methods.memberOf(planterAddress).call();
  return org;
}
