import { Card, CardContent } from "@/components/ui/card"
import { Zap, Brain, Lightbulb } from "lucide-react"

export function AiExplanations() {
  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center p-2 bg-teal-50 rounded-xl mb-4">
            <Brain className="h-5 w-5 text-teal-600" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">AI-Powered Explanations</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our AI decodes transactions for strategy and intent, helping you follow not just what — but why.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                  <Zap className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">Transaction Insights</h3>
                  <p className="text-gray-600 text-sm">
                    <span className="text-blue-600 font-medium">@SolWhale</span> swapped USDC to SOL on Jupiter, likely
                    preparing to stake or enter a new yield farm.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                  <Brain className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">Pattern Recognition</h3>
                  <p className="text-gray-600 text-sm">
                    <span className="text-purple-600 font-medium">@ArtFlip</span> is minting multiple NFTs from the same
                    collection, suggesting confidence in the project's potential.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                  <Lightbulb className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">Strategy Alerts</h3>
                  <p className="text-gray-600 text-sm">
                    <span className="text-emerald-600 font-medium">@YieldKing</span> is moving assets to liquid staking,
                    indicating a long-term bullish outlook while maintaining liquidity.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
