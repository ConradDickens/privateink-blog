// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, euint64, ebool, externalEuint64} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title PrivateInk - Privacy-preserving blog platform with encrypted interactions
/// @author PrivateInk Team
/// @notice A blog platform with encrypted likes/dislikes, paid unlocking, and privacy-protected earnings
contract PrivateInkBlog is SepoliaConfig {
    struct Blog {
        uint256 id;
        address author;
        string contentCID;        // IPFS CID pointing to blog content
        string title;             // Blog title (on-chain, max 100 chars)
        string summary;           // Blog summary (max 200 chars)
        uint256 timestamp;        // Publication timestamp
        bool isPaid;              // Whether blog requires payment to unlock
        uint64 priceInWei;        // Unlock price in wei (plaintext for display)
        euint64 price;            // Unlock price in wei (encrypted for validation)
        euint32 likeCount;        // Total likes (encrypted)
        euint32 dislikeCount;     // Total dislikes (encrypted)
        euint32 unlockCount;      // Number of times unlocked (encrypted, author-only)
        euint64 totalEarnings;    // Total earnings from unlocks (encrypted, author-only)
    }

    // Blog storage
    mapping(uint256 => Blog) public blogs;
    uint256 public blogCounter;

    // Access control: who can read paid content
    mapping(uint256 => mapping(address => ebool)) public accessTokens;

    // Prevent duplicate likes/dislikes (using bool for simplicity)
    mapping(uint256 => mapping(address => bool)) public hasLiked;
    mapping(uint256 => mapping(address => bool)) public hasDisliked;

    // Author's blogs for easy lookup
    mapping(address => uint256[]) public authorBlogs;

    // Events
    event BlogPublished(uint256 indexed blogId, address indexed author, string contentCID, bool isPaid);
    event BlogUnlocked(uint256 indexed blogId, address indexed reader);
    event BlogLiked(uint256 indexed blogId, address indexed user);
    event BlogDisliked(uint256 indexed blogId, address indexed user);
    event EarningsWithdrawn(uint256 indexed blogId, address indexed author, uint256 amount);

    // Custom errors
    error BlogNotFound();
    error NotAuthor();
    error AlreadyLiked();
    error AlreadyDisliked();
    error InsufficientPayment();
    error NoEarningsToWithdraw();
    error AlreadyHasAccess();

    /// @notice Publish a new blog post
    /// @param contentCID IPFS CID of the blog content
    /// @param title Blog title
    /// @param summary Blog summary
    /// @param isPaid Whether the blog requires payment
    /// @param priceInWei Plaintext unlock price in wei (for display)
    /// @param encryptedPrice Encrypted unlock price (for validation)
    /// @return blogId The ID of the newly published blog
    function publishBlog(
        string calldata contentCID,
        string calldata title,
        string calldata summary,
        bool isPaid,
        uint64 priceInWei,
        externalEuint64 encryptedPrice,
        bytes calldata inputProof
    ) external returns (uint256 blogId) {
        blogId = blogCounter++;

        // Initialize encrypted values
        euint64 price = FHE.fromExternal(encryptedPrice, inputProof);
        euint32 likeCount = FHE.asEuint32(0);
        euint32 dislikeCount = FHE.asEuint32(0);
        euint32 unlockCount = FHE.asEuint32(0);
        euint64 totalEarnings = FHE.asEuint64(0);

        // Create blog
        blogs[blogId] = Blog({
            id: blogId,
            author: msg.sender,
            contentCID: contentCID,
            title: title,
            summary: summary,
            timestamp: block.timestamp,
            isPaid: isPaid,
            priceInWei: priceInWei,
            price: price,
            likeCount: likeCount,
            dislikeCount: dislikeCount,
            unlockCount: unlockCount,
            totalEarnings: totalEarnings
        });

        // Grant access to contract and author
        FHE.allowThis(price);
        FHE.allowThis(likeCount);
        FHE.allowThis(dislikeCount);
        FHE.allowThis(unlockCount);
        FHE.allowThis(totalEarnings);

        // Author always has access
        accessTokens[blogId][msg.sender] = FHE.asEbool(true);
        FHE.allow(accessTokens[blogId][msg.sender], msg.sender);
        
        // Grant author permission to decrypt all blog stats
        FHE.allow(price, msg.sender);
        FHE.allow(likeCount, msg.sender);
        FHE.allow(dislikeCount, msg.sender);
        FHE.allow(unlockCount, msg.sender);
        FHE.allow(totalEarnings, msg.sender);

        // Like/dislike status is initialized to false by default (no explicit initialization needed)

        // Track author's blogs
        authorBlogs[msg.sender].push(blogId);

        emit BlogPublished(blogId, msg.sender, contentCID, isPaid);
    }

    /// @notice Unlock a paid blog by paying the required amount
    /// @param blogId The blog ID to unlock
    /// @param encryptedPayment The encrypted payment amount
    function unlockBlog(
        uint256 blogId,
        externalEuint64 encryptedPayment,
        bytes calldata inputProof
    ) external payable {
        if (blogId >= blogCounter) revert BlogNotFound();

        Blog storage blog = blogs[blogId];

        // Check if user already has access
        // Note: We can't directly decrypt ebool in contract, so we allow this operation
        // and rely on frontend to check before calling

        // Convert payment to encrypted value
        euint64 payment = FHE.fromExternal(encryptedPayment, inputProof);

        // Check if payment >= price
        ebool isPaid = FHE.ge(payment, blog.price);
        
        // IMPORTANT: In production, you should use a decryption oracle to verify payment
        // For now, we assume honest users (this is a known limitation of FHEVM)
        // A malicious user could pass insufficient payment and still get access token set
        // Proper solution: Use gateway/oracle to decrypt and verify before granting access
        
        // Grant access token (will be true if payment >= price, false otherwise)
        accessTokens[blogId][msg.sender] = isPaid;
        
        // Allow contract to access the token first (required for storage)
        FHE.allowThis(accessTokens[blogId][msg.sender]);
        
        // Then allow the user to decrypt it
        FHE.allow(accessTokens[blogId][msg.sender], msg.sender);

        // Update unlock count (encrypted increment)
        blog.unlockCount = FHE.add(blog.unlockCount, FHE.asEuint32(1));
        FHE.allowThis(blog.unlockCount);
        FHE.allow(blog.unlockCount, blog.author);

        // Update total earnings
        blog.totalEarnings = FHE.add(blog.totalEarnings, payment);
        FHE.allowThis(blog.totalEarnings);
        FHE.allow(blog.totalEarnings, blog.author);

        emit BlogUnlocked(blogId, msg.sender);
    }

    /// @notice Like a blog post
    /// @param blogId The blog ID to like
    function likeBlog(uint256 blogId) external {
        if (blogId >= blogCounter) revert BlogNotFound();
        if (hasLiked[blogId][msg.sender]) revert AlreadyLiked();

        Blog storage blog = blogs[blogId];

        // Increment like count
        blog.likeCount = FHE.add(blog.likeCount, FHE.asEuint32(1));

        // Mark as liked
        hasLiked[blogId][msg.sender] = true;
        
        // Grant permissions
        FHE.allowThis(blog.likeCount);
        FHE.allow(blog.likeCount, msg.sender);
        FHE.allow(blog.likeCount, blog.author);

        emit BlogLiked(blogId, msg.sender);
    }

    /// @notice Dislike a blog post
    /// @param blogId The blog ID to dislike
    function dislikeBlog(uint256 blogId) external {
        if (blogId >= blogCounter) revert BlogNotFound();
        if (hasDisliked[blogId][msg.sender]) revert AlreadyDisliked();

        Blog storage blog = blogs[blogId];

        // Increment dislike count
        blog.dislikeCount = FHE.add(blog.dislikeCount, FHE.asEuint32(1));

        // Mark as disliked
        hasDisliked[blogId][msg.sender] = true;
        
        // Grant permissions
        FHE.allowThis(blog.dislikeCount);
        FHE.allow(blog.dislikeCount, msg.sender);
        FHE.allow(blog.dislikeCount, blog.author);

        emit BlogDisliked(blogId, msg.sender);
    }

    /// @notice Check if a user has access to a blog
    /// @param blogId The blog ID
    /// @param user The user address
    /// @return isFree Whether the blog is free (returns true for isPaid=false)
    /// @return accessToken The encrypted access token for paid blogs
    /// @dev For paid blogs, check accessTokens mapping separately
    function checkAccess(uint256 blogId, address user) external view returns (bool isFree, ebool accessToken) {
        if (blogId >= blogCounter) revert BlogNotFound();
        
        Blog storage blog = blogs[blogId];
        
        // Return whether blog is free and the access token
        return (!blog.isPaid, accessTokens[blogId][user]);
    }

    /// @notice Withdraw earnings from a blog (placeholder - would need actual ETH transfer logic)
    /// @param blogId The blog ID
    /// @dev In a real implementation, this would transfer actual ETH based on decrypted earnings
    function withdrawEarnings(uint256 blogId) external {
        if (blogId >= blogCounter) revert BlogNotFound();
        
        Blog storage blog = blogs[blogId];
        if (blog.author != msg.sender) revert NotAuthor();

        // In production, would decrypt totalEarnings via oracle and transfer ETH
        // For now, just emit event
        emit EarningsWithdrawn(blogId, msg.sender, 0);
    }

    /// @notice Get basic blog information
    /// @param blogId The blog ID
    /// @return Blog struct (encrypted fields remain encrypted)
    function getBlog(uint256 blogId) external view returns (Blog memory) {
        if (blogId >= blogCounter) revert BlogNotFound();
        return blogs[blogId];
    }

    /// @notice Get all blog IDs for an author
    /// @param author The author address
    /// @return Array of blog IDs
    function getAuthorBlogs(address author) external view returns (uint256[] memory) {
        return authorBlogs[author];
    }

    /// @notice Get total number of blogs
    /// @return Total blog count
    function getTotalBlogs() external view returns (uint256) {
        return blogCounter;
    }
}

