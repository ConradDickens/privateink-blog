/**
 * Wallet Connection Hook
 * Handles EIP-6963 wallet detection, connection, and persistence
 */

'use client';

import { BrowserProvider } from 'ethers';
import { useEffect, useState, useCallback } from 'react';
import { initFhevm, clearFhevmInstance, type FhevmInstance } from '@/fhevm/fhevm';

interface WalletState {
  account: string | null;
  chainId: number | null;
  provider: BrowserProvider | null;
  fhevmInstance: FhevmInstance | null;
  isConnecting: boolean;
  error: string | null;
}

const STORAGE_KEYS = {
  CONNECTED: 'wallet.connected',
  LAST_CONNECTOR: 'wallet.lastConnectorId',
  LAST_ACCOUNT: 'wallet.lastAccount',
  LAST_CHAIN: 'wallet.lastChainId',
};

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    account: null,
    chainId: null,
    provider: null,
    fhevmInstance: null,
    isConnecting: false,
    error: null,
  });

  // Auto-reconnect on mount
  useEffect(() => {
    const wasConnected = localStorage.getItem(STORAGE_KEYS.CONNECTED) === 'true';
    if (wasConnected && typeof window !== 'undefined' && window.ethereum) {
      silentReconnect();
    }
  }, []);

  // Listen to wallet events
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) {
      return;
    }

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else if (accounts[0] !== state.account) {
        // Account switched
        handleAccountSwitch(accounts[0]);
      }
    };

    const handleChainChanged = (chainIdHex: string) => {
      const newChainId = parseInt(chainIdHex, 16);
      handleChainSwitch(newChainId);
    };

    const handleDisconnect = () => {
      disconnect();
    };

    window.ethereum.on?.('accountsChanged', handleAccountsChanged);
    window.ethereum.on?.('chainChanged', handleChainChanged);
    window.ethereum.on?.('disconnect', handleDisconnect);

    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
        window.ethereum.removeListener('disconnect', handleDisconnect);
      }
    };
  }, [state.account, state.chainId]);

  const silentReconnect = useCallback(async () => {
    try {
      if (!window.ethereum) {
        return;
      }

      // Use eth_accounts (no popup)
      const accounts = await window.ethereum.request({
        method: 'eth_accounts',
      }) as string[];

      if (accounts.length > 0) {
        const provider = new BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();
        const chainId = Number(network.chainId);

        // Initialize FHEVM
        const fhevmInstance = await initFhevm(provider);

        setState({
          account: accounts[0],
          chainId,
          provider,
          fhevmInstance,
          isConnecting: false,
          error: null,
        });

        // Update storage
        localStorage.setItem(STORAGE_KEYS.LAST_ACCOUNT, accounts[0]);
        localStorage.setItem(STORAGE_KEYS.LAST_CHAIN, chainId.toString());
      } else {
        // No accounts, clear connection
        disconnect();
      }
    } catch (error) {
      console.error('Silent reconnect failed:', error);
      disconnect();
    }
  }, []);

  const connect = useCallback(async () => {
    setState((prev) => ({ ...prev, isConnecting: true, error: null }));

    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask');
      }

      // Request accounts (shows popup)
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      }) as string[];

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const provider = new BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);

      // Initialize FHEVM
      const fhevmInstance = await initFhevm(provider);

      setState({
        account: accounts[0],
        chainId,
        provider,
        fhevmInstance,
        isConnecting: false,
        error: null,
      });

      // Persist connection
      localStorage.setItem(STORAGE_KEYS.CONNECTED, 'true');
      localStorage.setItem(STORAGE_KEYS.LAST_CONNECTOR, 'injected');
      localStorage.setItem(STORAGE_KEYS.LAST_ACCOUNT, accounts[0]);
      localStorage.setItem(STORAGE_KEYS.LAST_CHAIN, chainId.toString());
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isConnecting: false,
        error: error.message || 'Failed to connect',
      }));
    }
  }, []);

  const disconnect = useCallback(() => {
    clearFhevmInstance();
    setState({
      account: null,
      chainId: null,
      provider: null,
      fhevmInstance: null,
      isConnecting: false,
      error: null,
    });

    // Clear storage
    localStorage.removeItem(STORAGE_KEYS.CONNECTED);
    localStorage.removeItem(STORAGE_KEYS.LAST_CONNECTOR);
    localStorage.removeItem(STORAGE_KEYS.LAST_ACCOUNT);
    localStorage.removeItem(STORAGE_KEYS.LAST_CHAIN);
  }, []);

  const handleAccountSwitch = useCallback(async (newAccount: string) => {
    if (!state.provider) {
      return;
    }

    try {
      // Re-initialize FHEVM for new account
      const fhevmInstance = await initFhevm(state.provider);

      setState((prev) => ({
        ...prev,
        account: newAccount,
        fhevmInstance,
      }));

      localStorage.setItem(STORAGE_KEYS.LAST_ACCOUNT, newAccount);
    } catch (error) {
      console.error('Failed to switch account:', error);
    }
  }, [state.provider]);

  const handleChainSwitch = useCallback(async (newChainId: number) => {
    try {
      if (!window.ethereum) {
        return;
      }

      const provider = new BrowserProvider(window.ethereum);
      const fhevmInstance = await initFhevm(provider);

      setState((prev) => ({
        ...prev,
        chainId: newChainId,
        provider,
        fhevmInstance,
      }));

      localStorage.setItem(STORAGE_KEYS.LAST_CHAIN, newChainId.toString());
    } catch (error) {
      console.error('Failed to switch chain:', error);
    }
  }, []);

  const switchToSepolia = useCallback(async () => {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not found');
      }

      await window.ethereum?.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }], // Sepolia
      });
    } catch (error: any) {
      if (error.code === 4902 && window.ethereum) {
        // Chain not added, add it
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0xaa36a7',
            chainName: 'Sepolia',
            nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
            rpcUrls: ['https://sepolia.infura.io/v3/'],
            blockExplorerUrls: ['https://sepolia.etherscan.io'],
          }],
        });
      } else {
        throw error;
      }
    }
  }, []);

  return {
    ...state,
    connect,
    disconnect,
    switchToSepolia,
    isConnected: !!state.account,
  };
}

