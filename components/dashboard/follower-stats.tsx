"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFollowerCount } from "@/actions/follower-actions";
import { Users } from "lucide-react";

export function FollowerStats() {
  const [followerCount, setFollowerCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFollowerCount = async () => {
      try {
        const { count } = await getFollowerCount();
        setFollowerCount(count);
      } catch (error) {
        console.error("Error fetching follower count:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFollowerCount();
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Followers</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? <div className="h-9 w-16 bg-gray-200 animate-pulse rounded" /> : <div className="text-2xl font-bold">{followerCount}</div>}
        <p className="text-xs text-muted-foreground">Users tracking whale activity</p>
      </CardContent>
    </Card>
  );
}
