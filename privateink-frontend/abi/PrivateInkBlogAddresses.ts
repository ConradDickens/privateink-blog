// Auto-generated file - DO NOT EDIT
// Generated from deployment artifacts

export const PrivateInkBlogAddresses: Record<number, string> = {
  "31337": "0xDEE2D419592AAA0a2F314643aB432E1d5D3bf2A7",
  "11155111": "0x514A5eDC152564d486f5c4A49D77BA7C27C2c8a1"
};

export function getPrivateInkBlogAddress(chainId: number): string | undefined {
  return PrivateInkBlogAddresses[chainId];
}
