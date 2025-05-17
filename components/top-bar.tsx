"use client"

import { Search, Bell, ChevronDown, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useWallet } from "@solana/wallet-adapter-react"
import { useState, useEffect } from "react"
import { truncateAddress } from "@/lib/utils"
import { Connection } from "@solana/web3.js"

interface TopBarProps {
  onMenuClick?: () => void
  showMenuButton?: boolean
}

export function TopBar({ onMenuClick, showMenuButton = false }: TopBarProps) {
  const { publicKey, connected } = useWallet()
  const [balance, setBalance] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Replace the mock balance fetching with real Solana RPC call
  useEffect(() => {
    const fetchBalance = async () => {
      if (connected && publicKey) {
        try {
          setIsLoading(true)

          // List of public RPC endpoints to try in order
          const rpcEndpoints = [
            process.env.NEXT_PUBLIC_SOLANA_RPC_ENDPOINT,
            "https://api.mainnet-beta.solana.com",
            "https://solana-api.projectserum.com",
            "https://rpc.ankr.com/solana",
          ]

          let balance = null
          let error = null

          // Try each endpoint until one works
          for (const endpoint of rpcEndpoints) {
            if (!endpoint) continue

            try {
              const connection = new Connection(endpoint, "confirmed")
              balance = await connection.getBalance(publicKey)
              // If we got here, the request succeeded
              break
            } catch (err) {
              // Store the error but continue trying other endpoints
              error = err
              console.log(`Failed to fetch balance from ${endpoint}:`, err)
            }
          }

          if (balance !== null) {
            // Convert lamports to SOL (1 SOL = 10^9 lamports)
            setBalance(balance / 1000000000)
          } else {
            // If all endpoints failed, log the last error
            console.error("All RPC endpoints failed:", error)
            // Use cached balance if available, otherwise null
            // This prevents the UI from flashing "0 SOL" on temporary errors
          }

          setIsLoading(false)
        } catch (error) {
          console.error("Error in balance fetching:", error)
          setIsLoading(false)
        }
      } else {
        setBalance(null)
      }
    }

    fetchBalance()

    // Set up an interval to refresh the balance every minute instead of 30 seconds
    // to reduce the chance of hitting rate limits
    const intervalId = setInterval(fetchBalance, 60000)

    return () => clearInterval(intervalId)
  }, [connected, publicKey])

  return (
    <div className="border-b border-gray-200 bg-white py-3 px-4 sm:py-4 sm:px-6 lg:px-8 sticky top-0 z-10">
      <div className="max-w-[1400px] mx-auto flex justify-between items-center">
        {/* Logo and Menu Button */}
        <div className="flex items-center gap-2">
          {showMenuButton && (
            <Button variant="ghost" size="icon" className="h-8 w-8 mr-1 lg:hidden" onClick={onMenuClick}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </Button>
          )}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r text-lg from-teal-400 to-blue-500 flex items-center justify-center">
            🐋
          </div>
          <span className="text-lg font-bold hidden sm:inline">MyWhale</span>
        </div>

        {/* Search - Hidden on smallest screens */}
        <div className="relative w-[180px] sm:w-[250px] md:w-[350px] hidden sm:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <Input
            placeholder="Search whales, tokens..."
            className="pl-9 py-2 h-9 bg-white border-gray-200 focus:border-teal-500 text-gray-700 placeholder:text-gray-400 rounded-xl shadow-sm text-sm"
          />
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="relative h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <Bell className="h-4 w-4 text-gray-700" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>

          <div className="flex items-center gap-2 sm:gap-3 bg-white p-1.5 pr-2 sm:pr-3 rounded-xl border border-gray-200 shadow-sm">
            <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center">
              <span className="text-xs font-bold text-white">
                {connected && publicKey ? publicKey.toString().substring(0, 2) : "SW"}
              </span>
            </div>
            <div className="hidden sm:block">
              {connected && publicKey ? (
                <>
                  <div className="font-bold text-gray-800 text-sm">{truncateAddress(publicKey.toString())}</div>
                  {isLoading ? (
                    <div className="h-3 w-16 bg-gray-200 animate-pulse rounded"></div>
                  ) : (
                    <div className="text-teal-600 text-xs">
                      {balance !== null ? `${balance.toFixed(4)} SOL` : "0 SOL"}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="font-bold text-gray-800 text-sm">Not Connected</div>
                  <div className="text-teal-600 text-xs">Connect Wallet</div>
                </>
              )}
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-gray-400 ml-0 sm:ml-1" />
          </div>
        </div>
      </div>
    </div>
  )
}
