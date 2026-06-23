import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { credentialsSchema } from "@/lib/validations/auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const normalizedEmail = parsed.data.email.trim().toLowerCase();

        const user = await prisma.user.findUnique({
          where: { email: normalizedEmail },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        const isPasswordValid = await compare(parsed.data.password, user.passwordHash);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          username: user.username,
          bio: user.bio,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.sub = user.id;
        token.username = user.username;
        token.bio = user.bio;
        token.email = user.email;
        token.picture = user.image;
      }

      if (trigger === "update" && session) {
        const updatedSession = session as {
          name?: string | null;
          username?: string | null;
          bio?: string | null;
          image?: string | null;
        };

        token.name = updatedSession.name ?? token.name;
        token.username = updatedSession.username ?? token.username;
        token.bio = updatedSession.bio ?? token.bio;
        token.picture = updatedSession.image ?? token.picture;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.username = (token.username as string | null | undefined) ?? null;
        session.user.bio = (token.bio as string | null | undefined) ?? null;
        session.user.email = (token.email as string | null | undefined) ?? null;
        session.user.image = (token.picture as string | null | undefined) ?? null;
      }

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
