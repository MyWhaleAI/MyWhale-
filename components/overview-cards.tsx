import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Users, Award, DollarSign, Info } from "lucide-react"

export function OverviewCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="w-9 h-9 rounded-xl bg-teal-100 flex items-center justify-center">
              <Users className="h-4 w-4 text-teal-600" />
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <Info className="h-4 w-4" />
            </button>
          </div>
          <h3 className="text-gray-500 font-medium mb-1 text-sm">Followed Whales</h3>
          <div className="text-2xl font-bold text-gray-800">8</div>
          <div className="flex items-center gap-1.5 text-emerald-600 mt-1 text-xs">
            <TrendingUp className="h-3 w-3" />
            <span>+2 this week</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-blue-600"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <Info className="h-4 w-4" />
            </button>
          </div>
          <h3 className="text-gray-500 font-medium mb-1 text-sm">New Alerts Today</h3>
          <div className="text-2xl font-bold text-gray-800">12</div>
          <div className="flex items-center gap-1.5 text-emerald-600 mt-1 text-xs">
            <TrendingUp className="h-3 w-3" />
            <span>+5 from yesterday</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center">
              <Award className="h-4 w-4 text-purple-600" />
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <Info className="h-4 w-4" />
            </button>
          </div>
          <h3 className="text-gray-500 font-medium mb-1 text-sm">Top Performing Whale</h3>
          <div className="text-xl font-bold text-gray-800">@SolWhale</div>
          <div className="flex items-center gap-1.5 text-emerald-600 mt-1 text-xs">
            <TrendingUp className="h-3 w-3" />
            <span>+22% this week</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <Info className="h-4 w-4" />
            </button>
          </div>
          <h3 className="text-gray-500 font-medium mb-1 text-sm">Feed Value Moved Today</h3>
          <div className="text-2xl font-bold text-gray-800">$132,000</div>
          <div className="flex items-center gap-1.5 text-emerald-600 mt-1 text-xs">
            <TrendingUp className="h-3 w-3" />
            <span>+18% from yesterday</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
