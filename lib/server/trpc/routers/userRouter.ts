import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "~/lib/server/prisma";
import { loggedProcedure, trpc } from "~/lib/server/trpc/trpc";
import { revalidator } from "../../revalidator";

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
  updateAssociateTag: loggedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user.id;
      if (userId === undefined) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const associateTag = input.length === 0 ? null : input;
      const user = await prisma.user.update({
        select: defaultUserSelect,
        where: { id: userId },
        data: { associateTag },
      });

      if (ctx.res) {
        await revalidator.onUpdateUserAssociateTag(ctx.res, user.name);
      }

      return user;
    }),
});
