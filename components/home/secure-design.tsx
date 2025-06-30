import { Shield, Search, Zap } from "lucide-react";

/**
 * SecureDesign component highlights the security and privacy aspects of the platform.
 * It emphasizes wallet connection, read-only access to blockchain data, and optimization for Solana.
 *
 * @returns {JSX.Element} The rendered secure design section.
 */
export function SecureDesign() {
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Secure by Design</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We prioritize security and privacy in every aspect of our platform.
          </p>
        </div>

        {/* Security Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {/* Feature 1: Wallet Connection Required */}
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-teal-600" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Wallet Connection Required</h3>
            <p className="text-gray-600 text-sm">
              Wallet connection required to access personalized features and ensure secure access.
            </p>
          </div>

          {/* Feature 2: Read-only Access */}
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <Search className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Read-only Access</h3>
            <p className="text-gray-600 text-sm">
              We never move your funds. Our platform provides read-only access to blockchain data.
            </p>
          </div>

          {/* Feature 3: Built for Solana Speed */}
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mx-auto mb-4">
              <Zap className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Built for Solana Speed</h3>
            <p className="text-gray-600 text-sm">
              Our platform is optimized for Solana's high-speed blockchain, providing real-time insights.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}