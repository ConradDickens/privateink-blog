import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, fhevm } from "hardhat";
import { PrivateInkBlog, PrivateInkBlog__factory } from "../types";
import { expect } from "chai";
import { FhevmType } from "@fhevm/hardhat-plugin";

type Signers = {
  deployer: HardhatEthersSigner;
  alice: HardhatEthersSigner;
  bob: HardhatEthersSigner;
};

async function deployFixture() {
  const factory = (await ethers.getContractFactory("PrivateInkBlog")) as PrivateInkBlog__factory;
  const contract = (await factory.deploy()) as PrivateInkBlog;
  const contractAddress = await contract.getAddress();

  return { contract, contractAddress };
}

describe("PrivateInkBlog", function () {
  let signers: Signers;
  let contract: PrivateInkBlog;
  let contractAddress: string;

  before(async function () {
    const ethSigners: HardhatEthersSigner[] = await ethers.getSigners();
    signers = { deployer: ethSigners[0], alice: ethSigners[1], bob: ethSigners[2] };
  });

  beforeEach(async function () {
    // Check whether the tests are running against an FHEVM mock environment
    if (!fhevm.isMock) {
      console.warn(`This hardhat test suite cannot run on Sepolia Testnet`);
      this.skip();
    }

    ({ contract, contractAddress } = await deployFixture());
  });

  describe("Deployment", function () {
    it("should initialize with zero blogs", async function () {
      const totalBlogs = await contract.getTotalBlogs();
      expect(totalBlogs).to.equal(0);
    });
  });

  describe("Publishing Blogs", function () {
    it("should publish a free blog", async function () {
      const contentCID = "QmTest123";
      const title = "My First Blog";
      const summary = "This is a test blog";
      const isPaid = false;

      // Encrypt price (0 for free)
      const encryptedPrice = await fhevm
        .createEncryptedInput(contractAddress, signers.alice.address)
        .add64(0)
        .encrypt();

      const tx = await contract
        .connect(signers.alice)
        .publishBlog(
          contentCID,
          title,
          summary,
          isPaid,
          encryptedPrice.handles[0],
          encryptedPrice.inputProof
        );

      await expect(tx)
        .to.emit(contract, "BlogPublished")
        .withArgs(0, signers.alice.address, contentCID, isPaid);

      const blog = await contract.getBlog(0);
      expect(blog.id).to.equal(0);
      expect(blog.author).to.equal(signers.alice.address);
      expect(blog.contentCID).to.equal(contentCID);
      expect(blog.title).to.equal(title);
      expect(blog.summary).to.equal(summary);
      expect(blog.isPaid).to.equal(isPaid);
    });

    it("should publish a paid blog", async function () {
      const contentCID = "QmPaidBlog456";
      const title = "Premium Content";
      const summary = "This is premium content";
      const isPaid = true;
      const price = ethers.parseEther("0.1");

      // Encrypt price
      const encryptedPrice = await fhevm
        .createEncryptedInput(contractAddress, signers.alice.address)
        .add64(Number(price))
        .encrypt();

      const tx = await contract
        .connect(signers.alice)
        .publishBlog(
          contentCID,
          title,
          summary,
          isPaid,
          encryptedPrice.handles[0],
          encryptedPrice.inputProof
        );

      await expect(tx)
        .to.emit(contract, "BlogPublished")
        .withArgs(0, signers.alice.address, contentCID, isPaid);

      const blog = await contract.getBlog(0);
      expect(blog.isPaid).to.equal(true);
    });

    it("should track author blogs", async function () {
      // Alice publishes 2 blogs
      for (let i = 0; i < 2; i++) {
        const encryptedPrice = await fhevm
          .createEncryptedInput(contractAddress, signers.alice.address)
          .add64(0)
          .encrypt();

        await contract
          .connect(signers.alice)
          .publishBlog(
            `QmTest${i}`,
            `Blog ${i}`,
            `Summary ${i}`,
            false,
            encryptedPrice.handles[0],
            encryptedPrice.inputProof
          );
      }

      const aliceBlogs = await contract.getAuthorBlogs(signers.alice.address);
      expect(aliceBlogs.length).to.equal(2);
      expect(aliceBlogs[0]).to.equal(0);
      expect(aliceBlogs[1]).to.equal(1);
    });
  });

  describe("Liking Blogs", function () {
    beforeEach(async function () {
      // Publish a test blog
      const encryptedPrice = await fhevm
        .createEncryptedInput(contractAddress, signers.alice.address)
        .add64(0)
        .encrypt();

      await contract
        .connect(signers.alice)
        .publishBlog(
          "QmTest",
          "Test Blog",
          "Summary",
          false,
          encryptedPrice.handles[0],
          encryptedPrice.inputProof
        );
    });

    it("should allow user to like a blog", async function () {
      const tx = await contract.connect(signers.bob).likeBlog(0);
      await expect(tx).to.emit(contract, "BlogLiked").withArgs(0, signers.bob.address);
    });

    it("should increment like count", async function () {
      // Bob likes the blog
      await contract.connect(signers.bob).likeBlog(0);

      // Get the encrypted like count
      const blog = await contract.getBlog(0);
      
      // Decrypt like count (Alice is author, has permission)
      const likeCount = await fhevm.userDecryptEuint(
        FhevmType.euint32,
        blog.likeCount,
        contractAddress,
        signers.alice
      );

      expect(likeCount).to.equal(1);
    });

    it("should prevent double liking", async function () {
      // Bob likes once
      await contract.connect(signers.bob).likeBlog(0);

      // Bob tries to like again - should revert
      await expect(
        contract.connect(signers.bob).likeBlog(0)
      ).to.be.revertedWithCustomError(contract, "AlreadyLiked");
    });
  });

  describe("Disliking Blogs", function () {
    beforeEach(async function () {
      const encryptedPrice = await fhevm
        .createEncryptedInput(contractAddress, signers.alice.address)
        .add64(0)
        .encrypt();

      await contract
        .connect(signers.alice)
        .publishBlog(
          "QmTest",
          "Test Blog",
          "Summary",
          false,
          encryptedPrice.handles[0],
          encryptedPrice.inputProof
        );
    });

    it("should allow user to dislike a blog", async function () {
      const tx = await contract.connect(signers.bob).dislikeBlog(0);
      await expect(tx).to.emit(contract, "BlogDisliked").withArgs(0, signers.bob.address);
    });

    it("should increment dislike count", async function () {
      await contract.connect(signers.bob).dislikeBlog(0);

      const blog = await contract.getBlog(0);
      const dislikeCount = await fhevm.userDecryptEuint(
        FhevmType.euint32,
        blog.dislikeCount,
        contractAddress,
        signers.alice
      );

      expect(dislikeCount).to.equal(1);
    });
  });

  describe("Unlocking Paid Blogs", function () {
    const blogPrice = 1000000; // Small price for testing

    beforeEach(async function () {
      // Alice publishes a paid blog
      const encryptedPrice = await fhevm
        .createEncryptedInput(contractAddress, signers.alice.address)
        .add64(blogPrice)
        .encrypt();

      await contract
        .connect(signers.alice)
        .publishBlog(
          "QmPaidContent",
          "Premium Blog",
          "Exclusive content",
          true,
          encryptedPrice.handles[0],
          encryptedPrice.inputProof
        );
    });

    it("should unlock blog with sufficient payment", async function () {
      // Bob pays to unlock
      const encryptedPayment = await fhevm
        .createEncryptedInput(contractAddress, signers.bob.address)
        .add64(blogPrice)
        .encrypt();

      const tx = await contract
        .connect(signers.bob)
        .unlockBlog(0, encryptedPayment.handles[0], encryptedPayment.inputProof);

      await expect(tx).to.emit(contract, "BlogUnlocked").withArgs(0, signers.bob.address);
    });

    it("should update unlock count and earnings", async function () {
      // Bob unlocks
      const encryptedPayment = await fhevm
        .createEncryptedInput(contractAddress, signers.bob.address)
        .add64(blogPrice)
        .encrypt();

      await contract
        .connect(signers.bob)
        .unlockBlog(0, encryptedPayment.handles[0], encryptedPayment.inputProof);

      const blog = await contract.getBlog(0);

      // Decrypt unlock count (author can decrypt)
      const unlockCount = await fhevm.userDecryptEuint(
        FhevmType.euint32,
        blog.unlockCount,
        contractAddress,
        signers.alice
      );

      expect(unlockCount).to.equal(1);

      // Decrypt total earnings
      const totalEarnings = await fhevm.userDecryptEuint(
        FhevmType.euint64,
        blog.totalEarnings,
        contractAddress,
        signers.alice
      );

      expect(totalEarnings).to.equal(blogPrice);
    });
  });

  describe("Access Control", function () {
    it("should grant author automatic access to free blog", async function () {
      const encryptedPrice = await fhevm
        .createEncryptedInput(contractAddress, signers.alice.address)
        .add64(0)
        .encrypt();

      await contract
        .connect(signers.alice)
        .publishBlog(
          "QmTest",
          "Test Blog",
          "Summary",
          false,
          encryptedPrice.handles[0],
          encryptedPrice.inputProof
        );

      const [isFree, accessToken] = await contract.checkAccess(0, signers.alice.address);
      
      // For free blogs, isFree should be true (which grants access)
      expect(isFree).to.equal(true);
    });

    it("should allow access to free blogs", async function () {
      const encryptedPrice = await fhevm
        .createEncryptedInput(contractAddress, signers.alice.address)
        .add64(0)
        .encrypt();

      await contract
        .connect(signers.alice)
        .publishBlog(
          "QmFree",
          "Free Blog",
          "Summary",
          false, // Not paid
          encryptedPrice.handles[0],
          encryptedPrice.inputProof
        );

      // Anyone should have access to free blogs
      const [isFree, accessToken] = await contract.checkAccess(0, signers.bob.address);
      expect(isFree).to.equal(true);
    });
  });

  describe("Error Handling", function () {
    it("should revert when getting non-existent blog", async function () {
      await expect(contract.getBlog(999)).to.be.revertedWithCustomError(
        contract,
        "BlogNotFound"
      );
    });

    it("should revert when non-author tries to withdraw", async function () {
      const encryptedPrice = await fhevm
        .createEncryptedInput(contractAddress, signers.alice.address)
        .add64(0)
        .encrypt();

      await contract
        .connect(signers.alice)
        .publishBlog(
          "QmTest",
          "Test",
          "Summary",
          false,
          encryptedPrice.handles[0],
          encryptedPrice.inputProof
        );

      await expect(
        contract.connect(signers.bob).withdrawEarnings(0)
      ).to.be.revertedWithCustomError(contract, "NotAuthor");
    });
  });
});

