import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Space_Grotesk } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { SolanaWalletProvider } from "@/components/wallet/solana-wallet-provider"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
})

export const metadata: Metadata = {
  title: "My Whale - Solana Whale Tracking Platform",
  description:
    "Track top Solana whales, get instant alerts on their moves, and understand the strategy behind each transaction with AI-powered insights.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={spaceGrotesk.variable}>
      <body className="font-space-grotesk">
          <SolanaWalletProvider>{children}</SolanaWalletProvider>
      </body>
    </html>
  )
}
