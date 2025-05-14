"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Define default preferences with all alerts set to true
const DEFAULT_PREFERENCES = {
  alerts: {
    buys: true,
    mints: true,
    staking: true,
    governance: true,
  },
  delivery: {
    email: true,
    telegram: true,
    sms: false,
  },
  timeSettings: {
    timezone: "UTC (GMT+0)",
    frequency: "Real-time",
  },
}

export async function addFollower(walletAddress: string) {
  try {
    const supabase = createClient()

    // Check if follower already exists
    const { data: existingFollower } = await supabase
      .from("followers")
      .select("id")
      .eq("wallet_address", walletAddress)
      .single()

    if (existingFollower) {
      // Update last_active timestamp for existing follower
      const { error: updateError } = await supabase
        .from("followers")
        .update({ last_active: new Date().toISOString() })
        .eq("wallet_address", walletAddress)

      if (updateError) throw updateError
    } else {
      // Add new follower with all preferences set to true by default
      const { error: insertError } = await supabase.from("followers").insert({
        wallet_address: walletAddress,
        created_at: new Date().toISOString(),
        last_active: new Date().toISOString(),
        notification_preferences: DEFAULT_PREFERENCES,
      })

      if (insertError) throw insertError
    }

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error adding follower:", error)
    return { success: false, error: "Failed to add follower" }
  }
}

export async function getFollowerCount() {
  try {
    const supabase = createClient()
    const { count, error } = await supabase.from("followers").select("*", { count: "exact", head: true })

    if (error) throw error

    return { count: count || 0 }
  } catch (error) {
    console.error("Error getting follower count:", error)
    return { count: 0 }
  }
}

export async function getFollowerPreferences(walletAddress: string) {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("followers")
      .select("notification_preferences")
      .eq("wallet_address", walletAddress)
      .single()

    if (error) throw error

    // Ensure we have complete preferences with defaults for missing values
    const preferences = data?.notification_preferences || {}

    return {
      success: true,
      preferences: {
        alerts: {
          buys: preferences.alerts?.buys ?? true,
          mints: preferences.alerts?.mints ?? true,
          staking: preferences.alerts?.staking ?? true,
          governance: preferences.alerts?.governance ?? true,
        },
        delivery: {
          email: preferences.delivery?.email ?? true,
          telegram: preferences.delivery?.telegram ?? true,
          sms: preferences.delivery?.sms ?? false,
        },
        timeSettings: {
          timezone: preferences.timeSettings?.timezone ?? "UTC (GMT+0)",
          frequency: preferences.timeSettings?.frequency ?? "Real-time",
        },
      },
    }
  } catch (error) {
    console.error("Error getting follower preferences:", error)
    return {
      success: false,
      error: "Failed to get preferences",
      preferences: DEFAULT_PREFERENCES,
    }
  }
}

export async function updateFollowerPreferences(walletAddress: string, preferences: any) {
  try {
    const supabase = createClient()

    // Ensure we have complete preferences with defaults for missing values
    const safePreferences = {
      alerts: {
        buys: preferences?.alerts?.buys ?? true,
        mints: preferences?.alerts?.mints ?? true,
        staking: preferences?.alerts?.staking ?? true,
        governance: preferences?.alerts?.governance ?? true,
      },
      delivery: {
        email: preferences?.delivery?.email ?? true,
        telegram: preferences?.delivery?.telegram ?? true,
        sms: preferences?.delivery?.sms ?? false,
      },
      timeSettings: {
        timezone: preferences?.timeSettings?.timezone ?? "UTC (GMT+0)",
        frequency: preferences?.timeSettings?.frequency ?? "Real-time",
      },
    }

    // Check if follower exists
    const { data: existingFollower } = await supabase
      .from("followers")
      .select("id")
      .eq("wallet_address", walletAddress)
      .single()

    if (!existingFollower) {
      // Add new follower with preferences
      const { error: insertError } = await supabase.from("followers").insert({
        wallet_address: walletAddress,
        created_at: new Date().toISOString(),
        last_active: new Date().toISOString(),
        notification_preferences: safePreferences,
      })

      if (insertError) throw insertError
    } else {
      // Update existing follower preferences
      const { error: updateError } = await supabase
        .from("followers")
        .update({
          notification_preferences: safePreferences,
          last_active: new Date().toISOString(),
        })
        .eq("wallet_address", walletAddress)

      if (updateError) throw updateError
    }

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error updating follower preferences:", error)
    return { success: false, error: "Failed to update preferences" }
  }
}
