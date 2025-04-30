import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider
} from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter
} from "@solana/wallet-adapter-wallets";
import { FC, ReactNode, useMemo } from "react";

require("@solana/wallet-adapter-react-ui/styles.css");

export const WalletProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const endpoint = "https://api.mainnet-beta.solana.com";
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
};