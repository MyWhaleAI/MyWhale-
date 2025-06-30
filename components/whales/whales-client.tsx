"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WhaleCard } from "./whale-card"; // Assuming whale-card is in the same directory or correctly imported
import { WalletButton } from "../wallet/wallet-button"; // Assuming WalletButton path

/**
 * Interface for a single whale object.
 * @interface Whale
 * @property {number} id - Unique identifier for the whale.
 * @property {string} [name] - The name of the whale.
 * @property {string} [description] - A brief description of the whale.
 * @property {string[]} [tags] - An array of tags associated with the whale (e.g., "DeFi", "NFT").
 * @property {string} [roi] - Return on Investment (e.g., "+15%").
 * @property {string} [followers] - Number of followers (e.g., "1.2k").
 * @property {string} [volume] - Trading volume (e.g., "$2.4M").
 * @property {string} [avatarUrl] - URL to the whale's avatar image.
 * @property {string} [avatarColor] - Background color for the avatar.
 * @property {string} [display_name] - Alternative display name.
 * @property {string} [bio] - Alternative biography.
 * @property {string} [followers_count] - Alternative followers count.
 * @property {string} [walletAddress] - The wallet address of the whale.
 * @property {string} [wallet_address] - Alternative wallet address.
 */
interface Whale {
  id: number;
  name?: string;
  description?: string;
  tags?: string[];
  roi?: string;
  followers?: string;
  volume?: string;
  avatarUrl?: string;
  avatarColor?: string;
  display_name?: string;
  bio?: string;
  followers_count?: string;
  walletAddress?: string;
  wallet_address?: string;
}

/**
 * Props for the WhalesClient component.
 * @interface WhalesClientProps
 * @property {Whale[]} [initialWhales=[]] - An array of whale objects to display initially.
 */
interface WhalesClientProps {
  initialWhales?: Whale[];
}

/**
 * WhalesClient component provides the main client-side logic and UI for displaying and
 * managing a list of whale profiles. It includes features for searching, filtering,
 * and sorting whales.
 *
 * @param {WhalesClientProps} { initialWhales } - The props object containing initial whale data.
 * @returns {JSX.Element} The rendered whales client page.
 */
export function WhalesClient({ initialWhales = [] }: WhalesClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("roi"); // Default sort by ROI
  const [whales] = useState(initialWhales); // Use initial whales data

  // Filter whales based on search query across name, description, and tags
  const filteredWhales = whales.filter(
    (whale) =>
      whale.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      whale.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      whale.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  // Sort whales based on selected criteria (ROI, Followers, or Volume)
  const sortedWhales = [...filteredWhales].sort((a, b) => {
    if (sortBy === "roi") {
      // Convert ROI strings like "+15%" to numbers for comparison
      return (
        Number.parseFloat((b.roi || "+0%").replace("+", "").replace("%", "")) -
        Number.parseFloat((a.roi || "+0%").replace("+", "").replace("%", ""))
      );
    } else if (sortBy === "followers") {
      // Convert follower strings like "1.2k" to numbers for comparison
      return (
        Number.parseFloat((b.followers || "0").replace("k", "000")) -
        Number.parseFloat((a.followers || "0").replace("k", "000"))
      );
    } else if (sortBy === "volume") {
      // Convert volume strings like "$2.4M" to numbers for comparison
      return (
        Number.parseFloat((b.volume || "$0").replace("$", "").replace("M", "000000")) -
        Number.parseFloat((a.volume || "$0").replace("$", "").replace("M", "000000"))
      );
    }
    return 0; // No sorting if criteria is not recognized
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="border-b border-gray-200 py-3 px-4 sm:py-4 sm:px-6 lg:px-8 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-teal-400 to-blue-500 flex items-center justify-center">
                🐋 {/* Whale emoji as logo */}
              </div>
              <span className="text-lg font-bold">MyWhale</span>
            </Link>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/whales" className="text-teal-600 hover:text-teal-700 text-sm font-medium">
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
          </nav>

          {/* Action Buttons (Mobile Search & Wallet) */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors md:hidden"
            >
              <Search className="h-4 w-4 text-gray-700" />
            </Button>
            <WalletButton /> {/* Wallet connection button */}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Top Solana Whales</h1>
          <p className="text-gray-600">Follow the most successful traders on Solana and learn from their strategies.</p>
        </div>

        {/* Search and Filter/Sort Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search Input */}
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, strategy, or tags..."
              className="pl-10 py-2 h-10 bg-white border-gray-200 focus:border-teal-500 text-gray-700 placeholder:text-gray-400 rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {/* Filter and Sort Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-gray-200 hover:bg-gray-100 text-gray-700 flex items-center gap-2 rounded-xl"
            >
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            {/* Sort By Dropdown (visually handled by group-hover for simplicity) */}
            <div className="relative group"> {/* Added 'group' class */}
              <Button
                variant="outline"
                className="border-gray-200 hover:bg-gray-100 text-gray-700 flex items-center gap-2 rounded-xl"
              >
                <ArrowUpDown className="h-4 w-4" />
                Sort by: {sortBy === "roi" ? "ROI" : sortBy === "followers" ? "Followers" : "Volume"}
              </Button>
              <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-1 z-10 hidden group-hover:block">
                <button
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md"
                  onClick={() => setSortBy("roi")}
                >
                  ROI
                </button>
                <button
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md"
                  onClick={() => setSortBy("followers")}
                >
                  Followers
                </button>
                <button
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md"
                  onClick={() => setSortBy("volume")}
                >
                  Volume
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs for Whale Categories */}
        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="bg-gray-100 p-1 rounded-xl">
            <TabsTrigger value="all" className="rounded-lg">
              All Whales
            </TabsTrigger>
            <TabsTrigger value="defi" className="rounded-lg">
              DeFi
            </TabsTrigger>
            <TabsTrigger value="nft" className="rounded-lg">
              NFT
            </TabsTrigger>
            <TabsTrigger value="staking" className="rounded-lg">
              Staking
            </TabsTrigger>
            <TabsTrigger value="meme" className="rounded-lg">
              Meme Coins
            </TabsTrigger>
          </TabsList>

          {/* Tab Content: All Whales */}
          <TabsContent value="all" className="mt-6">
            {sortedWhales.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedWhales.map((whale) => (
                  <WhaleCard key={whale.id} whale={whale} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No whales found. Try adjusting your search criteria.</p>
              </div>
            )}
          </TabsContent>

          {/* Tab Content: DeFi Whales */}
          <TabsContent value="defi" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedWhales
                .filter((whale) => whale.tags?.includes("DeFi"))
                .map((whale) => (
                  <WhaleCard key={whale.id} whale={whale} />
                ))}
            </div>
          </TabsContent>

          {/* Tab Content: NFT Whales */}
          <TabsContent value="nft" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedWhales
                .filter((whale) => whale.tags?.includes("NFT"))
                .map((whale) => (
                  <WhaleCard key={whale.id} whale={whale} />
                ))}
            </div>
          </TabsContent>

          {/* Tab Content: Staking Whales */}
          <TabsContent value="staking" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedWhales
                .filter((whale) => whale.tags?.includes("Staking"))
                .map((whale) => (
                  <WhaleCard key={whale.id} whale={whale} />
                ))}
            </div>
          </TabsContent>

          {/* Tab Content: Meme Coins Whales */}
          <TabsContent value="meme" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedWhales
                .filter((whale) => whale.tags?.includes("Meme Coins"))
                .map((whale) => (
                  <WhaleCard key={whale.id} whale={whale} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}