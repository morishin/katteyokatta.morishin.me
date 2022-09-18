import * as trpc from "@trpc/server";
import superjson from "superjson";
import { amazonItemRouter } from "~/lib/server/trpc/routers/amazonItem";
import { postRouter } from "~/lib/server/trpc/routers/post";

export const appRouter = trpc
  .router()
  /**
   * Add data transformers
   * @link https://trpc.io/docs/data-transformers
   */
  .transformer(superjson)
  /**
   * Add a health check endpoint to be called with `/api/trpc/healthz`
   */
  .query("healthz", {
    async resolve() {
      return "yay!";
    },
  })
  .merge("post.", postRouter)
  .merge("amazonItem.", amazonItemRouter);

export type AppRouter = typeof appRouter;
