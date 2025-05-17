import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, TrendingUp, Clock, DollarSign, BarChart2 } from "lucide-react"

interface WhaleStrategyInsightsProps {
  whale: any
}

export function WhaleStrategyInsights({ whale }: WhaleStrategyInsightsProps) {
  // Generate AI insights based on whale's strategies
  const getStrategyInsights = () => {
    const insights = []
    const strategies = whale?.strategies || {}

    if (strategies.defi) {
      insights.push("Focuses on DeFi protocols with a preference for established platforms with strong TVL growth.")
    }

    if (strategies.nft) {
      insights.push(
        "Demonstrates a pattern of early entry into promising NFT collections, typically holding through floor price volatility.",
      )
    }

    if (strategies.staking) {
      insights.push(
        "Maintains significant staked positions across multiple networks, prioritizing liquid staking derivatives.",
      )
    }

    if (strategies.yield) {
      insights.push(
        "Actively rotates capital between yield farming opportunities, typically entering new pools within 48 hours of launch.",
      )
    }

    if (strategies.dao) {
      insights.push(
        "Participates actively in governance across multiple DAOs, often voting in favor of treasury diversification proposals.",
      )
    }

    if (strategies.meme) {
      insights.push(
        "Takes calculated positions in meme tokens, typically exiting within 72 hours of significant price appreciation.",
      )
    }

    // Add general insights if we have few strategy-specific ones
    if (insights.length < 3) {
      insights.push(
        "Demonstrates a disciplined approach to position sizing, rarely allocating more than 5% to speculative assets.",
      )
      insights.push(
        "Shows a pattern of counter-trend buying during market corrections, particularly in blue-chip assets.",
      )
    }

    return insights
  }

  const strategyInsights = getStrategyInsights()

  // Generate key metrics based on whale's activity
  const keyMetrics = [
    {
      name: "Avg. Hold Time",
      value: "32 days",
      icon: <Clock className="h-4 w-4 text-blue-600" />,
      color: "bg-blue-100",
    },
    {
      name: "Win Rate",
      value: "76%",
      icon: <TrendingUp className="h-4 w-4 text-emerald-600" />,
      color: "bg-emerald-100",
    },
    {
      name: "Avg. Position",
      value: "$24.5K",
      icon: <DollarSign className="h-4 w-4 text-purple-600" />,
      color: "bg-purple-100",
    },
    {
      name: "Risk Score",
      value: "Medium",
      icon: <BarChart2 className="h-4 w-4 text-amber-600" />,
      color: "bg-amber-100",
    },
  ]

  return (
    <Card className="bg-white border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-gray-200">
        <CardTitle className="text-lg font-bold">Strategy Insights</CardTitle>
        <Badge variant="outline" className="flex items-center gap-1 bg-teal-50 text-teal-700 border-teal-200">
          <Brain className="h-3.5 w-3.5" />
          <span>AI Generated</span>
        </Badge>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Trading Patterns</h3>
            <ul className="space-y-2">
              {strategyInsights.map((insight, index) => (
                <li key={index} className="text-gray-600 text-sm flex items-start gap-2">
                  <span className="text-teal-500 mt-0.5">•</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Key Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {keyMetrics.map((metric) => (
                <div key={metric.name} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg ${metric.color} flex items-center justify-center shrink-0`}>
                    {metric.icon}
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">{metric.name}</div>
                    <div className="font-medium">{metric.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
