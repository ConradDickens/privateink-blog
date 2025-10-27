const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const deploymentPath = path.join(__dirname, '../deployments/localhost/PrivateInkBlog.json');
  
  if (!fs.existsSync(deploymentPath)) {
    console.log('❌ No deployment found');
    return;
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
  const contractAddress = deployment.address;

  console.log('📍 Contract Address:', contractAddress);
  console.log('');

  const PrivateInkBlog = await hre.ethers.getContractAt('PrivateInkBlog', contractAddress);
  const [signer] = await hre.ethers.getSigners();

  const blogId = process.env.BLOG_ID || 0;
  console.log(`📖 Checking Blog ${blogId} Stats:\n`);

  try {
    const blog = await PrivateInkBlog.getBlog(blogId);
    
    console.log('📊 Basic Info:');
    console.log('  Title:', blog.title);
    console.log('  Author:', blog.author);
    console.log('  isPaid:', blog.isPaid);
    console.log('');
    
    console.log('🔐 Encrypted Handles (these are encrypted values):');
    console.log('  likeCount handle:', blog.likeCount);
    console.log('  dislikeCount handle:', blog.dislikeCount);
    console.log('  unlockCount handle:', blog.unlockCount);
    console.log('  totalEarnings handle:', blog.totalEarnings);
    console.log('');
    
    console.log('💡 Note: In Mock mode, these are encrypted handles.');
    console.log('   The actual values are stored encrypted on-chain.');
    console.log('   To see real decrypted values, deploy to Sepolia testnet.');
    console.log('');
    
    // Try to check if we can decrypt (will work in full FHEVM environment)
    console.log('🔓 Attempting to decrypt (may not work in Mock mode):');
    try {
      // This will only work if the contract allows us to decrypt
      const { MockFhevmInstance } = await import('@fhevm/mock-utils');
      const provider = hre.ethers.provider;
      
      const metadata = await provider.send('fhevm_relayer_v1_metadata');
      
      const instance = await MockFhevmInstance.create(provider, provider, {
        chainId: 31337,
        gatewayChainId: 55815,
        aclContractAddress: metadata.ACLAddress,
        kmsContractAddress: metadata.KMSVerifierAddress,
        inputVerifierContractAddress: metadata.InputVerifierAddress,
        verifyingContractAddressDecryption: '0x5ffdaAB0373E62E2ea2944776209aEf29E631A64',
        verifyingContractAddressInputVerification: '0x812b06e1CDCE800494b79fFE4f925A504a9A9810',
      });
      
      // Try to decrypt like count
      try {
        const likeCountDecrypted = await instance.decrypt(contractAddress, blog.likeCount);
        console.log('  ✅ likeCount:', likeCountDecrypted.toString());
      } catch (e) {
        console.log('  ⚠️ likeCount: Cannot decrypt (ACL or Mock limitation)');
      }
      
      try {
        const dislikeCountDecrypted = await instance.decrypt(contractAddress, blog.dislikeCount);
        console.log('  ✅ dislikeCount:', dislikeCountDecrypted.toString());
      } catch (e) {
        console.log('  ⚠️ dislikeCount: Cannot decrypt (ACL or Mock limitation)');
      }
      
    } catch (err) {
      console.log('  ⚠️ Decryption not available in this environment');
      console.log('  Error:', err.message);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

