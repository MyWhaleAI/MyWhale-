import Link from "next/link"
import { HeroSection } from "@/components/home/hero-section"
import { LiveWhaleFeed } from "@/components/home/live-whale-feed"
import { AiExplanations } from "@/components/home/ai-explanations"
import { CustomizeFeed } from "@/components/home/customize-feed"
import { TopWhales } from "@/components/home/top-whales"
import { BecomeWhale } from "@/components/home/become-whale"
import { SecureDesign } from "@/components/home/secure-design"
import { HomeFooter } from "@/components/home/home-footer"
import { WalletButton } from "@/components/wallet/wallet-button"
import { WhaleNavigation } from "@/components/whale/whale-navigation"

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Header */}
      <header className="border-b border-gray-200 py-3 px-4 sm:py-4 sm:px-6 lg:px-8 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 text-lg rounded-lg bg-gradient-to-r from-teal-400 to-blue-500 flex items-center justify-center">
            🐋
            </div>
            <span className="text-lg font-bold">MyWhale</span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/whales" className="text-gray-600 hover:text-teal-600 text-sm font-medium">
              Whales
            </Link>
            <Link href="/feed" className="text-gray-600 hover:text-teal-600 text-sm font-medium">
              Feed
            </Link>
            <Link href="/alerts" className="text-gray-600 hover:text-teal-600 text-sm font-medium">
              Alerts
            </Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-teal-600 text-sm font-medium">
              Dashboard
            </Link>
            <WhaleNavigation />
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <WalletButton />
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* Live Whale Activity Feed */}
        <LiveWhaleFeed />

        {/* AI-Powered Explanations */}
        <AiExplanations />

        {/* Customize Your Whale Feed */}
        <CustomizeFeed />

        {/* Top Solana Whales */}
        <TopWhales />

        {/* Become a Whale */}
        <BecomeWhale />

        {/* Secure by Design */}
        <SecureDesign />
      </main>

      {/* Footer */}
      <HomeFooter />
    </div>
  )
}
