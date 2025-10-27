const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  // Read deployment info
  const deploymentPath = path.join(__dirname, '../deployments/localhost/PrivateInkBlog.json');
  
  if (!fs.existsSync(deploymentPath)) {
    console.log('❌ No deployment found. Please deploy the contract first.');
    return;
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
  const contractAddress = deployment.address;

  console.log('📍 Contract Address:', contractAddress);

  // Get contract instance
  const PrivateInkBlog = await hre.ethers.getContractAt('PrivateInkBlog', contractAddress);

  // Get total blogs
  const totalBlogs = await PrivateInkBlog.getTotalBlogs();
  console.log('📊 Total Blogs:', totalBlogs.toString());

  // Get each blog
  for (let i = 0; i < totalBlogs; i++) {
    console.log(`\n📖 Blog ${i}:`);
    const blog = await PrivateInkBlog.getBlog(i);
    console.log('  ID:', blog.id.toString());
    console.log('  Title:', blog.title);
    console.log('  Summary:', blog.summary);
    console.log('  Author:', blog.author);
    console.log('  Content CID:', blog.contentCID);
    console.log('  isPaid:', blog.isPaid);
    console.log('  Timestamp:', new Date(Number(blog.timestamp) * 1000).toISOString());
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

