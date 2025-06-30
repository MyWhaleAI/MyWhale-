"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

/**
 * WhaleNavigation component provides navigation links specifically for approved whale users.
 * It checks the user's whale application status and conditionally renders links
 * to the Whale Dashboard and My Profile page.
 *
 * @returns {JSX.Element | null} The rendered navigation links or null if not a whale or loading.
 */
export function WhaleNavigation() {
  const { publicKey } = useWallet(); // Get the connected Solana wallet's public key
  const [isWhale, setIsWhale] = useState(false); // State to track if the user is an approved whale
  const [isLoading, setIsLoading] = useState(true); // State to manage loading status

  /**
   * useEffect hook to check the user's whale status.
   * It queries the Supabase `whale_applications` table to see if the connected
   * wallet address has an 'approved' status.
   */
  useEffect(() => {
    async function checkWhaleStatus() {
      if (!publicKey) {
        // If no wallet is connected, user cannot be a whale
        setIsWhale(false);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true); // Set loading to true
        const supabase = createClientComponentClient(); // Initialize Supabase client
        const { data, error } = await supabase
          .from("whale_applications")
          .select("status")
          .eq("wallet_address", publicKey.toString())
          .eq("status", "approved") // Check for approved status
          .single(); // Expect a single result

        if (error) {
          console.error("Error checking whale status:", error);
          setIsWhale(false); // Assume not a whale on error
        } else {
          setIsWhale(data !== null); // If data is not null, then user is an approved whale
        }
      } catch (err) {
        console.error("Failed to check whale status:", err);
        setIsWhale(false); // Handle unexpected errors
      } finally {
        setIsLoading(false); // Set loading to false after check
      }
    }

    checkWhaleStatus(); // Call the function to check status
  }, [publicKey]); // Re-run effect when publicKey changes

  // Do not render anything if still loading or if the user is not an approved whale
  if (isLoading || !isWhale) return null;

  return (
    <>
      {/* Link to Whale Dashboard */}
      <Link href="/whale/dashboard" className="text-teal-600 hover:text-teal-700 text-sm font-medium">
        Whale Dashboard
      </Link>
      {/* Link to My Profile (specific to the whale's wallet address) */}
      <Link href={`/whale/${publicKey?.toString()}`} className="text-teal-600 hover:text-teal-700 text-sm font-medium">
        My Profile
      </Link>
    </>
  );
}