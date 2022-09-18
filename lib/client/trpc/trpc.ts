import { createReactQueryHooks } from "@trpc/react";
import { AppRouter } from "~/lib/server/trpc/routers/_app";

export const trpc = createReactQueryHooks<AppRouter>();
