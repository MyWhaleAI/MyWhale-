"use client";

import { Search, Bell, ChevronDown, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useWallet } from "@solana/wallet-adapter-react";
import { useState, useEffect } from "react";
import { truncateAddress } from "@/lib/utils";
import { Connection } from "@solana/web3.js";

/**
 * Props for the TopBar component.
 * @interface TopBarProps
 * @property {() => void} [onMenuClick] - Optional callback function to be called when the menu button is clicked.
 * @property {boolean} [showMenuButton=false] - Determines whether to display the mobile menu button.
 */
interface TopBarProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

/**
 * TopBar component displays the application's header, including a logo,
 * a search bar, notification button, and user wallet information.
 * It dynamically fetches and displays the connected Solana wallet's balance.
 *
 * @param {TopBarProps} props - The component's props.
 * @returns {JSX.Element} The rendered top bar.
 */
export function TopBar({ onMenuClick, showMenuButton = false }: TopBarProps) {
  // Hook to access the connected Solana wallet's public key and connection status
  const { publicKey, connected } = useWallet();
  // State to store the fetched Solana balance
  const [balance, setBalance] = useState<number | null>(null);
  // State to manage loading status during balance fetching
  const [isLoading, setIsLoading] = useState(false);

  /**
   * useEffect hook to fetch the Solana balance of the connected wallet.
   * It attempts to fetch the balance from multiple RPC endpoints for robustness.
   * The balance is refreshed every 60 seconds.
   */
  useEffect(() => {
    const fetchBalance = async () => {
      if (!connected || !publicKey) {
        setBalance(null); // Clear balance if wallet is not connected
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true); // Set loading state to true
        // List of public RPC endpoints to try in order
        const rpcEndpoints = [
          process.env.NEXT_PUBLIC_SOLANA_RPC_ENDPOINT, // Primary endpoint from environment variable
          "https://api.mainnet-beta.solana.com", // Fallback 1
          "https://solana-api.projectserum.com", // Fallback 2
          "https://rpc.ankr.com/solana", // Fallback 3
        ].filter(Boolean) as string[]; // Filter out any undefined endpoints

        let fetchedBalance: number | null = null;
        let lastError: unknown = null;

        // Iterate through RPC endpoints until a successful connection is made
        for (const endpoint of rpcEndpoints) {
          try {
            const connection = new Connection(endpoint, "confirmed"); // Establish connection
            fetchedBalance = await connection.getBalance(publicKey); // Fetch balance in lamports
            break; // Exit loop on successful fetch
          } catch (err) {
            lastError = err; // Store error and try next endpoint
            console.log(`Failed to fetch balance from ${endpoint}:`, err);
          }
        }

        if (fetchedBalance !== null) {
          // Convert lamports to SOL (1 SOL = 10^9 lamports)
          setBalance(fetchedBalance / 1000000000);
        } else {
          // If all endpoints failed, log the last error
          console.error("All RPC endpoints failed:", lastError);
          // Keep current balance or set to null if no balance was ever fetched
          setBalance(null);
        }
      } catch (error) {
        console.error("Error in balance fetching:", error);
      } finally {
        setIsLoading(false); // Always set loading to false after attempt
      }
    };

    fetchBalance(); // Initial fetch on component mount or publicKey change

    // Set up an interval to refresh the balance every minute
    const intervalId = setInterval(fetchBalance, 60000);

    // Cleanup function to clear the interval when the component unmounts or dependencies change
    return () => clearInterval(intervalId);
  }, [connected, publicKey]); // Dependencies for useEffect: re-run when connected status or publicKey changes

  return (
    <div className="border-b border-gray-200 bg-white py-3 px-4 sm:py-4 sm:px-6 lg:px-8 sticky top-0 z-10">
      <div className="max-w-[1400px] mx-auto flex justify-between items-center">
        {/* Logo and Mobile Menu Button */}
        <div className="flex items-center gap-2">
          {showMenuButton && (
            <Button variant="ghost" size="icon" className="h-8 w-8 mr-1 lg:hidden" onClick={onMenuClick}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </Button>
          )}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r text-lg from-teal-400 to-blue-500 flex items-center justify-center">
            🐋 {/* Whale emoji as logo */}
          </div>
          <span className="text-lg font-bold hidden sm:inline">MyWhale</span>
        </div>

        {/* Search Input */}
        <div className="relative w-[180px] sm:w-[250px] md:w-[350px] hidden sm:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <Input
            placeholder="Search whales, tokens..."
            className="pl-9 py-2 h-9 bg-white border-gray-200 focus:border-teal-500 text-gray-700 placeholder:text-gray-400 rounded-xl shadow-sm text-sm"
          />
        </div>

        {/* User Actions: Notification Bell and Wallet Info */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notification Bell Button */}
          <Button
            variant="ghost"
            size="icon"
            className="relative h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <Bell className="h-4 w-4 text-gray-700" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span> {/* Notification indicator */}
          </Button>

          {/* Wallet Information Display */}
          <div className="flex items-center gap-2 sm:gap-3 bg-white p-1.5 pr-2 sm:pr-3 rounded-xl border border-gray-200 shadow-sm">
            <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center">
              <span className="text-xs font-bold text-white">
                {connected && publicKey ? publicKey.toString().substring(0, 2) : "SW"} {/* Display first two chars of address or "SW" */}
              </span>
            </div>
            <div className="hidden sm:block">
              {connected && publicKey ? (
                <>
                  <div className="font-bold text-gray-800 text-sm">{truncateAddress(publicKey.toString())}</div>
                  {isLoading ? (
                    <div className="h-3 w-16 bg-gray-200 animate-pulse rounded"></div> // Loading skeleton for balance
                  ) : (
                    <div className="text-teal-600 text-xs">
                      {balance !== null ? `${balance.toFixed(4)} SOL` : "0 SOL"} {/* Display formatted balance */}
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
            <ChevronDown className="h-3.5 w-3.5 text-gray-400 ml-0 sm:ml-1" /> {/* Dropdown arrow */}
          </div>
        </div>
      </div>
    </div>
  );
}