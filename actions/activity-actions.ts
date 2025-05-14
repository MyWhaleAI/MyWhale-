"use server"

import { cookies } from "next/headers"
import { createServerClient } from "@/lib/supabase/server"

// Function to get Supabase client
function getSupabaseClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        },
        set(name, value, options) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name, options) {
          cookieStore.set({ name, value: "", ...options })
        },
      },
    },
  )
}

// Get recent activity from followed whales
export async function getFollowedWhalesActivity(followerAddress: string, limit = 10) {
  try {
    console.log(`Fetching activity for follower: ${followerAddress}`)
    const supabase = getSupabaseClient()

    // First, get the list of whales the user follows
    const { data: followerData, error: followerError } = await supabase
      .from("followers")
      .select("followed_whales")
      .eq("wallet_address", followerAddress)
      .single()

    if (followerError) {
      console.error("Error fetching followed whales:", followerError)

      // If the follower doesn't exist yet, create a record with empty followed_whales
      if (followerError.code === "PGRST116") {
        console.log("Follower not found, creating new record")
        const { error: insertError } = await supabase.from("followers").insert({
          wallet_address: followerAddress,
          followed_whales: [],
          notification_preferences: {
            alerts: {
              buys: true,
              mints: true,
              staking: true,
              governance: true,
            },
            delivery: {
              email: true,
              telegram: false,
              sms: false,
            },
            time: {
              timezone: "UTC",
              frequency: "immediate",
            },
          },
        })

        if (insertError) {
          console.error("Error creating follower record:", insertError)
        }
      }

      // Return sample data since there are no followed whales
      return getSampleTransactions()
    }

    const followedWhales = followerData?.followed_whales || []
    console.log(`Found ${followedWhales.length} followed whales`)

    if (followedWhales.length === 0) {
      console.log("No followed whales, returning sample data")
      return getSampleTransactions()
    }

    // Then, get recent transactions from those whales
    const { data: transactions, error: transactionsError } = await supabase
      .from("whale_transactions")
      .select("*")
      .in("wallet_address", followedWhales)
      .order("timestamp", { ascending: false })
      .limit(limit)

    if (transactionsError) {
      console.error("Error fetching whale transactions:", transactionsError)
      return getSampleTransactions()
    }

    console.log(`Found ${transactions.length} transactions`)

    if (transactions.length === 0) {
      console.log("No transactions found, returning sample data")
      return getSampleTransactions()
    }

    // Get unique whale addresses from transactions
    const uniqueWhaleAddresses = [...new Set(transactions.map((tx) => tx.wallet_address))]

    // Fetch whale information separately
    const { data: whales, error: whalesError } = await supabase
      .from("whale_applications")
      .select("wallet_address, display_name, avatar_url, avatar_color")
      .in("wallet_address", uniqueWhaleAddresses)

    if (whalesError) {
      console.error("Error fetching whale information:", whalesError)
    }

    // Create a map of whale addresses to their information
    const whaleInfoMap = (whales || []).reduce((map, whale) => {
      map[whale.wallet_address] = whale
      return map
    }, {})

    // Format the transactions for the UI
    return transactions.map((tx) => {
      const whaleInfo = whaleInfoMap[tx.wallet_address] || {}
      const displayName =
        whaleInfo.display_name ||
        `Whale ${tx.wallet_address.substring(0, 4)}...${tx.wallet_address.substring(tx.wallet_address.length - 4)}`
      const avatarUrl = whaleInfo.avatar_url
      const avatarColor = whaleInfo.avatar_color || "bg-purple-500"
      const avatarInitial = displayName.charAt(0).toUpperCase()

      return {
        id: tx.id,
        whale: displayName,
        whaleAddress: tx.wallet_address,
        action: tx.action,
        token: tx.value,
        platform: tx.platform,
        time: formatTimeAgo(tx.timestamp),
        insight: tx.ai_summary || "No AI insight available",
        avatar: avatarInitial,
        avatarColor,
        avatarUrl,
        signature: tx.signature,
        isSample: false,
      }
    })
  } catch (error) {
    console.error("Error in getFollowedWhalesActivity:", error)
    return getSampleTransactions()
  }
}

