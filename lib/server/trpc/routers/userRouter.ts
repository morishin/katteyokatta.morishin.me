import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "~/lib/server/prisma";
import { loggedProcedure, trpc } from "~/lib/server/trpc/trpc";

const defaultUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  associateTag: true,
  image: true,
  name: true,
});

export const userRouter = trpc.router({
  single: loggedProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .query(async ({ input }) =>
      prisma.user.findFirst({
        where: {
          name: input.name,
        },
        select: defaultUserSelect,
      })
    ),
  _updateAssociateTag: loggedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user.id;
      if (userId === undefined) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const associateTag = input.length === 0 ? null : input;
      return prisma.user.update({
        select: defaultUserSelect,
        where: { id: userId },
        data: { associateTag },
      });
    }),
  get updateAssociateTag() {
    return this._updateAssociateTag;
  },
  set updateAssociateTag(value) {
    this._updateAssociateTag = value;
  },
});
