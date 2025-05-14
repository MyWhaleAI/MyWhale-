import { Connection, PublicKey } from "@solana/web3.js"
import { config } from "./config"
import { getWhaleWallets, storeWalletEvents } from "./database"
import { fetchAndParseTransactions } from "./solana"
import type { WalletEvent } from "./types"

/**
 * Tracks transactions for whale wallets
 */
export async function trackWhaleWallets(): Promise<void> {
  try {
    // Create Solana connection
    const connection = new Connection(config.solana.rpcEndpoint, "confirmed")

    // Fetch whale wallets from database
    const whaleWallets = await getWhaleWallets()

    if (whaleWallets.length === 0) {
      console.log("No active whale wallets found in the database")
      return
    }

    console.log(`Tracking ${whaleWallets.length} whale wallets...`)

    // Process each wallet
    const allEvents: WalletEvent[] = []

    for (const walletAddress of whaleWallets) {
      try {
        const publicKey = new PublicKey(walletAddress)

        // Fetch and parse transactions
        const events = await fetchAndParseTransactions(connection, publicKey, config.tracking.transactionsPerBatch)

        if (events.length > 0) {
          allEvents.push(...events)
          console.log(`Found ${events.length} events for wallet ${walletAddress}`)
        }
      } catch (error) {
        console.error(`Error processing wallet ${walletAddress}:`, error)
      }
    }

    // Store events in database
    if (allEvents.length > 0) {
      await storeWalletEvents(allEvents)
    } else {
      console.log("No new events found for tracked wallets")
    }
  } catch (error) {
    console.error("Error tracking whale wallets:", error)
  }
}
