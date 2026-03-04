import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";

function getAllowedEmails(): Set<string> | null {
  const raw = process.env.ALLOWED_EMAILS;
  if (!raw) return null; // No allowlist = block everyone except existing DB users
  return new Set(raw.split(",").map((e) => e.trim().toLowerCase()));
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async signIn({ user }) {
      const email = user.email?.toLowerCase();
      if (!email) return false;

      // Check if user already exists in DB (always allowed)
      const existingUser = await db.user.findUnique({ where: { email } });
      if (existingUser) return true;

      // For new users, check the allowlist
      const allowed = getAllowedEmails();
      if (!allowed) return false; // No allowlist configured = no new signups
      return allowed.has(email);
    },
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
        const dbUser = await db.user.findUnique({
          where: { id: user.id },
          select: { role: true },
        });
        if (dbUser) {
          token.role = dbUser.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});
