/**
 * FHEVM Network configurations
 * Adapted from frontend reference implementation
 */

export const SEPOLIA_CHAIN_ID = 11155111;
export const LOCAL_CHAIN_ID = 31337;

export const SepoliaConfig = {
  chainId: SEPOLIA_CHAIN_ID,
  name: 'Sepolia',
  rpcUrl: 'https://sepolia.infura.io/v3/',
  relayerUrl: 'https://relayer.sepolia.zama.ai',
};

export const LocalConfig = {
  chainId: LOCAL_CHAIN_ID,
  name: 'Localhost',
  rpcUrl: 'http://localhost:8545',
  relayerUrl: '', // Not used for mock
};

export function getNetworkConfig(chainId: number) {
  switch (chainId) {
    case SEPOLIA_CHAIN_ID:
      return SepoliaConfig;
    case LOCAL_CHAIN_ID:
      return LocalConfig;
    default:
      return null;
  }
}

export function isLocalNetwork(chainId: number): boolean {
  return chainId === LOCAL_CHAIN_ID;
}

