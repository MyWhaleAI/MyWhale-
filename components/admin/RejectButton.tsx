"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { updateApplicationStatus } from "@/app/actions/admin-actions";

/**
 * Props for the RejectButton component.
 * @interface RejectButtonProps
 * @property {string} applicationId - The unique ID of the application to be rejected.
 */
interface RejectButtonProps {
  applicationId: string;
}

/**
 * RejectButton component provides a button to reject a whale application.
 * It handles the loading state and displays any errors during the rejection process.
 *
 * @param {RejectButtonProps} { applicationId } - The props object containing the application ID.
 * @returns {JSX.Element} The rendered reject button and an optional error message.
 */
export default function RejectButton({ applicationId }: RejectButtonProps) {
  const [isLoading, setIsLoading] = useState(false); // State to manage loading status
  const [error, setError] = useState<string | null>(null); // State to store any error messages

  /**
   * Handles the rejection of an application.
   * Sets loading state, calls the `updateApplicationStatus` action with "rejected" status,
   * and handles success or error feedback.
   */
  const handleReject = async () => {
    setIsLoading(true); // Start loading
    setError(null); // Clear previous errors
    try {
      // Call the server action to update the application status to "rejected"
      const result = await updateApplicationStatus(applicationId, "rejected");
      if (!result.success) {
        // If the action failed, set an error message
        setError(result.error || "Failed to reject application.");
        console.error("Rejection error:", result.error);
      }
      // Note: Revalidation (e.g., refreshing data on the page) is expected to be handled by the server action itself.
    } catch (err) {
      // Catch unexpected client-side errors during the process
      setError("An unexpected error occurred.");
      console.error("Unexpected rejection error:", err);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        className="h-7 text-xs px-2 text-red-600 hover:text-red-700 disabled:opacity-50"
        onClick={handleReject}
        disabled={isLoading} // Disable button while loading
      >
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Reject"} {/* Show spinner when loading */}
      </Button>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>} {/* Display error message */}
    </>
  );
}