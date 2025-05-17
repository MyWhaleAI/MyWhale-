import { notFound } from "next/navigation"
import { createClient } from "@supabase/supabase-js"
import { WhaleProfileHeader } from "@/components/whale/whale-profile-header"
import { WhaleActivityFeed } from "@/components/whale/whale-activity-feed"
import { WhalePerformanceMetrics } from "@/components/whale/whale-performance-metrics"
import { WhaleStrategyInsights } from "@/components/whale/whale-strategy-insights"
import { SimilarWhales } from "@/components/whale/similar-whales"

// Create a singleton Supabase client for server components
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables")
  }

  return createClient(supabaseUrl, supabaseKey)
}

// Validate if string is a valid Solana address (simplified check)
function isValidSolanaAddress(address: string): boolean {
  // Basic check: Solana addresses are 32-44 characters long and contain only alphanumeric characters
  return /^[A-Za-z0-9]{32,44}$/.test(address)
}

export default async function WhaleProfilePage({ params }: { params: { address: string } }) {
  const { address } = params

  // Special case: if the address is "dashboard", redirect to the dashboard page
  if (address === "dashboard") {
    notFound() // Use notFound for now, ideally we would redirect
  }

  // Validate the address format
  if (!isValidSolanaAddress(address)) {
    console.error("Invalid Solana address format:", address)
    notFound()
  }

  try {
    // Fetch whale data from Supabase
    const supabase = getSupabaseClient()

    // First check if the whale exists and is approved
    const { data: whaleCheck, error: checkError } = await supabase
      .from("whale_applications")
      .select("id")
      .eq("wallet_address", address)
      .eq("status", "approved")

    if (checkError) {
      console.error("Error checking whale existence:", checkError)
      notFound()
    }

    // If no approved whale found with this address, return 404
    if (!whaleCheck || whaleCheck.length === 0) {
      console.error("No approved whale found with address:", address)
      notFound()
    }

    // Now fetch the full whale data
    const { data: whale, error } = await supabase
      .from("whale_applications")
      .select("*")
      .eq("wallet_address", address)
      .eq("status", "approved")
      .limit(1)
      .single()

    if (error) {
      console.error("Error fetching whale data:", error)
      notFound()
    }

    // Fetch recent transactions for this whale
    const { data: transactions, error: txError } = await supabase
      .from("whale_transactions")
      .select("*")
      .eq("wallet_address", address)
      .order("timestamp", { ascending: false })
      .limit(10)

    if (txError) {
      console.error("Error fetching whale transactions:", txError)
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Profile Header */}
          <WhaleProfileHeader whale={whale} />

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - Activity Feed */}
            <div className="lg:col-span-2 space-y-8">
              <WhaleActivityFeed address={address} transactions={transactions || []} />
              <WhaleStrategyInsights whale={whale} />
            </div>

            {/* Sidebar - Performance Metrics & Similar Whales */}
            <div className="space-y-8">
              <WhalePerformanceMetrics address={address} />
              <SimilarWhales currentWhale={whale} />
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error in whale profile page:", error)
    notFound()
  }
}
