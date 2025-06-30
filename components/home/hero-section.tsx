"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Wallet, Eye, Award } from "lucide-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";

/**
 * HeroSection component serves as the main introductory section of the landing page.
 * It features a compelling headline, a description of the platform, calls to action
 * for connecting a wallet, exploring whales, and applying to be a whale.
 * It also includes a subtle animated background for visual appeal.
 *
 * @returns {JSX.Element} The rendered hero section.
 */
export function HeroSection() {
  // State for controlling the animation offset of the background elements
  const [animationOffset, setAnimationOffset] = useState(0);
  // Hook to control the visibility of the Solana wallet connection modal
  const { setVisible } = useWalletModal();
  // Hook to get the connection status of the Solana wallet
  const { connected } = useWallet();

  /**
   * useEffect hook to create a simple animation effect for the background.
   * It updates the `animationOffset` state at regular intervals, causing
   * background elements to subtly move.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationOffset((prev) => (prev + 1) % 100); // Increment offset and loop after 100
    }, 50); // Update every 50 milliseconds
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
      {/* Animated background elements (gradients, grid, dots, lines) */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(76, 175, 80, 0.2) 0%, transparent 20%), " +
              "radial-gradient(circle at 80% 30%, rgba(33, 150, 243, 0.2) 0%, transparent 20%), " +
              "radial-gradient(circle at 40% 70%, rgba(156, 39, 176, 0.2) 0%, transparent 30%), " +
              "radial-gradient(circle at 70% 80%, rgba(255, 152, 0, 0.2) 0%, transparent 20%)",
            backgroundSize: "120% 120%",
            transform: `translate(${animationOffset / 5}px, ${-animationOffset / 10}px)`, // Subtle movement
          }}
        ></div>
        {/* SVG for animated grid, dots, and lines */}
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
              patternTransform={`rotate(${animationOffset / 10}) translate(${animationOffset / 5} ${
                -animationOffset / 5
              })`}
            >
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0, 128, 128, 0.1)" strokeWidth="0.5"></path>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)"></rect>
          {/* Animated dots representing transactions */}
          {Array.from({ length: 15 }).map((_, i) => (
            <circle
              key={i}
              cx={`${(i * 123 + animationOffset * 2) % 100}%`}
              cy={`${(i * 47 + animationOffset) % 100}%`}
              r={i % 3 === 0 ? 3 : i % 3 === 1 ? 2 : 1}
              fill={
                i % 4 === 0
                  ? "rgba(0, 128, 128, 0.5)"
                  : i % 4 === 1
                    ? "rgba(0, 100, 200, 0.5)"
                    : i % 4 === 2
                      ? "rgba(100, 0, 200, 0.5)"
                      : "rgba(200, 100, 0, 0.5)"
              }
            />
          ))}
          {/* Animated lines representing connections */}
          {Array.from({ length: 10 }).map((_, i) => (
            <line
              key={i}
              x1={`${(i * 17 + animationOffset) % 100}%`}
              y1={`${(i * 23 + animationOffset * 2) % 100}%`}
              x2={`${(i * 31 + animationOffset * 1.5) % 100}%`}
              y2={`${(i * 37 + animationOffset) % 100}%`}
              stroke={
                i % 3 === 0
                  ? "rgba(0, 128, 128, 0.2)"
                  : i % 3 === 1
                    ? "rgba(0, 100, 200, 0.2)"
                    : "rgba(100, 0, 200, 0.2)"
              }
              strokeWidth="1"
            />
          ))}
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
          Track the Smartest Wallets on Solana
        </h1>
        <p className="text-gray-600 text-base sm:text-lg max-w-3xl mx-auto mb-8 sm:mb-10">
          Connect your wallet, follow elite traders, and get AI-powered alerts on whale moves in DeFi, NFTs, staking,
          and more.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10 sm:mb-16">
          {!connected ? (
            // Button to connect wallet if not already connected
            <Button
              onClick={() => setVisible(true)}
              className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white flex items-center gap-2 text-sm sm:text-base py-2 px-4 sm:py-2.5 sm:px-5"
            >
              <Wallet className="h-4 w-4" />
              Connect Wallet
            </Button>
          ) : (
            // Link to dashboard if wallet is connected
            <Link href="/dashboard">
              <Button className="bg-teal-500 hover:bg-teal-600 text-white flex items-center gap-2 text-sm sm:text-base py-2 px-4 sm:py-2.5 sm:px-5">
                <Wallet className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
          )}
          {/* Button to explore whales */}
          <Button
            variant="outline"
            className="border-gray-200 hover:bg-gray-100 text-gray-700 flex items-center gap-2 text-sm sm:text-base py-2 px-4 sm:py-2.5 sm:px-5"
          >
            <Eye className="h-4 w-4" />
            Explore Whales
          </Button>
          {/* Link to apply as a whale */}
          <Link href="/apply">
            <Button
              variant="ghost"
              className="text-teal-600 hover:bg-teal-50 flex items-center gap-2 text-sm sm:text-base py-2 px-4 sm:py-2.5 sm:px-5"
            >
              <Award className="h-4 w-4" />
              Apply as a Whale
            </Button>
          </Link>
        </div>

        {/* Placeholder for live visualization */}
        <div className="relative max-w-4xl mx-auto">
          <div className="aspect-[16/9] bg-gray-100 rounded-xl overflow-hidden shadow-lg border border-gray-200">
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <p className="text-sm">Live Solana Transaction Visualization</p>
                <p className="text-xs mt-1 text-gray-500">
                  (Animation of live Solana transactions or heatmap-style whale movement)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}