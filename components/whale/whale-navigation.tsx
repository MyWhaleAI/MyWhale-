"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useWallet } from "@solana/wallet-adapter-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export function WhaleNavigation() {
  const { publicKey } = useWallet()
  const [isWhale, setIsWhale] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkWhaleStatus() {
      if (!publicKey) {
        setIsWhale(false)
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const supabase = createClientComponentClient()
        const { data, error } = await supabase
          .from("whale_applications")
          .select("status")
          .eq("wallet_address", publicKey.toString())
          .eq("status", "approved")
          .single()

        if (error) {
          console.error("Error checking whale status:", error)
          setIsWhale(false)
        } else {
          setIsWhale(data !== null)
        }
      } catch (err) {
        console.error("Failed to check whale status:", err)
        setIsWhale(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkWhaleStatus()
  }, [publicKey])

  if (isLoading || !isWhale) return null

  return (
    <>
      <Link href="/whale/dashboard" className="text-teal-600 hover:text-teal-700 text-sm font-medium">
        Whale Dashboard
      </Link>
      <Link href={`/whale/${publicKey?.toString()}`} className="text-teal-600 hover:text-teal-700 text-sm font-medium">
        My Profile
      </Link>
    </>
  )
}
