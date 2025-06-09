import { getMonitoredWallets } from './supabaseClient';
import { HeliusWsManager } from './heliusWsManager';

async function main() {
  console.log('Starting Helius WebSocket client service...');
  const initialWallets = await getMonitoredWallets();
  if (initialWallets.length === 0) {
    console.warn('No approved whale applications found to monitor. Service will run but monitor no addresses initially.');
  } else {
    console.log(`Found ${initialWallets.length} wallets to monitor:`, initialWallets.map(w => w.wallet_address));
  }

  const wsManager = new HeliusWsManager(initialWallets);

  setInterval(async () => {
    console.log('Refreshing monitored wallets list...');
    const currentWallets = await getMonitoredWallets();
    await wsManager.updateMonitoredWallets(currentWallets);
  }, 60 * 60 * 1000);
}

main().catch(error => {
  console.error('Unhandled error in Helius WebSocket client service:', error);
  process.exit(1);
});