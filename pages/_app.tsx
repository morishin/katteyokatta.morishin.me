import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { withTRPC } from "@trpc/next";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import type { AppRouter } from "~/lib/server/trpc/routers/app";
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
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/trpc`
      : "http://localhost:3000/api/trpc";
    return {
      url,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: true,
})(MyApp);
