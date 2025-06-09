"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { useToast } from "@/hooks/use-toast"
import { followWhale, unfollowWhale, isFollowingWhale } from "@/app/actions/follow-actions"

export function useFollow(whaleAddress: string) {
  const { publicKey, connected } = useWallet()
  const { toast } = useToast()
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Check initial follow status when component mounts or wallet changes
  useEffect(() => {
    const checkFollowStatus = async () => {
      if (connected && publicKey && whaleAddress) {
        setIsLoading(true)
        try {
          const result = await isFollowingWhale(publicKey.toString(), whaleAddress)
          if (result.success) {
            setIsFollowing(result.isFollowing)
          }
        } catch (error) {
          console.error("Error checking follow status:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    checkFollowStatus()
  }, [connected, publicKey, whaleAddress])

  const toggleFollow = async () => {
    if (!connected || !publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to follow whales",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const followerAddress = publicKey.toString()

      if (isFollowing) {
        // Unfollow
        const result = await unfollowWhale(followerAddress, whaleAddress)
        if (result.success) {
          setIsFollowing(false)
          toast({
            title: "Unfollowed",
            description: "You are no longer following this whale",
          })
        } else {
          throw new Error(result.error || "Failed to unfollow")
        }
      } else {
        // Follow
        const result = await followWhale(followerAddress, whaleAddress)
        if (result.success) {
          setIsFollowing(true)
          toast({
            title: "Following",
            description: "You are now following this whale",
          })
        } else {
          throw new Error(result.error || "Failed to follow")
        }
      }
    } catch (error) {
      console.error("Error toggling follow:", error)
      toast({
        title: "Error",
        description: "Failed to update follow status",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isFollowing,
    isLoading,
    toggleFollow,
  }
}
