/**
 * Landing Page
 * Glassmorphism design with purple theme
 */

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      {/* Hero Section */}
      <div className="container mx-auto px-6 pt-24 pb-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo */}
          <div className="flex justify-center mb-10">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-3xl flex items-center justify-center shadow-glass">
              <span className="text-white font-bold text-4xl">PI</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-6xl md:text-7xl font-bold mb-8">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              PrivateInk
            </span>
          </h1>

          {/* Slogan */}
          <p className="text-3xl md:text-4xl text-text mb-10 italic font-light">
            Write in Privacy, Read with Permission
          </p>

          {/* Description */}
          <p className="text-xl text-textSecondary mb-12 max-w-2xl mx-auto leading-relaxed">
            A privacy-preserving blog platform powered by FHEVM.
            Your interactions stay encrypted, your earnings stay private.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/explore"
              className="w-full sm:w-auto px-10 py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold text-lg hover:opacity-90 transition-opacity duration-normal shadow-glass"
            >
              Launch App
            </Link>
            <Link
              href="/explore"
              className="w-full sm:w-auto px-10 py-4 rounded-xl backdrop-blur-glass bg-surface-glass border border-white/20 font-semibold text-lg hover:bg-surface transition-colors duration-normal"
            >
              Explore Blogs
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Powered by{' '}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              FHEVM
            </span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="backdrop-blur-glass bg-surface-glass rounded-2xl border border-white/20 p-8 hover:scale-105 transition-transform duration-normal shadow-lg">
              <div className="text-5xl mb-6">🔐</div>
              <h3 className="text-2xl font-bold mb-4 text-text">Encrypted Reactions</h3>
              <p className="text-textSecondary leading-relaxed">
                Like and dislike anonymously. Only totals are visible.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="backdrop-blur-glass bg-surface-glass rounded-2xl border border-white/20 p-8 hover:scale-105 transition-transform duration-normal shadow-lg">
              <div className="text-5xl mb-6">💰</div>
              <h3 className="text-2xl font-bold mb-4 text-text">Paid Unlocking</h3>
              <p className="text-textSecondary leading-relaxed">
                Monetize your content with encrypted payment amounts.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="backdrop-blur-glass bg-surface-glass rounded-2xl border border-white/20 p-8 hover:scale-105 transition-transform duration-normal shadow-lg">
              <div className="text-5xl mb-6">👤</div>
              <h3 className="text-2xl font-bold mb-4 text-text">Privacy Protected</h3>
              <p className="text-textSecondary leading-relaxed">
                Your earnings and statistics remain encrypted on-chain.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="backdrop-blur-glass bg-surface-glass rounded-2xl border border-white/20 p-8 hover:scale-105 transition-transform duration-normal shadow-lg">
              <div className="text-5xl mb-6">⚡</div>
              <h3 className="text-2xl font-bold mb-4 text-text">FHEVM Powered</h3>
              <p className="text-textSecondary leading-relaxed">
                Built on fully homomorphic encryption technology.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10">
        <div className="container mx-auto px-6 text-center text-textSecondary">
          <p className="text-base">Built with FHEVM by PrivateInk Team</p>
        </div>
      </footer>
    </div>
  );
}