// Helper function to get sample transactions
function getSampleTransactions() {
  const sampleTransactions = [
    {
      id: "sample-1",
      whale: "DeFi Whale",
      whaleAddress: "8JUjWjGZ5SRECsJnHTWmUh7FE9hJeC3PGNw3UvhKnLwk",
      action: "Swapped USDC → SOL",
      token: "$50,000",
      platform: "Jupiter",
      time: "5m ago",
      insight: "Accumulating SOL ahead of major protocol launch",
      avatar: "D",
      avatarColor: "bg-blue-500",
      signature: "5UfDuX9A2ysA3dUXUxRuCjk6q5AET9A9XU5qP9ojQMZCZYe1mDvCZ4mZEFoNJyGFQGmGLrVW9fNqW9WJ2yhGK5Aa",
      isSample: true,
    },
    {
      id: "sample-2",
      whale: "NFT Collector",
      whaleAddress: "3FZbgi6VSKQZ4dZkTjV3T7wXnp9o5edXWwt7ZbsqNyVG",
      action: "Minted 5 NFTs",
      token: "DeGods",
      platform: "Magic Eden",
      time: "15m ago",
      insight: "Consistent collector of blue-chip NFTs",
      avatar: "N",
      avatarColor: "bg-purple-500",
      signature: "4Hvkp8f85MQbKVJxWLJ9WDgEfm5NyGUJ9uTgbSsxBZh5H5JGQgwSX2QRpSMpMK7R5qwrKgfKuZJD7DvjkEQQBCwb",
      isSample: true,
    },
    {
      id: "sample-3",
      whale: "Staking Pro",
      whaleAddress: "7NsngNMtXJNdHgeK4znQDZ5iE6LHNEhnoHx5WJCTQ5h6",
      action: "Staked 10,000 SOL",
      token: "Marinade",
      platform: "Marinade Finance",
      time: "1h ago",
      insight: "Long-term holder increasing staked position",
      avatar: "S",
      avatarColor: "bg-emerald-500",
      signature: "5xJGVBNfTrA1UtmyJsNLMYWxw3hyMqHZhZGXLpMzJFew9hcr5LaCZuqjXyYMaqWGDHBHjGUNBGFLZM8x5MRJVSbZ",
      isSample: true,
    },
    {
      id: "sample-4",
      whale: "Governance Voter",
      whaleAddress: "9H9ZgEANZV5qz9UUK8DUHwLrMnuJPzK7cuTrH2qENrEb",
      action: "Voted on Proposal",
      token: "Realms DAO",
      platform: "Realms",
      time: "3h ago",
      insight: "Active governance participant across multiple DAOs",
      avatar: "G",
      avatarColor: "bg-amber-500",
      signature: "2JYJ3KHtE79LxsYPTgKZCsJJNNGRrXmTPHqLNs59JNgZCsuNLFHxvvuVjSJsYYWmCGFnVvr8NkLmh1aUwZQeGmvd",
      isSample: true,
    },
    {
      id: "sample-5",
      whale: "Liquidity Provider",
      whaleAddress: "6LUFae1Ap44VYHxCd1X4JkMzXBNcPn3KqZ8oxCBrQrGD",
      action: "Added Liquidity",
      token: "SOL/USDC",
      platform: "Raydium",
      time: "5h ago",
      insight: "Strategic LP positioning before market volatility",
      avatar: "L",
      avatarColor: "bg-red-500",
      signature: "4GyLFCjKCXXGqAKfE9rrS9UNhRQnUAm5sBQjvpJPHQe9QYAqydf3mxyYKRMQzgUxqs3ViLBvgR6kEYGEeqhFSfxW",
      isSample: true,
    },
  ]

  return sampleTransactions
}

export async function getDashboardStats(walletAddress: string) {
  try {
    const supabase = getSupabaseClient()

    // Fetch the number of whales the user is tracking
    const { data: followerData } = await supabase
      .from("followers")
      .select("followed_whales")
      .eq("wallet_address", walletAddress)
      .single()

    const followedWhales = followerData?.followed_whales?.length || 0

    // Fetch the total number of approved whales
    const { count: totalWhalesCount } = await supabase
      .from("whale_applications")
      .select("*", { count: "exact", head: true })
      .eq("status", "approved")

    const totalWhales = totalWhalesCount || 0

    // Fetch the number of recent transactions (last 24 hours)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const { count: recentTransactionsCount } = await supabase
      .from("whale_transactions")
      .select("*", { count: "exact", head: true })
      .gte("timestamp", twentyFourHoursAgo)

    const recentTransactions = recentTransactionsCount || 0

    // Mock data for other stats (replace with actual database queries)
    const collateralRatio = "75%"
    const dailyEarning = "+$125.50"
    const liquidationPrice = "$85.00"
    const borrowBalance = "$5,000.00"
    const rewardsAPR = "4.5%"
    const pendingRewards = "0.05 SOL"

    return {
      whalesTracked: followedWhales,
      totalWhales: totalWhales,
      recentTransactions: recentTransactions,
      collateralRatio: collateralRatio,
      dailyEarning: dailyEarning,
      liquidationPrice: liquidationPrice,
      borrowBalance: borrowBalance,
      rewardsAPR: rewardsAPR,
      pendingRewards: pendingRewards,
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return {
      whalesTracked: 0,
      totalWhales: 0,
      recentTransactions: 0,
      collateralRatio: "0%",
      dailyEarning: "0%",
      liquidationPrice: "$0.00",
      borrowBalance: "$0.00",
      rewardsAPR: "0%",
      pendingRewards: "-",
    }
  }
}

// Helper function to format time ago
function formatTimeAgo(timestamp: string) {
  const date = new Date(timestamp)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return `${seconds}s ago`

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`

  const days = Math.floor(hours / 24)
  return `${days}d ago`
}
