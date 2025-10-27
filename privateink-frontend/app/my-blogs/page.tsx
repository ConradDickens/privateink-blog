/**
 * My Blogs Page
 * Shows blogs published by connected wallet
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { JsonRpcProvider, Contract } from 'ethers';
import { useWallet } from '@/hooks/useWallet';
import { PrivateInkBlogABI } from '@/abi/PrivateInkBlogABI';
import { getPrivateInkBlogAddress } from '@/abi/PrivateInkBlogAddresses';

interface MyBlogInfo {
  id: number;
  title: string;
  summary: string;
  isPaid: boolean;
  timestamp: bigint;
}

export default function MyBlogsPage() {
  const { account, isConnected } = useWallet();
  const [blogs, setBlogs] = useState<MyBlogInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isConnected && account) {
      loadMyBlogs();
    } else {
      setLoading(false);
    }
  }, [isConnected, account]);

  async function loadMyBlogs() {
    if (!account) return;

    setLoading(true);
    try {
      // Create read-only provider
      const provider = new JsonRpcProvider('http://localhost:8545');
      const chainId = 31337;
      const contractAddress = getPrivateInkBlogAddress(chainId);

      if (!contractAddress) {
        console.error('❌ No contract address found for chainId', chainId);
        setLoading(false);
        return;
      }

      console.log('📝 Connecting to contract at:', contractAddress);
      const contract = new Contract(contractAddress, PrivateInkBlogABI, provider);

      // Get author's blog IDs
      console.log('📖 Loading blogs for author:', account);
      const blogIdsResult = await contract.getAuthorBlogs(account);
      const blogIds = blogIdsResult.map((id: bigint) => Number(id));
      console.log('📊 Found blog IDs:', blogIds);

      const loadedBlogs: MyBlogInfo[] = [];

      for (const id of blogIds) {
        console.log(`📖 Loading blog ${id}...`);
        const blog = await contract.getBlog(id);
        console.log(`📖 Blog ${id} data:`, blog);

        // Access by index since Result object doesn't have named fields
        loadedBlogs.push({
          id: Number(blog[0]),      // uint256 id
          title: blog[3],           // string title
          summary: blog[4],         // string summary
          isPaid: blog[6],          // bool isPaid
          timestamp: blog[5],       // uint256 timestamp
        });
      }

      console.log('✅ Loaded my blogs:', loadedBlogs);
      setBlogs(loadedBlogs.reverse());
    } catch (error) {
      console.error('❌ Failed to load blogs:', error);
    } finally {
      setLoading(false);
    }
  }

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString();
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 px-6">
        <div className="text-center backdrop-blur-glass bg-surface-glass rounded-2xl border border-white/20 p-16 shadow-lg max-w-md">
          <h2 className="text-3xl font-bold mb-6">Connect Wallet</h2>
          <p className="text-textSecondary text-lg">Please connect your wallet to view your blogs</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-6"></div>
          <p className="text-xl text-textSecondary">Loading your blogs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
            <h1 className="text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                My Blogs
              </span>
            </h1>
            <Link
              href="/create"
              className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:opacity-90 transition-opacity font-semibold shadow-lg whitespace-nowrap"
            >
              Create New
            </Link>
          </div>

          {blogs.length === 0 ? (
            <div className="text-center py-20 backdrop-blur-glass bg-surface-glass rounded-2xl border border-white/20 shadow-lg">
              <p className="text-2xl text-textSecondary mb-6">You haven't published any blogs yet</p>
              <Link
                href="/create"
                className="inline-block px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:opacity-90 transition-opacity font-semibold shadow-lg"
              >
                Create Your First Blog
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {blogs.map((blog) => (
                <Link
                  key={blog.id}
                  href={`/blog/${blog.id}`}
                  className="block backdrop-blur-glass bg-surface-glass rounded-2xl border border-white/20 p-8 hover:scale-[1.02] transition-transform duration-normal shadow-lg"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="text-3xl font-bold text-text pr-4">{blog.title}</h2>
                    {blog.isPaid ? (
                      <span className="px-4 py-2 bg-accent/20 text-accent rounded-full text-sm font-semibold whitespace-nowrap">
                        💰 Paid
                      </span>
                    ) : (
                      <span className="px-4 py-2 bg-primary/20 text-primary rounded-full text-sm font-semibold whitespace-nowrap">
                        🆓 Free
                      </span>
                    )}
                  </div>

                  <p className="text-textSecondary mb-6 line-clamp-2 text-lg leading-relaxed">
                    {blog.summary}
                  </p>

                  <div className="flex items-center justify-between text-sm text-textSecondary">
                    <span>Published {formatTimestamp(blog.timestamp)}</span>
                    <span className="text-primary hover:underline font-medium">View Details →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
