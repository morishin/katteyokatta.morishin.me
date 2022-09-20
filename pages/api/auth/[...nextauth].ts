import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import NextAuth, { NextAuthOptions } from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";
import { env } from "../../../lib/server/env";

const prisma = new PrismaClient();

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
    async signIn({ account, profile }) {
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
            name: (profile.data as any).username,
            image: (profile.data as any).profile_image_url?.replace(
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
