import WhaleFeed from "../components/WhaleFeed";
import WalletConnectButton from "../components/WalletConnectButton";

export default function Home() {
  return (
    <div className="min-h-screen p-4 space-y-4">
      <WalletConnectButton />
      <WhaleFeed />
    </div>
  );
}