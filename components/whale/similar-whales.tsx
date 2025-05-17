"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import { getWhaleById } from "@/actions/whale-actions";
import { useFollow } from "@/hooks/use-follow";

// Mock data for similar whales
const mockSimilarWhales = [
  {
    id: 1,
    displayName: "@DeFiKing",
    walletAddress: "8c9d3f7b1e5a6c2d8f9b0e3a2c1d5e6f7a8b9c4a",
    roi: "+38%",
    strategies: { defi: true, yield: true },
    avatarColor: "bg-purple-500",
    initial: "D",
  },
  {
    id: 2,
    displayName: "@YieldHunter",
    walletAddress: "1f7a4c6b8d2e5f3a9c1b7d4e6f5a8c9b2d1e3f7a",
    roi: "+31%",
    strategies: { defi: true, yield: true, dao: true },
    avatarColor: "bg-emerald-500",
    initial: "Y",
  },
  {
    id: 3,
    displayName: "@StakingPro",
    walletAddress: "5d2e8f1a7c4b9d3e6f5a8c9b2d1e3f7a4c6b8d2e",
    roi: "+18%",
    strategies: { staking: true, defi: true },
    avatarColor: "bg-teal-500",
    initial: "S",
  },
];

interface SimilarWhalesProps {
  currentWhale?: any;
  currentWhaleId?: string;
}

export function SimilarWhales({ currentWhale, currentWhaleId }: SimilarWhalesProps) {
  const [whale, setWhale] = useState<any>(currentWhale);
  const [loading, setLoading] = useState(!currentWhale && !!currentWhaleId);

  // Fetch whale data if we only have the ID
  useEffect(() => {
    if (!currentWhale && currentWhaleId) {
      const fetchWhale = async () => {
        setLoading(true);
        try {
          const whaleData = await getWhaleById(currentWhaleId);
          if (whaleData) {
            setWhale(whaleData);
          }
        } catch (error) {
          console.error("Error fetching whale data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchWhale();
    }
  }, [currentWhale, currentWhaleId]);

  // If we're loading or don't have whale data, show a loading state
  if (loading) {
    return (
      <Card className="bg-white border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <CardHeader className="p-4 border-b border-gray-200">
          <CardTitle className="text-lg font-bold">Similar Whales</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-lg bg-gray-200 h-10 w-10"></div>
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-lg bg-gray-200 h-10 w-10"></div>
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-lg bg-gray-200 h-10 w-10"></div>
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // If we don't have whale data and we're not loading, show a fallback
  if (!whale && !loading) {
    return (
      <Card className="bg-white border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <CardHeader className="p-4 border-b border-gray-200">
          <CardTitle className="text-lg font-bold">Similar Whales</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="text-center py-4 text-gray-500">No similar whales found</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <CardHeader className="p-4 border-b border-gray-200">
        <CardTitle className="text-lg font-bold">Similar Whales</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          {mockSimilarWhales.map((similarWhale) => (
            <SimilarWhaleItem key={similarWhale.id} whale={similarWhale} />
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Common Strategies</h3>
          <div className="flex flex-wrap gap-2">
            {whale &&
              whale.strategies &&
              Object.entries(whale.strategies).map(
                ([key, value]) =>
                  value && (
                    <Badge
                      key={key}
                      variant="outline"
                      className={
                        key === "defi"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : key === "nft"
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : key === "staking"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : key === "dao"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : key === "meme"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : key === "yield"
                          ? "bg-teal-50 text-teal-700 border-teal-200"
                          : "bg-gray-50 text-gray-700 border-gray-200"
                      }>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </Badge>
                  )
              )}
            {(!whale || !whale.strategies || Object.keys(whale.strategies).length === 0) && <div className="text-sm text-gray-500">No strategies found</div>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Separate component for each similar whale item
function SimilarWhaleItem({ whale }) {
  const { isFollowing, isLoading, toggleFollow } = useFollow(whale.walletAddress);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg ${whale.avatarColor} flex items-center justify-center text-sm font-bold text-white`}>{whale.initial}</div>
        <div>
          <Link href={`/whale/${whale.walletAddress}`} className="font-medium text-gray-800 hover:text-teal-600 transition-colors">
            {whale.displayName}
          </Link>
          <div className="flex items-center gap-1.5 text-emerald-600 text-xs">
            <TrendingUp className="h-3 w-3" />
            <span>{whale.roi} ROI</span>
          </div>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        className={`h-8 text-xs ${isFollowing ? "bg-gray-100 hover:bg-gray-200 text-gray-800" : "border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100"}`}
        onClick={toggleFollow}
        disabled={isLoading}>
        {isLoading ? "..." : isFollowing ? "Following" : "Follow"}
      </Button>
    </div>
  );
}
