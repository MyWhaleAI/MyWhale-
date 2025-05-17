import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, BarChart2 } from "lucide-react"

// Mock data for top whales
const topWhales = [
  {
    id: 1,
    name: "@SolWhale",
    roi: "+42%",
    followers: "2.4k",
    volume: "$5.2M",
    tags: ["DeFi", "Staking"],
    avatar: "S",
    avatarColor: "bg-blue-500",
  },
  {
    id: 2,
    name: "@NFTKing",
    roi: "+38%",
    followers: "1.8k",
    volume: "$3.7M",
    tags: ["NFT"],
    avatar: "N",
    avatarColor: "bg-purple-500",
  },
  {
    id: 3,
    name: "@YieldHunter",
    roi: "+31%",
    followers: "1.2k",
    volume: "$2.9M",
    tags: ["DeFi", "DAOs"],
    avatar: "Y",
    avatarColor: "bg-emerald-500",
  },
  {
    id: 4,
    name: "@SolTrader",
    roi: "+29%",
    followers: "3.1k",
    volume: "$7.8M",
    tags: ["DeFi", "NFT"],
    avatar: "S",
    avatarColor: "bg-amber-500",
  },
]

export function TopWhales() {
  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Top Solana Whales</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Follow the most successful traders on Solana. Sort by ROI, followers, or volume moved.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <Button variant="outline" size="sm" className="rounded-full border-gray-200 text-gray-700">
            7d
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100"
          >
            30d
          </Button>
          <Button variant="outline" size="sm" className="rounded-full border-gray-200 text-gray-700">
            90d
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {topWhales.map((whale) => (
            <Card key={whale.id} className="bg-white border-gray-200 rounded-xl shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-10 h-10 rounded-xl ${whale.avatarColor} flex items-center justify-center text-sm font-bold text-white`}
                  >
                    {whale.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">{whale.name}</div>
                    <div className="flex items-center text-emerald-600 text-sm">
                      <TrendingUp className="h-3.5 w-3.5 mr-1" />
                      {whale.roi} ROI
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {whale.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className={
                        tag === "DeFi"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : tag === "NFT"
                            ? "bg-purple-50 text-purple-700 border-purple-200"
                            : tag === "Staking"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                      }
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    <span>{whale.followers}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BarChart2 className="h-3.5 w-3.5" />
                    <span>{whale.volume}</span>
                  </div>
                </div>

                <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white">Follow</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
