import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from './config';

let supabase: SupabaseClient;

export function getSupabaseClient(): SupabaseClient {
  if (!supabase) {
    if (!config.supabaseUrl || !config.supabaseServiceKey) {
      throw new Error("Supabase URL or Service Key is not configured.");
    }
    supabase = createClient(config.supabaseUrl, config.supabaseServiceKey);
  }
  return supabase;
}

export type WhaleStrategies = {
  defi?: boolean;
  nft?: boolean;
  yield?: boolean;
  staking?: boolean;
  dao?: boolean;
  meme?: boolean;
};

export interface MonitoredWallet {
  wallet_address: string;
  strategies?: WhaleStrategies | null;
}

export async function getMonitoredWallets(): Promise<MonitoredWallet[]> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('whale_applications')
    .select('wallet_address, strategies')
    .eq('status', 'approved');

  if (error) {
    console.error('Error fetching monitored wallets:', error.message);
    return [];
  }
  return data || [];
}