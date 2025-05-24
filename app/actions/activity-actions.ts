"use server"

import { cookies } from "next/headers"
import { createServerClient } from "@/lib/supabase/server"

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

export async function getFollowedWhalesActivity(followerAddress: string, limit = 10) {
  try {
    const supabase = getSupabaseClient()

    const { data: followerData, error: followerError } = await supabase
      .from("followers")
      .select("followed_whales")
      .eq("wallet_address", followerAddress)
      .single()

    if (followerError) {
      if (followerError.code === "PGRST116") {
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
      return getSampleTransactions()
    }

    const followedWhales = followerData?.followed_whales || []

    if (followedWhales.length === 0) {
      return getSampleTransactions()
    }

    const { data: transactions, error: transactionsError } = await supabase
      .from("whale_transactions")
      .select("*")
      .in("wallet_address", followedWhales)
      .order("timestamp", { ascending: false })
      .limit(limit)

    if (transactionsError) {
      return getSampleTransactions()
    }

    if (transactions.length === 0) {
      return getSampleTransactions()
    }

    const uniqueWhaleAddresses = [...new Set(transactions.map((tx) => tx.wallet_address))]

    const { data: whales, error: whalesError } = await supabase
      .from("whale_applications")
      .select("wallet_address, display_name, avatar_url, avatar_color")
      .in("wallet_address", uniqueWhaleAddresses)

    if (whalesError) {
      console.error("Error fetching whale information:", whalesError)
    }

    const whaleInfoMap = (whales || []).reduce((map, whale) => {
      map[whale.wallet_address] = whale
      return map
    }, {} as Record<string, any>)

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

export async function saveTransaction(transaction: {
  wallet_address: string
  action: string
  value: string
  platform: string
  timestamp: string
  ai_summary?: string
  signature: string
}) {
  const supabase = getSupabaseClient()
  const { error } = await supabase.from("whale_transactions").insert([transaction])
  if (error) {
    console.error("Failed to save transaction:", error)
  }
  return !error
}

function getSampleTransactions() {
  return [
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
}

export async function getDashboardStats(walletAddress: string) {
  try {
    const supabase = getSupabaseClient()

    const { data: followerData } = await supabase
      .from("followers")
      .select("followed_whales")
      .eq("wallet_address", walletAddress)
      .single()

    const followedWhales = followerData?.followed_whales?.length || 0

    const { count: totalWhalesCount } = await supabase
      .from("whale_applications")
      .select("*", { count: "exact", head: true })
      .eq("status", "approved")

    const totalWhales = totalWhalesCount || 0

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const { count: recentTransactionsCount } = await supabase
      .from("whale_transactions")
      .select("*", { count: "exact", head: true })
      .gte("timestamp", twentyFourHoursAgo)

    const recentTransactions = recentTransactionsCount || 0

    return { followedWhales, totalWhales, recentTransactions }
  } catch (error) {
    console.error("Error in getDashboardStats:", error)
    return { followedWhales: 0, totalWhales: 0, recentTransactions: 0 }
  }
}

function formatTimeAgo(timestamp: string) {
  const now = Date.now()
  const diffMs = now - new Date(timestamp).getTime()

  if (diffMs < 60000) return `${Math.floor(diffMs / 1000)}s ago`
  if (diffMs < 3600000) return `${Math.floor(diffMs / 60000)}m ago`
  if (diffMs < 86400000) return `${Math.floor(diffMs / 3600000)}h ago`
  return `${Math.floor(diffMs / 86400000)}d ago`
}
