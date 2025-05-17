"use client"

import { useState, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TopBar } from "@/components/top-bar"
import { WhaleFeed } from "@/components/whale-feed"
import { Leaderboard } from "@/components/leaderboard"
import { WhaleSuggestions } from "@/components/whale-suggestions"
import { SettingsSidebar } from "@/components/settings-sidebar"
import { StatsOverview } from "@/components/stats-overview"
import { useWallet } from "@solana/wallet-adapter-react"

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { publicKey } = useWallet()

  // Handle responsive sidebar
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false)
      }
    }

    // Initial check
    checkScreenSize()

    // Add event listener
    window.addEventListener("resize", checkScreenSize)

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  // Toggle body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isMobile, sidebarOpen])

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-30" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Settings Sidebar - Responsive */}
      <div
        className={`
        ${isMobile ? "fixed inset-y-0 left-0 z-40 transform transition-transform duration-200 ease-in-out" : "relative"}
        ${isMobile && !sidebarOpen ? "-translate-x-full" : "translate-x-0"}
      `}
      >
        <SettingsSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <TopBar onMenuClick={() => setSidebarOpen(true)} showMenuButton={isMobile} />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-[1400px] mx-auto">
            {/* Dashboard Overview Cards */}
            <div className="mb-6">
              <h1 className="text-xl font-bold mb-4">Dashboard Overview</h1>
              <Suspense fallback={<div className="animate-pulse h-64 bg-gray-100 rounded-3xl"></div>}>
                <StatsOverview />
              </Suspense>
            </div>

            {/* Wallet Connection Check */}
            {!publicKey ? (
              <div className="bg-white p-8 rounded-2xl shadow-sm text-center mb-6">
                <h2 className="text-xl font-bold mb-2">Connect Your Wallet</h2>
                <p className="text-gray-600 mb-4">
                  Connect your wallet to see your personalized dashboard and whale feed
                </p>
              </div>
            ) : (
              <>
                {/* Whale Feed */}
                <div className="mb-6">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-2 sm:gap-0">
                    <div>
                      <h2 className="text-xl font-bold">Your Whale Feed</h2>
                      <p className="text-gray-500 mt-0.5 text-sm">Real-time activity from whales you follow</p>
                    </div>
                    <Button className="bg-teal-500 hover:bg-teal-600 text-white rounded-xl transition-all duration-200 ease-in-out shadow-sm text-sm py-2 w-full sm:w-auto">
                      View All Activity
                    </Button>
                  </div>
                  <Card className="bg-white border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                    <CardContent className="p-0">
                      <Suspense fallback={<div className="animate-pulse h-64 bg-gray-100"></div>}>
                        <WhaleFeed />
                      </Suspense>
                    </CardContent>
                  </Card>
                </div>

                {/* Leaderboard Preview */}
                <div className="mb-6">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-2 sm:gap-0">
                    <div>
                      <h2 className="text-xl font-bold">Whale Leaderboard</h2>
                      <p className="text-gray-500 mt-0.5 text-sm">Top performing whales this week</p>
                    </div>
                    <Button
                      variant="outline"
                      className="border-gray-200 hover:bg-gray-100 text-gray-700 rounded-xl transition-all duration-200 ease-in-out shadow-sm text-sm py-2 w-full sm:w-auto"
                    >
                      View Full Leaderboard
                    </Button>
                  </div>
                  <Leaderboard />
                </div>

                {/* Whale Suggestions */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h2 className="text-xl font-bold">Suggested Whales</h2>
                      <p className="text-gray-500 mt-0.5 text-sm">Based on your interests</p>
                    </div>
                  </div>
                  <WhaleSuggestions />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
