/**
 * PrivateInkBlog Contract Interaction Hook
 * Handles all contract interactions with encryption/decryption
 */

'use client';

import { Contract } from 'ethers';
import { useState, useCallback, useEffect } from 'react';
import { useWallet } from './useWallet';
import { PrivateInkBlogABI } from '@/abi/PrivateInkBlogABI';
import { getPrivateInkBlogAddress } from '@/abi/PrivateInkBlogAddresses';
import { uploadToPinata, fetchFromPinata, type BlogContent } from '@/lib/pinata';

export interface Blog {
  id: number;
  author: string;
  contentCID: string;
  title: string;
  summary: string;
  timestamp: bigint;
  isPaid: boolean;
  // Encrypted fields (handles)
  price: string;
  likeCount: string;
  dislikeCount: string;
  unlockCount: string;
  totalEarnings: string;
}

export function usePrivateInkBlog() {
  const { account, chainId, provider, fhevmInstance } = useWallet();
  const [contract, setContract] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize contract (read-only operations don't need account)
  useEffect(() => {
    if (provider && chainId) {
      const address = getPrivateInkBlogAddress(chainId);
      if (address) {
        console.log(`📝 Initializing contract at ${address} for chainId ${chainId}`);
        const contractInstance = new Contract(address, PrivateInkBlogABI, provider);
        setContract(contractInstance);
        console.log('✅ Contract initialized');
      } else {
        console.warn(`⚠️ No contract address found for chainId ${chainId}`);
        setContract(null);
      }
    } else {
      console.log('⚠️ Provider or chainId not available');
      setContract(null);
    }
  }, [provider, chainId]);

  /**
   * Publish a new blog
   */
  const publishBlog = useCallback(async (
    title: string,
    content: string,
    summary: string,
    isPaid: boolean,
    price: number,
    tags?: string[]
  ) => {
    if (!contract || !account || !fhevmInstance || !provider) {
      throw new Error('Wallet not connected or contract not initialized');
    }

    setIsLoading(true);
    setError(null);

    try {
      // 1. Upload content to IPFS
      const blogContent: BlogContent = {
        title,
        content,
        summary,
        tags: tags || [],
        author: account,
        timestamp: Date.now(),
        version: '1.0',
      };

      const cid = await uploadToPinata(blogContent);
      console.log('Uploaded to IPFS:', cid);

      // 2. Encrypt price using createEncryptedInput
      const contractAddr = await contract.getAddress();
      const input = fhevmInstance.createEncryptedInput(contractAddr, account);
      // Use Math.floor to ensure integer, then convert to BigInt
      const priceWei = BigInt(Math.floor(price));
      console.log('💰 Publishing blog with price:', priceWei.toString(), 'wei');
      console.log('💰 Price in ETH:', Number(priceWei) / 1e18);
      input.add64(priceWei);
      const encryptedPrice = await input.encrypt();
      console.log('🔐 Encrypted price:', encryptedPrice);

      // 3. Call contract
      const signer = await provider.getSigner();
      const contractWithSigner = contract.connect(signer);

      const tx = await contractWithSigner.publishBlog(
        cid,
        title,
        summary,
        isPaid,
        priceWei, // Add plaintext price for display
        encryptedPrice.handles[0],
        encryptedPrice.inputProof
      );

      await tx.wait();
      console.log('Blog published successfully');

      return tx.hash;
    } catch (err: any) {
      const message = err.message || 'Failed to publish blog';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, [contract, account, fhevmInstance, provider]);

  /**
   * Unlock a paid blog
   */
  const unlockBlog = useCallback(async (blogId: number, payment: number) => {
    if (!contract || !account || !fhevmInstance || !provider) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    setError(null);

    try {
      // Encrypt payment amount using createEncryptedInput
      const contractAddr = await contract.getAddress();
      const input = fhevmInstance.createEncryptedInput(contractAddr, account);
      // Use Math.floor to ensure integer, then convert to BigInt
      const paymentWei = BigInt(Math.floor(payment));
      console.log('💳 Unlocking blog with payment:', paymentWei.toString(), 'wei');
      console.log('💳 Payment in ETH:', Number(paymentWei) / 1e18);
      input.add64(paymentWei);
      const encryptedPayment = await input.encrypt();
      console.log('🔐 Encrypted payment:', encryptedPayment);

      // Call contract
      const signer = await provider.getSigner();
      const contractWithSigner = contract.connect(signer);

      const tx = await contractWithSigner.unlockBlog(
        blogId,
        encryptedPayment.handles[0],
        encryptedPayment.inputProof
      );

      await tx.wait();
      console.log('Blog unlocked successfully');

      return tx.hash;
    } catch (err: any) {
      const message = err.message || 'Failed to unlock blog';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, [contract, account, fhevmInstance, provider]);

  /**
   * Like a blog
   */
  const likeBlog = useCallback(async (blogId: number) => {
    if (!contract || !account || !provider) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    setError(null);

    try {
      const signer = await provider.getSigner();
      const contractWithSigner = contract.connect(signer);

      const tx = await contractWithSigner.likeBlog(blogId);
      await tx.wait();

      console.log('Blog liked successfully');
      return tx.hash;
    } catch (err: any) {
      const message = err.message || 'Failed to like blog';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, [contract, account, provider]);

  /**
   * Dislike a blog
   */
  const dislikeBlog = useCallback(async (blogId: number) => {
    if (!contract || !account || !provider) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    setError(null);

    try {
      const signer = await provider.getSigner();
      const contractWithSigner = contract.connect(signer);

      const tx = await contractWithSigner.dislikeBlog(blogId);
      await tx.wait();

      console.log('Blog disliked successfully');
      return tx.hash;
    } catch (err: any) {
      const message = err.message || 'Failed to dislike blog';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, [contract, account, provider]);

  /**
   * Get a single blog
   */
  const getBlog = useCallback(async (blogId: number): Promise<Blog | null> => {
    if (!contract) {
      console.warn('⚠️ getBlog: contract is null');
      return null;
    }

    try {
      console.log(`📖 Calling contract.getBlog(${blogId})...`);
      const blog = await contract.getBlog(blogId);
      console.log(`📖 Blog ${blogId} raw data:`, blog);
      
      // Access by index since names are not available in the Result object
      // Struct order: id, author, contentCID, title, summary, timestamp, isPaid, priceInWei, price, likeCount, dislikeCount, unlockCount, totalEarnings
      const result = {
        id: Number(blog[0]),           // uint256 id
        author: blog[1],                // address author
        contentCID: blog[2],            // string contentCID
        title: blog[3],                 // string title
        summary: blog[4],               // string summary
        timestamp: blog[5],             // uint256 timestamp
        isPaid: blog[6],                // bool isPaid
        priceInWei: blog[7],            // uint64 priceInWei ← This is the key!
        price: blog[8],                 // euint64 price
        likeCount: blog[9],             // euint32 likeCount
        dislikeCount: blog[10],         // euint32 dislikeCount
        unlockCount: blog[11],          // euint32 unlockCount
        totalEarnings: blog[12],        // euint64 totalEarnings
      };
      console.log(`📖 Blog ${blogId} formatted:`, result);
      console.log(`📖 priceInWei extracted:`, result.priceInWei, 'type:', typeof result.priceInWei);
      return result;
    } catch (err) {
      console.error(`❌ Failed to get blog ${blogId}:`, err);
      return null;
    }
  }, [contract]);

  /**
   * Get blog content from IPFS
   */
  const getBlogContent = useCallback(async (cid: string): Promise<BlogContent | null> => {
    try {
      return await fetchFromPinata(cid);
    } catch (err) {
      console.error('Failed to fetch blog content:', err);
      return null;
    }
  }, []);

  /**
   * Get total blog count
   */
  const getTotalBlogs = useCallback(async (): Promise<number> => {
    if (!contract) {
      console.warn('⚠️ getTotalBlogs: contract is null');
      return 0;
    }

    try {
      console.log('📊 Calling contract.getTotalBlogs()...');
      const count = await contract.getTotalBlogs();
      console.log('📊 Total blogs count:', count);
      return Number(count);
    } catch (err) {
      console.error('❌ Failed to get total blogs:', err);
      return 0;
    }
  }, [contract]);

  /**
   * Get author's blogs
   */
  const getAuthorBlogs = useCallback(async (author: string): Promise<number[]> => {
    if (!contract) {
      return [];
    }

    try {
      const blogIds = await contract.getAuthorBlogs(author);
      return blogIds.map((id: bigint) => Number(id));
    } catch (err) {
      console.error('Failed to get author blogs:', err);
      return [];
    }
  }, [contract]);

  /**
   * Decrypt encrypted value
   */
  const decrypt = useCallback(async (handle: string): Promise<bigint | null> => {
    if (!fhevmInstance || !contract || !chainId || !account) {
      console.warn('⚠️ decrypt: missing required instances');
      return null;
    }

    try {
      const contractAddress = await contract.getAddress();
      console.log(`🔐 Decrypting handle: ${handle}`);
      console.log(`   Contract address: ${contractAddress}`);
      console.log(`   Chain ID: ${chainId}`);
      
      // Mock mode (localhost): Use MockFhevmInstance.userDecrypt
      if (chainId === 31337 && fhevmInstance.userDecrypt && provider) {
        console.log('[FHEVM Mock] Using Mock userDecrypt');
        
        // Generate keypair for Mock mode
        const keypair = (fhevmInstance as any).generateKeypair?.();
        if (!keypair) {
          console.error('❌ generateKeypair not available');
          return BigInt(0);
        }
        
        console.log('   Generated keypair');
        
        // Use current time in seconds (not milliseconds) and subtract 1 second to ensure it's in the past
        const startTimestamp = Math.floor(Date.now() / 1000) - 1;
        const durationDays = 365;
        
        // Create EIP712 message for signing
        const eip712 = (fhevmInstance as any).createEIP712(
          keypair.publicKey,
          [contractAddress],
          startTimestamp,
          durationDays
        );
        
        console.log(`   Using startTimestamp: ${startTimestamp} (${new Date(startTimestamp * 1000).toISOString()})`);
        console.log(`   Duration: ${durationDays} days`);
        console.log('   Requesting EIP-712 signature from user...');
        
        // Request real signature from user via MetaMask
        const signer = await provider.getSigner();
        let signature: string;
        
        try {
          signature = await signer.signTypedData(
            eip712.domain,
            { UserDecryptRequestVerification: eip712.types.UserDecryptRequestVerification },
            eip712.message
          );
          console.log('   ✅ User signed the decryption request');
        } catch (err) {
          console.error('❌ User rejected signature:', err);
          return null;
        }
        
      // Call Mock userDecrypt method directly (MockFhevmInstance.userDecrypt has different signature)
      const results = await (fhevmInstance as any).userDecrypt(
        [{ handle, contractAddress }],
        keypair.privateKey,
        keypair.publicKey,
        signature,
        [contractAddress],
        account,
        startTimestamp,
        durationDays
      );
        
        console.log(`✅ Mock decrypted results:`, results);
        console.log(`   Result type: ${typeof results}`);
        
        // Extract result - Mock returns an object { handle: value }
        if (results && typeof results === 'object') {
          const value = results[handle];
          if (value !== undefined && value !== null) {
            console.log(`✅ Mock decrypted value: ${value}`);
            return BigInt(value);
          }
        }
        
        console.warn('[FHEVM Mock] No results from userDecrypt');
        return BigInt(0);
      }
      
      // Relayer mode (testnet/mainnet): Use standard userDecrypt
      if (chainId !== 31337 && fhevmInstance.userDecrypt) {
        console.log('[FHEVM Relayer] Using Relayer userDecrypt');
        const decrypted = await fhevmInstance.userDecrypt(handle, contractAddress);
        console.log(`✅ Relayer decrypted value: ${decrypted}`);
        return decrypted;
      }
      
      console.warn('⚠️ No decrypt method available');
      return null;
    } catch (err: any) {
      // Silently handle ACL errors (expected for unowned/unauthorized values)
      if (err?.message?.includes('not authorized') || err?.message?.includes('ACL')) {
        console.warn('⚠️ No permission to decrypt this value');
        return null;
      }
      console.error('❌ Decryption failed:', err);
      return null;
    }
  }, [fhevmInstance, contract, chainId, account, provider]);

  /**
   * Check access to a blog
   */
  const checkAccess = useCallback(async (blogId: number): Promise<boolean> => {
    if (!contract || !account || !fhevmInstance) {
      return false;
    }

    try {
      const [isFree, accessToken] = await contract.checkAccess(blogId, account);
      
      // Free blogs are always accessible
      if (isFree) {
        return true;
      }

      // For paid blogs, need to decrypt access token (ebool)
      const contractAddress = await contract.getAddress();
      
      // Convert accessToken (bigint) to hex string handle
      const accessTokenHandle = typeof accessToken === 'bigint' 
        ? '0x' + accessToken.toString(16).padStart(64, '0')
        : accessToken;
      
      console.log(`🔍 Checking access for blog ${blogId}...`);
      console.log(`   Access token handle: ${accessTokenHandle}`);
      
      // Use decrypt to get the bool value (0 or 1)
      const decryptedValue = await decrypt(accessTokenHandle);
      
      if (decryptedValue === null) {
        console.warn('⚠️ Failed to decrypt access token');
        return false;
      }
      
      const hasAccess = decryptedValue > BigInt(0);
      console.log(`   Decrypted access: ${hasAccess}`);
      
      return hasAccess;
    } catch (err) {
      console.error('Failed to check access:', err);
      return false;
    }
  }, [contract, account, fhevmInstance, decrypt]);

  return {
    contract,
    isLoading,
    error,
    // Write methods
    publishBlog,
    unlockBlog,
    likeBlog,
    dislikeBlog,
    // Read methods
    getBlog,
    getBlogContent,
    getTotalBlogs,
    getAuthorBlogs,
    checkAccess,
    decrypt,
  };
}

