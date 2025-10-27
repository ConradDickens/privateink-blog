#!/usr/bin/env node

/**
 * Check if Hardhat node is running on localhost:8545
 * Exits with error if not running (used for dev:mock script)
 */

async function checkNode() {
  try {
    const response = await fetch('http://localhost:8545', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_chainId',
        params: [],
        id: 1,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const chainId = parseInt(data.result, 16);
      
      if (chainId === 31337) {
        console.log('✅ Hardhat node is running (chainId: 31337)');
        process.exit(0);
      } else {
        console.error(`❌ Node is running but wrong chainId: ${chainId} (expected 31337)`);
        process.exit(1);
      }
    }
  } catch (error) {
    console.error('❌ Hardhat node is not running on localhost:8545');
    console.error('\n💡 Start it with:');
    console.error('   cd ../fhevm-hardhat-template && npx hardhat node\n');
    process.exit(1);
  }
}

checkNode();

