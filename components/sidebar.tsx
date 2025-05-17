import Link from "next/link"
import { Home, PlusCircle, Wallet, Landmark, RefreshCw, Bell, BarChart2, Settings, HelpCircle } from "lucide-react"

export function Sidebar() {
  return (
    <div className="w-72 h-screen bg-white border-r border-gray-200 flex flex-col shadow-sm">
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-teal-400 to-teal-500 flex items-center justify-center">
            <Wallet className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-800 tracking-tight">WhaleWatch</span>
        </div>
      </div>

      <nav className="mt-6 flex-1 px-5">
        <div className="space-y-2.5">
          <Link
            href="/dashboard"
            className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-teal-50 text-teal-700 font-medium transition-all duration-200 hover:bg-teal-100 text-base"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
              <Home className="h-5 w-5 text-teal-600" />
            </div>
            Dashboard
          </Link>

          <Link
            href="/analytics"
            className="flex items-center gap-4 px-5 py-4 rounded-2xl text-gray-700 font-medium hover:bg-gray-100 transition-all duration-200 text-base"
          >
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
              <BarChart2 className="h-5 w-5 text-gray-600" />
            </div>
            Analytics
          </Link>

          <Link
            href="/add-whale"
            className="flex items-center gap-4 px-5 py-4 rounded-2xl text-gray-700 font-medium hover:bg-gray-100 transition-all duration-200 text-base"
          >
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
              <PlusCircle className="h-5 w-5 text-gray-600" />
            </div>
            Add whale
          </Link>

          <Link
            href="/mint-alerts"
            className="flex items-center gap-4 px-5 py-4 rounded-2xl text-gray-700 font-medium hover:bg-gray-100 transition-all duration-200 text-base"
          >
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
              <Bell className="h-5 w-5 text-gray-600" />
            </div>
            Mint alerts
          </Link>

          <Link
            href="/farms"
            className="flex items-center gap-4 px-5 py-4 rounded-2xl text-gray-700 font-medium hover:bg-gray-100 transition-all duration-200 text-base"
          >
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
              <Landmark className="h-5 w-5 text-gray-600" />
            </div>
            Farms
          </Link>

          <Link
            href="/redemption"
            className="flex items-center gap-4 px-5 py-4 rounded-2xl text-gray-700 font-medium hover:bg-gray-100 transition-all duration-200 text-base"
          >
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
              <RefreshCw className="h-5 w-5 text-gray-600" />
            </div>
            Redemption
          </Link>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="space-y-2.5">
            <Link
              href="/settings"
              className="flex items-center gap-4 px-5 py-4 rounded-2xl text-gray-700 font-medium hover:bg-gray-100 transition-all duration-200 text-base"
            >
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                <Settings className="h-5 w-5 text-gray-600" />
              </div>
              Settings
            </Link>

            <Link
              href="/help"
              className="flex items-center gap-4 px-5 py-4 rounded-2xl text-gray-700 font-medium hover:bg-gray-100 transition-all duration-200 text-base"
            >
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                <HelpCircle className="h-5 w-5 text-gray-600" />
              </div>
              Help & Support
            </Link>
          </div>
        </div>
      </nav>

      <div className="p-5 mt-auto">
        <div className="flex items-center gap-4 bg-gray-100 p-5 rounded-2xl">
          <div className="w-12 h-12 rounded-xl bg-teal-500 flex items-center justify-center">
            <Wallet className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="text-teal-600 font-medium">ETH/USD</div>
            <div className="font-bold text-gray-800 text-lg">$1,800.00</div>
          </div>
        </div>
      </div>
    </div>
  )
}
