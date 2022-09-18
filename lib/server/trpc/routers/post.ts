import { Prisma } from "@prisma/client";
import * as trpc from "@trpc/server";
import { z } from "zod";
import { decodeCursor, encodeCursor } from "~/lib/server/cursor";
import { prisma } from "~/lib/server/prisma";

const defaultPostSelect = Prisma.validator<Prisma.PostSelect>()({
  id: true,
  comment: true,
  createdAt: true,
  user: {
    select: {
      id: true,
      name: true,
      image: true,
      associateTag: true,
    },
  },
  item: {
    select: {
      id: true,
      asin: true,
      name: true,
      image: true,
    },
  },
});

const DEFAULT_PER_PAGE = 20;

export const postRouter = trpc.router().query("latest", {
  input: z.object({
    cursor: z.string().nullish(),
    limit: z.number().min(1).max(100).nullish(),
    userName: z.string().nullish(),
  }),
  async resolve({ input }) {
    const cursorId =
      (input.cursor && Number(decodeCursor(input.cursor, "post"))) || null;
    const limit = input.limit || DEFAULT_PER_PAGE;

    const user = input.userName
      ? await prisma.user.findFirst({
          where: {
            name: input.userName,
          },
        })
      : null;

    const posts = await prisma.post.findMany({
      select: defaultPostSelect,
      take: limit + 1, // get an extra item at the end which we'll use as next cursor
      cursor: cursorId
        ? {
            id: cursorId,
          }
        : undefined,
      where: {
        userId: user?.id,
      },
      orderBy: {
        id: "desc",
      },
    });

    let nextCursor: string | null = null;
    if (posts.length > limit) {
      const nextItem = posts.pop();
      nextCursor = nextItem?.id
        ? encodeCursor(nextItem.id.toString(), "post")
        : null;
    }

    return {
      posts,
      nextCursor,
    };
  },
});
