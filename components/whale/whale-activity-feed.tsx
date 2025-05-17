"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, MessageSquare, TrendingUp, Filter, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Transaction {
  id: number
  wallet_address: string
  signature: string
  action: string
  platform: string
  value: string
  ai_summary?: string
  timestamp: string
}

interface WhaleActivityFeedProps {
  address: string
  transactions?: Transaction[]
}

export function WhaleActivityFeed({ address, transactions = [] }: WhaleActivityFeedProps) {
  const [activeFilter, setActiveFilter] = useState("all")

  // Filter activities based on selected filter
  const filteredActivities =
    activeFilter === "all"
      ? transactions
      : transactions.filter((activity) => {
          if (activeFilter === "buys")
            return activity.action.toLowerCase().includes("bought") || activity.action.toLowerCase().includes("swap")
          if (activeFilter === "staking") return activity.action.toLowerCase().includes("stake")
          if (activeFilter === "nft") return activity.action.toLowerCase().includes("nft")
          return true
        })

  return (
    <Card className="bg-white border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-gray-200">
        <CardTitle className="text-lg font-bold">Activity Feed</CardTitle>
        <div className="flex items-center gap-2">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="bg-gray-100 p-1 rounded-lg">
              <TabsTrigger value="all" className="rounded-md text-xs px-3 py-1" onClick={() => setActiveFilter("all")}>
                All
              </TabsTrigger>
              <TabsTrigger
                value="buys"
                className="rounded-md text-xs px-3 py-1"
                onClick={() => setActiveFilter("buys")}
              >
                Buys
              </TabsTrigger>
              <TabsTrigger
                value="staking"
                className="rounded-md text-xs px-3 py-1"
                onClick={() => setActiveFilter("staking")}
              >
                Staking
              </TabsTrigger>
              <TabsTrigger value="nft" className="rounded-md text-xs px-3 py-1" onClick={() => setActiveFilter("nft")}>
                NFTs
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100">
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity) => (
              <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center text-xs font-bold text-white">
                      {activity.action.includes("Bought") || activity.action.includes("Swapped")
                        ? "💰"
                        : activity.action.includes("Staked")
                          ? "🥩"
                          : activity.action.includes("NFT")
                            ? "🖼️"
                            : activity.action.includes("Liquidity")
                              ? "💧"
                              : "🔄"}
                    </div>
                    <div>
                      <div className="text-gray-800 font-medium">{activity.action}</div>
                      <div className="flex items-center gap-1 text-sm">
                        <span className="text-gray-800">{activity.value}</span>
                        {activity.platform && (
                          <>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-600">{activity.platform}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="flex items-center gap-1 bg-gray-50 border-gray-200">
                      <Clock className="h-3 w-3" />
                      <span>
                        {activity.timestamp
                          ? formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })
                          : "Unknown time"}
                      </span>
                    </Badge>
                    <a
                      href={`https://solscan.io/tx/${activity.signature}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>

                {activity.ai_summary && (
                  <div className="text-gray-600 text-sm border-t border-gray-100 pt-2 mt-2">
                    <span className="font-medium text-teal-600">AI:</span> {activity.ai_summary}
                  </div>
                )}

                <div className="flex justify-end gap-2 mt-3">
                  <Button variant="outline" size="sm" className="h-7 text-xs rounded-lg">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Similar Trades
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 text-xs rounded-lg">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Discuss
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-500">No activities found for this whale.</p>
              <p className="text-gray-400 text-sm mt-1">Check back later for updates.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
