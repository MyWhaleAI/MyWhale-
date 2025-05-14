"use server"

import { createClient } from "@supabase/supabase-js"

// Create a singleton Supabase client for server actions
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables")
  }

  return createClient(supabaseUrl, supabaseKey)
}

export async function getApprovedWhales() {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from("whale_applications")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching approved whales:", error)
      return []
    }

    return data.map((whale) => ({
      id: whale.id,
      name: whale.display_name,
      avatar: whale.display_name?.charAt(0) || "W",
      avatarColor: whale.avatar_color || "bg-blue-500",
      avatarUrl: whale.avatar_url,
      roi: whale.roi || "+0%",
      followers: whale.followers_count?.toString() || "0",
      volume: whale.volume || "$0",
      tags: whale.tags || [],
      description: whale.bio || "",
      walletAddress: whale.wallet_address,
      twitter: whale.twitter,
      telegram: whale.telegram,
      strategies: whale.strategies || {},
      isFollowing: false, // We'll implement this later
    }))
  } catch (error) {
    console.error("Failed to fetch approved whales:", error)
    return []
  }
}

export async function getWhaleById(id: string) {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase.from("whale_applications").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching whale by ID:", error)
      return null
    }

    return {
      id: data.id,
      name: data.display_name,
      avatar: data.display_name?.charAt(0) || "W",
      avatarColor: data.avatar_color || "bg-blue-500",
      avatarUrl: data.avatar_url,
      roi: data.roi || "+0%",
      followers: data.followers_count?.toString() || "0",
      volume: data.volume || "$0",
      tags: data.tags || [],
      description: data.bio || "",
      walletAddress: data.wallet_address,
      twitter: data.twitter,
      telegram: data.telegram,
      strategies: data.strategies || {},
      isFollowing: false,
    }
  } catch (error) {
    console.error("Failed to fetch whale by ID:", error)
    return null
  }
}

export async function getWhaleByAddress(address: string) {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from("whale_applications")
      .select("*")
      .eq("wallet_address", address)
      .eq("status", "approved")
      .single()

    if (error) {
      console.error("Error fetching whale by address:", error)
      return null
    }

    return {
      id: data.id,
      name: data.display_name,
      avatar: data.display_name?.charAt(0) || "W",
      avatarColor: data.avatar_color || "bg-blue-500",
      avatarUrl: data.avatar_url,
      roi: data.roi || "+0%",
      followers: data.followers_count?.toString() || "0",
      volume: data.volume || "$0",
      tags: data.tags || [],
      description: data.bio || "",
      walletAddress: data.wallet_address,
      twitter: data.twitter,
      telegram: data.telegram,
      strategies: data.strategies || {},
      isFollowing: false,
    }
  } catch (error) {
    console.error("Failed to fetch whale by address:", error)
    return null
  }
}
