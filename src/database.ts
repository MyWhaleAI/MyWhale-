import { createClient } from "@supabase/supabase-js"
import { config } from "./config"
import type { WalletEvent } from "./types"

// Create Supabase client
const supabase = createClient(config.supabase.url, config.supabase.anonKey)

/**
 * Fetches active whale wallets from the database
 */
export async function getWhaleWallets(): Promise<string[]> {
  try {
    const { data, error } = await supabase.from(config.tables.whaleWallets).select("address").eq("is_active", true)

    if (error) {
      throw error
    }

    return data.map((wallet) => wallet.address)
  } catch (error) {
    console.error("Error fetching whale wallets:", error)
    return []
  }
}

/**
 * Stores wallet events in the database
 */
export async function storeWalletEvents(events: WalletEvent[]): Promise<void> {
  if (events.length === 0) return

  try {
    const { error } = await supabase.from(config.tables.walletEvents).insert(events)

    if (error) {
      throw error
    }

    console.log(`Successfully stored ${events.length} wallet events`)
  } catch (error) {
    console.error("Error storing wallet events:", error)
  }
}
