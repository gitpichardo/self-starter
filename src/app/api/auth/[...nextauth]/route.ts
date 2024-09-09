// src/app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Demo",
      credentials: {},
      authorize: async () => {
        // Always return a demo user
        return { id: "1", name: "Demo User", email: "demo@example.com" };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  /*
  pages: {
    signIn: "/auth/signin",
  },
  */
});

export { handler as GET, handler as POST };