const hre = require('hardhat');

async function main() {
  const BLOG_ID = process.env.BLOG_ID || 1;
  
  console.log(`\n🔍 Checking Blog ${BLOG_ID} Price Field\n`);
  
  const contractAddress = '0xd4B5327816E08cce36F7D537c43939f5229572D1';
  const PrivateInkBlog = await hre.ethers.getContractAt('PrivateInkBlog', contractAddress);
  
  const blog = await PrivateInkBlog.getBlog(BLOG_ID);
  
  console.log('📖 Blog Data:');
  console.log('  id:', blog.id.toString());
  console.log('  title:', blog.title);
  console.log('  author:', blog.author);
  console.log('  isPaid:', blog.isPaid);
  console.log('  priceInWei:', blog.priceInWei.toString());
  console.log('  priceInWei type:', typeof blog.priceInWei);
  console.log('  price (encrypted handle):', blog.price.toString());
  
  if (blog.isPaid) {
    const priceInWei = Number(blog.priceInWei);
    const priceInEth = priceInWei / 1e18;
    console.log('\n💰 Price Info:');
    console.log('  Price in Wei:', priceInWei);
    console.log('  Price in ETH:', priceInEth.toFixed(4));
  } else {
    console.log('\n📖 This is a FREE blog');
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


