"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateApplicationStatus(id: string, status: "approved" | "rejected") {
  try {
    const supabase = createClient()

    const { error } = await supabase
      .from("whale_applications")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (error) throw error

    revalidatePath("/admin/applications")
    return { success: true }
  } catch (error) {
    console.error("Error updating application status:", error)
    return { success: false, error: "Failed to update application status" }
  }
}
