import { WhaleProfileSkeleton } from "@/components/whale/whale-profile-skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 sm:py-12">
        <WhaleProfileSkeleton />
      </div>
    </div>
  )
}
