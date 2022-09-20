import { httpBatchLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import superjson from "superjson";
import type { AppRouter } from "~/lib/server/trpc/routers/appRouter";

function getBaseUrl() {
  if (typeof window !== "undefined")
    // browser should use relative path
    return "";
  if (process.env.VERCEL_URL)
    // reference for vercel.com
    return `https://${process.env.VERCEL_URL}`;
  if (process.env.RENDER_INTERNAL_HOSTNAME)
    // reference for render.com
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;
  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const trpcNext = createTRPCNext<AppRouter>({
  config({ ctx }) {
    if (typeof window !== "undefined") {
      // during client requests
      return {
        transformer: superjson, // optional - adds superjson serialization
        links: [
          httpBatchLink({
            url: "/api/trpc",
          }),
        ],
      };
    }
    // during SSR below
    // optional: use SSG-caching for each rendered page (see caching section for more details)
    // const ONE_DAY_SECONDS = 60 * 60 * 24;
    // ctx?.res?.setHeader(
    //   'Cache-Control',
    //   `s-maxage=1, stale-while-revalidate=${ONE_DAY_SECONDS}`,
    // );

    return {
      transformer: superjson, // optional - adds superjson serialization
      links: [
        httpBatchLink({
          /**
           * If you want to use SSR, you need to use the server's full URL
           * @link https://trpc.io/docs/ssr
           **/
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
      /**
       * Set custom request headers on every request from tRPC
       * @link http://localhost:3000/docs/v10/header
       * @link http://localhost:3000/docs/v10/ssr
       */
      headers() {
        if (ctx?.req) {
          // To use SSR properly, you need to forward the client's headers to the server
          // This is so you can pass through things like cookies when we're server-side rendering
          // If you're using Node 18, omit the "connection" header
          const { connection: _connection, ...headers } = ctx.req.headers;
          return {
            ...headers,
            // Optional: inform server that it's an SSR request
            "x-ssr": "1",
          };
        }
        return {};
      },
    };
  },
  ssr: false,
});
