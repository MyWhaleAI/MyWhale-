"use server"

import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Define the application form data schema
const applicationSchema = z.object({
  displayName: z.string().min(3, "Display name must be at least 3 characters"),
  walletAddress: z.string().min(32, "Invalid wallet address"),
  bio: z.string().optional(),
  twitter: z.string().optional(),
  telegram: z.string().optional(),
  strategies: z.object({
    defi: z.boolean().optional(),
    nft: z.boolean().optional(),
    yield: z.boolean().optional(),
    staking: z.boolean().optional(),
    dao: z.boolean().optional(),
    meme: z.boolean().optional(),
  }),
  monetizationModel: z.enum(["public", "paid"]),
})

export type ApplicationFormData = z.infer<typeof applicationSchema>

export async function checkApplicationStatus(walletAddress: string) {
  try {
    if (!walletAddress || walletAddress.length < 32) {
      return { status: null, message: "Invalid wallet address" }
    }

    const supabase = createClient()

    const { data, error } = await supabase
      .from("whale_applications")
      .select("status, created_at, updated_at")
      .eq("wallet_address", walletAddress)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        // No application found (not_found)
        return { status: null, message: "No application found" }
      }
      throw error
    }

    if (data.status === "pending") {
      return {
        status: "pending",
        message: "You already have a pending application under review.",
        submittedAt: data.created_at,
      }
    } else if (data.status === "approved") {
      return {
        status: "approved",
        message: "Your wallet is already approved as a whale!",
        approvedAt: data.updated_at,
      }
    } else if (data.status === "rejected") {
      return {
        status: "rejected",
        message: "Your previous application was rejected. You may submit a new one.",
        rejectedAt: data.updated_at,
      }
    }

    return { status: data.status, message: "Application status retrieved" }
  } catch (error) {
    console.error("Error checking application status:", error)
    return { status: null, message: "Error checking application status" }
  }
}

export async function submitWhaleApplication(formData: ApplicationFormData) {
  try {
    // Validate the form data
    const validatedData = applicationSchema.parse(formData)

    // Create Supabase client
    const supabase = createClient()

    // Check if the wallet has already applied
    const { data: existingApplication } = await supabase
      .from("whale_applications")
      .select("id, status, created_at")
      .eq("wallet_address", validatedData.walletAddress)
      .single()

    if (existingApplication) {
      if (existingApplication.status === "approved") {
        return {
          success: false,
          message: "Your wallet is already approved as a whale!",
          status: "approved",
        }
      } else if (existingApplication.status === "pending") {
        const submittedDate = new Date(existingApplication.created_at).toLocaleDateString()
        return {
          success: false,
          message: `You already have a pending application submitted on ${submittedDate}. Please wait for review.`,
          status: "pending",
        }
      } else if (existingApplication.status === "rejected") {
        // Allow reapplying if previously rejected
        const { error } = await supabase
          .from("whale_applications")
          .update({
            display_name: validatedData.displayName,
            bio: validatedData.bio || null,
            twitter: validatedData.twitter || null,
            telegram: validatedData.telegram || null,
            strategies: validatedData.strategies,
            monetization_model: validatedData.monetizationModel,
            status: "pending",
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingApplication.id)

        if (error) throw error

        revalidatePath("/apply")
        return {
          success: true,
          message: "Your application has been resubmitted for review!",
          status: "pending",
        }
      }
    }

    // Insert new application
    const { error } = await supabase.from("whale_applications").insert({
      wallet_address: validatedData.walletAddress,
      display_name: validatedData.displayName,
      bio: validatedData.bio || null,
      twitter: validatedData.twitter || null,
      telegram: validatedData.telegram || null,
      strategies: validatedData.strategies,
      monetization_model: validatedData.monetizationModel,
      status: "pending",
    })

    if (error) throw error

    revalidatePath("/apply")
    return {
      success: true,
      message: "Your application has been submitted successfully! We will review it shortly.",
      status: "pending",
    }
  } catch (error) {
    console.error("Error submitting whale application:", error)

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Invalid form data. Please check your inputs.",
        errors: error.errors,
        status: null,
      }
    }

    return {
      success: false,
      message: "An error occurred while submitting your application. Please try again.",
      status: null,
    }
  }
}
