import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies } from "next/headers";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        remember_me: { label: "Remember Me", type: "text" },
        token: { label: "Token", type: "text" },
        user_json: { label: "User JSON", type: "text" },
      },

      async authorize(credentials) {
        // ── Pre-built token path (social / SSO flows) ──────────────────────
        if (credentials?.token && credentials?.user_json) {
          const user = JSON.parse(credentials.user_json);

          // Save reg_token cookie
          cookies().set("reg_token", credentials.token, {
            httpOnly: false, // needs to be readable by js-cookie on the client
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            sameSite: "lax",
          });

          return {
            id: user.id,
            name: user.full_name,
            email: user.email,
            backoffice_access: user.backoffice_access ?? false,
            email_verified: user.email_verified ?? false,
            token: credentials.token,
            expires_at: null,
          };
        }

        // ── Standard email / password login ───────────────────────────────
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
          const { token, user } = result.data;

          // Save reg_token cookie regardless of email_verified status
          cookies().set("reg_token", token, {
            httpOnly: false, // readable by js-cookie on the client
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            sameSite: "lax",
          });

          // Also store the email for the verify-email page
          // (sessionStorage isn't available server-side, handled client-side in AuthForm)

          return {
            id: user.id,
            name: user.full_name ?? user.name,
            email: user.email,
            backoffice_access: user.backoffice_access ?? false,
            email_verified: user.email_verified ?? false,
            token,
            expires_at: result.data.expires_at ?? null,
          };
        }

        return null;
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.backoffice_access = user.backoffice_access;
        token.email_verified = user.email_verified;
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
      session.user.email_verified = token.email_verified;
      session.user.token = token.token;
      session.user.expires_at = token.expires_at;
      return session;
    },
  },

  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
