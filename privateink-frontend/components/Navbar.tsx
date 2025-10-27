/**
 * Navigation Bar Component
 * Glassmorphism design with wallet connection
 */

'use client';

import Link from 'next/link';
import { useWallet } from '@/hooks/useWallet';

export function Navbar() {
  const { account, chainId, isConnected, connect, disconnect, isConnecting } = useWallet();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getNetworkName = (chainId: number) => {
    if (chainId === 31337) return 'Localhost';
    if (chainId === 11155111) return 'Sepolia';
    return `Chain ${chainId}`;
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-glass bg-surface-glass border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-normal">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">PI</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              PrivateInk
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
          <Link
            href="/explore"
            className="text-base font-medium text-text hover:text-primary transition-colors duration-normal"
          >
            Explore
          </Link>
          {isConnected && (
            <>
              <Link
                href="/create"
                className="text-base font-medium text-text hover:text-primary transition-colors duration-normal"
              >
                Create
              </Link>
              <Link
                href="/my-blogs"
                className="text-base font-medium text-text hover:text-primary transition-colors duration-normal"
              >
                My Blogs
              </Link>
            </>
          )}
          <Link
            href="/debug"
            className="text-base font-medium text-accent hover:text-primary transition-colors duration-normal"
          >
            🔧 Debug
          </Link>
          </div>

          {/* Wallet Connection */}
          <div className="flex items-center gap-3">
            {chainId && (
              <span className="hidden sm:inline-flex text-sm text-textSecondary px-4 py-2 rounded-full bg-surface/50 border border-white/10">
                {getNetworkName(chainId)}
              </span>
            )}
            
            {isConnected ? (
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-block text-sm font-mono bg-surface px-4 py-2 rounded-lg border border-white/10">
                  {formatAddress(account!)}
                </span>
                <button
                  onClick={disconnect}
                  className="px-5 py-2 rounded-lg bg-surface hover:bg-surface/80 border border-white/10 transition-all duration-normal font-medium text-sm"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={connect}
                disabled={isConnecting}
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-medium hover:opacity-90 transition-opacity duration-normal disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-sm"
              >
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
