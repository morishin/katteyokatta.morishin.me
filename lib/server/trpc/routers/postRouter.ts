import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { decodeCursor, encodeCursor } from "~/lib/server/cursor";
import { prisma } from "~/lib/server/prisma";
import { trpc } from "~/lib/server/trpc/trpc";

const DEFAULT_PER_PAGE = 20;

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

      if (input.userName && !user) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

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
        item: z.object({
          asin: z.string(),
          name: z.string(),
          image: z.string().nullish(),
        }),
        comment: z.string().max(1000, "1000文字以内で入力してください"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session?.user.id;
      if (userId === undefined) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      let item = await prisma.item.findUnique({
        where: { asin: input.item.asin },
      });
      if (item === null) {
        item = await prisma.item.create({
          data: input.item,
        });
      }
      const newPost = await prisma.post.create({
        data: {
          userId,
          itemId: item.id,
          comment: input.comment,
        },
      });
      return {
        post: {
          id: newPost.id,
          item: {
            id: item.id,
          },
        },
      };
    }),
  update: trpc.procedure
    .input(
      z.object({
        id: z.number(),
        comment: z.string().max(1000, "1000文字以内で入力してください"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session?.user.id;
      if (userId === undefined) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const post = await prisma.post.update({
        where: {
          id: input.id,
        },
        data: {
          comment: input.comment,
        },
        select: defaultPostSelect,
      });
      return {
        post,
      };
    }),
  delete: trpc.procedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session?.user.id;
      if (userId === undefined) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      await prisma.post.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
