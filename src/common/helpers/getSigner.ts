var sigUtil = require("eth-sig-util");

export async function getSigner(signature: string, message) {
  const msgParams = JSON.stringify({
    types: {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
      ],
      plantAssignTree: [
        { name: "nonce", type: "uint256" },
        { name: "treeId", type: "uint256" },
        { name: "treeSpecs", type: "string" },
        { name: "birthDate", type: "uint64" },
        { name: "countryCode", type: "uint16" },
      ],
    },
    //make sure to replace verifyingContract with address of deployed contract
    primaryType: "plantAssignTree",
    domain: {
      name: "Treejer Protocol",
      version: "1",
      chainId: 1337,
      verifyingContract: "0x25ce4B4deF61500DB61b4e6730d32e81D95a5842",
    },
    message,
  });

  const recovered = sigUtil.recoverTypedSignature({
    data: JSON.parse(msgParams),
    sig: signature,
  });

  return recovered;
}
