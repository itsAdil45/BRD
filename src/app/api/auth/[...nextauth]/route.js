import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        remember_me: { label: "Remember Me", type: "text" },
      },
      async authorize(credentials) {
        const res = await fetch(
          "https://car-auctions.xeriotech.com/api/login",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
              remember_me: credentials?.remember_me === "true",
            }),
          },
        );

        const result = await res.json();

        if (result.status && result.data?.user) {
          return {
            id: result.data.user.id,
            name: result.data.user.name,
            email: result.data.user.email,
            backoffice_access: result.data.user.backoffice_access,

            token: result.data.token,
            expires_at: result.data.expires_at,
          };
        }

        return null;
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.backoffice_access = user.backoffice_access;
        token.token = user.token;
        token.expires_at = user.expires_at;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.backoffice_access = token.backoffice_access;
      session.user.token = token.token;
      session.user.expires_at = token.expires_at;
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
