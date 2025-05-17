import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// Define default preferences with all alerts set to true
const DEFAULT_PREFERENCES = {
  alerts: {
    buys: true,
    mints: true,
    staking: true,
    governance: true,
  },
  delivery: {
    email: true,
    telegram: true,
    sms: false,
  },
  timeSettings: {
    timezone: "UTC (GMT+0)",
    frequency: "Real-time",
  },
}

export async function GET(request: NextRequest, { params }: { params: { address: string } }) {
  try {
    const walletAddress = params.address
    const supabase = createClient()

    const { data, error } = await supabase
      .from("followers")
      .select("notification_preferences")
      .eq("wallet_address", walletAddress)
      .single()

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          preferences: DEFAULT_PREFERENCES,
        },
        { status: 404 },
      )
    }

    // Ensure we have complete preferences with defaults for missing values
    const preferences = data?.notification_preferences || {}

    return NextResponse.json({
      success: true,
      preferences: {
        alerts: {
          buys: preferences.alerts?.buys ?? true,
          mints: preferences.alerts?.mints ?? true,
          staking: preferences.alerts?.staking ?? true,
          governance: preferences.alerts?.governance ?? true,
        },
        delivery: {
          email: preferences.delivery?.email ?? true,
          telegram: preferences.delivery?.telegram ?? true,
          sms: preferences.delivery?.sms ?? false,
        },
        timeSettings: {
          timezone: preferences.timeSettings?.timezone ?? "UTC (GMT+0)",
          frequency: preferences.timeSettings?.frequency ?? "Real-time",
        },
      },
    })
  } catch (error) {
    console.error("Error fetching follower preferences:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch preferences",
        preferences: DEFAULT_PREFERENCES,
      },
      { status: 500 },
    )
  }
}
