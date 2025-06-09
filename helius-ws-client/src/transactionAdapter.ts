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

export interface AppTransaction {
  wallet_address: string;
  action: string;
  value: string | number | null;
  platform: string;
  timestamp: number;
  ai_summary: string | null;
  signature: string;
}

export function adaptHeliusTransaction(
  heliusTx: HeliusEnrichedTransaction,
  monitoredWalletAddress: string
): AppTransaction | null {
  try {
    let isMonitoredAddressInvolved = false;
    if (heliusTx.accountData?.some(ad => ad.account === monitoredWalletAddress)) {
      isMonitoredAddressInvolved = true;
    }

    if (!isMonitoredAddressInvolved && !heliusTx.description?.includes(monitoredWalletAddress)) {
      return null;
    }

    const action = heliusTx.type || 'UNKNOWN';
    const platform = heliusTx.source || 'UNKNOWN';
    let value: string | number | null = null;

    if (heliusTx.tokenTransfers && heliusTx.tokenTransfers.length > 0) {
      const relevantTransfer = heliusTx.tokenTransfers.find(
        t => t.fromUserAccount === monitoredWalletAddress || t.toUserAccount === monitoredWalletAddress
      ) || heliusTx.tokenTransfers[0];
      value = relevantTransfer.amount ?? null;
    } else if (heliusTx.nativeTransfers && heliusTx.nativeTransfers.length > 0) {
      const relevantTransfer = heliusTx.nativeTransfers.find(
        t => t.fromUserAccount === monitoredWalletAddress || t.toUserAccount === monitoredWalletAddress
      ) || heliusTx.nativeTransfers[0];
      value = relevantTransfer.amount ?? null;
    }

    const ai_summary = heliusTx.description || null;

    return {
      wallet_address: monitoredWalletAddress,
      action,
      value,
      platform,
      timestamp: heliusTx.timestamp,
      ai_summary,
      signature: heliusTx.signature,
    };
  } catch (error) {
    console.error("Error adapting Helius transaction:", error, heliusTx);
    return null;
  }
}
