import { ethers } from "ethers";

export function isValidEthAddress(address: string): boolean {
    const ethereumAddressRegex = /^(0x)?[0-9a-fA-F]{40}$/;

  return !ethereumAddressRegex.test(address);
  }
  
  export function isValidMetamaskPassword(password: string): boolean {
    // Use a regular expression that requires at least 8 characters
    // and at least one uppercase letter, one lowercase letter, and one digit.
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  
    return !passwordRegex.test(password);
  }

  export function limitTo18Decimals(number: string): boolean {
    const decimalRegex = /^\d+(\.\d{0,18})?$/;

    return !decimalRegex.test(number);
  }

  export const currentTime = (): number => Math.floor(Date.now() / 1000)
  
  export function performKeccak256(val: string, salt: string) {
    try {
      const bytes32Value = ethers.utils.keccak256(salt);
  
      // Concatenate the address and bytes32 value
      const data = ethers.utils.solidityPack(
        ["uint8", "bytes32"],
        [val, bytes32Value]
      );
  
      // Compute the Keccak256 hash (SHA3-256) of the concatenated data
      const hash = ethers.utils.keccak256(data);
  
      return hash;
    } catch (error) {
      console.error("Error performing Keccak256:", error);
    }
  }