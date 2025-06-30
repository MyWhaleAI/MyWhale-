"use client";

import { type FC, type ReactNode, useMemo } from "react";
import { ConnectionProvider, WalletProvider, useWallet } from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

// Import the styles for the wallet adapter UI components
require("@solana/wallet-adapter-react-ui/styles.css");

/**
 * Props for the SolanaWalletProvider component.
 * @interface SolanaWalletProviderProps
 * @property {ReactNode} children - React children to be rendered within the wallet provider context.
 */
interface SolanaWalletProviderProps {
  children: ReactNode;
}

/**
 * SolanaWalletProvider component sets up the Solana wallet adapter context for the application.
 * It configures the network, RPC endpoint, and available wallet adapters (Phantom, Solflare).
 * It also wraps the application with `WalletModalProvider` to enable wallet connection UI.
 *
 * @param {SolanaWalletProviderProps} { children } - The props object containing React children.
 * @returns {JSX.Element} The Solana wallet provider context.
 */
export const SolanaWalletProvider: FC<SolanaWalletProviderProps> = ({ children }) => {
  // Define the Solana network to connect to. 'Mainnet' is used here.
  const network = WalletAdapterNetwork.Mainnet;

  // Memoize the RPC endpoint URL based on the selected network.
  // `clusterApiUrl` provides standard RPC endpoints for known networks.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // Memoize the list of wallet adapters to be supported.
  // Phantom and Solflare adapters are included here, but more can be added.
  // `@solana/wallet-adapter-wallets` supports tree shaking and lazy loading.
  const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter()], []);

  return (
    // ConnectionProvider manages the RPC connection to the Solana cluster.
    <ConnectionProvider endpoint={endpoint}>
      {/* WalletProvider manages the state of the connected wallet. `autoConnect` attempts to reconnect previous wallets. */}
      <WalletProvider wallets={wallets} autoConnect>
        {/* WalletModalProvider renders the UI for selecting and connecting wallets. */}
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

// Re-export `useWallet` for convenience, allowing components to consume the wallet context directly.
export { useWallet };