import { Prisma } from "@prisma/client";
import { z } from "zod";
import { decodeCursor, encodeCursor } from "~/lib/server/cursor";
import { prisma } from "~/lib/server/prisma";
import { trpc } from "~/lib/server/trpc/trpc";

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

export const postRouter = trpc.router({
  latest: trpc.procedure
    .input(
      z.object({
        cursor: z.string().nullish(),
        limit: z.number().min(1).max(100).nullish(),
        userName: z.string().nullish(),
      })
    )
    .query(async ({ input }) => {
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
    }),
  add: trpc.procedure
    .input(
      z.object({
        asin: z.string(),
        comment: z.string().max(1000, "1000文字以内で入力してください"),
      })
    )
    .mutation(({ input, ctx }) => {}),
});
