import { getApprovedWhales } from "@/actions/whale-actions";
import { WhalesClient } from "@/components/whales/whales-client";

export default async function WhalesPage() {
  try {
    const whales = await getApprovedWhales();
    return <WhalesClient initialWhales={whales} />;
  } catch (error) {
    console.error("Error loading whales page:", error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <h1 className="text-2xl font-bold mb-4">Unable to load whales</h1>
          <p className="text-gray-600 mb-6">We're having trouble connecting to our database. Please try again later.</p>
          <a href="/" className="inline-block px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors">
            Return to Home
          </a>
        </div>
      </div>
    );
  }
}
