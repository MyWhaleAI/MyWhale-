import WebSocket from 'ws';
import { config } from './config';
import { adaptHeliusTransaction } from './transactionAdapter';
import { sendTransactionToNextApp } from './apiClient';
import { MonitoredWallet, WhaleStrategies } from './supabaseClient';

interface HeliusEnrichedTransaction {
  timestamp: number;
  signature: string;
  type?: string;
  source?: string;
  tokenTransfers?: { amount?: number; fromUserAccount?: string; toUserAccount?: string; mint?: string }[];
  nativeTransfers?: { amount?: number; fromUserAccount?: string; toUserAccount?: string }[];
  accountData?: { account: string }[];
  description?: string;
}

interface SubscriptionDetail {
  walletAddress: string;
  heliusSubscriptionId?: string;
  preferences?: WhaleStrategies | null;
}

export class HeliusWsManager {
  private ws: WebSocket | null = null;
  private monitoredWallets: Map<string, SubscriptionDetail> = new Map();
  private reconnectInterval = 5000;
  private pingIntervalId: NodeJS.Timeout | null = null;
  private readonly pingTimeout = 30000 + 1000;

  constructor(initialWallets: MonitoredWallet[]) {
    initialWallets.forEach(w => {
      this.monitoredWallets.set(w.wallet_address, {
        walletAddress: w.wallet_address,
        preferences: w.strategies,
      });
    });
    this.connect();
  }

  private connect() {
    console.log(`Attempting to connect to Helius WebSocket at ${config.heliusRpcWsUrl}...`);
    this.ws = new WebSocket(config.heliusRpcWsUrl);

    this.ws.on('open', () => {
      console.log('Connected to Helius WebSocket.');
      this.subscribeToWallets();
      this.startPing();
    });

    this.ws.on('message', (data: WebSocket.Data) => {
      try {
        const message = JSON.parse(data.toString());
        if (message.method === 'enrichedTransactionSubscribe' && message.result !== undefined) {
          console.log('Subscription confirmation result (Helius internal ID):', message.result, 'Our request ID:', message.id);
        } else if (message.params && message.params.result) {
          const heliusTx: HeliusEnrichedTransaction = message.params.result;
          console.log('Received Helius Transaction:', JSON.stringify(heliusTx, null, 2));

          this.monitoredWallets.forEach(subDetail => {
            let involved = false;
            if (heliusTx.accountData?.some((ad: any) => ad.account === subDetail.walletAddress)) involved = true;
            if (!involved && heliusTx.tokenTransfers?.some((tt: any) => tt.fromUserAccount === subDetail.walletAddress || tt.toUserAccount === subDetail.walletAddress)) involved = true;
            if (!involved && heliusTx.nativeTransfers?.some((nt: any) => nt.fromUserAccount === subDetail.walletAddress || nt.toUserAccount === subDetail.walletAddress)) involved = true;

            if (involved) {
                const appTransaction = adaptHeliusTransaction(heliusTx, subDetail.walletAddress);
                if (appTransaction) {
                    sendTransactionToNextApp(appTransaction);
                }
            }
          });
        }
      } catch (error) {
        console.error('Error processing Helius message:', error, data.toString());
      }
    });

    this.ws.on('error', (error: Error) => {
      console.error('Helius WebSocket error:', error.message);
    });

    this.ws.on('close', (code: number, reason: Buffer) => {
      console.log(`Helius WebSocket closed. Code: ${code}, Reason: ${reason.toString()}. Reconnecting in ${this.reconnectInterval / 1000}s...`);
      this.stopPing();
      if (this.ws) {
        this.ws.removeAllListeners();
      }
      this.ws = null;
      setTimeout(() => this.connect(), this.reconnectInterval);
    });
  }

  private subscribeToWallets() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.monitoredWallets.forEach((subDetail, walletAddress) => {
        const transactionTypesForSubscription = ["ANY"];
        const subscriptionRequestId = `sub-${walletAddress}-${Date.now()}`;
        const subscribeMsg = {
          jsonrpc: '2.0',
          id: subscriptionRequestId,
          method: 'enrichedTransactionSubscribe',
          params: {
            account: [walletAddress],
            webhookType: "enhanced",
            transactionTypes: transactionTypesForSubscription,
          },
        };
        console.log(`Subscribing to enriched transactions for ${walletAddress} (ID: ${subscriptionRequestId})`);
        // @ts-ignore
        this.ws.send(JSON.stringify(subscribeMsg));
      });
    } else {
      console.error('WebSocket not open. Cannot subscribe.');
    }
  }

  private startPing() {
    this.stopPing();
    this.pingIntervalId = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.ping(() => {});
      }
    }, this.pingTimeout / 2);
  }

  private stopPing() {
    if (this.pingIntervalId) {
      clearInterval(this.pingIntervalId);
      this.pingIntervalId = null;
    }
  }

  public async updateMonitoredWallets(newWallets: MonitoredWallet[]) {
    const newWalletsMap = new Map<string, SubscriptionDetail>();
    newWallets.forEach(w => newWalletsMap.set(w.wallet_address, {
        walletAddress: w.wallet_address,
        preferences: w.strategies
    }));

    const walletsToUnsubscribeAddresses: string[] = [];
    this.monitoredWallets.forEach((_subDetail, walletAddress) => {
      if (!newWalletsMap.has(walletAddress)) {
        walletsToUnsubscribeAddresses.push(walletAddress);
        console.log(`(Placeholder) Wallet ${walletAddress} removed. Need to unsubscribe if Helius subscription ID was stored.`);
      }
    });

    walletsToUnsubscribeAddresses.forEach(addr => this.monitoredWallets.delete(addr));

    const walletsToSubscribeDetails: MonitoredWallet[] = [];
    newWalletsMap.forEach((subDetail, walletAddress) => {
      if (!this.monitoredWallets.has(walletAddress)) {
        walletsToSubscribeDetails.push({ wallet_address: walletAddress, strategies: subDetail.preferences });
        this.monitoredWallets.set(walletAddress, subDetail);
      } else {
        const existingSub = this.monitoredWallets.get(walletAddress)!;
        if (JSON.stringify(existingSub.preferences) !== JSON.stringify(subDetail.preferences)) {
            existingSub.preferences = subDetail.preferences;
            console.log(`Preferences changed for ${walletAddress}. (Placeholder) Re-subscription with new transaction types might be needed.`);
        }
      }
    });

    if (walletsToSubscribeDetails.length > 0 && this.ws && this.ws.readyState === WebSocket.OPEN) {
        console.log("New wallets to subscribe:", walletsToSubscribeDetails.map(w => w.wallet_address));
        walletsToSubscribeDetails.forEach(wDetail => {
             const transactionTypesForSubscription = ["ANY"];
             const subscriptionRequestId = `sub-${wDetail.wallet_address}-${Date.now()}`;
             this.ws!.send(JSON.stringify({
                jsonrpc: '2.0',
                id: subscriptionRequestId,
                method: 'enrichedTransactionSubscribe',
                params: { account: [wDetail.wallet_address], webhookType: "enhanced", transactionTypes: transactionTypesForSubscription },
             }));
             console.log(`Subscribing to new wallet ${wDetail.wallet_address} (ID: ${subscriptionRequestId})`);
        });
    }
  }
}