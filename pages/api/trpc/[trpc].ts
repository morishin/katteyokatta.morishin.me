import * as trpcNext from "@trpc/server/adapters/next";
import { createContext } from "~/lib/server/trpc/context";
import { appRouter } from "~/lib/server/trpc/routers/_app";

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
});
