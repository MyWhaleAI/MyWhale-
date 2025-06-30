"use client";

import Link from "next/link";
import { TrendingUp, Users, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useFollow } from "@/hooks/use-follow";

/**
 * Props for the WhaleCard component.
 * @interface WhaleCardProps
 * @property {object} whale - The whale data object.
 * @property {string} [whale.name] - The name of the whale.
 * @property {string} [whale.display_name] - Alternative display name for the whale.
 * @property {string} [whale.avatar] - Avatar initial for the whale.
 * @property {string} [whale.avatarColor] - Background color for the avatar.
 * @property {string} [whale.description] - Description of the whale's strategy.
 * @property {string} [whale.bio] - Alternative biography for the whale.
 * @property {string[]} [whale.tags] - Array of tags associated with the whale.
 * @property {string} [whale.followers] - Number of followers.
 * @property {string} [whale.followers_count] - Alternative followers count.
 * @property {string} [whale.volume] - Trading volume.
 * @property {string} [whale.walletAddress] - The wallet address of the whale.
 * @property {string} [whale.wallet_address] - Alternative wallet address.
 * @property {string} [whale.avatarUrl] - URL for the whale's avatar image.
 * @property {string} [whale.roi] - Return on Investment.
 */
interface WhaleCardProps {
  whale: {
    id: number;
    name?: string;
    display_name?: string;
    avatar?: string;
    avatarColor?: string;
    description?: string;
    bio?: string;
    tags?: string[];
    followers?: string;
    followers_count?: string;
    volume?: string;
    walletAddress?: string;
    wallet_address?: string;
    avatarUrl?: string;
    roi?: string;
  };
}

/**
 * WhaleCard component displays a single whale's profile with their key metrics,
 * description, tags, and actions like viewing profile and following.
 * It integrates the `useFollow` hook to manage the follow state.
 *
 * @param {WhaleCardProps} { whale } - The props object containing whale data.
 * @returns {JSX.Element} The rendered whale card.
 */
export function WhaleCard({ whale }: WhaleCardProps) {
  // Handle null or undefined values, providing fallbacks
  const name = whale.name || whale.display_name || "Anonymous Whale";
  const avatar = whale.avatar || name.charAt(0).toUpperCase();
  const avatarColor = whale.avatarColor || "bg-blue-500";
  const description = whale.description || whale.bio || "No description available";
  const tags = whale.tags || [];
  const followers = whale.followers || whale.followers_count || "0";
  const volume = whale.volume || "$0";
  const walletAddress = whale.walletAddress || whale.wallet_address || "";

  // Integrate the useFollow hook for managing follow state
  const { isFollowing, isLoading, toggleFollow } = useFollow(walletAddress);

  return (
    <Card className="bg-white border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-center gap-3 mb-4">
          {whale.avatarUrl ? (
            // Display avatar image if available, otherwise a placeholder
            <img src={whale.avatarUrl || "/placeholder.svg"} alt={name} className="w-10 h-10 rounded-xl object-cover" />
          ) : (
            // Display a colored avatar with initial if no image URL
            <div
              className={`w-10 h-10 rounded-xl ${avatarColor} flex items-center justify-center text-sm font-bold text-white`}
            >
              {avatar}
            </div>
          )}
          <div>
            <div className="font-bold text-gray-800">{name}</div>
            <div className="flex items-center text-emerald-600 text-sm">
              <TrendingUp className="h-3.5 w-3.5 mr-1" />
              {whale.roi || "+0%"} ROI
            </div>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <Badge
              key={`${tag}-${index}`}
              variant="outline"
              className={
                // Dynamic styling for badges based on tag content
                tag === "DeFi"
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : tag === "NFT"
                    ? "bg-purple-50 text-purple-700 border-purple-200"
                    : tag === "Staking"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : tag === "DAOs"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-red-50 text-red-700 border-red-200"
              }
            >
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            <span>{followers}</span>
          </div>
          <div className="flex items-center gap-1">
            <BarChart2 className="h-3.5 w-3.5" />
            <span>{volume}</span>
          </div>
        </div>

        <div className="flex justify-between gap-2 mt-4">
          {/* Button to view whale's full profile */}
          <Button variant="outline" className="border-gray-200 hover:bg-gray-100 text-gray-700" asChild>
            <Link href={`/whale/${walletAddress}`}>View Profile</Link>
          </Button>

          {/* Follow/Following button, state managed by useFollow hook */}
          <Button
            className={`${
              isFollowing ? "bg-gray-100 hover:bg-gray-200 text-gray-800" : "bg-teal-500 hover:bg-teal-600 text-white"
            }`}
            onClick={toggleFollow} // Toggle follow status on click
            disabled={isLoading} // Disable button while loading
          >
            {isLoading ? "Loading..." : isFollowing ? "Following" : "Follow"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}