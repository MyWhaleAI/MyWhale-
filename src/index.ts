import cron from "node-cron"
import { config } from "./config"
import { trackWhaleWallets } from "./tracker"

// Main function
async function main() {
  console.log("Starting Solana whale tracker...")
  console.log(`Using RPC endpoint: ${config.solana.rpcEndpoint}`)

  // Initial tracking run
  await trackWhaleWallets()

  // Set up scheduled tracking
  if (config.cron.enabled) {
    console.log(`Setting up cron job with schedule: ${config.cron.schedule}`)
    cron.schedule(config.cron.schedule, async () => {
      console.log("Running scheduled tracking...")
      await trackWhaleWallets()
    })
  } else {
    console.log(`Setting up interval tracking every ${config.tracking.interval}ms`)
    setInterval(async () => {
      console.log("Running interval tracking...")
      await trackWhaleWallets()
    }, config.tracking.interval)
  }
}

// Run the main function
main().catch((error) => {
  console.error("Fatal error:", error)
  process.exit(1)
})
