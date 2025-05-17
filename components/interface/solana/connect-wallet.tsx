"use client"

import { useSolana } from "@/providers/solana-provider"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"


export function ConnectWalletButton() {
  const { connected, walletAddress } = useSolana()

  return (
    <div className="flex items-center gap-2">
      {connected && walletAddress && (
        <div className="text-sm text-muted-foreground mr-2">
          {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
        </div>
      )}
      <WalletMultiButton className="wallet-adapter-button-trigger" />
    </div>
  )
}
