import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, Star, ExternalLink, Bell } from "lucide-react"

// Mock data for top whales
const whales = [
  {
    id: 1,
    address: "0x4a8c9d3f7b1e5a6c2d8f9b0e3a2c1d5e6f7a8b9c",
    displayAddress: "Whale-10x4a...3f7b",
    portfolio: "$1.2B",
    activity: "Very High",
    tokens: ["ETH", "BTC", "LINK"],
    change: "+12.5%",
    isFollowed: true,
  },
  {
    id: 2,
    address: "0x8c9d3f7b1e5a6c2d8f9b0e3a2c1d5e6f7a8b9c4a",
    displayAddress: "Whale-20x8c...9d2e",
    portfolio: "$845M",
    activity: "High",
    tokens: ["SOL", "ETH", "AVAX"],
    change: "+8.2%",
    isFollowed: true,
  },
  {
    id: 3,
    address: "0x1f7a4c6b8d2e5f3a9c1b7d4e6f5a8c9b2d1e3f7a",
    displayAddress: "Whale-30x1f...7a4c",
    portfolio: "$620M",
    activity: "Medium",
    tokens: ["BTC", "AVAX", "DOT"],
    change: "-3.1%",
    isFollowed: true,
  },
  {
    id: 4,
    address: "0x5d2e8f1a7c4b9d3e6f5a8c9b2d1e3f7a4c6b8d2e",
    displayAddress: "Whale-40x5d...2e8f",
    portfolio: "$550M",
    activity: "High",
    tokens: ["ETH", "AAVE", "UNI"],
    change: "+5.7%",
    isFollowed: false,
  },
  {
    id: 5,
    address: "0x9b6c3a5d2e8f1a7c4b9d3e6f5a8c9b2d1e3f7a4c",
    displayAddress: "Whale-50x9b...6c3a",
    portfolio: "$480M",
    activity: "Very High",
    tokens: ["BTC", "ETH", "MATIC"],
    change: "+15.3%",
    isFollowed: false,
  },
]

export function TopWhales() {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left pb-4 text-gray-400 font-medium">Whale</th>
                <th className="text-left pb-4 text-gray-400 font-medium">Portfolio Value</th>
                <th className="text-left pb-4 text-gray-400 font-medium">Activity Level</th>
                <th className="text-left pb-4 text-gray-400 font-medium">Top Holdings</th>
                <th className="text-left pb-4 text-gray-400 font-medium">30d Change</th>
                <th className="text-right pb-4 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {whales.map((whale) => (
                <tr key={whale.id} className="border-b border-gray-700 hover:bg-gray-750">
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-5 w-5 ${whale.isFollowed ? "text-yellow-500" : "text-gray-400 hover:text-yellow-500"}`}
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                      <span className="font-medium">{whale.displayAddress}</span>
                    </div>
                  </td>
                  <td className="py-4 font-medium">{whale.portfolio}</td>
                  <td className="py-4">
                    <Badge
                      className={`
                        ${
                          whale.activity === "Very High"
                            ? "bg-emerald-500/20 text-emerald-500"
                            : whale.activity === "High"
                              ? "bg-blue-500/20 text-blue-500"
                              : "bg-gray-500/20 text-gray-400"
                        }
                      `}
                    >
                      {whale.activity}
                    </Badge>
                  </td>
                  <td className="py-4">
                    <div className="flex gap-1">
                      {whale.tokens.map((token, index) => (
                        <Badge key={index} variant="outline" className="border-gray-700 text-gray-300">
                          {token}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="py-4">
                    <span
                      className={`flex items-center ${whale.change.startsWith("+") ? "text-emerald-500" : "text-red-500"}`}
                    >
                      {whale.change.startsWith("+") ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingUp className="h-3 w-3 mr-1 transform rotate-180" />
                      )}
                      {whale.change}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" className="h-8 text-gray-400 hover:text-gray-300">
                        <Bell className="h-4 w-4 mr-1" />
                        Alert
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-300">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
