import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp, Bell, Zap, DollarSign } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-emerald-500" />
            <span className="text-xl font-bold">WhaleWatch</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="hover:text-emerald-400 transition">
              Dashboard
            </Link>
            <Link href="/whales" className="hover:text-emerald-400 transition">
              Whales
            </Link>
            <Link href="/alerts" className="hover:text-emerald-400 transition">
              Alerts
            </Link>
            <Link href="/pricing" className="hover:text-emerald-400 transition">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-gray-700 hover:bg-gray-800">
              Login
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-500">Sign Up</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-blue-500 text-transparent bg-clip-text">
            Follow the Smart Money in Real-Time
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Track top crypto whales, get instant alerts on their moves, and understand the strategy behind each
            transaction with AI-powered insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-emerald-600 hover:bg-emerald-500 text-lg py-6 px-8">
              Start Tracking <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" className="border-gray-700 hover:bg-gray-800 text-lg py-6 px-8">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Platform Features</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-8 rounded-xl">
              <div className="bg-emerald-900/50 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                <TrendingUp className="h-7 w-7 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Whale Tracking</h3>
              <p className="text-gray-400">
                Follow top traders, investors, and funds. See their transactions in real-time and learn from their
                strategies.
              </p>
            </div>

            <div className="bg-gray-800 p-8 rounded-xl">
              <div className="bg-emerald-900/50 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                <Bell className="h-7 w-7 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Alerts</h3>
              <p className="text-gray-400">
                Get notified instantly when whales make significant moves - buys, sells, farming, staking, and more.
              </p>
            </div>

            <div className="bg-gray-800 p-8 rounded-xl">
              <div className="bg-emerald-900/50 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                <Zap className="h-7 w-7 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI Explanations</h3>
              <p className="text-gray-400">
                Our AI analyzes each transaction and explains the purpose and context behind whale movements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Whale Feed Preview */}
      <section className="py-20 container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-6">Your Personalized Whale Feed</h2>
            <p className="text-gray-400 mb-6">
              Build a customized feed of whale activity based on your interests. Follow specific wallets, tokens, or
              strategies to create a signal stream tailored to your investment style.
            </p>
            <p className="text-gray-400 mb-8">
              Monetize your insights by sharing your feed with subscribers or earn token rewards for valuable signals.
            </p>
            <Button className="bg-emerald-600 hover:bg-emerald-500">Create Your Feed</Button>
          </div>
          <div className="md:w-1/2 bg-gray-800 p-6 rounded-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold">Live Whale Feed</h3>
              <Button variant="outline" size="sm" className="border-gray-700">
                Filter
              </Button>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-emerald-500">Whale-{i}0x4a...3f7b</span>
                    <span className="text-xs text-gray-500">2 min ago</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-emerald-400" />
                    <span className="font-medium">Bought 1,250 ETH at $3,245</span>
                  </div>
                  <p className="text-sm text-gray-400 border-t border-gray-700 pt-2 mt-2">
                    <span className="text-emerald-400">AI Analysis:</span> Likely accumulating before ETH staking
                    rewards increase next week. This whale has historically bought before major protocol upgrades.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Subscription Plans</h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
              <h3 className="text-xl font-bold mb-2">Basic</h3>
              <p className="text-gray-400 mb-6">For casual traders</p>
              <div className="text-3xl font-bold mb-6">
                $19<span className="text-gray-500 text-lg font-normal">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  </div>
                  <span>Follow up to 5 whales</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  </div>
                  <span>Basic alerts</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  </div>
                  <span>Standard AI analysis</span>
                </li>
              </ul>
              <Button className="w-full bg-gray-700 hover:bg-gray-600">Get Started</Button>
            </div>

            <div className="bg-gray-800 p-8 rounded-xl border-2 border-emerald-500 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-black px-4 py-1 rounded-full text-sm font-bold">
                Popular
              </div>
              <h3 className="text-xl font-bold mb-2">Pro</h3>
              <p className="text-gray-400 mb-6">For serious investors</p>
              <div className="text-3xl font-bold mb-6">
                $49<span className="text-gray-500 text-lg font-normal">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  </div>
                  <span>Follow unlimited whales</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  </div>
                  <span>Priority alerts</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  </div>
                  <span>Advanced AI insights</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  </div>
                  <span>Custom feed creation</span>
                </li>
              </ul>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-500">Get Started</Button>
            </div>

            <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
              <h3 className="text-xl font-bold mb-2">Enterprise</h3>
              <p className="text-gray-400 mb-6">For funds & institutions</p>
              <div className="text-3xl font-bold mb-6">
                $199<span className="text-gray-500 text-lg font-normal">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  </div>
                  <span>All Pro features</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  </div>
                  <span>API access</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  </div>
                  <span>Custom integrations</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  </div>
                  <span>Dedicated support</span>
                </li>
              </ul>
              <Button className="w-full bg-gray-700 hover:bg-gray-600">Contact Sales</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-6 md:mb-0">
              <TrendingUp className="h-6 w-6 text-emerald-500" />
              <span className="text-xl font-bold">WhaleWatch</span>
            </div>
            <div className="flex flex-wrap gap-8 justify-center mb-6 md:mb-0">
              <Link href="/about" className="text-gray-400 hover:text-white transition">
                About
              </Link>
              <Link href="/features" className="text-gray-400 hover:text-white transition">
                Features
              </Link>
              <Link href="/pricing" className="text-gray-400 hover:text-white transition">
                Pricing
              </Link>
              <Link href="/blog" className="text-gray-400 hover:text-white transition">
                Blog
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-white transition">
                Contact
              </Link>
            </div>
            <div className="flex gap-4">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-gray-700 hover:bg-gray-800 h-10 w-10 p-0"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                </svg>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-gray-700 hover:bg-gray-800 h-10 w-10 p-0"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-gray-700 hover:bg-gray-800 h-10 w-10 p-0"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </Button>
            </div>
          </div>
          <div className="text-center text-gray-500 text-sm mt-12">
            © {new Date().getFullYear()} WhaleWatch. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
