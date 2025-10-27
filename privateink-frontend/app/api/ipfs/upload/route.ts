/**
 * Pinata Upload API Route
 * Server-side endpoint to upload content to Pinata IPFS
 */

import { NextRequest, NextResponse } from 'next/server';

const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT || process.env.PINATA_JWT;

export async function POST(request: NextRequest) {
  try {
    if (!PINATA_JWT) {
      return NextResponse.json(
        { error: 'Pinata JWT not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();

    // Upload to Pinata
    const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PINATA_JWT}`,
      },
      body: JSON.stringify({
        pinataContent: body,
        pinataMetadata: {
          name: `blog-${body.title || 'untitled'}-${Date.now()}`,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Pinata API error:', error);
      return NextResponse.json(
        { error: 'Failed to upload to Pinata' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ cid: data.IpfsHash });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

