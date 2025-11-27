/**
 * FHEVM Network configurations
 * Adapted from frontend reference implementation
 */

export const SEPOLIA_CHAIN_ID = 11155111;
export const LOCAL_CHAIN_ID = 31337;

export const SepoliaConfig = {
  chainId: SEPOLIA_CHAIN_ID,
  name: 'Sepolia',
  rpcUrl: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || 'https://sepolia.infura.io/v3/',
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

/**
 * Get RPC URL for a given chain ID
 * Uses environment variable if set, otherwise falls back to defaults
 */
export function getRpcUrl(chainId: number): string {
  // Check for environment variable override
  const envRpcUrl = process.env.NEXT_PUBLIC_RPC_URL;
  if (envRpcUrl) {
    return envRpcUrl;
  }

  // Use network config defaults
  const config = getNetworkConfig(chainId);
  if (config) {
    // For Sepolia, append API key if provided
    if (chainId === SEPOLIA_CHAIN_ID) {
      const apiKey = process.env.NEXT_PUBLIC_INFURA_API_KEY || process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
      if (apiKey && config.rpcUrl.includes('infura.io')) {
        return `${config.rpcUrl}${apiKey}`;
      }
      if (apiKey && config.rpcUrl.includes('alchemy.com')) {
        return `${config.rpcUrl}${apiKey}`;
      }
      // Default public RPC
      return 'https://sepolia.infura.io/v3/';
    }
    return config.rpcUrl;
  }

  // Fallback to localhost for unknown networks
  return 'http://localhost:8545';
}

