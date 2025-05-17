import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

// Mock data for live whale feed
const whaleActivities = [
  {
    id: 1,
    whale: "@SolWhale",
    action: "Bought $SOL",
    token: "$SOL",
    platform: "Jupiter",
    time: "2 mins ago",
    avatar: "S",
    avatarColor: "bg-blue-500",
  },
  {
    id: 2,
    whale: "@ArtFlip",
    action: "Minted NFT",
    token: "Mad Lads",
    platform: "Magic Eden",
    time: "5 mins ago",
    avatar: "A",
    avatarColor: "bg-purple-500",
  },
  {
    id: 3,
    whale: "@YieldKing",
    action: "Staked",
    token: "$SOL",
    platform: "Marinade",
    time: "7 mins ago",
    avatar: "Y",
    avatarColor: "bg-emerald-500",
  },
]

export function LiveWhaleFeed() {
  return (
    <section className="py-12 sm:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Live Whale Activity Feed</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Watch real-time transactions from the smartest wallets on Solana. See what the whales are doing right now.
          </p>
        </div>

        <Card className="bg-white border-gray-200 rounded-xl shadow-sm max-w-4xl mx-auto">
          <CardHeader className="pb-0">
            <CardTitle className="text-lg font-bold text-gray-800">Real-time Solana whale moves</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="overflow-x-auto">
              {/* Desktop view */}
              <table className="w-full hidden sm:table">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left p-3 text-teal-600 font-medium text-sm">Whale</th>
                    <th className="text-left p-3 text-teal-600 font-medium text-sm">Action</th>
                    <th className="text-left p-3 text-teal-600 font-medium text-sm">Token</th>
                    <th className="text-left p-3 text-teal-600 font-medium text-sm">Platform</th>
                    <th className="text-left p-3 text-teal-600 font-medium text-sm">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {whaleActivities.map((activity) => (
                    <tr key={activity.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-8 h-8 rounded-lg ${activity.avatarColor} flex items-center justify-center text-xs font-bold text-white`}
                          >
                            {activity.avatar}
                          </div>
                          <span className="text-gray-800 font-medium text-sm">{activity.whale}</span>
                        </div>
                      </td>
                      <td className="p-3 font-medium text-gray-800 text-sm">{activity.action}</td>
                      <td className="p-3 font-medium text-gray-800 text-sm">{activity.token}</td>
                      <td className="p-3 text-gray-600 text-sm">{activity.platform}</td>
                      <td className="p-3 text-gray-500 text-xs">{activity.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile view */}
              <div className="sm:hidden space-y-3">
                {whaleActivities.map((activity) => (
                  <div key={activity.id} className="border-b border-gray-200 pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-7 h-7 rounded-lg ${activity.avatarColor} flex items-center justify-center text-xs font-bold text-white`}
                        >
                          {activity.avatar}
                        </div>
                        <span className="text-gray-800 font-medium text-sm">{activity.whale}</span>
                      </div>
                      <span className="text-gray-500 text-xs">{activity.time}</span>
                    </div>
                    <div className="pl-9">
                      <div className="text-sm">
                        <span className="font-medium text-gray-800">{activity.action}</span>
                        <span className="text-gray-600"> {activity.token}</span>
                      </div>
                      <div className="text-xs text-gray-500">on {activity.platform}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 text-center">
              <Button
                variant="ghost"
                className="text-teal-600 hover:bg-teal-50 text-sm flex items-center gap-1 mx-auto"
              >
                View Full Feed
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
