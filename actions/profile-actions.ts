"use server"

import { createClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"

// Create a singleton Supabase client for server actions
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables")
  }

  return createClient(supabaseUrl, supabaseKey)
}

export type WhaleProfileUpdateData = {
  displayName: string
  bio: string
  twitter: string
  telegram: string
  tags?: string[]
  monetizationModel?: string
}

export async function updateWhaleProfile(walletAddress: string, profileData: WhaleProfileUpdateData) {
  try {
    const supabase = getSupabaseClient()

    // First check if the whale exists and is approved
    const { data: existingWhale, error: fetchError } = await supabase
      .from("whale_applications")
      .select("id, status")
      .eq("wallet_address", walletAddress)
      .eq("status", "approved")
      .single()

    if (fetchError || !existingWhale) {
      return {
        success: false,
        error: "Whale profile not found or not approved",
      }
    }

    // Update the whale profile
    const { error: updateError } = await supabase
      .from("whale_applications")
      .update({
        display_name: profileData.displayName,
        bio: profileData.bio,
        twitter: profileData.twitter,
        telegram: profileData.telegram,
        tags: profileData.tags,
        monetization_model: profileData.monetizationModel,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingWhale.id)

    if (updateError) {
      console.error("Error updating whale profile:", updateError)
      return {
        success: false,
        error: updateError.message,
      }
    }

    // Revalidate the whale profile page and dashboard
    revalidatePath(`/whale/${walletAddress}`)
    revalidatePath(`/whale/dashboard`)

    return {
      success: true,
    }
  } catch (error) {
    console.error("Failed to update whale profile:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}
