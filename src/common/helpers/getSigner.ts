var sigUtil = require("eth-sig-util");

export async function getSigner(signature: string, message, selector: Number) {
  let primaryTypeObj;
  let primaryType;

  if (selector == 1) {
    primaryType = "plantAssignTree";
    primaryTypeObj = [
      { name: "nonce", type: "uint256" },
      { name: "treeId", type: "uint256" },
      { name: "treeSpecs", type: "string" },
      { name: "birthDate", type: "uint64" },
      { name: "countryCode", type: "uint16" },
    ];
  } else if (selector == 2) {
  } else if (selector == 3) {
  }

  const msgParams = JSON.stringify({
    types: {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
      ],
      [primaryType]: primaryTypeObj,
    },
    primaryType,
    domain: {
      name: "Treejer Protocol",
      version: "1",
      chainId: Number(process.env.CHAIN_ID),
      verifyingContract: process.env.VERIFYING_CONTRACT,
    },
    message,
  });

  const recovered = sigUtil.recoverTypedSignature({
    data: JSON.parse(msgParams),
    sig: signature,
  });

  return recovered;
}
