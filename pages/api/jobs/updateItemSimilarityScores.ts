import { NextApiRequest, NextApiResponse } from "next";
import { updateItemSimilarityScores } from "~/lib/itemSimilarity/updateItemSimilarityScores";
import { env } from "~/lib/server/env";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { authorization } = req.headers;

      if (authorization === `Bearer ${env("KATTEYOKATTA_API_SECRET_KEY")}`) {
        await updateItemSimilarityScores();
        res.status(200).json({ success: true });
      } else {
        res.status(401).json({ success: false });
      }
    } catch (err) {
      res.status(500).json({ statusCode: 500, message: (err as any).message });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
