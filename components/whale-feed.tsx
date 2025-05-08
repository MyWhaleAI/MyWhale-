import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DollarSign, ArrowUpRight, ArrowDownRight, Wallet, Star, Zap, Share2 } from "lucide-react"

// Mock data for whale transactions
const transactions = [
  {
    id: 1,
    whaleId: "Whale-10x4a...3f7b",
    action: "buy",
    token: "ETH",
    amount: "1,250",
    price: "$3,245",
    timeAgo: "2 min ago",
    analysis:
      "Likely accumulating before ETH staking rewards increase next week. This whale has historically bought before major protocol upgrades.",
  },
  {
    id: 2,
    whaleId: "Whale-20x8c...9d2e",
    action: "stake",
    token: "SOL",
    amount: "45,000",
    price: "$98",
    timeAgo: "15 min ago",
    analysis:
      "This whale is moving assets to staking, suggesting a long-term bullish outlook on SOL. They've maintained this position through previous market downturns.",
  },
  {
    id: 3,
    whaleId: "Whale-30x1f...7a4c",
    action: "sell",
    token: "AVAX",
    amount: "12,500",
    price: "$28",
    timeAgo: "32 min ago",
    analysis:
      "This appears to be profit-taking after the recent 30% price increase. The whale still holds a significant position in AVAX.",
  },
  {
    id: 4,
    whaleId: "Whale-40x5d...2e8f",
    action: "farm",
    token: "AAVE/ETH LP",
    amount: "$2.1M",
    price: "-",
    timeAgo: "45 min ago",
    analysis:
      "Moving liquidity to a new yield farming opportunity. This whale frequently rotates between DeFi protocols to maximize yields.",
  },
  {
    id: 5,
    whaleId: "Whale-50x9b...6c3a",
    action: "buy",
    token: "BTC",
    amount: "32",
    price: "$61,245",
    timeAgo: "1 hour ago",
    analysis:
      "Consistent accumulation pattern. This whale has been dollar-cost averaging into BTC for the past 6 months regardless of price action.",
  },
]

export function WhaleFeed() {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-6">
        <div className="space-y-4">
          {transactions.map((tx) => (
            <div key={tx.id} className="border border-gray-700 rounded-lg p-4 hover:bg-gray-750 transition-colors">
              <div className="flex justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-emerald-500">{tx.whaleId}</span>
                  <Button variant="ghost" size="icon" className="h-5 w-5 text-gray-400 hover:text-yellow-500">
                    <Star className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-xs text-gray-500">{tx.timeAgo}</span>
              </div>

              <div className="flex items-center gap-2 mb-3">
                {tx.action === "buy" && (
                  <Badge className="bg-emerald-500/20 text-emerald-500">
                    <ArrowUpRight className="h-3 w-3 mr-1" /> Buy
                  </Badge>
                )}
                {tx.action === "sell" && (
                  <Badge className="bg-red-500/20 text-red-500">
                    <ArrowDownRight className="h-3 w-3 mr-1" /> Sell
                  </Badge>
                )}
                {tx.action === "stake" && (
                  <Badge className="bg-blue-500/20 text-blue-500">
                    <Wallet className="h-3 w-3 mr-1" /> Stake
                  </Badge>
                )}
                {tx.action === "farm" && (
                  <Badge className="bg-purple-500/20 text-purple-500">
                    <DollarSign className="h-3 w-3 mr-1" /> Farm
                  </Badge>
                )}

                <span className="font-medium">
                  {tx.amount} {tx.token} {tx.price !== "-" && `at ${tx.price}`}
                </span>
              </div>

              <div className="text-sm text-gray-400 border-t border-gray-700 pt-3 mt-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Zap className="h-4 w-4 text-emerald-400 mr-2" />
                    <span>{tx.analysis}</span>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-500 hover:text-gray-300">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
