'use client'

import React from 'react'
import { SessionProvider } from "next-auth/react"

export default function ClientAuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider session={{
      user: { id: "1", name: "Demo User", email: "demo@example.com" },
      expires: "2099-12-31T23:59:59.999Z"
    }}>
      {children}
    </SessionProvider>
  )
}