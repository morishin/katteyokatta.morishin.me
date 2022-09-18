import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { withTRPC } from "@trpc/next";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import superjson from "superjson";
import type { AppRouter } from "~/lib/server/trpc/routers/_app";
import { Layout } from "../components/layouts/Layout";
import "../styles/globals.css";

const theme = extendTheme({
  styles: {
    global: {
      "html, body": {
        color: "gray.800",
      },
    },
  },
  semanticTokens: {
    colors: {
      primary: {
        default: "#F2676A",
        _dark: "#CC565A",
      },
      secondary: {
        default: "#46BAED",
        _dark: "#3DA2CF",
      },
    },
  },
});

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <SessionProvider session={session}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SessionProvider>
    </ChakraProvider>
  );
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    if (typeof window !== "undefined") {
      // during client requests
      return {
        transformer: superjson, // optional - adds superjson serialization
        url: "/api/trpc",
      };
    }

    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/trpc`
      : "http://localhost:3000/api/trpc";

    return {
      transformer: superjson, // optional - adds superjson serialization
      url,
      /**
       * Set custom request headers on every request from tRPC
       * @link http://localhost:3000/docs/v9/header
       * @link http://localhost:3000/docs/v9/ssr
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
  /**
   * @link https://trpc.io/docs/v9/ssr#q-can-i-use-getserversideprops-andor-getstaticprops-while-using-ssr
   */
  ssr: false,
})(MyApp);
