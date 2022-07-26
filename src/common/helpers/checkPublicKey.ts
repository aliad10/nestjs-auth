export function checkPublicKey(str: string): boolean {
  const pattern: string = "^" + "0x" + "[0-9a-fA-F]" + ("{40}" + "$");

  return new RegExp(pattern).test(str);
}
