import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, Zap } from "lucide-react"

// Mock data for whale suggestions
const suggestedWhales = [
  {
    id: 1,
    whale: "@SolDefi",
    strategy: "DeFi Yield",
    roi: "+15%",
    avatar: "S",
    avatarColor: "bg-teal-500",
    description: "Specializes in liquidity providing and yield farming across Solana DeFi protocols.",
  },
  {
    id: 2,
    whale: "@LlamaMint",
    strategy: "NFT Trader",
    roi: "+22%",
    avatar: "L",
    avatarColor: "bg-purple-500",
    description: "Consistently identifies early NFT projects with high growth potential.",
  },
  {
    id: 3,
    whale: "@SolanaStaker",
    strategy: "Staking Expert",
    roi: "+8%",
    avatar: "S",
    avatarColor: "bg-blue-500",
    description: "Focuses on liquid staking derivatives and staking optimization.",
  },
]

export function WhaleSuggestions() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
      {suggestedWhales.map((whale) => (
        <Card key={whale.id} className="bg-white border-gray-200 rounded-xl shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div
                className={`w-8 h-8 rounded-lg ${whale.avatarColor} flex items-center justify-center text-sm font-bold text-white`}
              >
                {whale.avatar}
              </div>
              <div>
                <div className="font-bold text-gray-800 text-sm">{whale.whale}</div>
                <div className="text-gray-500 text-xs">{whale.strategy}</div>
              </div>
            </div>

            <p className="text-gray-600 mb-3 text-xs">{whale.description}</p>

            <div className="flex items-center gap-1 text-emerald-600 mb-3 text-xs">
              <TrendingUp className="h-3 w-3" />
              <span>{whale.roi} monthly ROI</span>
            </div>

            <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-all duration-200 ease-in-out flex items-center justify-center gap-1 text-xs py-1.5">
              <Zap className="h-3 w-3" />
              Follow
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
