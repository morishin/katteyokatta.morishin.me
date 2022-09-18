import * as trpc from "@trpc/server";
import superjson from "superjson";
import { postRouter } from "./post";

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
  .merge("post.", postRouter);

export type AppRouter = typeof appRouter;
