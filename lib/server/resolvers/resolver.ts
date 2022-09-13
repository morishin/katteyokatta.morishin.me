import * as amazon from "amazon-paapi";
import { GraphQLScalarType, Kind } from "graphql";
import { env } from "~/lib/server/env";
import {
  AmazonItemConnection,
  PageArgs,
  PostConnection,
  Resolvers,
} from "~/lib/server/generated/resolvers";
import { prisma } from "~/lib/server/prisma";
import { decodeCursor, encodeCursor } from "../cursor";

export const resolvers: Resolvers = {
  Query: {
    posts: async (_parent, args, _context, _info) => {
      if (args.userName) {
        return getPosts(args.page, { userName: args.userName });
      } else {
        return getPosts(args.page);
      }
    },
    amazonItems: async (_parent, args, _context, _info) =>
      searchAmazonItems(args.searchArgs),
  },
  ISO8601DateTime: new GraphQLScalarType<Date, string>({
    name: "ISO8601DateTime",
    description: "ISO8601DateTime",
    serialize(data) {
      if (!(data instanceof Date)) {
        throw new Error(
          "ISO8601DateTime scalar can only serialize Date objects"
        );
      }
      return data.toISOString();
    },
    parseValue(data) {
      if (typeof data === "string") {
        const date = new Date(data);
        if (date.toString() !== "Invalid Date") {
          return date;
        }
      }
      throw new Error(
        "ISO8601DateTime scalar can only parse valid format strings"
      );
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return new Date(ast.value);
      }
      throw new Error("Invalid ISO8601DateTime");
    },
  }),
};

const DEFAULT_PER_PAGE = 20;

const getPosts = async (
  page: PageArgs,
  option?: { userName?: string }
): Promise<PostConnection> => {
  let cursorId: number | null;
  let take: number;
  const decsending = page.before || page.last ? true : false;
  if (decsending) {
    cursorId = (page.before && Number(decodeCursor(page.before))) || null;
    take = page.last || DEFAULT_PER_PAGE;
  } else {
    cursorId = (page.after && Number(decodeCursor(page.after))) || null;
    take = page.first || DEFAULT_PER_PAGE;
  }

  const user = option?.userName
    ? await prisma.user.findFirst({
        where: {
          name: option?.userName,
        },
      })
    : null;

  const posts = await prisma.post.findMany({
    take,
    skip: 1, // cusor is not included
    cursor: cursorId
      ? {
          id: cursorId,
        }
      : undefined,
    where: {
      userId: user?.id,
    },
    orderBy: {
      id: decsending ? "desc" : "asc",
    },
    include: {
      user: true,
      item: true,
    },
  });
  const startCursor = encodeCursor(
    decsending ? posts.slice(-1)[0].id : posts[0].id
  );
  const endCursor = encodeCursor(
    decsending ? posts[0].id : posts.slice(-1)[0].id
  );
  const hasNextPage = decsending ? true : posts.length === take;
  const hasPreviousPage = decsending ? posts.length === take : true;
  return {
    edges: posts.map((post) => ({
      node: post,
      cursor: encodeCursor(post.id.toString()),
    })),
    pageInfo: {
      startCursor,
      endCursor,
      hasNextPage,
      hasPreviousPage,
    },
  };
};

const searchAmazonItems = async ({
  after,
  first,
  query,
}: {
  after?: PageArgs["after"];
  first?: PageArgs["first"];
  query: string;
}): Promise<AmazonItemConnection> => {
  const nextPageNumber = after ? Number(decodeCursor(after)) + 1 : null;
  const perPage = first || 10; // 10 is max value https://webservices.amazon.com/paapi5/documentation/search-items.html

  const metadata = {
    AccessKey: env("AMAZON_API_ACCESS_KEY"),
    SecretKey: env("AMAZON_API_SECRET_KEY"),
    PartnerTag: env("AMAZON_API_PARTNER_TAG"),
    PartnerType: "Associates" as const,
    Marketplace: "www.amazon.co.jp" as const,
  };

  const res = await amazon.SearchItems(metadata, {
    Keywords: query,
    SearchIndex: "All",
    Resources: [
      "ItemInfo.Title",
      "Images.Primary.Large",
      "Offers.Listings.Price",
    ],
    ItemCount: perPage,
    ItemPage: nextPageNumber ?? undefined,
  });
  if (res.Errors) throw new Error(res.Errors[0].Message);

  const amazonItems = res.SearchResult.Items.map((rawItem) => ({
    asin: rawItem.ASIN,
    name: rawItem.ItemInfo.Title?.DisplayValue ?? "",
    image: rawItem.Images.Primary?.Large?.URL ?? null,
    amazonUrl: rawItem.DetailPageURL,
    price: rawItem.Offers.Listings?.[0].Price?.Amount.toString() ?? "",
  }));

  const cursor = encodeCursor(nextPageNumber ?? 1);
  return {
    edges: amazonItems.map((item) => ({
      node: item,
      cursor,
    })),
    pageInfo: {
      startCursor: cursor,
      endCursor: cursor,
      hasNextPage: amazonItems.length === perPage,
      hasPreviousPage: false,
    },
  };
};
