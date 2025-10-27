/**
 * FHEVM Instance Management
 * Handles Mock (local) and Relayer (testnet/mainnet) modes
 * Adapted from frontend reference implementation
 */

'use client';

import { ethers, BrowserProvider, JsonRpcProvider } from 'ethers';
import { RelayerSDKLoader, FhevmWindow } from './loader';
import { isLocalNetwork, getNetworkConfig, SEPOLIA_CHAIN_ID } from './constants';

export interface FhevmInstance {
  createEncryptedInput(contractAddress: string, userAddress: string): any;
  encrypt64?: (value: number | bigint) => Promise<{ handles: any[]; inputProof: any }>;
  encrypt32?: (value: number) => Promise<{ handles: any[]; inputProof: any }>;
  userDecrypt?: (handle: string, contractAddress: string) => Promise<bigint>;
  userDecryptBool?: (handle: string, contractAddress: string) => Promise<boolean>;
}

export interface EncryptedInput {
  add64(value: number | bigint): EncryptedInput;
  add32(value: number): EncryptedInput;
  addBool(value: boolean): EncryptedInput;
  encrypt(): Promise<{ handles: any[]; inputProof: any }>;
}

let fhevmInstance: FhevmInstance | null = null;
let currentChainId: number | null = null;

/**
 * Initialize FHEVM instance based on network
 * - Local (chainId 31337): Use Mock
 * - Sepolia: Use Relayer SDK
 */
export async function initFhevm(provider: BrowserProvider): Promise<FhevmInstance> {
  const network = await provider.getNetwork();
  const chainId = Number(network.chainId);

  // Return cached instance if same network
  if (fhevmInstance && currentChainId === chainId) {
    return fhevmInstance;
  }

  currentChainId = chainId;

  // Local network: Use Mock
  if (isLocalNetwork(chainId)) {
    console.log('[FHEVM] Initializing Mock for local network');
    const instance = await initMockInstance(provider);
    fhevmInstance = instance;
    return instance;
  }

  // Testnet/Mainnet: Use Relayer SDK
  console.log('[FHEVM] Initializing Relayer SDK for network:', chainId);
  const instance = await initRelayerInstance(provider, chainId);
  fhevmInstance = instance;
  return instance;
}

/**
 * Initialize Mock instance for local development
 */
async function initMockInstance(provider: BrowserProvider): Promise<FhevmInstance> {
  // Dynamically import @fhevm/mock-utils to avoid bundling in production
  const { MockFhevmInstance } = await import('@fhevm/mock-utils');

  // Check if hardhat node has fhevm metadata
  const rpcUrl = 'http://localhost:8545';
  const metadata = await tryFetchMetadata(rpcUrl);

  if (!metadata) {
    throw new Error('FHEVM metadata not found on local node. Did you deploy contracts?');
  }

  console.log('[FHEVM Mock] Creating instance with metadata:', metadata);

  // Create JsonRpcProvider for Mock (required by MockFhevmInstance)
  const jsonRpcProvider = new JsonRpcProvider(rpcUrl);

  // Create mock instance using JsonRpcProvider
  const instance = await MockFhevmInstance.create(jsonRpcProvider, jsonRpcProvider, {
    chainId: 31337,
    gatewayChainId: 55815,
    aclContractAddress: metadata.ACLAddress,
    kmsContractAddress: metadata.KMSVerifierAddress,
    inputVerifierContractAddress: metadata.InputVerifierAddress,
    verifyingContractAddressDecryption: '0x5ffdaAB0373E62E2ea2944776209aEf29E631A64',
    verifyingContractAddressInputVerification: '0x812b06e1CDCE800494b79fFE4f925A504a9A9810',
  });

  console.log('[FHEVM Mock] Instance created successfully');
  
  // Return the instance directly - it already implements FhevmInstance interface
  return instance as unknown as FhevmInstance;
}

/**
 * Initialize Relayer SDK instance for testnet/mainnet
 */
async function initRelayerInstance(provider: BrowserProvider, chainId: number): Promise<FhevmInstance> {
  // Load Relayer SDK from CDN
  const loader = new RelayerSDKLoader({ trace: console.log });
  await loader.load();

  const win = window as unknown as FhevmWindow;
  const sdk = win.relayerSDK;

  // Initialize SDK
  if (!sdk.__initialized__) {
    await sdk.initSDK();
    sdk.__initialized__ = true;
  }

  // Get network config
  const config = getNetworkConfig(chainId);
  if (!config) {
    throw new Error(`Unsupported network: ${chainId}`);
  }

  // Create instance
  const instance = await sdk.createInstance({
    chainId: chainId,
    network: config.name,
    publicKeyVerifier: config.relayerUrl,
  });

  // Wrap Relayer instance to match interface
  return instance as FhevmInstance;
}

/**
 * Try to fetch FHEVM metadata from hardhat node
 */
async function tryFetchMetadata(rpcUrl: string): Promise<{
  ACLAddress: string;
  KMSVerifierAddress: string;
  InputVerifierAddress: string;
  publicKey?: string;
} | null> {
  try {
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'fhevm_relayer_metadata',
        params: [],
        id: 1,
      }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    if (data.result) {
      return data.result;
    }
    return null;
  } catch (error) {
    console.warn('Failed to fetch FHEVM metadata:', error);
    return null;
  }
}

/**
 * Get current FHEVM instance (must call initFhevm first)
 */
export function getFhevmInstance(): FhevmInstance | null {
  return fhevmInstance;
}

/**
 * Clear cached instance (useful when switching networks)
 */
export function clearFhevmInstance() {
  fhevmInstance = null;
  currentChainId = null;
}

