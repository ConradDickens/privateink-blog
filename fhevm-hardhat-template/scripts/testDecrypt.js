const hre = require('hardhat');
const { MockFhevmInstance } = require('@fhevm/mock-utils');

async function main() {
  const BLOG_ID = process.env.BLOG_ID || 1;
  
  console.log(`\n🔐 Testing Mock Decryption for Blog ${BLOG_ID}\n`);
  
  // Get contract
  const contractAddress = '0xd4B5327816E08cce36F7D537c43939f5229572D1';
  const PrivateInkBlog = await hre.ethers.getContractAt('PrivateInkBlog', contractAddress);
  
  // Get signer
  const [signer] = await hre.ethers.getSigners();
  console.log(`👤 Signer Address: ${signer.address}`);
  
  // Get blog info
  const blog = await PrivateInkBlog.getBlog(BLOG_ID);
  console.log(`\n📖 Blog Info:`);
  console.log(`  Title: ${blog.title}`);
  console.log(`  Author: ${blog.author}`);
  console.log(`  likeCount handle: ${blog.likeCount}`);
  console.log(`  dislikeCount handle: ${blog.dislikeCount}`);
  
  // Create Mock FHEVM instance
  console.log(`\n⚙️ Creating Mock FHEVM instance...`);
  const provider = hre.ethers.provider;
  
  // Fetch metadata from local node
  const metadataResponse = await fetch('http://localhost:8545', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'fhevm_relayer_metadata',
      params: [],
      id: 1,
    }),
  });
  const metadataData = await metadataResponse.json();
  const metadata = metadataData.result;
  if (!metadata) {
    throw new Error('Failed to fetch FHEVM metadata');
  }
  console.log(`✅ Metadata fetched:`, JSON.stringify(metadata, null, 2));
  
  const instance = await MockFhevmInstance.create(provider, provider, {
    chainId: 31337,
    gatewayChainId: 55815,
    aclContractAddress: metadata.ACLAddress,
    kmsContractAddress: metadata.KMSVerifierAddress, // Correct parameter name
    inputVerifierContractAddress: metadata.InputVerifierAddress,
    verifyingContractAddressDecryption: '0x5ffdaAB0373E62E2ea2944776209aEf29E631A64',
    verifyingContractAddressInputVerification: '0x812b06e1CDCE800494b79fFE4f925A504a9A9810',
  });
  console.log(`✅ Mock instance created`);
  
  // Generate keypair
  const keypair = instance.generateKeypair();
  console.log(`✅ Keypair generated`);
  
  // Create EIP712
  const startTimestamp = Math.floor(Date.now() / 1000) - 1;
  const durationDays = 365;
  const eip712 = instance.createEIP712(
    keypair.publicKey,
    [contractAddress],
    startTimestamp,
    durationDays
  );
  console.log(`✅ EIP712 created`);
  
  // Sign
  const signature = await signer.signTypedData(
    eip712.domain,
    { UserDecryptRequestVerification: eip712.types.UserDecryptRequestVerification },
    eip712.message
  );
  console.log(`✅ Signed`);
  
  // Decrypt likeCount
  console.log(`\n🔓 Decrypting likeCount...`);
  try {
    const likeResults = await instance.userDecrypt(
      [{ handle: blog.likeCount, contractAddress }],
      keypair.privateKey,
      keypair.publicKey,
      signature,
      [contractAddress],
      signer.address,
      startTimestamp,
      durationDays
    );
    console.log(`✅ likeCount decrypted: ${likeResults[0]}`);
  } catch (err) {
    console.error(`❌ likeCount decryption failed:`, err.message);
  }
  
  // Decrypt dislikeCount
  console.log(`\n🔓 Decrypting dislikeCount...`);
  try {
    const dislikeResults = await instance.userDecrypt(
      [{ handle: blog.dislikeCount, contractAddress }],
      keypair.privateKey,
      keypair.publicKey,
      signature,
      [contractAddress],
      signer.address,
      startTimestamp,
      durationDays
    );
    console.log(`✅ dislikeCount decrypted: ${dislikeResults[0]}`);
  } catch (err) {
    console.error(`❌ dislikeCount decryption failed:`, err.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

