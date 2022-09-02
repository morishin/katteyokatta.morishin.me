import { Buffer } from "buffer";
import {
  PageArgs,
  PostConnection,
  Resolvers,
} from "~/lib/server/generated/resolvers";
import { prisma } from "~/lib/server/prisma";

export const resolvers: Resolvers = {
  Query: {
    posts: async (_parent, args, _context, _info) => getPosts(args.page),
  },
};

const encodeCursor = (value: number | string): string =>
  Buffer.from(value.toString()).toString("base64");
const decodeCursor = (value: string): string =>
  Buffer.from(value, "base64").toString();
const DEFAULT_PER_PAGE = 20;

const getPosts = async (page: PageArgs): Promise<PostConnection> => {
  let cursorId: number | null;
  let take: number;
  if (page.before) {
    cursorId = Number(decodeCursor(page.before));
    take = -(page.last || DEFAULT_PER_PAGE);
  } else if (page.after) {
    cursorId = Number(decodeCursor(page.after));
    take = page.first || DEFAULT_PER_PAGE;
  } else {
    cursorId = null;
    take = DEFAULT_PER_PAGE;
  }
  const posts = await prisma.post.findMany({
    take,
    cursor: cursorId
      ? {
          id: cursorId,
        }
      : undefined,
    orderBy: {
      id: page.before ? "desc" : "asc",
    },
    include: {
      user: true,
      item: true,
    },
  });
  const startCursor = encodeCursor(
    page.before ? posts.slice(-1)[0].id : posts[0].id
  );
  const endCursor = encodeCursor(
    page.before ? posts[0].id : posts.slice(-1)[0].id
  );
  const hasNextPage = page.before ? true : posts.length === take;
  const hasPreviousPage = page.before ? posts.length === take : true;
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
