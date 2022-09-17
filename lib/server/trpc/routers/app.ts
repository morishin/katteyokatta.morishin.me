import * as trpc from "@trpc/server";
import { z } from "zod";

export const appRouter = trpc
  .router()
  // Create procedure at path 'hello'
  .query("hello", {
    // using zod schema to validate and infer input values
    input: z
      .object({
        text: z.string().nullish(),
      })
      .nullish(),
    resolve({ input }) {
      return {
        greeting: `hello ${input?.text ?? "world"}`,
      };
    },
  });

export type AppRouter = typeof appRouter;
