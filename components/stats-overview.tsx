"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardStats } from "@/actions/activity-actions";
import { useWallet } from "@solana/wallet-adapter-react";

export function StatsOverview() {
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
  const [isLoading, setIsLoading] = useState(true);
  const { publicKey } = useWallet();

  useEffect(() => {
    async function loadStats() {
      if (!publicKey) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const dashboardStats = await getDashboardStats(publicKey.toString());
        setStats(dashboardStats);
      } catch (error) {
        console.error("Error loading dashboard stats:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadStats();
  }, [publicKey]);

  if (isLoading) {
    return <StatsSkeleton />;
  }

  const trackingPercentage = stats.totalWhales > 0 ? (stats.whalesTracked / stats.totalWhales) * 100 : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Whales Tracked</CardTitle>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-teal-600">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.whalesTracked} / {stats.totalWhales}
          </div>
          <div className="mt-2 h-2 w-full rounded-full bg-gray-100">
            <div className="h-2 rounded-full bg-teal-500" style={{ width: `${Math.min(trackingPercentage, 100)}%` }}></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">{trackingPercentage.toFixed(0)}% of available whales</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recent Transactions</CardTitle>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-teal-600">
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <path d="M2 10h20" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.recentTransactions}</div>
          <p className="text-xs text-gray-500 mt-1">In the last 24 hours</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Collateral Ratio</CardTitle>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-teal-600">
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
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Daily Earning</CardTitle>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-teal-600">
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
