/**
 * Explore Page - Blog List
 * Shows all published blogs
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { JsonRpcProvider, Contract } from 'ethers';
import { PrivateInkBlogABI } from '@/abi/PrivateInkBlogABI';
import { getPrivateInkBlogAddress } from '@/abi/PrivateInkBlogAddresses';

interface BlogInfo {
  id: number;
  title: string;
  summary: string;
  author: string;
  isPaid: boolean;
  timestamp: bigint;
}

export default function ExplorePage() {
  const [blogs, setBlogs] = useState<BlogInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlogs();
  }, []);

  async function loadBlogs() {
    setLoading(true);
    try {
      // Detect chain ID from wallet or use default (Sepolia for production)
      const chainId = typeof window !== 'undefined' && (window as any).ethereum 
        ? await (window as any).ethereum.request({ method: 'eth_chainId' }).then((id: string) => parseInt(id, 16)).catch(() => 11155111)
        : 11155111; // Default to Sepolia for production
      
      // Get RPC URL based on chain ID
      const { getRpcUrl } = await import('@/fhevm/constants');
      const rpcUrl = getRpcUrl(chainId);
      
      // Create read-only provider (no wallet needed)
      const provider = new JsonRpcProvider(rpcUrl);
      const contractAddress = getPrivateInkBlogAddress(chainId);

      if (!contractAddress) {
        console.error('❌ No contract address found for chainId', chainId);
        setLoading(false);
        return;
      }

      console.log('📝 Connecting to contract at:', contractAddress);
      const contract = new Contract(contractAddress, PrivateInkBlogABI, provider);

      // Get total blogs
      const totalBlogsResult = await contract.getTotalBlogs();
      const total = Number(totalBlogsResult);
      console.log('📊 Total blogs:', total);
      
      const loadedBlogs: BlogInfo[] = [];

      for (let i = 0; i < total; i++) {
        console.log(`📖 Loading blog ${i}...`);
        const blog = await contract.getBlog(i);
        console.log(`📖 Blog ${i} data:`, blog);
        
        // Access by index since Result object doesn't have named fields
        loadedBlogs.push({
          id: Number(blog[0]),      // uint256 id
          title: blog[3],           // string title
          summary: blog[4],         // string summary
          author: blog[1],          // address author
          isPaid: blog[6],          // bool isPaid
          timestamp: blog[5],       // uint256 timestamp
        });
      }

      console.log('✅ Loaded blogs:', loadedBlogs);
      setBlogs(loadedBlogs.reverse()); // Newest first
    } catch (error) {
      console.error('❌ Failed to load blogs:', error);
    } finally {
      setLoading(false);
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-6"></div>
          <p className="text-xl text-textSecondary">Loading blogs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-12">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Explore Blogs
            </span>
          </h1>

          {blogs.length === 0 ? (
            <div className="text-center py-20 backdrop-blur-glass bg-surface-glass rounded-2xl border border-white/20 shadow-lg">
              <p className="text-2xl text-textSecondary mb-6">No blogs yet</p>
              <Link
                href="/create"
                className="inline-block px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:opacity-90 transition-opacity font-semibold shadow-lg"
              >
                Create First Blog
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
                    <span className="font-mono bg-surface px-3 py-1 rounded-lg">{formatAddress(blog.author)}</span>
                    <span>{formatTimestamp(blog.timestamp)}</span>
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
