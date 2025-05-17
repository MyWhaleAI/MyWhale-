import { ArrowUpDown, ExternalLink, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

// Mock data for whale tracking
const whales = [
  {
    id: 1,
    protocol: "ETH",
    asset: "cbETH",
    ethValue: "$1800.00",
    lsdBalance: "$3403.00",
    rewardsApr: "4.27%",
    status: "positive",
  },
  {
    id: 2,
    protocol: "ETH",
    asset: "frxETH",
    ethValue: "$1800.00",
    lsdBalance: "$3403.00",
    rewardsApr: "3.27%",
    status: "positive",
  },
  {
    id: 3,
    protocol: "ETH",
    asset: "rETH",
    ethValue: "$1800.00",
    lsdBalance: "$3403.00",
    rewardsApr: "57.02%",
    status: "positive",
  },
  {
    id: 4,
    protocol: "ETH",
    asset: "stETH",
    ethValue: "$1800.00",
    lsdBalance: "$3403.00",
    rewardsApr: "3.75%",
    status: "negative",
  },
  {
    id: 5,
    protocol: "ETH",
    asset: "wbETH",
    ethValue: "$1800.00",
    lsdBalance: "$3403.00",
    rewardsApr: "64.12%",
    status: "positive",
  },
  {
    id: 6,
    protocol: "ETH",
    asset: "cbETH",
    ethValue: "$1800.00",
    lsdBalance: "$3403.00",
    rewardsApr: "12.21%",
    status: "negative",
  },
  {
    id: 7,
    protocol: "ETH",
    asset: "frxETH",
    ethValue: "$1800.00",
    lsdBalance: "$3403.00",
    rewardsApr: "2.62%",
    status: "negative",
  },
  {
    id: 8,
    protocol: "ETH",
    asset: "rETH",
    ethValue: "$1800.00",
    lsdBalance: "$3403.00",
    rewardsApr: "6.55%",
    status: "negative",
  },
  {
    id: 9,
    protocol: "ETH",
    asset: "stETH",
    ethValue: "$1800.00",
    lsdBalance: "$3403.00",
    rewardsApr: "46.63%",
    status: "positive",
  },
]

export function WhaleTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left p-5 text-teal-600 font-medium text-base">
              <div className="flex items-center gap-1 cursor-pointer hover:text-teal-700 transition-colors">
                Protocol <ArrowUpDown className="h-4 w-4 ml-1" />
              </div>
            </th>
            <th className="text-left p-5 text-teal-600 font-medium text-base">
              <div className="flex items-center gap-1 cursor-pointer hover:text-teal-700 transition-colors">
                Asset <ArrowUpDown className="h-4 w-4 ml-1" />
              </div>
            </th>
            <th className="text-left p-5 text-teal-600 font-medium text-base">
              <div className="flex items-center gap-1 cursor-pointer hover:text-teal-700 transition-colors">
                ETH Value <ArrowUpDown className="h-4 w-4 ml-1" />
              </div>
            </th>
            <th className="text-left p-5 text-teal-600 font-medium text-base">
              <div className="flex items-center gap-1 cursor-pointer hover:text-teal-700 transition-colors">
                LSD Balance <ArrowUpDown className="h-4 w-4 ml-1" />
              </div>
            </th>
            <th className="text-left p-5 text-teal-600 font-medium text-base">
              <div className="flex items-center gap-1 cursor-pointer hover:text-teal-700 transition-colors">
                Rewards APR <ArrowUpDown className="h-4 w-4 ml-1" />
              </div>
            </th>
            <th className="text-right p-5 text-teal-600 font-medium text-base">
              <div className="flex items-center justify-end gap-1">Action</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {whales.map((whale) => (
            <tr
              key={whale.id}
              className="border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer group"
            >
              <td className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gray-800 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-sm font-bold text-gray-800">
                      E
                    </div>
                  </div>
                  <span className="text-gray-800 font-medium text-base">{whale.protocol}</span>
                </div>
              </td>
              <td className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center text-sm font-bold text-white">
                    {whale.asset.charAt(0)}
                  </div>
                  <span className="text-gray-800 font-medium text-base">{whale.asset}</span>
                </div>
              </td>
              <td className="p-5 font-bold text-gray-800 text-base">{whale.ethValue}</td>
              <td className="p-5 font-bold text-gray-800 text-base">{whale.lsdBalance}</td>
              <td className="p-5">
                <span
                  className={`px-4 py-2 rounded-full text-base font-medium ${
                    whale.status === "positive" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {whale.rewardsApr}
                </span>
              </td>
              <td className="p-5 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Star className="h-5 w-5 text-gray-400 hover:text-yellow-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ExternalLink className="h-5 w-5 text-gray-400 hover:text-teal-500" />
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-200 hover:bg-gray-100 text-gray-700 rounded-2xl transition-all duration-200 shadow-sm ml-2 px-5 py-2.5 text-base"
                  >
                    Manage
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
