"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Twitter, MessageCircle, Copy, CheckCheck, Users, TrendingUp, BarChart2 } from "lucide-react";
import { truncateAddress } from "@/lib/utils";
import { useFollow } from "@/hooks/use-follow";

/**
 * Props for the WhaleProfileHeader component.
 * @interface WhaleProfileHeaderProps
 * @property {object} whale - The whale data object containing profile information.
 * @property {string} [whale.display_name] - The display name of the whale.
 * @property {string} [whale.wallet_address] - The wallet address of the whale.
 * @property {string} [whale.bio] - A short biography or description of the whale.
 * @property {object} [whale.strategies] - An object where keys are strategy names (e.g., 'defi', 'nft') and values are booleans indicating if the whale uses that strategy.
 * @property {string} [whale.twitter] - The whale's Twitter handle (e.g., "@whale_trader").
 * @property {string} [whale.telegram] - The whale's Telegram handle (e.g., "@whale_community").
 * @property {number} [whale.followers_count] - The number of followers the whale has.
 * @property {string} [whale.roi] - The whale's 30-day ROI (e.g., "+15%").
 * @property {string} [whale.volume] - The whale's trading volume (e.g., "$1.2M").
 */
interface WhaleProfileHeaderProps {
  whale: {
    display_name?: string;
    wallet_address?: string;
    bio?: string;
    strategies?: { [key: string]: boolean };
    twitter?: string;
    telegram?: string;
    followers_count?: number;
    roi?: string;
    volume?: string;
  };
}

/**
 * WhaleProfileHeader component displays the main profile information for a whale,
 * including their avatar, display name, wallet address, bio, strategies, social links,
 * and key performance statistics. It also includes a follow button.
 *
 * @param {WhaleProfileHeaderProps} { whale } - The props object containing whale data.
 * @returns {JSX.Element} The rendered whale profile header card.
 */
export function WhaleProfileHeader({ whale }: WhaleProfileHeaderProps) {
  const { publicKey } = useWallet(); // Get connected wallet's public key (for context, not directly used here)
  const [copied, setCopied] = useState(false); // State to manage copy-to-clipboard feedback

  // Use the custom `useFollow` hook for follow/unfollow functionality
  const { isFollowing, isLoading, toggleFollow } = useFollow(whale?.wallet_address || "");

  /**
   * Generates initials from the whale's display name.
   * Handles cases where display_name might be null or undefined.
   * If display_name is not available, it uses the first two characters of the wallet address.
   * @returns {string} The generated initials.
   */
  const getInitials = () => {
    if (!whale || !whale.display_name) {
      return whale?.wallet_address ? whale.wallet_address.substring(0, 2).toUpperCase() : "WH";
    }

    // Remove "@" symbol, split by space, take first letter of each word, join, and take first two characters
    return whale.display_name
      .split("@")
      .join("")
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const initials = getInitials();

  /**
   * Determines a consistent avatar background color based on the whale's display name.
   * @returns {string} A Tailwind CSS background color class.
   */
  const avatarColors = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-emerald-500",
    "bg-amber-500",
    "bg-red-500",
    "bg-teal-500",
    "bg-pink-500",
    "bg-indigo-500",
  ];
  // Use modulo operator to cycle through colors based on display name length
  const avatarColor = avatarColors[(whale?.display_name?.length || 0) % avatarColors.length];

  /**
   * Handles copying the whale's wallet address to the clipboard.
   * Provides visual feedback to the user.
   */
  const handleCopyAddress = () => {
    if (whale?.wallet_address) {
      navigator.clipboard.writeText(whale.wallet_address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
    }
  };

  return (
    <Card className="bg-white border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar Section */}
          <div className={`w-24 h-24 rounded-xl ${avatarColor} flex items-center justify-center shrink-0`}>
            <span className="text-2xl font-bold text-white">{initials}</span>
          </div>

          {/* Profile Info Section */}
          <div className="flex-1">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{whale?.display_name || "Unknown Whale"}</h1>
                <div className="flex items-center gap-2 mt-1">
                  {/* Truncated Wallet Address */}
                  <span className="text-gray-500">
                    {whale?.wallet_address ? truncateAddress(whale.wallet_address, 8, 8) : "Address Unavailable"}
                  </span>
                  {whale?.wallet_address && (
                    <>
                      {/* Copy Address Button */}
                      <button
                        onClick={handleCopyAddress}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        title="Copy address"
                      >
                        {copied ? <CheckCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </button>
                      {/* View on Solana Explorer Link */}
                      <a
                        href={`https://explorer.solana.com/address/${whale.wallet_address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        title="View on Solana Explorer"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </>
                  )}
                </div>
              </div>

              {/* Follow Button */}
              <Button
                onClick={toggleFollow}
                disabled={isLoading || !whale?.wallet_address} // Disable if loading or no address
                className={
                  isFollowing
                    ? "bg-gray-100 hover:bg-gray-200 text-gray-800"
                    : "bg-teal-500 hover:bg-teal-600 text-white"
                }
              >
                {isLoading ? "Loading..." : isFollowing ? "Following" : "Follow"}
              </Button>
            </div>

            {/* Biography */}
            {whale?.bio && <p className="text-gray-600 mt-4 max-w-3xl">{whale.bio}</p>}

            {/* Strategy Tags */}
            {whale?.strategies && (
              <div className="flex flex-wrap gap-2 mt-4">
                {Object.entries(whale.strategies).map(
                  ([key, value]) =>
                    value && (
                      <Badge
                        key={key}
                        variant="outline"
                        className={
                          key === "defi"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : key === "nft"
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : key === "staking"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : key === "dao"
                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                  : key === "meme"
                                    ? "bg-red-50 text-red-700 border-red-200"
                                    : key === "yield"
                                      ? "bg-teal-50 text-teal-700 border-teal-200"
                                      : "bg-gray-50 text-gray-700 border-gray-200"
                        }
                      >
                        {key.charAt(0).toUpperCase() + key.slice(1)} {/* Capitalize first letter of strategy */}
                      </Badge>
                    ),
                )}
              </div>
            )}

            {/* Social Links */}
            <div className="flex gap-3 mt-4">
              {whale?.twitter && (
                <a
                  href={`https://twitter.com/${whale.twitter.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-blue-500 transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              )}
              {whale?.telegram && (
                <a
                  href={`https://t.me/${whale.telegram.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-blue-500 transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>

          {/* Statistics Section */}
          <div className="flex flex-row md:flex-col gap-4 mt-2 md:mt-0">
            {/* Followers Stat */}
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <div className="flex items-center justify-center gap-1 text-gray-500 text-xs mb-1">
                <Users className="h-3.5 w-3.5" />
                <span>Followers</span>
              </div>
              <div className="font-bold text-gray-800 text-lg">{whale?.followers_count || 0}</div>
            </div>
            {/* 30d ROI Stat */}
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <div className="flex items-center justify-center gap-1 text-gray-500 text-xs mb-1">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>30d ROI</span>
              </div>
              <div className="font-bold text-emerald-600 text-lg">{whale?.roi || "+0%"}</div>
            </div>
            {/* Volume Stat */}
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <div className="flex items-center justify-center gap-1 text-gray-500 text-xs mb-1">
                <BarChart2 className="h-3.5 w-3.5" />
                <span>Volume</span>
              </div>
              <div className="font-bold text-gray-800 text-lg">{whale?.volume || "$0"}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}