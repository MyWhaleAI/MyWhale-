import { saveTransaction } from "@/app/actions/activity-actions"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const transaction = {
      wallet_address: body.wallet_address,
      action: body.action,
      value: body.value,
      platform: body.platform,
      timestamp: body.timestamp,
      ai_summary: body.ai_summary || null,
      signature: body.signature,
    }

    // Save transaction in DB
    const success = await saveTransaction(transaction)

    if (!success) {
      return NextResponse.json({ error: "Failed to save transaction" }, { status: 500 })
    }

    return NextResponse.json({ message: "Transaction saved" }, { status: 200 })
  } catch (error) {
    console.error("Webhook handler error:", error)
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
