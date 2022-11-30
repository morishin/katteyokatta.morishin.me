import { TwitterApi } from "twitter-api-v2";

export const tweet = async (text: string) => {
  const tokens = {
    appKey: process.env.TWITTER_CONSUMER_KEY,
    appSecret: process.env.TWITTER_CONSUMER_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET,
  };
  if (Object.values(tokens).some((value) => value === undefined)) {
    throw new Error("Missing Twitter tokens");
  }
  const twitterClient = new TwitterApi(tokens as any);
  return await twitterClient.v2.tweet(text);
};
