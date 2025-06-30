import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

/**
 * WhaleProfileSkeleton component provides a loading skeleton for a whale's profile page.
 * It displays animated gray placeholders for various sections of the profile,
 * including the header, main content area (e.g., activity feed), and sidebar (e.g., similar whales).
 *
 * @returns {JSX.Element} The rendered skeleton loading state for a whale profile.
 */
export function WhaleProfileSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Skeleton className="h-24 w-24 rounded-xl" /> {/* Avatar placeholder */}
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" /> {/* Name placeholder */}
                <Skeleton className="h-4 w-32" /> {/* Address placeholder */}
              </div>
              <Skeleton className="h-16 w-full max-w-md" /> {/* Bio placeholder */}
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8 rounded-full" /> {/* Social icon placeholder */}
                <Skeleton className="h-8 w-8 rounded-full" /> {/* Social icon placeholder */}
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <Skeleton className="h-10 w-28" /> {/* Follow button placeholder */}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Skeleton (e.g., for activity feed) */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" /> {/* Section title placeholder */}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <Skeleton className="h-10 w-10 rounded-lg" /> {/* Item icon/avatar placeholder */}
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-full" /> {/* Item title/action placeholder */}
                      <Skeleton className="h-4 w-3/4" /> {/* Item detail placeholder */}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" /> {/* Another section title placeholder */}
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" /> {/* Text line placeholder */}
                <Skeleton className="h-4 w-5/6" /> {/* Text line placeholder */}
                <Skeleton className="h-4 w-4/6" /> {/* Text line placeholder */}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Skeleton (e.g., for similar whales or performance metrics) */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-36" /> {/* Sidebar section title placeholder */}
            </CardHeader>
            <CardContent>
              <Skeleton className="h-40 w-full" /> {/* Chart or large content placeholder */}
              <div className="mt-4 grid grid-cols-2 gap-4">
                <Skeleton className="h-16 w-full" /> {/* Metric card placeholder */}
                <Skeleton className="h-16 w-full" /> {/* Metric card placeholder */}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" /> {/* Another sidebar section title placeholder */}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <Skeleton className="h-8 w-8 rounded-lg" /> {/* Item icon/avatar placeholder */}
                    <Skeleton className="h-4 w-24" /> {/* Item text placeholder */}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}