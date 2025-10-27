#!/usr/bin/env node

/**
 * Generate ABI and contract addresses from deployment artifacts
 * Reads from ../fhevm-hardhat-template/deployments/
 * Writes to ./abi/
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FRONTEND_ROOT = path.resolve(__dirname, '..');
const HARDHAT_ROOT = path.resolve(__dirname, '../../fhevm-hardhat-template');
const DEPLOYMENTS_DIR = path.join(HARDHAT_ROOT, 'deployments');
const ABI_OUTPUT_DIR = path.join(FRONTEND_ROOT, 'abi');

// Contract to generate
const CONTRACT_NAME = 'PrivateInkBlog';

console.log('🔧 Generating ABI and addresses...\n');

// Ensure output directory exists
if (!fs.existsSync(ABI_OUTPUT_DIR)) {
  fs.mkdirSync(ABI_OUTPUT_DIR, { recursive: true });
}

// Find all network deployments
const networks = fs.existsSync(DEPLOYMENTS_DIR)
  ? fs.readdirSync(DEPLOYMENTS_DIR).filter((dir) => {
      const stat = fs.statSync(path.join(DEPLOYMENTS_DIR, dir));
      return stat.isDirectory() && dir !== 'solcInputs';
    })
  : [];

if (networks.length === 0) {
  console.warn('⚠️  No deployment artifacts found.');
  console.warn('   Run: cd ../fhevm-hardhat-template && npx hardhat deploy --network localhost');
  process.exit(0);
}

console.log(`📂 Found networks: ${networks.join(', ')}\n`);

// Generate ABI file
const addresses = {};
let abi = null;

for (const network of networks) {
  const deploymentFile = path.join(DEPLOYMENTS_DIR, network, `${CONTRACT_NAME}.json`);
  
  if (fs.existsSync(deploymentFile)) {
    const deployment = JSON.parse(fs.readFileSync(deploymentFile, 'utf-8'));
    
    // Store address for this network
    const chainId = getChainIdFromNetwork(network);
    addresses[chainId] = deployment.address;
    
    // Use ABI from first deployment found
    if (!abi) {
      abi = deployment.abi;
    }
    
    console.log(`✅ ${network} (chainId: ${chainId}): ${deployment.address}`);
  }
}

if (!abi) {
  console.error(`❌ No deployment found for ${CONTRACT_NAME}`);
  process.exit(1);
}

// Write ABI file
const abiFilePath = path.join(ABI_OUTPUT_DIR, `${CONTRACT_NAME}ABI.ts`);
const abiContent = `// Auto-generated file - DO NOT EDIT
// Generated from deployment artifacts

export const ${CONTRACT_NAME}ABI = ${JSON.stringify(abi, null, 2)} as const;

export type ${CONTRACT_NAME}ABI = typeof ${CONTRACT_NAME}ABI;
`;

fs.writeFileSync(abiFilePath, abiContent);
console.log(`\n📝 Generated ABI: ${abiFilePath}`);

// Write addresses file
const addressesFilePath = path.join(ABI_OUTPUT_DIR, `${CONTRACT_NAME}Addresses.ts`);
const addressesContent = `// Auto-generated file - DO NOT EDIT
// Generated from deployment artifacts

export const ${CONTRACT_NAME}Addresses: Record<number, string> = ${JSON.stringify(addresses, null, 2)};

export function get${CONTRACT_NAME}Address(chainId: number): string | undefined {
  return ${CONTRACT_NAME}Addresses[chainId];
}
`;

fs.writeFileSync(addressesFilePath, addressesContent);
console.log(`📝 Generated addresses: ${addressesFilePath}`);

console.log('\n✨ ABI generation complete!\n');

// Helper function to map network name to chainId
function getChainIdFromNetwork(network) {
  const chainIds = {
    localhost: 31337,
    hardhat: 31337,
    sepolia: 11155111,
    mainnet: 1,
  };
  return chainIds[network] || 31337;
}

