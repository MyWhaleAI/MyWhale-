import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  TrendingUp,
  Search,
  Bell,
  Settings,
  Filter,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  BarChart3,
  Zap,
} from "lucide-react"
import { WhaleFeed } from "@/components/whale-feed"
import { TopWhales } from "@/components/top-whales"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 py-4 sticky top-0 bg-gray-950 z-10">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-emerald-500" />
            <span className="text-xl font-bold">WhaleWatch</span>
          </div>

          <div className="hidden md:flex items-center relative max-w-md w-full mx-4">
            <Search className="absolute left-3 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search wallets, tokens, or transactions..."
              className="pl-10 bg-gray-900 border-gray-800 focus:border-emerald-500 w-full"
            />
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <Settings className="h-5 w-5" />
            </Button>
            <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center">
              <span className="text-sm font-medium">JD</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-gray-800 h-[calc(100vh-65px)] sticky top-[65px] hidden md:block">
          <nav className="p-4">
            <div className="space-y-1">
              <Button variant="ghost" className="w-full justify-start text-emerald-500 bg-gray-900">
                <BarChart3 className="mr-2 h-5 w-5" />
                Dashboard
              </Button>
              <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white">
                <Wallet className="mr-2 h-5 w-5" />
                My Watchlist
              </Button>
              <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white">
                <Bell className="mr-2 h-5 w-5" />
                Alerts
              </Button>
              <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white">
                <Zap className="mr-2 h-5 w-5" />
                AI Insights
              </Button>
            </div>

            <div className="mt-8">
              <h3 className="text-xs uppercase text-gray-500 font-semibold mb-2 px-3">My Whale Feeds</h3>
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>
                  DeFi Whales
                </Button>
                <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                  NFT Collectors
                </Button>
                <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white">
                  <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                  Staking Strategies
                </Button>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xs uppercase text-gray-500 font-semibold mb-2 px-3">Followed Whales</h3>
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white">
                  <Star className="mr-2 h-4 w-4 text-yellow-500" />
                  Whale-10x4a...3f7b
                </Button>
                <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white">
                  <Star className="mr-2 h-4 w-4 text-yellow-500" />
                  Whale-20x8c...9d2e
                </Button>
                <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white">
                  <Star className="mr-2 h-4 w-4 text-yellow-500" />
                  Whale-30x1f...7a4c
                </Button>
              </div>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
            <p className="text-gray-400">Track whale activity and market movements in real-time</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Total Whales Tracked</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,248</div>
                <p className="text-xs text-emerald-500 flex items-center mt-1">
                  <ArrowUpRight className="h-3 w-3 mr-1" /> +12% from last week
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Transaction Volume (24h)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$1.2B</div>
                <p className="text-xs text-emerald-500 flex items-center mt-1">
                  <ArrowUpRight className="h-3 w-3 mr-1" /> +8% from yesterday
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Active Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-red-500 flex items-center mt-1">
                  <ArrowDownRight className="h-3 w-3 mr-1" /> -3% from yesterday
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Feed Subscribers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156</div>
                <p className="text-xs text-emerald-500 flex items-center mt-1">
                  <ArrowUpRight className="h-3 w-3 mr-1" /> +22% from last week
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="feed" className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <TabsList className="bg-gray-800">
                <TabsTrigger value="feed" className="data-[state=active]:bg-gray-700">
                  Whale Feed
                </TabsTrigger>
                <TabsTrigger value="top-whales" className="data-[state=active]:bg-gray-700">
                  Top Whales
                </TabsTrigger>
                <TabsTrigger value="insights" className="data-[state=active]:bg-gray-700">
                  AI Insights
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="border-gray-700 text-gray-400">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500">
                  <Bell className="h-4 w-4 mr-2" />
                  Create Alert
                </Button>
              </div>
            </div>

            <TabsContent value="feed" className="mt-0">
              <WhaleFeed />
            </TabsContent>

            <TabsContent value="top-whales" className="mt-0">
              <TopWhales />
            </TabsContent>

            <TabsContent value="insights" className="mt-0">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle>AI Market Insights</CardTitle>
                  <CardDescription className="text-gray-400">
                    Automated analysis of whale behavior and market trends
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="h-5 w-5 text-yellow-500" />
                        <h3 className="font-medium">ETH Accumulation Trend</h3>
                      </div>
                      <p className="text-gray-400 text-sm mb-3">
                        Our AI has detected a significant increase in ETH accumulation by top whales over the past 72
                        hours. This pattern typically precedes major protocol announcements or market movements.
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30">Insight</Badge>
                        <Badge className="bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30">Bullish</Badge>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="h-5 w-5 text-purple-500" />
                        <h3 className="font-medium">DeFi Protocol Migration</h3>
                      </div>
                      <p className="text-gray-400 text-sm mb-3">
                        Multiple whale wallets have been moving assets from older DeFi protocols to newer alternatives
                        with better yields. This suggests a shift in the DeFi landscape that could affect token
                        valuations.
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-purple-500/20 text-purple-500 hover:bg-purple-500/30">Trend</Badge>
                        <Badge className="bg-gray-500/20 text-gray-400 hover:bg-gray-500/30">Neutral</Badge>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="h-5 w-5 text-red-500" />
                        <h3 className="font-medium">Stablecoin Outflows</h3>
                      </div>
                      <p className="text-gray-400 text-sm mb-3">
                        Our AI has detected significant stablecoin outflows from major exchanges to private wallets.
                        This could indicate preparation for large purchases or a defensive position against market
                        volatility.
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-red-500/20 text-red-500 hover:bg-red-500/30">Alert</Badge>
                        <Badge className="bg-red-500/20 text-red-500 hover:bg-red-500/30">Bearish</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
