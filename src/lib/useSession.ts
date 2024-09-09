import { useSession as useNextAuthSession } from "next-auth/react"

export function useSession() {
  const { data, status, ...rest } = useNextAuthSession()

  // Always return an authenticated session for demo
  return {
    data: {
      user: { id: "1", name: "Demo User", email: "demo@example.com" },
      expires: "2099-12-31T23:59:59.999Z"
    },
    status: "authenticated",
    ...rest
  }
}