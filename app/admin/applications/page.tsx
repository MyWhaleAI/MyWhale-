import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Clock } from "lucide-react"
import Link from "next/link"
import { truncateAddress } from "@/lib/utils"

export default async function WhaleApplicationsPage() {
  const supabase = createClient()

  // Fetch applications
  const { data: applications, error } = await supabase
    .from("whale_applications")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching applications:", error)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Whale Applications</h1>
          <Link href="/">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications?.map((app) => (
            <Card key={app.id} className="overflow-hidden">
              <CardHeader
                className={`
                ${app.status === "approved" ? "bg-green-50" : app.status === "rejected" ? "bg-red-50" : "bg-blue-50"}
              `}
              >
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{app.display_name}</CardTitle>
                  <div
                    className={`
                    flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                    ${
                      app.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : app.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                    }
                  `}
                  >
                    {app.status === "approved" ? (
                      <>
                        <CheckCircle className="h-3 w-3" /> Approved
                      </>
                    ) : app.status === "rejected" ? (
                      <>
                        <XCircle className="h-3 w-3" /> Rejected
                      </>
                    ) : (
                      <>
                        <Clock className="h-3 w-3" /> Pending
                      </>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-500">{truncateAddress(app.wallet_address, 8, 8)}</p>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Strategies</h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {Object.entries(app.strategies || {}).map(([key, value]) =>
                        value ? (
                          <span key={key} className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </span>
                        ) : null,
                      )}
                    </div>
                  </div>

                  {app.bio && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Bio</h3>
                      <p className="text-sm text-gray-600 mt-1">{app.bio}</p>
                    </div>
                  )}

                  <div className="flex justify-between pt-3">
                    <span className="text-xs text-gray-500">
                      Applied {new Date(app.created_at).toLocaleDateString()}
                    </span>

                    {app.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs px-2 text-red-600 hover:text-red-700"
                        >
                          Reject
                        </Button>
                        <Button size="sm" className="h-7 text-xs px-2 bg-teal-500 hover:bg-teal-600">
                          Approve
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {(!applications || applications.length === 0) && (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No applications found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
