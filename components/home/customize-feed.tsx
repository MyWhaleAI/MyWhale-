import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, Target, BarChart2, ArrowRight } from "lucide-react"

export function CustomizeFeed() {
  return (
    <section className="py-12 sm:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Customize Your Whale Feed</h2>
            <p className="text-gray-600 mb-6">
              Create a personalized feed of whale activity based on your interests. Follow specific wallets, tokens, or
              strategies to create a signal stream tailored to your investment style.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Bell className="h-4 w-4 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">Set alerts for key activities</h3>
                  <p className="text-gray-600 text-sm">
                    Get notified for buys, mints, staking, yield farming, and more from your followed whales.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Target className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">Follow whales by strategy</h3>
                  <p className="text-gray-600 text-sm">
                    Filter for NFT flippers, DeFi farmers, DAO voters, or other specialized strategies.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center shrink-0 mt-0.5">
                  <BarChart2 className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">Track performance metrics</h3>
                  <p className="text-gray-600 text-sm">
                    View ROI, activity history, and success rates for each whale you follow.
                  </p>
                </div>
              </div>
            </div>

            <Button className="bg-teal-500 hover:bg-teal-600 text-white flex items-center gap-2">
              Create My Feed
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          <div className="relative">
            <Card className="bg-white border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="font-bold text-gray-800">Your Custom Feed Preview</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="text-xs h-7 px-2 border-gray-200">
                      DeFi
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs h-7 px-2 border-gray-200">
                      NFTs
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs h-7 px-2 border-gray-200">
                      Staking
                    </Button>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  {/* Feed items */}
                  <div className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center text-xs font-bold text-white">
                          S
                        </div>
                        <span className="text-gray-800 font-medium text-sm">@SolWhale</span>
                      </div>
                      <span className="text-gray-500 text-xs">2m ago</span>
                    </div>
                    <div className="text-sm font-medium text-gray-800 mb-1">Bought 500 SOL at $98.45</div>
                    <div className="text-xs text-gray-600 border-t border-gray-100 pt-2 mt-1">
                      <span className="text-teal-600 font-medium">AI:</span> Large accumulation after recent dip,
                      consistent with previous buying patterns.
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-purple-500 flex items-center justify-center text-xs font-bold text-white">
                          A
                        </div>
                        <span className="text-gray-800 font-medium text-sm">@ArtFlip</span>
                      </div>
                      <span className="text-gray-500 text-xs">15m ago</span>
                    </div>
                    <div className="text-sm font-medium text-gray-800 mb-1">Minted 3 Mad Lads NFTs</div>
                    <div className="text-xs text-gray-600 border-t border-gray-100 pt-2 mt-1">
                      <span className="text-teal-600 font-medium">AI:</span> This whale has a 78% success rate flipping
                      NFTs from this collection.
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-xs font-bold text-white">
                          Y
                        </div>
                        <span className="text-gray-800 font-medium text-sm">@YieldKing</span>
                      </div>
                      <span className="text-gray-500 text-xs">32m ago</span>
                    </div>
                    <div className="text-sm font-medium text-gray-800 mb-1">Staked 25,000 SOL via Marinade</div>
                    <div className="text-xs text-gray-600 border-t border-gray-100 pt-2 mt-1">
                      <span className="text-teal-600 font-medium">AI:</span> Long-term position, likely holding through
                      market volatility for staking rewards.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Decorative elements */}
            <div className="hidden lg:block absolute -top-6 -right-6 w-20 h-20 bg-teal-50 rounded-full z-0"></div>
            <div className="hidden lg:block absolute -bottom-8 -left-8 w-16 h-16 bg-blue-50 rounded-full z-0"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
