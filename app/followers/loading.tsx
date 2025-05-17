import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Followers</h1>
      <Skeleton className="h-6 w-96 mb-8" />

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Follower Statistics</CardTitle>
          <CardDescription>Overview of your follower base</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-4 w-32" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-16" />
                  </CardContent>
                </Card>
              ))}
          </div>
        </CardContent>
      </Card>

      <div className="rounded-md border">
        <div className="h-16 border-b px-4 flex items-center">
          <Skeleton className="h-4 w-full max-w-[300px]" />
        </div>
        <div className="p-4">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex items-center justify-between py-4 border-b last:border-0">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-6 w-24" />
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
