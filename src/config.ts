import dotenv from "dotenv"
import { z } from "zod"

// Load environment variables
dotenv.config()

// Define environment variable schema
const envSchema = z.object({
  // Solana RPC
  SOLANA_RPC_ENDPOINT: z.string().default("https://api.devnet.solana.com"),
  RPC_MAX_RETRIES: z.coerce.number().default(3),
  RPC_RETRY_DELAY: z.coerce.number().default(1000),

  // Supabase
  SUPABASE_URL: z.string(),
  SUPABASE_ANON_KEY: z.string(),

  // Tracking
  TRANSACTIONS_PER_BATCH: z.coerce.number().default(10),
  TRACKING_INTERVAL: z.coerce.number().default(60000),

  // Table names
  WHALE_WALLETS_TABLE: z.string().default("whale_wallets"),
  WALLET_EVENTS_TABLE: z.string().default("wallet_events"),

  // Cron settings
  CRON_ENABLED: z.coerce.boolean().default(true),
  CRON_SCHEDULE: z.string().default("*/5 * * * *"),
})

// Parse and validate environment variables
const env = envSchema.parse(process.env)

// Export configuration
export const config = {
  solana: {
    rpcEndpoint: env.SOLANA_RPC_ENDPOINT,
    maxRetries: env.RPC_MAX_RETRIES,
    retryDelay: env.RPC_RETRY_DELAY,
  },
  supabase: {
    url: env.SUPABASE_URL,
    anonKey: env.SUPABASE_ANON_KEY,
  },
  tracking: {
    transactionsPerBatch: env.TRANSACTIONS_PER_BATCH,
    interval: env.TRACKING_INTERVAL,
  },
  tables: {
    whaleWallets: env.WHALE_WALLETS_TABLE,
    walletEvents: env.WALLET_EVENTS_TABLE,
  },
  cron: {
    enabled: env.CRON_ENABLED,
    schedule: env.CRON_SCHEDULE,
  },
}
