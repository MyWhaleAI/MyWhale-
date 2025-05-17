"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Button } from "@/components/ui/button";
import { Wallet, ChevronDown, Copy, LogOut, ExternalLink } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { truncateAddress } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { addFollower } from "@/actions/follower-actions";

export function WalletButton() {
  const { publicKey, wallet, disconnect, connected } = useWallet();
  const { setVisible } = useWalletModal();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate fetching balance when connected
  useEffect(() => {
    if (connected && publicKey) {
      setIsLoading(true);
      // This is a mock - in a real app, you would fetch the actual balance
      setTimeout(() => {
        setBalance(Math.random() * 100);
        setIsLoading(false);
      }, 1000);
    } else {
      setBalance(null);
    }
  }, [connected, publicKey]);

  // Register follower when connected
  useEffect(() => {
    const registerFollower = async () => {
      if (connected && publicKey) {
        try {
          const result = await addFollower(publicKey.toString());
          if (result.success) {
            toast({
              title: "Welcome to Whale Watch!",
              description: "You're now following top whale activity.",
              duration: 5000,
            });
          }
        } catch (error) {
          console.error("Failed to register follower:", error);
        }
      }
    };

    registerFollower();
  }, [connected, publicKey, toast]);

  const handleCopyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openExplorer = () => {
    if (publicKey) {
      window.open(`https://explorer.solana.com/address/${publicKey.toString()}`, "_blank");
    }
  };

  if (!connected) {
    return (
      <Button
        onClick={() => setVisible(true)}
        className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white flex items-center gap-2 py-2 px-4 rounded-xl transition-all duration-200 ease-in-out shadow-sm">
        <Wallet className="h-4 w-4" />
        <span>Connect Wallet</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="border-gray-200 bg-white hover:bg-gray-50 text-gray-800 flex items-center gap-2 py-2 px-4 rounded-xl transition-all duration-200 ease-in-out shadow-sm">
          <div className="flex items-center gap-2">
            {wallet?.adapter.icon && <img src={wallet.adapter.icon || "/placeholder.svg"} alt={wallet.adapter.name} className="h-4 w-4" />}
            <span className="font-medium">{truncateAddress(publicKey?.toString() || "")}</span>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 p-2">
        <div className="flex flex-col space-y-1 p-2">
          <p className="text-xs text-gray-500">Connected as</p>
          <p className="font-medium text-sm">{wallet?.adapter.name}</p>
          {isLoading ? (
            <div className="h-5 w-20 bg-gray-200 animate-pulse rounded mt-1"></div>
          ) : balance !== null ? (
            <p className="text-teal-600 font-medium text-sm">{balance.toFixed(2)} SOL</p>
          ) : null}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleCopyAddress} className="cursor-pointer">
          <Copy className="mr-2 h-4 w-4" />
          <span>{copied ? "Copied!" : "Copy address"}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={openExplorer} className="cursor-pointer">
          <ExternalLink className="mr-2 h-4 w-4" />
          <span>View on Explorer</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={disconnect} className="cursor-pointer text-red-600 hover:text-red-700">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Disconnect</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
