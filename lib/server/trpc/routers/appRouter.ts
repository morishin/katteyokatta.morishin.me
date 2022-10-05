import { amazonItemRouter } from "~/lib/server/trpc/routers/amazonItemRouter";
import { itemRouter } from "~/lib/server/trpc/routers/itemRouter";
import { postRouter } from "~/lib/server/trpc/routers/postRouter";
import { userRouter } from "~/lib/server/trpc/routers/userRouter";
import { trpc } from "~/lib/server/trpc/trpc";

export const appRouter = trpc.router({
  post: postRouter,
  item: itemRouter,
  amazonItem: amazonItemRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
