import { GraphQLScalarType, Kind } from "graphql";
import {
  PageArgs,
  PostConnection,
  Resolvers,
} from "~/lib/server/generated/resolvers";
import { prisma } from "~/lib/server/prisma";
import { decodeCursor, encodeCursor } from "../cursor";

export const resolvers: Resolvers = {
  Query: {
    posts: async (_parent, args, _context, _info) => {
      if (args.userId) {
        return getPosts(args.page, { userId: args.userId });
      } else {
        return getPosts(args.page);
      }
    },
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
  option?: { userId?: number }
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
  const posts = await prisma.post.findMany({
    take,
    skip: 1, // cusor is not included
    cursor: cursorId
      ? {
          id: cursorId,
        }
      : undefined,
    where: {
      userId: option?.userId,
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
