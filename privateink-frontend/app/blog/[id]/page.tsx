/**
 * Blog Detail Page
 * Shows blog content with like/dislike and unlock functionality
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { JsonRpcProvider, Contract } from 'ethers';
import { useWallet } from '@/hooks/useWallet';
import { usePrivateInkBlog } from '@/hooks/usePrivateInkBlog';
import { PrivateInkBlogABI } from '@/abi/PrivateInkBlogABI';
import { getPrivateInkBlogAddress } from '@/abi/PrivateInkBlogAddresses';
import { fetchFromPinata, type BlogContent } from '@/lib/pinata';

export default function BlogDetailPage() {
  const params = useParams();
  const blogId = parseInt(params.id as string);
  
  const { account, isConnected } = useWallet();
  const { likeBlog, dislikeBlog, unlockBlog, checkAccess, decrypt } = usePrivateInkBlog();

  const [blog, setBlog] = useState<any>(null);
  const [content, setContent] = useState<BlogContent | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [likeCount, setLikeCount] = useState<string>('');
  const [dislikeCount, setDislikeCount] = useState<string>('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadBlog();
  }, [blogId]);

  useEffect(() => {
    if (blog && isConnected) {
      checkBlogAccess();
    }
  }, [blog, isConnected]);

  async function loadBlog() {
    setLoading(true);
    try {
      // Create read-only provider (no wallet needed for reading)
      const provider = new JsonRpcProvider('http://localhost:8545');
      const chainId = 31337;
      const contractAddress = getPrivateInkBlogAddress(chainId);

      if (!contractAddress) {
        console.error('❌ No contract address found');
        setLoading(false);
        return;
      }

      console.log(`📖 Loading blog ${blogId} from contract at:`, contractAddress);
      const contract = new Contract(contractAddress, PrivateInkBlogABI, provider);

      const blogData = await contract.getBlog(blogId);
      console.log(`📖 Blog ${blogId} data:`, blogData);

      if (blogData) {
        // Access by index since Result object doesn't have named fields
        const formattedBlog = {
          id: Number(blogData[0]),      // uint256 id
          author: blogData[1],           // address author
          contentCID: blogData[2],       // string contentCID
          title: blogData[3],            // string title
          summary: blogData[4],          // string summary
          timestamp: blogData[5],        // uint256 timestamp
          isPaid: blogData[6],           // bool isPaid
          priceInWei: blogData[7],       // uint64 priceInWei ← Key field!
          price: blogData[8],            // euint64 price
          likeCount: blogData[9],        // euint32 likeCount
          dislikeCount: blogData[10],    // euint32 dislikeCount
          unlockCount: blogData[11],     // euint32 unlockCount
          totalEarnings: blogData[12],   // euint64 totalEarnings
        };
        console.log(`📖 Formatted blog with priceInWei:`, formattedBlog.priceInWei);
        setBlog(formattedBlog);
        
        // If free blog, load content immediately
        if (!formattedBlog.isPaid) {
          console.log(`📄 Loading content from IPFS: ${formattedBlog.contentCID}`);
          const contentData = await fetchFromPinata(formattedBlog.contentCID);
          setContent(contentData);
        }
      }
    } catch (error) {
      console.error('❌ Failed to load blog:', error);
    } finally {
      setLoading(false);
    }
  }

  async function checkBlogAccess() {
    const access = await checkAccess(blogId);
    setHasAccess(access);

    if (access && blog && !content) {
      console.log(`📄 Loading unlocked content from IPFS: ${blog.contentCID}`);
      const contentData = await fetchFromPinata(blog.contentCID);
      setContent(contentData);
    }
  }

  async function handleLike() {
    if (!isConnected) {
      alert('Please connect wallet');
      return;
    }

    setProcessing(true);
    try {
      await likeBlog(blogId);
      alert('Blog liked!');
      loadBlog();
    } catch (error: any) {
      alert(`Failed: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  }

  async function handleDislike() {
    if (!isConnected) {
      alert('Please connect wallet');
      return;
    }

    setProcessing(true);
    try {
      await dislikeBlog(blogId);
      alert('Blog disliked!');
      loadBlog();
    } catch (error: any) {
      alert(`Failed: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  }

  async function handleUnlock() {
    if (!isConnected || !blog) return;

    // Get the required price
    console.log('🔍 Blog object:', blog);
    console.log('🔍 priceInWei:', blog.priceInWei, 'type:', typeof blog.priceInWei);
    
    // Handle both bigint and number types
    const priceInWei = typeof blog.priceInWei === 'bigint' 
      ? Number(blog.priceInWei) 
      : Number(blog.priceInWei || 0);
    
    console.log('🔍 Converted priceInWei:', priceInWei);
    
    const priceInEth = (priceInWei / 1e18).toFixed(4);
    
    // Show confirmation dialog with the price
    const confirmed = confirm(
      `This blog costs ${priceInEth} ETH to unlock.\n\n` +
      `Do you want to proceed with the payment?`
    );
    
    if (!confirmed) return;

    setProcessing(true);
    try {
      // Automatically use the blog's price
      await unlockBlog(blogId, priceInWei);
      console.log('✅ Unlock transaction successful');
      
      // IMPORTANT: Verify access by checking the accessToken
      console.log('🔍 Verifying access...');
      const hasAccessNow = await checkAccess(blogId);
      
      if (hasAccessNow) {
        alert(`✅ Blog unlocked successfully! You paid ${priceInEth} ETH.`);
        setHasAccess(true);
        
        // Load content immediately
        if (blog.contentCID && !content) {
          console.log(`📄 Loading unlocked content from IPFS: ${blog.contentCID}`);
          const contentData = await fetchFromPinata(blog.contentCID);
          setContent(contentData);
        }
      } else {
        alert('⚠️ Unlock failed! There was an issue with the payment verification. Please try again.');
        setHasAccess(false);
      }
    } catch (error: any) {
      alert(`Failed to unlock: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  }

  async function handleDecrypt() {
    if (!blog) return;

    try {
      console.log('🔐 Decrypting stats...');
      console.log('  likeCount handle:', blog.likeCount, 'type:', typeof blog.likeCount);
      console.log('  dislikeCount handle:', blog.dislikeCount, 'type:', typeof blog.dislikeCount);
      
      // Convert BigInt handles to hex string format
      const likeCountHandle = typeof blog.likeCount === 'bigint' 
        ? '0x' + blog.likeCount.toString(16).padStart(64, '0')
        : blog.likeCount;
      const dislikeCountHandle = typeof blog.dislikeCount === 'bigint'
        ? '0x' + blog.dislikeCount.toString(16).padStart(64, '0')
        : blog.dislikeCount;
      
      console.log('  Formatted likeCount handle:', likeCountHandle);
      console.log('  Formatted dislikeCount handle:', dislikeCountHandle);
      
      const likes = await decrypt(likeCountHandle);
      const dislikes = await decrypt(dislikeCountHandle);
      
      console.log('✅ Decrypted likes:', likes);
      console.log('✅ Decrypted dislikes:', dislikes);
      
      setLikeCount(likes?.toString() || '?');
      setDislikeCount(dislikes?.toString() || '?');
    } catch (error) {
      console.error('❌ Decryption failed:', error);
      alert('Decryption failed');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 px-6">
        <p className="text-2xl text-textSecondary">Blog not found</p>
      </div>
    );
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="backdrop-blur-glass bg-surface-glass rounded-2xl border border-white/20 p-10 mb-8 shadow-lg">
            <div className="flex items-start justify-between mb-6">
              <h1 className="text-4xl md:text-5xl font-bold text-text pr-4">{blog.title}</h1>
              {blog.isPaid && (
                <span className="px-5 py-2 bg-accent/20 text-accent rounded-full text-sm font-semibold whitespace-nowrap">
                  💰 Paid
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-textSecondary">
              <span className="font-mono bg-surface px-4 py-2 rounded-lg inline-block">{formatAddress(blog.author)}</span>
              <span>{formatTimestamp(blog.timestamp)}</span>
            </div>
          </div>

          {/* Content */}
          <div className="backdrop-blur-glass bg-surface-glass rounded-2xl border border-white/20 p-10 mb-8 shadow-lg">
            {!blog.isPaid || hasAccess ? (
              content ? (
                <div className="prose prose-invert max-w-none">
                  <p className="text-lg whitespace-pre-wrap leading-relaxed text-text">{content.content}</p>
                </div>
              ) : (
                <p className="text-textSecondary text-center py-8">Loading content...</p>
              )
            ) : (
              <div className="text-center py-16">
                <p className="text-2xl mb-6 text-text">{blog.summary}</p>
                <p className="text-textSecondary mb-8 text-lg">This content is locked</p>
                <button
                  onClick={handleUnlock}
                  disabled={processing}
                  className="px-10 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 font-semibold text-lg shadow-lg"
                >
                  {processing ? 'Unlocking...' : 'Unlock to Read'}
                </button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="backdrop-blur-glass bg-surface-glass rounded-2xl border border-white/20 p-8 shadow-lg">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <button
                  onClick={handleLike}
                  disabled={!isConnected || processing}
                  className="flex-1 sm:flex-none px-8 py-4 bg-surface hover:bg-primary/20 rounded-xl transition-colors disabled:opacity-50 font-medium text-lg border border-white/10"
                >
                  👍 Like {likeCount && `(${likeCount})`}
                </button>
                <button
                  onClick={handleDislike}
                  disabled={!isConnected || processing}
                  className="flex-1 sm:flex-none px-8 py-4 bg-surface hover:bg-secondary/20 rounded-xl transition-colors disabled:opacity-50 font-medium text-lg border border-white/10"
                >
                  👎 Dislike {dislikeCount && `(${dislikeCount})`}
                </button>
              </div>

              {isConnected && (
                <div className="w-full sm:w-auto space-y-2">
                  <button
                    onClick={handleDecrypt}
                    className="w-full px-8 py-4 bg-accent/20 text-accent hover:bg-accent/30 rounded-xl transition-colors font-semibold text-lg"
                  >
                    🔓 Decrypt Stats {likeCount && `(${likeCount}/${dislikeCount})`}
                  </button>
                  {likeCount && likeCount === '0' && (
                    <p className="text-xs text-textSecondary text-center">
                      💡 Mock mode: Try liking first to see real counts
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
