"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

/**
 * Follow a whale
 */
export async function followWhale(followerAddress: string, whaleAddress: string) {
  try {
    const supabase = createClient()

    // Check if follower exists
    const { data: existingFollower } = await supabase
      .from("followers")
      .select("id, followed_whales")
      .eq("wallet_address", followerAddress)
      .single()

    if (existingFollower) {
      // Add whale to followed_whales if not already following
      const followedWhales = existingFollower.followed_whales || []

      if (!followedWhales.includes(whaleAddress)) {
        const { error } = await supabase
          .from("followers")
          .update({
            followed_whales: [...followedWhales, whaleAddress],
            last_active: new Date().toISOString(),
          })
          .eq("wallet_address", followerAddress)

        if (error) throw error

        // Increment the whale's followers count
        await incrementWhaleFollowersCount(whaleAddress)
      }
    } else {
      // Create new follower with the whale in followed_whales
      const { error } = await supabase.from("followers").insert({
        wallet_address: followerAddress,
        followed_whales: [whaleAddress],
        created_at: new Date().toISOString(),
        last_active: new Date().toISOString(),
      })

      if (error) throw error

      // Increment the whale's followers count
      await incrementWhaleFollowersCount(whaleAddress)
    }

    revalidatePath("/whales")
    revalidatePath(`/whale/${whaleAddress}`)
    revalidatePath("/dashboard")

    return { success: true }
  } catch (error) {
    console.error("Error following whale:", error)
    return { success: false, error: "Failed to follow whale" }
  }
}

/**
 * Unfollow a whale
 */
export async function unfollowWhale(followerAddress: string, whaleAddress: string) {
  try {
    const supabase = createClient()

    // Get current followed whales
    const { data: follower } = await supabase
      .from("followers")
      .select("followed_whales")
      .eq("wallet_address", followerAddress)
      .single()

    if (follower && follower.followed_whales) {
      // Remove whale from followed_whales
      const updatedFollowedWhales = follower.followed_whales.filter((address: string) => address !== whaleAddress)

      // Update the follower record
      const { error } = await supabase
        .from("followers")
        .update({
          followed_whales: updatedFollowedWhales,
          last_active: new Date().toISOString(),
        })
        .eq("wallet_address", followerAddress)

      if (error) throw error

      // Decrement the whale's followers count
      await decrementWhaleFollowersCount(whaleAddress)
    }

    revalidatePath("/whales")
    revalidatePath(`/whale/${whaleAddress}`)
    revalidatePath("/dashboard")

    return { success: true }
  } catch (error) {
    console.error("Error unfollowing whale:", error)
    return { success: false, error: "Failed to unfollow whale" }
  }
}

/**
 * Check if a user is following a specific whale
 */
export async function isFollowingWhale(followerAddress: string, whaleAddress: string) {
  try {
    const supabase = createClient()

    const { data: follower } = await supabase
      .from("followers")
      .select("followed_whales")
      .eq("wallet_address", followerAddress)
      .single()

    if (follower && follower.followed_whales) {
      return {
        isFollowing: follower.followed_whales.includes(whaleAddress),
        success: true,
      }
    }

    return { isFollowing: false, success: true }
  } catch (error) {
    console.error("Error checking follow status:", error)
    return { isFollowing: false, success: false, error: "Failed to check follow status" }
  }
}

/**
 * Get all whales a user is following
 */
export async function getFollowedWhales(followerAddress: string) {
  try {
    const supabase = createClient()

    const { data: follower } = await supabase
      .from("followers")
      .select("followed_whales")
      .eq("wallet_address", followerAddress)
      .single()

    if (follower && follower.followed_whales) {
      return {
        followedWhales: follower.followed_whales,
        success: true,
      }
    }

    return { followedWhales: [], success: true }
  } catch (error) {
    console.error("Error getting followed whales:", error)
    return { followedWhales: [], success: false, error: "Failed to get followed whales" }
  }
}

/**
 * Increment a whale's followers count
 */
async function incrementWhaleFollowersCount(whaleAddress: string) {
  try {
    const supabase = createClient()

    // Get current followers count
    const { data: whale } = await supabase
      .from("whale_applications")
      .select("followers_count")
      .eq("wallet_address", whaleAddress)
      .single()

    const currentCount = whale?.followers_count || 0

    // Update followers count
    await supabase
      .from("whale_applications")
      .update({ followers_count: currentCount + 1 })
      .eq("wallet_address", whaleAddress)

    return true
  } catch (error) {
    console.error("Error incrementing followers count:", error)
    return false
  }
}

/**
 * Decrement a whale's followers count
 */
async function decrementWhaleFollowersCount(whaleAddress: string) {
  try {
    const supabase = createClient()

    // Get current followers count
    const { data: whale } = await supabase
      .from("whale_applications")
      .select("followers_count")
      .eq("wallet_address", whaleAddress)
      .single()

    const currentCount = whale?.followers_count || 0

    // Update followers count (ensure it doesn't go below 0)
    await supabase
      .from("whale_applications")
      .update({ followers_count: Math.max(0, currentCount - 1) })
      .eq("wallet_address", whaleAddress)

    return true
  } catch (error) {
    console.error("Error decrementing followers count:", error)
    return false
  }
}
