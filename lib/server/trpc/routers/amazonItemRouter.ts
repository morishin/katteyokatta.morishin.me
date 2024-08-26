import * as amazon from "amazon-paapi";
import { z } from "zod";
import { decodeCursor, encodeCursor } from "~/lib/server/cursor";
import { env } from "~/lib/server/env";
import { loggedProcedure, trpc } from "~/lib/server/trpc/trpc";

// 10 is max value https://webservices.amazon.com/paapi5/documentation/search-items.html
const DEFAULT_PER_PAGE = 9;

const AMAZON_URL_REGEX =
  /https?:\/\/(www\.)?amazon(\.co)?\.jp\/(.+\/)?((gp\/product\/)|(dp\/))(?<asin>[A-Z0-9]+).*/;

export const amazonItemRouter = trpc.router({
  search: loggedProcedure
    .input(
      z.object({
        cursor: z.string().nullish(),
        limit: z.number().min(1).max(9).nullish(),
        query: z.string(),
      })
    )
    .query(async ({ input }) => {
      const pageNumber = input.cursor
        ? Number(decodeCursor(input.cursor, "amazonItem"))
        : 1;
      const perPage = input.limit || DEFAULT_PER_PAGE;

      const metadata = {
        AccessKey: env("AMAZON_API_ACCESS_KEY"),
        SecretKey: env("AMAZON_API_SECRET_KEY"),
        PartnerTag: env("AMAZON_API_PARTNER_TAG"),
        PartnerType: "Associates" as const,
        Marketplace: "www.amazon.co.jp" as const,
      };

      // クエリが Amazon の商品 URL の場合は ASIN をクエリにする
      const asin = input.query.match(AMAZON_URL_REGEX)?.groups?.asin;

      let res: amazon.AmazonSearchItemsResponse;
      try {
        res = await amazon.SearchItems(metadata, {
          Keywords: asin ?? input.query,
          SearchIndex: "All",
          Resources: [
            "ItemInfo.Title",
            "Images.Primary.Large",
            "Offers.Listings.Price",
          ],
          ItemCount: perPage + 1, // get an extra item at the end which we'll use as next cursor
          ItemPage: pageNumber ?? undefined,
        });
      } catch (error: any) {
        if (Number(error.status) === 429) {
          return {
            amazonItems: [],
            nextCursor: null,
            error: { status: 429, message: "Rate limit exceeded" },
          };
        }
        throw error;
      }

      const amazonItems = res.SearchResult.Items.map((rawItem) => ({
        asin: rawItem.ASIN,
        name: rawItem.ItemInfo.Title?.DisplayValue ?? "",
        image: rawItem.Images.Primary?.Large?.URL ?? null,
        amazonUrl: rawItem.DetailPageURL,
        price: rawItem.Offers?.Listings?.[0].Price?.Amount.toString() ?? "",
      }));

      let nextCursor: string | null = null;
      if (amazonItems.length > perPage) {
        amazonItems.pop();
        nextCursor = encodeCursor(pageNumber + 1, "amazonItem");
      }

      return {
        amazonItems,
        nextCursor,
      };
    }),
});
