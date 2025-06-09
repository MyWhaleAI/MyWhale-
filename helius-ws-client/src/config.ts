import dotenv from 'dotenv';
dotenv.config();

export const config = {
  heliusApiKey: process.env.HELIUS_API_KEY,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  nextAppSaveEndpoint: process.env.NEXT_APP_SAVE_ENDPOINT || 'http://localhost:3000/api/internal/save-transaction',
  heliusRpcWsUrl: `wss://rpc.helius.xyz/?api-key=${process.env.HELIUS_API_KEY}`,
};

if (!config.heliusApiKey || !config.supabaseUrl || !config.supabaseServiceKey) {
  throw new Error("Missing critical environment variables (Helius API Key, Supabase URL/Service Key)");
}