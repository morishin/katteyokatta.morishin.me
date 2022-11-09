import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { User } from "@prisma/client";
import NextAuth, { NextAuthOptions } from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";
import { prisma } from "~/lib/server/prisma";
import { env } from "../../../lib/server/env";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    TwitterProvider({
      clientId: env("TWITTER_CLIENT_ID"),
      clientSecret: env("TWITTER_CLIENT_SECRET"),
      version: "2.0",
      profile: ({ data }) => {
        return {
          id: data.id,
          name: data.username,
          // NOTE: E-mail is currently unsupported by OAuth 2 Twitter.
          email: null,
          image: data.profile_image_url?.replace(
            /_normal\.(jpg|png|gif)$/,
            ".$1"
          ),
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      const dbUser = user as any as User;
      const newSession = {
        user: {
          id: dbUser.id,
          name: dbUser.name ?? "",
          image: dbUser.image ?? null,
          associateTag: dbUser.associateTag ?? null,
        },
        expires: session.expires,
      };
      return newSession;
    },
    async signIn({ account, profile }) {
      if (account === null || profile === undefined)
        return "Unexpected error: account/profiles is null";
      const existingAccount = await prisma.account.findUnique({
        where: {
          provider_providerAccountId: {
            provider: account.provider,
            providerAccountId: account.providerAccountId,
          },
        },
      });
      if (existingAccount) {
        await prisma.user.update({
          where: { id: existingAccount.userId },
          data: {
            name: (profile as any).data?.username,
            image: (profile as any).data?.profile_image_url?.replace(
              /_normal\.(jpg|png|gif)$/,
              ".$1"
            ),
          },
        });
      }
      return true;
    },
  },
};

export default NextAuth(authOptions);
