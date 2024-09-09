import React from 'react'
import { SessionProvider } from "next-auth/react"

export function DemoAuthProvider({ children }: { children: React.ReactNode }) {
  const demoSession = {
    user: { id: "1", name: "Demo User", email: "demo@example.com" },
    expires: "2099-12-31T23:59:59.999Z"
  }

  return (
    <SessionProvider session={demoSession}>
      {children}
    </SessionProvider>
  )
}