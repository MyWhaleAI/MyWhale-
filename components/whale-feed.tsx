"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Bookmark, Share2, Bell, ExternalLink, Info } from "lucide-react";
import { getFollowedWhalesActivity } from "@/app/actions/activity-actions";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";

/**
 * WhaleFeed component displays a feed of recent activities from followed whales.
 * It fetches activity data based on the connected Solana wallet.
 * If no wallet is connected or no activity is found, it provides appropriate messages or sample data.
 *
 * @returns {JSX.Element} The rendered whale activity feed, loading skeleton, or informational messages.
 */
export function WhaleFeed() {
  // State to store the fetched feed items (whale activities)
  const [feedItems, setFeedItems] = useState<any[]>([]);
  // State to manage the loading status
  const [isLoading, setIsLoading] = useState(true);
  // State to indicate if sample data is currently being displayed
  const [hasSampleData, setHasSampleData] = useState(false);
  // Hook for displaying toast notifications
  const { toast } = useToast();
  // Hook to get the connected Solana wallet's public key
  const { publicKey } = useWallet();

  /**
   * useEffect hook to load whale activity data.
   * It runs when the `publicKey` or `toast` object changes.
   * Fetches data using `getFollowedWhalesActivity` and updates `feedItems` and `hasSampleData` states.
   * Manages `isLoading` state and displays toasts for errors.
   */
  useEffect(() => {
    async function loadActivity() {
      if (!publicKey) {
        // If no wallet is connected, stop loading and return
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true); // Set loading state to true
        // Fetch activity data for the connected wallet
        const activity = await getFollowedWhalesActivity(publicKey.toString());
        setFeedItems(activity); // Update feed items state

        // Determine if sample data is being shown (e.g., if the backend returns a flag)
        setHasSampleData(activity.some((item: any) => item.isSample));
      } catch (error) {
        console.error("Error loading whale activity:", error);
        // Display an error toast if fetching fails
        toast({
          title: "Error",
          description: "Failed to load whale activity",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false); // Always set loading to false after attempt
      }
    }

    loadActivity(); // Call the function to load activity
  }, [publicKey, toast]); // Dependencies for useEffect: re-run when publicKey or toast changes

  // Display a loading skeleton if data is still loading
  if (isLoading) {
    return <FeedSkeleton />;
  }

  // Message for when no wallet is connected
  if (!publicKey) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500 mb-4">Connect your wallet to see activity from whales you follow</p>
      </div>
    );
  }

  // Message for when no feed items are found after loading
  if (feedItems.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500 mb-4">
          You're not following any whales yet, or your whales haven't had any recent activity
        </p>
        <Button className="bg-teal-500 hover:bg-teal-600 text-white" asChild>
          <Link href="/whales">Discover Whales to Follow</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      {/* Sample Data Disclaimer */}
      {hasSampleData && (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 m-4 rounded">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-amber-400 mr-2 mt-0.5" />
            <div>
              <p className="text-sm text-amber-800">
                <strong>Demo Mode:</strong> Showing sample transactions since you don't have any activity from followed
                whales yet.
              </p>
              <p className="text-xs text-amber-700 mt-1">
                Follow some whales on the{" "}
                <Link href="/whales" className="underline">
                  Whales page
                </Link>{" "}
                to see their real activity.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Table View */}
      <div className="hidden md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left p-3 text-teal-600 font-medium text-sm">Whale</th>
              <th className="text-left p-3 text-teal-600 font-medium text-sm">Action</th>
              <th className="text-left p-3 text-teal-600 font-medium text-sm">Token</th>
              <th className="text-left p-3 text-teal-600 font-medium text-sm">Platform</th>
              <th className="text-left p-3 text-teal-600 font-medium text-sm">Time</th>
              <th className="text-left p-3 text-teal-600 font-medium text-sm">AI Insight</th>
              <th className="text-right p-3 text-teal-600 font-medium text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {feedItems.map((item) => (
              <tr
                key={item.id}
                className="border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer group"
              >
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    {item.avatarUrl ? (
                      <img
                        src={item.avatarUrl || "/placeholder.svg"}
                        alt={item.whale}
                        className="w-8 h-8 rounded-lg object-cover"
                      />
                    ) : (
                      <div
                        className={`w-8 h-8 rounded-lg ${item.avatarColor} flex items-center justify-center text-xs font-bold text-white`}
                      >
                        {item.avatar}
                      </div>
                    )}
                    <Link
                      href={`/whale/${item.whaleAddress}`}
                      className="text-gray-800 font-medium text-sm hover:text-teal-600"
                    >
                      {item.whale}
                    </Link>
                  </div>
                </td>
                <td className="p-3 font-medium text-gray-800 text-sm">{item.action}</td>
                <td className="p-3 font-medium text-gray-800 text-sm">{item.token}</td>
                <td className="p-3 text-gray-600 text-sm">{item.platform}</td>
                <td className="p-3 text-gray-500 text-xs">{item.time}</td>
                <td className="p-3 text-gray-600 max-w-[300px] text-sm">"{item.insight}"</td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Bookmark"
                    >
                      <Bookmark className="h-3.5 w-3.5 text-gray-400 hover:text-teal-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Set Alert"
                    >
                      <Bell className="h-3.5 w-3.5 text-gray-400 hover:text-teal-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Share"
                    >
                      <Share2 className="h-3.5 w-3.5 text-gray-400 hover:text-teal-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="View Transaction"
                      onClick={() => window.open(`https://solscan.io/tx/${item.signature}`, "_blank")}
                    >
                      <ExternalLink className="h-3.5 w-3.5 text-gray-400 hover:text-teal-500" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3 p-3">
        {feedItems.map((item) => (
          <div key={item.id} className="border border-gray-200 rounded-xl p-3 bg-white hover:bg-gray-50">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                {item.avatarUrl ? (
                  <img
                    src={item.avatarUrl || "/placeholder.svg"}
                    alt={item.whale}
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                ) : (
                  <div
                    className={`w-8 h-8 rounded-lg ${item.avatarColor} flex items-center justify-center text-xs font-bold text-white`}
                  >
                    {item.avatar}
                  </div>
                )}
                <div>
                  <Link
                    href={`/whale/${item.whaleAddress}`}
                    className="text-gray-800 font-medium text-sm hover:text-teal-600"
                  >
                    {item.whale}
                  </Link>
                  <div className="text-gray-500 text-xs">{item.time}</div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full"
                onClick={() => window.open(`https://solscan.io/tx/${item.signature}`, "_blank")}
              >
                <ExternalLink className="h-3.5 w-3.5 text-gray-400" />
              </Button>
            </div>

            <div className="mb-2">
              <div className="font-medium text-gray-800 text-sm">{item.action}</div>
              <div className="flex items-center gap-1 text-sm">
                <span className="text-gray-800">{item.token}</span>
                {item.platform && (
                  <>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">{item.platform}</span>
                  </>
                )}
              </div>
            </div>

            <div className="text-gray-600 text-xs border-t border-gray-100 pt-2">
              <span className="font-medium text-teal-600">AI:</span> {item.insight}
            </div>

            <div className="flex justify-end gap-1 mt-2">
              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full">
                <Bookmark className="h-3.5 w-3.5 text-gray-400" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full">
                <Bell className="h-3.5 w-3.5 text-gray-400" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full">
                <Share2 className="h-3.5 w-3.5 text-gray-400" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * FeedSkeleton component provides a loading skeleton for the WhaleFeed.
 * It displays animated gray boxes to indicate that content is being loaded.
 *
 * @returns {JSX.Element} The rendered skeleton loading state.
 */
function FeedSkeleton() {
  return (
    <div className="p-4">
      <div className="animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center space-x-4 py-3 border-b border-gray-200">
            <div className="rounded-lg bg-gray-200 h-10 w-10"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    </div>
  );
}