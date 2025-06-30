"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFollowerCount } from "@/app/actions/follower-actions"; // Assuming this action fetches the count
import { Users } from "lucide-react";

/**
 * FollowerStats component displays the total number of users tracking whale activity.
 * It fetches the follower count from a backend action and shows a loading skeleton
 * until the data is available.
 *
 * @returns {JSX.Element} The rendered card displaying follower statistics.
 */
export function FollowerStats() {
  // State to store the fetched follower count
  const [followerCount, setFollowerCount] = useState<number | null>(null);
  // State to manage the loading status
  const [isLoading, setIsLoading] = useState(true);

  /**
   * useEffect hook to fetch the follower count when the component mounts.
   */
  useEffect(() => {
    const fetchFollowerCount = async () => {
      try {
        // Call the backend action to get the follower count
        const { count } = await getFollowerCount();
        setFollowerCount(count); // Update state with the fetched count
      } catch (error) {
        console.error("Error fetching follower count:", error);
        // Log any errors during data fetching
      } finally {
        setIsLoading(false); // Set loading to false after fetch (regardless of success or failure)
      }
    };

    fetchFollowerCount(); // Execute the fetch function
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Followers</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" /> {/* Icon for followers */}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          // Display a loading skeleton while data is being fetched
          <div className="h-9 w-16 bg-gray-200 animate-pulse rounded" />
        ) : (
          // Display the follower count once loaded
          <div className="text-2xl font-bold">{followerCount}</div>
        )}
        <p className="text-xs text-muted-foreground">Users tracking whale activity</p>
      </CardContent>
    </Card>
  );
}