"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { truncateAddress } from "@/lib/utils"
import { MoreHorizontal, Bell, BellOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type Follower = {
  id: string
  wallet_address: string
  created_at: string
  last_active: string
  notification_preferences: {
    email: boolean
    push: boolean
    transaction_alerts: boolean
  }
}

export const columns: ColumnDef<Follower>[] = [
  {
    accessorKey: "wallet_address",
    header: "Wallet Address",
    cell: ({ row }) => {
      const address = row.getValue("wallet_address") as string
      return <div className="font-medium">{truncateAddress(address)}</div>
    },
  },
  {
    accessorKey: "created_at",
    header: "Joined",
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at") as string)
      return <div>{formatDistanceToNow(date, { addSuffix: true })}</div>
    },
  },
  {
    accessorKey: "last_active",
    header: "Last Active",
    cell: ({ row }) => {
      const date = new Date(row.getValue("last_active") as string)
      return <div>{formatDistanceToNow(date, { addSuffix: true })}</div>
    },
  },
  {
    accessorKey: "notification_preferences",
    header: "Notifications",
    cell: ({ row }) => {
      const preferences = row.getValue("notification_preferences") as Follower["notification_preferences"]
      const hasNotifications = preferences.email || preferences.push || preferences.transaction_alerts

      return (
        <Badge variant={hasNotifications ? "default" : "outline"}>
          {hasNotifications ? <Bell className="h-3 w-3 mr-1" /> : <BellOff className="h-3 w-3 mr-1" />}
          {hasNotifications ? "Enabled" : "Disabled"}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const follower = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(follower.wallet_address)}>
              Copy wallet address
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Send notification</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
