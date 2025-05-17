import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, BarChart2 } from "lucide-react"

// Mock data for leaderboard
const leaderboardItems = [
  {
    id: 1,
    whale: "@SolWhale",
    roi: "+22%",
    followers: "1.2k",
    volume: "$2.4M",
    avatar: "S",
    avatarColor: "bg-blue-500",
  },
  {
    id: 2,
    whale: "@DegenKing",
    roi: "+18%",
    followers: "845",
    volume: "$1.8M",
    avatar: "D",
    avatarColor: "bg-purple-500",
  },
  {
    id: 3,
    whale: "@FarmQueen",
    roi: "+15%",
    followers: "1.5k",
    volume: "$3.2M",
    avatar: "F",
    avatarColor: "bg-emerald-500",
  },
  {
    id: 4,
    whale: "@NFTHunter",
    roi: "+12%",
    followers: "920",
    volume: "$1.1M",
    avatar: "N",
    avatarColor: "bg-amber-500",
  },
  {
    id: 5,
    whale: "@SolTrader",
    roi: "+10%",
    followers: "2.3k",
    volume: "$5.7M",
    avatar: "S",
    avatarColor: "bg-red-500",
  },
]

export function Leaderboard() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
      {leaderboardItems.map((item, index) => (
        <Card key={item.id} className="bg-white border-gray-200 rounded-xl shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div
                className={`w-8 h-8 rounded-lg ${item.avatarColor} flex items-center justify-center text-sm font-bold text-white`}
              >
                {item.avatar}
              </div>
              <div>
                <div className="font-bold text-gray-800 text-sm">{item.whale}</div>
                <div className="text-emerald-600 text-xs font-medium">{item.roi} this week</div>
              </div>
            </div>

            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-1 text-gray-500 text-xs">
                <Users className="h-3 w-3" />
                <span>{item.followers}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500 text-xs">
                <BarChart2 className="h-3 w-3" />
                <span>{item.volume}</span>
              </div>
            </div>

            <Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-all duration-200 ease-in-out text-xs py-1.5">
              {index === 0 ? "Following" : "Follow"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
