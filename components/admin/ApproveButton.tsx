"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { updateApplicationStatus } from "@/app/actions/admin-actions";

/**
 * Props for the ApproveButton component.
 * @interface ApproveButtonProps
 * @property {string} applicationId - The unique ID of the application to be approved.
 */
interface ApproveButtonProps {
  applicationId: string;
}

/**
 * ApproveButton component provides a button to approve a whale application.
 * It handles the loading state and displays any errors during the approval process.
 *
 * @param {ApproveButtonProps} { applicationId } - The props object containing the application ID.
 * @returns {JSX.Element} The rendered approve button and an optional error message.
 */
export default function ApproveButton({ applicationId }: ApproveButtonProps) {
  const [isLoading, setIsLoading] = useState(false); // State to manage loading status
  const [error, setError] = useState<string | null>(null); // State to store any error messages

  /**
   * Handles the approval of an application.
   * Sets loading state, calls the `updateApplicationStatus` action with "approved" status,
   * and handles success or error feedback.
   */
  const handleApprove = async () => {
    setIsLoading(true); // Start loading
    setError(null); // Clear previous errors
    try {
      // Call the server action to update the application status to "approved"
      const result = await updateApplicationStatus(applicationId, "approved");
      if (!result.success) {
        // If the action failed, set an error message
        setError(result.error || "Failed to approve application.");
        console.error("Approval error:", result.error);
      }
      // Note: Revalidation (e.g., refreshing data on the page) is expected to be handled by the server action itself.
    } catch (err) {
      // Catch unexpected client-side errors during the process
      setError("An unexpected error occurred.");
      console.error("Unexpected approval error:", err);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <>
      <Button
        size="sm"
        className="h-7 text-xs px-2 bg-teal-500 hover:bg-teal-600 disabled:opacity-50"
        onClick={handleApprove}
        disabled={isLoading} // Disable button while loading
      >
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Approve"} {/* Show spinner when loading */}
      </Button>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>} {/* Display error message */}
    </>
  );
}