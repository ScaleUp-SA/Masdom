import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "../lib/prismaClient";
import { compare } from "bcryptjs";
import type { Adapter } from "next-auth/adapters";

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers

  adapter: PrismaAdapter(prisma) as Adapter,

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@mail.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null;

        const exisitingUser = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!exisitingUser) return null;

        const passwordMatch = await compare(
          credentials.password,
          exisitingUser.password
        );

        if (!passwordMatch) return null;

        return {
          id: exisitingUser.id,
          username: exisitingUser.username,
          email: exisitingUser.email,
          isAdmin: exisitingUser.isAdmin,
          phoneNumber: exisitingUser.phoneNumber,
        };
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      if (user) {
        return {
          ...token,
          username: user.username,
          isAdmin: user.isAdmin,
          id: user.id,
          email: user.email,
        };
      }

      return token;
    },
    async session({ session, user, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          username: token.username,
          isAdmin: token.isAdmin,
          id: token.id,
          email: token.email,
        },
      };
    },
  },
};
