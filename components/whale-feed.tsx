"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bookmark, Share2, Bell, ExternalLink, Info } from "lucide-react";
import { getFollowedWhalesActivity } from "@/actions/activity-actions";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";

export function WhaleFeed() {
  const [feedItems, setFeedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSampleData, setHasSampleData] = useState(false);
  const { toast } = useToast();
  const { publicKey } = useWallet();

  useEffect(() => {
    async function loadActivity() {
      if (!publicKey) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const activity = await getFollowedWhalesActivity(publicKey.toString());
        setFeedItems(activity);

        // Check if we're showing sample data
        setHasSampleData(activity.some((item) => item.isSample));
      } catch (error) {
        console.error("Error loading whale activity:", error);
        toast({
          title: "Error",
          description: "Failed to load whale activity",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadActivity();
  }, [publicKey, toast]);

  if (isLoading) {
    return <FeedSkeleton />;
  }

  if (!publicKey) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500 mb-4">Connect your wallet to see activity from whales you follow</p>
      </div>
    );
  }

  if (feedItems.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500 mb-4">You're not following any whales yet, or your whales haven't had any recent activity</p>
        <Button className="bg-teal-500 hover:bg-teal-600 text-white" asChild>
          <Link href="/whales">Discover Whales to Follow</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      {hasSampleData && (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 m-4 rounded">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-amber-400 mr-2 mt-0.5" />
            <div>
              <p className="text-sm text-amber-800">
                <strong>Demo Mode:</strong> Showing sample transactions since you don't have any activity from followed whales yet.
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
              <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer group">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    {item.avatarUrl ? (
                      <img src={item.avatarUrl || "/placeholder.svg"} alt={item.whale} className="w-8 h-8 rounded-lg object-cover" />
                    ) : (
                      <div className={`w-8 h-8 rounded-lg ${item.avatarColor} flex items-center justify-center text-xs font-bold text-white`}>{item.avatar}</div>
                    )}
                    <Link href={`/whale/${item.whaleAddress}`} className="text-gray-800 font-medium text-sm hover:text-teal-600">
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
                    <Button variant="ghost" size="icon" className="rounded-full h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity" title="Bookmark">
                      <Bookmark className="h-3.5 w-3.5 text-gray-400 hover:text-teal-500" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity" title="Set Alert">
                      <Bell className="h-3.5 w-3.5 text-gray-400 hover:text-teal-500" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity" title="Share">
                      <Share2 className="h-3.5 w-3.5 text-gray-400 hover:text-teal-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="View Transaction"
                      onClick={() => window.open(`https://solscan.io/tx/${item.signature}`, "_blank")}>
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
                  <img src={item.avatarUrl || "/placeholder.svg"} alt={item.whale} className="w-8 h-8 rounded-lg object-cover" />
                ) : (
                  <div className={`w-8 h-8 rounded-lg ${item.avatarColor} flex items-center justify-center text-xs font-bold text-white`}>{item.avatar}</div>
                )}
                <div>
                  <Link href={`/whale/${item.whaleAddress}`} className="text-gray-800 font-medium text-sm hover:text-teal-600">
                    {item.whale}
                  </Link>
                  <div className="text-gray-500 text-xs">{item.time}</div>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" onClick={() => window.open(`https://solscan.io/tx/${item.signature}`, "_blank")}>
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
