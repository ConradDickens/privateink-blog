/**
 * Pinata IPFS Client
 * Handles blog content upload and retrieval
 */

export interface BlogContent {
  title: string;
  content: string;
  summary: string;
  tags?: string[];
  author: string;
  timestamp: number;
  version: string;
}

/**
 * Upload blog content to Pinata IPFS via API Route
 */
export async function uploadToPinata(content: BlogContent): Promise<string> {
  try {
    const response = await fetch('/api/ipfs/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(content),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Upload failed: ${error}`);
    }

    const data = await response.json();
    return data.cid;
  } catch (error) {
    console.error('Pinata upload error:', error);
    throw error;
  }
}

/**
 * Fetch blog content from Pinata IPFS
 */
export async function fetchFromPinata(cid: string): Promise<BlogContent> {
  try {
    const gateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY || 'https://gateway.pinata.cloud/ipfs/';
    const url = `${gateway}${cid}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch from IPFS: ${response.statusText}`);
    }

    const content = await response.json();
    return content;
  } catch (error) {
    console.error('Pinata fetch error:', error);
    throw error;
  }
}

