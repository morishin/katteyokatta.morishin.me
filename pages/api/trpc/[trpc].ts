import * as trpcNext from "@trpc/server/adapters/next";
import { createContext } from "~/lib/server/trpc/context";
import { appRouter } from "~/lib/server/trpc/routers/appRouter";

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
});
