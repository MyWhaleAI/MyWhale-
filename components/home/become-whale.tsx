import { Button } from "@/components/ui/button"
import { Award, TrendingUp, Users, DollarSign } from "lucide-react"
import Link from "next/link"

export function BecomeWhale() {
  return (
    <section className="py-12 sm:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-2 bg-teal-50 rounded-xl mb-4">
            <Award className="h-5 w-5 text-teal-600" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Become a Whale</h2>
          <p className="text-gray-600 mb-8">
            Think you're worth watching? Let others follow your trades and earn from your feed. Apply to be listed as a
            whale on our platform.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Showcase Your Trades</h3>
              <p className="text-gray-600 text-sm">
                Let your trading history speak for itself. Display your strategies and success rate.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Build a Following</h3>
              <p className="text-gray-600 text-sm">
                Grow your audience as traders follow your moves and learn from your strategies.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Monetize Your Insights</h3>
              <p className="text-gray-600 text-sm">
                Earn rewards when your strategies help others succeed in the Solana ecosystem.
              </p>
            </div>
          </div>

          <Link href="/apply">
            <Button className="bg-teal-500 hover:bg-teal-600 text-white flex items-center gap-2 mx-auto">
              <Award className="h-4 w-4" />
              Apply to Be Listed
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
