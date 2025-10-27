import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "PrivateInk - Privacy-Preserving Blog Platform",
  description: "Write in Privacy, Read with Permission. Powered by FHEVM.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-background">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
