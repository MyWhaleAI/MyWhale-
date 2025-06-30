"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardStats } from "@/app/actions/activity-actions";
import { useWallet } from "@solana/wallet-adapter-react";

/**
 * StatsOverview component displays key statistics related to whale tracking and user's financial overview.
 * It fetches data from `getDashboardStats` based on the connected Solana wallet's public key.
 * A loading skeleton (`StatsSkeleton`) is displayed while the data is being fetched.
 *
 * @returns {JSX.Element} The rendered statistics overview cards or a loading skeleton.
 */
export function StatsOverview() {
  // State to hold the dashboard statistics
  const [stats, setStats] = useState({
    whalesTracked: 0,
    totalWhales: 0,
    recentTransactions: 0,
    collateralRatio: "0%",
    dailyEarning: "0%",
    liquidationPrice: "$0.00",
    borrowBalance: "$0.00",
    rewardsAPR: "0%",
    pendingRewards: "-",
  });
  // State to manage the loading status
  const [isLoading, setIsLoading] = useState(true);
  // Hook to get the connected Solana wallet's public key
  const { publicKey } = useWallet();

  /**
   * useEffect hook to load dashboard statistics.
   * It runs when the `publicKey` changes (i.e., wallet connects or disconnects).
   * Fetches data using `getDashboardStats` and updates the `stats` state.
   * Manages the `isLoading` state to display a skeleton while data is loading.
   */
  useEffect(() => {
    async function loadStats() {
      if (!publicKey) {
        // If no wallet is connected, stop loading and return
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true); // Set loading to true before fetching
        // Fetch dashboard statistics using the public key
        const dashboardStats = await getDashboardStats(publicKey.toString());
        setStats(dashboardStats); // Update the stats state with fetched data
      } catch (error) {
        console.error("Error loading dashboard stats:", error);
        // Log any errors during data fetching
      } finally {
        setIsLoading(false); // Set loading to false after fetching ( P.S: regardless of success or failure)
      }
    }

    loadStats(); // Call the function to load stats
  }, [publicKey]); // Dependency array: re-run effect when publicKey changes

  // Display a loading skeleton if data is still loading
  if (isLoading) {
    return <StatsSkeleton />;
  }

  // Calculate the percentage of whales tracked for the progress bar
  const trackingPercentage = stats.totalWhales > 0 ? (stats.whalesTracked / stats.totalWhales) * 100 : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Card: Whales Tracked */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Whales Tracked</CardTitle>
          {/* Icon for Whales Tracked */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-teal-600"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.whalesTracked} / {stats.totalWhales}
          </div>
          {/* Progress bar for tracking percentage */}
          <div className="mt-2 h-2 w-full rounded-full bg-gray-100">
            <div
              className="h-2 rounded-full bg-teal-500"
              style={{ width: `${Math.min(trackingPercentage, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">{trackingPercentage.toFixed(0)}% of available whales</p>
        </CardContent>
      </Card>

      {/* Card: Recent Transactions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recent Transactions</CardTitle>
          {/* Icon for Recent Transactions */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-teal-600"
          >
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <path d="M2 10h20" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.recentTransactions}</div>
          <p className="text-xs text-gray-500 mt-1">In the last 24 hours</p>
        </CardContent>
      </Card>

      {/* Card: Collateral Ratio */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Collateral Ratio</CardTitle>
          {/* Icon for Collateral Ratio */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-teal-600"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.collateralRatio}</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-500">+0.5%</span> from last month
          </p>
        </CardContent>
      </Card>

      {/* Card: Daily Earning */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Daily Earning</CardTitle>
          {/* Icon for Daily Earning */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-teal-600"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.dailyEarning}</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-500">+2.1%</span> from yesterday
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * StatsSkeleton component provides a loading skeleton for the StatsOverview.
 * It displays animated gray boxes to indicate that content is being loaded.
 *
 * @returns {JSX.Element} The rendered skeleton loading state.
 */
function StatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse mb-2"></div>
            <div className="h-2 bg-gray-200 rounded w-full animate-pulse"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}