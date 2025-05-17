"use client"

import { useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Twitter, MessageCircle, Copy, CheckCheck, Users, TrendingUp, BarChart2 } from "lucide-react"
import { truncateAddress } from "@/lib/utils"
import { useFollow } from "@/hooks/use-follow"

interface WhaleProfileHeaderProps {
  whale: any
}

export function WhaleProfileHeader({ whale }: WhaleProfileHeaderProps) {
  const { publicKey } = useWallet()
  const [copied, setCopied] = useState(false)

  // Use our custom hook for follow functionality
  const { isFollowing, isLoading, toggleFollow } = useFollow(whale.wallet_address)

  // Generate initials from display name with null checks
  const getInitials = () => {
    if (!whale || !whale.display_name) {
      // Use wallet address if no display name
      return whale?.wallet_address ? whale.wallet_address.substring(0, 2).toUpperCase() : "WH"
    }

    return whale.display_name
      .split("@")
      .join("")
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase()
  }

  const initials = getInitials()

  // Determine avatar background color based on display name with null check
  const avatarColors = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-emerald-500",
    "bg-amber-500",
    "bg-red-500",
    "bg-teal-500",
    "bg-pink-500",
    "bg-indigo-500",
  ]
  const avatarColor = avatarColors[(whale?.display_name?.length || 0) % avatarColors.length]

  const handleCopyAddress = () => {
    if (whale?.wallet_address) {
      navigator.clipboard.writeText(whale.wallet_address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Card className="bg-white border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar */}
          <div className={`w-24 h-24 rounded-xl ${avatarColor} flex items-center justify-center shrink-0`}>
            <span className="text-2xl font-bold text-white">{initials}</span>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{whale?.display_name || "Unknown Whale"}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-gray-500">
                    {whale?.wallet_address ? truncateAddress(whale.wallet_address, 8, 8) : "Address Unavailable"}
                  </span>
                  {whale?.wallet_address && (
                    <>
                      <button
                        onClick={handleCopyAddress}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        title="Copy address"
                      >
                        {copied ? <CheckCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </button>
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

              <Button
                onClick={toggleFollow}
                disabled={isLoading || !whale?.wallet_address}
                className={
                  isFollowing
                    ? "bg-gray-100 hover:bg-gray-200 text-gray-800"
                    : "bg-teal-500 hover:bg-teal-600 text-white"
                }
              >
                {isLoading ? "Loading..." : isFollowing ? "Following" : "Follow"}
              </Button>
            </div>

            {/* Bio */}
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
                        {key.charAt(0).toUpperCase() + key.slice(1)}
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

          {/* Stats */}
          <div className="flex flex-row md:flex-col gap-4 mt-2 md:mt-0">
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <div className="flex items-center justify-center gap-1 text-gray-500 text-xs mb-1">
                <Users className="h-3.5 w-3.5" />
                <span>Followers</span>
              </div>
              <div className="font-bold text-gray-800 text-lg">{whale?.followers_count || 0}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <div className="flex items-center justify-center gap-1 text-gray-500 text-xs mb-1">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>30d ROI</span>
              </div>
              <div className="font-bold text-emerald-600 text-lg">{whale?.roi || "+0%"}</div>
            </div>
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
  )
}
