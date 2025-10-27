/**
 * Relayer SDK Loader
 * Dynamically loads the FHEVM Relayer SDK from CDN
 * Adapted from frontend reference implementation
 */

const SDK_CDN_URL = 'https://cdn.zama.ai/relayer-sdk-js/0.2.0/relayer-sdk-js.umd.cjs';

export interface RelayerSDK {
  initSDK: (options?: unknown) => Promise<boolean>;
  createInstance: (config: unknown) => Promise<unknown>;
  SepoliaConfig: unknown;
  __initialized__?: boolean;
}

export interface FhevmWindow extends Window {
  relayerSDK: RelayerSDK;
}

export class RelayerSDKLoader {
  private trace?: (message?: unknown, ...params: unknown[]) => void;

  constructor(options: { trace?: (message?: unknown, ...params: unknown[]) => void } = {}) {
    this.trace = options.trace;
  }

  isLoaded(): boolean {
    if (typeof window === 'undefined') {
      throw new Error('RelayerSDKLoader: can only be used in the browser.');
    }
    return this.isFhevmWindow(window);
  }

  async load(): Promise<void> {
    this.trace?.('[RelayerSDKLoader] load...');
    
    if (typeof window === 'undefined') {
      throw new Error('RelayerSDKLoader: can only be used in the browser.');
    }

    if ('relayerSDK' in window) {
      if (!this.isValidRelayerSDK((window as unknown as FhevmWindow).relayerSDK)) {
        throw new Error('RelayerSDKLoader: Invalid FHEVM Relayer SDK');
      }
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const existingScript = document.querySelector(`script[src="${SDK_CDN_URL}"]`);
      if (existingScript) {
        if (!this.isFhevmWindow(window)) {
          reject(new Error('RelayerSDKLoader: window.relayerSDK is invalid'));
        }
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = SDK_CDN_URL;
      script.type = 'text/javascript';
      script.async = true;

      script.onload = () => {
        if (!this.isFhevmWindow(window)) {
          reject(new Error('RelayerSDKLoader: Loaded but window.relayerSDK is invalid'));
        }
        this.trace?.('[RelayerSDKLoader] Successfully loaded');
        resolve();
      };

      script.onerror = () => {
        reject(new Error(`RelayerSDKLoader: Failed to load from ${SDK_CDN_URL}`));
      };

      document.head.appendChild(script);
    });
  }

  private isValidRelayerSDK(sdk: unknown): sdk is RelayerSDK {
    if (!sdk || typeof sdk !== 'object') {
      return false;
    }
    const obj = sdk as Record<string, unknown>;
    return (
      typeof obj.initSDK === 'function' &&
      typeof obj.createInstance === 'function' &&
      typeof obj.SepoliaConfig === 'object'
    );
  }

  private isFhevmWindow(win: unknown): win is FhevmWindow {
    if (!win || typeof win !== 'object') {
      return false;
    }
    const w = win as Record<string, unknown>;
    return 'relayerSDK' in w && this.isValidRelayerSDK(w.relayerSDK);
  }
}

