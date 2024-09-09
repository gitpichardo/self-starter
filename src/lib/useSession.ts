// src/lib/useSession.ts

'use client'

import { useSession as useNextAuthSession } from "next-auth/react"

export function useSession() {
  const { data, status } = useNextAuthSession()

  // If the real session is loaded, use it; otherwise, use the demo session
  if (status === "authenticated" && data) {
    return { data, status }
  }

  // Return demo session
  return {
    data: {
      user: { id: "1", name: "Demo User", email: "demo@example.com" },
      expires: "2099-12-31T23:59:59.999Z"
    },
    status: "authenticated"
  }
}