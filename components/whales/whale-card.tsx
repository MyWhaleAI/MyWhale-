"use client"
import Link from "next/link"
import { TrendingUp, Users, BarChart2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useFollow } from "@/hooks/use-follow"

export function WhaleCard({ whale }) {
  // Handle null or undefined values
  const name = whale.name || whale.display_name || "Anonymous Whale"
  const avatar = whale.avatar || name.charAt(0).toUpperCase()
  const avatarColor = whale.avatarColor || "bg-blue-500"
  const description = whale.description || whale.bio || "No description available"
  const tags = whale.tags || []
  const followers = whale.followers || whale.followers_count || "0"
  const volume = whale.volume || "$0"
  const walletAddress = whale.walletAddress || whale.wallet_address || ""

  const { isFollowing, isLoading, toggleFollow } = useFollow(walletAddress)

  return (
    <Card className="bg-white border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-center gap-3 mb-4">
          {whale.avatarUrl ? (
            <img src={whale.avatarUrl || "/placeholder.svg"} alt={name} className="w-10 h-10 rounded-xl object-cover" />
          ) : (
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
          <Button variant="outline" className="border-gray-200 hover:bg-gray-100 text-gray-700" asChild>
            <Link href={`/whale/${walletAddress}`}>View Profile</Link>
          </Button>

          <Button
            className={`${
              isFollowing ? "bg-gray-100 hover:bg-gray-200 text-gray-800" : "bg-teal-500 hover:bg-teal-600 text-white"
            }`}
            onClick={toggleFollow}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : isFollowing ? "Following" : "Follow"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
