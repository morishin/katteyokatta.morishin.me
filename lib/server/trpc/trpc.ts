import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { pinoLogger } from "~/lib/server/pinoLogger";
import { TrpcContext } from "~/lib/server/trpc/context";

export const trpc = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
});

const logger = trpc.middleware(async ({ next, ctx }) => {
  if (ctx.req && ctx.res) {
    pinoLogger(ctx.req, ctx.res);
  }
  return next();
});

export const loggedProcedure = trpc.procedure.use(logger);
