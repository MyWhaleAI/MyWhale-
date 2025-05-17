"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { Connection, type PublicKey, clusterApiUrl } from "@solana/web3.js"
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets"
import { ConnectionProvider, WalletProvider, useWallet } from "@solana/wallet-adapter-react"
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import "@solana/wallet-adapter-react-ui/styles.css"

// Default to 'devnet' cluster, but can be changed to 'mainnet-beta' for production
const network = clusterApiUrl("devnet")

// Context for custom Solana functionality
interface SolanaContextType {
  connection: Connection | null
  publicKey: PublicKey | null
  connected: boolean
  connecting: boolean
  disconnect: () => Promise<void>
  walletAddress: string | null
}

const SolanaContext = createContext<SolanaContextType>({
  connection: null,
  publicKey: null,
  connected: false,
  connecting: false,
  disconnect: async () => {},
  walletAddress: null,
})

export const useSolana = () => useContext(SolanaContext)

// Custom provider that combines wallet adapter with our own functionality
function SolanaContextProvider({ children }: { children: ReactNode }) {
  const { publicKey, connected, connecting, disconnect } = useWallet()
  const [connection, setConnection] = useState<Connection | null>(null)

  useEffect(() => {
    const conn = new Connection(network, "confirmed")
    setConnection(conn)
  }, [])

  const walletAddress = publicKey ? publicKey.toString() : null

  return (
    <SolanaContext.Provider
      value={{
        connection,
        publicKey,
        connected,
        connecting,
        disconnect,
        walletAddress,
      }}
    >
      {children}
    </SolanaContext.Provider>
  )
}

// Main Solana provider that wraps the application
export function SolanaProvider({ children }: { children: ReactNode }) {
  // Set up supported wallet adapters
  const wallets = [new PhantomWalletAdapter(), new SolflareWalletAdapter()]

  return (
    <ConnectionProvider endpoint={network}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <SolanaContextProvider>{children}</SolanaContextProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

// Export the wallet button for easy access
export { WalletMultiButton }
