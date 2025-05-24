"use server";

import { createClient } from "@/lib/supabase/server";
import { upsertHeliusWebhook } from "@/lib/helius/create-webhook";
import { revalidatePath } from "next/cache";

export async function updateApplicationStatus(
  id: string,
  status: "approved" | "rejected",
) {
  try {
    const supabase = createClient();

    const { data: whale, error: fetchError } = await supabase
      .from("whale_applications")
      .select("wallet_address")
      .eq("id", id)
      .single();

    if (fetchError || !whale) throw fetchError ?? new Error("Whale not found");

    const { error: updateError } = await supabase
      .from("whale_applications")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (updateError) throw updateError;

    if (status === "approved") {
      try {
        await upsertHeliusWebhook(whale.wallet_address);
      } catch (heliusErr) {
        console.error("Helius webhook error:", heliusErr);
      }
    }

    revalidatePath("/admin/applications");
    return { success: true };
  } catch (err) {
    console.error("Error updating application status:", err);
    return { success: false, error: "Failed to update application status" };
  }
}
