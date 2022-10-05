import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "~/lib/server/prisma";
import { trpc } from "~/lib/server/trpc/trpc";

const defaultUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  associateTag: true,
  image: true,
  name: true,
});

export const userRouter = trpc.router({
  single: trpc.procedure
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
});
