const TreeFactory = require("./../../../abi/TreeFactory.json");
const Web3 = require("web3");

const web3 = new Web3("http://localhost:8545");

export async function getTreeData(treeId: number) {
  const instance = new web3.eth.Contract(
    TreeFactory.abi,
    "0x25ce4B4deF61500DB61b4e6730d32e81D95a5842"
  );

  let tree = await instance.methods.trees(treeId).call();
  return tree;
}
