'use client';

import { useWallet } from '@/hooks/useWallet';
import { useState, useEffect } from 'react';

export default function DebugPage() {
  const { account, chainId, isConnected, connect } = useWallet();
  const [hardhatStatus, setHardhatStatus] = useState<'checking' | 'running' | 'stopped'>('checking');

  useEffect(() => {
    // 检查 Hardhat 节点状态
    fetch('http://localhost:8545', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'net_version',
        params: [],
        id: 1,
      }),
    })
      .then((res) => res.json())
      .then(() => setHardhatStatus('running'))
      .catch(() => setHardhatStatus('stopped'));
  }, []);

  const addLocalNetwork = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      alert('请先安装 MetaMask！');
      return;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0x7A69', // 31337 in hex
            chainName: 'Hardhat Local',
            nativeCurrency: {
              name: 'Ether',
              symbol: 'ETH',
              decimals: 18,
            },
            rpcUrls: ['http://127.0.0.1:8545'],
            blockExplorerUrls: null,
          },
        ],
      });
      alert('✅ 本地网络已添加到 MetaMask！');
    } catch (error: any) {
      alert('❌ 添加失败: ' + error.message);
    }
  };

  const switchToLocal = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      alert('请先安装 MetaMask！');
      return;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x7A69' }], // 31337
      });
      alert('✅ 已切换到本地网络！');
    } catch (error: any) {
      if (error.code === 4902) {
        // 网络不存在，尝试添加
        await addLocalNetwork();
      } else {
        alert('❌ 切换失败: ' + error.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            系统诊断
          </h1>
          <p className="text-xl text-textSecondary">检查 FHEVM 开发环境状态</p>
        </div>

        {/* Hardhat 节点状态 */}
        <div className="bg-surface-glass backdrop-blur-glass border border-white/20 rounded-2xl p-8 space-y-4">
          <h2 className="text-2xl font-bold text-text">1️⃣ Hardhat 节点状态</h2>
          <div className="flex items-center gap-4">
            <div
              className={`w-4 h-4 rounded-full ${
                hardhatStatus === 'running'
                  ? 'bg-green-500'
                  : hardhatStatus === 'stopped'
                  ? 'bg-red-500'
                  : 'bg-yellow-500 animate-pulse'
              }`}
            />
            <span className="text-lg">
              {hardhatStatus === 'running' && '✅ Hardhat 节点运行中'}
              {hardhatStatus === 'stopped' && '❌ Hardhat 节点未启动'}
              {hardhatStatus === 'checking' && '🔄 检查中...'}
            </span>
          </div>
          {hardhatStatus === 'stopped' && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mt-4">
              <p className="text-red-600 dark:text-red-400 font-semibold mb-2">需要先启动 Hardhat 节点！</p>
              <pre className="bg-black/20 p-3 rounded text-sm">
                cd fhevm-hardhat-template{'\n'}
                npx hardhat node
              </pre>
            </div>
          )}
        </div>

        {/* 钱包连接状态 */}
        <div className="bg-surface-glass backdrop-blur-glass border border-white/20 rounded-2xl p-8 space-y-4">
          <h2 className="text-2xl font-bold text-text">2️⃣ 钱包连接状态</h2>
          
          {!isConnected ? (
            <div>
              <p className="text-textSecondary mb-4">钱包未连接</p>
              <button
                onClick={connect}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg hover:opacity-90 transition-opacity"
              >
                连接钱包
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold">账户:</span>
                <code className="bg-black/20 px-3 py-1 rounded text-sm">{account}</code>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold">Chain ID:</span>
                <code className="bg-black/20 px-3 py-1 rounded text-sm">{chainId}</code>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold">网络:</span>
                <span
                  className={`px-3 py-1 rounded font-medium ${
                    chainId === 31337
                      ? 'bg-green-500/20 text-green-600 dark:text-green-400'
                      : 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'
                  }`}
                >
                  {chainId === 31337 ? '✅ Localhost (正确)' : `⚠️ ${getNetworkName(chainId ?? undefined)} (需要切换)`}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 问题诊断 */}
        {isConnected && chainId !== 31337 && (
          <div className="bg-red-500/10 border-2 border-red-500/30 rounded-2xl p-8 space-y-4">
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">⚠️ 网络配置错误</h2>
            <p className="text-lg text-text">
              您当前连接到 <strong>{getNetworkName(chainId ?? undefined)}</strong>，但本地开发需要连接到{' '}
              <strong>Hardhat Local (Chain ID: 31337)</strong>
            </p>
            <div className="space-y-3">
              <p className="text-textSecondary">请选择以下操作：</p>
              <div className="flex gap-4 flex-wrap">
                <button
                  onClick={switchToLocal}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg hover:opacity-90 transition-opacity"
                >
                  切换到本地网络
                </button>
                <button
                  onClick={addLocalNetwork}
                  className="px-6 py-3 rounded-xl bg-surface border border-primary text-primary font-semibold hover:bg-primary/10 transition-colors"
                >
                  添加本地网络到 MetaMask
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 成功状态 */}
        {isConnected && chainId === 31337 && hardhatStatus === 'running' && (
          <div className="bg-green-500/10 border-2 border-green-500/30 rounded-2xl p-8 text-center space-y-4">
            <h2 className="text-3xl font-bold text-green-600 dark:text-green-400">✅ 配置正确！</h2>
            <p className="text-lg text-text">
              您已连接到本地 Hardhat 节点，可以开始使用 FHEVM Mock 模式开发了！
            </p>
            <a
              href="/create"
              className="inline-block px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg hover:opacity-90 transition-opacity"
            >
              开始创建博客
            </a>
          </div>
        )}

        {/* 说明文档 */}
        <div className="bg-surface-glass backdrop-blur-glass border border-white/20 rounded-2xl p-8 space-y-4">
          <h2 className="text-2xl font-bold text-text">📖 配置说明</h2>
          <div className="space-y-4 text-textSecondary">
            <div>
              <h3 className="text-lg font-semibold text-text mb-2">本地开发模式 (dev:mock)</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Chain ID: 31337 (Hardhat Local)</li>
                <li>使用 @fhevm/mock-utils 进行加密操作</li>
                <li>不需要真实的 Relayer 服务</li>
                <li>快速开发和测试</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text mb-2">测试网模式 (dev)</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Chain ID: 11155111 (Sepolia)</li>
                <li>使用 @zama-fhe/relayer-sdk 进行真实加密</li>
                <li>需要部署到 Sepolia 测试网</li>
                <li>需要 Sepolia ETH 进行交易</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 手动配置指南 */}
        <div className="bg-surface-glass backdrop-blur-glass border border-white/20 rounded-2xl p-8 space-y-4">
          <h2 className="text-2xl font-bold text-text">🔧 手动配置 MetaMask</h2>
          <div className="space-y-3 text-textSecondary">
            <p className="font-semibold text-text">如果自动切换失败，请手动添加网络：</p>
            <div className="bg-black/20 rounded-lg p-4 space-y-2 font-mono text-sm">
              <div>
                <strong>Network Name:</strong> Hardhat Local
              </div>
              <div>
                <strong>RPC URL:</strong> http://127.0.0.1:8545
              </div>
              <div>
                <strong>Chain ID:</strong> 31337
              </div>
              <div>
                <strong>Currency Symbol:</strong> ETH
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getNetworkName(chainId: number | undefined): string {
  if (!chainId) return 'Unknown';
  switch (chainId) {
    case 1:
      return 'Ethereum Mainnet';
    case 11155111:
      return 'Sepolia Testnet';
    case 31337:
      return 'Localhost';
    default:
      return `Unknown (${chainId})`;
  }
}

