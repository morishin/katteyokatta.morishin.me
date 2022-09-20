import { Prisma } from "@prisma/client";
import { z } from "zod";
import { decodeCursor, encodeCursor } from "~/lib/server/cursor";
import { prisma } from "~/lib/server/prisma";
import { trpc } from "~/lib/server/trpc/trpc";

const DEFAULT_PER_PAGE = 20;

const defaultItemSelect = Prisma.validator<Prisma.ItemSelect>()({
  id: true,
  asin: true,
  name: true,
  image: true,
  posts: {
    select: {
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
    },
  },
});

export const itemRouter = trpc.router({
  single: trpc.procedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ input }) =>
      prisma.item.findUnique({
        where: { id: input.id },
        select: defaultItemSelect,
      })
    ),
  search: trpc.procedure
    .input(
      z.object({
        cursor: z.string().nullish(),
        limit: z.number().min(1).max(100).nullish(),
        keyword: z.string(),
      })
    )
    .query(async ({ input }) => {
      const cursorId =
        (input.cursor && Number(decodeCursor(input.cursor, "items"))) || null;
      const limit = input.limit || DEFAULT_PER_PAGE;

      const items = await prisma.item.findMany({
        select: defaultItemSelect,
        take: limit + 1, // get an extra item at the end which we'll use as next cursor
        cursor: cursorId
          ? {
              id: cursorId,
            }
          : undefined,
        where: {
          name: {
            contains: input.keyword,
          },
        },
        orderBy: {
          id: "desc",
        },
      });

      let nextCursor: string | null = null;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem?.id
          ? encodeCursor(nextItem.id.toString(), "items")
          : null;
      }

      return {
        items,
        nextCursor,
      };
    }),
});
