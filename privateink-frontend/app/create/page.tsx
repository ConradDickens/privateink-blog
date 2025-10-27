/**
 * Create Blog Page
 * Form to publish new blog with encryption
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/hooks/useWallet';
import { usePrivateInkBlog } from '@/hooks/usePrivateInkBlog';

export default function CreatePage() {
  const router = useRouter();
  const { isConnected } = useWallet();
  const { publishBlog, isLoading } = usePrivateInkBlog();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    isPaid: false,
    price: '',
    tags: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      // Convert ETH to wei (1 ETH = 10^18 wei)
      const priceInEth = formData.isPaid ? parseFloat(formData.price) : 0;
      const priceInWei = priceInEth * 1e18;
      const tags = formData.tags.split(',').map(t => t.trim()).filter(Boolean);

      await publishBlog(
        formData.title,
        formData.content,
        formData.summary,
        formData.isPaid,
        priceInWei,
        tags
      );

      alert('Blog published successfully!');
      router.push('/explore');
    } catch (error: any) {
      alert(`Failed to publish: ${error.message}`);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 px-6">
        <div className="text-center backdrop-blur-glass bg-surface-glass rounded-2xl border border-white/20 p-16 shadow-lg max-w-md">
          <h2 className="text-3xl font-bold mb-6">Connect Wallet</h2>
          <p className="text-textSecondary text-lg">Please connect your wallet to create a blog</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold mb-12">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Create New Blog
            </span>
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title */}
            <div className="backdrop-blur-glass bg-surface-glass rounded-2xl border border-white/20 p-8 shadow-lg">
              <label className="block text-lg font-semibold mb-3 text-text">
                Title <span className="text-accent">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={100}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-5 py-4 rounded-xl bg-background/50 border border-white/10 focus:border-primary focus:outline-none transition-colors text-lg"
                placeholder="Enter blog title"
              />
              <p className="text-sm text-textSecondary mt-3">
                {formData.title.length}/100 characters
              </p>
            </div>

            {/* Summary */}
            <div className="backdrop-blur-glass bg-surface-glass rounded-2xl border border-white/20 p-8 shadow-lg">
              <label className="block text-lg font-semibold mb-3 text-text">
                Summary <span className="text-accent">*</span>
              </label>
              <textarea
                required
                maxLength={200}
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                className="w-full px-5 py-4 rounded-xl bg-background/50 border border-white/10 focus:border-primary focus:outline-none transition-colors resize-none text-lg"
                rows={3}
                placeholder="Brief summary of your blog"
              />
              <p className="text-sm text-textSecondary mt-3">
                {formData.summary.length}/200 characters
              </p>
            </div>

            {/* Content */}
            <div className="backdrop-blur-glass bg-surface-glass rounded-2xl border border-white/20 p-8 shadow-lg">
              <label className="block text-lg font-semibold mb-3 text-text">
                Content <span className="text-accent">*</span>
              </label>
              <textarea
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-5 py-4 rounded-xl bg-background/50 border border-white/10 focus:border-primary focus:outline-none transition-colors resize-none text-lg"
                rows={14}
                placeholder="Write your blog content..."
              />
            </div>

            {/* Tags */}
            <div className="backdrop-blur-glass bg-surface-glass rounded-2xl border border-white/20 p-8 shadow-lg">
              <label className="block text-lg font-semibold mb-3 text-text">Tags</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-5 py-4 rounded-xl bg-background/50 border border-white/10 focus:border-primary focus:outline-none transition-colors text-lg"
                placeholder="tag1, tag2, tag3"
              />
              <p className="text-sm text-textSecondary mt-3">Comma-separated</p>
            </div>

            {/* Paid/Free Toggle */}
            <div className="backdrop-blur-glass bg-surface-glass rounded-2xl border border-white/20 p-8 shadow-lg">
              <label className="flex items-center gap-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isPaid}
                  onChange={(e) => setFormData({ ...formData, isPaid: e.target.checked })}
                  className="w-6 h-6 rounded border-white/20 text-primary focus:ring-primary"
                />
                <span className="text-lg font-semibold text-text">This is paid content</span>
              </label>

              {formData.isPaid && (
                <div className="mt-6">
                  <label className="block text-lg font-semibold mb-3 text-text">
                    Unlock Price (ETH) <span className="text-accent">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    required={formData.isPaid}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-5 py-4 rounded-xl bg-background/50 border border-white/10 focus:border-primary focus:outline-none transition-colors text-lg"
                    placeholder="0.01"
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-10 py-5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold text-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-glass"
            >
              {isLoading ? 'Publishing...' : 'Publish Blog'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
