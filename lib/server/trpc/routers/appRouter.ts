import { amazonItemRouter } from "~/lib/server/trpc/routers/amazonItemRouter";
import { postRouter } from "~/lib/server/trpc/routers/postRouter";
import { trpc } from "~/lib/server/trpc/trpc";
import { itemRouter } from "./itemRouter";

export const appRouter = trpc.router({
  post: postRouter,
  item: itemRouter,
  amazonItem: amazonItemRouter,
});

export type AppRouter = typeof appRouter;
