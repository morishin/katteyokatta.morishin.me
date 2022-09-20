import { amazonItemRouter } from "~/lib/server/trpc/routers/amazonItem";
import { postRouter } from "~/lib/server/trpc/routers/post";
import { trpc } from "~/lib/server/trpc/trpc";

export const appRouter = trpc.router({
  post: postRouter,
  amazonItem: amazonItemRouter,
});

export type AppRouter = typeof appRouter;
