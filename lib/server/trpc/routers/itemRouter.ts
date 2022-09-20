import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "~/lib/server/prisma";
import { trpc } from "~/lib/server/trpc/trpc";

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
});
