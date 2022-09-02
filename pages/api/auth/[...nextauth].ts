import NextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { env } from "../../../lib/server/env";

const prisma = new PrismaClient();

export default NextAuth({
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
          image: data.profile_image_url,
        };
      },
    }),
  ],
});
