import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/followers/data-table"
import { columns } from "@/components/followers/columns"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function FollowersPage() {
  const supabase = createClient()

  const { data: followers, error } = await supabase
    .from("followers")
    .select("*")
    .order("last_active", { ascending: false })

  if (error) {
    console.error("Error fetching followers:", error)
    return notFound()
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Followers</h1>
      <p className="text-muted-foreground mb-8">Manage and view users who are following whale activity.</p>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Follower Statistics</CardTitle>
          <CardDescription>Overview of your follower base</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Followers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{followers.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {
                    followers.filter((f) => {
                      const today = new Date()
                      const lastActive = new Date(f.last_active)
                      return today.toDateString() === lastActive.toDateString()
                    }).length
                  }
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">New This Week</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {
                    followers.filter((f) => {
                      const weekAgo = new Date()
                      weekAgo.setDate(weekAgo.getDate() - 7)
                      const createdAt = new Date(f.created_at)
                      return createdAt > weekAgo
                    }).length
                  }
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <DataTable columns={columns} data={followers} />
    </div>
  )
}
