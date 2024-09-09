import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {},
      authorize: async () => {
        return { id: "1", name: "Demo User", email: "demo@example.com" }
      }
    }),
  ],
  callbacks: {
    async session({ session }) {
      session.user = { id: "1", name: "Demo User", email: "demo@example.com" }
      return session
    },
  },
})

export { handler as GET, handler as POST }